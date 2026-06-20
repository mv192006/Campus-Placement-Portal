import User from '../models/User.js';
import Student from '../models/Student.js';
import Recruiter from '../models/Recruiter.js';
import { generateToken, generateResetToken } from '../utils/generateToken.js';
import { hashToken } from '../utils/hashToken.js';
import { sendPasswordResetEmail } from '../utils/sendEmail.js';
import { logActivity } from '../utils/activityLogger.js';

export const registerStudent = async (req, res) => {
  const { name, email, password, branch, graduationYear } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role: 'student' });
  await Student.create({ userId: user._id, branch, graduationYear });

  const token = generateToken(user._id);
  await logActivity(user._id, 'REGISTER', 'User', user._id, 'Student registered', req.ip);

  res.status(201).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const registerRecruiter = async (req, res) => {
  const { name, email, password, companyName, companyDescription, website } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role: 'recruiter' });
  await Recruiter.create({ userId: user._id, companyName, companyDescription, website });

  const token = generateToken(user._id);
  await logActivity(user._id, 'REGISTER', 'User', user._id, 'Recruiter registered', req.ip);

  res.status(201).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account deactivated' });
  }

  const token = generateToken(user._id);
  await logActivity(user._id, 'LOGIN', 'User', user._id, `${user.role} logged in`, req.ip);

  res.json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const getMe = async (req, res) => {
  const user = req.user;
  let profile = null;

  if (user.role === 'student') {
    profile = await Student.findOne({ userId: user._id }).populate('userId', 'name email');
  } else if (user.role === 'recruiter') {
    profile = await Recruiter.findOne({ userId: user._id }).populate('userId', 'name email');
  }

  res.json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    profile,
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: true, message: 'If email exists, reset link has been sent' });
  }

  const resetToken = generateResetToken();
  user.resetPasswordToken = hashToken(resetToken);
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  res.json({ success: true, message: 'Password reset email sent' });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = hashToken(token);
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const authToken = generateToken(user._id);
  res.json({ success: true, message: 'Password reset successful', token: authToken });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
};
