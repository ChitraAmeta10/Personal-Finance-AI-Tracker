"""OpenAI-compatible LLM provider.

Implements the same interfaces as the Anthropic classes (LLMClassifier in
categorization/llm.py, SQLGenerator in nl_to_sql.py) against any endpoint that
speaks the OpenAI chat-completions protocol — OpenAI itself, Google Gemini's
OpenAI-compat endpoint, Groq, Ollama, GitHub Models. That's what makes the
free tiers usable: point openai_base_url at the provider and go.

JSON mode (response_format json_object) is used instead of provider-specific
structured output so the same code works across all of them; responses are
validated with the shared Pydantic schemas and failures surface as exceptions,
which the callers already handle (rule fallback / audited 502).
"""

import json
import time
from datetime import date

import openai

from app.core.config import get_settings
from app.models.category import SYSTEM_CATEGORIES
from app.services.categorization.llm import (
    ClassificationBatch,
    LLMItem,
    LLMPrediction,
    PROMPT_VERSION,
)
from app.services.nl_to_sql import GeneratedSQL, GENERATOR_SYSTEM_PROMPT, GenerationResult

CLASSIFY_SYSTEM_PROMPT = """You categorize personal-finance transactions.

Assign every transaction exactly one category from this list:
{categories}

Amounts are signed: negative = money spent, positive = money received.
Use the merchant name, description, and amount together. Give a confidence
between 0 and 1; use lower confidence when the merchant is genuinely
ambiguous. If nothing fits, use "other".

Respond with JSON only, in exactly this shape:
{{"classifications": [{{"index": 0, "category": "groceries", "confidence": 0.9}}, ...]}}"""


def _make_client() -> openai.OpenAI:
    settings = get_settings()
    return openai.OpenAI(
        api_key=settings.openai_api_key or "unused",  # Ollama accepts any value
        base_url=settings.openai_base_url or None,
    )


def _chat_json(client: openai.OpenAI, model: str, system: str, user: str) -> str:
    response = client.chat.completions.create(
        model=model,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    )
    content = response.choices[0].message.content
    if not content:
        raise ValueError("empty completion")
    return content


class OpenAICompatClassifier:
    """Drop-in for LLMClassifier (same classify() contract)."""

    def __init__(self, client: openai.OpenAI | None = None, model: str | None = None):
        self._client = client or _make_client()
        self.model = model or get_settings().openai_model

    def classify(self, items: list[LLMItem], categories: list[str]) -> tuple[list[LLMPrediction], dict]:
        lines = [
            f"{item.index} | {item.txn_date} | {item.merchant} | {item.description or '-'} | {item.amount}"
            for item in items
        ]
        body = "index | date | merchant | description | amount\n" + "\n".join(lines)

        started = time.monotonic()
        raw = _chat_json(
            self._client,
            self.model,
            CLASSIFY_SYSTEM_PROMPT.format(categories=", ".join(categories)),
            body,
        )
        latency_ms = int((time.monotonic() - started) * 1000)

        batch = ClassificationBatch.model_validate(json.loads(raw))
        allowed = set(categories)
        predictions = [
            LLMPrediction(
                index=item.index,
                category=item.category.strip().lower() if item.category.strip().lower() in allowed else None,
                confidence=min(max(item.confidence, 0.0), 1.0),
                raw_category=item.category,
            )
            for item in batch.classifications
        ]
        meta = {
            "model": self.model,
            "prompt_version": PROMPT_VERSION,
            "latency_ms": latency_ms,
            "batch_size": len(items),
        }
        return predictions, meta


class OpenAICompatSQLGenerator:
    """Drop-in for SQLGenerator (same generate() contract)."""

    def __init__(self, client: openai.OpenAI | None = None, model: str | None = None):
        self._client = client or _make_client()
        self.model = model or get_settings().openai_model

    def generate(self, question: str) -> GenerationResult:
        system = (
            GENERATOR_SYSTEM_PROMPT.format(
                categories=", ".join(SYSTEM_CATEGORIES), today=date.today().isoformat()
            )
            + '\n\nRespond with JSON only, in exactly this shape: {"sql": "SELECT ..."}'
        )
        started = time.monotonic()
        raw = _chat_json(self._client, self.model, system, question)
        parsed = GeneratedSQL.model_validate(json.loads(raw))
        return GenerationResult(
            sql=parsed.sql,
            latency_ms=int((time.monotonic() - started) * 1000),
            model=self.model,
        )
