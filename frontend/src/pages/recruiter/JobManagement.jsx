import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Users, Briefcase, Plus, Sparkles, MapPin, BadgeIndianRupee, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { recruiterAPI } from '../../services';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = () => {
    recruiterAPI.getJobs().then(({ data }) => setJobs(data.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  };

  useEffect(loadJobs, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;
    try {
      await recruiterAPI.deleteJob(id);
      toast.success('Job posting deleted successfully');
      loadJobs();
    } catch {
      toast.error('Failed to delete job posting');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title text-3xl">Manage Postings</h1>
          <p className="page-description text-base">Track your active listings, view applicants, perform AI rankings, and manage postings.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn-primary text-xs py-2.5 px-4.5 shadow-sm font-bold flex-shrink-0 flex items-center gap-1.5 self-start sm:self-center">
          <Plus className="h-4 w-4" /> Create Job Listing
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-16 max-w-xl mx-auto border border-dashed border-gray-200 dark:border-gray-800">
          <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-gray-850 dark:text-white">No active listings</p>
          <p className="text-xs text-gray-500 mt-1.5 mb-6 max-w-sm mx-auto">Create a job description detailing requirements, salaries, and cutoffs to start hiring.</p>
          <Link to="/recruiter/jobs/new" className="btn-primary text-xs py-2.5 px-5 shadow-sm font-semibold">Post First Job</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="card-hover flex flex-wrap justify-between items-center gap-5 p-5">
              <div className="space-y-2">
                <p className="font-bold text-gray-850 dark:text-white tracking-tight text-base">{job.title}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-300 font-medium py-1 px-2.5 flex items-center gap-1 text-[11px]">
                    <MapPin className="h-3 w-3 text-gray-400" /> {job.location}
                  </span>
                  <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-300 font-medium py-1 px-2.5 flex items-center gap-1 text-[11px]">
                    <BadgeIndianRupee className="h-3 w-3 text-gray-400" /> {job.package}
                  </span>
                  <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-300 font-medium py-1 px-2.5 flex items-center gap-1 text-[11px]">
                    <GraduationCap className="h-3.5 w-3.5 text-gray-400" /> Min CGPA: {job.minCGPA}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn-secondary text-xs font-bold py-2 px-3 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" /> Applicants
                </Link>
                <Link to={`/recruiter/jobs/${job._id}/rank`} className="btn-primary from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 shadow-none text-xs font-bold py-2 px-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> AI Rank
                </Link>
                <button onClick={() => handleDelete(job._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors" title="Delete Listing">
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobManagement;
