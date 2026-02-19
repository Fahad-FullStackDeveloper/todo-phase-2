"""
Task Model for TodoFlow Application.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Index
from sqlalchemy.orm import declared_attr, relationship
from sqlmodel import Field, SQLModel
from typing import ClassVar

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .user import User
    from .project import Project
    from .subtask import Subtask
    from .task_label import TaskLabel
    from .pomodoro_session import PomodoroSession


class TaskStatus(str):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(int):
    URGENT = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


class Task(SQLModelConfig, table=True):
    __tablename__ = "tasks"

    id: str = Field(primary_key=True)
    user_id: str = Field(..., foreign_key="users.id", index=True)
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=10000)
    status: str = Field(default=TaskStatus.TODO, max_length=20)
    priority: int = Field(default=TaskPriority.MEDIUM, ge=1, le=4, index=True)
    due_date: Optional[datetime] = Field(default=None, index=True)
    project_id: Optional[str] = Field(default=None, foreign_key="projects.id", index=True)
    completed: bool = Field(default=False, index=True)
    completed_at: Optional[datetime] = Field(default=None)
    position: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @declared_attr
    def user(cls) -> ClassVar:
        return relationship("User", back_populates="tasks")

    @declared_attr
    def project(cls) -> ClassVar:
        return relationship("Project", back_populates="tasks", lazy="selectin")

    @declared_attr
    def subtasks(cls) -> ClassVar:
        return relationship("Subtask", back_populates="task", cascade="all, delete-orphan", lazy="selectin")

    @declared_attr
    def task_labels(cls) -> ClassVar:
        return relationship("TaskLabel", back_populates="task", cascade="all, delete-orphan", lazy="selectin")

    @declared_attr
    def pomodoro_sessions(cls) -> ClassVar:
        return relationship("PomodoroSession", back_populates="task", lazy="selectin")

    __table_args__ = (
        Index("ix_tasks_user_status", "user_id", "status"),
        Index("ix_tasks_user_due_date", "user_id", "due_date"),
        Index("ix_tasks_user_priority", "user_id", "priority"),
        Index("ix_tasks_user_completed", "user_id", "completed"),
        Index("ix_tasks_due_date_completed", "due_date", "completed"),
    )
