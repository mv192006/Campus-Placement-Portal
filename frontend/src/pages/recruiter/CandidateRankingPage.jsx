import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trophy, Award, Target, AlertTriangle, GraduationCap, Code } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { recruiterAPI } from '../../services';

const CandidateRankingPage = () => {
  const { id } = useParams();
  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    recruiterAPI.rankCandidates(id)
      .then(({ data }) => setRanked(data.data || []))
      .catch(err => {
        console.error(err);
        setError(err?.response?.data?.message || 'Failed to rank candidates. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to={`/recruiter/jobs/${id}/applicants`} className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 text-gray-500 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="page-header mb-0">
          <h1 className="page-title text-3xl">AI Leaderboard</h1>
          <p className="page-description text-base font-normal">Holistic student ratings powered by resume parsed keywords, academic performance records, and qualifications matching.</p>
        </div>
      </div>

      {error && (
        <div className="card border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">Ranking Failed</p>
            <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-1">{error}</p>
          </div>
        </div>
      )}

      {!error && ranked.length === 0 ? (
        <div className="card text-center py-16 max-w-xl mx-auto border border-dashed border-gray-200 dark:border-gray-800">
          <Sparkles className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-gray-850 dark:text-white">No candidates rated yet</p>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto">Upload candidate resumes on the applicants panel first to generate AI placement matching leaderboards.</p>
          <Link to={`/recruiter/jobs/${id}/applicants`} className="btn-primary text-xs py-2.5 px-4.5 shadow-sm font-semibold mt-6">Go to Applicants</Link>
        </div>
      ) : ranked.length > 0 && (
        <div className="space-y-4">
          {ranked.map((c, i) => {
            const isTop3 = i < 3;
            const rankColors = [
              'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30',
              'bg-slate-150 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50',
              'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30',
            ];
            const defaultRankClass = 'bg-gray-100 dark:bg-gray-800 text-gray-505 dark:text-gray-450 border border-gray-200/50 dark:border-gray-700/50';
            const rankClass = isTop3 ? rankColors[i] : defaultRankClass;

            const iconMap = [
              <Trophy className="h-4 w-4" />,
              <Award className="h-4 w-4" />,
              <Target className="h-4 w-4" />
            ];
            const rankIcon = isTop3 ? iconMap[i] : <span className="text-xs">#{i + 1}</span>;

            const scoreColor = c.score >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
                              c.score >= 50 ? 'text-amber-600 dark:text-amber-400' :
                              'text-red-500 dark:text-red-400';

            return (
              <div key={c.studentId || i} className={`card p-5 ${i === 0 ? 'ring-2 ring-amber-500/30 dark:ring-amber-500/20' : ''}`}>
                <div className="flex items-center gap-4.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${rankClass}`}>
                    {rankIcon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-850 dark:text-white text-base tracking-tight truncate">{c.name}</p>
                    {c.email && (
                      <p className="text-[11px] text-gray-450 dark:text-gray-500 mt-0.5 truncate">{c.email}</p>
                    )}
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className={`text-2xl font-extrabold tracking-tight ${isTop3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600' : scoreColor}`}>{c.score}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mt-0.5">Score</p>
                  </div>
                </div>

                {/* Detail row */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {c.cgpa != null && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                      <GraduationCap className="h-3 w-3 text-gray-400" />
                      CGPA: {c.cgpa}
                    </span>
                  )}
                  {c.skills && c.skills.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Code className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-violet-700 dark:text-violet-300">
                            {skill}
                          </span>
                        ))}
                        {c.skills.length > 4 && (
                          <span className="text-[10px] font-semibold text-gray-400">+{c.skills.length - 4}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reasoning */}
                {c.reasoning && (
                  <p className="text-[11px] text-gray-450 dark:text-gray-500 mt-2 leading-relaxed">{c.reasoning}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateRankingPage;
