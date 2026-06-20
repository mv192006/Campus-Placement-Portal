import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Building2, Globe, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { recruiterAPI } from '../../services';

const RecruiterProfile = () => {
  const [form, setForm] = useState({ companyName: '', companyDescription: '', website: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    recruiterAPI.getProfile().then(({ data }) => {
      const p = data.data;
      setForm({ companyName: p.companyName || '', companyDescription: p.companyDescription || '', website: p.website || '' });
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await recruiterAPI.updateProfile(form);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl">Company Profile</h1>
        <p className="page-description text-base">Manage company details, descriptions, and active landing page resources visible to applicants.</p>
      </div>

      <form onSubmit={handleSave} className="card space-y-5">
        <div>
          <label className="label flex items-center gap-1.5"><Building2 className="h-4 w-4 text-gray-400" /> Company Name</label>
          <input className="input-field" placeholder="e.g. Acme Corp" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
        </div>
        
        <div>
          <label className="label flex items-center gap-1.5"><FileText className="h-4 w-4 text-gray-400" /> Company Description</label>
          <textarea className="input-field leading-relaxed" placeholder="Tell candidates about your company culture, technology stack, and values..." rows={5} value={form.companyDescription} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} />
        </div>
        
        <div>
          <label className="label flex items-center gap-1.5"><Globe className="h-4 w-4 text-gray-400" /> Website Link</label>
          <input className="input-field" placeholder="https://domain.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>

        <button type="submit" className="btn-primary py-3 font-bold shadow-lg mt-2" disabled={saving}>
          {saving ? 'Saving Profile...' : 'Save Profile details'}
        </button>
      </form>
    </div>
  );
};

export default RecruiterProfile;
