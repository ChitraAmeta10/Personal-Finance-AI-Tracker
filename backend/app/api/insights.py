from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import User
from app.schemas.insights import CategorySpend, MerchantSpend, MonthlySummary
from app.services import insights

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/by-category", response_model=list[CategorySpend])
def by_category(
    start: date | None = None,
    end: date | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CategorySpend]:
    return insights.spend_by_category(db, user, start=start, end=end)


@router.get("/monthly", response_model=list[MonthlySummary])
def monthly(
    months: int = Query(default=12, ge=1, le=60),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[MonthlySummary]:
    return insights.monthly_summary(db, user, months=months)


@router.get("/top-merchants", response_model=list[MerchantSpend])
def merchants(
    limit: int = Query(default=10, ge=1, le=50),
    start: date | None = None,
    end: date | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[MerchantSpend]:
    return insights.top_merchants(db, user, limit=limit, start=start, end=end)
