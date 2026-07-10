"""AI telemetry — one document per LLM interaction, written to MongoDB.

The SQL tables (categorization_results, nl_queries) remain the durable audit
of *decisions*; this collection captures the *raw call telemetry* (provider,
model, batch sizes, latencies, free-form payloads) whose shape varies by
provider — document-store territory.

Telemetry must never break a request: every failure here is swallowed.
"""

import uuid
from datetime import datetime, timezone

from pymongo.collection import Collection

from app.db.mongo import get_ai_events_collection

_DEFAULT = object()  # sentinel: "look up the real collection" (None means "disabled")


def log_ai_event(
    kind: str,
    user_id: uuid.UUID,
    payload: dict,
    collection: Collection | None | object = _DEFAULT,
) -> None:
    coll = get_ai_events_collection() if collection is _DEFAULT else collection
    if coll is None:
        return
    try:
        coll.insert_one(
            {
                "kind": kind,
                "user_id": str(user_id),
                "created_at": datetime.now(timezone.utc),
                **payload,
            }
        )
    except Exception:
        pass  # telemetry is best-effort by design


def recent_ai_events(
    user_id: uuid.UUID,
    limit: int = 50,
    collection: Collection | None | object = _DEFAULT,
) -> list[dict]:
    coll = get_ai_events_collection() if collection is _DEFAULT else collection
    if coll is None:
        return []
    try:
        cursor = (
            coll.find({"user_id": str(user_id)}, {"_id": False})
            .sort("created_at", -1)
            .limit(limit)
        )
        return [
            {**doc, "created_at": doc["created_at"].isoformat() if hasattr(doc.get("created_at"), "isoformat") else doc.get("created_at")}
            for doc in cursor
        ]
    except Exception:
        return []
