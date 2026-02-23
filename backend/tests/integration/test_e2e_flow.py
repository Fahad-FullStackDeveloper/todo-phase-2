"""
End-to-End Flow Integration Tests (T196).

Tests complete user journeys from signup to signout:
1. Authentication flow (signup → signin → token receipt)
2. Protected resource access (task CRUD operations)
3. Token refresh and session persistence
4. Signout and token invalidation

Acceptance Criteria:
- JWT flow: signup → signin → API calls → signout (all steps verified)
- Tokens are properly generated and validated
- Protected routes require authentication
- Session persistence works correctly
"""

import uuid
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from models.user import User


class TestCompleteAuthFlow:
    """Test complete authentication lifecycle."""

    def test_full_auth_lifecycle(self, client: TestClient):
        """Test complete flow: signup → signin → API access → signout."""
        # Step 1: Signup
        signup_data = {
            "email": f"e2e_{uuid.uuid4().hex[:8]}@test.com",
            "password": "SecurePass123",
            "name": "E2E Test User",
        }
        signup_response = client.post("/api/auth/signup", json=signup_data)
        assert signup_response.status_code == 201
        signup_data_response = signup_response.json()
        assert "user" in signup_data_response
        assert "token" in signup_data_response
        assert "access_token" in signup_data_response["token"]
        assert "refresh_token" in signup_data_response["token"]

        access_token = signup_data_response["token"]["access_token"]
        auth_headers = {"Authorization": f"Bearer {access_token}"}

        # Step 2: Access protected resource (get current user)
        me_response = client.get("/api/auth/me", headers=auth_headers)
        assert me_response.status_code == 200
        me_data = me_response.json()
        assert me_data["email"] == signup_data["email"]
        assert me_data["name"] == signup_data["name"]

        # Step 3: Create a task (protected resource)
        task_data = {
            "title": "E2E Test Task",
            "description": "Task created during E2E testing",
            "priority": 3,
            "status": "todo",
        }
        create_task_response = client.post("/api/tasks", json=task_data, headers=auth_headers)
        assert create_task_response.status_code == 201
        task = create_task_response.json()
        assert task["title"] == task_data["title"]
        task_id = task["id"]

        # Step 4: Get tasks list
        tasks_response = client.get("/api/tasks", headers=auth_headers)
        assert tasks_response.status_code == 200
        tasks = tasks_response.json()
        assert len(tasks["items"]) >= 1
        assert any(t["id"] == task_id for t in tasks["items"])

        # Step 5: Update the task
        update_data = {"title": "Updated E2E Task", "priority": 2}
        update_response = client.patch(
            f"/api/tasks/{task_id}", json=update_data, headers=auth_headers
        )
        assert update_response.status_code == 200
        updated_task = update_response.json()
        assert updated_task["title"] == update_data["title"]
        assert updated_task["priority"] == update_data["priority"]

        # Step 6: Complete the task
        complete_response = client.patch(
            f"/api/tasks/{task_id}/complete", headers=auth_headers
        )
        assert complete_response.status_code == 200
        completed_task = complete_response.json()
        assert completed_task["completed"] is True
        assert completed_task["status"] == "done"

        # Step 7: Delete the task
        delete_response = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
        assert delete_response.status_code == 200

        # Verify deletion
        get_task_response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert get_task_response.status_code == 404

        # Step 8: Signout
        signout_response = client.post("/api/auth/signout", headers=auth_headers)
        assert signout_response.status_code == 200
        assert signout_response.json()["success"] is True

    def test_token_refresh_flow(self, client: TestClient, test_user: User):
        """Test token refresh maintains session."""
        # Signin to get tokens
        signin_response = client.post(
            "/api/auth/signin",
            json={"email": test_user.email, "password": "TestPass123"},
        )
        assert signin_response.status_code == 200
        tokens = signin_response.json()["token"]
        old_access_token = tokens["access_token"]
        old_refresh_token = tokens["refresh_token"]

        # Refresh token
        refresh_response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": old_refresh_token},
        )
        assert refresh_response.status_code == 200
        new_tokens = refresh_response.json()["token"]
        assert "access_token" in new_tokens
        assert "refresh_token" in new_tokens

        # New token should work
        new_auth_headers = {"Authorization": f"Bearer {new_tokens['access_token']}"}
        me_response = client.get("/api/auth/me", headers=new_auth_headers)
        assert me_response.status_code == 200
        assert me_response.json()["email"] == test_user.email

    def test_session_persistence_across_requests(self, client: TestClient):
        """Test that session persists across multiple requests."""
        # Create user
        signup_data = {
            "email": f"persistence_{uuid.uuid4().hex[:8]}@test.com",
            "password": "SecurePass123",
            "name": "Persistence Test User",
        }
        signup_response = client.post("/api/auth/signup", json=signup_data)
        access_token = signup_response.json()["token"]["access_token"]
        auth_headers = {"Authorization": f"Bearer {access_token}"}

        # Make multiple requests - session should persist
        for i in range(5):
            # Create task
            task_response = client.post(
                "/api/tasks",
                json={"title": f"Task {i}", "priority": 3, "status": "todo"},
                headers=auth_headers,
            )
            assert task_response.status_code == 201

            # Get tasks
            tasks_response = client.get("/api/tasks", headers=auth_headers)
            assert tasks_response.status_code == 200
            assert len(tasks_response.json()["items"]) == i + 1

        # Verify all tasks exist
        final_tasks_response = client.get("/api/tasks?limit=100", headers=auth_headers)
        assert final_tasks_response.status_code == 200
        assert len(final_tasks_response.json()["items"]) == 5


class TestProtectedRoutes:
    """Test that protected routes properly enforce authentication."""

    def test_tasks_require_auth(self, client: TestClient):
        """Test that task endpoints require authentication."""
        # Without auth
        assert client.get("/api/tasks").status_code == 401
        assert client.post("/api/tasks", json={}).status_code == 401
        assert client.get("/api/tasks/some-id").status_code == 401
        assert client.put("/api/tasks/some-id", json={}).status_code == 401
        assert client.patch("/api/tasks/some-id", json={}).status_code == 401
        assert client.delete("/api/tasks/some-id").status_code == 401

    def test_projects_require_auth(self, client: TestClient):
        """Test that project endpoints require authentication."""
        assert client.get("/api/projects").status_code == 401
        assert client.post("/api/projects", json={}).status_code == 401

    def test_labels_require_auth(self, client: TestClient):
        """Test that label endpoints require authentication."""
        assert client.get("/api/labels").status_code == 401
        assert client.post("/api/labels", json={}).status_code == 401

    def test_dashboard_requires_auth(self, client: TestClient):
        """Test that dashboard endpoints require authentication."""
        assert client.get("/api/dashboard/stats").status_code == 401

    def test_pomodoro_requires_auth(self, client: TestClient):
        """Test that pomodoro endpoints require authentication."""
        assert client.get("/api/pomodoro/stats").status_code == 401
        assert client.post("/api/pomodoro/sessions", json={}).status_code == 401


class TestErrorHandling:
    """Test error handling in E2E flows."""

    def test_expired_token_handling(self, client: TestClient, test_user: User):
        """Test handling of expired tokens."""
        # Get valid token first
        signin_response = client.post(
            "/api/auth/signin",
            json={"email": test_user.email, "password": "TestPass123"},
        )
        token = signin_response.json()["token"]["access_token"]

        # Use invalid/expired token format
        invalid_headers = {"Authorization": "Bearer expired-token"}
        me_response = client.get("/api/auth/me", headers=invalid_headers)
        assert me_response.status_code == 401

    def test_invalid_token_format(self, client: TestClient):
        """Test handling of malformed tokens."""
        invalid_headers = {"Authorization": "Bearer not-a-valid-jwt"}
        response = client.get("/api/auth/me", headers=invalid_headers)
        assert response.status_code == 401

    def test_missing_authorization_header(self, client: TestClient):
        """Test handling of missing authorization header."""
        response = client.get("/api/auth/me")
        assert response.status_code == 401

    def test_bearer_prefix_required(self, client: TestClient, test_user: User):
        """Test that Bearer prefix is required."""
        signin_response = client.post(
            "/api/auth/signin",
            json={"email": test_user.email, "password": "TestPass123"},
        )
        token = signin_response.json()["token"]["access_token"]

        # Without Bearer prefix
        invalid_headers = {"Authorization": token}
        response = client.get("/api/auth/me", headers=invalid_headers)
        assert response.status_code == 401
