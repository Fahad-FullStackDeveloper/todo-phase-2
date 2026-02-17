---
name: fastapi-jwt-security
description: Enforces secure JWT authentication, user isolation, and FastAPI best practices
---

# FastAPI JWT & Security Skill

When working on backend:

- ALWAYS use python-jose[cryptography] for JWT (HS256 symmetric)
- Shared secret: BETTER_AUTH_SECRET from environment
- Middleware / dependency: OAuth2PasswordBearer + custom get_current_user
- EVERY endpoint MUST verify JWT and filter by current_user.id
- User isolation rule: 
  - All queries MUST include WHERE user_id = current_user.id
  - Never return or allow modification of another user's data
- Passwords: hash with passlib bcrypt (or argon2)
- CORS: allow frontend origins only (from env)
- Error handling: HTTPException with detail, never leak stack traces
- Rate limiting: add slowapi or built-in limiter on sensitive routes
- Schemas: Pydantic v2 models for request/response
- Dependencies: use Depends(get_db), Depends(get_current_user)
- Lifespan: handle async engine dispose on shutdown

Reference versions:
- FastAPI ^0.129.0
- python-jose[cryptography] ^3.3.0
- passlib[bcrypt] ^1.7.4
- SQLModel ^0.0.34

Never return tasks/projects belonging to wrong user. Fail loudly on ownership violation.