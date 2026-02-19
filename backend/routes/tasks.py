"""
Task Routes for TodoFlow Application.

Provides CRUD endpoints for task management with full user isolation.
All operations are filtered by the authenticated user's ID.

Endpoints:
    GET    /api/tasks              - List all user tasks with filters
    POST   /api/tasks              - Create a new task
    GET    /api/tasks/{id}         - Get a specific task
    PUT    /api/tasks/{id}         - Update a task (full update)
    PATCH  /api/tasks/{id}         - Update a task (partial update)
    PATCH  /api/tasks/{id}/complete - Toggle task completion
    DELETE /api/tasks/{id}         - Delete a task
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_, select
from sqlmodel import Session

from db import get_db
from middleware.auth import get_current_user
from models.label import Label
from models.task import Task
from models.task_label import TaskLabel
from models.user import User
from schemas.task import (
    TaskCreate,
    TaskFilterParams,
    TaskListResponse,
    TaskOut,
    TaskUpdate,
)


router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


def _verify_task_ownership(task: Task, user_id: str) -> None:
    """Verify that a task belongs to the specified user."""
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this task",
        )


@router.get(
    "",
    response_model=TaskListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Tasks",
    description="Get all tasks for the authenticated user with optional filtering and sorting.",
)
async def list_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    # Filter parameters
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    priority: Optional[int] = Query(None, ge=1, le=4, description="Filter by priority"),
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    labels: Optional[str] = Query(None, description="Filter by label IDs (comma-separated)"),
    due_after: Optional[datetime] = Query(None, description="Filter tasks due after this date"),
    due_before: Optional[datetime] = Query(None, description="Filter tasks due before this date"),
    overdue: Optional[bool] = Query(None, description="Filter overdue tasks only"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    # Sorting parameters
    sort_by: str = Query("created_at", description="Field to sort by"),
    order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order"),
    # Pagination parameters
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
) -> TaskListResponse:
    """
    List all tasks for the authenticated user.

    **Filters:**
    - `status`: Filter by task status (todo, in_progress, done)
    - `priority`: Filter by priority (1=Urgent, 2=High, 3=Medium, 4=Low)
    - `project_id`: Filter by project ID
    - `labels`: Filter by label IDs (comma-separated)
    - `due_after`: Filter tasks due after this date
    - `due_before`: Filter tasks due before this date
    - `overdue`: Filter overdue tasks only
    - `completed`: Filter by completion status

    **Sorting:**
    - `sort_by`: Field to sort by (created_at, due_date, priority, title, completed_at)
    - `order`: Sort order (asc, desc)

    **Pagination:**
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 20, max: 100)
    """
    # Build base query - ALWAYS filter by user_id for isolation
    query = select(Task).where(Task.user_id == current_user.id)

    # Apply filters
    if status_filter:
        query = query.where(Task.status == status_filter)

    if priority is not None:
        query = query.where(Task.priority == priority)

    if project_id is not None:
        query = query.where(Task.project_id == project_id)

    if completed is not None:
        query = query.where(Task.completed == completed)

    if due_after is not None:
        query = query.where(Task.due_date >= due_after)

    if due_before is not None:
        query = query.where(Task.due_date <= due_before)

    if overdue is True:
        # Overdue = not completed AND due_date < now
        now = datetime.now(timezone.utc)
        query = query.where(
            and_(
                Task.completed == False,
                Task.due_date < now,
            )
        )

    # Apply label filter if provided
    if labels:
        label_ids = [l.strip() for l in labels.split(",")]
        label_subquery = (
            select(TaskLabel.task_id)
            .where(TaskLabel.label_id.in_(label_ids))
            .distinct()
        )
        query = query.where(Task.id.in_(label_subquery))

    # Apply sorting
    valid_sort_fields = {
        "created_at": Task.created_at,
        "updated_at": Task.updated_at,
        "due_date": Task.due_date,
        "priority": Task.priority,
        "title": Task.title,
        "completed_at": Task.completed_at,
    }

    sort_field = valid_sort_fields.get(sort_by, Task.created_at)
    if order == "desc":
        query = query.order_by(sort_field.desc())
    else:
        query = query.order_by(sort_field.asc())

    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    # Execute query
    tasks = db.exec(query).all()

    # Get total count
    count_query = select(Task).where(Task.user_id == current_user.id)
    # Apply same filters to count query (simplified - without pagination)
    total = db.exec(count_query).count() if hasattr(db.exec(count_query), 'count') else len(tasks)

    # For accurate count, we need to re-apply filters
    count_query = select(Task.id).where(Task.user_id == current_user.id)
    if status_filter:
        count_query = count_query.where(Task.status == status_filter)
    if priority is not None:
        count_query = count_query.where(Task.priority == priority)
    if project_id is not None:
        count_query = count_query.where(Task.project_id == project_id)
    if completed is not None:
        count_query = count_query.where(Task.completed == completed)

    total = len(db.exec(count_query).all())

    return TaskListResponse(
        tasks=[TaskOut.model_validate(task) for task in tasks],
        total=total,
        page=page,
        limit=limit,
        has_more=(page * limit) < total,
    )


@router.post(
    "",
    response_model=TaskOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create Task",
    description="Create a new task for the authenticated user.",
)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskOut:
    """
    Create a new task.

    - **title**: Task title (required, 1-200 characters)
    - **description**: Optional description (max 10000 characters)
    - **status**: Task status (default: todo)
    - **priority**: Priority level (default: 3=Medium)
    - **due_date**: Optional due date
    - **project_id**: Optional project assignment
    - **label_ids**: Optional list of label IDs
    """
    # Verify project exists and belongs to user if provided
    if task_data.project_id:
        from models.project import Project
        project = db.get(Project, task_data.project_id)
        if not project or project.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project not found or you don't have permission",
            )

    # Verify labels exist and belong to user if provided
    if task_data.label_ids:
        from models.label import Label
        labels = db.exec(select(Label).where(Label.id.in_(task_data.label_ids))).all()
        if len(labels) != len(task_data.label_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more labels not found",
            )
        # Verify ownership
        for label in labels:
            if label.user_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to use this label",
                )

    # Create task
    task = Task(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status.value if hasattr(task_data.status, 'value') else task_data.status,
        priority=task_data.priority.value if hasattr(task_data.priority, 'value') else task_data.priority,
        due_date=task_data.due_date,
        project_id=task_data.project_id,
        completed=False,
        completed_at=None,
        position=task_data.position,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    # Associate labels if provided
    if task_data.label_ids:
        for label_id in task_data.label_ids:
            task_label = TaskLabelModel(
                task_id=task.id,
                label_id=label_id,
            )
            db.add(task_label)
        db.commit()
        db.refresh(task)

    return TaskOut.model_validate(task)


@router.get(
    "/{task_id}",
    response_model=TaskOut,
    status_code=status.HTTP_200_OK,
    summary="Get Task",
    description="Get a specific task by ID (ownership verified).",
)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskOut:
    """
    Get a specific task by ID.

    Verifies that the task belongs to the authenticated user.
    Returns 404 if task doesn't exist or 403 if it belongs to another user.
    """
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    return TaskOut.model_validate(task)


@router.put(
    "/{task_id}",
    response_model=TaskOut,
    status_code=status.HTTP_200_OK,
    summary="Update Task",
    description="Fully update a task (ownership verified).",
)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskOut:
    """
    Fully update a task.

    All fields are replaced with the provided values.
    Verifies that the task belongs to the authenticated user.
    """
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    # Update fields
    update_data = task_data.model_dump(exclude_unset=True)

    # Verify project if changed
    if "project_id" in update_data and update_data["project_id"] is not None:
        from models.project import Project
        project = db.get(Project, update_data["project_id"])
        if not project or project.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project not found or you don't have permission",
            )

    # Handle label updates
    label_ids = update_data.pop("label_ids", None)

    for field, value in update_data.items():
        if value is not None:
            setattr(task, field, value)

    task.updated_at = datetime.now(timezone.utc)

    # Handle completion status
    if "completed" in update_data:
        if update_data["completed"]:
            task.completed_at = datetime.now(timezone.utc)
        else:
            task.completed_at = None

    # Update labels if provided
    if label_ids is not None:
        # Remove existing label associations
        existing_labels = db.exec(
            select(TaskLabelModel).where(TaskLabelModel.task_id == task_id)
        ).all()
        for label in existing_labels:
            db.delete(label)

        # Add new label associations
        if label_ids:
            labels = db.exec(select(Label).where(Label.id.in_(label_ids))).all()
            if len(labels) != len(label_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more labels not found",
                )
            for label in labels:
                if label.user_id != current_user.id:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You don't have permission to use this label",
                    )
                task_label = TaskLabelModel(task_id=task.id, label_id=label.id)
                db.add(task_label)

    db.commit()
    db.refresh(task)

    return TaskOut.model_validate(task)


@router.patch(
    "/{task_id}",
    response_model=TaskOut,
    status_code=status.HTTP_200_OK,
    summary="Partial Update Task",
    description="Partially update a task (ownership verified).",
)
async def partial_update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskOut:
    """
    Partially update a task.

    Only provided fields are updated.
    Verifies that the task belongs to the authenticated user.
    """
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            setattr(task, field, value)

    task.updated_at = datetime.now(timezone.utc)

    # Handle completion status
    if "completed" in update_data:
        if update_data["completed"]:
            task.completed_at = datetime.now(timezone.utc)
        else:
            task.completed_at = None

    db.commit()
    db.refresh(task)

    return TaskOut.model_validate(task)


@router.patch(
    "/{task_id}/complete",
    response_model=TaskOut,
    status_code=status.HTTP_200_OK,
    summary="Toggle Task Completion",
    description="Toggle a task's completion status (ownership verified).",
)
async def toggle_task_completion(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskOut:
    """
    Toggle a task's completion status.

    - If task is incomplete: marks as complete and sets completed_at timestamp
    - If task is complete: marks as incomplete and clears completed_at timestamp

    Verifies that the task belongs to the authenticated user.
    """
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    # Toggle completion
    task.completed = not task.completed
    task.completed_at = datetime.now(timezone.utc) if task.completed else None
    task.updated_at = datetime.now(timezone.utc)

    # Update status based on completion
    if task.completed:
        task.status = "done"
    else:
        task.status = "todo"

    db.commit()
    db.refresh(task)

    return TaskOut.model_validate(task)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Task",
    description="Delete a task (ownership verified).",
    responses={
        204: {"description": "Task deleted successfully"},
        404: {"description": "Task not found"},
        403: {"description": "Forbidden - task belongs to another user"},
    },
)
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """
    Delete a task.

    This permanently deletes the task and all associated subtasks.
    Verifies that the task belongs to the authenticated user.
    """
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    db.delete(task)
    db.commit()

    return None

