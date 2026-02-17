# TodoFlow

**Premium SaaS Todo Application** | Phase 2 - Full-Stack Web Application

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 Overview

TodoFlow is a premium SaaS todo/task management application with 27 features (9 basic + 18 premium). This monorepo contains:

- **Frontend:** Next.js 16.1.6 (App Router, Server Components, TypeScript)
- **Backend:** Python FastAPI with SQLModel ORM
- **Database:** Neon Serverless PostgreSQL (local: PostgreSQL 15)
- **Authentication:** Better Auth + JWT with user isolation

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js 18+** (for local frontend development)
- **Python 3.11+** (for local backend development)

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd phase-2

# 2. Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Generate secure secret for JWT
python -c "import secrets; print(secrets.token_urlsafe(32))"
# Copy the output and update BETTER_AUTH_SECRET in .env

# 4. Start all services
docker-compose up --build

# 5. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Unix/Mac)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET

# Run with hot-reload
uvicorn main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env

# Run development server
npm run dev
```

---

## 📁 Project Structure

```
phase-2/
├── .specify/                    # Spec-Kit Plus specifications
│   ├── memory/constitution.md   # Project constitution
│   ├── specs/                   # All specifications
│   ├── templates/               # Templates
│   └── scripts/                 # Automation scripts
├── backend/                     # FastAPI Backend
│   ├── main.py                  # App entry point
│   ├── db.py                    # Database config
│   ├── models/                  # SQLModel models (7)
│   ├── routes/                  # API routes
│   ├── middleware/              # JWT middleware
│   ├── tests/                   # Test suite
│   └── alembic/                 # Migrations
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   ├── lib/api.ts           # API client
│   │   ├── hooks/               # Custom hooks
│   │   └── types/               # TypeScript types
│   └── public/                  # Static assets
├── docker-compose.yml           # Container orchestration
├── .env.example                 # Environment template
├── CLAUDE.md                    # Project guidelines
└── README.md                    # This file
```

---

## 🔧 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16.1.6 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| TanStack Query | Server state management |
| Better Auth | JWT authentication |
| @dnd-kit | Drag-and-drop |
| date-fns | Date formatting |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance API |
| SQLModel | Type-safe ORM |
| PostgreSQL | Database |
| Alembic | Migrations |
| python-jose | JWT handling |
| passlib | Password hashing |

---

## 🔐 Environment Variables

### Root `.env`
```bash
# Database
DB_USER=todoflow
DB_PASSWORD=todoflow_secret
DB_NAME=todoflow
DB_PORT=5432

# Authentication (MUST be 32+ characters)
BETTER_AUTH_SECRET=your-secure-random-secret-key

# Ports
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

### Backend `.env`
```bash
DATABASE_URL=postgresql://todoflow:todoflow_secret@localhost:5432/todoflow
BETTER_AUTH_SECRET=your-secure-random-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/signin` | Login |
| POST | `/api/auth/signout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/complete` | Toggle complete |
| DELETE | `/api/tasks/:id` | Delete task |

### Projects, Labels, Dashboard, Pomodoro
See full API documentation at `http://localhost:8000/docs`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
pytest tests/ -v --cov=backend
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Project guidelines and workflow
- **[Backend CLAUDE.md](backend/CLAUDE.md)** - Backend-specific guidelines
- **[Frontend CLAUDE.md](frontend/CLAUDE.md)** - Frontend-specific guidelines
- **[Specs](.specify/specs/)** - Feature specifications
- **[Constitution](.specify/memory/constitution.md)** - Project constitution

---

## 🛠️ Development Commands

### Docker
```bash
docker-compose up              # Start all services
docker-compose up --build      # Rebuild and start
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose exec backend bash    # Access backend
docker-compose exec frontend bash   # Access frontend
```

### Backend
```bash
uvicorn main:app --reload      # Run with hot-reload
alembic upgrade head           # Run migrations
alembic revision --autogenerate -m "msg"  # Create migration
pytest                         # Run tests
```

### Frontend
```bash
npm run dev                    # Development server
npm run build                  # Production build
npm run start                  # Start production
npm run lint                   # Run linter
```

---

## 🔒 Security

- JWT tokens with configurable expiration
- Password hashing with bcrypt
- CORS configuration for allowed origins
- SQL injection prevention via SQLModel
- XSS prevention via React escaping

### Important: Shared Secret
The `BETTER_AUTH_SECRET` environment variable MUST be identical in both frontend and backend for JWT verification to work.

---

## 📝 Phase 1 Completion

Phase 1: Setup & Project Initialization is **COMPLETE**:

- [x] T001: Project structure created
- [x] T002: Backend requirements.txt configured
- [x] T003: Next.js 16.1.6 initialized
- [x] T004: Backend dependencies documented
- [x] T005: Frontend dependencies documented
- [x] T006: docker-compose.yml created
- [x] T007: .env.example files created
- [x] T008: CLAUDE.md files created

---

## 🤝 Contributing

1. Read relevant specs in `.specify/specs/`
2. Create feature branch
3. Implement with spec references
4. Test thoroughly
5. Submit pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLModel](https://sqlmodel.tiangolo.com/)
- [Better Auth](https://better-auth.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

*Built with ❤️ for the Q4 Hackathon*
