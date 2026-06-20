import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadResume,
  analyzeStudentResume,
  getAppliedJobs,
  getRecommendedJobs,
  getPlacementPrediction,
  saveJob,
  getSavedJobs,
  removeSavedJob,
  getStudentById,
  getDashboardStats,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', upload.single('profileImage'), handleMulterError, updateProfile);
router.post('/resume', upload.single('resume'), handleMulterError, uploadResume);
router.post('/resume/analyze', upload.single('resume'), handleMulterError, analyzeStudentResume);
router.get('/applications', getAppliedJobs);
router.get('/recommended-jobs', getRecommendedJobs);
router.get('/placement-prediction', getPlacementPrediction);
router.get('/dashboard', getDashboardStats);
router.post('/saved-jobs', saveJob);
router.get('/saved-jobs', getSavedJobs);
router.delete('/saved-jobs/:jobId', removeSavedJob);

export default router;

// Public student profile route (for recruiters)
export const studentPublicRouter = express.Router();
studentPublicRouter.get('/:id', protect, authorize('recruiter', 'admin'), getStudentById);
