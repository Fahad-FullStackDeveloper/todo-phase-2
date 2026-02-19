"""
Pomodoro Routes for TodoFlow Application.

Provides endpoints for pomodoro session logging and statistics.
All operations are filtered by the authenticated user's ID.

Endpoints:
    POST /api/pomodoro/sessions      - Log a pomodoro session
    GET  /api/pomodoro/stats         - Get pomodoro statistics
"""

import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, select
from sqlmodel import Session

from db import get_db
from middleware.auth import get_current_user
from models.pomodoro_session import PomodoroSession
from models.task import Task
from models.user import User
from schemas.pomodoro import (
    PomodoroSessionCreate,
    PomodoroSessionOut,
)
from schemas.dashboard import PomodoroStats


router = APIRouter(prefix="/api/pomodoro", tags=["Pomodoro"])


def _verify_task_ownership_if_provided(
    db: Session,
    task_id: Optional[str],
    user_id: str,
) -> None:
    """Verify that a task belongs to the specified user if task_id is provided."""
    if task_id is None:
        return

    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Task with ID {task_id} not found",
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to log a session for this task",
        )


@router.post(
    "/sessions",
    response_model=PomodoroSessionOut,
    status_code=status.HTTP_201_CREATED,
    summary="Log Pomodoro Session",
    description="Log a new pomodoro focus session.",
)
async def log_pomodoro_session(
    session_data: PomodoroSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PomodoroSessionOut:
    """
    Log a new pomodoro focus session.

    - **task_id**: Optional associated task ID (must belong to user)
    - **duration_minutes**: Session duration in minutes (1-180)
    - **completed**: Whether the session was completed (default: true)
    - **session_date**: When the session occurred (defaults to now)
    """
    # Verify task ownership if task_id is provided
    _verify_task_ownership_if_provided(db, session_data.task_id, current_user.id)

    # Use current time if session_date not provided
    session_date = session_data.session_date or datetime.now(timezone.utc)

    # Create session
    session = PomodoroSession(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        task_id=session_data.task_id,
        duration_minutes=session_data.duration_minutes,
        completed=session_data.completed,
        session_date=session_date,
        created_at=datetime.now(timezone.utc),
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return PomodoroSessionOut.model_validate(session)


@router.get(
    "/stats",
    response_model=PomodoroStats,
    status_code=status.HTTP_200_OK,
    summary="Get Pomodoro Statistics",
    description="Get pomodoro statistics for the authenticated user.",
)
async def get_pomodoro_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PomodoroStats:
    """
    Get pomodoro statistics for the authenticated user.

    Returns:
    - Total number of sessions
    - Total focus minutes
    - Total focus hours
    - Average session length
    - Sessions completed today
    - Sessions completed this week
    """
    now = datetime.now(timezone.utc)
    today_start = _get_start_of_day(now)
    week_start = today_start - timedelta(days=today_start.weekday())  # Monday

    # Get total sessions
    total_query = select(func.count(PomodoroSession.id)).where(
        PomodoroSession.user_id == current_user.id
    )
    total_sessions = db.exec(total_query).one() or 0

    # Get total minutes
    minutes_query = select(func.sum(PomodoroSession.duration_minutes)).where(
        and_(
            PomodoroSession.user_id == current_user.id,
            PomodoroSession.completed == True,
        )
    )
    total_minutes = db.exec(minutes_query).one() or 0

    # Calculate total hours
    total_hours = round(total_minutes / 60, 1)

    # Calculate average session length
    average_session_length = 0.0
    if total_sessions > 0:
        avg_query = select(func.avg(PomodoroSession.duration_minutes)).where(
            PomodoroSession.user_id == current_user.id
        )
        avg_result = db.exec(avg_query).one()
        average_session_length = round(float(avg_result), 1) if avg_result else 0.0

    # Get sessions today
    today_query = select(func.count(PomodoroSession.id)).where(
        and_(
            PomodoroSession.user_id == current_user.id,
            PomodoroSession.completed == True,
            PomodoroSession.session_date >= today_start,
        )
    )
    sessions_today = db.exec(today_query).one() or 0

    # Get sessions this week
    week_query = select(func.count(PomodoroSession.id)).where(
        and_(
            PomodoroSession.user_id == current_user.id,
            PomodoroSession.completed == True,
            PomodoroSession.session_date >= week_start,
        )
    )
    sessions_this_week = db.exec(week_query).one() or 0

    return PomodoroStats(
        total_sessions=total_sessions,
        total_minutes=total_minutes,
        total_hours=total_hours,
        average_session_length=average_session_length,
        sessions_today=sessions_today,
        sessions_this_week=sessions_this_week,
    )


def _get_start_of_day(dt: datetime) -> datetime:
    """Get the start of the day (midnight) for a given datetime."""
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)

