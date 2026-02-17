"""
Tests for Task CRUD Endpoints.

Tests cover:
- List tasks with filters
- Create task
- Get single task
- Update task
- Toggle task completion
- Delete task
- User isolation verification
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from backend.models.task import Task
from backend.models.user import User


class TestListTasks:
    """Tests for GET /api/tasks endpoint."""

    def test_list_tasks_success(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test listing tasks for authenticated user."""
        response = client.get("/api/tasks", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "tasks" in data
        assert "total" in data
        assert len(data["tasks"]) >= 1

    def test_list_tasks_empty(self, client: TestClient, auth_headers: dict):
        """Test listing tasks when user has no tasks."""
        response = client.get("/api/tasks", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["tasks"] == []
        assert data["total"] == 0

    def test_list_tasks_filter_by_status(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test filtering tasks by status."""
        # Create tasks with different statuses
        todo_task = Task(
            id="todo-task-id",
            user_id=test_user.id,
            title="Todo Task",
            status="todo",
            priority=3,
        )
        done_task = Task(
            id="done-task-id",
            user_id=test_user.id,
            title="Done Task",
            status="done",
            priority=3,
            completed=True,
        )
        test_db.add(todo_task)
        test_db.add(done_task)
        test_db.commit()

        # Filter by status=todo
        response = client.get("/api/tasks?status=todo", headers=auth_headers)
        assert response.status_code == 200
        tasks = response.json()["tasks"]
        assert all(t["status"] == "todo" for t in tasks)

    def test_list_tasks_filter_by_priority(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test filtering tasks by priority."""
        # Create tasks with different priorities
        urgent_task = Task(
            id="urgent-task-id",
            user_id=test_user.id,
            title="Urgent Task",
            priority=1,  # Urgent
        )
        low_task = Task(
            id="low-task-id",
            user_id=test_user.id,
            title="Low Task",
            priority=4,  # Low
        )
        test_db.add(urgent_task)
        test_db.add(low_task)
        test_db.commit()

        # Filter by priority=1 (urgent)
        response = client.get("/api/tasks?priority=1", headers=auth_headers)
        assert response.status_code == 200
        tasks = response.json()["tasks"]
        assert all(t["priority"] == 1 for t in tasks)

    def test_list_tasks_pagination(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test task pagination."""
        # Create multiple tasks
        for i in range(25):
            task = Task(
                id=f"task-{i}",
                user_id=test_user.id,
                title=f"Task {i}",
                priority=3,
            )
            test_db.add(task)
        test_db.commit()

        # Get first page
        response = client.get("/api/tasks?page=1&limit=10", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["tasks"]) == 10
        assert data["page"] == 1
        assert data["limit"] == 10

        # Get second page
        response = client.get("/api/tasks?page=2&limit=10", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["tasks"]) == 10

    def test_list_tasks_without_auth(self, client: TestClient):
        """Test listing tasks without authentication returns 401."""
        response = client.get("/api/tasks")
        assert response.status_code == 401


class TestCreateTask:
    """Tests for POST /api/tasks endpoint."""

    def test_create_task_success(self, client: TestClient, auth_headers: dict):
        """Test successful task creation."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "New Task",
                "description": "Task description",
                "priority": 2,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Task"
        assert data["description"] == "Task description"
        assert data["priority"] == 2

    def test_create_task_minimal(self, client: TestClient, auth_headers: dict):
        """Test creating task with only required fields."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={"title": "Minimal Task"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Minimal Task"

    def test_create_task_title_too_long(self, client: TestClient, auth_headers: dict):
        """Test creating task with title exceeding 200 chars returns 422."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={"title": "A" * 201},
        )
        assert response.status_code == 422

    def test_create_task_empty_title(self, client: TestClient, auth_headers: dict):
        """Test creating task with empty title returns 422."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={"title": ""},
        )
        assert response.status_code == 422

    def test_create_task_without_auth(self, client: TestClient):
        """Test creating task without authentication returns 401."""
        response = client.post(
            "/api/tasks",
            json={"title": "Unauthorized Task"},
        )
        assert response.status_code == 401


class TestGetTask:
    """Tests for GET /api/tasks/{id} endpoint."""

    def test_get_task_success(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test getting a specific task."""
        response = client.get(f"/api/tasks/{test_task.id}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_task.id
        assert data["title"] == test_task.title

    def test_get_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test getting non-existent task returns 404."""
        response = client.get("/api/tasks/non-existent-id", headers=auth_headers)
        assert response.status_code == 404

    def test_get_task_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot access another user's task (returns 403)."""
        # Create task for user 2
        other_task = Task(
            id="other-user-task",
            user_id=test_user_2.id,
            title="Other User's Task",
            priority=3,
        )
        test_db.add(other_task)
        test_db.commit()

        # Try to access with user 1's token
        response = client.get(f"/api/tasks/{other_task.id}", headers=auth_headers)
        assert response.status_code == 403


class TestUpdateTask:
    """Tests for PUT /api/tasks/{id} endpoint."""

    def test_update_task_success(
        self, client: TestClient, auth_headers: dict, test_task: Task
    ):
        """Test successful task update."""
        response = client.put(
            f"/api/tasks/{test_task.id}",
            headers=auth_headers,
            json={
                "title": "Updated Task",
                "description": "Updated description",
                "priority": 1,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Task"
        assert data["priority"] == 1

    def test_update_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test updating non-existent task returns 404."""
        response = client.put(
            "/api/tasks/non-existent-id",
            headers=auth_headers,
            json={"title": "Updated"},
        )
        assert response.status_code == 404

    def test_update_task_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot update another user's task (returns 403)."""
        other_task = Task(
            id="other-update-task",
            user_id=test_user_2.id,
            title="Other Task",
            priority=3,
        )
        test_db.add(other_task)
        test_db.commit()

        response = client.put(
            f"/api/tasks/{other_task.id}",
            headers=auth_headers,
            json={"title": "Hijacked"},
        )
        assert response.status_code == 403


class TestToggleCompletion:
    """Tests for PATCH /api/tasks/{id}/complete endpoint."""

    def test_toggle_complete_to_done(
        self, client: TestClient, auth_headers: dict, test_task: Task
    ):
        """Test toggling task to completed."""
        assert test_task.completed is False

        response = client.patch(
            f"/api/tasks/{test_task.id}/complete",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["completed"] is True
        assert data["status"] == "done"
        assert data["completed_at"] is not None

    def test_toggle_complete_back_to_todo(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test toggling completed task back to todo."""
        # Create completed task
        completed_task = Task(
            id="completed-task",
            user_id=test_user.id,
            title="Completed Task",
            completed=True,
            status="done",
            priority=3,
        )
        test_db.add(completed_task)
        test_db.commit()

        response = client.patch(
            f"/api/tasks/{completed_task.id}/complete",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["completed"] is False
        assert data["status"] == "todo"


class TestDeleteTask:
    """Tests for DELETE /api/tasks/{id} endpoint."""

    def test_delete_task_success(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test successful task deletion."""
        # Create task to delete
        task_to_delete = Task(
            id="delete-task-id",
            user_id=test_user.id,
            title="Task To Delete",
            priority=3,
        )
        test_db.add(task_to_delete)
        test_db.commit()

        response = client.delete(f"/api/tasks/{task_to_delete.id}", headers=auth_headers)
        assert response.status_code == 204

        # Verify deleted
        response = client.get(f"/api/tasks/{task_to_delete.id}", headers=auth_headers)
        assert response.status_code == 404

    def test_delete_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test deleting non-existent task returns 404."""
        response = client.delete("/api/tasks/non-existent-id", headers=auth_headers)
        assert response.status_code == 404

    def test_delete_task_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot delete another user's task (returns 403)."""
        other_task = Task(
            id="other-delete-task",
            user_id=test_user_2.id,
            title="Other Task",
            priority=3,
        )
        test_db.add(other_task)
        test_db.commit()

        response = client.delete(f"/api/tasks/{other_task.id}", headers=auth_headers)
        assert response.status_code == 403


class TestUserIsolation:
    """Tests for user isolation in task operations."""

    def test_user_cannot_see_other_users_tasks(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test user cannot list another user's tasks."""
        # Create task for user 2
        other_task = Task(
            id="isolation-test-task",
            user_id=test_user_2.id,
            title="Other User's Task",
            priority=3,
        )
        test_db.add(other_task)
        test_db.commit()

        # List tasks for user 1
        response = client.get("/api/tasks", headers=auth_headers)
        assert response.status_code == 200
        tasks = response.json()["tasks"]
        # Should not include other user's task
        assert not any(t["id"] == "isolation-test-task" for t in tasks)

    def test_task_ownership_on_create(
        self, client: TestClient, auth_headers: dict, test_user: User
    ):
        """Test created task is owned by authenticated user."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={"title": "Ownership Test Task"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == test_user.id
