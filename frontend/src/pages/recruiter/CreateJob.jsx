import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { recruiterAPI } from '../../services';

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', location: '', package: '', minCGPA: 0, skillsRequired: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await recruiterAPI.createJob({
        ...form,
        minCGPA: Number(form.minCGPA),
        skillsRequired: form.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Job listing created successfully!');
      navigate('/recruiter/jobs');
    } catch {
      toast.error('Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/recruiter/jobs')} className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 text-gray-500 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="page-header mb-0">
          <h1 className="page-title text-3xl">Create Job Listing</h1>
          <p className="page-description text-base font-normal">Define requirements, cutoff details, and parameters for candidate sourcing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Section 1: Overview */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-violet-500" />
            <h3 className="section-title text-sm uppercase tracking-wider text-gray-400">Listing Overview</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Job Title</label>
              <input className="input-field" placeholder="e.g. Software Engineer (Backend)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input-field" placeholder="e.g. Bangalore, India (Hybrid)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div>
              <label className="label">Package (Compensation)</label>
              <input className="input-field" placeholder="e.g. 12 LPA" value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })} required />
            </div>
          </div>
        </div>

        {/* Section 2: Criteria */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
            <h3 className="section-title text-sm uppercase tracking-wider text-gray-400">Eligibility & Skills</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Minimum CGPA Cutoff</label>
              <input type="number" step="0.1" className="input-field" placeholder="e.g. 7.5" value={form.minCGPA} onChange={(e) => setForm({ ...form, minCGPA: e.target.value })} />
            </div>
            <div>
              <label className="label">Required Skills (comma separated)</label>
              <input className="input-field" placeholder="React, Node.js, AWS" value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Section 3: Details */}
        <div className="space-y-4 pt-2">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
            <h3 className="section-title text-sm uppercase tracking-wider text-gray-400">Job Details & Requirements</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Job Description</label>
              <textarea className="input-field leading-relaxed" rows={4} placeholder="Describe the role and responsibilities..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label className="label">Additional Requirements</label>
              <textarea className="input-field leading-relaxed" rows={4} placeholder="e.g. Must have completed 1 year internships..." value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} required />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary py-3.5 font-bold shadow-lg w-full mt-4" disabled={saving}>
          {saving ? 'Posting Job Listing...' : 'Publish Job Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
