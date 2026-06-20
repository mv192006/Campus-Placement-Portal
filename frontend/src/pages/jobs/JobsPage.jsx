import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Bookmark, BookmarkCheck, Briefcase, Building2, Clock, ChevronRight, SlidersHorizontal, X, Sparkles, Star } from 'lucide-react';
import { fetchJobs, setFilters } from '../../redux/slices/jobSlice';
import { studentAPI } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const JobsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { jobs, loading, filters } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const [savedIds, setSavedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Determine link prefix based on current route context
  const jobLinkPrefix = location.pathname.startsWith('/student')
    ? '/student/jobs'
    : location.pathname.startsWith('/recruiter')
      ? '/jobs'
      : '/jobs';

  useEffect(() => {
    dispatch(fetchJobs(filters));
    if (user?.role === 'student') {
      studentAPI.getSavedJobs().then(({ data }) => {
        setSavedIds(new Set(data.data.map((s) => s.jobId?._id)));
      }).catch(() => {});
    }
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, search, location: locationFilter };
    dispatch(setFilters(newFilters));
    dispatch(fetchJobs(newFilters));
  };

  const clearFilters = () => {
    setSearch('');
    setLocationFilter('');
    const cleared = { search: '', location: '', skills: '' };
    dispatch(setFilters(cleared));
    dispatch(fetchJobs(cleared));
  };

  const toggleSave = async (jobId) => {
    try {
      if (savedIds.has(jobId)) {
        await studentAPI.removeSavedJob(jobId);
        setSavedIds((prev) => { const n = new Set(prev); n.delete(jobId); return n; });
        toast.success('Removed from saved');
      } else {
        await studentAPI.saveJob(jobId);
        setSavedIds((prev) => new Set(prev).add(jobId));
        toast.success('Job saved successfully!');
      }
    } catch {
      toast.error('Action failed');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const hasActiveFilters = search || locationFilter;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title text-3xl">Explore Opportunities</h1>
          <p className="page-description text-base">
            {loading ? 'Sourcing jobs...' : `${jobs.length} relevant positions open for applications.`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden btn-secondary text-xs flex items-center gap-1.5 self-start"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Search & Filters */}
      <form
        onSubmit={handleSearch}
        className={`bg-white dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/85 dark:border-gray-800 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3.5 ${!showFilters ? 'hidden sm:flex' : 'flex flex-col'}`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
          <input
            id="job-search-input"
            className="input-field pl-10.5 text-sm py-2.5 rounded-xl"
            placeholder="Search job title, company, or tech stack keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative flex-shrink-0 sm:w-52">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="location-filter-input"
            className="input-field pl-10.5 text-sm py-2.5 rounded-xl"
            placeholder="Job location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button type="submit" id="search-jobs-btn" className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md flex-1 sm:flex-none">
            Search Jobs
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="p-2.5 rounded-xl border border-gray-250 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 transition-colors"
              title="Clear Search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Content */}
      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : jobs.length === 0 ? (
        /* Empty State */
        <div className="card text-center py-16 max-w-xl mx-auto border border-dashed border-gray-205 dark:border-gray-800">
          <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-gray-850 dark:text-white">No listings found</p>
          <p className="text-xs text-gray-500 mt-1.5 mb-6 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'We couldn\'t find any match. Try adjusting terms, parameters, or location.'
              : 'There are no active postings at this time. Check back later.'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-primary text-xs py-2.5 px-4 font-semibold shadow-sm">
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Job Cards Grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              id={`job-card-${job._id}`}
              className="card-hover flex flex-col justify-between p-5 hover:scale-[1.01] transition-all"
            >
              <div>
                {/* Header: Company icon + title */}
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-md shadow-primary-500/10">
                      <Building2 className="h-5.5 w-5.5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`${jobLinkPrefix}/${job._id}`}
                        className="font-bold text-gray-850 dark:text-white hover:text-primary-650 dark:hover:text-primary-400 transition-colors line-clamp-1 tracking-tight text-base"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  {user?.role === 'student' && (
                    <button
                      onClick={() => toggleSave(job._id)}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      title={savedIds.has(job._id) ? 'Remove from saved' : 'Save job'}
                    >
                      {savedIds.has(job._id)
                        ? <BookmarkCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        : <Bookmark className="h-5 w-5 text-gray-400 hover:text-gray-550 dark:hover:text-gray-300" />
                      }
                    </button>
                  )}
                </div>

                {/* Meta: Location & date */}
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {job.location}
                    </span>
                  )}
                  {job.createdAt && (
                    <>
                      <span className="text-gray-300 dark:text-gray-800">•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {formatDate(job.createdAt)}
                      </span>
                    </>
                  )}
                </div>

                {/* Package */}
                {job.package && (
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-4 bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-950/40 rounded-lg py-1 px-2.5 w-fit">
                    Salary: {job.package}
                  </p>
                )}

                {/* Skills Tags */}
                {(job.skillsRequired || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {job.skillsRequired.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="skill-tag text-[10px] py-0.5 px-2 bg-primary-50/50 dark:bg-primary-950/20 border-primary-100/50 dark:border-primary-900/30 text-primary-700 dark:text-primary-300"
                      >
                        {s}
                      </span>
                    ))}
                    {job.skillsRequired.length > 3 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-850 text-gray-500 rounded-full">
                        +{job.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* View Details Link */}
              <Link
                to={`${jobLinkPrefix}/${job._id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary-650 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group/link border-t border-gray-100 dark:border-gray-800 w-full pt-3 mt-1"
              >
                View Details
                <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
