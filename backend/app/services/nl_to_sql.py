"""Natural-language → SQL with defense in depth.

The LLM only *proposes* SQL; nothing it produces is trusted:

1. Parse with sqlglot — unparseable or multi-statement input is rejected.
2. The statement must be a plain SELECT (no unions, no DML/DDL).
3. Every referenced table must be in the allowlist, unqualified.
4. User scoping is injected server-side: the real tables are shadowed by
   CTEs pre-filtered to the current user, so even a query that "forgets"
   the user filter can only ever see that user's rows.
5. A row cap is enforced (LIMIT injected or tightened).

Every attempt — including rejections — is audited in nl_queries.
"""

import time
import uuid
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Protocol

import anthropic
import sqlglot
from pydantic import BaseModel
from sqlglot import exp

from app.core.config import get_settings
from app.models.category import SYSTEM_CATEGORIES

MAX_ROWS = 200

ALLOWED_TABLES = {"transactions", "categories", "accounts"}

# Scoped CTE sources, pre-filtered to :user_id. Every table reference in the
# generated SQL is rewritten to point at these (same-name CTE shadowing would
# be flagged as a circular reference by SQLite).
_SCOPED_SOURCES = {
    "transactions": "SELECT * FROM transactions WHERE user_id = :user_id",
    "accounts": "SELECT * FROM accounts WHERE user_id = :user_id",
    "categories": "SELECT * FROM categories WHERE user_id IS NULL OR user_id = :user_id",
}

_SCOPED_NAME = {name: f"scoped_{name}" for name in _SCOPED_SOURCES}


class NLQueryRejected(ValueError):
    """Generated SQL failed validation. The reason is safe to show the user."""


def validate_and_scope(sql: str, dialect: str) -> str:
    """Validate LLM-generated SQL and return an executable, user-scoped query."""
    try:
        statements = sqlglot.parse(sql)
    except sqlglot.errors.ParseError as exc:
        raise NLQueryRejected(f"SQL failed to parse: {exc}")

    statements = [s for s in statements if s is not None]
    if len(statements) != 1:
        raise NLQueryRejected("exactly one SQL statement is allowed")
    statement = statements[0]

    if not isinstance(statement, exp.Select):
        raise NLQueryRejected("only plain SELECT statements are allowed")

    # Names defined by the query itself (its own CTEs) don't hit real tables —
    # but a query-local CTE named like a real table would make that CTE's body
    # resolve to the *unscoped* table, so collisions are rejected outright.
    local_ctes = {cte.alias_or_name.lower() for cte in statement.find_all(exp.CTE)}
    if local_ctes & ALLOWED_TABLES:
        raise NLQueryRejected("CTE names may not shadow table names")
    for table in statement.find_all(exp.Table):
        name = table.name.lower()
        if table.db or table.catalog:
            raise NLQueryRejected(f"qualified table names are not allowed: {table.sql()}")
        if name in local_ctes:
            continue
        if name not in ALLOWED_TABLES:
            raise NLQueryRejected(f"table not allowed: {name}")

    # Rewrite every real-table reference (including inside query-local CTE
    # bodies) to the scoped CTE name, keeping the original name as an alias so
    # column references like transactions.amount still resolve.
    scoped = statement.copy()
    for table in scoped.find_all(exp.Table):
        name = table.name.lower()
        if name not in ALLOWED_TABLES:
            continue
        table.set("this", exp.to_identifier(_SCOPED_NAME[name]))
        if not table.alias:
            table.set("alias", exp.TableAlias(this=exp.to_identifier(name)))

    # Prepend the scoped CTEs (a CTE may only reference CTEs defined earlier).
    for table_name in sorted(ALLOWED_TABLES):
        scoped = scoped.with_(_SCOPED_NAME[table_name], as_=_SCOPED_SOURCES[table_name])
    with_node = scoped.args["with_"]
    shadows = [cte for cte in with_node.expressions if cte.alias_or_name in _SCOPED_NAME.values()]
    others = [cte for cte in with_node.expressions if cte.alias_or_name not in _SCOPED_NAME.values()]
    with_node.set("expressions", shadows + others)

    # Enforce the row cap.
    limit = scoped.args.get("limit")
    if limit is None or int(limit.expression.name) > MAX_ROWS:
        scoped = scoped.limit(MAX_ROWS)

    rendered = scoped.sql(dialect=dialect)
    # sqlglot renders the placeholder psycopg-style on postgres; SQLAlchemy's
    # text() binds :user_id on every backend.
    return rendered.replace("%(user_id)s", ":user_id")


# --- LLM generation -----------------------------------------------------------

GENERATOR_PROMPT_VERSION = "v1"

GENERATOR_SYSTEM_PROMPT = """You translate a user's question about their personal finances into one SQL SELECT statement.

Schema (all tables are already filtered to the current user — never filter by user_id yourself):

transactions(
    id, account_id, txn_date DATE, merchant_raw TEXT, merchant_normalized TEXT,
    description TEXT, amount NUMERIC, currency TEXT, category_id INT NULL
)
-- amount is signed: negative = money spent, positive = money received.
-- "How much was spent" therefore means SUM(-amount) over rows WHERE amount < 0.

categories(id INT, name TEXT)
-- names: {categories}

accounts(id, name TEXT, account_type TEXT, currency TEXT)

Rules:
- One plain SELECT only. No unions, no comments, no semicolons.
- Unqualified table names only (no schema prefixes).
- Today is {today}. Resolve relative ranges ("last month") to explicit ISO
  date literals; do not use dialect-specific date functions.
- "food" usually means the groceries and dining categories together.
- Alias aggregate columns with readable names (e.g. AS total_spent)."""


class GeneratedSQL(BaseModel):
    sql: str


@dataclass(frozen=True)
class GenerationResult:
    sql: str
    latency_ms: int
    model: str


class SQLGeneratorProtocol(Protocol):
    """Anything that turns a question into SQL — Anthropic, OpenAI-compatible, or a test fake."""

    def generate(self, question: str) -> GenerationResult: ...


class SQLGenerator:
    def __init__(self, client: anthropic.Anthropic | None = None, model: str | None = None):
        settings = get_settings()
        self._client = client or anthropic.Anthropic(api_key=settings.anthropic_api_key or None)
        self.model = model or settings.anthropic_model

    def generate(self, question: str) -> GenerationResult:
        started = time.monotonic()
        response = self._client.messages.parse(
            model=self.model,
            max_tokens=1024,
            system=GENERATOR_SYSTEM_PROMPT.format(
                categories=", ".join(SYSTEM_CATEGORIES), today=date.today().isoformat()
            ),
            messages=[{"role": "user", "content": question}],
            output_format=GeneratedSQL,
        )
        return GenerationResult(
            sql=response.parsed_output.sql,
            latency_ms=int((time.monotonic() - started) * 1000),
            model=self.model,
        )


def user_id_param(user_id: uuid.UUID, dialect: str) -> str:
    """Format the user id the way this dialect's Uuid column stores it."""
    return user_id.hex if dialect == "sqlite" else str(user_id)


def jsonable(value):
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, (date,)):
        return value.isoformat()
    if isinstance(value, uuid.UUID):
        return str(value)
    return value
