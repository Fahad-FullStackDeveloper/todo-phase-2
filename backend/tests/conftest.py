"""
Pytest Configuration and Fixtures for TodoFlow Backend Tests.

Provides fixtures for:
- Test database session
- Test client
- Authentication tokens
- Sample data (users, tasks, projects, labels)
"""

import os
import uuid
from datetime import datetime, timezone
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlmodel import Session, SQLModel

# Set test environment variables before importing app
os.environ["DATABASE_URL"] = "postgresql://postgres:postgres@localhost:5432/todoflow_test"
os.environ["BETTER_AUTH_SECRET"] = "test-secret-key-for-testing-only-min-32-chars"
os.environ["FRONTEND_URL"] = "http://localhost:3000"
os.environ["SQL_ECHO"] = "false"

from backend.db import get_db
from backend.main import app
from backend.middleware.auth import create_access_token, create_refresh_token, hash_password
from backend.models.user import User
from backend.models.task import Task
from backend.models.project import Project
from backend.models.label import Label


# =============================================================================
# Test Database Setup
# =============================================================================

@pytest.fixture(scope="session")
def test_engine():
    """Create test database engine."""
    engine = create_engine(
        os.environ["DATABASE_URL"],
        pool_pre_ping=True,
        echo=False,
    )
    return engine


@pytest.fixture(scope="function")
def test_db(test_engine) -> Generator[Session, None, None]:
    """
    Create a test database session.

    Creates all tables before tests and drops them after.
    Each test gets a fresh session with rollback.
    """
    # Create all tables
    SQLModel.metadata.create_all(test_engine)

    session = Session(test_engine)

    try:
        yield session
    finally:
        session.rollback()
        session.close()
        # Drop all tables after test
        SQLModel.metadata.drop_all(test_engine)


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
        password_hash=hash_password("TestPassword123"),
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
        password_hash=hash_password("TestPassword456"),
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
    password: str = "TestPassword123",
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
