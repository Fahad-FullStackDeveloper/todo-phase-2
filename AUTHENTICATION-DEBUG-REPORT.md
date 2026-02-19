# Authentication Debug Report

## Executive Summary

The signup/signin authentication issue has been **RESOLVED**. Both endpoints are now working correctly.

## Issues Found and Fixed

### 1. SQLAlchemy 2.0 + SQLModel Relationship Incompatibility (CRITICAL)

**Problem:**
- SQLAlchemy 2.0+ introduced breaking changes to how relationship type annotations are handled
- SQLModel's `Relationship()` function was incompatible with SQLAlchemy 2.0's type resolution
- Error: `InvalidRequestError: When initializing mapper Mapper[User(users)], expression "relationship('list[Task]')" seems to be using a generic class as the argument to relationship()`

**Root Cause:**
- SQLModel's `Relationship()` function passes type annotations to SQLAlchemy's `relationship()` function
- SQLAlchemy 2.0 interprets generic type annotations like `list[Task]` as the relationship target string instead of type hints
- This caused SQLAlchemy to fail when trying to resolve the relationship target

**Solution:**
- Used SQLAlchemy's `declared_attr` decorator to define relationships as class methods
- Configured Pydantic to ignore `declared_attr` objects via `model_config['ignored_types']`
- This allows relationships to be defined after class creation, bypassing SQLModel's type annotation processing

**Files Modified:**
- `backend/models/config.py` - Added `ignored_types: (declared_attr,)` to model_config
- `backend/models/user.py` - Converted relationships to use `@declared_attr`
- `backend/models/task.py` - Converted relationships to use `@declared_attr`
- `backend/models/project.py` - Converted relationships to use `@declared_attr`
- `backend/models/label.py` - Converted relationships to use `@declared_attr`
- `backend/models/subtask.py` - Converted relationships to use `@declared_attr`
- `backend/models/task_label.py` - Converted relationships to use `@declared_attr`
- `backend/models/pomodoro_session.py` - Converted relationships to use `@declared_attr`

### 2. bcrypt Compatibility Issue

**Problem:**
- bcrypt 5.0.0 has compatibility issues with passlib
- Error: `ValueError: password cannot be longer than 72 bytes` and `AttributeError: module 'bcrypt' has no attribute '__about__'`

**Solution:**
- Downgraded bcrypt to version 4.0.1 which is compatible with passlib

**Command:**
```bash
pip install "bcrypt==4.0.1"
```

### 3. CORS Configuration Issue

**Problem:**
- Backend CORS only allowed production Vercel URL, not localhost:3000
- This would prevent local development from working

**Solution:**
- Updated `backend/.env` to include both localhost and production URLs:
```
FRONTEND_URL=http://localhost:3000,https://todo-phase-2-theta.vercel.app
```

## Testing Results

### Signup Test
```bash
Status: 201
Response: {
  "user": {
    "id": "b623a02c-a3be-4d4a-a019-991522b41b82",
    "email": "pythontest@example.com",
    "name": "Python Test User",
    "created_at": "2026-02-18T16:52:38.006037"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### Signin Test
```bash
Status: 200
Response: {
  "user": {
    "id": "b623a02c-a3be-4d4a-a019-991522b41b82",
    "email": "pythontest@example.com",
    "name": "Python Test User",
    "created_at": "2026-02-18T16:52:38.006037"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

## Package Versions

After fixes:
- `sqlmodel`: 0.0.19
- `sqlalchemy`: 2.0.46
- `bcrypt`: 4.0.1
- `passlib`: (compatible with bcrypt 4.0.1)

## How to Test

### Using Python (Recommended)
```python
import requests

# Signup
response = requests.post("http://localhost:8000/api/auth/signup", json={
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
})
print(response.json())

# Signin
response = requests.post("http://localhost:8000/api/auth/signin", json={
    "email": "test@example.com",
    "password": "TestPass123"
})
print(response.json())
```

### Using curl
```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Signin
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

## Frontend Integration

The frontend should now be able to:
1. Call `/api/auth/signup` to create a new account
2. Call `/api/auth/signin` to authenticate
3. Receive JWT tokens in the response
4. Store tokens in cookies/localStorage
5. Use tokens for authenticated API calls

## Notes

- The backend must be restarted after making model changes
- Hot-reload with `--reload` flag should pick up changes automatically
- Database tables are created automatically on startup (development mode)
- JWT tokens use HS256 algorithm with the `BETTER_AUTH_SECRET` from environment

## Files Changed Summary

1. `backend/models/config.py` - Added `ignored_types` configuration
2. `backend/models/user.py` - Converted to `declared_attr` relationships
3. `backend/models/task.py` - Converted to `declared_attr` relationships
4. `backend/models/project.py` - Converted to `declared_attr` relationships
5. `backend/models/label.py` - Converted to `declared_attr` relationships
6. `backend/models/subtask.py` - Converted to `declared_attr` relationships
7. `backend/models/task_label.py` - Converted to `declared_attr` relationships
8. `backend/models/pomodoro_session.py` - Converted to `declared_attr` relationships
9. `backend/.env` - Updated CORS configuration

## Verification Checklist

- [x] Backend starts without errors
- [x] Database tables are created
- [x] Signup endpoint returns 201 with user data and tokens
- [x] Signin endpoint returns 200 with user data and tokens
- [x] JWT tokens can be decoded and verified
- [x] CORS allows localhost:3000
- [x] bcrypt password hashing works correctly
