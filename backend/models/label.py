"""
Label Model for TodoFlow Application.

Labels provide a flexible tagging system for categorizing tasks
with color-coded visual identification.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from pydantic import field_validator
from sqlmodel import Field, Relationship, SQLModel

from .config import SQLModelConfig

if TYPE_CHECKING:
    from .user import User
    from .task_label import TaskLabel


def validate_hex_color(value: str) -> str:
    """Validate hex color format (#RRGGBB)."""
    if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
        raise ValueError("Color must be in hex format #RRGGBB")
    return value


class Label(SQLModelConfig, table=True):
    """
    Label model for TodoFlow application.

    Labels provide a flexible way to categorize and filter tasks
    across projects. Each label has a name and color for visual identification.

    Attributes:
        id: UUID primary key (stored as string)
        user_id: Foreign key to users table (indexed)
        name: Label name (1-50 chars, required, unique per user)
        color: Hex color code for visual identification (#RRGGBB)
        created_at: Creation timestamp
    """

    __tablename__ = "labels"

    # Primary Key (stored as string for Pydantic compatibility)
    id: str = Field(
        primary_key=True,
        description="Unique label identifier"
    )

    # Foreign Key to User - indexed for multi-tenant isolation
    user_id: str = Field(
        ...,
        foreign_key="users.id",
        index=True,
        description="Owner of the label (user isolation)"
    )
    
    # Name - Required, 1-50 characters, unique per user
    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Label name (required, 1-50 characters, unique per user)"
    )
    
    # Color - Required hex color format
    color: str = Field(
        ...,
        max_length=7,
        description="Label color in hex format (#RRGGBB)"
    )
    
    # Timestamp
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Label creation timestamp"
    )
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="labels")
    
    task_labels: list["TaskLabel"] = Relationship(
        back_populates="label",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    # Validation
    @field_validator("color")
    @classmethod
    def validate_color_format(cls, v: str) -> str:
        """Ensure color is valid hex format."""
        return validate_hex_color(v)
