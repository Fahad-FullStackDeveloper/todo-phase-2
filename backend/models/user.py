"""
User Model for TodoFlow Application.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy.orm import declared_attr, relationship
from sqlmodel import Field, SQLModel
from typing import ClassVar

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .task import Task
    from .project import Project
    from .label import Label
    from .pomodoro_session import PomodoroSession


class User(SQLModelConfig, table=True):
    __tablename__ = "users"

    id: str = Field(default=None, primary_key=True)
    email: str = Field(..., max_length=255, unique=True, index=True)
    name: str = Field(..., max_length=100)
    password_hash: str = Field(..., max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships defined using declared_attr to avoid SQLModel processing
    @declared_attr
    def tasks(cls) -> ClassVar:
        return relationship("Task", back_populates="user", cascade="all, delete-orphan")

    @declared_attr
    def projects(cls) -> ClassVar:
        return relationship("Project", back_populates="user", cascade="all, delete-orphan")

    @declared_attr
    def labels(cls) -> ClassVar:
        return relationship("Label", back_populates="user", cascade="all, delete-orphan")

    @declared_attr
    def pomodoro_sessions(cls) -> ClassVar:
        return relationship("PomodoroSession", back_populates="user", cascade="all, delete-orphan")
