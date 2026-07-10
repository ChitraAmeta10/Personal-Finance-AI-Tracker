import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import NLQueryStatus


class NLQuery(Base):
    """Audit log for the natural-language → SQL feature.

    Every attempt is recorded, including generated SQL that was rejected by
    validation — the rejection trail is part of the safety story.
    """

    __tablename__ = "nl_queries"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False, index=True)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    generated_sql: Mapped[str | None] = mapped_column(Text)
    status: Mapped[NLQueryStatus] = mapped_column(
        Enum(NLQueryStatus, values_callable=lambda e: [m.value for m in e], native_enum=False, length=10),
        nullable=False,
    )
    row_count: Mapped[int | None] = mapped_column(Integer)
    error: Mapped[str | None] = mapped_column(Text)
    latency_ms: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
