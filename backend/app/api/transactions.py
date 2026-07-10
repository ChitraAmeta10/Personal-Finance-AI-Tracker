import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import CategorizationResult, Category, Transaction, User
from app.schemas.categorization import CategorizationResultRead
from app.schemas.transaction import TransactionRead

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionRead])
def list_transactions(
    account_id: uuid.UUID | None = None,
    limit: int = Query(default=100, le=500),
    offset: int = Query(default=0, ge=0),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Transaction]:
    query = select(Transaction).where(Transaction.user_id == user.id)
    if account_id is not None:
        query = query.where(Transaction.account_id == account_id)
    query = query.order_by(Transaction.txn_date.desc(), Transaction.created_at.desc()).limit(limit).offset(offset)
    return list(db.scalars(query))


@router.get("/{txn_id}/categorization", response_model=list[CategorizationResultRead])
def categorization_history(
    txn_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CategorizationResultRead]:
    """Every prediction made for this transaction — the rule-vs-LLM comparison view."""
    txn = db.get(Transaction, txn_id)
    if txn is None or txn.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    category_names = dict(db.execute(select(Category.id, Category.name)).all())
    results = db.scalars(
        select(CategorizationResult)
        .where(CategorizationResult.transaction_id == txn.id)
        .order_by(CategorizationResult.created_at)
    )
    out = []
    for result in results:
        item = CategorizationResultRead.model_validate(result)
        if result.predicted_category_id is not None:
            item.predicted_category = category_names.get(result.predicted_category_id)
        out.append(item)
    return out
