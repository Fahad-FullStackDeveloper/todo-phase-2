-- SQL initialization script for TodoFlow database
-- This script runs when the PostgreSQL container is first initialized

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create application user (if not using default postgres user)
-- Note: In production, use proper IAM/role-based access

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE todoflow TO todoflow;

-- Note: Tables are created by SQLModel/Alembic migrations
-- This file is for initial database setup only
