"""
Dashboard Schemas for TodoFlow Application.

Pydantic v2 schemas for dashboard/analytics response validation.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class DashboardStats(BaseModel):
    """Schema for dashboard statistics response."""

    total_tasks: int = Field(..., description="Total number of tasks")
    completed_tasks: int = Field(..., description="Total completed tasks")
    pending_tasks: int = Field(..., description="Total pending tasks")
    completed_today: int = Field(..., description="Tasks completed today")
    completion_rate: float = Field(..., description="Overall completion rate (0-100)")
    current_streak: int = Field(..., description="Current day streak")
    overdue_tasks: int = Field(..., description="Number of overdue tasks")


class ActivityDay(BaseModel):
    """Schema for a single day's activity."""

    date: str = Field(..., description="Date in YYYY-MM-DD format")
    completed_count: int = Field(..., description="Number of tasks completed")
    created_count: int = Field(..., description="Number of tasks created")


class WeeklyActivity(BaseModel):
    """Schema for weekly activity response."""

    days: List[ActivityDay] = Field(..., description="Last 7 days of activity")
    total_completed: int = Field(..., description="Total tasks completed in period")
    total_created: int = Field(..., description="Total tasks created in period")
    average_daily: float = Field(..., description="Average tasks completed per day")


class StreakData(BaseModel):
    """Schema for streak information response."""

    current_streak: int = Field(..., description="Current consecutive day streak")
    longest_streak: int = Field(..., description="Longest streak ever achieved")
    last_completed_date: Optional[str] = Field(
        default=None,
        description="Date of last task completion (YYYY-MM-DD)",
    )
    streak_start_date: Optional[str] = Field(
        default=None,
        description="Start date of current streak (YYYY-MM-DD)",
    )


class PomodoroStats(BaseModel):
    """Schema for pomodoro statistics response."""

    total_sessions: int = Field(..., description="Total pomodoro sessions")
    total_minutes: int = Field(..., description="Total focus minutes")
    total_hours: float = Field(..., description="Total focus hours")
    average_session_length: float = Field(..., description="Average session length in minutes")
    sessions_today: int = Field(..., description="Sessions completed today")
    sessions_this_week: int = Field(..., description="Sessions completed this week")


class PriorityBreakdown(BaseModel):
    """Schema for task breakdown by priority."""

    urgent: int = Field(..., description="Number of urgent tasks")
    high: int = Field(..., description="Number of high priority tasks")
    medium: int = Field(..., description="Number of medium priority tasks")
    low: int = Field(..., description="Number of low priority tasks")


class ProjectBreakdown(BaseModel):
    """Schema for task breakdown by project."""

    project_id: str = Field(..., description="Project ID")
    project_name: str = Field(..., description="Project name")
    task_count: int = Field(..., description="Number of tasks in project")
    color: str = Field(..., description="Project color")
