"""
Task Schemas for TodoFlow Application.

Pydantic v2 schemas for task and subtask request/response validation.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


# =============================================================================
# Task Enums
# =============================================================================

class TaskStatusEnum(str):
    """Task status enumeration."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriorityEnum(int):
    """Task priority enumeration (1=Urgent, 4=Low)."""
    URGENT = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


# =============================================================================
# Subtask Schemas
# =============================================================================

class SubtaskCreate(BaseModel):
    """Schema for creating a subtask."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Subtask title (required)",
        examples=["Review pull request"],
    )
    position: int = Field(
        default=0,
        ge=0,
        description="Position for ordering subtasks",
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Trim and validate title."""
        return v.strip()


class SubtaskUpdate(BaseModel):
    """Schema for updating a subtask."""

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="Subtask title",
    )
    completed: Optional[bool] = Field(
        default=None,
        description="Subtask completion status",
    )
    position: Optional[int] = Field(
        default=None,
        ge=0,
        description="Position for ordering",
    )


class SubtaskOut(BaseModel):
    """Schema for subtask response."""

    id: str = Field(..., description="Subtask unique identifier")
    task_id: str = Field(..., description="Parent task ID")
    title: str = Field(..., description="Subtask title")
    completed: bool = Field(..., description="Completion status")
    position: int = Field(..., description="Position for ordering")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        from_attributes = True


# =============================================================================
# Task Schemas
# =============================================================================

class TaskCreate(BaseModel):
    """Schema for creating a task."""

    model_config = ConfigDict(use_enum_values=True, arbitrary_types_allowed=True)

    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (required, 1-200 characters)",
        examples=["Complete project proposal"],
    )
    description: Optional[str] = Field(
        default=None,
        max_length=10000,
        description="Optional task description (max 10000 characters)",
        examples=["Write a detailed proposal for the new feature..."],
    )
    status: str = Field(
        default="todo",
        description="Task status",
        examples=["todo", "in_progress", "done"],
    )
    priority: int = Field(
        default=3,
        description="Task priority (1=Urgent, 2=High, 3=Medium, 4=Low)",
        ge=1,
        le=4,
    )
    due_date: Optional[datetime] = Field(
        default=None,
        description="Optional due date (timezone aware)",
    )
    project_id: Optional[str] = Field(
        default=None,
        description="Optional project ID to assign task to",
    )
    label_ids: Optional[List[str]] = Field(
        default=None,
        description="Optional list of label IDs to associate with task",
    )
    position: int = Field(
        default=0,
        description="Position for manual task ordering",
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Trim and validate title."""
        return v.strip()

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        """Validate status value."""
        valid_statuses = ["todo", "in_progress", "done"]
        if v not in valid_statuses:
            raise ValueError(f"Status must be one of: {valid_statuses}")
        return v


class TaskUpdate(BaseModel):
    """Schema for updating a task (all fields optional)."""

    model_config = ConfigDict(use_enum_values=True, arbitrary_types_allowed=True)

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="Task title",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=10000,
        description="Task description",
    )
    status: Optional[str] = Field(
        default=None,
        description="Task status",
        examples=["todo", "in_progress", "done"],
    )
    priority: Optional[int] = Field(
        default=None,
        description="Task priority",
        ge=1,
        le=4,
    )
    due_date: Optional[datetime] = Field(
        default=None,
        description="Due date",
    )
    project_id: Optional[str] = Field(
        default=None,
        description="Project ID",
    )
    completed: Optional[bool] = Field(
        default=None,
        description="Completion status",
    )
    position: Optional[int] = Field(
        default=None,
        description="Position for ordering",
    )
    label_ids: Optional[List[str]] = Field(
        default=None,
        description="List of label IDs",
    )

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate status value."""
        if v is None:
            return v
        valid_statuses = ["todo", "in_progress", "done"]
        if v not in valid_statuses:
            raise ValueError(f"Status must be one of: {valid_statuses}")
        return v


class TaskOut(BaseModel):
    """Schema for task response."""

    id: str = Field(..., description="Task unique identifier")
    user_id: str = Field(..., description="Owner user ID")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(..., description="Task description")
    status: str = Field(..., description="Task status")
    priority: int = Field(..., description="Task priority")
    due_date: Optional[datetime] = Field(..., description="Due date")
    project_id: Optional[str] = Field(..., description="Project ID")
    completed: bool = Field(..., description="Completion status")
    completed_at: Optional[datetime] = Field(..., description="Completion timestamp")
    position: int = Field(..., description="Position for ordering")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    # Related data
    subtasks: Optional[List[SubtaskOut]] = Field(
        default=None,
        description="Associated subtasks",
    )
    labels: Optional[List["LabelOut"]] = Field(
        default=None,
        description="Associated labels",
    )
    project: Optional["ProjectOut"] = Field(
        default=None,
        description="Associated project",
    )

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    """Schema for paginated task list response."""

    tasks: List[TaskOut] = Field(..., description="List of tasks")
    total: int = Field(..., description="Total number of tasks")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Items per page")
    has_more: bool = Field(..., description="Whether there are more pages")


class TaskFilterParams(BaseModel):
    """Schema for task filtering query parameters."""

    model_config = ConfigDict(use_enum_values=True, arbitrary_types_allowed=True)

    status: Optional[str] = Field(
        default=None,
        description="Filter by status",
        examples=["todo", "in_progress", "done"],
    )
    priority: Optional[int] = Field(
        default=None,
        description="Filter by priority",
        ge=1,
        le=4,
    )
    project_id: Optional[str] = Field(
        default=None,
        description="Filter by project ID",
    )
    labels: Optional[List[str]] = Field(
        default=None,
        description="Filter by label IDs",
    )
    due_after: Optional[datetime] = Field(
        default=None,
        description="Filter tasks due after this date",
    )
    due_before: Optional[datetime] = Field(
        default=None,
        description="Filter tasks due before this date",
    )
    overdue: Optional[bool] = Field(
        default=None,
        description="Filter overdue tasks only",
    )
    completed: Optional[bool] = Field(
        default=None,
        description="Filter by completion status",
    )
    sort_by: str = Field(
        default="created_at",
        description="Field to sort by",
    )
    order: str = Field(
        default="desc",
        description="Sort order (asc/desc)",
    )
    page: int = Field(
        default=1,
        ge=1,
        description="Page number",
    )
    limit: int = Field(
        default=20,
        ge=1,
        le=100,
        description="Items per page (max 100)",
    )

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        """Validate status value."""
        if v is None:
            return v
        valid_statuses = ["todo", "in_progress", "done"]
        if v not in valid_statuses:
            raise ValueError(f"Status must be one of: {valid_statuses}")
        return v


# Import late to avoid circular imports
from .label import LabelOut
from .project import ProjectOut

# Rebuild models to resolve forward references
TaskOut.model_rebuild()
TaskListResponse.model_rebuild()
