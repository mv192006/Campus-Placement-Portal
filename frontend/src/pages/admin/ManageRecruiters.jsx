import { useEffect, useState } from 'react';
import { Building2, Mail, ShieldAlert, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../services';

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminAPI.getRecruiters().then(({ data }) => setRecruiters(data.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  useEffect(load, []);

  const toggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      toast.success('Recruiter activation status updated successfully');
      load();
    } catch {
      toast.error('Failed to change user status');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl">Manage Recruiters</h1>
        <p className="page-description text-base">Verify company affiliations, review representative profiles, and suspend or activate recruiters credentials.</p>
      </div>

      {recruiters.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <p className="font-semibold">No recruiters registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recruiters.map((r) => {
            const initials = r.companyName
              ? r.companyName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              : 'CO';
            return (
              <div key={r._id} className="card flex flex-wrap justify-between items-center gap-5 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md text-xs flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-850 dark:text-white text-base tracking-tight">{r.companyName}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                      <span className="font-semibold text-gray-700 dark:text-gray-350">{r.userId?.name}</span>
                      <span className="text-gray-300 dark:text-gray-800">•</span>
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {r.userId?.email}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => toggleStatus(r.userId?._id)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all
                      ${r.userId?.isActive
                        ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 hover:bg-green-50'
                        : 'bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 hover:bg-red-50'
                      }`}
                  >
                    {r.userId?.isActive ? (
                      <><ShieldCheck className="h-4 w-4" /> Active</>
                    ) : (
                      <><ShieldAlert className="h-4 w-4" /> Suspended</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageRecruiters;
