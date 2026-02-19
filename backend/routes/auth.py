"""
Authentication Routes for TodoFlow Application.

Provides endpoints for user signup, signin, signout, profile, and token refresh.
All endpoints use JWT authentication compatible with Better Auth.

Endpoints:
    POST /api/auth/signup - Create new user account
    POST /api/auth/signin - Authenticate user and issue tokens
    POST /api/auth/signout - Logout user (invalidate token)
    GET  /api/auth/me - Get current user profile
    POST /api/auth/refresh - Refresh access token
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db import get_db
from middleware.auth import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    hash_password,
    verify_password,
)
from models.user import User
from schemas.auth import (
    AuthResponse,
    RefreshTokenRequest,
    SignoutResponse,
    TokenRefreshResponse,
    TokenResponse,
    UserCreate,
    UserDeleteResponse,
    UserLogin,
    UserOut,
)


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="User Signup",
    description="Create a new user account with email, password, and name.",
    responses={
        201: {"description": "Account created successfully"},
        400: {"description": "Validation error or email already exists"},
    },
)
async def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db),
) -> AuthResponse:
    """
    Create a new user account.

    - **email**: Must be a valid email address (unique)
    - **password**: Minimum 8 characters, must include uppercase, lowercase, and number
    - **name**: Display name (1-100 characters)

    Returns user information and JWT tokens on success.
    """
    # Check if email already exists
    existing_user = db.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate tokens
    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user, remember_me=False)

    return AuthResponse(
        user=UserOut.model_validate(user),
        token=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer",
            expires_in=900,  # 15 minutes
        ),
    )


@router.post(
    "/signin",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="User Signin",
    description="Authenticate user with email and password, issue JWT tokens.",
    responses={
        200: {"description": "Authentication successful"},
        401: {"description": "Invalid credentials"},
    },
)
async def signin(
    credentials: UserLogin,
    db: Session = Depends(get_db),
) -> AuthResponse:
    """
    Authenticate a user and issue JWT tokens.

    - **email**: User's email address
    - **password**: User's password
    - **remember_me**: Extend session to 30 days if true (default: 7 days)

    Returns user information and JWT tokens on success.
    """
    # Find user by email
    user = db.exec(
        select(User).where(User.email == credentials.email)
    ).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        # Generic error message to prevent email enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate tokens
    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user, remember_me=credentials.remember_me)

    return AuthResponse(
        user=UserOut.model_validate(user),
        token=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer",
            expires_in=900,  # 15 minutes
        ),
    )


@router.post(
    "/signout",
    response_model=SignoutResponse,
    status_code=status.HTTP_200_OK,
    summary="User Signout",
    description="Logout the current user and invalidate the session.",
    responses={
        200: {"description": "Successfully signed out"},
    },
)
async def signout(
    current_user: User = Depends(get_current_user),
) -> SignoutResponse:
    """
    Sign out the current user.

    This endpoint invalidates the current session. The client should
    clear any stored tokens and redirect to the signin page.

    Note: In a production environment, you might want to add the token
    to a blocklist to prevent reuse until expiration.
    """
    # In production, add token to blocklist here
    # For now, client-side token clearing is sufficient

    return SignoutResponse(
        success=True,
        message="Successfully signed out",
    )


@router.get(
    "/me",
    response_model=UserOut,
    status_code=status.HTTP_200_OK,
    summary="Get Current User",
    description="Get the profile of the currently authenticated user.",
    responses={
        200: {"description": "User profile retrieved successfully"},
        401: {"description": "Invalid or missing authentication token"},
    },
)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserOut:
    """
    Get the current authenticated user's profile.

    Requires a valid JWT token in the Authorization header.
    Returns the user's public profile information.
    """
    return UserOut.model_validate(current_user)


@router.post(
    "/refresh",
    response_model=TokenRefreshResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh Token",
    description="Refresh the access token using a valid refresh token.",
    responses={
        200: {"description": "Token refreshed successfully"},
        401: {"description": "Invalid or expired refresh token"},
    },
)
async def refresh_token(
    token_request: RefreshTokenRequest,
    db: Session = Depends(get_db),
) -> TokenRefreshResponse:
    """
    Refresh the access token using a valid refresh token.

    - **refresh_token**: A valid, non-expired refresh token

    Returns new access and refresh tokens (token rotation).
    """
    from middleware.auth import decode_token, JWTSettings

    try:
        # Decode and verify refresh token
        payload = decode_token(token_request.refresh_token, expected_type="refresh")

        # Get user from database
        user = db.get(User, payload.sub)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Generate new tokens (token rotation)
        new_access_token = create_access_token(user)
        new_refresh_token = create_refresh_token(
            user,
            remember_me=False,  # Default to standard expiration
        )

        return TokenRefreshResponse(
            token=TokenResponse(
                access_token=new_access_token,
                refresh_token=new_refresh_token,
                token_type="Bearer",
                expires_in=900,  # 15 minutes
            ),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


@router.delete(
    "/users/{email}",
    response_model=UserDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="[DEV ONLY] Delete User by Email",
    description="⚠️ DEVELOPMENT/TESTING ONLY - Delete a user account and all related data by email.",
    responses={
        200: {"description": "User and all related data deleted successfully"},
        401: {"description": "Invalid admin password"},
        404: {"description": "User not found"},
    },
)
async def delete_user_by_email(
    email: str,
    admin_password: str,
    db: Session = Depends(get_db),
) -> UserDeleteResponse:
    """
    ⚠️ DEVELOPMENT/TESTING ONLY - Delete a user account by email.

    **WARNING: This endpoint should be REMOVED or DISABLED in production!**

    Deletes the specified user and ALL related data via cascade:
    - Tasks
    - Projects
    - Labels
    - Pomodoro Sessions

    Requires admin password verification to prevent accidental deletion.

    - **email**: The email address of the user to delete
    - **admin_password**: Admin password for verification (set via ADMIN_PASSWORD env var)

    Returns success message with deleted email on success.
    """
    import os

    # Get admin password from environment variable
    admin_password_env = os.getenv("ADMIN_PASSWORD", "admin123")  # Default for dev

    # Verify admin password
    if admin_password != admin_password_env:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin password",
        )

    # Find user by email
    user = db.exec(select(User).where(User.email == email)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email '{email}' not found",
        )

    # Delete user (cascade will delete all related data: tasks, projects, labels, pomodoro sessions)
    db.delete(user)
    db.commit()

    return UserDeleteResponse(
        success=True,
        message=f"User '{email}' and all related data deleted successfully",
        deleted_email=email,
    )

