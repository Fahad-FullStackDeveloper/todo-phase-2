"""
PomodoroSession Model for TodoFlow Application.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy.orm import declared_attr, relationship
from sqlmodel import Field, SQLModel
from typing import ClassVar

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .user import User
    from .task import Task


class PomodoroSession(SQLModelConfig, table=True):
    __tablename__ = "pomodoro_sessions"

    id: str = Field(primary_key=True)
    user_id: str = Field(..., foreign_key="users.id", index=True)
    task_id: Optional[str] = Field(default=None, foreign_key="tasks.id", index=True)
    duration_minutes: int = Field(..., gt=0, le=180)
    completed: bool = Field(default=True)
    session_date: datetime = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @declared_attr
    def user(cls) -> ClassVar:
        return relationship("User", back_populates="pomodoro_sessions")

    @declared_attr
    def task(cls) -> ClassVar:
        return relationship("Task", back_populates="pomodoro_sessions", lazy="selectin")
