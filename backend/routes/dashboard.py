"""
Dashboard Routes for TodoFlow Application.

Provides analytics and statistics endpoints for the user dashboard.
All operations are filtered by the authenticated user's ID.

Endpoints:
    GET /api/dashboard/stats         - Overall dashboard statistics
    GET /api/dashboard/weekly-activity - Last 7 days activity
    GET /api/dashboard/streak        - Streak information
"""

from datetime import datetime, timedelta, timezone
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import and_, func, select
from sqlmodel import Session

from db import get_db
from middleware.auth import get_current_user
from models.pomodoro_session import PomodoroSession
from models.task import Task
from models.user import User
from schemas.dashboard import (
    ActivityDay,
    DashboardStats,
    StreakData,
    WeeklyActivity,
)


router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


def _get_start_of_day(dt: datetime) -> datetime:
    """Get the start of the day (midnight) for a given datetime."""
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


def _get_end_of_day(dt: datetime) -> datetime:
    """Get the end of the day (23:59:59) for a given datetime."""
    return dt.replace(hour=23, minute=59, second=59, microsecond=999999)


@router.get(
    "/stats",
    response_model=DashboardStats,
    status_code=status.HTTP_200_OK,
    summary="Get Dashboard Statistics",
    description="Get overall statistics for the authenticated user's dashboard.",
)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DashboardStats:
    """
    Get overall dashboard statistics.

    Returns:
    - Total number of tasks
    - Number of completed tasks
    - Number of pending tasks
    - Tasks completed today
    - Overall completion rate
    - Current day streak
    - Number of overdue tasks
    """
    now = datetime.now(timezone.utc)
    today_start = _get_start_of_day(now)

    # Get total tasks
    total_query = select(func.count(Task.id)).where(Task.user_id == current_user.id)
    total_tasks = db.exec(total_query).one() or 0

    # Get completed tasks
    completed_query = select(func.count(Task.id)).where(
        and_(Task.user_id == current_user.id, Task.completed == True)
    )
    completed_tasks = db.exec(completed_query).one() or 0

    # Get pending tasks
    pending_tasks = total_tasks - completed_tasks

    # Get tasks completed today
    completed_today_query = select(func.count(Task.id)).where(
        and_(
            Task.user_id == current_user.id,
            Task.completed == True,
            Task.completed_at >= today_start,
        )
    )
    completed_today = db.exec(completed_today_query).one() or 0

    # Calculate completion rate
    completion_rate = 0.0
    if total_tasks > 0:
        completion_rate = round((completed_tasks / total_tasks) * 100, 1)

    # Get current streak
    current_streak = _calculate_current_streak(db, current_user.id)

    # Get overdue tasks (not completed and due_date < now)
    overdue_query = select(func.count(Task.id)).where(
        and_(
            Task.user_id == current_user.id,
            Task.completed == False,
            Task.due_date < now,
            Task.due_date != None,
        )
    )
    overdue_tasks = db.exec(overdue_query).one() or 0

    return DashboardStats(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        completed_today=completed_today,
        completion_rate=completion_rate,
        current_streak=current_streak,
        overdue_tasks=overdue_tasks,
    )


@router.get(
    "/weekly-activity",
    response_model=WeeklyActivity,
    status_code=status.HTTP_200_OK,
    summary="Get Weekly Activity",
    description="Get activity data for the last 7 days.",
)
async def get_weekly_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WeeklyActivity:
    """
    Get weekly activity data for the last 7 days.

    Returns activity for each day including:
    - Number of tasks completed
    - Number of tasks created

    Also includes totals and averages for the period.
    """
    now = datetime.now(timezone.utc)
    today_start = _get_start_of_day(now)

    # Generate last 7 days
    days: List[ActivityDay] = []

    for i in range(6, -1, -1):
        day_start = _get_start_of_day(today_start - timedelta(days=i))
        day_end = _get_end_of_day(day_start)

        # Count completed tasks for this day
        completed_query = select(func.count(Task.id)).where(
            and_(
                Task.user_id == current_user.id,
                Task.completed == True,
                Task.completed_at >= day_start,
                Task.completed_at <= day_end,
            )
        )
        completed_count = db.exec(completed_query).one() or 0

        # Count created tasks for this day
        created_query = select(func.count(Task.id)).where(
            and_(
                Task.user_id == current_user.id,
                Task.created_at >= day_start,
                Task.created_at <= day_end,
            )
        )
        created_count = db.exec(created_query).one() or 0

        days.append(
            ActivityDay(
                date=day_start.strftime("%Y-%m-%d"),
                completed_count=completed_count,
                created_count=created_count,
            )
        )

    # Calculate totals
    total_completed = sum(day.completed_count for day in days)
    total_created = sum(day.created_count for day in days)
    average_daily = round(total_completed / 7, 1) if days else 0.0

    return WeeklyActivity(
        days=days,
        total_completed=total_completed,
        total_created=total_created,
        average_daily=average_daily,
    )


@router.get(
    "/streak",
    response_model=StreakData,
    status_code=status.HTTP_200_OK,
    summary="Get Streak Information",
    description="Get current and longest streak information.",
)
async def get_streak(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StreakData:
    """
    Get streak information.

    Returns:
    - Current streak (consecutive days with at least one completion)
    - Longest streak ever achieved
    - Last completed date
    - Current streak start date
    """
    current_streak = _calculate_current_streak(db, current_user.id)
    longest_streak = _calculate_longest_streak(db, current_user.id)

    # Get last completed date
    last_completed_query = (
        select(Task.completed_at)
        .where(
            and_(
                Task.user_id == current_user.id,
                Task.completed == True,
                Task.completed_at != None,
            )
        )
        .order_by(Task.completed_at.desc())
        .limit(1)
    )
    last_completed = db.exec(last_completed_query).first()

    # Get current streak start date
    streak_start_date = None
    if current_streak > 0:
        streak_start = _get_start_of_day(datetime.now(timezone.utc)) - timedelta(
            days=current_streak - 1
        )
        streak_start_date = streak_start.strftime("%Y-%m-%d")

    return StreakData(
        current_streak=current_streak,
        longest_streak=longest_streak,
        last_completed_date=last_completed.strftime("%Y-%m-%d") if last_completed else None,
        streak_start_date=streak_start_date,
    )


def _calculate_current_streak(db: Session, user_id: str) -> int:
    """
    Calculate the current consecutive day streak.

    A streak day is counted if at least one task was completed on that day.
    """
    now = datetime.now(timezone.utc)
    today_start = _get_start_of_day(now)

    # Check if any task was completed today
    today_query = select(func.count(Task.id)).where(
        and_(
            Task.user_id == user_id,
            Task.completed == True,
            Task.completed_at >= today_start,
        )
    )
    completed_today = db.exec(today_query).one() or 0

    # If no task completed today, start counting from yesterday
    if completed_today == 0:
        yesterday_start = _get_start_of_day(today_start - timedelta(days=1))
        yesterday_query = select(func.count(Task.id)).where(
            and_(
                Task.user_id == user_id,
                Task.completed == True,
                Task.completed_at >= yesterday_start,
                Task.completed_at < today_start,
            )
        )
        completed_yesterday = db.exec(yesterday_query).one() or 0

        if completed_yesterday == 0:
            return 0

        # Start counting from yesterday
        streak = 1
        current_day = yesterday_start - timedelta(days=1)
    else:
        # Start counting from today
        streak = 1
        current_day = today_start - timedelta(days=1)

    # Count consecutive days backwards
    while True:
        day_start = _get_start_of_day(current_day)
        day_end = _get_end_of_day(current_day)

        day_query = select(func.count(Task.id)).where(
            and_(
                Task.user_id == user_id,
                Task.completed == True,
                Task.completed_at >= day_start,
                Task.completed_at <= day_end,
            )
        )
        completed_count = db.exec(day_query).one() or 0

        if completed_count == 0:
            break

        streak += 1
        current_day -= timedelta(days=1)

    return streak


def _calculate_longest_streak(db: Session, user_id: str) -> int:
    """
    Calculate the longest streak ever achieved.

    This analyzes all completion dates to find the longest consecutive sequence.
    """
    # Get all distinct dates with completions
    dates_query = select(
        func.date(Task.completed_at).label("completion_date")
    ).where(
        and_(
            Task.user_id == user_id,
            Task.completed == True,
            Task.completed_at != None,
        )
    ).distinct()

    completion_dates = set(db.exec(dates_query).all())

    if not completion_dates:
        return 0

    # Convert to sorted list
    sorted_dates = sorted(completion_dates)

    longest_streak = 1
    current_streak = 1

    for i in range(1, len(sorted_dates)):
        prev_date = sorted_dates[i - 1]
        curr_date = sorted_dates[i]

        # Check if consecutive day
        if (curr_date - prev_date).days == 1:
            current_streak += 1
            longest_streak = max(longest_streak, current_streak)
        else:
            current_streak = 1

    return longest_streak

