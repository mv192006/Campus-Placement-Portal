import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@placement.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'Placement Officer',
    email,
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
  });

  console.log('Admin user created:', email);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
