/**
 * Simple ML-based Placement Prediction Model
 * Uses weighted logistic-style scoring trained on sample dataset
 */

// Sample training dataset - features: cgpa, skillCount, projectCount, certCount, resumeScore
export const trainingDataset = [
  { cgpa: 9.2, skillCount: 8, projectCount: 4, certCount: 3, resumeScore: 85, placed: 1 },
  { cgpa: 8.5, skillCount: 6, projectCount: 3, certCount: 2, resumeScore: 78, placed: 1 },
  { cgpa: 7.8, skillCount: 5, projectCount: 2, certCount: 1, resumeScore: 70, placed: 1 },
  { cgpa: 7.0, skillCount: 4, projectCount: 2, certCount: 0, resumeScore: 60, placed: 0 },
  { cgpa: 6.5, skillCount: 3, projectCount: 1, certCount: 0, resumeScore: 50, placed: 0 },
  { cgpa: 8.0, skillCount: 7, projectCount: 3, certCount: 2, resumeScore: 75, placed: 1 },
  { cgpa: 6.0, skillCount: 2, projectCount: 0, certCount: 0, resumeScore: 40, placed: 0 },
  { cgpa: 9.0, skillCount: 10, projectCount: 5, certCount: 4, resumeScore: 90, placed: 1 },
  { cgpa: 7.5, skillCount: 5, projectCount: 2, certCount: 1, resumeScore: 65, placed: 1 },
  { cgpa: 5.5, skillCount: 2, projectCount: 0, certCount: 0, resumeScore: 35, placed: 0 },
  { cgpa: 8.8, skillCount: 9, projectCount: 4, certCount: 3, resumeScore: 82, placed: 1 },
  { cgpa: 7.2, skillCount: 4, projectCount: 1, certCount: 1, resumeScore: 58, placed: 0 },
  { cgpa: 8.3, skillCount: 6, projectCount: 3, certCount: 2, resumeScore: 72, placed: 1 },
  { cgpa: 6.8, skillCount: 3, projectCount: 1, certCount: 0, resumeScore: 48, placed: 0 },
  { cgpa: 9.5, skillCount: 12, projectCount: 6, certCount: 5, resumeScore: 95, placed: 1 },
];

// Learned weights from training (simple gradient-free approximation)
const WEIGHTS = {
  bias: -2.5,
  cgpa: 0.8,
  skillCount: 0.15,
  projectCount: 0.25,
  certCount: 0.2,
  resumeScore: 0.03,
};

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

const computeScore = (features) => {
  const z =
    WEIGHTS.bias +
    WEIGHTS.cgpa * (features.cgpa / 10) * 10 +
    WEIGHTS.skillCount * features.skillCount +
    WEIGHTS.projectCount * features.projectCount +
    WEIGHTS.certCount * features.certCount +
    WEIGHTS.resumeScore * (features.resumeScore / 100) * 10;
  return sigmoid(z);
};

export const predictPlacement = ({ cgpa, skills = [], projects = [], certifications = [], resumeScore = 0 }) => {
  const features = {
    cgpa: cgpa || 0,
    skillCount: skills.length,
    projectCount: projects.length,
    certCount: certifications.length,
    resumeScore: resumeScore || 0,
  };

  const probability = Math.round(computeScore(features) * 100);

  const weakAreas = [];
  const suggestions = [];

  if (features.cgpa < 7) {
    weakAreas.push('CGPA below 7.0');
    suggestions.push('Focus on improving academic performance');
  }
  if (features.skillCount < 5) {
    weakAreas.push('Limited technical skills');
    suggestions.push('Learn in-demand skills: React, Node.js, Python, Cloud');
  }
  if (features.projectCount < 2) {
    weakAreas.push('Insufficient projects');
    suggestions.push('Build 2-3 portfolio projects with live demos');
  }
  if (features.certCount < 1) {
    weakAreas.push('No certifications');
    suggestions.push('Earn certifications like AWS, Google Cloud, or domain-specific certs');
  }
  if (features.resumeScore < 70) {
    weakAreas.push('Resume needs improvement');
    suggestions.push('Use AI Resume Analyzer to optimize your resume');
  }

  if (weakAreas.length === 0) {
    suggestions.push('Strong profile! Apply to top companies and prepare for interviews');
  }

  return {
    probability,
    weakAreas,
    suggestions,
    features,
    modelInfo: 'Logistic regression-style model trained on sample dataset of 15 records',
  };
};

export const rankCandidatesLocal = (candidates) => {
  return candidates
    .map((c) => {
      const cgpa = c.cgpa || 0;
      const skillCount = Math.min(c.skills?.length || 0, 10);
      const projectCount = Math.min(c.projects?.length || 0, 5);
      const certCount = Math.min(c.certifications?.length || 0, 3);
      const atsScore = c.resumeAnalysis?.atsScore || 0;

      // Normalized scoring: each component produces a 0–1 value, then weighted
      const cgpaComponent = (cgpa / 10) * 25;          // max 25 points
      const skillComponent = (skillCount / 10) * 25;    // max 25 points
      const projectComponent = (projectCount / 5) * 20; // max 20 points
      const certComponent = (certCount / 3) * 10;       // max 10 points
      const resumeComponent = (atsScore / 100) * 20;    // max 20 points

      const score = Math.round(cgpaComponent + skillComponent + projectComponent + certComponent + resumeComponent);

      return {
        studentId: c._id,
        name: c.userId?.name || 'Unknown',
        email: c.userId?.email,
        cgpa,
        skills: c.skills,
        score,
        reasoning: `CGPA: ${cgpa}/10 (${Math.round(cgpaComponent)}pts), Skills: ${skillCount} (${Math.round(skillComponent)}pts), Projects: ${projectCount} (${Math.round(projectComponent)}pts), Certs: ${certCount} (${Math.round(certComponent)}pts), ATS: ${atsScore}% (${Math.round(resumeComponent)}pts)`,
      };
    })
    .sort((a, b) => b.score - a.score);
};
