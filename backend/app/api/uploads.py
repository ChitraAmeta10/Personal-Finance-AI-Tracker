import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import Account, ImportBatch, ImportStatus, Transaction, User
from app.schemas.transaction import ImportBatchRead
from app.services.csv_parser import CSVParseError, normalize_merchant, parse_csv
from app.services.dedup import assign_dedup_hashes

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.get("", response_model=list[ImportBatchRead])
def list_batches(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ImportBatch]:
    return list(
        db.scalars(
            select(ImportBatch)
            .where(ImportBatch.user_id == user.id)
            .order_by(ImportBatch.created_at.desc())
            .limit(50)
        )
    )


@router.post("", response_model=ImportBatchRead, status_code=status.HTTP_201_CREATED)
async def upload_statement(
    account_id: uuid.UUID = Form(...),
    invert_amounts: bool = Form(False),
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ImportBatch:
    account = db.get(Account, account_id)
    if account is None or account.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    content = await file.read()
    batch = ImportBatch(user_id=user.id, account_id=account.id, filename=file.filename or "upload.csv")
    db.add(batch)
    db.flush()

    try:
        rows, total, row_errors = parse_csv(content, invert_amounts=invert_amounts)
    except CSVParseError as exc:
        batch.status = ImportStatus.FAILED
        batch.error = str(exc)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    hashed = assign_dedup_hashes(rows)
    existing = set(
        db.scalars(
            select(Transaction.dedup_hash).where(
                Transaction.account_id == account.id,
                Transaction.dedup_hash.in_([h for _, h in hashed]),
            )
        )
    )

    imported = duplicates = 0
    for row, digest in hashed:
        if digest in existing:
            duplicates += 1
            continue
        existing.add(digest)
        db.add(
            Transaction(
                user_id=user.id,
                account_id=account.id,
                import_batch_id=batch.id,
                txn_date=row.txn_date,
                merchant_raw=row.merchant_raw,
                merchant_normalized=normalize_merchant(row.merchant_raw),
                description=row.description,
                amount=row.amount,
                currency=account.currency,
                dedup_hash=digest,
            )
        )
        imported += 1

    batch.total_rows = total
    batch.imported_rows = imported
    batch.duplicate_rows = duplicates
    batch.status = ImportStatus.COMPLETED
    if row_errors:
        batch.error = f"{len(row_errors)} row(s) skipped: " + "; ".join(row_errors[:5])
    db.commit()
    db.refresh(batch)
    return batch
