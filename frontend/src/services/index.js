import api from './api';

export const authAPI = {
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerRecruiter: (data) => api.post('/auth/register/recruiter', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  uploadResume: (formData) => api.post('/students/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  analyzeResume: (formData) => api.post('/students/resume/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getApplications: () => api.get('/students/applications'),
  getRecommendedJobs: () => api.get('/students/recommended-jobs'),
  getPlacementPrediction: () => api.get('/students/placement-prediction'),
  getDashboard: () => api.get('/students/dashboard'),
  saveJob: (jobId) => api.post('/students/saved-jobs', { jobId }),
  getSavedJobs: () => api.get('/students/saved-jobs'),
  removeSavedJob: (jobId) => api.delete(`/students/saved-jobs/${jobId}`),
};

export const recruiterAPI = {
  getProfile: () => api.get('/recruiters/profile'),
  updateProfile: (data) => api.put('/recruiters/profile', data),
  getDashboard: () => api.get('/recruiters/dashboard'),
  createJob: (data) => api.post('/recruiters/jobs', data),
  getJobs: () => api.get('/recruiters/jobs'),
  updateJob: (id, data) => api.put(`/recruiters/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/recruiters/jobs/${id}`),
  getApplicants: (jobId) => api.get(`/recruiters/jobs/${jobId}/applicants`),
  updateApplicationStatus: (jobId, applicationId, status) =>
    api.put(`/recruiters/jobs/${jobId}/applications/${applicationId}`, { status }),
  rankCandidates: (jobId) => api.get(`/recruiters/jobs/${jobId}/rank-candidates`),
  scheduleInterview: (data) => api.post('/recruiters/interviews', data),
  getInterviews: () => api.get('/recruiters/interviews'),
  addFeedback: (id, data) => api.put(`/recruiters/interviews/${id}/feedback`, data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  getRecruiters: () => api.get('/admin/recruiters'),
  getJobs: () => api.get('/admin/jobs'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  getMatch: (id) => api.get(`/jobs/${id}/match`),
};

export const aiAPI = {
  resumeAnalysis: (formData) => api.post('/ai/resume-analysis', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  jobMatching: (data) => api.post('/ai/job-matching', data),
  interviewPrep: (role) => api.post('/ai/interview-prep', { role }),
  mockInterview: (data) => api.post('/ai/mock-interview', data),
  placementPrediction: (data) => api.post('/ai/placement-prediction', data),
  getMyPrediction: () => api.get('/ai/placement-prediction/me'),
};

export const studentPublicAPI = {
  getById: (id) => api.get(`/students/${id}`),
};
