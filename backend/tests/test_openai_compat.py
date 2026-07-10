import json
from datetime import date
from decimal import Decimal
from types import SimpleNamespace

import pytest

from app.api.categorization import get_llm_classifier
from app.api.nlq import get_sql_generator
from app.core.config import Settings
from app.services.categorization.llm import LLMItem
from app.services.openai_compat import OpenAICompatClassifier, OpenAICompatSQLGenerator


class StubOpenAI:
    """Mimics openai.OpenAI chat.completions.create returning canned JSON."""

    def __init__(self, payload: dict):
        self.requests = []
        outer = self

        class Completions:
            def create(self, **kwargs):
                outer.requests.append(kwargs)
                message = SimpleNamespace(content=json.dumps(payload))
                return SimpleNamespace(choices=[SimpleNamespace(message=message)])

        self.chat = SimpleNamespace(completions=Completions())


ITEMS = [
    LLMItem(index=0, txn_date=date(2026, 7, 1).isoformat(), merchant="Acme Widgets", description=None, amount=Decimal("-10")),
    LLMItem(index=1, txn_date=date(2026, 7, 2).isoformat(), merchant="Mystery", description=None, amount=Decimal("-5")),
]


def test_classifier_parses_and_validates_categories():
    stub = StubOpenAI(
        {
            "classifications": [
                {"index": 0, "category": "shopping", "confidence": 0.9},
                {"index": 1, "category": "not-a-real-category", "confidence": 1.7},
            ]
        }
    )
    classifier = OpenAICompatClassifier(client=stub, model="test-model")
    predictions, meta = classifier.classify(ITEMS, ["shopping", "other"])

    assert predictions[0].category == "shopping"
    assert predictions[1].category is None  # off-list category rejected
    assert predictions[1].confidence == 1.0  # clamped
    assert meta["model"] == "test-model"
    assert stub.requests[0]["response_format"] == {"type": "json_object"}


def test_classifier_raises_on_malformed_payload():
    classifier = OpenAICompatClassifier(client=StubOpenAI({"wrong": "shape"}), model="m")
    with pytest.raises(Exception):
        classifier.classify(ITEMS, ["shopping"])  # pipeline catches and falls back to rules


def test_sql_generator_parses_sql():
    stub = StubOpenAI({"sql": "SELECT COUNT(*) FROM transactions"})
    generator = OpenAICompatSQLGenerator(client=stub, model="test-model")
    result = generator.generate("how many transactions do I have?")
    assert result.sql == "SELECT COUNT(*) FROM transactions"
    assert result.model == "test-model"
    # prompt must demand JSON (required by OpenAI json_object mode)
    assert "JSON" in stub.requests[0]["messages"][0]["content"]


def test_factories_select_provider(monkeypatch):
    def with_settings(**kwargs):
        settings = Settings(_env_file=None, **kwargs)  # hermetic: ignore any real .env
        monkeypatch.setattr("app.api.categorization.get_settings", lambda: settings)
        monkeypatch.setattr("app.api.nlq.get_settings", lambda: settings)
        monkeypatch.setattr("app.services.openai_compat.get_settings", lambda: settings)

    with_settings(llm_provider="openai", openai_api_key="sk-test")
    assert isinstance(get_llm_classifier(), OpenAICompatClassifier)
    assert isinstance(get_sql_generator(), OpenAICompatSQLGenerator)

    with_settings(llm_provider="openai", openai_base_url="http://localhost:11434/v1")  # Ollama: keyless
    assert isinstance(get_llm_classifier(), OpenAICompatClassifier)

    with_settings(llm_provider="openai")  # nothing configured
    assert get_llm_classifier() is None
    assert get_sql_generator() is None

    with_settings(llm_provider="anthropic")  # default provider, no key
    assert get_llm_classifier() is None
