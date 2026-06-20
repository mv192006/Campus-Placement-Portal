import express from 'express';
import {
  getDashboardStats,
  getAllStudents,
  getAllRecruiters,
  getAllJobs,
  toggleUserStatus,
  deleteJob,
  getPlacementAnalytics,
  getActivityLogs,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getAllStudents);
router.get('/recruiters', getAllRecruiters);
router.get('/jobs', getAllJobs);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/jobs/:id', deleteJob);
router.get('/analytics', getPlacementAnalytics);
router.get('/activity-logs', getActivityLogs);

export default router;
