"""
JobPrep AI — Backend Configuration
Loads environment variables via Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Supabase
    supabase_url: str = ""
    supabase_service_key: str = ""

    # Google Gemini
    gemini_api_key: str = ""

    # Model Configuration (configurable per tier in future)
    gemini_model_resume: str = "gemini-3-flash-preview"
    gemini_model_prep_plan: str = "gemini-3-flash-preview"
    gemini_model_deep_dive: str = "gemini-3-flash-preview"
    gemini_model_default: str = "gemini-3-flash-preview"

    # CORS
    cors_origins: str = "http://localhost:3000"

    # App
    app_name: str = "JobPrep AI"
    app_version: str = "0.2.0"
    debug: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — loaded once per process."""
    return Settings()
