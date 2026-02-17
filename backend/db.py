"""
Database Connection for TodoFlow Application.

Configures the database engine and session factory for Neon Serverless PostgreSQL
with SQLModel ORM. Includes connection pooling and SSL configuration for production.

Environment Variables:
    DATABASE_URL: PostgreSQL connection string (required)
                  Format: postgresql://user:password@host:port/database

Neon-Specific Configuration:
    - SSL mode: require (Neon requirement for all connections)
    - Connection pooling: pool_size=5, max_overflow=10
    - Pool pre-ping: enabled for connection health checks
"""

import os
from typing import Generator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlmodel import Session, SQLModel

# Import all models to ensure they are registered with SQLModel metadata
from .models import (  # noqa: F401
    User,
    Task,
    Project,
    Subtask,
    Label,
    TaskLabel,
    PomodoroSession,
)


def get_database_url() -> str:
    """
    Get the database URL from environment variables.
    
    Returns:
        str: Database connection URL
        
    Raises:
        ValueError: If DATABASE_URL is not set
    """
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        raise ValueError(
            "DATABASE_URL environment variable is required. "
            "Example: postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname"
        )
    
    # Ensure SSL mode is set for Neon connections
    if "neon.tech" in database_url and "sslmode" not in database_url:
        # Add sslmode=require for Neon connections
        separator = "&" if "?" in database_url else "?"
        database_url = f"{database_url}{separator}sslmode=require"
    
    return database_url


# Create engine with Neon-optimized configuration
engine = create_engine(
    get_database_url(),
    # Connection pooling configuration
    pool_size=5,           # Number of connections to keep in pool
    max_overflow=10,       # Additional connections allowed beyond pool_size
    pool_pre_ping=True,    # Verify connections before use (handles Neon idle timeouts)
    pool_recycle=300,      # Recycle connections after 5 minutes
    # Echo SQL for debugging (disable in production)
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
)


def create_db_and_tables() -> None:
    """
    Create all database tables.
    
    Warning: This will create tables but NOT run migrations.
    For production, use Alembic migrations instead.
    
    Usage:
        from backend.db import create_db_and_tables
        create_db_and_tables()
    """
    SQLModel.metadata.create_all(engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency for database sessions.
    
    Yields:
        Session: SQLModel database session
        
    Usage in FastAPI:
        @app.get("/tasks")
        def get_tasks(db: Session = Depends(get_db)):
            ...
    """
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """
    Context manager for database sessions.
    
    Usage:
        with get_db_context() as db:
            tasks = db.exec(select(Task).where(Task.user_id == user_id))
    """
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Async support for asyncpg driver (optional, for async endpoints)
def get_async_database_url() -> str:
    """
    Get async database URL for asyncpg driver.
    
    Converts postgresql:// to postgresql+asyncpg://
    """
    url = get_database_url()
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url
