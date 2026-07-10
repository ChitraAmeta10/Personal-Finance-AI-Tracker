"""Categorization pipeline: rules first, LLM for the ambiguous remainder.

Every prediction — rule and LLM alike — is persisted to
categorization_results, regardless of which one decided the final category.
That audit trail powers the rule-vs-LLM comparison endpoints.

Degradation: if the LLM is unconfigured or a batch call fails, transactions
with a weak rule match fall back to that rule's category rather than staying
uncategorized; truly unmatched transactions remain uncategorized.
"""

import uuid
from dataclasses import dataclass
from typing import Protocol

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models import (
    CategorizationMethod,
    CategorizationResult,
    CategorizationSource,
    Category,
    Transaction,
    User,
)
from app.services.ai_telemetry import log_ai_event
from app.services.categorization.llm import LLMItem, LLMPrediction
from app.services.categorization.rules import RulePrediction, classify_rule


class TransactionClassifier(Protocol):
    """Anything that can classify a batch — Anthropic, OpenAI-compatible, or a test fake."""

    def classify(self, items: list[LLMItem], categories: list[str]) -> tuple[list[LLMPrediction], dict]: ...


@dataclass
class CategorizationSummary:
    total: int = 0
    rule_categorized: int = 0
    llm_categorized: int = 0
    still_uncategorized: int = 0
    llm_error: str | None = None


def load_category_map(db: Session, user: User) -> dict[str, int]:
    """name -> id for system categories plus the user's own."""
    rows = db.scalars(
        select(Category).where((Category.user_id.is_(None)) | (Category.user_id == user.id))
    )
    return {c.name: c.id for c in rows}


def run_categorization(
    db: Session,
    user: User,
    classifier: TransactionClassifier | None,
    account_id: uuid.UUID | None = None,
) -> CategorizationSummary:
    settings = get_settings()
    categories = load_category_map(db, user)
    summary = CategorizationSummary()

    query = select(Transaction).where(
        Transaction.user_id == user.id,
        Transaction.categorization_source == CategorizationSource.UNCATEGORIZED,
    )
    if account_id is not None:
        query = query.where(Transaction.account_id == account_id)
    transactions = list(db.scalars(query.order_by(Transaction.txn_date)))
    summary.total = len(transactions)

    ambiguous: list[tuple[Transaction, RulePrediction]] = []
    for txn in transactions:
        pred = classify_rule(txn.merchant_raw, txn.merchant_normalized, txn.description, txn.amount)
        db.add(
            CategorizationResult(
                transaction_id=txn.id,
                method=CategorizationMethod.RULE,
                predicted_category_id=categories.get(pred.category) if pred.category else None,
                confidence=pred.confidence,
                detail={"matched_keyword": pred.matched_keyword},
            )
        )
        if pred.category and pred.confidence >= settings.rule_confidence_threshold:
            txn.category_id = categories[pred.category]
            txn.categorization_source = CategorizationSource.RULE
            summary.rule_categorized += 1
        else:
            ambiguous.append((txn, pred))

    if classifier is not None and ambiguous:
        _classify_with_llm(db, classifier, ambiguous, categories, summary, user.id)
    else:
        if classifier is None and ambiguous:
            summary.llm_error = "LLM classifier not configured"
        _apply_rule_fallback(ambiguous, categories, summary)

    summary.still_uncategorized = (
        summary.total - summary.rule_categorized - summary.llm_categorized
    )
    db.commit()
    return summary


def _classify_with_llm(
    db: Session,
    classifier: TransactionClassifier,
    ambiguous: list[tuple[Transaction, RulePrediction]],
    categories: dict[str, int],
    summary: CategorizationSummary,
    user_id: uuid.UUID,
) -> None:
    batch_size = get_settings().llm_batch_size
    category_names = sorted(categories)
    for start in range(0, len(ambiguous), batch_size):
        chunk = ambiguous[start : start + batch_size]
        items = [
            LLMItem(
                index=i,
                txn_date=txn.txn_date.isoformat(),
                merchant=txn.merchant_normalized or txn.merchant_raw,
                description=txn.description,
                amount=txn.amount,
            )
            for i, (txn, _) in enumerate(chunk)
        ]
        try:
            predictions, meta = classifier.classify(items, category_names)
        except Exception as exc:  # LLM outage must not lose the upload's categorization run
            summary.llm_error = f"{type(exc).__name__}: {exc}"
            log_ai_event(
                "categorization_batch",
                user_id,
                {"status": "failed", "error": f"{type(exc).__name__}: {exc}", "batch_size": len(chunk)},
            )
            _apply_rule_fallback(chunk, categories, summary)
            continue

        log_ai_event(
            "categorization_batch",
            user_id,
            {
                "status": "ok",
                "model": meta.get("model"),
                "prompt_version": meta.get("prompt_version"),
                "batch_size": meta.get("batch_size"),
                "latency_ms": meta.get("latency_ms"),
            },
        )

        by_index = {p.index: p for p in predictions}
        for i, (txn, rule_pred) in enumerate(chunk):
            pred = by_index.get(i)
            if pred is None:
                _apply_rule_fallback([(txn, rule_pred)], categories, summary)
                continue
            db.add(
                CategorizationResult(
                    transaction_id=txn.id,
                    method=CategorizationMethod.LLM,
                    predicted_category_id=categories.get(pred.category) if pred.category else None,
                    confidence=pred.confidence,
                    detail={
                        "model": meta.get("model"),
                        "prompt_version": meta.get("prompt_version"),
                        "raw_category": pred.raw_category,
                        "batch_size": meta.get("batch_size"),
                    },
                    latency_ms=meta.get("latency_ms"),
                )
            )
            if pred.category:
                txn.category_id = categories[pred.category]
                txn.categorization_source = CategorizationSource.LLM
                summary.llm_categorized += 1
            else:
                _apply_rule_fallback([(txn, rule_pred)], categories, summary)


def _apply_rule_fallback(
    pairs: list[tuple[Transaction, RulePrediction]],
    categories: dict[str, int],
    summary: CategorizationSummary,
) -> None:
    """Best-effort: use a weak rule match rather than leaving it uncategorized."""
    for txn, pred in pairs:
        if pred.category and pred.confidence > 0:
            txn.category_id = categories[pred.category]
            txn.categorization_source = CategorizationSource.RULE
            summary.rule_categorized += 1
