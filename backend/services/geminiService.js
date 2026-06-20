import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const getModel = () => genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const parseJSONResponse = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
};

// ─── Offline Resume Analysis Helpers ───────────────────────────────────────────

const KNOWN_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
  'react', 'reactjs', 'react.js', 'angular', 'vue', 'vuejs', 'vue.js', 'svelte', 'next.js', 'nextjs', 'nuxt',
  'node.js', 'nodejs', 'express', 'express.js', 'fastify', 'nestjs', 'django', 'flask', 'spring', 'spring boot',
  'html', 'css', 'sass', 'scss', 'tailwind', 'tailwindcss', 'bootstrap', 'material ui', 'chakra ui',
  'mongodb', 'mongoose', 'mysql', 'postgresql', 'postgres', 'redis', 'sqlite', 'firebase', 'supabase',
  'docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify',
  'git', 'github', 'gitlab', 'bitbucket', 'ci/cd', 'jenkins', 'github actions',
  'rest', 'restful', 'graphql', 'grpc', 'websocket', 'socket.io',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
  'data analysis', 'data science', 'nlp', 'computer vision', 'opencv',
  'linux', 'bash', 'shell', 'powershell', 'nginx', 'apache',
  'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
  'agile', 'scrum', 'kanban', 'jira', 'confluence',
  'sql', 'nosql', 'orm', 'prisma', 'sequelize', 'typeorm',
  'jwt', 'oauth', 'passport', 'authentication', 'authorization',
  'testing', 'jest', 'mocha', 'cypress', 'selenium', 'playwright',
  'webpack', 'vite', 'babel', 'eslint', 'prettier',
  'microservices', 'serverless', 'lambda', 'cloud functions',
  'blockchain', 'solidity', 'web3', 'ethereum',
  'power bi', 'tableau', 'excel', 'r programming',
];

const COMMON_CERTIFICATIONS = [
  'AWS Certified Cloud Practitioner', 'AWS Certified Solutions Architect',
  'AWS Certified Developer', 'Google Cloud Associate Cloud Engineer',
  'Google Cloud Professional Data Engineer', 'Azure Fundamentals (AZ-900)',
  'Azure Developer Associate', 'Docker Certified Associate',
  'Kubernetes Application Developer (CKAD)', 'Certified Scrum Master',
  'PMP', 'CompTIA Security+', 'Cisco CCNA',
  'TensorFlow Developer Certificate', 'Meta Front-End Developer',
  'IBM Data Science Professional', 'Google Data Analytics Certificate',
];

const RESUME_SECTIONS = [
  'education', 'experience', 'work experience', 'professional experience',
  'skills', 'technical skills', 'projects', 'certifications', 'achievements',
  'summary', 'objective', 'profile', 'interests', 'hobbies',
  'publications', 'awards', 'volunteer', 'references', 'languages',
  'contact', 'personal details', 'personal information',
];

const extractSkillsFromText = (text) => {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const skill of KNOWN_SKILLS) {
    // Use word boundary matching to avoid false positives
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower)) {
      found.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  }
  return [...found];
};

const detectSections = (text) => {
  const lower = text.toLowerCase();
  const found = [];
  for (const section of RESUME_SECTIONS) {
    const regex = new RegExp(`\\b${section}\\b`, 'i');
    if (regex.test(lower)) {
      found.push(section);
    }
  }
  return found;
};

const hasContactInfo = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\//i;
  const githubRegex = /github\.com\//i;

  return {
    hasEmail: emailRegex.test(text),
    hasPhone: phoneRegex.test(text),
    hasLinkedIn: linkedinRegex.test(text),
    hasGitHub: githubRegex.test(text),
  };
};

const hasQuantifiableMetrics = (text) => {
  // Check for numbers with context (e.g. "increased by 20%", "managed 5 people", "3 years")
  const metricPatterns = [
    /\d+\s*%/,                      // percentages
    /\$\d+/,                        // dollar amounts
    /\d+\s*(users|customers|clients|projects|teams|members|people)/i,
    /\d+\s*(years|months|weeks)/i,  // time durations
    /(increased|decreased|improved|reduced|saved|generated|achieved)\s.*\d+/i,
  ];
  return metricPatterns.filter(p => p.test(text)).length;
};

const computeOfflineAtsScore = (text, studentSkills = []) => {
  let score = 40; // Base score for having a resume at all

  const sections = detectSections(text);
  const contact = hasContactInfo(text);
  const detectedSkills = extractSkillsFromText(text);
  const metricCount = hasQuantifiableMetrics(text);
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  // Section coverage (up to +15)
  const importantSections = ['education', 'experience', 'work experience', 'professional experience', 'skills', 'technical skills', 'projects'];
  const sectionHits = importantSections.filter(s => sections.includes(s)).length;
  score += Math.min(sectionHits * 3, 15);

  // Contact info (up to +10)
  if (contact.hasEmail) score += 3;
  if (contact.hasPhone) score += 3;
  if (contact.hasLinkedIn) score += 2;
  if (contact.hasGitHub) score += 2;

  // Skills density (up to +15)
  score += Math.min(detectedSkills.length * 1.5, 15);

  // Quantifiable metrics (up to +10)
  score += Math.min(metricCount * 3, 10);

  // Resume length (up to +10) — too short or too long is bad
  if (wordCount >= 200 && wordCount <= 800) {
    score += 10;
  } else if (wordCount >= 100 && wordCount < 200) {
    score += 5;
  } else if (wordCount > 800 && wordCount <= 1200) {
    score += 7;
  } else if (wordCount > 1200) {
    score += 3; // Too verbose
  }

  return Math.min(Math.round(score), 100);
};

const generateOfflineAnalysis = (resumeText, studentSkills = []) => {
  const detectedSkills = extractSkillsFromText(resumeText);
  const sections = detectSections(resumeText);
  const contact = hasContactInfo(resumeText);
  const metricCount = hasQuantifiableMetrics(resumeText);
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;

  const atsScore = computeOfflineAtsScore(resumeText, studentSkills);

  // Strengths — based on what IS in the resume
  const strengths = [];
  if (detectedSkills.length >= 5) strengths.push(`Strong technical skill set with ${detectedSkills.length} identified technologies`);
  else if (detectedSkills.length >= 3) strengths.push(`Good range of ${detectedSkills.length} technical skills detected`);
  if (sections.includes('projects')) strengths.push('Project portfolio section included');
  if (sections.includes('education')) strengths.push('Education section is present');
  if (sections.some(s => s.includes('experience'))) strengths.push('Professional experience section included');
  if (contact.hasLinkedIn || contact.hasGitHub) strengths.push('Online professional presence linked (LinkedIn/GitHub)');
  if (metricCount >= 2) strengths.push('Resume includes quantifiable achievements');
  if (wordCount >= 200 && wordCount <= 800) strengths.push('Resume length is well-optimized for ATS');
  if (strengths.length === 0) strengths.push('Resume was successfully parsed');

  // Weaknesses — based on what is MISSING
  const weaknesses = [];
  if (detectedSkills.length < 3) weaknesses.push('Very few technical skills detected — add more relevant technologies');
  if (!sections.includes('projects')) weaknesses.push('No projects section found — add portfolio projects');
  if (!sections.some(s => s.includes('experience'))) weaknesses.push('No work experience section detected');
  if (!contact.hasEmail) weaknesses.push('No email address found in resume');
  if (!contact.hasPhone) weaknesses.push('No phone number found in resume');
  if (!contact.hasLinkedIn && !contact.hasGitHub) weaknesses.push('No professional links (LinkedIn/GitHub) detected');
  if (metricCount === 0) weaknesses.push('No quantifiable metrics or achievements found');
  if (wordCount < 150) weaknesses.push('Resume is too short — add more relevant details');
  if (wordCount > 1200) weaknesses.push('Resume is too verbose — trim to 1-2 pages');
  if (weaknesses.length === 0) weaknesses.push('No major weaknesses detected');

  // Missing skills — skills commonly expected but not in the resume
  const inDemandSkills = ['React', 'Node.js', 'Python', 'Docker', 'AWS', 'Git', 'SQL', 'TypeScript', 'MongoDB', 'Kubernetes'];
  const missingSkills = inDemandSkills.filter(
    s => !detectedSkills.some(d => d.toLowerCase() === s.toLowerCase()) &&
         !studentSkills.some(k => k.toLowerCase() === s.toLowerCase())
  ).slice(0, 5);

  // Improvements
  const improvements = [];
  if (metricCount < 2) improvements.push('Add quantifiable achievements (e.g., "Improved performance by 30%")');
  if (!sections.includes('certifications') && !sections.includes('achievements')) {
    improvements.push('Add a certifications or achievements section');
  }
  if (!contact.hasLinkedIn) improvements.push('Include your LinkedIn profile URL');
  if (!contact.hasGitHub && detectedSkills.length > 0) improvements.push('Add your GitHub profile to showcase projects');
  if (wordCount < 200) improvements.push('Expand descriptions with more details about your contributions');
  if (!sections.includes('summary') && !sections.includes('objective') && !sections.includes('profile')) {
    improvements.push('Add a professional summary/objective at the top');
  }
  if (improvements.length === 0) improvements.push('Consider tailoring your resume for specific job descriptions');

  // Recommended certifications based on detected skills
  const certRecommendations = [];
  if (detectedSkills.some(s => /aws|cloud|azure|gcp/i.test(s))) {
    certRecommendations.push('AWS Certified Solutions Architect – Associate');
  } else {
    certRecommendations.push('AWS Certified Cloud Practitioner');
  }
  if (detectedSkills.some(s => /docker|kubernetes|k8s/i.test(s))) {
    certRecommendations.push('Certified Kubernetes Application Developer (CKAD)');
  }
  if (detectedSkills.some(s => /python|machine learning|tensorflow|pytorch/i.test(s))) {
    certRecommendations.push('TensorFlow Developer Certificate');
  }
  if (detectedSkills.some(s => /react|angular|vue|javascript|typescript/i.test(s))) {
    certRecommendations.push('Meta Front-End Developer Professional Certificate');
  }
  if (detectedSkills.some(s => /data|sql|analytics|tableau|power bi/i.test(s))) {
    certRecommendations.push('Google Data Analytics Professional Certificate');
  }
  if (certRecommendations.length === 0) {
    certRecommendations.push('Google Cloud Associate Cloud Engineer', 'Meta Front-End Developer Professional Certificate');
  }

  return {
    atsScore,
    missingSkills,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    improvements: improvements.slice(0, 5),
    recommendedCertifications: certRecommendations.slice(0, 4),
    analysisMode: 'offline', // Flag so frontend knows this was offline
  };
};

// ─── Exported Functions ────────────────────────────────────────────────────────

export const analyzeResume = async (resumeText, studentSkills = []) => {
  const prompt = `Analyze the following resume and provide a detailed assessment.
Student's listed skills: ${studentSkills.join(', ') || 'Not provided'}

Resume Text:
${resumeText}

Respond ONLY with valid JSON in this exact format:
{
  "atsScore": <number 0-100>,
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvements": ["suggestion1", "suggestion2"],
  "recommendedCertifications": ["cert1", "cert2"]
}`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    const model = getModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseJSONResponse(text);
    if (parsed && typeof parsed.atsScore === 'number') {
      parsed.analysisMode = 'ai';
      return parsed;
    }
    throw new Error('Invalid AI response format');
  } catch (error) {
    console.warn('Gemini resume analysis unavailable, using intelligent offline analysis:', error.message);
    return generateOfflineAnalysis(resumeText, studentSkills);
  }
};

export const matchJobSkills = async (resumeSkills, jobSkills, resumeText = '') => {
  const prompt = `Compare candidate skills with job requirements.

Candidate Skills: ${resumeSkills.join(', ')}
Job Required Skills: ${jobSkills.join(', ')}
${resumeText ? `Resume excerpt: ${resumeText.substring(0, 500)}` : ''}

Respond ONLY with valid JSON:
{
  "matchScore": <number 0-100>,
  "matchingSkills": ["skill1"],
  "missingSkills": ["skill2"],
  "recommendation": "Brief recommendation text"
}`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    const model = getModel();
    const result = await model.generateContent(prompt);
    const parsed = parseJSONResponse(result.response.text());
    if (parsed) return parsed;
    throw new Error('Parse failed');
  } catch (error) {
    console.warn('Gemini job matching unavailable, using local matching:', error.message);

    // Enhanced local matching with partial/fuzzy skill comparison
    const normalize = (s) => s.toLowerCase().replace(/[.\-_\s]/g, '');
    const matching = resumeSkills.filter((s) =>
      jobSkills.some((j) => {
        const ns = normalize(s);
        const nj = normalize(j);
        return ns === nj || ns.includes(nj) || nj.includes(ns);
      })
    );
    const missing = jobSkills.filter(
      (j) => !matching.some((m) => {
        const nm = normalize(m);
        const nj = normalize(j);
        return nm === nj || nm.includes(nj) || nj.includes(nm);
      })
    );
    const matchScore = jobSkills.length ? Math.round((matching.length / jobSkills.length) * 100) : 0;

    let recommendation;
    if (matchScore >= 80) recommendation = 'Excellent match — strong alignment with job requirements';
    else if (matchScore >= 60) recommendation = 'Good match — consider upskilling in a few missing areas';
    else if (matchScore >= 40) recommendation = 'Moderate match — significant skill gaps to address';
    else recommendation = 'Low match — consider gaining more relevant skills before applying';

    return { matchScore, matchingSkills: matching, missingSkills: missing, recommendation };
  }
};

export const generateInterviewQuestions = async (role) => {
  const prompt = `Generate interview questions for a ${role} position.

Respond ONLY with valid JSON:
{
  "technicalQuestions": ["20 technical questions"],
  "hrQuestions": ["10 HR questions"],
  "scenarioQuestions": ["5 scenario-based questions"]
}

Generate exactly 20 technical, 10 HR, and 5 scenario-based questions.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    const model = getModel();
    const result = await model.generateContent(prompt);
    const parsed = parseJSONResponse(result.response.text());
    if (parsed) return parsed;
    throw new Error('Parse failed');
  } catch (error) {
    console.error('Gemini interview questions error:', error.message);
    return getDefaultQuestions(role);
  }
};

const getDefaultQuestions = (role) => ({
  technicalQuestions: Array.from({ length: 20 }, (_, i) => `${role} Technical Question ${i + 1}: Explain a core concept relevant to ${role}.`),
  hrQuestions: Array.from({ length: 10 }, (_, i) => `HR Question ${i + 1}: Tell me about a time when you demonstrated teamwork.`),
  scenarioQuestions: Array.from({ length: 5 }, (_, i) => `Scenario ${i + 1}: How would you handle a production outage as a ${role}?`),
});

export const evaluateMockInterview = async (question, answer, role) => {
  const prompt = `You are an interview evaluator for a ${role} position.

Question: ${question}
Candidate Answer: ${answer}

Evaluate the answer and respond ONLY with valid JSON:
{
  "feedback": "Detailed feedback",
  "technicalScore": <0-100>,
  "communicationScore": <0-100>,
  "confidenceScore": <0-100>,
  "overallScore": <0-100>,
  "suggestions": ["improvement1", "improvement2"]
}`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    const model = getModel();
    const result = await model.generateContent(prompt);
    const parsed = parseJSONResponse(result.response.text());
    if (parsed) return parsed;

    return {
      feedback: 'Good attempt. Provide more specific examples and technical depth.',
      technicalScore: 70,
      communicationScore: 75,
      confidenceScore: 72,
      overallScore: 72,
      suggestions: ['Use STAR method', 'Include specific metrics'],
    };
  } catch (error) {
    console.warn('Gemini mock interview evaluation failed. Using offline fallback:', error.message);
    return {
      feedback: 'Good attempt. Provide more specific examples and technical depth.',
      technicalScore: 70,
      communicationScore: 75,
      confidenceScore: 72,
      overallScore: 72,
      suggestions: ['Use STAR method', 'Include specific metrics'],
    };
  }
};

export const rankCandidates = async (candidates, jobRequirements) => {
  // Sanitize candidate data to keep prompt small and avoid serialization issues
  const sanitizedCandidates = candidates.map((c) => ({
    studentId: c._id?.toString() || c.studentId,
    name: c.userId?.name || c.name || 'Unknown',
    cgpa: c.cgpa || 0,
    skills: c.skills || [],
    projectCount: c.projects?.length || 0,
    certCount: c.certifications?.length || 0,
    atsScore: c.resumeAnalysis?.atsScore || 0,
  }));

  const sanitizedRequirements = {
    title: jobRequirements.title,
    skillsRequired: jobRequirements.skillsRequired || [],
    minCGPA: jobRequirements.minCGPA || 0,
  };

  const prompt = `Rank these candidates for a job with requirements: ${JSON.stringify(sanitizedRequirements)}

Candidates: ${JSON.stringify(sanitizedCandidates)}

Respond ONLY with valid JSON:
{
  "rankedCandidates": [
    {
      "studentId": "id",
      "name": "name",
      "score": <0-100>,
      "reasoning": "why ranked here"
    }
  ]
}`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    const model = getModel();
    const result = await model.generateContent(prompt);
    const parsed = parseJSONResponse(result.response.text());
    if (parsed?.rankedCandidates) return parsed.rankedCandidates;
    return null;
  } catch (error) {
    console.error('Gemini candidate ranking error:', error.message);
    return null;
  }
};
