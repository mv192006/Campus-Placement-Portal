import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Briefcase, FileText, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentAPI } from '../../services';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    Promise.all([studentAPI.getDashboard(), studentAPI.getRecommendedJobs()])
      .then(([dash, rec]) => {
        setStats(dash.data.data);
        setRecommended(rec.data.data.slice(0, 5));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl flex items-center gap-2">
          Hey, <span className="text-gradient font-extrabold capitalize">{firstName}!</span> 👋
        </h1>
        <p className="page-description text-base">Here is a quick overview of your placements tracking, recommendations, and AI analytics.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Applications" value={stats?.applications || 0} icon={Briefcase} />
        <StatCard title="Saved Jobs" value={stats?.savedJobs || 0} icon={FileText} color="green" />
        <StatCard title="Resume Score" value={stats?.resumeScore ? `${stats.resumeScore}%` : 'N/A'} icon={TrendingUp} color="purple" />
        <StatCard title="Placement Probability" value={stats?.placementProbability ? `${stats.placementProbability}%` : 'N/A'} icon={Sparkles} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="section-title text-lg font-bold mb-1">Quick Actions</h2>
          <p className="text-xs text-gray-500 mb-5">Jump straight into preparing, searching, or refining your profile.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { to: '/student/profile', label: 'Edit Profile', desc: 'Resume, skills & projects' },
              { to: '/student/resume', label: 'Analyze Resume', desc: 'ATS feedback and improvements' },
              { to: '/jobs', label: 'Browse Jobs', desc: 'Browse and apply for opportunities' },
              { to: '/student/interview', label: 'Interview Prep', desc: 'AI mock interview practice' },
            ].map(({ to, label, desc }) => (
              <Link key={to} to={to} className="p-4.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 hover:border-primary-400 dark:hover:border-primary-900 hover:bg-primary-50/20 dark:hover:bg-primary-950/20 hover:scale-[1.01] transition-all duration-200 text-left">
                <p className="font-bold text-gray-850 dark:text-white text-sm tracking-tight">{label}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-1">
            <h2 className="section-title text-lg font-bold">Recommended Jobs</h2>
            <Link to="/jobs" className="text-primary-600 text-sm font-semibold hover:text-primary-505 flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="text-xs text-gray-500 mb-5">Tailored job matches based on your profile and skills analysis.</p>
          {recommended.length === 0 ? (
            <div className="py-8 text-center text-gray-550 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-sm font-semibold">No matches yet</p>
              <p className="text-xs mt-1">Complete your profile details to unlock smart matching recommendations.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {recommended.map((job) => (
                <Link key={job._id} to={`/jobs/${job._id}`} className="block p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-all duration-200 group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.company} · {job.location}</p>
                    </div>
                    <span className="badge badge-green py-1 px-2.5 font-bold shadow-sm">{job.matchScore}% Match</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
