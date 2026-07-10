import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app as fastapi_app
from app.models import User  # noqa: F401  (importing app.models registers all tables on Base.metadata)
from app.models.category import SYSTEM_CATEGORIES, Category


@pytest.fixture
def engine():
    """Fresh in-memory SQLite database per test.

    Column types are kept portable (Uuid, non-native enums, JSON) precisely
    so the suite runs with zero infrastructure; dev/prod use Postgres.
    StaticPool shares the single in-memory connection across the TestClient's
    request threads.
    """
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    with sessionmaker(bind=engine)() as seed_session:
        seed_session.add_all(Category(name=name, user_id=None) for name in SYSTEM_CATEGORIES)
        seed_session.commit()
    yield engine
    engine.dispose()


@pytest.fixture
def db(engine) -> Session:
    TestSession = sessionmaker(bind=engine, expire_on_commit=False)
    session = TestSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(engine, db):
    def override_get_db():
        yield db

    fastapi_app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestClient(fastapi_app)
    finally:
        fastapi_app.dependency_overrides.clear()
