"""
Pomodoro Schemas for TodoFlow Application.

Pydantic v2 schemas for pomodoro session request/response validation.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PomodoroSessionCreate(BaseModel):
    """Schema for creating a pomodoro session."""

    task_id: Optional[str] = Field(
        default=None,
        description="Optional associated task ID",
    )
    duration_minutes: int = Field(
        ...,
        gt=0,
        le=180,
        description="Session duration in minutes (1-180)",
        examples=[25],
    )
    completed: bool = Field(
        default=True,
        description="Whether the session was completed",
    )
    session_date: Optional[datetime] = Field(
        default=None,
        description="Date/time when the session occurred (defaults to now)",
    )


class PomodoroSessionOut(BaseModel):
    """Schema for pomodoro session response."""

    id: str = Field(..., description="Session unique identifier")
    user_id: str = Field(..., description="Owner user ID")
    task_id: Optional[str] = Field(..., description="Associated task ID")
    duration_minutes: int = Field(..., description="Session duration in minutes")
    completed: bool = Field(..., description="Completion status")
    session_date: datetime = Field(..., description="Session date/time")
    created_at: datetime = Field(..., description="Record creation timestamp")

    class Config:
        from_attributes = True


class PomodoroSessionListResponse(BaseModel):
    """Schema for pomodoro session list response."""

    sessions: List[PomodoroSessionOut] = Field(..., description="List of sessions")
    total: int = Field(..., description="Total number of sessions")
    total_minutes: int = Field(..., description="Total focus minutes")
