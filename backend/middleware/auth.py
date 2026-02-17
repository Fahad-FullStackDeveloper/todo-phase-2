"""
JWT Authentication Middleware for TodoFlow Application.

Provides JWT token creation, verification, and user extraction for secure API access.
Compatible with Better Auth JWT tokens for seamless frontend/backend integration.

Token Configuration:
- Access Token: 15 minutes (900 seconds)
- Refresh Token: 7 days (604800 seconds) or 30 days with remember me
- Algorithm: HS256
- Secret: BETTER_AUTH_SECRET environment variable

Usage:
    @app.get("/protected")
    def protected_route(user: User = Depends(get_current_user)):
        return {"user_id": user.id}
"""

import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlmodel import Session

from ..db import get_db
from ..models.user import User


# =============================================================================
# Configuration
# =============================================================================

class JWTSettings:
    """JWT configuration from environment variables."""
    
    SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-secret-key-change-in-production-min-32-chars")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 15
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    REFRESH_TOKEN_REMEMBER_ME_DAYS = 30
    ISSUER = "todoflow-app"
    AUDIENCE = "todoflow-api"


# Validate secret key strength
if len(JWTSettings.SECRET_KEY) < 32:
    import warnings
    warnings.warn(
        "BETTER_AUTH_SECRET should be at least 32 characters for security. "
        "Using a weak secret in production is a security risk."
    )


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")


# =============================================================================
# Token Payload Models
# =============================================================================

class TokenPayload(BaseModel):
    """JWT token payload structure."""
    sub: str  # User ID
    email: str
    name: Optional[str] = None
    type: str  # "access" or "refresh"
    jti: str  # Unique token ID
    iat: int  # Issued at
    exp: int  # Expiration


class TokenResponse(BaseModel):
    """Token response for auth endpoints."""
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int  # Access token expiration in seconds


# =============================================================================
# Token Creation
# =============================================================================

def create_access_token(
    user: User,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token for a user.

    Args:
        user: User model instance
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token string
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=JWTSettings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.now(timezone.utc) + expires_delta
    jti = str(uuid.uuid4())

    payload = {
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "type": "access",
        "jti": jti,
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int(expire.timestamp()),
        "iss": JWTSettings.ISSUER,
        "aud": JWTSettings.AUDIENCE,
    }

    return jwt.encode(payload, JWTSettings.SECRET_KEY, algorithm=JWTSettings.ALGORITHM)


def create_refresh_token(
    user: User,
    remember_me: bool = False
) -> str:
    """
    Create a JWT refresh token for a user.

    Args:
        user: User model instance
        remember_me: If True, token expires in 30 days, otherwise 7 days

    Returns:
        Encoded JWT refresh token string
    """
    expire_days = (
        JWTSettings.REFRESH_TOKEN_REMEMBER_ME_DAYS
        if remember_me
        else JWTSettings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    expires_delta = timedelta(days=expire_days)
    expire = datetime.now(timezone.utc) + expires_delta
    jti = str(uuid.uuid4())

    payload = {
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "type": "refresh",
        "jti": jti,
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int(expire.timestamp()),
        "iss": JWTSettings.ISSUER,
        "aud": JWTSettings.AUDIENCE,
    }

    return jwt.encode(payload, JWTSettings.SECRET_KEY, algorithm=JWTSettings.ALGORITHM)


# =============================================================================
# Token Verification
# =============================================================================

def decode_token(token: str, expected_type: str = "access") -> TokenPayload:
    """
    Decode and verify a JWT token.

    Args:
        token: JWT token string
        expected_type: Expected token type ("access" or "refresh")

    Returns:
        TokenPayload with decoded claims

    Raises:
        HTTPException: If token is invalid, expired, or wrong type
    """
    try:
        payload = jwt.decode(
            token,
            JWTSettings.SECRET_KEY,
            algorithms=[JWTSettings.ALGORITHM],
            audience=JWTSettings.AUDIENCE,
            issuer=JWTSettings.ISSUER,
        )

        # Verify token type
        token_type = payload.get("type")
        if token_type != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token type. Expected {expected_type}, got {token_type}",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return TokenPayload(**payload)

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


def verify_token(token: str) -> TokenPayload:
    """
    Verify an access token and return the payload.

    Args:
        token: JWT access token string

    Returns:
        TokenPayload with decoded claims

    Raises:
        HTTPException: If token is invalid
    """
    return decode_token(token, expected_type="access")


# =============================================================================
# FastAPI Dependencies
# =============================================================================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency to get the current authenticated user from JWT token.

    This dependency:
    1. Extracts the token from Authorization header
    2. Decodes and verifies the JWT
    3. Fetches the user from the database
    4. Returns the user model

    Args:
        token: JWT token from Authorization header
        db: Database session

    Returns:
        User model instance

    Raises:
        HTTPException: 401 if token is invalid or user not found
    """
    # Decode and verify token
    payload = verify_token(token)

    # Get user from database
    user = db.get(User, payload.sub)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    FastAPI dependency to optionally get the current user.

    Returns None if no token is provided or token is invalid.
    Useful for endpoints that work for both authenticated and anonymous users.

    Args:
        token: Optional JWT token
        db: Database session

    Returns:
        User model instance or None
    """
    if token is None:
        return None

    try:
        return await get_current_user(token, db)
    except HTTPException:
        return None


# =============================================================================
# Password Hashing Utilities
# =============================================================================

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password string
    """
    return pwd_context.hash(password, rounds=12)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash.

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password

    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)
