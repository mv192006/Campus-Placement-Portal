import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, MapPin, Building2, Calendar, Clock, CheckCircle, Sparkles, AlertCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { jobAPI } from '../../services';

const JobDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Determine back link based on current route context
  const backLink = location.pathname.startsWith('/student')
    ? '/student/jobs'
    : location.pathname.startsWith('/recruiter')
      ? '/recruiter/browse-jobs'
      : '/jobs';

  useEffect(() => {
    Promise.all([
      jobAPI.getJob(id),
      user?.role === 'student' ? jobAPI.getMatch(id).catch(() => null) : null,
    ]).then(([jobRes, matchRes]) => {
      setJob(jobRes.data.data);
      if (matchRes) setMatch(matchRes.data.data);
    }).catch(() => {
      toast.error('Failed to load job details');
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const { data } = await jobAPI.apply(id);
      toast.success(`Applied! Match score: ${data.matchDetails?.matchScore || 'N/A'}%`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner className="py-20" size="lg" />;

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Job listing not found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">The job listing you are looking for has expired or does not exist.</p>
        <Link to={backLink} className="btn-primary py-2.5 px-5 text-xs font-bold shadow-sm">Browse Active Jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        to={backLink}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-blue-800 px-6 sm:px-8 py-8 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <div className="flex items-start gap-5 relative z-10">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{job.title}</h1>
              <p className="text-primary-100 text-base font-semibold mt-1">{job.company}</p>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 px-6 sm:px-8 py-4.5 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800/80 font-medium">
          {job.location && (
            <span className="flex items-center gap-1.5 text-xs text-gray-650 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              {job.location}
            </span>
          )}
          {job.package && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400">
              💰 Salary: {job.package}
            </span>
          )}
          {job.type && (
            <span className="flex items-center gap-1.5 text-xs text-gray-650 dark:text-gray-300">
              <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              {job.type}
            </span>
          )}
          {job.createdAt && (
            <span className="flex items-center gap-1.5 text-xs text-gray-650 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              Posted {formatDate(job.createdAt)}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-8 space-y-7">
          {/* AI Match Score */}
          {match && (
            <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-primary-50/50 via-blue-50/30 to-purple-50/30 dark:from-primary-950/20 dark:via-blue-950/10 dark:to-purple-950/10 rounded-2xl border border-primary-100 dark:border-primary-900/30">
              <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-650 dark:text-primary-400 flex-shrink-0">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-primary-800 dark:text-primary-350 text-base">
                  AI Fit Match Score: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 font-extrabold">{match.matchScore}%</span>
                </p>
                {match.recommendation && (
                  <p className="text-xs text-gray-600 dark:text-gray-450 mt-1 leading-relaxed">
                    {match.recommendation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <section className="space-y-3">
              <h2 className="section-title text-base font-bold text-gray-900 dark:text-white">
                Job Overview
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && (
            <section className="space-y-3">
              <h2 className="section-title text-base font-bold text-gray-900 dark:text-white">
                Role Requirements
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </div>
            </section>
          )}

          {/* Skills */}
          {(job.skillsRequired || []).length > 0 && (
            <section className="space-y-3">
              <h2 className="section-title text-base font-bold text-gray-900 dark:text-white">
                Key Skills Required
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag py-1.5 px-3.5 flex items-center gap-1.5 text-xs font-semibold bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100/60 dark:border-primary-900/40 text-primary-700 dark:text-primary-300"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Eligibility Criteria */}
          {job.minCGPA != null && (
            <section className="space-y-3">
              <h2 className="section-title text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <AlertCircle className="h-4.5 w-4.5 text-gray-400" /> Eligibility Cutoffs
              </h2>
              <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 text-xs text-gray-650 dark:text-gray-400 space-y-2 font-medium">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Minimum Cumulative CGPA: <span className="font-bold text-gray-900 dark:text-white">{job.minCGPA}</span>
                </p>
              </div>
            </section>
          )}

          {/* Apply Button */}
          {user?.role === 'student' && (
            <div className="pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={handleApply}
                className="btn-primary text-sm font-bold px-8 py-3.5 shadow-lg shadow-primary-500/20 hover:scale-[1.01]"
                disabled={applying}
                id="apply-job-btn"
              >
                {applying ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Submitting Application...
                  </span>
                ) : (
                  'Apply for this Role'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
