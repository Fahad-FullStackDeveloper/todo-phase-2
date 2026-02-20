# TodoFlow API Documentation

**Version:** 1.9.0  
**Base URL:** `http://localhost:8000/api` (development)  
**Interactive Docs:** http://localhost:8000/docs

---

## Authentication

All endpoints (except `/api/auth/signup` and `/api/auth/signin`) require JWT authentication.

Include the token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication Flow

1. **Signup** or **Signin** to receive tokens
2. Include `access_token` in all API requests
3. Token expires after 15 minutes
4. Use `refresh_token` to get new access token
5. **Signout** to invalidate tokens

---

## Auth Endpoints

### POST /api/auth/signup

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email format, weak password, or email already exists
- `422 Unprocessable Entity` - Validation error

---

### POST /api/auth/signin

Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid email or password
- `422 Unprocessable Entity` - Validation error

---

### POST /api/auth/signout

Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Successfully signed out"
}
```

---

### GET /api/auth/me

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2026-02-20T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or expired token

---

### POST /api/auth/refresh

Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

---

## Task Endpoints

### GET /api/tasks

List all tasks for the authenticated user with optional filters.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | `all` | Filter by status: `pending`, `completed`, `all` |
| `priority` | string | `all` | Filter by priority: `low`, `medium`, `high`, `urgent`, `all` |
| `project_id` | UUID | - | Filter by project |
| `label_id` | UUID | - | Filter by label |
| `due_date` | date | - | Filter by due date (ISO format) |
| `sort_by` | string | `created_at` | Sort field: `created_at`, `due_date`, `priority`, `title` |
| `sort_order` | string | `desc` | Sort order: `asc`, `desc` |
| `page` | integer | `1` | Page number for pagination |
| `limit` | integer | `50` | Items per page (max 100) |

**Success Response (200):**
```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project proposal",
      "description": "Write and submit the project proposal document",
      "priority": "high",
      "status": "pending",
      "due_date": "2026-02-25T17:00:00Z",
      "project_id": "550e8400-e29b-41d4-a716-446655440010",
      "completed": false,
      "completed_at": null,
      "created_at": "2026-02-20T10:30:00Z",
      "updated_at": "2026-02-20T10:30:00Z",
      "subtasks": [
        {
          "id": "sub-001",
          "title": "Research requirements",
          "completed": true,
          "position": 1
        }
      ],
      "labels": [
        {
          "id": "label-001",
          "name": "Work",
          "color": "#3B82F6"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "total_pages": 1
  }
}
```

---

### POST /api/tasks

Create a new task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "Complete project proposal",
  "description": "Write and submit the project proposal document",
  "priority": "high",
  "due_date": "2026-02-25T17:00:00Z",
  "project_id": "550e8400-e29b-41d4-a716-446655440010",
  "label_ids": ["label-001", "label-002"]
}
```

**Validation Rules:**
- `title`: Required, 1-200 characters
- `description`: Optional, max 10000 characters
- `priority`: Optional, one of: `low`, `medium`, `high`, `urgent` (default: `medium`)
- `due_date`: Optional, ISO 8601 format
- `project_id`: Optional, must exist and belong to user
- `label_ids`: Optional, array of label IDs

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project proposal",
  "description": "Write and submit the project proposal document",
  "priority": "high",
  "status": "pending",
  "due_date": "2026-02-25T17:00:00Z",
  "project_id": "550e8400-e29b-41d4-a716-446655440010",
  "completed": false,
  "created_at": "2026-02-20T10:30:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "subtasks": [],
  "labels": [
    {
      "id": "label-001",
      "name": "Work",
      "color": "#3B82F6"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Invalid data
- `404 Not Found` - Project or label not found
- `422 Unprocessable Entity` - Validation error

---

### GET /api/tasks/:id

Get a single task by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project proposal",
  "description": "Write and submit the project proposal document",
  "priority": "high",
  "status": "pending",
  "due_date": "2026-02-25T17:00:00Z",
  "project_id": "550e8400-e29b-41d4-a716-446655440010",
  "completed": false,
  "subtasks": [...],
  "labels": [...]
}
```

**Error Responses:**
- `404 Not Found` - Task not found or doesn't belong to user

---

### PUT /api/tasks/:id

Update an existing task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "Updated project proposal",
  "description": "Updated description",
  "priority": "urgent",
  "due_date": "2026-02-26T17:00:00Z"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Updated project proposal",
  "priority": "urgent",
  "updated_at": "2026-02-20T11:00:00Z",
  ...
}
```

---

### PATCH /api/tasks/:id/complete

Toggle task completion status.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "completed": true,
  "completed_at": "2026-02-20T11:00:00Z",
  "status": "completed"
}
```

---

### DELETE /api/tasks/:id

Delete a task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Subtask Endpoints

### POST /api/tasks/:id/subtasks

Add a subtask to a task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "title": "Research requirements",
  "position": 1
}
```

**Success Response (201):**
```json
{
  "id": "sub-001",
  "task_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Research requirements",
  "completed": false,
  "position": 1,
  "created_at": "2026-02-20T10:30:00Z"
}
```

---

### PATCH /api/tasks/:id/subtasks/:subtaskId

Toggle subtask completion.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "sub-001",
  "completed": true,
  "task_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

---

### DELETE /api/tasks/:id/subtasks/:subtaskId

Delete a subtask.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Subtask deleted successfully"
}
```

---

## Project Endpoints

### GET /api/projects

List all user projects.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Work",
      "description": "Work-related projects",
      "color": "#3B82F6",
      "task_count": 12,
      "completed_count": 5,
      "completion_rate": 41.7,
      "created_at": "2026-02-20T10:00:00Z"
    }
  ]
}
```

---

### POST /api/projects

Create a new project.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "name": "Work",
  "description": "Work-related projects",
  "color": "#3B82F6"
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters
- `description`: Optional, max 500 characters
- `color`: Optional, hex color format #RRGGBB (default: #3B82F6)

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "name": "Work",
  "color": "#3B82F6",
  "created_at": "2026-02-20T10:00:00Z"
}
```

---

### GET /api/projects/:id

Get project with tasks.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "name": "Work",
  "description": "Work-related projects",
  "color": "#3B82F6",
  "tasks": [...],
  "stats": {
    "total_tasks": 12,
    "completed_tasks": 5,
    "completion_rate": 41.7,
    "pending_tasks": 7
  }
}
```

---

### GET /api/projects/:id/stats

Get project statistics.

**Success Response (200):**
```json
{
  "project_id": "550e8400-e29b-41d4-a716-446655440010",
  "total_tasks": 12,
  "completed_tasks": 5,
  "pending_tasks": 7,
  "completion_rate": 41.7,
  "overdue_tasks": 2,
  "tasks_due_today": 3
}
```

---

## Label Endpoints

### GET /api/labels

List all user labels.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "labels": [
    {
      "id": "label-001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Work",
      "color": "#3B82F6",
      "task_count": 12,
      "created_at": "2026-02-20T10:00:00Z"
    }
  ]
}
```

---

### POST /api/labels

Create a new label.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "name": "Work",
  "color": "#3B82F6"
}
```

**Validation Rules:**
- `name`: Required, 1-50 characters, alphanumeric + -_
- `color`: Required, hex color format #RRGGBB

**Success Response (201):**
```json
{
  "id": "label-001",
  "name": "Work",
  "color": "#3B82F6",
  "task_count": 0,
  "created_at": "2026-02-20T10:00:00Z"
}
```

---

### PUT /api/labels/:id

Update a label.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "name": "Business",
  "color": "#22C55E"
}
```

**Success Response (200):**
```json
{
  "id": "label-001",
  "name": "Business",
  "color": "#22C55E",
  "updated_at": "2026-02-20T11:00:00Z"
}
```

---

### DELETE /api/labels/:id

Delete a label.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Label deleted successfully"
}
```

---

## Dashboard Endpoints

### GET /api/dashboard/stats

Get dashboard overview statistics.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `period`: `all_time`, `last_7_days`, `last_30_days`, `this_month`

**Success Response (200):**
```json
{
  "total_tasks": 156,
  "completed_today": 8,
  "completion_rate": 73.5,
  "current_streak": 12,
  "longest_streak": 45,
  "last_completed_date": "2026-02-20",
  "period": "all_time"
}
```

---

### GET /api/dashboard/weekly-activity

Get last 7 days activity data.

**Success Response (200):**
```json
{
  "days": [
    {
      "date": "2026-02-14",
      "day_name": "Saturday",
      "created": 5,
      "completed": 3
    },
    ...
  ]
}
```

---

### GET /api/dashboard/streak

Get streak information.

**Success Response (200):**
```json
{
  "current_streak": 12,
  "longest_streak": 45,
  "last_completed_date": "2026-02-20",
  "streak_history": [
    {
      "start_date": "2026-02-09",
      "end_date": "2026-02-20",
      "days": 12,
      "is_current": true
    }
  ]
}
```

---

## Pomodoro Endpoints

### POST /api/pomodoro/sessions

Log a pomodoro session.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440001",
  "duration_minutes": 25,
  "completed": true,
  "session_date": "2026-02-20T10:00:00Z"
}
```

**Success Response (201):**
```json
{
  "id": "pomodoro-001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "task_id": "550e8400-e29b-41d4-a716-446655440001",
  "duration_minutes": 25,
  "completed": true,
  "session_date": "2026-02-20T10:00:00Z",
  "created_at": "2026-02-20T10:25:00Z"
}
```

---

### GET /api/pomodoro/stats

Get pomodoro statistics.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `period`: `all_time`, `last_7_days`, `last_30_days`, `this_month`

**Success Response (200):**
```json
{
  "period": "all_time",
  "total_sessions": 142,
  "total_minutes": 3550,
  "avg_session_length": 25.0,
  "daily_average": 2.3,
  "most_productive_day": "Tuesday",
  "longest_streak": 15
}
```

---

## Error Handling

All endpoints return errors in a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

API requests are rate limited to:
- 100 requests per minute per user
- 1000 requests per hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645356000
```

---

## Pagination

List endpoints support pagination with the following parameters:

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | integer | 1 | - |
| `limit` | integer | 50 | 100 |

**Pagination Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

---

*API Documentation v1.9.0 | Last Updated: 20 Feb 2026*
