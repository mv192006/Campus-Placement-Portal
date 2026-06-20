import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  link: String,
});

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    branch: { type: String, default: '' },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    graduationYear: { type: Number },
    skills: [{ type: String }],
    projects: [projectSchema],
    certifications: [{ type: String }],
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    resumeAnalysis: {
      atsScore: Number,
      missingSkills: [String],
      strengths: [String],
      weaknesses: [String],
      improvements: [String],
      recommendedCertifications: [String],
      analyzedAt: Date,
    },
    placementPrediction: {
      probability: Number,
      weakAreas: [String],
      suggestions: [String],
      predictedAt: Date,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
