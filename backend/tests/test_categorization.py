import io
from datetime import date
from decimal import Decimal

from app.api.categorization import get_llm_classifier
from app.core.config import Settings
from app.main import app as fastapi_app
from app.models import (
    Account,
    AccountType,
    CategorizationMethod,
    CategorizationResult,
    CategorizationSource,
    Transaction,
    User,
)
from app.services.categorization.llm import LLMPrediction
from app.services.categorization.pipeline import load_category_map, run_categorization
from app.services.categorization.rules import classify_rule


class FakeClassifier:
    """Stands in for LLMClassifier: maps merchant substrings to categories."""

    def __init__(self, mapping=None, error=None):
        self.mapping = mapping or {}
        self.error = error
        self.batches: list[int] = []

    def classify(self, items, categories):
        if self.error is not None:
            raise self.error
        self.batches.append(len(items))
        predictions = []
        for item in items:
            category = "other"
            for key, value in self.mapping.items():
                if key in item.merchant.lower():
                    category = value
                    break
            predictions.append(
                LLMPrediction(index=item.index, category=category, confidence=0.88, raw_category=category)
            )
        return predictions, {
            "model": "fake-model",
            "prompt_version": "v1",
            "latency_ms": 5,
            "batch_size": len(items),
        }


# --- rule classifier ---------------------------------------------------------


def test_rule_matches_specific_merchant():
    pred = classify_rule("TRADER JOE'S #123", "Trader Joe's", None, Decimal("-54.23"))
    assert pred.category == "groceries"
    assert pred.confidence >= 0.9


def test_rule_income_requires_positive_amount():
    positive = classify_rule("EMPLOYER PAYROLL", None, None, Decimal("2500.00"))
    negative = classify_rule("EMPLOYER PAYROLL", None, None, Decimal("-2500.00"))
    assert positive.category == "income" and positive.confidence >= 0.9
    assert negative.confidence < 0.5


def test_rule_uber_eats_beats_uber():
    pred = classify_rule("UBER EATS SF", None, None, Decimal("-25.00"))
    assert pred.category == "dining"


def test_rule_no_match():
    pred = classify_rule("ACME WIDGETS LLC", None, None, Decimal("-10.00"))
    assert pred.category is None and pred.confidence == 0.0


# --- pipeline ----------------------------------------------------------------


def make_user_with_txns(db, merchants_amounts) -> User:
    user = User(email="p@example.com", hashed_password="x")
    db.add(user)
    db.flush()
    account = Account(user_id=user.id, name="Checking", account_type=AccountType.CHECKING)
    db.add(account)
    db.flush()
    for i, (merchant, amount) in enumerate(merchants_amounts):
        db.add(
            Transaction(
                user_id=user.id,
                account_id=account.id,
                txn_date=date(2026, 7, 1),
                merchant_raw=merchant,
                merchant_normalized=merchant.title(),
                amount=Decimal(amount),
                dedup_hash=f"{i:064d}",
            )
        )
    db.commit()
    return user


def test_pipeline_confident_rule_skips_llm(db):
    user = make_user_with_txns(db, [("NETFLIX.COM", "-15.49")])
    fake = FakeClassifier()
    summary = run_categorization(db, user, fake)
    assert summary.rule_categorized == 1
    assert fake.batches == []  # LLM never called
    txn = db.query(Transaction).one()
    assert txn.categorization_source == CategorizationSource.RULE
    results = db.query(CategorizationResult).all()
    assert [r.method for r in results] == [CategorizationMethod.RULE]


def test_pipeline_ambiguous_goes_to_llm_and_logs_both(db):
    user = make_user_with_txns(db, [("ACME WIDGETS LLC", "-10.00")])
    fake = FakeClassifier(mapping={"acme": "shopping"})
    summary = run_categorization(db, user, fake)
    assert summary.llm_categorized == 1
    txn = db.query(Transaction).one()
    assert txn.categorization_source == CategorizationSource.LLM
    categories = load_category_map(db, user)
    assert txn.category_id == categories["shopping"]
    methods = {r.method for r in db.query(CategorizationResult).all()}
    assert methods == {CategorizationMethod.RULE, CategorizationMethod.LLM}
    llm_result = db.query(CategorizationResult).filter_by(method=CategorizationMethod.LLM).one()
    assert llm_result.detail["model"] == "fake-model"


def test_pipeline_llm_failure_falls_back_to_weak_rule(db):
    # venmo rule confidence (0.6) is below the 0.7 threshold -> LLM path
    user = make_user_with_txns(db, [("VENMO PAYMENT 123", "-40.00")])
    fake = FakeClassifier(error=RuntimeError("api down"))
    summary = run_categorization(db, user, fake)
    assert summary.llm_error is not None
    assert summary.rule_categorized == 1  # weak rule applied instead
    txn = db.query(Transaction).one()
    assert txn.categorization_source == CategorizationSource.RULE
    categories = load_category_map(db, user)
    assert txn.category_id == categories["transfers"]


def test_pipeline_no_classifier_leaves_unmatched_uncategorized(db):
    user = make_user_with_txns(db, [("ACME WIDGETS LLC", "-10.00")])
    summary = run_categorization(db, user, classifier=None)
    assert summary.still_uncategorized == 1
    assert summary.llm_error == "LLM classifier not configured"


def test_pipeline_batches_by_configured_size(db, monkeypatch):
    monkeypatch.setattr(
        "app.services.categorization.pipeline.get_settings",
        lambda: Settings(llm_batch_size=2, rule_confidence_threshold=0.7),
    )
    user = make_user_with_txns(db, [(f"MYSTERY SHOP {i}", "-5.00") for i in range(5)])
    fake = FakeClassifier()
    run_categorization(db, user, fake)
    assert fake.batches == [2, 2, 1]


def test_pipeline_skips_already_categorized(db):
    user = make_user_with_txns(db, [("NETFLIX.COM", "-15.49")])
    run_categorization(db, user, None)
    summary = run_categorization(db, user, None)  # second run: nothing left
    assert summary.total == 0


# --- API ---------------------------------------------------------------------

CSV = (
    b"Date,Description,Amount\n"
    b"2026-07-01,TRADER JOE'S #123,-54.23\n"
    b"2026-07-01,NETFLIX.COM,-15.49\n"
    b"2026-07-02,ACME WIDGETS LLC,-10.00\n"
)


def signup_and_upload(client):
    client.post("/auth/register", json={"email": "a@example.com", "password": "s3cret-pass"})
    token = client.post(
        "/auth/login", data={"username": "a@example.com", "password": "s3cret-pass"}
    ).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    account_id = client.post(
        "/accounts", json={"name": "Checking", "account_type": "checking"}, headers=headers
    ).json()["id"]
    client.post(
        "/uploads",
        data={"account_id": account_id},
        files={"file": ("s.csv", io.BytesIO(CSV), "text/csv")},
        headers=headers,
    )
    return headers


def test_run_endpoint_categorizes_and_exposes_comparison(client):
    headers = signup_and_upload(client)
    fake = FakeClassifier(mapping={"acme": "shopping"})
    fastapi_app.dependency_overrides[get_llm_classifier] = lambda: fake

    run = client.post("/categorization/run", headers=headers).json()
    assert run == {
        "total": 3,
        "rule_categorized": 2,
        "llm_categorized": 1,
        "still_uncategorized": 0,
        "llm_error": None,
    }

    txns = client.get("/transactions", headers=headers).json()
    acme = next(t for t in txns if "ACME" in t["merchant_raw"])
    history = client.get(f"/transactions/{acme['id']}/categorization", headers=headers).json()
    assert [h["method"] for h in history] == ["rule", "llm"]
    assert history[1]["predicted_category"] == "shopping"
    assert history[1]["detail"]["model"] == "fake-model"

    stats = client.get("/categorization/stats", headers=headers).json()
    assert stats["by_source"] == {"rule": 2, "llm": 1}
    assert stats["compared"] == 1
    assert stats["agreement_rate"] == 0.0  # rule had no prediction for ACME


def test_categories_endpoint_lists_seeded(client):
    headers = signup_and_upload(client)
    categories = client.get("/categories", headers=headers).json()
    names = [c["name"] for c in categories]
    assert "groceries" in names and "other" in names
    assert len(names) == 15


def test_stats_with_no_predictions(client):
    headers = signup_and_upload(client)
    stats = client.get("/categorization/stats", headers=headers).json()
    assert stats["compared"] == 0
    assert stats["agreement_rate"] is None
