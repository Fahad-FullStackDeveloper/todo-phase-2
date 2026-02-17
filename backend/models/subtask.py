"""
Subtask Model for TodoFlow Application.

Subtasks allow breaking down tasks into smaller, manageable checkable items
with independent completion tracking and ordering.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .task import Task


class Subtask(SQLModelConfig, table=True):
    """
    Subtask model for TodoFlow application.

    Subtasks represent smaller units of work within a parent task.
    Each subtask has independent completion status and can be ordered.

    Attributes:
        id: UUID primary key (stored as string)
        task_id: Foreign key to tasks table (indexed)
        title: Subtask title (1-200 chars, required)
        completed: Boolean completion status
        position: Integer for ordering subtasks
        created_at: Creation timestamp
    """

    __tablename__ = "subtasks"

    # Primary Key (stored as string for Pydantic compatibility)
    id: str = Field(
        primary_key=True,
        description="Unique subtask identifier"
    )

    # Foreign Key to Task - indexed for efficient lookups
    task_id: str = Field(
        ...,
        foreign_key="tasks.id",
        index=True,
        description="Parent task (cascade delete)"
    )
    
    # Title - Required, 1-200 characters
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Subtask title (required, 1-200 characters)"
    )
    
    # Completed flag
    completed: bool = Field(
        default=False,
        description="Subtask completion status"
    )
    
    # Position for ordering
    position: int = Field(
        default=0,
        ge=0,
        description="Position for subtask ordering (>= 0)"
    )
    
    # Timestamp
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Subtask creation timestamp"
    )
    
    # Relationships
    task: Optional["Task"] = Relationship(back_populates="subtasks")
