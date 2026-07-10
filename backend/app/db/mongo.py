"""MongoDB connection for AI telemetry.

Polyglot-persistence split: PostgreSQL is the system of record (relational
ledger, auth, audit tables); MongoDB holds AI telemetry — raw LLM call events
whose shape varies by provider and evolves freely, which is exactly what a
document store is for.

Mongo is strictly optional: an empty MONGODB_URL or an unreachable server
disables telemetry and nothing else notices.
"""

from functools import lru_cache

from pymongo import MongoClient
from pymongo.collection import Collection

from app.core.config import get_settings

AI_EVENTS_COLLECTION = "ai_events"


@lru_cache
def _client() -> MongoClient | None:
    url = get_settings().mongodb_url
    if not url:
        return None
    try:
        client: MongoClient = MongoClient(url, serverSelectionTimeoutMS=1500)
        client.admin.command("ping")
        return client
    except Exception:
        return None


def get_ai_events_collection() -> Collection | None:
    """FastAPI dependency / service accessor. None when Mongo is unavailable."""
    client = _client()
    if client is None:
        return None
    return client[get_settings().mongodb_db][AI_EVENTS_COLLECTION]
