import uuid
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import CategorizationSource, ImportStatus


class TransactionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    account_id: uuid.UUID
    txn_date: date
    merchant_raw: str
    merchant_normalized: str | None
    description: str | None
    amount: Decimal
    currency: str
    category_id: int | None
    categorization_source: CategorizationSource


class ImportBatchRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    account_id: uuid.UUID
    filename: str
    status: ImportStatus
    total_rows: int
    imported_rows: int
    duplicate_rows: int
    error: str | None
