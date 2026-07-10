from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Personal Finance AI Tracker"
    debug: bool = False

    # Comma-separated list of allowed browser origins (the deployed frontend
    # URL goes here, e.g. "https://finsight.vercel.app").
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    database_url: str = "postgresql+psycopg2://finance:finance@localhost:5432/finance_tracker"

    # MongoDB — stores AI telemetry (raw LLM call events). Optional: empty URL
    # or an unreachable server disables telemetry without affecting anything else.
    mongodb_url: str = ""
    mongodb_db: str = "finsight"

    # Auth
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    # LLM provider: "anthropic" (default) or "openai" (any OpenAI-compatible
    # endpoint — OpenAI itself, Gemini, Groq, Ollama, GitHub Models, ...).
    llm_provider: str = "anthropic"

    # Anthropic (used when llm_provider=anthropic). Haiku is the cheap tier.
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-haiku-4-5"

    # OpenAI-compatible (used when llm_provider=openai). See .env.example for
    # base_url/model combos for free providers.
    openai_api_key: str = ""
    openai_base_url: str = ""  # empty = api.openai.com
    openai_model: str = "gpt-4o-mini"

    llm_batch_size: int = 20
    # Rule-based confidence below this threshold falls through to the LLM.
    rule_confidence_threshold: float = 0.7


@lru_cache
def get_settings() -> Settings:
    return Settings()
