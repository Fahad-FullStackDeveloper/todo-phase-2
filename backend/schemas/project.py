"""
Project Schemas for TodoFlow Application.

Pydantic v2 schemas for project request/response validation.
"""

import re
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


def validate_hex_color(value: str) -> str:
    """Validate hex color format (#RRGGBB)."""
    if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
        raise ValueError("Color must be in hex format #RRGGBB")
    return value


class ProjectCreate(BaseModel):
    """Schema for creating a project."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Project name (required, 1-100 characters)",
        examples=["Work Projects"],
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional project description (max 1000 characters)",
        examples=["All work-related tasks and initiatives"],
    )
    color: str = Field(
        default="#3B82F6",
        max_length=7,
        description="Project color in hex format (#RRGGBB)",
        examples=["#3B82F6"],
    )
    position: int = Field(
        default=0,
        description="Position for manual project ordering",
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Trim and validate name."""
        return v.strip()

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str) -> str:
        """Validate hex color format."""
        return validate_hex_color(v)


class ProjectUpdate(BaseModel):
    """Schema for updating a project (all fields optional)."""

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Project name",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Project description",
    )
    color: Optional[str] = Field(
        default=None,
        max_length=7,
        description="Project color in hex format",
    )
    position: Optional[int] = Field(
        default=None,
        description="Position for ordering",
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Trim and validate name."""
        if v is None:
            return v
        return v.strip()

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str) -> str:
        """Validate hex color format."""
        if v is None:
            return v
        return validate_hex_color(v)


class ProjectOut(BaseModel):
    """Schema for project response."""

    id: str = Field(..., description="Project unique identifier")
    user_id: str = Field(..., description="Owner user ID")
    name: str = Field(..., description="Project name")
    description: Optional[str] = Field(..., description="Project description")
    color: str = Field(..., description="Project color")
    position: int = Field(..., description="Position for ordering")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    # Computed fields
    task_count: Optional[int] = Field(
        default=None,
        description="Number of tasks in this project",
    )
    completed_task_count: Optional[int] = Field(
        default=None,
        description="Number of completed tasks",
    )
    completion_rate: Optional[float] = Field(
        default=None,
        description="Completion rate percentage",
    )

    class Config:
        from_attributes = True


class ProjectStats(BaseModel):
    """Schema for project statistics response."""

    project_id: str = Field(..., description="Project ID")
    project_name: str = Field(..., description="Project name")
    total_tasks: int = Field(..., description="Total number of tasks")
    completed_tasks: int = Field(..., description="Number of completed tasks")
    pending_tasks: int = Field(..., description="Number of pending tasks")
    completion_rate: float = Field(..., description="Completion rate percentage (0-100)")
    overdue_tasks: int = Field(..., description="Number of overdue tasks")


class ProjectListResponse(BaseModel):
    """Schema for paginated project list response."""

    projects: List[ProjectOut] = Field(..., description="List of projects")
    total: int = Field(..., description="Total number of projects")
