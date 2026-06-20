import express from 'express';
import { getJobs, getJobById, applyToJob, getJobMatch } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/:id/apply', protect, authorize('student'), applyToJob);
router.get('/:id/match', protect, authorize('student'), getJobMatch);

export default router;
