"""
TaskLabel Junction Model for TodoFlow Application.

This model implements the many-to-many relationship between Tasks and Labels,
allowing tasks to have multiple labels and labels to be assigned to multiple tasks.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .task import Task
    from .label import Label


class TaskLabel(SQLModelConfig, table=True):
    """
    TaskLabel junction model for TodoFlow application.

    Implements the many-to-many relationship between tasks and labels.
    Uses a composite primary key (task_id, label_id) for efficient lookups.

    Attributes:
        task_id: Foreign key to tasks table (part of composite PK)
        label_id: Foreign key to labels table (part of composite PK)
        created_at: Association creation timestamp
    """

    __tablename__ = "task_labels"

    # Composite Primary Key (stored as strings for Pydantic compatibility)
    task_id: str = Field(
        ...,
        foreign_key="tasks.id",
        primary_key=True,
        index=True,
        description="Task reference (composite PK)"
    )

    label_id: str = Field(
        ...,
        foreign_key="labels.id",
        primary_key=True,
        index=True,
        description="Label reference (composite PK)"
    )
    
    # Timestamp
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Association creation timestamp"
    )
    
    # Relationships
    task: "Task" = Relationship(back_populates="task_labels")
    
    label: "Label" = Relationship(back_populates="task_labels")
