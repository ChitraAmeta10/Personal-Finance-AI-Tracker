from datetime import date
from decimal import Decimal

import pytest
from sqlalchemy.exc import IntegrityError

from app.models import (
    Account,
    AccountType,
    CategorizationSource,
    Category,
    Transaction,
    User,
)


def make_user(db) -> User:
    user = User(email="test@example.com", hashed_password="x")
    db.add(user)
    db.commit()
    return user


def make_account(db, user: User) -> Account:
    account = Account(user_id=user.id, name="Checking", account_type=AccountType.CHECKING)
    db.add(account)
    db.commit()
    return account


def test_create_user_account_transaction(db):
    user = make_user(db)
    account = make_account(db, user)
    txn = Transaction(
        user_id=user.id,
        account_id=account.id,
        txn_date=date(2026, 7, 1),
        merchant_raw="TRADER JOE'S #123",
        amount=Decimal("-54.23"),
        dedup_hash="a" * 64,
    )
    db.add(txn)
    db.commit()

    saved = db.query(Transaction).one()
    assert saved.amount == Decimal("-54.23")
    assert saved.categorization_source == CategorizationSource.UNCATEGORIZED
    assert saved.account.user.email == "test@example.com"


def test_duplicate_dedup_hash_rejected_per_account(db):
    user = make_user(db)
    account = make_account(db, user)
    common = dict(
        user_id=user.id,
        account_id=account.id,
        txn_date=date(2026, 7, 1),
        merchant_raw="NETFLIX.COM",
        amount=Decimal("-15.49"),
        dedup_hash="b" * 64,
    )
    db.add(Transaction(**common))
    db.commit()
    db.add(Transaction(**common))
    with pytest.raises(IntegrityError):
        db.commit()


def test_seeded_system_categories_have_null_user(db):
    categories = db.query(Category).all()
    assert len(categories) == 15
    assert all(c.user_id is None for c in categories)
