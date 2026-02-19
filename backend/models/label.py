"""
Label Model for TodoFlow Application.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from pydantic import field_validator
from sqlalchemy.orm import declared_attr, relationship
from sqlmodel import Field, SQLModel
from typing import ClassVar

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .user import User
    from .task_label import TaskLabel


def validate_hex_color(value: str) -> str:
    if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
        raise ValueError("Color must be in hex format #RRGGBB")
    return value


class Label(SQLModelConfig, table=True):
    __tablename__ = "labels"

    id: str = Field(primary_key=True)
    user_id: str = Field(..., foreign_key="users.id", index=True)
    name: str = Field(..., min_length=1, max_length=50)
    color: str = Field(..., max_length=7)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @declared_attr
    def user(cls) -> ClassVar:
        return relationship("User", back_populates="labels")

    @declared_attr
    def task_labels(cls) -> ClassVar:
        return relationship("TaskLabel", back_populates="label", cascade="all, delete-orphan")

    @field_validator("color")
    @classmethod
    def validate_color_format(cls, v: str) -> str:
        return validate_hex_color(v)
