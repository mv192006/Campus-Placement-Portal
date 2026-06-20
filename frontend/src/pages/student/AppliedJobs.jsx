import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Star, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentAPI } from '../../services';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getApplications().then(({ data }) => setApplications(data.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  const statusClasses = {
    applied: 'status-applied',
    shortlisted: 'status-shortlisted',
    interview: 'status-interview',
    selected: 'status-selected',
    rejected: 'status-rejected',
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl">Application History</h1>
        <p className="page-description text-base">Track your application pipeline, interview invites, and results.</p>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-16 max-w-xl mx-auto border border-dashed border-gray-200 dark:border-gray-800">
          <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-gray-850 dark:text-white">No applications yet</p>
          <p className="text-xs text-gray-500 mt-1.5 mb-6 max-w-sm mx-auto">Explore the job boards to apply for internships or full-time roles matching your skills.</p>
          <Link to="/jobs" className="btn-primary text-xs py-2.5 px-5 shadow-sm font-semibold">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card-hover flex flex-wrap justify-between items-center gap-4 p-5 hover:scale-[1.005] transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700/50">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <Link to={`/jobs/${app.jobId?._id}`} className="font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors tracking-tight text-base flex items-center gap-1.5">
                    {app.jobId?.title}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                    <span className="font-semibold text-gray-750 dark:text-gray-300">{app.jobId?.company}</span>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4.5">
                {app.matchScore > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 stroke-yellow-500" />
                    {app.matchScore}% match
                  </span>
                )}
                <span className={`capitalize px-3.5 py-1.5 rounded-full text-xs font-bold ${statusClasses[app.status] || 'badge-gray'}`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
