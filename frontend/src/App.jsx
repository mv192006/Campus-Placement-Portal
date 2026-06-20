import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import AppliedJobs from './pages/student/AppliedJobs';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import JobManagement from './pages/recruiter/JobManagement';
import CreateJob from './pages/recruiter/CreateJob';
import ApplicantsPage from './pages/recruiter/ApplicantsPage';
import CandidateRankingPage from './pages/recruiter/CandidateRankingPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageRecruiters from './pages/admin/ManageRecruiters';
import ManageJobs from './pages/admin/ManageJobs';

import JobsPage from './pages/jobs/JobsPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import ResumeAnalysisPage from './pages/ai/ResumeAnalysisPage';
import InterviewPrepPage from './pages/ai/InterviewPrepPage';

import {
  LayoutDashboard, User, Briefcase, FileText, Brain, Users, Building2, BarChart3, ClipboardList,
} from 'lucide-react';

const studentNav = [
  { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/profile', label: 'Profile', icon: User },
  { path: '/student/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/student/applications', label: 'Applications', icon: ClipboardList },
  { path: '/student/resume', label: 'Resume Analysis', icon: FileText },
  { path: '/student/interview', label: 'Interview Prep', icon: Brain },
];

const recruiterNav = [
  { path: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/recruiter/profile', label: 'Company Profile', icon: Building2 },
  { path: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
  { path: '/recruiter/browse-jobs', label: 'Browse Jobs', icon: ClipboardList },
];

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/students', label: 'Students', icon: Users },
  { path: '/admin/recruiters', label: 'Recruiters', icon: Building2 },
  { path: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Public jobs — wrapped in PublicLayout with header/footer */}
            <Route element={<PublicLayout />}>
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
            </Route>

            {/* Student routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout navItems={studentNav} title="Student Portal" />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/applications" element={<AppliedJobs />} />
                <Route path="/student/resume" element={<ResumeAnalysisPage />} />
                <Route path="/student/interview" element={<InterviewPrepPage />} />
                <Route path="/student/jobs" element={<JobsPage />} />
                <Route path="/student/jobs/:id" element={<JobDetailPage />} />
              </Route>
            </Route>

            {/* Recruiter routes */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route element={<DashboardLayout navItems={recruiterNav} title="Recruiter Portal" />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/profile" element={<RecruiterProfile />} />
                <Route path="/recruiter/jobs" element={<JobManagement />} />
                <Route path="/recruiter/jobs/new" element={<CreateJob />} />
                <Route path="/recruiter/jobs/:id/applicants" element={<ApplicantsPage />} />
                <Route path="/recruiter/jobs/:id/rank" element={<CandidateRankingPage />} />
                <Route path="/recruiter/browse-jobs" element={<JobsPage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout navItems={adminNav} title="Admin Portal" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<ManageStudents />} />
                <Route path="/admin/recruiters" element={<ManageRecruiters />} />
                <Route path="/admin/jobs" element={<ManageJobs />} />
                <Route path="/admin/analytics" element={<AdminDashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
