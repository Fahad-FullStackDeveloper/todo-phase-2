"""
Task Model for TodoFlow Application.

Core model for task management with support for priorities, due dates,
projects, labels, subtasks, and completion tracking.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import Index

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .user import User
    from .project import Project
    from .subtask import Subtask
    from .task_label import TaskLabel
    from .pomodoro_session import PomodoroSession


class TaskStatus(str):
    """Task status enumeration."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(int):
    """
    Task priority enumeration.

    1 = Urgent (highest priority)
    2 = High
    3 = Medium (default)
    4 = Low (lowest priority)
    """
    URGENT = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


class Task(SQLModelConfig, table=True):
    """
    Task model for TodoFlow application.

    Represents a single task with full metadata support including
    priorities, due dates, project assignment, labels, and subtasks.

    Attributes:
        id: UUID primary key (stored as string)
        user_id: Foreign key to users table (indexed)
        title: Task title (1-200 chars, required)
        description: Optional task description (max 10000 chars)
        status: Task status (todo/in_progress/done)
        priority: Priority level (1-4, default 3=Medium)
        due_date: Optional due date with timezone
        project_id: Optional foreign key to projects table
        completed: Boolean completion flag
        completed_at: Timestamp when task was completed
        position: Integer for manual ordering
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "tasks"

    # Primary Key (stored as string for Pydantic compatibility)
    id: str = Field(
        primary_key=True,
        description="Unique task identifier"
    )

    # Foreign Key to User - indexed for multi-tenant isolation
    user_id: str = Field(
        ...,
        foreign_key="users.id",
        index=True,
        description="Owner of the task (user isolation)"
    )
    
    # Title - Required, 1-200 characters
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (required, 1-200 characters)"
    )
    
    # Description - Optional, max 10000 characters
    description: Optional[str] = Field(
        default=None,
        max_length=10000,
        description="Optional task description (max 10000 characters)"
    )
    
    # Status - Enum with check constraint
    status: str = Field(
        default=TaskStatus.TODO,
        max_length=20,
        description="Task status: todo, in_progress, done"
    )
    
    # Priority - 1-4 (1=Urgent, 2=High, 3=Medium, 4=Low)
    priority: int = Field(
        default=TaskPriority.MEDIUM,
        ge=1,
        le=4,
        index=True,
        description="Priority level: 1=Urgent, 2=High, 3=Medium, 4=Low"
    )
    
    # Due Date - Optional with timezone
    due_date: Optional[datetime] = Field(
        default=None,
        index=True,
        description="Optional due date (timezone aware)"
    )

    # Project - Optional foreign key
    project_id: Optional[str] = Field(
        default=None,
        foreign_key="projects.id",
        index=True,
        description="Optional project assignment"
    )
    
    # Completed flag - indexed for filtering
    completed: bool = Field(
        default=False,
        index=True,
        description="Task completion status"
    )
    
    # Completed timestamp
    completed_at: Optional[datetime] = Field(
        default=None,
        description="Timestamp when task was completed"
    )
    
    # Position for manual ordering
    position: int = Field(
        default=0,
        description="Position for manual task ordering"
    )
    
    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
        description="Task creation timestamp"
    )
    
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="tasks")
    
    project: Optional["Project"] = Relationship(
        back_populates="tasks",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    
    subtasks: list["Subtask"] = Relationship(
        back_populates="task",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "lazy": "selectin"
        }
    )
    
    task_labels: list["TaskLabel"] = Relationship(
        back_populates="task",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "lazy": "selectin"
        }
    )
    
    pomodoro_sessions: list["PomodoroSession"] = Relationship(
        back_populates="task",
        sa_relationship_kwargs={
            "lazy": "selectin"
        }
    )
    
    # Index definitions for common query patterns
    __table_args__ = (
        # Composite index for user filtering with status
        Index("ix_tasks_user_status", "user_id", "status"),
        # Composite index for user filtering with due date
        Index("ix_tasks_user_due_date", "user_id", "due_date"),
        # Composite index for user filtering with priority
        Index("ix_tasks_user_priority", "user_id", "priority"),
        # Composite index for user filtering with completion
        Index("ix_tasks_user_completed", "user_id", "completed"),
        # Index for overdue task queries
        Index("ix_tasks_due_date_completed", "due_date", "completed"),
    )
    
    @property
    def is_overdue(self) -> bool:
        """Check if task is overdue."""
        if self.due_date and not self.completed:
            return self.due_date < datetime.utcnow()
        return False
    
    @property
    def priority_label(self) -> str:
        """Get human-readable priority label."""
        labels = {
            TaskPriority.URGENT: "Urgent",
            TaskPriority.HIGH: "High",
            TaskPriority.MEDIUM: "Medium",
            TaskPriority.LOW: "Low",
        }
        return labels.get(self.priority, "Medium")
