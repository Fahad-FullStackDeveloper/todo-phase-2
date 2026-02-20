# TodoFlow - Premium Task Management Application

**Version:** 1.9.0  
**Phase:** Phase 8 Complete - Integration, QA & Testing  
**Build Status:** ✅ Production Ready  
**Last Updated:** 20 Feb 2026

---

## Overview

TodoFlow is a premium SaaS todo/task management application with **27 features** (9 basic + 18 premium). Built with modern technologies following best practices for security, performance, and user experience.

### Key Features

#### Basic Features (9)
- ✅ User Authentication (JWT-based)
- ✅ Task Management (CRUD operations)
- ✅ Projects with task organization
- ✅ Labels and tags system
- ✅ Subtasks with progress tracking
- ✅ Due dates and reminders
- ✅ Filtering and sorting
- ✅ Dark mode
- ✅ Responsive design

#### Premium Features (18)
- ✅ Kanban board with drag-and-drop
- ✅ Calendar view (month/week/day)
- ✅ Focus mode (distraction-free)
- ✅ Pomodoro timer with stats
- ✅ Analytics dashboard with charts
- ✅ Completion celebrations (confetti, milestones)
- ✅ Keyboard shortcuts
- ✅ PWA with offline support
- ✅ Browser notifications
- ✅ Natural language date parsing
- ✅ Quick add with smart defaults
- ✅ Completion streaks tracking
- ✅ Task priority system
- ✅ Project statistics
- ✅ Weekly activity insights
- ✅ Achievement badges
- ✅ Sound effects
- ✅ Install prompt

---

## Quick Start

### Prerequisites

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | >= 20.0.0 | Frontend (Next.js 16.1.6) |
| Python | >= 3.11 | Backend (FastAPI) |
| PostgreSQL | >= 15 | Database (or Neon Serverless) |
| Git | Latest | Version control |

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd todo-phase-2

# Start all services
docker-compose up --build

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and set your DATABASE_URL
# Example: DATABASE_URL=postgresql://user:pass@localhost:5432/todoflow

# Run migrations
alembic upgrade head

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local if needed (defaults work for local development)
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev

# Access frontend at http://localhost:3000
```

---

## Project Structure

```
todo-phase-2/
├── .specify/                    # Specifications & documentation
│   ├── memory/                  # Project constitution
│   ├── specs/                   # Feature specifications
│   ├── templates/               # Templates
│   └── history/                 # Prompt history records
├── backend/                     # FastAPI Backend
│   ├── main.py                  # FastAPI application
│   ├── db.py                    # Database configuration
│   ├── models/                  # SQLModel models (7 models)
│   ├── routes/                  # API route handlers
│   ├── middleware/              # JWT auth middleware
│   ├── schemas/                 # Pydantic schemas
│   ├── tests/                   # Test suite
│   ├── alembic/                 # Database migrations
│   └── requirements.txt         # Python dependencies
├── frontend/                    # Next.js 16.1.6 Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utilities
│   │   └── types/               # TypeScript types
│   ├── public/                  # Static assets
│   └── package.json             # Node dependencies
├── docker-compose.yml           # Container orchestration
├── .env.example                 # Environment template
├── README.md                    # This file
└── QWEN.md                      # Project documentation
```

---

## Technology Stack

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui + Tailwind CSS |
| Animations | Framer Motion |
| State Management | TanStack Query |
| Authentication | Better Auth + JWT |
| Charts | Recharts |
| Date Handling | date-fns, chrono-node |
| Drag & Drop | @dnd-kit |
| Confetti | canvas-confetti |

### Backend

| Layer | Technology |
|-------|------------|
| Framework | FastAPI |
| ORM | SQLModel |
| Database | PostgreSQL (Neon-compatible) |
| Migrations | Alembic |
| Authentication | JWT (python-jose) |
| Password Hashing | passlib + bcrypt |
| Validation | Pydantic |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create user account |
| POST | `/api/auth/signin` | Authenticate user |
| POST | `/api/auth/signout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh JWT token |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List user tasks (with filters) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/complete` | Toggle completion |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/subtasks` | Add subtask |
| PATCH | `/api/tasks/:id/subtasks/:subtaskId` | Toggle subtask |
| DELETE | `/api/tasks/:id/subtasks/:subtaskId` | Delete subtask |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project with tasks |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/projects/:id/stats` | Project statistics |

### Labels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/labels` | List user labels |
| POST | `/api/labels` | Create label |
| PUT | `/api/labels/:id` | Update label |
| DELETE | `/api/labels/:id` | Delete label |

### Dashboard & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/weekly-activity` | Weekly activity data |
| GET | `/api/dashboard/streak` | Streak information |
| GET | `/api/pomodoro/stats` | Pomodoro statistics |
| POST | `/api/pomodoro/sessions` | Log pomodoro session |

**Note:** All endpoints (except auth endpoints) require JWT authentication via `Authorization: Bearer <token>` header.

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/todoflow

# JWT Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-characters-long
FRONTEND_URL=http://localhost:3000
JWT_ALGORITHM=HS256
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-min-32-characters-long

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** `BETTER_AUTH_SECRET` must be identical in both frontend and backend for JWT verification.

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Integration Tests

```bash
# Backend integration tests
cd backend
pytest tests/integration/

# E2E flow tests
pytest tests/integration/test_e2e_flow.py
```

---

## Development

### Running Locally

```bash
# Terminal 1 - Backend
cd backend
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production

```bash
# Backend
cd backend
python -m pytest  # Run tests first
# Deploy to Railway/Render

# Frontend
cd frontend
npm run build
# Deploy to Vercel
```

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `BETTER_AUTH_SECRET` - Same as backend

### Backend (Railway/Render)

1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy

**Environment Variables:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Random 32+ character string
- `FRONTEND_URL` - Your Vercel app URL

### Database (Neon)

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Use in backend `DATABASE_URL`

---

## Documentation

- **[API Documentation](docs/api.md)** - Complete API reference with examples
- **[Deployment Guide](docs/deployment.md)** - Step-by-step deployment instructions
- **[User Guide](docs/user-guide.md)** - Features walkthrough and tips
- **[Keyboard Shortcuts](docs/shortcuts.md)** - All keyboard shortcuts reference
- **[Troubleshooting](TROUBLESHOOTING-GUIDE.md)** - Common issues and solutions

---

## Troubleshooting

### Common Issues

#### Frontend won't start
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

#### Backend database connection error
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
# Run migrations
cd backend
alembic upgrade head
```

#### JWT authentication issues
```bash
# Verify BETTER_AUTH_SECRET is identical in both frontend and backend
# Check token expiration (default: 15 minutes)
# Try signing in again
```

#### Port already in use
```bash
# Kill process on port 3000 (frontend)
# Windows:
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Kill process on port 8000 (backend)
netstat -ano | findstr :8000
taskkill /F /PID <PID>
```

### Debug Reports

- [Authentication Debug](AUTHENTICATION-DEBUG-REPORT.md)
- [Backend-Frontend Integration](BACKEND-FRONTEND-INTEGRATION-FIX.md)
- [Phase 6 Bugfixes](BUGFIXES-PHASE6.md)
- [Frontend Issues Fixed](FRONTEND-ISSUES-FIXED.md)

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code style
- Write tests for new features
- Update documentation
- Use TypeScript strict mode
- Follow spec-driven development

---

## License

This project is part of a hackathon and is provided as-is for educational purposes.

---

## Acknowledgments

- **Next.js** - React framework
- **FastAPI** - Python web framework
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Recharts** - Charts library
- **canvas-confetti** - Confetti animations

---

## Contact & Support

- **Documentation**: See `QWEN.md` for complete project documentation
- **Issues**: Report bugs in the issue tracker
- **Discussions**: Feature requests and general discussion

---

*Last Updated: 20 Feb 2026 | Version: 1.9.0 | Phase 8 Complete*
