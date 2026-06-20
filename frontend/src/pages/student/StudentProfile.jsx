import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, UploadCloud, CheckCircle2, User, GraduationCap, Award, FolderGit2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentAPI } from '../../services';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ branch: '', cgpa: '', graduationYear: '', skills: '', projects: '', certifications: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    studentAPI.getProfile().then(({ data }) => {
      const p = data.data;
      setProfile(p);
      setForm({
        branch: p.branch || '',
        cgpa: p.cgpa || '',
        graduationYear: p.graduationYear || '',
        skills: (p.skills || []).join(', '),
        projects: JSON.stringify(p.projects || [], null, 2),
        certifications: (p.certifications || []).join(', '),
      });
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let projects = [];
      try { projects = JSON.parse(form.projects || '[]'); } catch { toast.error('Invalid projects JSON structure'); return; }
      const { data } = await studentAPI.updateProfile({
        branch: form.branch,
        cgpa: Number(form.cgpa),
        graduationYear: Number(form.graduationYear),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        projects,
        certifications: form.certifications.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setProfile(data.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const { data } = await studentAPI.uploadResume(fd);
      setProfile((p) => ({ ...p, resumeUrl: data.data.resumeUrl }));
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Resume upload failed');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl">Profile Setup</h1>
        <p className="page-description text-base">Keep your academic records, resume, and credentials up to date to get recommendations.</p>
      </div>

      {/* Resume Card */}
      <div className="card">
        <h2 className="section-title text-lg mb-1 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" /> Resume Upload
        </h2>
        <p className="text-xs text-gray-500 mb-5">Upload your resume to enable auto-matching and AI analysis.</p>

        <div className="flex flex-col sm:flex-row gap-5 items-center justify-between p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/10">
          <div className="flex items-center gap-3.5">
            <div className={`p-3.5 rounded-xl ${profile?.resumeUrl ? 'bg-green-150 dark:bg-green-950/40 text-green-600 dark:text-green-400' : 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'}`}>
              {profile?.resumeUrl ? <CheckCircle2 className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-850 dark:text-white">
                {profile?.resumeUrl ? 'Resume is Uploaded' : 'Upload Resume PDF'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PDF format supported up to 5MB</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary text-xs font-bold py-2.5 px-4">
                View PDF
              </a>
            )}
            <label className="btn-primary text-xs font-bold py-2.5 px-4 cursor-pointer">
              <span>{profile?.resumeUrl ? 'Update PDF' : 'Choose File'}</span>
              <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Details Form */}
      <form onSubmit={handleSave} className="card space-y-6">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
          <h2 className="section-title text-lg mb-1 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" /> Academic & Profile Details
          </h2>
          <p className="text-xs text-gray-500">Add detailed information to complete your portfolio.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="label flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-gray-400" /> Branch</label>
            <input className="input-field" placeholder="e.g. Computer Science" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
          </div>
          <div>
            <label className="label">CGPA</label>
            <input type="number" step="0.01" min="0" max="10" className="input-field" placeholder="e.g. 8.5" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
          </div>
          <div>
            <label className="label">Graduation Year</label>
            <input type="number" className="input-field" placeholder="e.g. 2026" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="label flex items-center gap-1.5"><Award className="h-4 w-4 text-gray-400" /> Skills (comma separated)</label>
            <input className="input-field" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Node.js, Python, SQL" />
          </div>

          <div>
            <label className="label">Certifications (comma separated)</label>
            <input className="input-field" placeholder="e.g. AWS Solutions Architect, Google Analytics" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
          </div>

          <div>
            <label className="label flex items-center gap-1.5"><FolderGit2 className="h-4 w-4 text-gray-400" /> Projects (JSON list format)</label>
            <textarea className="input-field font-mono text-xs leading-relaxed" rows={6} value={form.projects} onChange={(e) => setForm({ ...form, projects: e.target.value })} placeholder={`[\n  {\n    "title": "Placement Portal",\n    "description": "AI-powered web application...",\n    "technologies": ["React", "Express", "MongoDB"]\n  }\n]`} />
          </div>
        </div>

        <button type="submit" className="btn-primary py-3 font-bold shadow-lg" disabled={saving}>
          {saving ? 'Saving Changes...' : 'Save Profile Details'}
        </button>
      </form>
    </div>
  );
};

export default StudentProfile;
