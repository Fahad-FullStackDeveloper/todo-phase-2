# TodoFlow Backend Guidelines

**Stack:** Python FastAPI + SQLModel + Neon PostgreSQL
**Phase:** Phase 1 Complete - Setup & Project Initialization

---

## Project Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── db.py                    # Database connection & session factory
├── models/                  # SQLModel database models
│   ├── __init__.py
│   ├── config.py            # SQLModel configuration
│   ├── user.py              # User model
│   ├── task.py              # Task model
│   ├── project.py           # Project model
│   ├── subtask.py           # Subtask model
│   ├── label.py             # Label model
│   ├── task_label.py        # Task-Label junction
│   └── pomodoro_session.py  # Pomodoro session model
├── routes/                  # API route handlers
│   ├── __init__.py
│   ├── auth.py              # Authentication endpoints
│   ├── tasks.py             # Task CRUD endpoints
│   ├── subtasks.py          # Subtask endpoints
│   ├── projects.py          # Project endpoints
│   ├── labels.py            # Label endpoints
│   ├── dashboard.py         # Dashboard/analytics endpoints
│   └── pomodoro.py          # Pomodoro endpoints
├── middleware/              # Middleware
│   └── auth.py              # JWT verification middleware
├── schemas/                 # Pydantic schemas
├── tests/                   # Test suite
├── alembic/                 # Database migrations
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
└── Dockerfile               # Container configuration
```

---

## API Conventions

### Route Structure
- All routes under `/api/` prefix
- RESTful naming conventions
- JSON responses with consistent format
- HTTP status codes per RFC 7231

### Response Format
```python
# Success response
{
    "success": True,
    "data": {...}
}

# Error response
{
    "success": False,
    "error": "Error Type",
    "message": "Human-readable message"
}
```

### Error Handling
- Use `HTTPException` for API errors
- 401 for authentication failures
- 403 for authorization failures
- 404 for not found
- 422 for validation errors
- 500 for server errors

---

## Database

### SQLModel Patterns
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: "User" = Relationship(back_populates="tasks")
```

### Connection String
```python
# From environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Local development
DATABASE_URL=postgresql://todoflow:todoflow_secret@localhost:5432/todoflow

# Production (Neon)
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/todoflow?sslmode=require
```

### Session Management
```python
from .db import get_db

@app.get("/api/tasks")
def list_tasks(session: Session = Depends(get_db)):
    tasks = session.exec(select(Task)).all()
    return tasks
```

---

## JWT Authentication

### Middleware Pattern
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Extract and verify JWT token, return user info."""
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            os.getenv("BETTER_AUTH_SECRET"),
            algorithms=[os.getenv("JWT_ALGORITHM", "HS256")]
        )
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, **payload}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Protected Route Pattern
```python
@app.get("/api/tasks")
def list_tasks(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    # Filter by user_id from JWT
    tasks = session.exec(
        select(Task).where(Task.user_id == current_user["user_id"])
    ).all()
    return tasks
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `BETTER_AUTH_SECRET` | JWT signing secret (min 32 chars) | Required |
| `JWT_ALGORITHM` | JWT algorithm | HS256 |
| `JWT_EXPIRATION` | Access token expiry | 15m |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiry | 7d |
| `FRONTEND_URL` | CORS allowed origins | http://localhost:3000 |
| `SQL_ECHO` | Enable SQL logging | false |

---

## Running the Backend

### Local Development
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Unix/Mac)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run with hot-reload
uvicorn main:app --reload --port 8000
```

### Docker
```bash
docker-compose up backend
```

### Testing
```bash
pytest tests/ -v
pytest tests/ -v --cov=backend
```

---

## Testing Patterns

```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine
from sqlmodel.pool import StaticPool

from main import app
from models import Task, User

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    app.dependency_overrides[get_db] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_create_task(client: TestClient, session: Session):
    # Create user
    user = User(email="test@example.com", password_hash="hashed")
    session.add(user)
    session.commit()
    
    # Create task
    response = client.post(
        "/api/tasks",
        json={"title": "Test Task", "user_id": user.id},
        headers={"Authorization": "Bearer token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"
```

---

## Spec References

- `@.specify/specs/overview.md` - API endpoints specification
- `@.specify/specs/features/auth-jwt.md` - Authentication
- `@.specify/specs/features/task-management.md` - Task CRUD
- `@.specify/specs/features/projects-kanban.md` - Projects
- `@.specify/specs/features/labels.md` - Labels
- `@.specify/specs/features/analytics.md` - Dashboard/Pomodoro

---

## Skills Integration

This backend uses the following skills:
- `fastapi-jwt-security` - JWT authentication enforcement
- `neon-db-patterns` - Neon PostgreSQL best practices
- `task-model-rules` - Consistent task schema

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check JWT token in Authorization header |
| CORS errors | Add frontend URL to FRONTEND_URL env var |
| Database connection failed | Verify DATABASE_URL format |
| Token validation fails | Ensure BETTER_AUTH_SECRET matches frontend |
| Migration errors | Run `alembic upgrade head` |

---

*Follow Constitution Principle 2 (Monorepo Architecture) and Principle 3 (JWT Authentication & User Isolation).*
