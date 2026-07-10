from fastapi import APIRouter, Depends, Query
from pymongo.collection import Collection

from app.core.deps import get_current_user
from app.db.mongo import get_ai_events_collection
from app.models import User
from app.services.ai_telemetry import recent_ai_events

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/events")
def list_ai_events(
    limit: int = Query(default=50, ge=1, le=200),
    user: User = Depends(get_current_user),
    collection: Collection | None = Depends(get_ai_events_collection),
) -> dict:
    """Raw LLM call telemetry from MongoDB (categorization batches, NLQ generations).

    enabled=false means MongoDB is not configured/reachable — telemetry is optional.
    """
    return {
        "enabled": collection is not None,
        "events": recent_ai_events(user.id, limit=limit, collection=collection),
    }
