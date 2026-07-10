import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import (
    CategorizationMethod,
    CategorizationResult,
    Category,
    Transaction,
    User,
)
from app.schemas.categorization import (
    CategorizationRunResult,
    CategoryRead,
    MethodComparisonStats,
)
from app.services.categorization.llm import LLMClassifier
from app.services.categorization.pipeline import TransactionClassifier, run_categorization
from app.services.openai_compat import OpenAICompatClassifier

router = APIRouter(prefix="/categorization", tags=["categorization"])
categories_router = APIRouter(prefix="/categories", tags=["categorization"])


def get_llm_classifier() -> TransactionClassifier | None:
    """Dependency: picks the configured provider; tests inject a fake;
    unconfigured environments degrade to rules-only."""
    settings = get_settings()
    if settings.llm_provider == "openai":
        # base_url alone is enough for keyless local providers (Ollama).
        if settings.openai_api_key or settings.openai_base_url:
            return OpenAICompatClassifier()
        return None
    if not settings.anthropic_api_key:
        return None
    return LLMClassifier()


@categories_router.get("", response_model=list[CategoryRead])
def list_categories(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Category]:
    return list(
        db.scalars(
            select(Category)
            .where((Category.user_id.is_(None)) | (Category.user_id == user.id))
            .order_by(Category.name)
        )
    )


@router.post("/run", response_model=CategorizationRunResult)
def run(
    account_id: uuid.UUID | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    classifier: LLMClassifier | None = Depends(get_llm_classifier),
) -> CategorizationRunResult:
    summary = run_categorization(db, user, classifier, account_id=account_id)
    return CategorizationRunResult(**summary.__dict__)


@router.get("/stats", response_model=MethodComparisonStats)
def stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MethodComparisonStats:
    by_source = dict(
        db.execute(
            select(Transaction.categorization_source, func.count())
            .where(Transaction.user_id == user.id)
            .group_by(Transaction.categorization_source)
        ).all()
    )
    by_source = {source.value: count for source, count in by_source.items()}

    # Rule-vs-LLM agreement: transactions where both methods made a prediction.
    results = db.execute(
        select(
            CategorizationResult.transaction_id,
            CategorizationResult.method,
            CategorizationResult.predicted_category_id,
        )
        .join(Transaction, Transaction.id == CategorizationResult.transaction_id)
        .where(Transaction.user_id == user.id)
        .order_by(CategorizationResult.created_at)
    ).all()

    latest: dict[uuid.UUID, dict[CategorizationMethod, int | None]] = {}
    for txn_id, method, category_id in results:
        latest.setdefault(txn_id, {})[method] = category_id

    both = [
        preds
        for preds in latest.values()
        if CategorizationMethod.RULE in preds and CategorizationMethod.LLM in preds
    ]
    agreements = sum(
        1 for preds in both if preds[CategorizationMethod.RULE] == preds[CategorizationMethod.LLM]
    )
    return MethodComparisonStats(
        transactions_total=sum(by_source.values()),
        by_source=by_source,
        compared=len(both),
        agreements=agreements,
        agreement_rate=round(agreements / len(both), 3) if both else None,
    )
