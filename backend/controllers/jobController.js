import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import { matchJobSkills } from '../services/geminiService.js';
import { sendApplicationNotification } from '../utils/sendEmail.js';
import User from '../models/User.js';
import { logActivity } from '../utils/activityLogger.js';

export const getJobs = async (req, res) => {
  const { search, location, minPackage, skills, page = 1, limit = 12 } = req.query;
  const query = { isActive: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (location) query.location = { $regex: location, $options: 'i' };
  if (skills) query.skillsRequired = { $in: skills.split(',').map((s) => s.trim()) };

  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    Job.find(query).populate('recruiterId').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Job.countDocuments(query),
  ]);

  res.json({ success: true, data: jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('recruiterId').populate('postedBy', 'name');
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: job });
};

export const applyToJob = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const job = await Job.findById(req.params.id);

  if (!job || !job.isActive) return res.status(404).json({ success: false, message: 'Job not found' });
  if (student.cgpa < job.minCGPA) {
    return res.status(400).json({ success: false, message: `Minimum CGPA required: ${job.minCGPA}` });
  }

  const existing = await Application.findOne({ studentId: student._id, jobId: job._id });
  if (existing) return res.status(400).json({ success: false, message: 'Already applied' });

  const match = await matchJobSkills(student.skills, job.skillsRequired);
  const application = await Application.create({
    studentId: student._id,
    jobId: job._id,
    matchScore: match.matchScore,
  });

  await logActivity(req.user._id, 'APPLY_JOB', 'Application', application._id, job.title, req.ip);

  const recruiter = await User.findById(job.postedBy);
  if (recruiter) {
    req.io?.to(`user_${recruiter._id}`).emit('notification', {
      type: 'new_application',
      message: `New application for ${job.title}`,
      jobId: job._id,
    });
  }

  res.status(201).json({ success: true, data: application, matchDetails: match });
};

export const getJobMatch = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  const match = await matchJobSkills(student.skills, job.skillsRequired);
  res.json({ success: true, data: match });
};
