"""
User Model for TodoFlow Application.

This model integrates with Better Auth for authentication.
The User model is minimal as Better Auth manages additional user fields.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .task import Task
    from .project import Project
    from .label import Label
    from .pomodoro_session import PomodoroSession


class User(SQLModelConfig, table=True):
    """
    User model for TodoFlow application.

    This model is designed to work with Better Auth for authentication.
    Additional user fields are managed by Better Auth's user table.

    Attributes:
        id: UUID primary key from Better Auth (stored as string)
        email: Unique email address (indexed)
        name: User's display name
        password_hash: Hashed password from Better Auth
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "users"

    # Primary Key - UUID from Better Auth (stored as string for Pydantic compatibility)
    id: str = Field(default=None, primary_key=True)
    
    # Email - Unique and indexed for fast lookups
    email: str = Field(
        ...,
        max_length=255,
        unique=True,
        index=True,
        description="User's email address (unique)"
    )
    
    # Name - Display name for the user
    name: str = Field(
        ...,
        max_length=100,
        description="User's display name"
    )
    
    # Password hash - Managed by Better Auth
    password_hash: str = Field(
        ...,
        max_length=255,
        description="Hashed password from Better Auth"
    )
    
    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Account creation timestamp"
    )
    
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
    
    # Relationships - One-to-Many
    tasks: list["Task"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    
    projects: list["Project"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    
    labels: list["Label"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    
    pomodoro_sessions: list["PomodoroSession"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
