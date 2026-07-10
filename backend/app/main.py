"""
JobPrep AI — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import health, resume

settings = get_settings()

# ============================================
# App Initialization
# ============================================

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Privacy-focused AI-powered interview preparation API.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ============================================
# Middleware
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Routers
# ============================================

app.include_router(health.router)
app.include_router(resume.router)

# Future routers:
# app.include_router(prep_plan.router)
# app.include_router(deep_dive.router)


# ============================================
# Startup Event
# ============================================

@app.on_event("startup")
async def startup_event():
    """Log startup info."""
    print(f"🚀 {settings.app_name} v{settings.app_version} starting up...")
    if settings.supabase_url:
        print(f"📦 Supabase connected: {settings.supabase_url[:30]}...")
    else:
        print("⚠️  Supabase URL not configured — running without database.")
    if settings.gemini_api_key:
        print("🤖 Gemini API key configured.")
    else:
        print("⚠️  Gemini API key not configured — agent features will fail.")
