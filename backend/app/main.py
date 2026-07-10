from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import accounts, ai_events, auth, categorization, insights, nlq, transactions, uploads
from app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        description="Transaction categorization and spending insights API",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["meta"])
    def health() -> dict:
        return {"status": "ok"}

    app.include_router(auth.router)
    app.include_router(accounts.router)
    app.include_router(uploads.router)
    app.include_router(transactions.router)
    app.include_router(categorization.router)
    app.include_router(categorization.categories_router)
    app.include_router(insights.router)
    app.include_router(nlq.router)
    app.include_router(ai_events.router)
    return app


app = create_app()
