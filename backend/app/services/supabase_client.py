"""
JobPrep AI — Supabase Client (Backend)
Singleton client for server-side database operations.
Uses the service role key for full access.
"""

from supabase import create_client, Client
from app.config import get_settings

_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    """
    Returns a cached Supabase client instance.
    Uses the service role key for backend operations.
    """
    global _supabase_client

    if _supabase_client is None:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_service_key:
            raise ValueError(
                "Supabase URL and Service Key must be configured. "
                "Set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file."
            )
        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_service_key,
        )

    return _supabase_client
