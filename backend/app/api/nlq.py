import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models import NLQuery, NLQueryStatus, User
from app.schemas.nlq import NLQueryRead, NLQueryRequest, NLQueryResponse
from app.services.ai_telemetry import log_ai_event
from app.services.nl_to_sql import (
    NLQueryRejected,
    SQLGenerator,
    SQLGeneratorProtocol,
    jsonable,
    user_id_param,
    validate_and_scope,
)
from app.services.openai_compat import OpenAICompatSQLGenerator

router = APIRouter(prefix="/nlq", tags=["nlq"])


def get_sql_generator() -> SQLGeneratorProtocol | None:
    settings = get_settings()
    if settings.llm_provider == "openai":
        if settings.openai_api_key or settings.openai_base_url:
            return OpenAICompatSQLGenerator()
        return None
    if not settings.anthropic_api_key:
        return None
    return SQLGenerator()


def _audit(db: Session, user: User, question: str, **fields) -> None:
    db.add(NLQuery(user_id=user.id, question=question, **fields))
    db.commit()


@router.post("", response_model=NLQueryResponse)
def ask(
    payload: NLQueryRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    generator: SQLGeneratorProtocol | None = Depends(get_sql_generator),
) -> NLQueryResponse:
    if generator is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Natural-language queries require an LLM API key (see .env.example)",
        )

    started = time.monotonic()
    try:
        generated = generator.generate(payload.question)
    except Exception as exc:
        _audit(db, user, payload.question, status=NLQueryStatus.FAILED, error=f"generation: {exc}")
        log_ai_event("nlq_generation", user.id, {"status": "generation_failed", "question": payload.question})
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="SQL generation failed")

    log_ai_event(
        "nlq_generation",
        user.id,
        {
            "status": "ok",
            "question": payload.question,
            "model": generated.model,
            "latency_ms": generated.latency_ms,
            "sql": generated.sql,
        },
    )

    dialect = db.get_bind().dialect.name
    try:
        executable = validate_and_scope(generated.sql, dialect="postgres" if dialect == "postgresql" else dialect)
    except NLQueryRejected as exc:
        _audit(
            db,
            user,
            payload.question,
            generated_sql=generated.sql,
            status=NLQueryStatus.REJECTED,
            error=str(exc),
            latency_ms=generated.latency_ms,
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Query rejected: {exc}")

    try:
        result = db.execute(text(executable), {"user_id": user_id_param(user.id, dialect)})
        columns = list(result.keys())
        rows = [[jsonable(value) for value in row] for row in result.fetchall()]
    except Exception as exc:
        db.rollback()
        _audit(
            db,
            user,
            payload.question,
            generated_sql=generated.sql,
            status=NLQueryStatus.FAILED,
            error=f"execution: {exc}",
            latency_ms=generated.latency_ms,
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Query failed to execute")

    latency_ms = int((time.monotonic() - started) * 1000)
    _audit(
        db,
        user,
        payload.question,
        generated_sql=generated.sql,
        status=NLQueryStatus.EXECUTED,
        row_count=len(rows),
        latency_ms=latency_ms,
    )
    return NLQueryResponse(
        question=payload.question,
        sql=generated.sql,
        columns=columns,
        rows=rows,
        row_count=len(rows),
        latency_ms=latency_ms,
    )


@router.get("/history", response_model=list[NLQueryRead])
def history(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[NLQuery]:
    return list(
        db.scalars(
            select(NLQuery).where(NLQuery.user_id == user.id).order_by(NLQuery.created_at.desc()).limit(50)
        )
    )
