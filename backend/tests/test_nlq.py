from datetime import date
from decimal import Decimal

import pytest

from app.api.nlq import get_sql_generator
from app.main import app as fastapi_app
from app.models import Account, AccountType, Transaction, User
from app.services.nl_to_sql import GenerationResult, NLQueryRejected, validate_and_scope


class FakeGenerator:
    def __init__(self, sql=None, error=None):
        self.sql = sql
        self.error = error

    def generate(self, question: str) -> GenerationResult:
        if self.error is not None:
            raise self.error
        return GenerationResult(sql=self.sql, latency_ms=7, model="fake-model")


def use_generator(fake):
    fastapi_app.dependency_overrides[get_sql_generator] = lambda: fake


# --- validator ----------------------------------------------------------------


def test_validator_injects_scoped_ctes_and_limit():
    out = validate_and_scope("SELECT COUNT(*) AS n FROM transactions", "sqlite")
    assert out.startswith("WITH scoped_accounts AS (SELECT * FROM accounts WHERE user_id = :user_id)")
    assert "scoped_transactions AS (SELECT * FROM transactions WHERE user_id = :user_id)" in out
    assert "FROM scoped_transactions AS transactions" in out
    assert out.endswith("LIMIT 200")


@pytest.mark.parametrize(
    "bad,reason",
    [
        ("DELETE FROM transactions", "SELECT"),
        ("UPDATE transactions SET amount = 0", "SELECT"),
        ("SELECT * FROM users", "not allowed"),
        ("SELECT 1; DROP TABLE users", "one SQL statement"),
        ("SELECT * FROM main.transactions", "qualified"),
        ("SELECT * FROM transactions UNION SELECT * FROM accounts", "SELECT"),
        ("WITH transactions AS (SELECT 1) SELECT * FROM transactions", "shadow"),
        ("not sql at all (", "parse"),
    ],
)
def test_validator_rejects(bad, reason):
    with pytest.raises(NLQueryRejected) as excinfo:
        validate_and_scope(bad, "sqlite")
    assert reason.lower() in str(excinfo.value).lower()


def test_validator_tightens_oversized_limit():
    out = validate_and_scope("SELECT * FROM transactions LIMIT 99999", "sqlite")
    assert out.endswith("LIMIT 200")


def test_validator_keeps_query_local_ctes_after_shadows():
    out = validate_and_scope(
        "WITH recent AS (SELECT * FROM transactions WHERE txn_date >= '2026-06-01') "
        "SELECT SUM(-amount) AS spent FROM recent WHERE amount < 0",
        "sqlite",
    )
    assert out.index("scoped_transactions AS (SELECT * FROM transactions") < out.index("recent AS")
    assert "recent AS (SELECT * FROM scoped_transactions" in out  # local CTE body rewritten too


# --- API ----------------------------------------------------------------------


def signup(client, email="alice@example.com"):
    client.post("/auth/register", json={"email": email, "password": "s3cret-pass"})
    token = client.post("/auth/login", data={"username": email, "password": "s3cret-pass"}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def seed(db, email, merchant, amount):
    user = db.query(User).filter_by(email=email).one()
    account = db.query(Account).filter_by(user_id=user.id).first()
    if account is None:
        account = Account(user_id=user.id, name="Checking", account_type=AccountType.CHECKING)
        db.add(account)
        db.flush()
    db.add(
        Transaction(
            user_id=user.id,
            account_id=account.id,
            txn_date=date(2026, 7, 1),
            merchant_raw=merchant,
            amount=Decimal(amount),
            dedup_hash=f"{email[:2]}{merchant[:2]}{amount}".ljust(64, "0"),
        )
    )
    db.commit()


def test_nlq_executes_and_audits(client, db):
    headers = signup(client)
    seed(db, "alice@example.com", "TRADER JOE'S", "-54.23")
    seed(db, "alice@example.com", "PAYCHECK", "2500.00")
    use_generator(FakeGenerator(sql="SELECT SUM(-amount) AS total_spent FROM transactions WHERE amount < 0"))

    resp = client.post("/nlq", json={"question": "how much did I spend?"}, headers=headers)
    assert resp.status_code == 200
    body = resp.json()
    assert body["columns"] == ["total_spent"]
    assert body["rows"] == [["54.23"]] or body["rows"] == [[54.23]]
    assert body["row_count"] == 1

    history = client.get("/nlq/history", headers=headers).json()
    assert history[0]["status"] == "executed"
    assert history[0]["row_count"] == 1


def test_nlq_scoping_hides_other_users_data(client, db):
    alice = signup(client, "alice@example.com")
    signup(client, "bob@example.com")
    seed(db, "alice@example.com", "ALICE SHOP", "-10.00")
    seed(db, "bob@example.com", "BOB SHOP", "-999.00")
    # Generated SQL has NO user filter — the shadow CTE must inject it.
    use_generator(FakeGenerator(sql="SELECT COUNT(*) AS n, SUM(-amount) AS spent FROM transactions"))

    body = client.post("/nlq", json={"question": "count my transactions"}, headers=alice).json()
    assert body["rows"][0][0] == 1  # only alice's row, not bob's


def test_nlq_rejected_sql_audited(client, db):
    headers = signup(client)
    use_generator(FakeGenerator(sql="DROP TABLE users"))
    resp = client.post("/nlq", json={"question": "delete everything"}, headers=headers)
    assert resp.status_code == 400
    history = client.get("/nlq/history", headers=headers).json()
    assert history[0]["status"] == "rejected"
    assert history[0]["generated_sql"] == "DROP TABLE users"


def test_nlq_execution_error_audited_as_failed(client, db):
    headers = signup(client)
    use_generator(FakeGenerator(sql="SELECT nonexistent_column FROM transactions"))
    resp = client.post("/nlq", json={"question": "weird question"}, headers=headers)
    assert resp.status_code == 400
    history = client.get("/nlq/history", headers=headers).json()
    assert history[0]["status"] == "failed"


def test_nlq_generation_failure_502(client, db):
    headers = signup(client)
    use_generator(FakeGenerator(error=RuntimeError("api down")))
    resp = client.post("/nlq", json={"question": "anything"}, headers=headers)
    assert resp.status_code == 502
    history = client.get("/nlq/history", headers=headers).json()
    assert history[0]["status"] == "failed"


def test_nlq_unconfigured_503(client):
    headers = signup(client)
    fastapi_app.dependency_overrides[get_sql_generator] = lambda: None
    resp = client.post("/nlq", json={"question": "anything"}, headers=headers)
    assert resp.status_code == 503
