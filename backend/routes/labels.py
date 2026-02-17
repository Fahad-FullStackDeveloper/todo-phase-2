"""
Label Routes for TodoFlow Application.

Provides CRUD endpoints for label management with full user isolation.
All operations are filtered by the authenticated user's ID.

Endpoints:
    GET    /api/labels         - List all user labels
    POST   /api/labels         - Create a new label
    PUT    /api/labels/{id}    - Update a label
    DELETE /api/labels/{id}    - Delete a label
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlmodel import Session

from ..db import get_db
from ..middleware.auth import get_current_user
from ..models.label import Label
from ..models.user import User
from ..schemas.label import LabelCreate, LabelListResponse, LabelOut, LabelUpdate


router = APIRouter(prefix="/api/labels", tags=["Labels"])


def _verify_label_ownership(label: Label, user_id: str) -> None:
    """Verify that a label belongs to the specified user."""
    if label.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this label",
        )


@router.get(
    "",
    response_model=LabelListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Labels",
    description="Get all labels for the authenticated user.",
)
async def list_labels(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LabelListResponse:
    """
    List all labels for the authenticated user.

    Labels are returned sorted by name (ascending).
    """
    # Build query - ALWAYS filter by user_id for isolation
    query = select(Label).where(Label.user_id == current_user.id)

    # Sort by name
    query = query.order_by(Label.name.asc())

    # Execute query
    labels = db.exec(query).all()

    return LabelListResponse(
        labels=[LabelOut.model_validate(label) for label in labels],
        total=len(labels),
    )


@router.post(
    "",
    response_model=LabelOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create Label",
    description="Create a new label for the authenticated user.",
)
async def create_label(
    label_data: LabelCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LabelOut:
    """
    Create a new label.

    - **name**: Label name (required, 1-50 characters)
    - **color**: Hex color code (required, format: #RRGGBB)
    """
    # Check for duplicate label name (case-insensitive)
    existing_label = db.exec(
        select(Label).where(
            Label.user_id == current_user.id,
            Label.name.ilike(label_data.name),
        )
    ).first()

    if existing_label:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A label with the name '{label_data.name}' already exists",
        )

    # Create label
    label = Label(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=label_data.name,
        color=label_data.color,
        created_at=datetime.now(timezone.utc),
    )

    db.add(label)
    db.commit()
    db.refresh(label)

    return LabelOut.model_validate(label)


@router.put(
    "/{label_id}",
    response_model=LabelOut,
    status_code=status.HTTP_200_OK,
    summary="Update Label",
    description="Update a label (ownership verified).",
)
async def update_label(
    label_id: str,
    label_data: LabelUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LabelOut:
    """
    Update a label.

    - **name**: New label name (optional, 1-50 characters)
    - **color**: New hex color code (optional, format: #RRGGBB)

    Verifies that the label belongs to the authenticated user.
    """
    label = db.get(Label, label_id)

    if not label:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found",
        )

    _verify_label_ownership(label, current_user.id)

    # Update fields
    update_data = label_data.model_dump(exclude_unset=True)

    # Check for duplicate name if name is being updated
    if "name" in update_data and update_data["name"]:
        existing_label = db.exec(
            select(Label).where(
                Label.user_id == current_user.id,
                Label.name.ilike(update_data["name"]),
                Label.id != label_id,
            )
        ).first()

        if existing_label:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A label with the name '{update_data['name']}' already exists",
            )

    for field, value in update_data.items():
        if value is not None:
            setattr(label, field, value)

    db.commit()
    db.refresh(label)

    return LabelOut.model_validate(label)


@router.delete(
    "/{label_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Label",
    description="Delete a label (ownership verified).",
    responses={
        204: {"description": "Label deleted successfully"},
        404: {"description": "Label not found"},
        403: {"description": "Forbidden - label belongs to another user"},
    },
)
async def delete_label(
    label_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """
    Delete a label.

    This permanently deletes the label and removes all task associations.
    Tasks are NOT deleted, only the label association is removed.

    Verifies that the label belongs to the authenticated user.
    """
    label = db.get(Label, label_id)

    if not label:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found",
        )

    _verify_label_ownership(label, current_user.id)

    db.delete(label)
    db.commit()

    return None
