"""
Subtask Routes for TodoFlow Application.

Provides endpoints for subtask management within tasks.
All operations verify ownership of the parent task.

Endpoints:
    POST   /api/tasks/{id}/subtasks              - Add subtask to task
    PATCH  /api/tasks/{id}/subtasks/{subtaskId}  - Toggle/update subtask
    DELETE /api/tasks/{id}/subtasks/{subtaskId}  - Delete subtask
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlmodel import Session

from db import get_db
from middleware.auth import get_current_user
from models.subtask import Subtask
from models.task import Task
from models.user import User
from schemas.task import SubtaskCreate, SubtaskOut, SubtaskUpdate


router = APIRouter(prefix="/api/tasks", tags=["Subtasks"])


def _verify_task_ownership(task: Task, user_id: str) -> None:
    """Verify that a task belongs to the specified user."""
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this task",
        )


@router.post(
    "/{task_id}/subtasks",
    response_model=SubtaskOut,
    status_code=status.HTTP_201_CREATED,
    summary="Add Subtask",
    description="Add a new subtask to a task (ownership verified).",
)
async def add_subtask(
    task_id: str,
    subtask_data: SubtaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubtaskOut:
    """
    Add a new subtask to a task.

    - **task_id**: Parent task ID (must belong to authenticated user)
    - **title**: Subtask title (required, 1-200 characters)
    - **position**: Position for ordering (default: 0)

    Verifies that the parent task belongs to the authenticated user.
    """
    # Verify parent task exists and belongs to user
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    # Get max position for ordering if not specified
    if subtask_data.position == 0:
        max_position_result = db.exec(
            select(Subtask.position)
            .where(Subtask.task_id == task_id)
            .order_by(Subtask.position.desc())
        ).first()
        subtask_data.position = (max_position_result or 0) + 1

    # Create subtask
    subtask = Subtask(
        id=str(uuid.uuid4()),
        task_id=task_id,
        title=subtask_data.title,
        completed=False,
        position=subtask_data.position,
        created_at=datetime.now(timezone.utc),
    )

    db.add(subtask)
    db.commit()
    db.refresh(subtask)

    return SubtaskOut.model_validate(subtask)


@router.patch(
    "/{task_id}/subtasks/{subtask_id}",
    response_model=SubtaskOut,
    status_code=status.HTTP_200_OK,
    summary="Update Subtask",
    description="Update a subtask's properties (ownership verified).",
)
async def update_subtask(
    task_id: str,
    subtask_id: str,
    subtask_data: SubtaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubtaskOut:
    """
    Update a subtask.

    - **title**: New subtask title (optional)
    - **completed**: Toggle completion status (optional)
    - **position**: New position for ordering (optional)

    Verifies that the parent task belongs to the authenticated user.
    """
    # Verify parent task exists and belongs to user
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    # Get subtask
    subtask = db.get(Subtask, subtask_id)

    if not subtask:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtask not found",
        )

    # Verify subtask belongs to the specified task
    if subtask.task_id != task_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subtask does not belong to the specified task",
        )

    # Update fields
    update_data = subtask_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            setattr(subtask, field, value)

    db.commit()
    db.refresh(subtask)

    return SubtaskOut.model_validate(subtask)


@router.delete(
    "/{task_id}/subtasks/{subtask_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Subtask",
    description="Delete a subtask (ownership verified).",
    responses={
        204: {"description": "Subtask deleted successfully"},
        404: {"description": "Subtask or task not found"},
        403: {"description": "Forbidden - task belongs to another user"},
    },
)
async def delete_subtask(
    task_id: str,
    subtask_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """
    Delete a subtask.

    Verifies that the parent task belongs to the authenticated user.
    """
    # Verify parent task exists and belongs to user
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    _verify_task_ownership(task, current_user.id)

    # Get subtask
    subtask = db.get(Subtask, subtask_id)

    if not subtask:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtask not found",
        )

    # Verify subtask belongs to the specified task
    if subtask.task_id != task_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subtask does not belong to the specified task",
        )

    db.delete(subtask)
    db.commit()

    return None

