import express from 'express';
import {
  resumeAnalysis,
  jobMatching,
  interviewPrep,
  mockInterview,
  placementPrediction,
  getStudentPrediction,
  getTrainingDataset,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.post('/resume-analysis', protect, upload.single('resume'), handleMulterError, resumeAnalysis);
router.post('/job-matching', protect, jobMatching);
router.post('/interview-prep', protect, authorize('student'), interviewPrep);
router.post('/mock-interview', protect, authorize('student'), mockInterview);
router.post('/placement-prediction', placementPrediction);
router.get('/placement-prediction/me', protect, authorize('student'), getStudentPrediction);
router.get('/training-dataset', getTrainingDataset);

export default router;
