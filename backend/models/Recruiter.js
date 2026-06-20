import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    companyDescription: { type: String, default: '' },
    website: { type: String, default: '' },
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;
