# 🎓 AI-Powered Campus Placement Portal

A comprehensive, production-ready MERN stack campus placement portal designed to streamline the recruitment process for universities, students, and companies. By leveraging advanced AI capabilities, the platform automates resume analysis, intelligently matches candidates to jobs, and provides an end-to-end placement prediction and preparation ecosystem.

---

## 🌟 The Whole Idea: Project Overview

Traditional campus placement processes are often manual, time-consuming, and lack personalization. This project bridges the gap between students, recruiters, and university administrators by providing a unified, intelligent platform:

- **For Students:** Acts as a career launchpad with AI-driven resume scoring, personalized job recommendations, and an automated mock interview chatbot for comprehensive preparation.
- **For Recruiters:** Significantly reduces time-to-hire. The AI automatically ranks applicants based on job requirements, parses resumes to extract key skills instantly, and streamlines the interview scheduling process.
- **For Administrators:** Offers a bird's-eye view of placement statistics, student engagement, and company participation through an interactive analytics dashboard.

---

## 🚀 How It Works (The Core Workflow)

### 1. The Student Journey
1. **Profile Building:** Students register and upload their resumes in PDF format.
2. **AI Resume Analysis:** The system uses Google Gemini AI to parse the resume, generate an ATS score, extract core skills, and suggest actionable improvements.
3. **Smart Job Matching:** The platform recommends relevant job postings based on the student's extracted skills and profile data.
4. **Interview Preparation:** Students can practice with an **AI Mock Interview Chatbot** that evaluates technical, HR, and scenario-based answers, providing real-time scoring and feedback.
5. **Application & Tracking:** Students apply to jobs and track their application status (e.g., Pending, Interview Scheduled, Selected, Rejected) in real-time.

### 2. The Recruiter Journey
1. **Company Setup & Job Posting:** Recruiters register their company profile and post detailed job openings with specific skill requirements.
2. **Applicant Tracking:** Recruiters view incoming applications through a dedicated, organized dashboard.
3. **AI Candidate Ranking:** The platform automatically ranks all applicants for a specific job based on how well their resume matches the job description, allowing recruiters to focus on top talent immediately.
4. **Interview Scheduling:** Recruiters can schedule interviews, provide feedback, and update candidate statuses seamlessly.

### 3. The Administrator Journey
1. **Platform Moderation:** Admins oversee the platform, managing users (students and recruiters) and job postings.
2. **Analytics & Insights:** Admins access a powerful dashboard with rich visualizations (via Chart.js) detailing placement success rates, top hiring companies, and platform activity logs.

---

## 💻 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Chart.js |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Auth** | JWT, bcrypt |
| **File Storage** | Multer + Cloudinary |
| **AI Integration**| Google Gemini API |
| **Real-time** | Socket.io |
| **API Docs** | Swagger UI |

---

## 📂 Project Structure

```
├── backend/
│   ├── config/          # DB, Cloudinary, Swagger configurations
│   ├── controllers/     # Route handlers & business logic
│   ├── middleware/      # Auth, file upload, validation, error handling
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express API routes
│   ├── services/        # Gemini AI, Cloudinary, PDF parser services
│   └── utils/           # Token generation, email, logging, database seeders
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route pages segregated by role (Student, Recruiter, Admin)
│       ├── redux/       # Redux Toolkit state management
│       ├── services/    # Axios API clients
│       ├── context/     # Theme & notification providers
│       └── hooks/       # Custom React hooks
└── docker-compose.yml
```

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Gemini API key

### 1. Clone & Install Dependencies

```bash
# Backend setup
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install

# Frontend setup
cd ../frontend
cp .env.example .env
npm install
```

### 2. Environment Variables Configuration

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
*Default admin credentials:* `admin@placement.com` / `Admin@123456`

### 4. Run Development Servers

```bash
# Terminal 1 - Start Backend
cd backend && npm run dev

# Terminal 2 - Start Frontend
cd frontend && npm run dev
```

- **Frontend Application:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Swagger Documentation:** http://localhost:5000/api-docs

---

## 📖 API Documentation (Highlights)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/student` | Register a new student |
| POST | `/api/auth/register/recruiter` | Register a new recruiter |
| POST | `/api/auth/login` | Login (all roles) |
| GET | `/api/auth/me` | Retrieve current user profile |

### Jobs & Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs with search & filter capabilities |
| POST | `/api/jobs/:id/apply` | Apply to a specific job (Student) |

### AI Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/resume-analysis` | Analyze uploaded resume PDF |
| POST | `/api/ai/job-matching` | Compare candidate skills with job description |
| POST | `/api/ai/mock-interview` | Evaluate mock interview answers |

*(Full documentation available via Swagger UI)*

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to your GitHub repository.
2. Import project in [Vercel](https://vercel.com).
3. Set Root Directory to `frontend`.
4. Add environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-backend.onrender.com`
5. Deploy!

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect GitHub repo, set root directory to `backend`.
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `.env.example`.
6. Set `CLIENT_URL` to your Vercel frontend URL.

### Docker
To run the entire stack locally using Docker:
```bash
docker-compose up --build
```

---

## 👥 User Roles & Access

| Role | Core Capabilities |
|------|-------------------|
| **Student** | Profile management, Job board, Application tracking, AI Resume Analysis, AI Mock Interviews |
| **Recruiter** | Company profile, Job management, Applicant tracking, AI Candidate Ranking, Interview Scheduling |
| **Admin** | Full platform moderation, User management, Advanced Analytics & Reports |

---

## 📜 License
MIT License
