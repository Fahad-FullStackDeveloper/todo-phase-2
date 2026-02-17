"""
SQLModel Configuration for TodoFlow Application.

This module defines the naming conventions and metadata configuration
for all database tables and indexes following Neon PostgreSQL best practices.
"""

from sqlmodel import SQLModel
from sqlalchemy import MetaData


# Naming convention for indexes and constraints
# Follows PostgreSQL best practices for consistency
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


# Create shared metadata with naming convention
metadata = MetaData(naming_convention=NAMING_CONVENTION)


class SQLModelConfig(SQLModel):
    """
    Base configuration class for all SQLModel models.

    Provides consistent naming conventions and metadata across all tables.
    All models should inherit from this class or use its metadata.
    """

    model_config = {
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "created_at": "2026-02-17T10:30:00Z",
                "updated_at": "2026-02-17T10:30:00Z",
            }
        }
    }
