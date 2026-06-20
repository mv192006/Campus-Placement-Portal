# AI-Powered Campus Placement Portal

A production-ready MERN stack campus placement portal with AI-powered resume analysis, job matching, interview preparation, candidate ranking, and placement prediction.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Chart.js |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| File Storage | Multer + Cloudinary |
| AI | Google Gemini API |
| Real-time | Socket.io |
| Docs | Swagger UI |

## Features

### Authentication
- Student & Recruiter signup/login, Admin login
- JWT authentication with role-based access control
- Forgot password & reset password via email

### Student Portal
- Profile management with resume upload (PDF)
- Job browse, search, filter, apply, save
- AI resume analyzer (ATS score, skills, improvements)
- Smart job recommendations
- Interview prep (20 technical + 10 HR + 5 scenario questions)
- Mock interview chatbot with scoring
- Placement probability prediction

### Recruiter Portal
- Company profile management
- Job CRUD operations
- View applicants, update status
- Schedule interviews with feedback
- AI candidate ranking

### Admin Portal
- Dashboard with stats
- Manage students, recruiters, jobs
- Placement analytics with charts
- Activity logs

## Project Structure

```
├── backend/
│   ├── config/          # DB, Cloudinary, Swagger
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, upload, validation, errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Gemini AI, ML, Cloudinary, PDF parser
│   └── utils/           # Token, email, logging, seed
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route pages by role
│       ├── redux/       # State management
│       ├── services/    # API client
│       ├── context/     # Theme, notifications
│       └── hooks/
└── docker-compose.yml
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Gemini API key

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Environment Variables

**Backend (`backend/.env`):**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
SMTP_USER=...
SMTP_PASS=...
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Admin User

```bash
cd backend
npm run seed
```

Default admin: `admin@placement.com` / `Admin@123456`

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/student` | Register student |
| POST | `/api/auth/register/recruiter` | Register recruiter |
| POST | `/api/auth/login` | Login (all roles) |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Send reset email |
| PUT | `/api/auth/reset-password/:token` | Reset password |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (search/filter) |
| GET | `/api/jobs/:id` | Job details |
| POST | `/api/jobs/:id/apply` | Apply to job (student) |
| GET | `/api/jobs/:id/match` | AI match score (student) |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/resume-analysis` | Analyze resume PDF |
| POST | `/api/ai/job-matching` | Compare skills |
| POST | `/api/ai/interview-prep` | Generate questions |
| POST | `/api/ai/mock-interview` | Evaluate answer |
| POST | `/api/ai/placement-prediction` | ML prediction |
| GET | `/api/ai/training-dataset` | Sample ML dataset |

### Student, Recruiter, Admin routes documented in Swagger UI.

## Deployment

### Frontend — Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-backend.onrender.com`
5. Deploy

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect GitHub repo, set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `.env.example`
6. Set `CLIENT_URL` to your Vercel frontend URL

### Docker

```bash
docker-compose up --build
```

## User Roles

| Role | Access |
|------|--------|
| Student | Profile, jobs, applications, AI tools |
| Recruiter | Company profile, job management, candidates |
| Admin | Full platform management & analytics |

## License

MIT
