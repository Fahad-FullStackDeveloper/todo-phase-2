"""
User Isolation Integration Tests (T197).

Tests that user data is properly isolated:
- User A cannot see User B's tasks
- User A cannot modify User B's tasks
- User A cannot delete User B's tasks
- Each user only sees their own projects, labels, and sessions

Acceptance Criteria:
- User isolation: User A cannot see User B's tasks (create 2 test users, verify isolation)
- All CRUD operations respect user boundaries
- Cross-user access attempts return 403 Forbidden
"""

import uuid
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from models.user import User
from models.task import Task
from models.project import Project
from models.label import Label


class TestTaskIsolation:
    """Test task isolation between users."""

    def test_users_cannot_see_each_others_tasks(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot see User B's tasks."""
        # Create task for User A
        task_a_data = {"title": "User A Task", "priority": 3, "status": "todo"}
        task_a_response = client.post("/api/tasks", json=task_a_data, headers=auth_headers)
        task_a = task_a_response.json()

        # Create task for User B
        task_b_data = {"title": "User B Task", "priority": 2, "status": "todo"}
        task_b_response = client.post("/api/tasks", json=task_b_data, headers=auth_headers_user_2)
        task_b = task_b_response.json()

        # User A lists tasks - should only see their own
        tasks_a_response = client.get("/api/tasks", headers=auth_headers)
        tasks_a = tasks_a_response.json()["items"]
        task_a_ids = [t["id"] for t in tasks_a]
        assert task_a["id"] in task_a_ids
        assert task_b["id"] not in task_a_ids

        # User B lists tasks - should only see their own
        tasks_b_response = client.get("/api/tasks", headers=auth_headers_user_2)
        tasks_b = tasks_b_response.json()["items"]
        task_b_ids = [t["id"] for t in tasks_b]
        assert task_b["id"] in task_b_ids
        assert task_a["id"] not in task_b_ids

    def test_users_cannot_view_each_others_tasks(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot GET User B's specific task."""
        # Create task for User A
        task_a_data = {"title": "User A Private Task", "priority": 3, "status": "todo"}
        task_a_response = client.post("/api/tasks", json=task_a_data, headers=auth_headers)
        task_a_id = task_a_response.json()["id"]

        # User B tries to view User A's task - should fail
        task_b_view_response = client.get(f"/api/tasks/{task_a_id}", headers=auth_headers_user_2)
        assert task_b_view_response.status_code == 403

    def test_users_cannot_update_each_others_tasks(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot UPDATE User B's task."""
        # Create task for User A
        task_a_data = {"title": "User A Task", "priority": 3, "status": "todo"}
        task_a_response = client.post("/api/tasks", json=task_a_data, headers=auth_headers)
        task_a_id = task_a_response.json()["id"]

        # User B tries to update User A's task - should fail
        update_data = {"title": "Hacked by User B"}
        update_response = client.patch(
            f"/api/tasks/{task_a_id}", json=update_data, headers=auth_headers_user_2
        )
        assert update_response.status_code == 403

        # Verify task wasn't modified
        get_response = client.get(f"/api/tasks/{task_a_id}", headers=auth_headers)
        assert get_response.json()["title"] == task_a_data["title"]

    def test_users_cannot_delete_each_others_tasks(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot DELETE User B's task."""
        # Create task for User A
        task_a_data = {"title": "User A Task", "priority": 3, "status": "todo"}
        task_a_response = client.post("/api/tasks", json=task_a_data, headers=auth_headers)
        task_a_id = task_a_response.json()["id"]

        # User B tries to delete User A's task - should fail
        delete_response = client.delete(f"/api/tasks/{task_a_id}", headers=auth_headers_user_2)
        assert delete_response.status_code == 403

        # Verify task still exists
        get_response = client.get(f"/api/tasks/{task_a_id}", headers=auth_headers)
        assert get_response.status_code == 200

    def test_users_cannot_complete_each_others_tasks(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot complete User B's task."""
        # Create task for User A
        task_a_data = {"title": "User A Task", "priority": 3, "status": "todo"}
        task_a_response = client.post("/api/tasks", json=task_a_data, headers=auth_headers)
        task_a_id = task_a_response.json()["id"]

        # User B tries to complete User A's task - should fail
        complete_response = client.patch(
            f"/api/tasks/{task_a_id}/complete", headers=auth_headers_user_2
        )
        assert complete_response.status_code == 403

        # Verify task wasn't completed
        get_response = client.get(f"/api/tasks/{task_a_id}", headers=auth_headers)
        assert get_response.json()["completed"] is False


class TestProjectIsolation:
    """Test project isolation between users."""

    def test_users_cannot_see_each_others_projects(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot see User B's projects."""
        # Create project for User A
        project_a_data = {"name": "User A Project", "color": "#FF0000"}
        project_a_response = client.post("/api/projects", json=project_a_data, headers=auth_headers)
        project_a = project_a_response.json()

        # Create project for User B
        project_b_data = {"name": "User B Project", "color": "#00FF00"}
        project_b_response = client.post("/api/projects", json=project_b_data, headers=auth_headers_user_2)
        project_b = project_b_response.json()

        # User A lists projects - should only see their own
        projects_a_response = client.get("/api/projects", headers=auth_headers)
        projects_a = projects_a_response.json()
        project_a_ids = [p["id"] for p in projects_a]
        assert project_a["id"] in project_a_ids
        assert project_b["id"] not in project_a_ids

    def test_users_cannot_modify_each_others_projects(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot modify User B's projects."""
        # Create project for User A
        project_a_data = {"name": "User A Project", "color": "#FF0000"}
        project_a_response = client.post("/api/projects", json=project_a_data, headers=auth_headers)
        project_a_id = project_a_response.json()["id"]

        # User B tries to update User A's project - should fail
        update_data = {"name": "Hacked by User B"}
        update_response = client.patch(
            f"/api/projects/{project_a_id}", json=update_data, headers=auth_headers_user_2
        )
        assert update_response.status_code == 403


class TestLabelIsolation:
    """Test label isolation between users."""

    def test_users_cannot_see_each_others_labels(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot see User B's labels."""
        # Create label for User A
        label_a_data = {"name": "User A Label", "color": "#FF0000"}
        label_a_response = client.post("/api/labels", json=label_a_data, headers=auth_headers)
        label_a = label_a_response.json()

        # Create label for User B
        label_b_data = {"name": "User B Label", "color": "#00FF00"}
        label_b_response = client.post("/api/labels", json=label_b_data, headers=auth_headers_user_2)
        label_b = label_b_response.json()

        # User A lists labels - should only see their own
        labels_a_response = client.get("/api/labels", headers=auth_headers)
        labels_a = labels_a_response.json()
        label_a_ids = [l["id"] for l in labels_a]
        assert label_a["id"] in label_a_ids
        assert label_b["id"] not in label_a_ids

    def test_users_cannot_use_each_others_labels_on_tasks(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot use User B's labels on tasks."""
        # Create label for User B
        label_b_data = {"name": "User B Label", "color": "#00FF00"}
        label_b_response = client.post("/api/labels", json=label_b_data, headers=auth_headers_user_2)
        label_b_id = label_b_response.json()["id"]

        # User A tries to create task with User B's label - should fail or ignore
        task_data = {
            "title": "Task with wrong user's label",
            "priority": 3,
            "label_ids": [label_b_id],
        }
        task_response = client.post("/api/tasks", json=task_data, headers=auth_headers)
        # Should either fail or create task without the label
        if task_response.status_code == 201:
            task = task_response.json()
            # Label should not be attached (user isolation)
            task_label_ids = [l["id"] for l in task.get("labels", [])]
            assert label_b_id not in task_label_ids


class TestSubtaskIsolation:
    """Test subtask isolation between users."""

    def test_users_cannot_modify_each_others_subtasks(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot modify subtasks on User B's task."""
        # Create task for User A with subtasks
        task_a_data = {
            "title": "User A Task",
            "priority": 3,
            "subtasks": [{"title": "Subtask 1"}, {"title": "Subtask 2"}],
        }
        task_a_response = client.post("/api/tasks", json=task_a_data, headers=auth_headers)
        task_a_id = task_a_response.json()["id"]

        # User B tries to update subtasks on User A's task - should fail
        update_data = {"subtasks": [{"title": "Hacked Subtask"}]}
        update_response = client.patch(
            f"/api/tasks/{task_a_id}", json=update_data, headers=auth_headers_user_2
        )
        assert update_response.status_code == 403


class TestDashboardIsolation:
    """Test dashboard statistics isolation."""

    def test_dashboard_shows_only_user_data(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that dashboard stats only show user's own data."""
        # User A creates tasks
        for i in range(3):
            client.post("/api/tasks", json={"title": f"User A Task {i}", "priority": 3}, headers=auth_headers)

        # User B creates tasks
        for i in range(5):
            client.post("/api/tasks", json={"title": f"User B Task {i}", "priority": 3}, headers=auth_headers_user_2)

        # Get dashboard stats for User A
        dashboard_a_response = client.get("/api/dashboard/stats", headers=auth_headers)
        dashboard_a = dashboard_a_response.json()
        assert dashboard_a["total_tasks"] == 3

        # Get dashboard stats for User B
        dashboard_b_response = client.get("/api/dashboard/stats", headers=auth_headers_user_2)
        dashboard_b = dashboard_b_response.json()
        assert dashboard_b["total_tasks"] == 5

        # Stats should be different
        assert dashboard_a["total_tasks"] != dashboard_b["total_tasks"]


class TestPomodoroIsolation:
    """Test Pomodoro session isolation."""

    def test_users_cannot_see_each_others_pomodoro_sessions(
        self, client: TestClient, test_user: User, test_user_2: User, auth_headers: dict, auth_headers_user_2: dict
    ):
        """Test that User A cannot see User B's Pomodoro sessions."""
        # Create task for each user
        task_a_response = client.post("/api/tasks", json={"title": "User A Task", "priority": 3}, headers=auth_headers)
        task_a_id = task_a_response.json()["id"]

        task_b_response = client.post("/api/tasks", json={"title": "User B Task", "priority": 3}, headers=auth_headers_user_2)
        task_b_id = task_b_response.json()["id"]

        # User A logs pomodoro session
        pomodoro_a_data = {"task_id": task_a_id, "duration_minutes": 25, "completed": True}
        client.post("/api/pomodoro/sessions", json=pomodoro_a_data, headers=auth_headers)

        # User B logs pomodoro session
        pomodoro_b_data = {"task_id": task_b_id, "duration_minutes": 30, "completed": True}
        client.post("/api/pomodoro/sessions", json=pomodoro_b_data, headers=auth_headers_user_2)

        # Get stats for User A
        stats_a_response = client.get("/api/pomodoro/stats", headers=auth_headers)
        stats_a = stats_a_response.json()
        assert stats_a["total_sessions"] == 1
        assert stats_a["total_minutes"] == 25

        # Get stats for User B
        stats_b_response = client.get("/api/pomodoro/stats", headers=auth_headers_user_2)
        stats_b = stats_b_response.json()
        assert stats_b["total_sessions"] == 1
        assert stats_b["total_minutes"] == 30
