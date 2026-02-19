"""
Label Schemas for TodoFlow Application.

Pydantic v2 schemas for label request/response validation.
"""

import re
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


def validate_hex_color(value: str) -> str:
    """Validate hex color format (#RRGGBB)."""
    if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
        raise ValueError("Color must be in hex format #RRGGBB")
    return value


class LabelCreate(BaseModel):
    """Schema for creating a label."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Label name (required, 1-50 characters)",
        examples=["Important"],
    )
    color: str = Field(
        ...,
        max_length=7,
        description="Label color in hex format (#RRGGBB)",
        examples=["#EF4444"],
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


class LabelUpdate(BaseModel):
    """Schema for updating a label (all fields optional)."""

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50,
        description="Label name",
    )
    color: Optional[str] = Field(
        default=None,
        max_length=7,
        description="Label color in hex format",
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


class LabelOut(BaseModel):
    """Schema for label response."""

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Label unique identifier")
    user_id: str = Field(..., description="Owner user ID")
    name: str = Field(..., description="Label name")
    color: str = Field(..., description="Label color")
    created_at: datetime = Field(..., description="Creation timestamp")


class LabelListResponse(BaseModel):
    """Schema for label list response."""

    labels: List[LabelOut] = Field(..., description="List of labels")
    total: int = Field(..., description="Total number of labels")


# Rebuild models to resolve forward references
LabelListResponse.model_rebuild()
