# User Management Guide

## Delete User Account

### Option 1: API Endpoint (Recommended for Testing)

A temporary DELETE endpoint has been added for development/testing purposes.

**Endpoint:**
```
DELETE /api/auth/users/{email}?admin_password={password}
```

**Usage:**
```bash
# Using curl
curl -X DELETE "http://localhost:8000/api/auth/users/test@example.com?admin_password=admin123"

# Using Python
import requests
response = requests.delete(
    "http://localhost:8000/api/auth/users/test@example.com",
    params={"admin_password": "admin123"}
)
print(response.json())
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User 'test@example.com' and all related data deleted successfully",
  "deleted_email": "test@example.com"
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "User not found",
  "deleted_email": null
}
```

**Response (Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid admin password"
}
```

**Configuration:**
- Default admin password: `admin123`
- Change in `backend/.env`: `ADMIN_PASSWORD=your_secure_password`

⚠️ **IMPORTANT:** This endpoint is for **DEVELOPMENT ONLY**. Remove it before production deployment.

---

### Option 2: Python Shell (Direct Database)

```bash
cd backend
python
```

```python
from db import get_db
from models.user import User
from sqlmodel import select

# Get database session
db = next(get_db())

# Find user by email
user = db.exec(select(User).where(User.email == "test@example.com")).first()

if user:
    print(f"Found user: {user.name} ({user.email})")
    # Delete user (cascade will delete tasks, projects, labels, sessions)
    db.delete(user)
    db.commit()
    print("User deleted successfully!")
else:
    print("User not found")

db.close()
```

---

### Option 3: Database GUI Tool

1. **Install DBeaver or pgAdmin**
2. **Connect to your database:**
   - Local: `postgresql://todoflow:todoflow_secret@localhost:5432/todoflow`
   - Production: Use Neon connection string from `backend/.env`
3. **Run SQL query:**
   ```sql
   -- Find user
   SELECT * FROM users WHERE email = 'test@example.com';
   
   -- Delete user (cascade handles related data)
   DELETE FROM users WHERE email = 'test@example.com';
   ```

---

## List All Users

### API Endpoint (To be implemented)
```bash
GET /api/auth/users
```

### Python Shell
```python
from db import get_db
from models.user import User
from sqlmodel import select

db = next(get_db())
users = db.exec(select(User)).all()

for user in users:
    print(f"{user.id} | {user.name} | {user.email} | {user.created_at}")

db.close()
```

### SQL Query
```sql
SELECT id, name, email, created_at FROM users ORDER BY created_at DESC;
```

---

## Reset All Data (Development Only)

⚠️ **WARNING:** This will delete ALL users and their data!

### Option 1: Drop and Recreate Tables
```bash
cd backend
python

from db import engine
from sqlmodel import SQLModel

# Drop all tables
SQLModel.metadata.drop_all(engine)
print("All tables dropped!")

# Recreate tables (empty)
SQLModel.metadata.create_all(engine)
print("Tables recreated!")
```

### Option 2: Docker Volume Reset
```bash
# Stop containers
docker-compose down

# Remove volumes
docker-compose down -v

# Start fresh
docker-compose up --build
```

---

## Security Notes

1. **Admin Password**: Change default `ADMIN_PASSWORD` in production
2. **Delete Endpoint**: Remove `DELETE /api/auth/users/{email}` before production
3. **CORS**: Ensure `FRONTEND_URL` is properly configured
4. **Database Access**: Never expose database credentials in frontend code

---

## Related Files

- `backend/routes/auth.py` - Delete endpoint implementation
- `backend/schemas/auth.py` - UserDeleteResponse schema
- `backend/.env` - ADMIN_PASSWORD configuration
- `backend/models/user.py` - User model with cascade relationships

---

*Last Updated: 18 Feb 2026*
