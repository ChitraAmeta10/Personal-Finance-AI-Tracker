from datetime import date, timedelta
from decimal import Decimal

from app.models import Account, AccountType, Transaction, User
from app.services.categorization.pipeline import load_category_map


def signup(client, email="alice@example.com"):
    client.post("/auth/register", json={"email": email, "password": "s3cret-pass"})
    token = client.post("/auth/login", data={"username": email, "password": "s3cret-pass"}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def seed_transactions(db, email, rows):
    """rows: (txn_date, merchant, amount, category_name | None)"""
    user = db.query(User).filter_by(email=email).one()
    account = Account(user_id=user.id, name="Checking", account_type=AccountType.CHECKING)
    db.add(account)
    db.flush()
    categories = load_category_map(db, user)
    for i, (txn_date, merchant, amount, category) in enumerate(rows):
        db.add(
            Transaction(
                user_id=user.id,
                account_id=account.id,
                txn_date=txn_date,
                merchant_raw=merchant.upper(),
                merchant_normalized=merchant,
                amount=Decimal(amount),
                category_id=categories[category] if category else None,
                dedup_hash=f"{email[:1]}{i:063d}",
            )
        )
    db.commit()


TODAY = date.today()
LAST_MONTH = (TODAY.replace(day=1) - timedelta(days=1)).replace(day=1)


def test_spend_by_category(client, db):
    headers = signup(client)
    seed_transactions(
        db,
        "alice@example.com",
        [
            (TODAY, "Trader Joe's", "-100.00", "groceries"),
            (TODAY, "Safeway", "-50.00", "groceries"),
            (TODAY, "Netflix", "-15.49", "subscriptions"),
            (TODAY, "Mystery Shop", "-9.99", None),
            (TODAY, "Employer", "2500.00", "income"),  # income must not appear as spend
        ],
    )
    body = client.get("/insights/by-category", headers=headers).json()
    assert body[0] == {"category": "groceries", "total_spent": "150.00", "transaction_count": 2}
    categories = {row["category"] for row in body}
    assert categories == {"groceries", "subscriptions", "uncategorized"}


def test_spend_by_category_date_filter(client, db):
    headers = signup(client)
    seed_transactions(
        db,
        "alice@example.com",
        [
            (date(2026, 1, 15), "Old Store", "-40.00", "shopping"),
            (date(2026, 6, 15), "New Store", "-60.00", "shopping"),
        ],
    )
    body = client.get("/insights/by-category?start=2026-06-01", headers=headers).json()
    assert body == [{"category": "shopping", "total_spent": "60.00", "transaction_count": 1}]


def test_monthly_summary(client, db):
    headers = signup(client)
    seed_transactions(
        db,
        "alice@example.com",
        [
            (LAST_MONTH, "Rent Co", "-1200.00", "rent"),
            (LAST_MONTH, "Employer", "2500.00", "income"),
            (TODAY, "Trader Joe's", "-80.00", "groceries"),
        ],
    )
    body = client.get("/insights/monthly", headers=headers).json()
    assert len(body) == 2
    first, second = body
    assert first["month"] == f"{LAST_MONTH.year:04d}-{LAST_MONTH.month:02d}"
    assert first["spent"] == "1200.00"
    assert first["income"] == "2500.00"
    assert first["net"] == "1300.00"
    assert second["spent"] == "80.00"
    assert second["income"] == "0.00"


def test_monthly_window_excludes_old_months(client, db):
    headers = signup(client)
    seed_transactions(
        db,
        "alice@example.com",
        [
            (TODAY - timedelta(days=400), "Ancient Store", "-10.00", "shopping"),
            (TODAY, "Trader Joe's", "-80.00", "groceries"),
        ],
    )
    body = client.get("/insights/monthly?months=3", headers=headers).json()
    assert len(body) == 1
    assert body[0]["spent"] == "80.00"


def test_top_merchants(client, db):
    headers = signup(client)
    seed_transactions(
        db,
        "alice@example.com",
        [
            (TODAY, "Trader Joe's", "-100.00", "groceries"),
            (TODAY, "Trader Joe's", "-50.00", "groceries"),
            (TODAY, "Netflix", "-15.49", "subscriptions"),
            (TODAY, "Employer", "2500.00", "income"),
        ],
    )
    body = client.get("/insights/top-merchants?limit=1", headers=headers).json()
    assert body == [{"merchant": "Trader Joe's", "total_spent": "150.00", "transaction_count": 2}]


def test_insights_scoped_to_user(client, db):
    alice = signup(client, "alice@example.com")
    signup(client, "bob@example.com")
    seed_transactions(db, "bob@example.com", [(TODAY, "Bob Store", "-99.00", "shopping")])
    assert client.get("/insights/by-category", headers=alice).json() == []
    assert client.get("/insights/top-merchants", headers=alice).json() == []


def test_insights_empty_state(client):
    headers = signup(client)
    assert client.get("/insights/monthly", headers=headers).json() == []
