import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import CategorizationSource


class Transaction(Base):
    """A single bank/card transaction.

    amount is signed: negative = money out (spending), positive = money in.
    user_id is denormalized from account so every query — including generated
    NL-to-SQL — can scope with a plain WHERE user_id = :id, no join required.
    """

    __tablename__ = "transactions"
    __table_args__ = (
        UniqueConstraint("account_id", "dedup_hash", name="uq_txn_account_dedup"),
        Index("ix_txn_user_date", "user_id", "txn_date"),
        Index("ix_txn_user_category", "user_id", "category_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    account_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("accounts.id"), nullable=False, index=True)
    import_batch_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("import_batches.id"))
    txn_date: Mapped[date] = mapped_column(Date, nullable=False)
    merchant_raw: Mapped[str] = mapped_column(String(255), nullable=False)
    merchant_normalized: Mapped[str | None] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    category_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("categories.id"))
    categorization_source: Mapped[CategorizationSource] = mapped_column(
        Enum(
            CategorizationSource,
            values_callable=lambda e: [m.value for m in e],
            native_enum=False,
            length=20,
        ),
        default=CategorizationSource.UNCATEGORIZED,
        nullable=False,
    )
    dedup_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    account: Mapped["Account"] = relationship(back_populates="transactions")  # noqa: F821
    category: Mapped["Category | None"] = relationship()  # noqa: F821
    categorization_results: Mapped[list["CategorizationResult"]] = relationship(  # noqa: F821
        back_populates="transaction"
    )
