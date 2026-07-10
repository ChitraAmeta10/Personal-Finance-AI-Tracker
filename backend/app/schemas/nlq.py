import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import NLQueryStatus


class NLQueryRequest(BaseModel):
    question: str = Field(min_length=3, max_length=500)


class NLQueryResponse(BaseModel):
    question: str
    sql: str
    columns: list[str]
    rows: list[list]
    row_count: int
    latency_ms: int


class NLQueryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question: str
    generated_sql: str | None
    status: NLQueryStatus
    row_count: int | None
    error: str | None
    latency_ms: int | None
    created_at: datetime
