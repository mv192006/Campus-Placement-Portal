import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import Interview from '../models/Interview.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { rankCandidatesLocal } from '../services/mlService.js';
import { rankCandidates as aiRankCandidates } from '../services/geminiService.js';
import { sendApplicationNotification, sendInterviewNotification } from '../utils/sendEmail.js';
import User from '../models/User.js';
import { logActivity } from '../utils/activityLogger.js';

export const getRecruiterProfile = async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id }).populate('userId', 'name email');
  if (!recruiter) return res.status(404).json({ success: false, message: 'Recruiter not found' });
  res.json({ success: true, data: recruiter });
};

export const updateRecruiterProfile = async (req, res) => {
  const { companyName, companyDescription, website } = req.body;
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  if (!recruiter) return res.status(404).json({ success: false, message: 'Recruiter not found' });

  if (companyName) recruiter.companyName = companyName;
  if (companyDescription) recruiter.companyDescription = companyDescription;
  if (website) recruiter.website = website;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'logos', 'image');
    recruiter.logo = result.secure_url;
  }

  await recruiter.save();
  res.json({ success: true, data: recruiter });
};

export const createJob = async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  const job = await Job.create({
    ...req.body,
    postedBy: req.user._id,
    recruiterId: recruiter._id,
    company: recruiter.companyName,
  });

  await logActivity(req.user._id, 'CREATE_JOB', 'Job', job._id, job.title, req.ip);
  res.status(201).json({ success: true, data: job });
};

export const updateJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  Object.assign(job, req.body);
  await job.save();
  res.json({ success: true, data: job });
};

export const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, message: 'Job deleted' });
};

export const getRecruiterJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
};

export const getJobApplicants = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  const applications = await Application.find({ jobId: job._id })
    .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
    .sort({ appliedAt: -1 });

  res.json({ success: true, data: applications });
};

export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  const application = await Application.findOneAndUpdate(
    { _id: req.params.applicationId, jobId: job._id },
    { status },
    { new: true }
  ).populate({ path: 'studentId', populate: { path: 'userId', select: 'email' } });

  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

  const studentEmail = application.studentId?.userId?.email;
  if (studentEmail) {
    await sendApplicationNotification(studentEmail, job.title, status);
  }

  res.json({ success: true, data: application });
};

export const rankJobCandidates = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const applications = await Application.find({ jobId: job._id }).populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'name email' },
    });

    if (applications.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Build clean candidate objects (plain JS, no Mongoose docs)
    const candidates = applications.map((a) => ({
      _id: a.studentId._id.toString(),
      userId: { name: a.studentId.userId?.name, email: a.studentId.userId?.email },
      cgpa: a.studentId.cgpa || 0,
      skills: a.studentId.skills || [],
      projects: a.studentId.projects || [],
      certifications: a.studentId.certifications || [],
      resumeAnalysis: a.studentId.resumeAnalysis ? { atsScore: a.studentId.resumeAnalysis.atsScore || 0 } : null,
      applicationId: a._id.toString(),
      status: a.status,
    }));

    // Build a lookup map: studentId -> applicationId
    const appIdMap = {};
    for (const c of candidates) {
      appIdMap[c._id] = c.applicationId;
    }

    let ranked = await aiRankCandidates(candidates, {
      skillsRequired: job.skillsRequired,
      minCGPA: job.minCGPA,
      title: job.title,
    });

    if (ranked) {
      // Map applicationId back onto AI-ranked results
      ranked = ranked.map((r) => ({
        ...r,
        studentId: r.studentId?.toString(),
        applicationId: appIdMap[r.studentId?.toString()] || null,
      }));
    } else {
      // Fallback to local ranking
      ranked = rankCandidatesLocal(candidates).map((r) => ({
        ...r,
        studentId: r.studentId?.toString(),
        applicationId: appIdMap[r.studentId?.toString()] || null,
      }));
    }

    res.json({ success: true, data: ranked });
  } catch (error) {
    console.error('Candidate ranking error:', error);
    res.status(500).json({ success: false, message: 'Failed to rank candidates. Please try again.' });
  }
};

export const scheduleInterview = async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  const { studentId, jobId, interviewDate, mode, location, meetingLink } = req.body;

  const job = await Job.findOne({ _id: jobId, postedBy: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  const interview = await Interview.create({
    studentId,
    recruiterId: recruiter._id,
    jobId,
    interviewDate,
    mode,
    location,
    meetingLink,
  });

  const student = await Student.findById(studentId).populate('userId', 'email');
  if (student?.userId?.email) {
    await sendInterviewNotification(student.userId.email, job.title, interviewDate);
  }

  await logActivity(req.user._id, 'SCHEDULE_INTERVIEW', 'Interview', interview._id, job.title, req.ip);
  res.status(201).json({ success: true, data: interview });
};

export const addInterviewFeedback = async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  const { feedback, rating } = req.body;

  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.id, recruiterId: recruiter._id },
    { feedback, rating, status: 'completed' },
    { new: true }
  );

  if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
  res.json({ success: true, data: interview });
};

export const getRecruiterInterviews = async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  const interviews = await Interview.find({ recruiterId: recruiter._id })
    .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
    .populate('jobId', 'title company')
    .sort({ interviewDate: -1 });

  res.json({ success: true, data: interviews });
};

export const getRecruiterDashboard = async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user._id });
  const jobIds = (await Job.find({ postedBy: req.user._id })).map((j) => j._id);

  const [jobs, applications, interviews] = await Promise.all([
    Job.countDocuments({ postedBy: req.user._id }),
    Application.countDocuments({ jobId: { $in: jobIds } }),
    Interview.countDocuments({ recruiterId: recruiter._id }),
  ]);

  res.json({ success: true, data: { jobs, applications, interviews } });
};
