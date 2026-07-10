import uuid

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

# Canonical system categories. Seeded by the initial migration; also used to
# seed test databases created via metadata.
SYSTEM_CATEGORIES = [
    "groceries",
    "dining",
    "rent",
    "utilities",
    "subscriptions",
    "transportation",
    "entertainment",
    "shopping",
    "health",
    "travel",
    "education",
    "income",
    "transfers",
    "fees",
    "other",
]


class Category(Base):
    """Spending category. user_id NULL means a system-seeded category shared by all users."""

    __tablename__ = "categories"
    __table_args__ = (UniqueConstraint("name", "user_id", name="uq_category_name_user"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(60), nullable=False)
    user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
