"""
Tests for Label Endpoints.

Tests cover:
- List labels
- Create label
- Update label
- Delete label
- User isolation verification
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from backend.models.label import Label
from backend.models.user import User


class TestListLabels:
    """Tests for GET /api/labels endpoint."""

    def test_list_labels_success(
        self, client: TestClient, auth_headers: dict, test_label: Label
    ):
        """Test listing labels for authenticated user."""
        response = client.get("/api/labels", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "labels" in data
        assert "total" in data
        assert len(data["labels"]) >= 1

    def test_list_labels_empty(self, client: TestClient, auth_headers: dict):
        """Test listing labels when user has no labels."""
        response = client.get("/api/labels", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["labels"] == []
        assert data["total"] == 0

    def test_list_labels_sorted_by_name(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test labels are sorted by name."""
        # Create labels with different names
        label_z = Label(id="label-z", user_id=test_user.id, name="Zebra", color="#000000")
        label_a = Label(id="label-a", user_id=test_user.id, name="Apple", color="#FF0000")
        label_m = Label(id="label-m", user_id=test_user.id, name="Mango", color="#FFA500")
        test_db.add(label_z)
        test_db.add(label_a)
        test_db.add(label_m)
        test_db.commit()

        response = client.get("/api/labels", headers=auth_headers)
        assert response.status_code == 200
        labels = response.json()["labels"]
        names = [l["name"] for l in labels]
        assert names == sorted(names)

    def test_list_labels_without_auth(self, client: TestClient):
        """Test listing labels without authentication returns 401."""
        response = client.get("/api/labels")
        assert response.status_code == 401


class TestCreateLabel:
    """Tests for POST /api/labels endpoint."""

    def test_create_label_success(self, client: TestClient, auth_headers: dict):
        """Test successful label creation."""
        response = client.post(
            "/api/labels",
            headers=auth_headers,
            json={
                "name": "New Label",
                "color": "#EF4444",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Label"
        assert data["color"] == "#EF4444"

    def test_create_label_duplicate_name(
        self, client: TestClient, auth_headers: dict, test_label: Label
    ):
        """Test creating label with duplicate name returns 400."""
        response = client.post(
            "/api/labels",
            headers=auth_headers,
            json={
                "name": test_label.name,
                "color": "#00FF00",
            },
        )
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

    def test_create_label_duplicate_name_case_insensitive(
        self, client: TestClient, auth_headers: dict, test_label: Label
    ):
        """Test creating label with duplicate name (case-insensitive) returns 400."""
        response = client.post(
            "/api/labels",
            headers=auth_headers,
            json={
                "name": test_label.name.upper(),
                "color": "#00FF00",
            },
        )
        assert response.status_code == 400

    def test_create_label_invalid_color(self, client: TestClient, auth_headers: dict):
        """Test creating label with invalid color returns 422."""
        response = client.post(
            "/api/labels",
            headers=auth_headers,
            json={"name": "Invalid Color", "color": "not-a-color"},
        )
        assert response.status_code == 422

    def test_create_label_empty_name(self, client: TestClient, auth_headers: dict):
        """Test creating label with empty name returns 422."""
        response = client.post(
            "/api/labels",
            headers=auth_headers,
            json={"name": "", "color": "#EF4444"},
        )
        assert response.status_code == 422

    def test_create_label_name_too_long(self, client: TestClient, auth_headers: dict):
        """Test creating label with name exceeding 50 chars returns 422."""
        response = client.post(
            "/api/labels",
            headers=auth_headers,
            json={"name": "A" * 51, "color": "#EF4444"},
        )
        assert response.status_code == 422

    def test_create_label_without_auth(self, client: TestClient):
        """Test creating label without authentication returns 401."""
        response = client.post("/api/labels", json={"name": "Unauthorized", "color": "#EF4444"})
        assert response.status_code == 401


class TestUpdateLabel:
    """Tests for PUT /api/labels/{id} endpoint."""

    def test_update_label_success(
        self, client: TestClient, auth_headers: dict, test_label: Label
    ):
        """Test successful label update."""
        response = client.put(
            f"/api/labels/{test_label.id}",
            headers=auth_headers,
            json={
                "name": "Updated Label",
                "color": "#10B981",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Label"
        assert data["color"] == "#10B981"

    def test_update_label_partial(
        self, client: TestClient, auth_headers: dict, test_label: Label
    ):
        """Test partial label update (only name)."""
        response = client.put(
            f"/api/labels/{test_label.id}",
            headers=auth_headers,
            json={"name": "Updated Name Only"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name Only"
        assert data["color"] == test_label.color  # Color unchanged

    def test_update_label_not_found(self, client: TestClient, auth_headers: dict):
        """Test updating non-existent label returns 404."""
        response = client.put(
            "/api/labels/non-existent-id",
            headers=auth_headers,
            json={"name": "Updated"},
        )
        assert response.status_code == 404

    def test_update_label_duplicate_name(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test updating label to duplicate name returns 400."""
        # Create two labels
        label1 = Label(id="label-1", user_id=test_user.id, name="Label 1", color="#EF4444")
        label2 = Label(id="label-2", user_id=test_user.id, name="Label 2", color="#3B82F6")
        test_db.add(label1)
        test_db.add(label2)
        test_db.commit()

        # Try to update label2 to have same name as label1
        response = client.put(
            f"/api/labels/{label2.id}",
            headers=auth_headers,
            json={"name": "Label 1"},
        )
        assert response.status_code == 400

    def test_update_label_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot update another user's label (returns 403)."""
        other_label = Label(
            id="other-update-label",
            user_id=test_user_2.id,
            name="Other Label",
            color="#3B82F6",
        )
        test_db.add(other_label)
        test_db.commit()

        response = client.put(
            f"/api/labels/{other_label.id}",
            headers=auth_headers,
            json={"name": "Hijacked"},
        )
        assert response.status_code == 403


class TestDeleteLabel:
    """Tests for DELETE /api/labels/{id} endpoint."""

    def test_delete_label_success(
        self, client: TestClient, auth_headers: dict, test_db: Session, test_user: User
    ):
        """Test successful label deletion."""
        label_to_delete = Label(
            id="delete-label-id",
            user_id=test_user.id,
            name="Label To Delete",
            color="#EF4444",
        )
        test_db.add(label_to_delete)
        test_db.commit()

        response = client.delete(f"/api/labels/{label_to_delete.id}", headers=auth_headers)
        assert response.status_code == 204

        # Verify deleted
        response = client.get(f"/api/labels/{label_to_delete.id}", headers=auth_headers)
        assert response.status_code == 404

    def test_delete_label_not_found(self, client: TestClient, auth_headers: dict):
        """Test deleting non-existent label returns 404."""
        response = client.delete("/api/labels/non-existent-id", headers=auth_headers)
        assert response.status_code == 404

    def test_delete_label_user_isolation(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test cannot delete another user's label (returns 403)."""
        other_label = Label(
            id="other-delete-label",
            user_id=test_user_2.id,
            name="Other Label",
            color="#3B82F6",
        )
        test_db.add(other_label)
        test_db.commit()

        response = client.delete(f"/api/labels/{other_label.id}", headers=auth_headers)
        assert response.status_code == 403


class TestUserIsolation:
    """Tests for user isolation in label operations."""

    def test_user_cannot_see_other_users_labels(
        self, client: TestClient, auth_headers: dict, test_user_2: User, test_db: Session
    ):
        """Test user cannot list another user's labels."""
        other_label = Label(
            id="isolation-label",
            user_id=test_user_2.id,
            name="Other User's Label",
            color="#3B82F6",
        )
        test_db.add(other_label)
        test_db.commit()

        response = client.get("/api/labels", headers=auth_headers)
        assert response.status_code == 200
        labels = response.json()["labels"]
        assert not any(l["id"] == "isolation-label" for l in labels)

    def test_label_ownership_on_create(
        self, client: TestClient, auth_headers: dict, test_user: User
    ):
        """Test created label is owned by authenticated user."""
        response = client.post(
            "/api/labels",
            headers=auth_headers,
            json={"name": "Ownership Test Label", "color": "#EF4444"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == test_user.id

    def test_same_label_name_different_users(
        self, client: TestClient, auth_headers: dict, test_label: Label, test_user_2: User
    ):
        """Test different users can have labels with same name."""
        # Get token for user 2
        signin_response = client.post(
            "/api/auth/signin",
            json={
                "email": test_user_2.email,
                "password": "TestPassword456",
            },
        )
        token = signin_response.json()["token"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # User 2 should be able to create label with same name as user 1's label
        response = client.post(
            "/api/labels",
            headers=headers,
            json={"name": test_label.name, "color": "#00FF00"},
        )
        assert response.status_code == 201
