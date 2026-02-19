"""
SQLModel Configuration for TodoFlow Application.
"""

from sqlalchemy.orm import declared_attr
from sqlmodel import SQLModel
from sqlalchemy import MetaData


NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=NAMING_CONVENTION)


class SQLModelConfig(SQLModel):
    """Base configuration class for all SQLModel models."""

    model_config = {
        "arbitrary_types_allowed": True,
        "ignored_types": (declared_attr,),
        "json_schema_extra": {
            "example": {
                "created_at": "2026-02-17T10:30:00Z",
                "updated_at": "2026-02-17T10:30:00Z",
            }
        }
    }
