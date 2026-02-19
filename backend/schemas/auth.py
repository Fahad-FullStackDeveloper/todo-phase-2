"""
Authentication Schemas for TodoFlow Application.

Pydantic v2 schemas for authentication request/response validation.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    """Schema for user signup request."""

    email: EmailStr = Field(
        ...,
        max_length=255,
        description="User's email address (must be unique)",
        examples=["user@example.com"],
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Password (min 8 chars, must include uppercase, lowercase, and number)",
        examples=["SecurePass123"],
    )
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="User's display name",
        examples=["John Doe"],
    )

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password has uppercase, lowercase, and number."""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Trim and validate name."""
        return v.strip()


class UserLogin(BaseModel):
    """Schema for user signin request."""

    email: EmailStr = Field(
        ...,
        max_length=255,
        description="User's email address",
        examples=["user@example.com"],
    )
    password: str = Field(
        ...,
        description="User's password",
        examples=["SecurePass123"],
    )
    remember_me: bool = Field(
        default=False,
        description="Extend session to 30 days if true",
    )


class UserOut(BaseModel):
    """Schema for user response (excludes sensitive data)."""

    id: str = Field(..., description="User unique identifier")
    email: str = Field(..., description="User's email address")
    name: str = Field(..., description="User's display name")
    created_at: datetime = Field(..., description="Account creation timestamp")

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response."""

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiration in seconds")


class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request."""

    refresh_token: str = Field(..., description="Valid refresh token")


class AuthResponse(BaseModel):
    """Schema for authentication response (user + tokens)."""

    user: UserOut = Field(..., description="Authenticated user information")
    token: TokenResponse = Field(..., description="JWT tokens")


class TokenRefreshResponse(BaseModel):
    """Schema for token refresh response."""

    token: TokenResponse = Field(..., description="New JWT tokens")


class SignoutResponse(BaseModel):
    """Schema for signout response."""

    success: bool = Field(..., description="Whether signout was successful")
    message: str = Field(..., description="Success message")


class UserDeleteResponse(BaseModel):
    """Schema for user deletion response."""

    success: bool = Field(..., description="Whether deletion was successful")
    message: str = Field(..., description="Success or error message")
    deleted_email: Optional[str] = Field(None, description="Email of deleted user")
