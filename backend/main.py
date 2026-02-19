"""
TodoFlow Backend - FastAPI Application Entry Point.

Main application configuration including:
- FastAPI app initialization
- CORS middleware configuration
- Route registration
- Lifespan events (startup/shutdown)
- OpenAPI documentation

Environment Variables:
    DATABASE_URL: PostgreSQL connection string (required)
    BETTER_AUTH_SECRET: JWT signing secret (required, min 32 chars)
    FRONTEND_URL: Frontend origin for CORS (default: http://localhost:3000)
    SQL_ECHO: Enable SQL logging (default: false)
"""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

from db import engine, create_db_and_tables
from routes.auth import router as auth_router
from routes.tasks import router as tasks_router
from routes.subtasks import router as subtasks_router
from routes.projects import router as projects_router
from routes.labels import router as labels_router
from routes.dashboard import router as dashboard_router
from routes.pomodoro import router as pomodoro_router


# =============================================================================
# Configuration
# =============================================================================

def get_allowed_origins() -> list[str]:
    """
    Get allowed CORS origins from environment variables.

    Returns:
        List of allowed origin URLs
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    allowed_origins = [origin.strip() for origin in frontend_url.split(",")]

    # Always allow localhost for development
    if "http://localhost:3000" not in allowed_origins:
        allowed_origins.append("http://localhost:3000")

    return allowed_origins


# =============================================================================
# Lifespan Events
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.

    Handles startup and shutdown events:
    - Startup: Create database tables (for development)
    - Shutdown: Cleanup resources
    """
    # Startup
    print("[INFO] Starting TodoFlow Backend...")
    print(f"[INFO] Database URL: {'postgresql://***' if os.getenv('DATABASE_URL') else 'NOT SET'}")
    print(f"[INFO] Auth Secret: {'***' if os.getenv('BETTER_AUTH_SECRET') else 'NOT SET'}")
    print(f"[INFO] Allowed Origins: {get_allowed_origins()}")

    # Create tables if they don't exist (development only)
    # In production, use Alembic migrations
    create_db_and_tables()
    print("[INFO] Database tables ready")

    yield

    # Shutdown
    print("[INFO] Shutting down TodoFlow Backend...")
    engine.dispose()


# =============================================================================
# FastAPI Application
# =============================================================================

app = FastAPI(
    title="TodoFlow API",
    description="""
## TodoFlow - Premium SaaS Todo Application API

A production-grade REST API for task management with JWT authentication,
user isolation, and premium features.

### Features

- **Authentication**: JWT-based auth with Better Auth compatibility
- **Tasks**: Full CRUD with priorities, due dates, projects, labels, subtasks
- **Projects**: Organize tasks with color-coded projects
- **Labels**: Flexible tagging system
- **Dashboard**: Analytics, streaks, and activity tracking
- **Pomodoro**: Focus session tracking

### Authentication

All endpoints require JWT authentication. Include the token in the
Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Isolation

All data is isolated by user. Users can only access their own tasks,
projects, labels, and sessions.
    """,
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# =============================================================================
# CORS Middleware
# =============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Page", "X-Limit"],
    max_age=600,
)

# =============================================================================
# Route Registration
# =============================================================================

app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(subtasks_router)
app.include_router(projects_router)
app.include_router(labels_router)
app.include_router(dashboard_router)
app.include_router(pomodoro_router)

# =============================================================================
# Health Check
# =============================================================================


@app.get(
    "/health",
    tags=["Health"],
    summary="Health Check",
    description="Check if the API is running and database is connected.",
)
async def health_check() -> dict:
    """
    Health check endpoint.

    Returns API status and database connectivity.
    """
    return {
        "status": "healthy",
        "version": "2.0.0",
        "database": "connected",
    }


@app.get(
    "/",
    tags=["Root"],
    summary="Root Endpoint",
    description="Welcome message and API information.",
)
async def root() -> dict:
    """
    Root endpoint with API information.
    """
    return {
        "name": "TodoFlow API",
        "version": "2.0.0",
        "description": "Premium SaaS Todo Application Backend",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
    }


# =============================================================================
# Exception Handlers
# =============================================================================

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlmodel import SQLModel


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """
    Handle validation errors with consistent error format.
    """
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        })

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation Error",
            "details": errors,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """
    Handle unexpected exceptions with consistent error format.
    """
    # Log the error in production
    print(f"Unexpected error: {exc}")

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
        },
    )
