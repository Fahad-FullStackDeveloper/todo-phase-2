"""
Project Routes for TodoFlow Application.

Provides CRUD endpoints for project management with full user isolation.
All operations are filtered by the authenticated user's ID.

Endpoints:
    GET    /api/projects              - List all user projects
    POST   /api/projects              - Create a new project
    GET    /api/projects/{id}         - Get a specific project with tasks
    PUT    /api/projects/{id}         - Update a project
    DELETE /api/projects/{id}         - Delete a project
    GET    /api/projects/{id}/stats   - Get project statistics
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlmodel import Session

from ..db import get_db
from ..middleware.auth import get_current_user
from ..models.project import Project
from ..models.task import Task
from ..models.user import User
from ..schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectOut,
    ProjectStats,
    ProjectUpdate,
)


router = APIRouter(prefix="/api/projects", tags=["Projects"])


def _verify_project_ownership(project: Project, user_id: str) -> None:
    """Verify that a project belongs to the specified user."""
    if project.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this project",
        )


@router.get(
    "",
    response_model=ProjectListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Projects",
    description="Get all projects for the authenticated user.",
)
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
) -> ProjectListResponse:
    """
    List all projects for the authenticated user.

    Projects are returned sorted by position (ascending) then by name.

    **Pagination:**
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 20, max: 100)
    """
    # Build query - ALWAYS filter by user_id for isolation
    query = select(Project).where(Project.user_id == current_user.id)

    # Sort by position then name
    query = query.order_by(Project.position.asc(), Project.name.asc())

    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    # Execute query
    projects = db.exec(query).all()

    # Get total count
    count_query = select(Project).where(Project.user_id == current_user.id)
    total = len(db.exec(count_query).all())

    return ProjectListResponse(
        projects=[ProjectOut.model_validate(project) for project in projects],
        total=total,
    )


@router.post(
    "",
    response_model=ProjectOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create Project",
    description="Create a new project for the authenticated user.",
)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectOut:
    """
    Create a new project.

    - **name**: Project name (required, 1-100 characters)
    - **description**: Optional description (max 1000 characters)
    - **color**: Hex color code (default: #3B82F6)
    - **position**: Position for ordering (default: 0)
    """
    # Create project
    project = Project(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description,
        color=project_data.color,
        position=project_data.position,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return ProjectOut.model_validate(project)


@router.get(
    "/{project_id}",
    response_model=ProjectOut,
    status_code=status.HTTP_200_OK,
    summary="Get Project",
    description="Get a specific project by ID with its tasks (ownership verified).",
)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectOut:
    """
    Get a specific project by ID.

    Returns the project with its associated tasks.
    Verifies that the project belongs to the authenticated user.
    """
    project = db.get(Project, project_id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    _verify_project_ownership(project, current_user.id)

    return ProjectOut.model_validate(project)


@router.put(
    "/{project_id}",
    response_model=ProjectOut,
    status_code=status.HTTP_200_OK,
    summary="Update Project",
    description="Fully update a project (ownership verified).",
)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectOut:
    """
    Fully update a project.

    All fields are replaced with the provided values.
    Verifies that the project belongs to the authenticated user.
    """
    project = db.get(Project, project_id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    _verify_project_ownership(project, current_user.id)

    # Update fields
    update_data = project_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            setattr(project, field, value)

    project.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(project)

    return ProjectOut.model_validate(project)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Project",
    description="Delete a project (ownership verified).",
    responses={
        204: {"description": "Project deleted successfully"},
        404: {"description": "Project not found"},
        403: {"description": "Forbidden - project belongs to another user"},
    },
)
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """
    Delete a project.

    This permanently deletes the project. Tasks associated with this
    project will have their project_id set to NULL (not deleted).

    Verifies that the project belongs to the authenticated user.
    """
    project = db.get(Project, project_id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    _verify_project_ownership(project, current_user.id)

    db.delete(project)
    db.commit()

    return None


@router.get(
    "/{project_id}/stats",
    response_model=ProjectStats,
    status_code=status.HTTP_200_OK,
    summary="Get Project Statistics",
    description="Get statistics for a specific project (ownership verified).",
)
async def get_project_stats(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectStats:
    """
    Get statistics for a specific project.

    Returns:
    - Total number of tasks
    - Number of completed tasks
    - Number of pending tasks
    - Completion rate percentage
    - Number of overdue tasks

    Verifies that the project belongs to the authenticated user.
    """
    project = db.get(Project, project_id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    _verify_project_ownership(project, current_user.id)

    # Get all tasks for this project
    tasks_query = select(Task).where(Task.project_id == project_id)
    tasks = db.exec(tasks_query).all()

    total_tasks = len(tasks)
    completed_tasks = sum(1 for task in tasks if task.completed)
    pending_tasks = total_tasks - completed_tasks

    # Calculate completion rate
    completion_rate = 0.0
    if total_tasks > 0:
        completion_rate = round((completed_tasks / total_tasks) * 100, 1)

    # Count overdue tasks (not completed and due_date < now)
    now = datetime.now(timezone.utc)
    overdue_tasks = sum(
        1 for task in tasks
        if task.due_date and not task.completed and task.due_date < now
    )

    return ProjectStats(
        project_id=project_id,
        project_name=project.name,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        completion_rate=completion_rate,
        overdue_tasks=overdue_tasks,
    )
