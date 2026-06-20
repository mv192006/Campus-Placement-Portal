import { useEffect, useState } from 'react';
import { Trash2, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../services';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminAPI.getJobs().then(({ data }) => setJobs(data.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteJob(id);
      toast.success('Job listing deleted successfully');
      load();
    } catch {
      toast.error('Failed to delete job listing');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl">Manage Job Postings</h1>
        <p className="page-description text-base">Audit listings, review details, and delete inappropriate or duplicate job postings.</p>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <p className="font-semibold">No active job listings registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const initials = job.company
              ? job.company.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              : 'CO';
            return (
              <div key={job._id} className="card flex flex-wrap justify-between items-center gap-5 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white shadow-md text-xs flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-850 dark:text-white text-base tracking-tight">{job.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                      <span className="font-semibold text-gray-700 dark:text-gray-350">{job.company}</span>
                      {job.postedBy?.name && (
                        <>
                          <span className="text-gray-300 dark:text-gray-850">•</span>
                          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-gray-400" /> Posted by {job.postedBy.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleDelete(job._id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-xl transition-all" title="Delete Listing">
                    <Trash2 className="h-4.5 w-4.5" />
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

export default ManageJobs;
