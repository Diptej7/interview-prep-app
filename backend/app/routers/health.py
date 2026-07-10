"""
JobPrep AI — Health Check Router
"""

from fastapi import APIRouter
from app.config import get_settings

router = APIRouter(prefix="/api", tags=["health"])
settings = get_settings()


@router.get("/health")
async def health_check():
    """Health check endpoint — returns app status and version."""
    return {
        "status": "healthy",
        "version": settings.app_version,
        "app": settings.app_name,
    }
