"""
Pytest Configuration and Fixtures for TodoFlow Backend Tests.

Provides fixtures for:
- Test database session
- Test client
- Authentication tokens
- Sample data (users, tasks, projects, labels)
"""

import os
import sys

# Set test environment variables BEFORE any other imports
# This must be at the very top of the file before any imports
os.environ["TEST_MODE"] = "true"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["BETTER_AUTH_SECRET"] = "test-secret-key-for-testing-only-min-32-chars"
os.environ["FRONTEND_URL"] = "http://localhost:3000"
os.environ["SQL_ECHO"] = "false"

# Now import pytest and other dependencies
import uuid
from datetime import datetime, timezone
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlmodel import Session, SQLModel

# Import app and dependencies (models are imported by db.py internally)
# Do NOT import models directly here to avoid duplicate metadata registration
from db import get_db, engine as app_engine  # noqa: F401
from main import app  # noqa: F401
from middleware.auth import create_access_token, create_refresh_token, hash_password  # noqa: F401

# Import models AFTER app is loaded to avoid duplicate registration
# Use relative imports consistent with rest of codebase
from models.user import User  # noqa: F401
from models.task import Task  # noqa: F401
from models.project import Project  # noqa: F401
from models.label import Label  # noqa: F401


# =============================================================================
# Test Database Setup
# =============================================================================

@pytest.fixture(scope="function")
def test_db() -> Generator[Session, None, None]:
    """
    Create a test database session.

    Creates all tables before each test.
    Each test gets a fresh session with clean database.
    Uses the app's engine which is configured for SQLite in-memory in test mode.
    """
    # Drop all tables first to ensure clean state (in case engine is reused)
    SQLModel.metadata.drop_all(app_engine)
    
    # Create all tables on the app's engine
    SQLModel.metadata.create_all(app_engine)

    session = Session(app_engine)

    try:
        yield session
    finally:
        # Close session, ignoring errors if engine is already disposed
        try:
            session.close()
        except Exception:
            pass  # Engine may already be disposed by TestClient teardown


# =============================================================================
# Test Client
# =============================================================================

@pytest.fixture(scope="function")
def client(test_db) -> Generator[TestClient, None, None]:
    """
    Create a test client with overridden database dependency.

    Overrides the get_db dependency to use the test session.
    """

    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


# =============================================================================
# Authentication Fixtures
# =============================================================================

@pytest.fixture
def test_user(test_db) -> User:
    """Create a test user."""
    user = User(
        id=str(uuid.uuid4()),
        email="test@example.com",
        name="Test User",
        password_hash=hash_password("TestPass123"),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def test_user_2(test_db) -> User:
    """Create a second test user for isolation tests."""
    user = User(
        id=str(uuid.uuid4()),
        email="test2@example.com",
        name="Test User 2",
        password_hash=hash_password("TestPass456"),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user) -> dict:
    """Get authentication headers for test user."""
    token = create_access_token(test_user)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_user_2(test_user_2) -> dict:
    """Get authentication headers for test user 2."""
    token = create_access_token(test_user_2)
    return {"Authorization": f"Bearer {token}"}


# =============================================================================
# Sample Data Fixtures
# =============================================================================

@pytest.fixture
def test_task(test_db, test_user) -> Task:
    """Create a test task."""
    task = Task(
        id=str(uuid.uuid4()),
        user_id=test_user.id,
        title="Test Task",
        description="Test description",
        status="todo",
        priority=3,
        due_date=datetime.now(timezone.utc),
        project_id=None,
        completed=False,
        completed_at=None,
        position=0,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    test_db.add(task)
    test_db.commit()
    test_db.refresh(task)
    return task


@pytest.fixture
def test_project(test_db, test_user) -> Project:
    """Create a test project."""
    project = Project(
        id=str(uuid.uuid4()),
        user_id=test_user.id,
        name="Test Project",
        description="Test project description",
        color="#3B82F6",
        position=0,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    test_db.add(project)
    test_db.commit()
    test_db.refresh(project)
    return project


@pytest.fixture
def test_label(test_db, test_user) -> Label:
    """Create a test label."""
    label = Label(
        id=str(uuid.uuid4()),
        user_id=test_user.id,
        name="Test Label",
        color="#EF4444",
        created_at=datetime.now(timezone.utc),
    )
    test_db.add(label)
    test_db.commit()
    test_db.refresh(label)
    return label


# =============================================================================
# Helper Functions
# =============================================================================

def create_test_user(
    test_db: Session,
    email: str = "test@example.com",
    name: str = "Test User",
    password: str = "TestPass123",
) -> User:
    """Helper to create a test user."""
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        name=name,
        password_hash=hash_password(password),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


def create_auth_token(user: User) -> str:
    """Helper to create an auth token for a user."""
    return create_access_token(user)
