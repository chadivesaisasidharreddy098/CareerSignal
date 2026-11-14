"""Application configuration and settings management using Pydantic Settings."""

import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Core application settings loaded from environment variables."""

    APP_NAME: str = "CareerSignal API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database settings (defaults to aiosqlite for zero-config local dev, override with PostgreSQL in production)
    DATABASE_URL: str = "sqlite+aiosqlite:///./careersignal.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI & Services
    GEMINI_API_KEY: str = ""

    # Security
    SECRET_KEY: str = "change_this_to_a_random_secret_key_in_production"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8081,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """Returns cached application settings instance."""
    return Settings()
