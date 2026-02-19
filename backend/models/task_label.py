"""
TaskLabel Junction Model for TodoFlow Application.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy.orm import declared_attr, relationship
from sqlmodel import Field, SQLModel
from typing import ClassVar

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .task import Task
    from .label import Label


class TaskLabel(SQLModelConfig, table=True):
    __tablename__ = "task_labels"

    task_id: str = Field(..., foreign_key="tasks.id", primary_key=True, index=True)
    label_id: str = Field(..., foreign_key="labels.id", primary_key=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @declared_attr
    def task(cls) -> ClassVar:
        return relationship("Task", back_populates="task_labels")

    @declared_attr
    def label(cls) -> ClassVar:
        return relationship("Label", back_populates="task_labels")
