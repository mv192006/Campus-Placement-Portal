import express from 'express';
import {
  registerStudent,
  registerRecruiter,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  registerStudentValidation,
  registerRecruiterValidation,
  loginValidation,
} from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register/student:
 *   post:
 *     summary: Register a new student
 *     tags: [Auth]
 */
router.post('/register/student', registerStudentValidation, validate, registerStudent);

/**
 * @swagger
 * /api/auth/register/recruiter:
 *   post:
 *     summary: Register a new recruiter
 *     tags: [Auth]
 */
router.post('/register/recruiter', registerRecruiterValidation, validate, registerRecruiter);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', loginValidation, validate, login);

router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/update-password', protect, updatePassword);

export default router;
