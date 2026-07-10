"""Pre-start release tasks — run as `python release.py` before uvicorn on each deploy.

Handles three deployment realities that a bare `alembic upgrade head` does not:

1. Concurrent boots (platforms may start two instances at once): a Postgres
   advisory lock serializes the release step, so only one instance migrates.
2. Schema adoption: if the tables already exist but alembic_version does not
   (e.g. a previous racy deploy), the database is stamped instead of
   re-creating tables.
3. Seed integrity: system categories are inserted if missing.
"""

import logging

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text

from app.core.config import get_settings
from app.models.category import SYSTEM_CATEGORIES

logging.basicConfig(level=logging.INFO, format="release: %(message)s")
log = logging.getLogger(__name__)

RELEASE_LOCK_ID = 913001  # arbitrary app-wide advisory lock key


def main() -> None:
    engine = create_engine(get_settings().database_url)
    is_postgres = engine.dialect.name == "postgresql"
    alembic_cfg = Config("alembic.ini")

    lock_conn = engine.connect()
    try:
        if is_postgres:
            log.info("acquiring release lock…")
            lock_conn.execute(text("SELECT pg_advisory_lock(:key)"), {"key": RELEASE_LOCK_ID})

        tables = set(inspect(engine).get_table_names())
        if "users" in tables and "alembic_version" not in tables:
            log.info("existing schema without alembic stamp — adopting (stamp head)")
            command.stamp(alembic_cfg, "head")

        log.info("running migrations…")
        command.upgrade(alembic_cfg, "head")

        with engine.begin() as conn:
            seeded = conn.execute(
                text("SELECT COUNT(*) FROM categories WHERE user_id IS NULL")
            ).scalar()
            if not seeded:
                log.info("seeding %d system categories", len(SYSTEM_CATEGORIES))
                for name in SYSTEM_CATEGORIES:
                    conn.execute(
                        text("INSERT INTO categories (name, user_id) VALUES (:name, NULL)"),
                        {"name": name},
                    )
        log.info("done")
    finally:
        if is_postgres:
            lock_conn.execute(text("SELECT pg_advisory_unlock(:key)"), {"key": RELEASE_LOCK_ID})
        lock_conn.close()


if __name__ == "__main__":
    main()
