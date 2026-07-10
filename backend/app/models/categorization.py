import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, Enum, Float, ForeignKey, Integer, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import CategorizationMethod


class CategorizationResult(Base):
    """Audit log of every categorization prediction.

    Both the rule-based and the LLM prediction are recorded per transaction,
    independent of which one won — this powers the rule-vs-LLM comparison.
    detail holds method-specific context: matched keyword for rules;
    model id, prompt version, and raw output for the LLM.
    """

    __tablename__ = "categorization_results"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    transaction_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("transactions.id"), nullable=False, index=True
    )
    method: Mapped[CategorizationMethod] = mapped_column(
        Enum(CategorizationMethod, values_callable=lambda e: [m.value for m in e], native_enum=False, length=10),
        nullable=False,
    )
    predicted_category_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("categories.id"))
    confidence: Mapped[float | None] = mapped_column(Float)
    detail: Mapped[dict | None] = mapped_column(JSON)
    latency_ms: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    transaction: Mapped["Transaction"] = relationship(back_populates="categorization_results")  # noqa: F821
