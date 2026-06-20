import User from '../models/User.js';
import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import ActivityLog from '../models/ActivityLog.js';

export const getDashboardStats = async (req, res) => {
  const [students, recruiters, jobs, applications] = await Promise.all([
    Student.countDocuments(),
    Recruiter.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
  ]);

  res.json({ success: true, data: { students, recruiters, jobs, applications } });
};

export const getAllStudents = async (req, res) => {
  const { search, branch, page = 1, limit = 20 } = req.query;
  const query = {};

  if (branch) query.branch = branch;
  if (search) {
    const users = await User.find({
      role: 'student',
      $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
    }).select('_id');
    query.userId = { $in: users.map((u) => u._id) };
  }

  const skip = (page - 1) * limit;
  const [students, total] = await Promise.all([
    Student.find(query).populate('userId', 'name email isActive').skip(skip).limit(Number(limit)),
    Student.countDocuments(query),
  ]);

  res.json({ success: true, data: students, total, page: Number(page), pages: Math.ceil(total / limit) });
};

export const getAllRecruiters = async (req, res) => {
  const recruiters = await Recruiter.find().populate('userId', 'name email isActive');
  res.json({ success: true, data: recruiters });
};

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
};

export const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot deactivate admin' });

  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: { _id: user._id, isActive: user.isActive } });
};

export const deleteJob = async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, message: 'Job deleted' });
};

export const getPlacementAnalytics = async (req, res) => {
  const selectedApps = await Application.find({ status: 'selected' })
    .populate({ path: 'studentId', select: 'branch' })
    .populate({ path: 'jobId', select: 'company title package' });

  const branchWise = {};
  const companyWise = {};
  const monthlyTrends = {};

  selectedApps.forEach((app) => {
    const branch = app.studentId?.branch || 'Unknown';
    branchWise[branch] = (branchWise[branch] || 0) + 1;

    const company = app.jobId?.company || 'Unknown';
    companyWise[company] = (companyWise[company] || 0) + 1;

    const month = new Date(app.updatedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyTrends[month] = (monthlyTrends[month] || 0) + 1;
  });

  const statusBreakdown = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: {
      totalPlacements: selectedApps.length,
      branchWise: Object.entries(branchWise).map(([branch, count]) => ({ branch, count })),
      companyWise: Object.entries(companyWise).map(([company, count]) => ({ company, count })),
      monthlyTrends: Object.entries(monthlyTrends).map(([month, count]) => ({ month, count })),
      statusBreakdown,
    },
  });
};

export const getActivityLogs = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;
  const logs = await ActivityLog.find()
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ success: true, data: logs });
};
