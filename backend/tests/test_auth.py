"""
Tests for Authentication Endpoints.

Tests cover:
- User signup
- User signin
- User signout
- Get current user
- Token refresh
- Authentication validation
"""

import pytest
from fastapi.testclient import TestClient

from backend.middleware.auth import hash_password
from backend.models.user import User


class TestSignup:
    """Tests for POST /api/auth/signup endpoint."""

    def test_signup_success(self, client: TestClient):
        """Test successful user signup."""
        response = client.post(
            "/api/auth/signup",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123",
                "name": "New User",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert "user" in data
        assert "token" in data
        assert data["user"]["email"] == "newuser@example.com"
        assert data["user"]["name"] == "New User"
        assert "access_token" in data["token"]
        assert "refresh_token" in data["token"]

    def test_signup_duplicate_email(self, client: TestClient, test_user: User):
        """Test signup with existing email returns 400."""
        response = client.post(
            "/api/auth/signup",
            json={
                "email": test_user.email,
                "password": "SecurePass123",
                "name": "Duplicate User",
            },
        )
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()

    def test_signup_invalid_email(self, client: TestClient):
        """Test signup with invalid email returns 422."""
        response = client.post(
            "/api/auth/signup",
            json={
                "email": "invalid-email",
                "password": "SecurePass123",
                "name": "User",
            },
        )
        assert response.status_code == 422

    def test_signup_weak_password(self, client: TestClient):
        """Test signup with weak password returns 422."""
        response = client.post(
            "/api/auth/signup",
            json={
                "email": "user@example.com",
                "password": "weak",  # Too short, no uppercase/number
                "name": "User",
            },
        )
        assert response.status_code == 422

    def test_signup_missing_fields(self, client: TestClient):
        """Test signup with missing required fields returns 422."""
        response = client.post(
            "/api/auth/signup",
            json={"email": "user@example.com"},  # Missing password and name
        )
        assert response.status_code == 422


class TestSignin:
    """Tests for POST /api/auth/signin endpoint."""

    def test_signin_success(self, client: TestClient, test_user: User):
        """Test successful signin."""
        response = client.post(
            "/api/auth/signin",
            json={
                "email": test_user.email,
                "password": "TestPassword123",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert "token" in data
        assert data["user"]["email"] == test_user.email

    def test_signin_remember_me(self, client: TestClient, test_user: User):
        """Test signin with remember_me option."""
        response = client.post(
            "/api/auth/signin",
            json={
                "email": test_user.email,
                "password": "TestPassword123",
                "remember_me": True,
            },
        )
        assert response.status_code == 200

    def test_signin_invalid_credentials(self, client: TestClient):
        """Test signin with invalid credentials returns 401."""
        response = client.post(
            "/api/auth/signin",
            json={
                "email": "nonexistent@example.com",
                "password": "WrongPassword123",
            },
        )
        assert response.status_code == 401

    def test_signin_wrong_password(self, client: TestClient, test_user: User):
        """Test signin with wrong password returns 401."""
        response = client.post(
            "/api/auth/signin",
            json={
                "email": test_user.email,
                "password": "WrongPassword123",
            },
        )
        assert response.status_code == 401


class TestSignout:
    """Tests for POST /api/auth/signout endpoint."""

    def test_signout_success(self, client: TestClient, auth_headers: dict):
        """Test successful signout."""
        response = client.post("/api/auth/signout", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "message" in data

    def test_signout_without_auth(self, client: TestClient):
        """Test signout without authentication returns 401."""
        response = client.post("/api/auth/signout")
        assert response.status_code == 401


class TestGetMe:
    """Tests for GET /api/auth/me endpoint."""

    def test_get_me_success(self, client: TestClient, auth_headers: dict, test_user: User):
        """Test getting current user profile."""
        response = client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["name"] == test_user.name
        assert data["id"] == test_user.id

    def test_get_me_without_auth(self, client: TestClient):
        """Test get me without authentication returns 401."""
        response = client.get("/api/auth/me")
        assert response.status_code == 401

    def test_get_me_invalid_token(self, client: TestClient):
        """Test get me with invalid token returns 401."""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401


class TestRefreshToken:
    """Tests for POST /api/auth/refresh endpoint."""

    def test_refresh_token_success(self, client: TestClient, test_user: User):
        """Test successful token refresh."""
        # First signin to get tokens
        signin_response = client.post(
            "/api/auth/signin",
            json={
                "email": test_user.email,
                "password": "TestPassword123",
            },
        )
        refresh_token = signin_response.json()["token"]["refresh_token"]

        # Refresh the token
        response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data["token"]
        assert "refresh_token" in data["token"]

    def test_refresh_token_invalid(self, client: TestClient):
        """Test refresh with invalid token returns 401."""
        response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": "invalid-refresh-token"},
        )
        assert response.status_code == 401

    def test_refresh_token_missing(self, client: TestClient):
        """Test refresh with missing token returns 422."""
        response = client.post("/api/auth/refresh", json={})
        assert response.status_code == 422


class TestUserIsolation:
    """Tests for user isolation in authentication."""

    def test_users_have_different_ids(self, test_user: User, test_user_2: User):
        """Test that different users have different IDs."""
        assert test_user.id != test_user_2.id

    def test_users_have_different_emails(self, test_user: User, test_user_2: User):
        """Test that different users have different emails."""
        assert test_user.email != test_user_2.email

    def test_tokens_are_user_specific(
        self, client: TestClient, test_user: User, test_user_2: User
    ):
        """Test that tokens are specific to each user."""
        # Get token for user 1
        token1_response = client.post(
            "/api/auth/signin",
            json={
                "email": test_user.email,
                "password": "TestPassword123",
            },
        )
        token1 = token1_response.json()["token"]["access_token"]

        # Get token for user 2
        token2_response = client.post(
            "/api/auth/signin",
            json={
                "email": test_user_2.email,
                "password": "TestPassword456",
            },
        )
        token2 = token2_response.json()["token"]["access_token"]

        # Tokens should be different
        assert token1 != token2

        # Each token should return correct user
        response1 = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token1}"})
        assert response1.json()["email"] == test_user.email

        response2 = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token2}"})
        assert response2.json()["email"] == test_user_2.email
