"""
Subtask Model for TodoFlow Application.
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


class Subtask(SQLModelConfig, table=True):
    __tablename__ = "subtasks"

    id: str = Field(primary_key=True)
    task_id: str = Field(..., foreign_key="tasks.id", index=True)
    title: str = Field(..., min_length=1, max_length=200)
    completed: bool = Field(default=False)
    position: int = Field(default=0, ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @declared_attr
    def task(cls) -> ClassVar:
        return relationship("Task", back_populates="subtasks")
