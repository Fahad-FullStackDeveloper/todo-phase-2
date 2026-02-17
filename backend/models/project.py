"""
Project Model for TodoFlow Application.

Projects allow users to organize tasks into logical groups with
color coding and descriptions for visual organization.
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
    from .task import Task


def validate_hex_color(value: str) -> str:
    """Validate hex color format (#RRGGBB)."""
    if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
        raise ValueError("Color must be in hex format #RRGGBB")
    return value


class Project(SQLModelConfig, table=True):
    """
    Project model for TodoFlow application.

    Projects provide a way to organize tasks into logical groups.
    Each project has a name, optional description, and color for visual identification.

    Attributes:
        id: UUID primary key (stored as string)
        user_id: Foreign key to users table (indexed)
        name: Project name (1-100 chars, required)
        description: Optional project description (max 1000 chars)
        color: Hex color code for visual identification (#RRGGBB)
        position: Integer for manual ordering in lists
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "projects"

    # Primary Key (stored as string for Pydantic compatibility)
    id: str = Field(
        primary_key=True,
        description="Unique project identifier"
    )

    # Foreign Key to User - indexed for multi-tenant isolation
    user_id: str = Field(
        ...,
        foreign_key="users.id",
        index=True,
        description="Owner of the project (user isolation)"
    )
    
    # Name - Required, 1-100 characters
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Project name (required, 1-100 characters)"
    )
    
    # Description - Optional, max 1000 characters
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional project description (max 1000 characters)"
    )
    
    # Color - Hex color format, default blue
    color: str = Field(
        default="#3B82F6",
        max_length=7,
        description="Project color in hex format (#RRGGBB)"
    )
    
    # Position for manual ordering
    position: int = Field(
        default=0,
        description="Position for manual project ordering"
    )
    
    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Project creation timestamp"
    )
    
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="projects")
    
    tasks: list["Task"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={
            "lazy": "selectin"
        }
    )

    # Validation
    @field_validator("color")
    @classmethod
    def validate_color_format(cls, v: str) -> str:
        """Ensure color is valid hex format."""
        return validate_hex_color(v)
    
    @property
    def task_count(self) -> int:
        """Get count of tasks in this project."""
        return len(self.tasks) if self.tasks else 0
    
    @property
    def completed_task_count(self) -> int:
        """Get count of completed tasks in this project."""
        return sum(1 for task in self.tasks if task.completed) if self.tasks else 0
    
    @property
    def completion_rate(self) -> float:
        """Calculate completion rate percentage."""
        if not self.tasks:
            return 0.0
        return round((self.completed_task_count / len(self.tasks)) * 100, 1)
