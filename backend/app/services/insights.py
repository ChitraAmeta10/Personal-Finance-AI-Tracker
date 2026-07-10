"""Spending aggregates.

All queries stay dialect-portable (extract() compiles to strftime on SQLite,
date parts on Postgres) and are scoped to one user. Spending = negative
amounts, reported as positive magnitudes; income = positive amounts.
"""

from datetime import date
from decimal import Decimal

from sqlalchemy import case, extract, func, select
from sqlalchemy.orm import Session

from app.models import Category, Transaction, User
from app.schemas.insights import CategorySpend, MerchantSpend, MonthlySummary


def _money(value) -> Decimal:
    """SQLite aggregates Numeric to float; normalize to a 2dp Decimal."""
    return Decimal(str(value or 0)).quantize(Decimal("0.01"))


def _date_filters(query, start: date | None, end: date | None):
    if start is not None:
        query = query.where(Transaction.txn_date >= start)
    if end is not None:
        query = query.where(Transaction.txn_date <= end)
    return query


def spend_by_category(
    db: Session, user: User, start: date | None = None, end: date | None = None
) -> list[CategorySpend]:
    query = (
        select(Category.name, func.sum(-Transaction.amount), func.count())
        .join(Category, Transaction.category_id == Category.id, isouter=True)
        .where(Transaction.user_id == user.id, Transaction.amount < 0)
        .group_by(Category.name)
    )
    rows = db.execute(_date_filters(query, start, end)).all()
    result = [
        CategorySpend(category=name or "uncategorized", total_spent=_money(total), transaction_count=count)
        for name, total, count in rows
    ]
    return sorted(result, key=lambda c: c.total_spent, reverse=True)


def monthly_summary(db: Session, user: User, months: int = 12) -> list[MonthlySummary]:
    today = date.today()
    # First day of the month `months - 1` months back.
    start_month = (today.year * 12 + today.month - 1) - (months - 1)
    start = date(start_month // 12, start_month % 12 + 1, 1)

    year = extract("year", Transaction.txn_date)
    month = extract("month", Transaction.txn_date)
    spent = func.sum(case((Transaction.amount < 0, -Transaction.amount), else_=0))
    income = func.sum(case((Transaction.amount > 0, Transaction.amount), else_=0))

    rows = db.execute(
        select(year, month, spent, income)
        .where(Transaction.user_id == user.id, Transaction.txn_date >= start)
        .group_by(year, month)
        .order_by(year, month)
    ).all()
    return [
        MonthlySummary(
            month=f"{int(y):04d}-{int(m):02d}",
            spent=_money(s),
            income=_money(i),
            net=_money(i) - _money(s),
        )
        for y, m, s, i in rows
    ]


def top_merchants(
    db: Session,
    user: User,
    limit: int = 10,
    start: date | None = None,
    end: date | None = None,
) -> list[MerchantSpend]:
    merchant = func.coalesce(Transaction.merchant_normalized, Transaction.merchant_raw)
    query = (
        select(merchant, func.sum(-Transaction.amount).label("total"), func.count())
        .where(Transaction.user_id == user.id, Transaction.amount < 0)
        .group_by(merchant)
        .order_by(func.sum(-Transaction.amount).desc())
        .limit(limit)
    )
    rows = db.execute(_date_filters(query, start, end)).all()
    return [
        MerchantSpend(merchant=name, total_spent=_money(total), transaction_count=count)
        for name, total, count in rows
    ]
