"""
PomodoroSession Model for TodoFlow Application.

Tracks pomodoro focus sessions for productivity analytics,
including session duration, completion status, and optional task association.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .user import User
    from .task import Task


class PomodoroSession(SQLModelConfig, table=True):
    """
    PomodoroSession model for TodoFlow application.

    Tracks individual pomodoro focus sessions for productivity analytics.
    Sessions can be linked to specific tasks and include duration tracking.

    Attributes:
        id: UUID primary key (stored as string)
        user_id: Foreign key to users table (indexed)
        task_id: Optional foreign key to tasks table
        duration_minutes: Session duration in minutes
        completed: Whether the session was completed
        session_date: Date/time when the session occurred
        created_at: Record creation timestamp
    """

    __tablename__ = "pomodoro_sessions"

    # Primary Key (stored as string for Pydantic compatibility)
    id: str = Field(
        primary_key=True,
        description="Unique session identifier"
    )

    # Foreign Key to User - indexed for multi-tenant isolation
    user_id: str = Field(
        ...,
        foreign_key="users.id",
        index=True,
        description="Owner of the session (user isolation)"
    )

    # Foreign Key to Task - Optional (session can exist without task)
    task_id: Optional[str] = Field(
        default=None,
        foreign_key="tasks.id",
        index=True,
        description="Optional associated task"
    )
    
    # Duration in minutes
    duration_minutes: int = Field(
        ...,
        gt=0,
        le=180,
        description="Session duration in minutes (1-180)"
    )
    
    # Completion status
    completed: bool = Field(
        default=True,
        description="Whether the session was completed"
    )
    
    # Session date - when the focus session occurred
    session_date: datetime = Field(
        ...,
        description="Date/time when the session occurred"
    )
    
    # Timestamp
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Record creation timestamp"
    )
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="pomodoro_sessions")
    
    task: Optional["Task"] = Relationship(
        back_populates="pomodoro_sessions",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
