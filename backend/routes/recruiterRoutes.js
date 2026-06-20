import express from 'express';
import {
  getRecruiterProfile,
  updateRecruiterProfile,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getJobApplicants,
  updateApplicationStatus,
  rankJobCandidates,
  scheduleInterview,
  addInterviewFeedback,
  getRecruiterInterviews,
  getRecruiterDashboard,
} from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';
import { jobValidation } from '../utils/validators.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect, authorize('recruiter'));

router.get('/profile', getRecruiterProfile);
router.put('/profile', upload.single('logo'), handleMulterError, updateRecruiterProfile);
router.get('/dashboard', getRecruiterDashboard);
router.post('/jobs', jobValidation, validate, createJob);
router.get('/jobs', getRecruiterJobs);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/jobs/:id/applicants', getJobApplicants);
router.put('/jobs/:jobId/applications/:applicationId', updateApplicationStatus);
router.get('/jobs/:id/rank-candidates', rankJobCandidates);
router.post('/interviews', scheduleInterview);
router.get('/interviews', getRecruiterInterviews);
router.put('/interviews/:id/feedback', addInterviewFeedback);

export default router;
