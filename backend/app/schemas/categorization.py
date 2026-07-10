import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import CategorizationMethod


class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    user_id: uuid.UUID | None


class CategorizationRunResult(BaseModel):
    total: int
    rule_categorized: int
    llm_categorized: int
    still_uncategorized: int
    llm_error: str | None


class CategorizationResultRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    method: CategorizationMethod
    predicted_category_id: int | None
    predicted_category: str | None = None
    confidence: float | None
    detail: dict | None
    latency_ms: int | None
    created_at: datetime


class MethodComparisonStats(BaseModel):
    transactions_total: int
    by_source: dict[str, int]
    compared: int  # transactions with both a rule and an LLM prediction
    agreements: int
    agreement_rate: float | None
