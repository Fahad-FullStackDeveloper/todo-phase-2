"""
Tests for Project Endpoints.

Tests cover:
- List projects
- Create project
- Get single project
- Update project
- Delete project
- Get project statistics
- User isolation verification
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from backend.models.project import Project
from backend.models.task import Task
from backend.models.user import User


class TestListProjects:
    """Tests for GET /api/projects endpoint."""

    def test_list_projects_success(
        self, client: TestClient, auth_headers: dict, test_project: Project
    ):
        """Test listing projects for authenticated user."""
        response = client.get("/api/projects", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data
        assert "total" in data
        assert len(data["projects"]) >= 1

    def test_list_projects_empty(self, client: TestClient, auth_headers: dict):
        """Test listing projects when user has no projects."""
        response = client.get("/api/projects", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["projects"] == []
        assert data["total"] == 0

    def test_list_projects_without_auth(self, client: TestClient):
        """Test listing projects without authentication returns 401."""
        response = client.get("/api/projects")
        assert response.status_code == 401


class TestCreateProject:
    """Tests for POST /api/projects endpoint."""

    def test_create_project_success(self, client: TestClient, auth_headers: dict):
        """Test successful project creation."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={
                "name": "New Project",
                "description": "Project description",
                "color": "#FF5733",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Project"
        assert data["color"] == "#FF5733"

    def test_create_project_minimal(self, client: TestClient, auth_headers: dict):
        """Test creating project with only required fields."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={"name": "Minimal Project"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Minimal Project"
        assert data["color"] == "#3B82F6"  # Default color

    def test_create_project_invalid_color(self, client: TestClient, auth_headers: dict):
        """Test creating project with invalid color returns 422."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={"name": "Invalid Color Project", "color": "not-a-color"},
        )
        assert response.status_code == 422

    def test_create_project_empty_name(self, client: TestClient, auth_headers: dict):
        """Test creating project with empty name returns 422."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={"name": ""},
        )
        assert response.status_code == 422

    def test_create_project_without_auth(self, client: TestClient):
        """Test creating project without authentication returns 401."""
        response = client.post("/api/projects", json={"name": "Unauthorized Project"})
        assert response.status_code == 401


class TestGetProject:
    """Tests for GET /api/projects/{id} endpoint."""

    def test_get_project_success(
        self, client: TestClient, auth_headers: dict, test_project: Project
    ):
        """Test getting a specific project."""
        response = client.get(f"/api/projects/{test_project.id}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_project.id
        assert data["name"] == test_project.name

    def test_get_project_not_found(self, client: TestClient, auth_headers: dict):
        """Test getting non-existent project returns 404."""
        response = client.get("/api/projects/non-existent-id", headers=auth_headers)
        assert response.status_code == 404

    def test_get_project_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot access another user's project (returns 403)."""
        other_project = Project(
            id="other-user-project",
            user_id=test_user_2.id,
            name="Other User's Project",
            color="#3B82F6",
        )
        test_db.add(other_project)
        test_db.commit()

        response = client.get(f"/api/projects/{other_project.id}", headers=auth_headers)
        assert response.status_code == 403


class TestUpdateProject:
    """Tests for PUT /api/projects/{id} endpoint."""

    def test_update_project_success(
        self, client: TestClient, auth_headers: dict, test_project: Project
    ):
        """Test successful project update."""
        response = client.put(
            f"/api/projects/{test_project.id}",
            headers=auth_headers,
            json={
                "name": "Updated Project",
                "description": "Updated description",
                "color": "#10B981",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Project"
        assert data["color"] == "#10B981"

    def test_update_project_not_found(self, client: TestClient, auth_headers: dict):
        """Test updating non-existent project returns 404."""
        response = client.put(
            "/api/projects/non-existent-id",
            headers=auth_headers,
            json={"name": "Updated"},
        )
        assert response.status_code == 404

    def test_update_project_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot update another user's project (returns 403)."""
        other_project = Project(
            id="other-update-project",
            user_id=test_user_2.id,
            name="Other Project",
            color="#3B82F6",
        )
        test_db.add(other_project)
        test_db.commit()

        response = client.put(
            f"/api/projects/{other_project.id}",
            headers=auth_headers,
            json={"name": "Hijacked"},
        )
        assert response.status_code == 403


class TestDeleteProject:
    """Tests for DELETE /api/projects/{id} endpoint."""

    def test_delete_project_success(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test successful project deletion."""
        project_to_delete = Project(
            id="delete-project-id",
            user_id=test_user.id,
            name="Project To Delete",
            color="#3B82F6",
        )
        test_db.add(project_to_delete)
        test_db.commit()

        response = client.delete(f"/api/projects/{project_to_delete.id}", headers=auth_headers)
        assert response.status_code == 204

        # Verify deleted
        response = client.get(f"/api/projects/{project_to_delete.id}", headers=auth_headers)
        assert response.status_code == 404

    def test_delete_project_not_found(self, client: TestClient, auth_headers: dict):
        """Test deleting non-existent project returns 404."""
        response = client.delete("/api/projects/non-existent-id", headers=auth_headers)
        assert response.status_code == 404

    def test_delete_project_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot delete another user's project (returns 403)."""
        other_project = Project(
            id="other-delete-project",
            user_id=test_user_2.id,
            name="Other Project",
            color="#3B82F6",
        )
        test_db.add(other_project)
        test_db.commit()

        response = client.delete(f"/api/projects/{other_project.id}", headers=auth_headers)
        assert response.status_code == 403


class TestProjectStats:
    """Tests for GET /api/projects/{id}/stats endpoint."""

    def test_get_project_stats_empty(
        self, client: TestClient, auth_headers: dict, test_project: Project
    ):
        """Test project stats with no tasks."""
        response = client.get(f"/api/projects/{test_project.id}/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_tasks"] == 0
        assert data["completed_tasks"] == 0
        assert data["completion_rate"] == 0.0

    def test_get_project_stats_with_tasks(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test project stats with tasks."""
        # Create project
        project = Project(
            id="stats-project",
            user_id=test_user.id,
            name="Stats Project",
            color="#3B82F6",
        )
        test_db.add(project)

        # Create tasks
        for i in range(4):
            task = Task(
                id=f"stats-task-{i}",
                user_id=test_user.id,
                title=f"Task {i}",
                project_id=project.id,
                completed=i < 2,  # First 2 completed
                priority=3,
            )
            test_db.add(task)
        test_db.commit()

        response = client.get(f"/api/projects/{project.id}/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["total_tasks"] == 4
        assert data["completed_tasks"] == 2
        assert data["pending_tasks"] == 2
        assert data["completion_rate"] == 50.0

    def test_get_project_stats_not_found(self, client: TestClient, auth_headers: dict):
        """Test stats for non-existent project returns 404."""
        response = client.get("/api/projects/non-existent-id/stats", headers=auth_headers)
        assert response.status_code == 404

    def test_get_project_stats_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot get stats for another user's project (returns 403)."""
        other_project = Project(
            id="other-stats-project",
            user_id=test_user_2.id,
            name="Other Project",
            color="#3B82F6",
        )
        test_db.add(other_project)
        test_db.commit()

        response = client.get(f"/api/projects/{other_project.id}/stats", headers=auth_headers)
        assert response.status_code == 403


class TestUserIsolation:
    """Tests for user isolation in project operations."""

    def test_user_cannot_see_other_users_projects(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test user cannot list another user's projects."""
        other_project = Project(
            id="isolation-project",
            user_id=test_user_2.id,
            name="Other User's Project",
            color="#3B82F6",
        )
        test_db.add(other_project)
        test_db.commit()

        response = client.get("/api/projects", headers=auth_headers)
        assert response.status_code == 200
        projects = response.json()["projects"]
        assert not any(p["id"] == "isolation-project" for p in projects)

    def test_project_ownership_on_create(
        self, client: TestClient, auth_headers: dict, test_user: User
    ):
        """Test created project is owned by authenticated user."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={"name": "Ownership Test Project"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == test_user.id
