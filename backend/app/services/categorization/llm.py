"""LLM classifier for ambiguous transactions.

Transactions the rules couldn't confidently categorize are sent to Claude
Haiku in batches (one API call per ~20 transactions — per-transaction calls
would cost and take ~20x more). Structured output via messages.parse()
guarantees schema-valid JSON, no string parsing.
"""

import time
from dataclasses import dataclass
from decimal import Decimal

import anthropic
from pydantic import BaseModel

from app.core.config import get_settings

PROMPT_VERSION = "v1"

SYSTEM_PROMPT = """You categorize personal-finance transactions.

Assign every transaction exactly one category from this list:
{categories}

Amounts are signed: negative = money spent, positive = money received.
Use the merchant name, description, and amount together. Give a confidence
between 0 and 1; use lower confidence when the merchant is genuinely
ambiguous. If nothing fits, use "other"."""


@dataclass(frozen=True)
class LLMItem:
    """One transaction as presented to the model, keyed by batch index."""

    index: int
    txn_date: str
    merchant: str
    description: str | None
    amount: Decimal


class ClassifiedTransaction(BaseModel):
    index: int
    category: str
    confidence: float


class ClassificationBatch(BaseModel):
    classifications: list[ClassifiedTransaction]


@dataclass(frozen=True)
class LLMPrediction:
    index: int
    category: str | None  # validated against the allowed set; None if the model went off-list
    confidence: float
    raw_category: str


class LLMClassifier:
    def __init__(self, client: anthropic.Anthropic | None = None, model: str | None = None):
        settings = get_settings()
        self._client = client or anthropic.Anthropic(api_key=settings.anthropic_api_key or None)
        self.model = model or settings.anthropic_model

    def classify(self, items: list[LLMItem], categories: list[str]) -> tuple[list[LLMPrediction], dict]:
        """Classify one batch. Returns (predictions, call_metadata)."""
        lines = [
            f"{item.index} | {item.txn_date} | {item.merchant} | {item.description or '-'} | {item.amount}"
            for item in items
        ]
        body = "index | date | merchant | description | amount\n" + "\n".join(lines)

        started = time.monotonic()
        response = self._client.messages.parse(
            model=self.model,
            max_tokens=4096,
            system=SYSTEM_PROMPT.format(categories=", ".join(categories)),
            messages=[{"role": "user", "content": body}],
            output_format=ClassificationBatch,
        )
        latency_ms = int((time.monotonic() - started) * 1000)

        allowed = set(categories)
        predictions = []
        for item in response.parsed_output.classifications:
            category = item.category.strip().lower()
            predictions.append(
                LLMPrediction(
                    index=item.index,
                    category=category if category in allowed else None,
                    confidence=min(max(item.confidence, 0.0), 1.0),
                    raw_category=item.category,
                )
            )
        meta = {
            "model": self.model,
            "prompt_version": PROMPT_VERSION,
            "latency_ms": latency_ms,
            "batch_size": len(items),
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
        }
        return predictions, meta
