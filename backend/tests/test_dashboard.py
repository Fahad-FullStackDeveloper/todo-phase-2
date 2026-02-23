"""
Tests for Dashboard and Pomodoro Endpoints.

Tests cover:
- Dashboard statistics
- Weekly activity
- Streak information
- Pomodoro session logging
- Pomodoro statistics
- User isolation verification
"""

from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from models.pomodoro_session import PomodoroSession
from models.task import Task
from models.user import User


class TestDashboardStats:
    """Tests for GET /api/dashboard/stats endpoint."""

    def test_dashboard_stats_success(self, client: TestClient, auth_headers: dict):
        """Test getting dashboard statistics."""
        response = client.get("/api/dashboard/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_tasks" in data
        assert "completed_tasks" in data
        assert "pending_tasks" in data
        assert "completed_today" in data
        assert "completion_rate" in data
        assert "current_streak" in data
        assert "overdue_tasks" in data

    def test_dashboard_stats_empty(self, client: TestClient, auth_headers: dict):
        """Test dashboard stats with no data."""
        response = client.get("/api/dashboard/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_tasks"] == 0
        assert data["completed_tasks"] == 0
        assert data["pending_tasks"] == 0
        assert data["completed_today"] == 0
        assert data["completion_rate"] == 0.0
        assert data["current_streak"] == 0
        assert data["overdue_tasks"] == 0

    def test_dashboard_stats_with_tasks(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test dashboard stats with tasks."""
        # Create tasks
        for i in range(10):
            task = Task(
                id=f"dash-task-{i}",
                user_id=test_user.id,
                title=f"Task {i}",
                completed=i < 4,  # 4 completed
                priority=3,
            )
            test_db.add(task)
        test_db.commit()

        response = client.get("/api/dashboard/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_tasks"] == 10
        assert data["completed_tasks"] == 4
        assert data["pending_tasks"] == 6
        assert data["completion_rate"] == 40.0

    def test_dashboard_stats_without_auth(self, client: TestClient):
        """Test dashboard stats without authentication returns 401."""
        response = client.get("/api/dashboard/stats")
        assert response.status_code == 401


class TestWeeklyActivity:
    """Tests for GET /api/dashboard/weekly-activity endpoint."""

    def test_weekly_activity_success(self, client: TestClient, auth_headers: dict):
        """Test getting weekly activity."""
        response = client.get("/api/dashboard/weekly-activity", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "days" in data
        assert "total_completed" in data
        assert "total_created" in data
        assert "average_daily" in data
        assert len(data["days"]) == 7

    def test_weekly_activity_empty(self, client: TestClient, auth_headers: dict):
        """Test weekly activity with no data."""
        response = client.get("/api/dashboard/weekly-activity", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["days"]) == 7
        assert data["total_completed"] == 0
        assert data["total_created"] == 0

    def test_weekly_activity_date_format(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test weekly activity date format is YYYY-MM-DD."""
        # Create a task completed today
        today = datetime.now(timezone.utc)
        task = Task(
            id="activity-task",
            user_id=test_user.id,
            title="Activity Task",
            completed=True,
            completed_at=today,
            created_at=today - timedelta(days=1),
            priority=3,
        )
        test_db.add(task)
        test_db.commit()

        response = client.get("/api/dashboard/weekly-activity", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        for day in data["days"]:
            # Verify date format YYYY-MM-DD
            assert len(day["date"]) == 10
            assert day["date"][4] == "-"
            assert day["date"][7] == "-"

    def test_weekly_activity_without_auth(self, client: TestClient):
        """Test weekly activity without authentication returns 401."""
        response = client.get("/api/dashboard/weekly-activity")
        assert response.status_code == 401


class TestStreak:
    """Tests for GET /api/dashboard/streak endpoint."""

    def test_streak_success(self, client: TestClient, auth_headers: dict):
        """Test getting streak information."""
        response = client.get("/api/dashboard/streak", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "current_streak" in data
        assert "longest_streak" in data
        assert "last_completed_date" in data
        assert "streak_start_date" in data

    def test_streak_empty(self, client: TestClient, auth_headers: dict):
        """Test streak with no completions."""
        response = client.get("/api/dashboard/streak", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["current_streak"] == 0
        assert data["longest_streak"] == 0
        assert data["last_completed_date"] is None

    def test_streak_with_completions(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test streak with task completions."""
        now = datetime.now(timezone.utc)

        # Create tasks completed on consecutive days
        for i in range(5):
            task = Task(
                id=f"streak-task-{i}",
                user_id=test_user.id,
                title=f"Streak Task {i}",
                completed=True,
                completed_at=now - timedelta(days=i),
                priority=3,
            )
            test_db.add(task)
        test_db.commit()

        response = client.get("/api/dashboard/streak", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["current_streak"] >= 1
        assert data["longest_streak"] >= 1

    def test_streak_without_auth(self, client: TestClient):
        """Test streak without authentication returns 401."""
        response = client.get("/api/dashboard/streak")
        assert response.status_code == 401


class TestPomodoroSession:
    """Tests for POST /api/pomodoro/sessions endpoint."""

    def test_log_session_success(self, client: TestClient, auth_headers: dict):
        """Test logging a pomodoro session."""
        response = client.post(
            "/api/pomodoro/sessions",
            headers=auth_headers,
            json={
                "duration_minutes": 25,
                "completed": True,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["duration_minutes"] == 25
        assert data["completed"] is True

    def test_log_session_with_task(
        self, client: TestClient, auth_headers: dict, test_task: Task
    ):
        """Test logging a pomodoro session linked to a task."""
        response = client.post(
            "/api/pomodoro/sessions",
            headers=auth_headers,
            json={
                "task_id": test_task.id,
                "duration_minutes": 25,
                "completed": True,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["task_id"] == test_task.id

    def test_log_session_invalid_task(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test logging session with another user's task returns 403."""
        other_task = Task(
            id="other-pomodoro-task",
            user_id=test_user_2.id,
            title="Other Task",
            priority=3,
        )
        test_db.add(other_task)
        test_db.commit()

        response = client.post(
            "/api/pomodoro/sessions",
            headers=auth_headers,
            json={
                "task_id": other_task.id,
                "duration_minutes": 25,
            },
        )
        assert response.status_code == 403

    def test_log_session_invalid_duration(self, client: TestClient, auth_headers: dict):
        """Test logging session with invalid duration returns 422."""
        response = client.post(
            "/api/pomodoro/sessions",
            headers=auth_headers,
            json={
                "duration_minutes": 0,  # Invalid: must be > 0
            },
        )
        assert response.status_code == 422

        response = client.post(
            "/api/pomodoro/sessions",
            headers=auth_headers,
            json={
                "duration_minutes": 200,  # Invalid: must be <= 180
            },
        )
        assert response.status_code == 422

    def test_log_session_without_auth(self, client: TestClient):
        """Test logging session without authentication returns 401."""
        response = client.post(
            "/api/pomodoro/sessions",
            json={"duration_minutes": 25},
        )
        assert response.status_code == 401


class TestPomodoroStats:
    """Tests for GET /api/pomodoro/stats endpoint."""

    def test_pomodoro_stats_success(self, client: TestClient, auth_headers: dict):
        """Test getting pomodoro statistics."""
        response = client.get("/api/pomodoro/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_sessions" in data
        assert "total_minutes" in data
        assert "total_hours" in data
        assert "average_session_length" in data
        assert "sessions_today" in data
        assert "sessions_this_week" in data

    def test_pomodoro_stats_empty(self, client: TestClient, auth_headers: dict):
        """Test pomodoro stats with no sessions."""
        response = client.get("/api/pomodoro/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_sessions"] == 0
        assert data["total_minutes"] == 0
        assert data["total_hours"] == 0.0
        assert data["average_session_length"] == 0.0
        assert data["sessions_today"] == 0
        assert data["sessions_this_week"] == 0

    def test_pomodoro_stats_with_sessions(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test pomodoro stats with sessions."""
        now = datetime.now(timezone.utc)

        # Create sessions
        for i in range(5):
            session = PomodoroSession(
                id=f"pomo-session-{i}",
                user_id=test_user.id,
                duration_minutes=25,
                completed=True,
                session_date=now - timedelta(hours=i),
            )
            test_db.add(session)
        test_db.commit()

        response = client.get("/api/pomodoro/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_sessions"] == 5
        assert data["total_minutes"] == 125
        assert data["total_hours"] == 2.1  # 125/60 = 2.08...
        assert data["average_session_length"] == 25.0

    def test_pomodoro_stats_without_auth(self, client: TestClient):
        """Test pomodoro stats without authentication returns 401."""
        response = client.get("/api/pomodoro/stats")
        assert response.status_code == 401


class TestUserIsolation:
    """Tests for user isolation in dashboard and pomodoro operations."""

    def test_dashboard_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test dashboard only shows current user's data."""
        # Create tasks for user 2
        for i in range(10):
            task = Task(
                id=f"other-dash-task-{i}",
                user_id=test_user_2.id,
                title=f"Other Task {i}",
                completed=True,
                priority=3,
            )
            test_db.add(task)
        test_db.commit()

        # User 1's dashboard should not include user 2's tasks
        response = client.get("/api/dashboard/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_tasks"] == 0  # User 1 has no tasks

    def test_pomodoro_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test pomodoro stats only show current user's sessions."""
        now = datetime.now(timezone.utc)

        # Create sessions for user 2
        for i in range(10):
            session = PomodoroSession(
                id=f"other-pomo-{i}",
                user_id=test_user_2.id,
                duration_minutes=25,
                completed=True,
                session_date=now,
            )
            test_db.add(session)
        test_db.commit()

        # User 1's stats should not include user 2's sessions
        response = client.get("/api/pomodoro/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_sessions"] == 0  # User 1 has no sessions

    def test_streak_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test streak only counts current user's completions."""
        now = datetime.now(timezone.utc)

        # Create completed tasks for user 2 (5 day streak)
        for i in range(5):
            task = Task(
                id=f"other-streak-task-{i}",
                user_id=test_user_2.id,
                title=f"Other Streak Task {i}",
                completed=True,
                completed_at=now - timedelta(days=i),
                priority=3,
            )
            test_db.add(task)
        test_db.commit()

        # User 1's streak should not be affected
        response = client.get("/api/dashboard/streak", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["current_streak"] == 0  # User 1 has no completions
