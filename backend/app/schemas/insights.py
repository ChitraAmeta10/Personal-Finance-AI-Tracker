from decimal import Decimal

from pydantic import BaseModel


class CategorySpend(BaseModel):
    category: str  # "uncategorized" when no category assigned
    total_spent: Decimal
    transaction_count: int


class MonthlySummary(BaseModel):
    month: str  # "2026-07"
    spent: Decimal
    income: Decimal
    net: Decimal


class MerchantSpend(BaseModel):
    merchant: str
    total_spent: Decimal
    transaction_count: int
