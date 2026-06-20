import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    package: { type: String, required: true },
    minCGPA: { type: Number, default: 0 },
    skillsRequired: [{ type: String }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
    isActive: { type: Boolean, default: true },
    applicationDeadline: Date,
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
