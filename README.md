# TodoFlow - Phase 2 Setup Guide

**Version:** 2.0.0
**Current Version:** 1.4.1
**Last Updated:** 18 Feb 2026
**Build Status:** ✅ Deployment Ready (0 warnings)

---

## Quick Start

```bash
# Prerequisites
- Node.js >= 20.0.0
- Python >= 3.11
- Docker & Docker Compose (optional)
- Git

# Clone and setup
cd phase-2

# Option 1: Using Docker (Recommended)
docker-compose up --build

# Option 2: Manual Setup
# See detailed instructions below
```

---

## Prerequisites

### Required Software

| Software | Version | Purpose | Install Link |
|----------|---------|---------|--------------|
| **Node.js** | >= 20.0.0 | Frontend (Next.js) | https://nodejs.org/ |
| **Python** | >= 3.11 | Backend (FastAPI) | https://python.org/ |
| **Git** | Latest | Version control | https://git-scm.com/ |
| **Docker** (optional) | Latest | Containerization | https://docker.com/ |

### Verify Installation

```bash
# Check Node.js version (must be >= 20.0.0)
node --version

# Check npm version (must be >= 10.0.0)
npm --version

# Check Python version (must be >= 3.11)
python --version

# Check Git
git --version
```

---

## Project Structure

```
phase-2/
├── frontend/              # Next.js 16.1.6 Application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities, API client
│   │   └── types/        # TypeScript types
│   ├── package.json
│   └── .nvmrc           # Node version (20.11.0)
│
├── backend/              # FastAPI Application
│   ├── models/          # SQLModel database models
│   ├── routes/          # API endpoints
│   ├── tests/           # Pytest tests
│   ├── requirements.txt # Python dependencies
│   └── .venv/          # Python virtual environment
│
├── .specify/            # Spec-Kit Plus specifications
├── docker-compose.yml   # Docker orchestration
└── README.md           # This file
```

---

## Setup Instructions

### Option 1: Docker Setup (Recommended)

**Advantages:**
- ✅ All dependencies included
- ✅ Consistent environment across team
- ✅ Database included
- ✅ One command to start everything

```bash
# Start all services
docker-compose up --build

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and set:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Start development server
npm run dev

# Access: http://localhost:3000
```

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and set:
# DATABASE_URL=postgresql://user:password@localhost:5432/todoflow
# BETTER_AUTH_SECRET=your-secret-key-here

# Start development server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Access API docs: http://localhost:8000/docs
```

---

## Environment Variables

### Frontend (.env)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Optional: Production URLs
# NEXT_PUBLIC_API_URL=https://api.todoflow.com
# NEXT_PUBLIC_BETTER_AUTH_URL=https://todoflow.com
```

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoflow

# Authentication (MUST be same as frontend)
BETTER_AUTH_SECRET=your-secure-secret-key-min-32-characters

# JWT Configuration
JWT_ALGORITHM=HS256
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: SQL debug (set to false in production)
SQL_ECHO=false
```

---

## Development Workflow

### 1. Start Backend

```bash
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uvicorn backend.main:app --reload
```

### 2. Start Frontend (in new terminal)

```bash
cd frontend
npm run dev
```

### 3. Access Applications

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Alternative API Docs:** http://localhost:8000/redoc

---

## Testing

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

### Backend Tests

```bash
cd backend
source .venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=backend

# Run specific test file
pytest backend/tests/test_auth.py
```

---

## Troubleshooting

### Node Version Issues

**Error:** "Unsupported engine" or "Node version mismatch"

**Solution:**
```bash
# Check current Node version
node --version

# Should be >= 20.0.0
# If not, install correct version from https://nodejs.org/

# Or use nvm (Node Version Manager)
nvm install 20
nvm use 20
```

### Python Version Issues

**Error:** "Python 3.11 or higher required"

**Solution:**
```bash
# Check Python version
python --version

# Should be >= 3.11
# If not, install from https://python.org/
```

### Port Already in Use

**Error:** "Port 3000 already in use" or "Port 8000 already in use"

**Solution:**
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux - Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

**Error:** "Could not connect to database"

**Solution:**
1. Check DATABASE_URL in backend/.env
2. Ensure PostgreSQL is running
3. Verify database exists: `createdb todoflow`
4. Check credentials match

---

## Build for Production

### Frontend Build

```bash
cd frontend

# Create production build
npm run build

# Start production server
npm start
```

### Backend Build

```bash
cd backend

# No build needed for Python
# Just run with production settings
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Next Steps

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Database Schema
3. ✅ Complete Phase 3: Backend APIs
4. ✅ Complete Phase 4: Frontend Authentication UI
5. 🔄 Next: Phase 5 - Task Views & Editor

---

## Current Status

| Phase | Status | Version | Completion |
|-------|--------|---------|------------|
| Phase 1: Setup | ✅ Complete | 1.3.0 | 8/8 tasks (100%) |
| Phase 2: Database | ✅ Complete | 1.1.0 | 15/15 tasks (100%) |
| Phase 3: Backend APIs | ✅ Complete | 1.2.0 | 35/35 tasks (100%) |
| Phase 4: Frontend Auth | ✅ Complete | 1.4.1 | 25/25 tasks (100%) |
| Phase 5: Task Views | 🔄 In Progress | - | 0/25 tasks (0%) |

**Overall Progress:** 83/185 tasks complete (44.9%)

### Latest Version (v1.4.1)

**Build Status:** ✅ Clean build with 0 warnings
**Deployment:** ✅ Ready for Vercel & Docker

**Changes in v1.4.1:**
- Fixed middleware deprecation warning (renamed to proxy.ts)
- Fixed viewport metadata warnings
- Optimized build time (23.9s → 20.7s)

---

## Phase 4 Features (Latest)

**Implemented in v1.4.0:**
- ✅ Signup/Signin pages with form validation
- ✅ Better Auth integration with JWT cookies
- ✅ Protected dashboard route with middleware
- ✅ API client with auto JWT attachment and retry logic
- ✅ Root layout with TanStack Query provider
- ✅ Sidebar navigation with projects/labels
- ✅ Top navigation with search and user menu
- ✅ Dark mode toggle with theme persistence
- ✅ Responsive mobile menu
- ✅ shadcn/ui component library

**Test the authentication flow:**
1. Navigate to `http://localhost:3000`
2. Click "Get Started" → Signup page
3. Create account → Redirects to dashboard
4. Signout → Redirects to signin
5. Signin with credentials → Dashboard

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **SQLModel Docs:** https://sqlmodel.tiangolo.com
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://typescriptlang.org

---

**Need Help?** Check the `.specify/specs/` directory for detailed specifications.
