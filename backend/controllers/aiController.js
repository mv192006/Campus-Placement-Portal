import {
  analyzeResume,
  matchJobSkills,
  generateInterviewQuestions,
  evaluateMockInterview,
} from '../services/geminiService.js';
import { predictPlacement, trainingDataset } from '../services/mlService.js';
import Student from '../models/Student.js';
import { extractTextFromPDF } from '../services/resumeParser.js';

export const resumeAnalysis = async (req, res) => {
  const { skills } = req.body;
  let resumeText = req.body.resumeText || '';

  if (req.file) {
    resumeText = await extractTextFromPDF(req.file.buffer);
  }

  if (!resumeText) {
    return res.status(400).json({ success: false, message: 'Resume text or PDF required' });
  }

  const analysis = await analyzeResume(resumeText, skills || []);
  res.json({ success: true, data: analysis });
};

export const jobMatching = async (req, res) => {
  const { resumeSkills, jobSkills, resumeText } = req.body;
  const match = await matchJobSkills(resumeSkills || [], jobSkills || [], resumeText);
  res.json({ success: true, data: match });
};

export const interviewPrep = async (req, res) => {
  const { role } = req.body;
  const validRoles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'AI Engineer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role selected' });
  }

  const questions = await generateInterviewQuestions(role);
  res.json({ success: true, data: questions });
};

export const mockInterview = async (req, res) => {
  const { question, answer, role } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer required' });
  }

  const evaluation = await evaluateMockInterview(question, answer, role || 'Software Developer');
  res.json({ success: true, data: evaluation });
};

export const placementPrediction = async (req, res) => {
  const { cgpa, skills, projects, certifications, resumeScore } = req.body;
  const prediction = predictPlacement({ cgpa, skills, projects, certifications, resumeScore });
  res.json({ success: true, data: prediction, trainingDataset });
};

export const getStudentPrediction = async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });
  const prediction = predictPlacement({
    cgpa: student.cgpa,
    skills: student.skills,
    projects: student.projects,
    certifications: student.certifications,
    resumeScore: student.resumeAnalysis?.atsScore || 0,
  });
  res.json({ success: true, data: prediction, trainingDataset });
};

export const getTrainingDataset = async (req, res) => {
  res.json({ success: true, data: trainingDataset });
};
