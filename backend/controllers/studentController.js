import Student from '../models/Student.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import SavedJob from '../models/SavedJob.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { extractTextFromPDF } from '../services/resumeParser.js';
import { analyzeResume, matchJobSkills } from '../services/geminiService.js';
import { predictPlacement } from '../services/mlService.js';
import { logActivity } from '../utils/activityLogger.js';
import fs from 'fs';
import path from 'path';

export const getProfile = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id }).populate('userId', 'name email');
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
  res.json({ success: true, data: student });
};

export const updateProfile = async (req, res) => {
  const { branch, cgpa, graduationYear, skills, projects, certifications } = req.body;
  const student = await Student.findOne({ userId: req.user._id });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  if (branch !== undefined) student.branch = branch;
  if (cgpa !== undefined) student.cgpa = cgpa;
  if (graduationYear !== undefined) student.graduationYear = graduationYear;
  if (skills) student.skills = skills;
  if (projects) student.projects = projects;
  if (certifications) student.certifications = certifications;

  if (req.file && req.file.fieldname === 'profileImage') {
    const result = await uploadToCloudinary(req.file.buffer, 'profiles', 'image');
    student.profileImage = result.secure_url;
  }

  await student.save();
  await logActivity(req.user._id, 'UPDATE_PROFILE', 'Student', student._id, 'Profile updated', req.ip);
  res.json({ success: true, data: student });
};

export const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Resume PDF required' });

  const student = await Student.findOne({ userId: req.user._id });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  if (student.resumePublicId) await deleteFromCloudinary(student.resumePublicId);

  const result = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
  student.resumeUrl = result.secure_url;
  student.resumePublicId = result.public_id;
  await student.save();

  await logActivity(req.user._id, 'UPLOAD_RESUME', 'Student', student._id, 'Resume uploaded', req.ip);
  res.json({ success: true, data: { resumeUrl: student.resumeUrl } });
};

export const analyzeStudentResume = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    let resumeText = '';
    if (req.file) {
      // 1. Extract text from the uploaded file buffer
      resumeText = await extractTextFromPDF(req.file.buffer);

      // 2. Automatically save the resume (mimic uploadResume)
      if (student.resumePublicId) {
        await deleteFromCloudinary(student.resumePublicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
      student.resumeUrl = uploadResult.secure_url;
      student.resumePublicId = uploadResult.public_id;
    } else {
      if (!student.resumeUrl) {
        return res.status(400).json({ success: false, message: 'Upload resume first' });
      }

      // Try local file first
      const localPath = path.join(process.cwd(), 'public', 'uploads', student.resumePublicId);
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        resumeText = await extractTextFromPDF(fileBuffer);
      } else {
        // Fetch from Cloudinary URL and extract text
        try {
          const { default: axios } = await import('axios');
          const response = await axios.get(student.resumeUrl, { responseType: 'arraybuffer', timeout: 15000 });
          const pdfBuffer = Buffer.from(response.data);
          resumeText = await extractTextFromPDF(pdfBuffer);
        } catch (fetchErr) {
          console.warn('Could not fetch PDF from Cloudinary, using profile data:', fetchErr.message);
          // Last resort fallback — build text from profile data
          const parts = [];
          if (student.skills?.length) parts.push(`Skills: ${student.skills.join(', ')}`);
          if (student.projects?.length) parts.push(`Projects: ${student.projects.map((p) => `${p.title} - ${p.description || ''} (${(p.technologies || []).join(', ')})`).join('; ')}`);
          if (student.certifications?.length) parts.push(`Certifications: ${student.certifications.join(', ')}`);
          if (student.cgpa) parts.push(`CGPA: ${student.cgpa}`);
          if (student.branch) parts.push(`Branch: ${student.branch}`);
          resumeText = parts.join('. ') || 'No resume data available';
        }
      }
    }

    if (!resumeText || resumeText.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Could not extract meaningful text from resume. Please upload a valid PDF.' });
    }

    const analysis = await analyzeResume(resumeText, student.skills);
    student.resumeAnalysis = { ...analysis, analyzedAt: new Date() };
    await student.save();

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ success: false, message: 'Resume analysis failed. Please try again.' });
  }
};

export const getAppliedJobs = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const applications = await Application.find({ studentId: student._id })
    .populate({ path: 'jobId', populate: { path: 'recruiterId' } })
    .sort({ appliedAt: -1 });
  res.json({ success: true, data: applications });
};

export const getRecommendedJobs = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const appliedJobIds = (await Application.find({ studentId: student._id })).map((a) => a.jobId.toString());

  const jobs = await Job.find({ isActive: true, _id: { $nin: appliedJobIds } });

  const recommended = await Promise.all(
    jobs.map(async (job) => {
      const match = await matchJobSkills(student.skills, job.skillsRequired);
      return { ...job.toObject(), matchScore: match.matchScore, matchDetails: match };
    })
  );

  recommended.sort((a, b) => b.matchScore - a.matchScore);
  res.json({ success: true, data: recommended.slice(0, 20) });
};

export const getPlacementPrediction = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const prediction = predictPlacement({
    cgpa: student.cgpa,
    skills: student.skills,
    projects: student.projects,
    certifications: student.certifications,
    resumeScore: student.resumeAnalysis?.atsScore || 0,
  });

  student.placementPrediction = {
    probability: prediction.probability,
    weakAreas: prediction.weakAreas,
    suggestions: prediction.suggestions,
    predictedAt: new Date(),
  };
  await student.save();

  res.json({ success: true, data: prediction });
};

export const saveJob = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const { jobId } = req.body;

  const existing = await SavedJob.findOne({ studentId: student._id, jobId });
  if (existing) return res.status(400).json({ success: false, message: 'Job already saved' });

  await SavedJob.create({ studentId: student._id, jobId });
  res.status(201).json({ success: true, message: 'Job saved' });
};

export const getSavedJobs = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const saved = await SavedJob.find({ studentId: student._id }).populate('jobId');
  res.json({ success: true, data: saved });
};

export const removeSavedJob = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  await SavedJob.findOneAndDelete({ studentId: student._id, jobId: req.params.jobId });
  res.json({ success: true, message: 'Job removed from saved' });
};

export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('userId', 'name email');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
};

export const getDashboardStats = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const [applications, savedJobs] = await Promise.all([
    Application.countDocuments({ studentId: student._id }),
    SavedJob.countDocuments({ studentId: student._id }),
  ]);

  res.json({
    success: true,
    data: {
      applications,
      savedJobs,
      placementProbability: student.placementPrediction?.probability || null,
      resumeScore: student.resumeAnalysis?.atsScore || null,
    },
  });
};
