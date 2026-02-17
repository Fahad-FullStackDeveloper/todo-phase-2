"""
Pydantic Schemas for TodoFlow Application.

This package contains all Pydantic v2 schemas for request/response validation.
Schemas are organized by domain: auth, task, project, label, dashboard, pomodoro.
"""

from .auth import (
    UserCreate,
    UserLogin,
    UserOut,
    TokenResponse,
    RefreshTokenRequest,
    AuthResponse,
)

from .task import (
    TaskCreate,
    TaskUpdate,
    TaskOut,
    TaskListResponse,
    TaskFilterParams,
    SubtaskCreate,
    SubtaskUpdate,
    SubtaskOut,
)

from .project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectOut,
    ProjectStats,
    ProjectListResponse,
)

from .label import (
    LabelCreate,
    LabelUpdate,
    LabelOut,
    LabelListResponse,
)

from .dashboard import (
    DashboardStats,
    WeeklyActivity,
    StreakData,
    PomodoroStats,
)

from .pomodoro import (
    PomodoroSessionCreate,
    PomodoroSessionOut,
)

__all__ = [
    # Auth
    "UserCreate",
    "UserLogin",
    "UserOut",
    "TokenResponse",
    "RefreshTokenRequest",
    "AuthResponse",
    # Task
    "TaskCreate",
    "TaskUpdate",
    "TaskOut",
    "TaskListResponse",
    "TaskFilterParams",
    "SubtaskCreate",
    "SubtaskUpdate",
    "SubtaskOut",
    # Project
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectOut",
    "ProjectStats",
    "ProjectListResponse",
    # Label
    "LabelCreate",
    "LabelUpdate",
    "LabelOut",
    "LabelListResponse",
    # Dashboard
    "DashboardStats",
    "WeeklyActivity",
    "StreakData",
    "PomodoroStats",
    # Pomodoro
    "PomodoroSessionCreate",
    "PomodoroSessionOut",
]
