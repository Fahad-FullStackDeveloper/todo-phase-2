"""
Alembic Environment Configuration for TodoFlow Application.

This module configures the Alembic migration environment for the
TodoFlow database schema using SQLModel and Neon Serverless PostgreSQL.

Key configurations:
    - Auto-detects model changes via SQLModel metadata
    - Supports both online and offline migration modes
    - Uses connection pooling for Neon compatibility
"""

import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Import SQLModel metadata from our models
from sqlmodel import SQLModel

# Import all models to ensure they are registered with metadata
from models import (  # noqa: F401
    User,
    Task,
    Project,
    Subtask,
    Label,
    TaskLabel,
    PomodoroSession,
)

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target metadata for autogenerate support
target_metadata = SQLModel.metadata


def get_database_url() -> str:
    """
    Get database URL from environment variable.
    
    Returns:
        str: Database connection URL with SSL mode for Neon
    """
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        # Fallback for migration generation (no DB connection needed)
        return "postgresql://user:password@localhost:5432/todoflow"
    
    # Ensure SSL mode is set for Neon connections
    if "neon.tech" in database_url and "sslmode" not in database_url:
        separator = "&" if "?" in database_url else "?"
        database_url = f"{database_url}{separator}sslmode=require"
    
    return database_url


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    
    This configures the context with just a URL and not an Engine,
    though an Engine is acceptable here as well. By skipping the Engine
    creation we don't even need a DBAPI to be available.
    
    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = get_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True,  # Enable batch mode for SQLite compatibility
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    
    In this scenario we need to create an Engine and associate a
    connection with the context.
    """
    # Get configuration from alembic.ini or environment
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_database_url()
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # Use NullPool for migrations
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,  # Enable batch mode for SQLite compatibility
            compare_type=True,     # Detect column type changes
            compare_server_default=True,  # Detect server default changes
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
