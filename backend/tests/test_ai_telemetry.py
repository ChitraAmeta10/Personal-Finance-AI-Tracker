import uuid
from datetime import datetime, timezone

from app.db.mongo import get_ai_events_collection
from app.main import app as fastapi_app
from app.services.ai_telemetry import log_ai_event, recent_ai_events


class FakeCollection:
    """In-memory stand-in for a pymongo Collection (insert_one/find/sort/limit)."""

    def __init__(self, fail=False):
        self.docs: list[dict] = []
        self.fail = fail

    def insert_one(self, doc):
        if self.fail:
            raise RuntimeError("mongo down")
        self.docs.append(doc)

    def find(self, query, projection):
        if self.fail:
            raise RuntimeError("mongo down")
        user_id = query["user_id"]
        results = [dict(d) for d in self.docs if d["user_id"] == user_id]
        outer = self

        class Cursor(list):
            def sort(self, key, direction):
                return Cursor(sorted(self, key=lambda d: d[key], reverse=direction == -1))

            def limit(self, n):
                return Cursor(self[:n])

        return Cursor(results)


USER = uuid.uuid4()


def test_log_and_read_events():
    coll = FakeCollection()
    log_ai_event("nlq_generation", USER, {"status": "ok", "model": "m"}, collection=coll)
    log_ai_event("categorization_batch", OTHER := uuid.uuid4(), {"status": "ok"}, collection=coll)
    events = recent_ai_events(USER, collection=coll)
    assert len(events) == 1
    assert events[0]["kind"] == "nlq_generation"
    assert isinstance(events[0]["created_at"], str)  # serialized for JSON


def test_telemetry_never_raises():
    broken = FakeCollection(fail=True)
    log_ai_event("nlq_generation", USER, {"x": 1}, collection=broken)  # swallowed
    assert recent_ai_events(USER, collection=broken) == []


def test_disabled_when_mongo_unconfigured():
    log_ai_event("kind", USER, {}, collection=None)  # no-op
    assert recent_ai_events(USER, collection=None) == []


def test_events_endpoint(client):
    client.post("/auth/register", json={"email": "t@example.com", "password": "s3cret-pass"})
    token = client.post("/auth/login", data={"username": "t@example.com", "password": "s3cret-pass"}).json()[
        "access_token"
    ]
    headers = {"Authorization": f"Bearer {token}"}

    # Mongo unavailable -> enabled false, empty events
    fastapi_app.dependency_overrides[get_ai_events_collection] = lambda: None
    body = client.get("/ai/events", headers=headers).json()
    assert body == {"enabled": False, "events": []}

    # With a (fake) collection -> events returned
    coll = FakeCollection()
    fastapi_app.dependency_overrides[get_ai_events_collection] = lambda: coll
    me = client.get("/auth/me", headers=headers).json()
    coll.insert_one(
        {
            "kind": "nlq_generation",
            "user_id": me["id"],
            "created_at": datetime.now(timezone.utc),
            "status": "ok",
        }
    )
    body = client.get("/ai/events", headers=headers).json()
    assert body["enabled"] is True
    assert len(body["events"]) == 1
    assert body["events"][0]["kind"] == "nlq_generation"
