"""
TodoFlow Database Models.

This module exports all SQLModel models and defines relationships
for the TodoFlow application database schema.

Models:
    - User: User accounts (integrates with Better Auth)
    - Task: Core task management
    - Project: Task organization groups
    - Subtask: Task breakdown items
    - Label: Task tagging/categorization
    - TaskLabel: Many-to-many junction (Task ↔ Label)
    - PomodoroSession: Focus session tracking

Relationships:
    - User → Tasks (one-to-many, cascade delete)
    - User → Projects (one-to-many, cascade delete)
    - User → Labels (one-to-many, cascade delete)
    - User → PomodoroSessions (one-to-many, cascade delete)
    - Task → Subtasks (one-to-many, cascade delete)
    - Task → TaskLabels (one-to-many, cascade delete)
    - Task ↔ Labels (many-to-many via TaskLabel)
    - Project → Tasks (one-to-many, SET NULL on delete)
"""

from .config import SQLModelConfig, metadata
from .user import User
from .task import Task, TaskStatus, TaskPriority
from .project import Project
from .subtask import Subtask
from .label import Label
from .task_label import TaskLabel
from .pomodoro_session import PomodoroSession

# Export all models for Alembic auto-discovery
__all__ = [
    "SQLModelConfig",
    "metadata",
    "User",
    "Task",
    "TaskStatus",
    "TaskPriority",
    "Project",
    "Subtask",
    "Label",
    "TaskLabel",
    "PomodoroSession",
]

# Relationship documentation (for reference):
# 
# User Relationships:
#   - user.tasks: List[Task] - All tasks owned by user
#   - user.projects: List[Project] - All projects owned by user
#   - user.labels: List[Label] - All labels owned by user
#   - user.pomodoro_sessions: List[PomodoroSession] - All sessions owned by user
#
# Task Relationships:
#   - task.user: User - Task owner
#   - task.project: Optional[Project] - Assigned project (SET NULL on delete)
#   - task.subtasks: List[Subtask] - Child subtasks (cascade delete)
#   - task.task_labels: List[TaskLabel] - Label associations (cascade delete)
#   - task.pomodoro_sessions: List[PomodoroSession] - Associated sessions
#
# Project Relationships:
#   - project.user: User - Project owner
#   - project.tasks: List[Task] - Tasks in this project
#
# Label Relationships:
#   - label.user: User - Label owner
#   - label.task_labels: List[TaskLabel] - Task associations (cascade delete)
#
# Subtask Relationships:
#   - subtask.task: Task - Parent task
#
# TaskLabel Relationships (Junction):
#   - task_label.task: Task - Associated task
#   - task_label.label: Label - Associated label
#
# PomodoroSession Relationships:
#   - pomodoro_session.user: User - Session owner
#   - pomodoro_session.task: Optional[Task] - Associated task (SET NULL on delete)
