import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const generateResetToken = () => {
  const resetToken = jwt.sign({ purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return resetToken;
};
