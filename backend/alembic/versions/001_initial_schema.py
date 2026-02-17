"""Initial database schema - all 7 tables

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-02-17 10:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all tables and indexes for initial schema."""
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_users'),
        sa.UniqueConstraint('email', name='uq_users_email')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=False)
    
    # Create projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('color', sa.String(length=7), nullable=False, server_default=sa.text("'#3B82F6'")),
        sa.Column('position', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_projects'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='fk_projects_user_id_users')
    )
    op.create_index('ix_projects_user_id', 'projects', ['user_id'], unique=False)
    
    # Create labels table
    op.create_table(
        'labels',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('color', sa.String(length=7), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_labels'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='fk_labels_user_id_users')
    )
    op.create_index('ix_labels_user_id', 'labels', ['user_id'], unique=False)
    op.create_index('ix_labels_user_name', 'labels', ['user_id', 'name'], unique=True)
    
    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.String(length=10000), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default=sa.text("'todo'")),
        sa.Column('priority', sa.Integer(), nullable=False, server_default=sa.text('3')),
        sa.Column('due_date', sa.DateTime(), nullable=True),
        sa.Column('project_id', sa.UUID(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('position', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_tasks'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='fk_tasks_user_id_users'),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='SET NULL', name='fk_tasks_project_id_projects'),
        sa.CheckConstraint("status IN ('todo', 'in_progress', 'done')", name='ck_tasks_status')
    )
    # Task indexes
    op.create_index('ix_tasks_user_id', 'tasks', ['user_id'], unique=False)
    op.create_index('ix_tasks_status', 'tasks', ['status'], unique=False)
    op.create_index('ix_tasks_priority', 'tasks', ['priority'], unique=False)
    op.create_index('ix_tasks_due_date', 'tasks', ['due_date'], unique=False)
    op.create_index('ix_tasks_project_id', 'tasks', ['project_id'], unique=False)
    op.create_index('ix_tasks_completed', 'tasks', ['completed'], unique=False)
    op.create_index('ix_tasks_created_at', 'tasks', ['created_at'], unique=False)
    # Composite indexes
    op.create_index('ix_tasks_user_status', 'tasks', ['user_id', 'status'], unique=False)
    op.create_index('ix_tasks_user_due_date', 'tasks', ['user_id', 'due_date'], unique=False)
    op.create_index('ix_tasks_user_priority', 'tasks', ['user_id', 'priority'], unique=False)
    op.create_index('ix_tasks_user_completed', 'tasks', ['user_id', 'completed'], unique=False)
    op.create_index('ix_tasks_due_date_completed', 'tasks', ['due_date', 'completed'], unique=False)
    
    # Create subtasks table
    op.create_table(
        'subtasks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('task_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('position', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_subtasks'),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ondelete='CASCADE', name='fk_subtasks_task_id_tasks'),
        sa.CheckConstraint('position >= 0', name='ck_subtasks_position')
    )
    op.create_index('ix_subtasks_task_id', 'subtasks', ['task_id'], unique=False)
    
    # Create task_labels junction table
    op.create_table(
        'task_labels',
        sa.Column('task_id', sa.UUID(), nullable=False),
        sa.Column('label_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('task_id', 'label_id', name='pk_task_labels'),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ondelete='CASCADE', name='fk_task_labels_task_id_tasks'),
        sa.ForeignKeyConstraint(['label_id'], ['labels.id'], ondelete='CASCADE', name='fk_task_labels_label_id_labels')
    )
    op.create_index('ix_task_labels_task_id', 'task_labels', ['task_id'], unique=False)
    op.create_index('ix_task_labels_label_id', 'task_labels', ['label_id'], unique=False)
    
    # Create pomodoro_sessions table
    op.create_table(
        'pomodoro_sessions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('task_id', sa.UUID(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=False),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('session_date', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_pomodoro_sessions'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='fk_pomodoro_sessions_user_id_users'),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ondelete='SET NULL', name='fk_pomodoro_sessions_task_id_tasks'),
        sa.CheckConstraint('duration_minutes > 0 AND duration_minutes <= 180', name='ck_pomodoro_sessions_duration')
    )
    op.create_index('ix_pomodoro_sessions_user_id', 'pomodoro_sessions', ['user_id'], unique=False)
    op.create_index('ix_pomodoro_sessions_task_id', 'pomodoro_sessions', ['task_id'], unique=False)


def downgrade() -> None:
    """Drop all tables in reverse order."""
    # Drop tables in reverse order of creation (respecting foreign keys)
    op.drop_table('pomodoro_sessions')
    op.drop_table('task_labels')
    op.drop_table('subtasks')
    op.drop_table('tasks')
    op.drop_table('labels')
    op.drop_table('projects')
    op.drop_table('users')
