import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Briefcase, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { recruiterAPI } from '../../services';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    Promise.all([recruiterAPI.getDashboard(), recruiterAPI.getJobs()])
      .then(([dash, jobsRes]) => {
        setStats(dash.data.data);
        setJobs(jobsRes.data.data.slice(0, 5));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Recruiter';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl flex items-center gap-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 font-extrabold capitalize">{firstName}!</span> 👋
        </h1>
        <p className="page-description text-base">Here is an overview of active jobs, applicant counts, and scheduled interview status.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard title="Active Jobs" value={stats?.jobs || 0} icon={Briefcase} />
        <StatCard title="Applications" value={stats?.applications || 0} icon={Users} color="green" />
        <StatCard title="Interviews" value={stats?.interviews || 0} icon={Calendar} color="purple" />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-1">
          <h2 className="section-title text-lg font-bold">Recent Job Postings</h2>
          <Link to="/recruiter/jobs/new" className="btn-primary text-xs py-2 px-4 shadow-sm font-semibold">
            Post New Job
          </Link>
        </div>
        <p className="text-xs text-gray-500 mb-5">Click on a posting to review applicant resume logs and AI matching leaderboards.</p>
        
        {jobs.length === 0 ? (
          <div className="py-12 text-center text-gray-550 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl max-w-xl mx-auto">
            <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold text-sm">No postings yet</p>
            <p className="text-xs mt-1 mb-5">Post your company's hiring requirements to start receiving candidates.</p>
            <Link to="/recruiter/jobs/new" className="btn-primary text-xs py-2.5 px-4 font-semibold shadow-sm">Create First Job</Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {jobs.map((job) => (
              <Link key={job._id} to={`/recruiter/jobs/${job._id}/applicants`} className="block p-4.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-all duration-200 group">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-850 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors tracking-tight text-base">{job.title}</p>
                    <p className="text-xs text-gray-505 dark:text-gray-400 mt-1">{job.location} · {job.package}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
                    Review Applicants <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
