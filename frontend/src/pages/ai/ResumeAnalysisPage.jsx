import { useState } from 'react';
import { UploadCloud, Sparkles, CheckCircle, HelpCircle, FileText, Compass, GraduationCap, AlertTriangle, Cpu, Wifi, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentAPI } from '../../services';

const ResumeAnalysisPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    const file = e?.target?.files?.[0];
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const fd = new FormData();
      if (file) fd.append('resume', file);
      const { data } = await studentAPI.analyzeResume(fd);
      setAnalysis(data.data);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Analysis failed. Try uploading a PDF resume first.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      // Reset file input so same file can be re-uploaded
      if (e?.target) e.target.value = '';
    }
  };

  const isOffline = analysis?.analysisMode === 'offline';

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary-600" /> Resume Analyzer
        </h1>
        <p className="page-description text-base">Get instantaneous feedback on ATS formatting compatibility, identified weaknesses, missing key skills, and certification suggestions.</p>
      </div>

      <div className="card">
        <h2 className="section-title text-lg mb-1 flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-primary-650" /> PDF Resume Analyzer
        </h2>
        <p className="text-xs text-gray-500 mb-5">Analyze a new document or evaluate your saved profile resume.</p>
        <div className="flex flex-wrap gap-3.5">
          <label className="btn-primary text-xs font-bold py-3 px-5 shadow-md cursor-pointer flex items-center gap-2">
            <UploadCloud className="h-4 w-4" /> Upload & Analyze
            <input type="file" accept=".pdf" className="hidden" onChange={handleAnalyze} />
          </label>
          <button onClick={() => handleAnalyze()} className="btn-secondary text-xs font-bold py-3 px-5" disabled={loading}>
            Analyze Saved Resume
          </button>
        </div>
      </div>

      {loading && (
        <div className="card py-16 flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm font-bold text-gray-650 dark:text-gray-300">Reading resume contents and processing rating parameters...</p>
        </div>
      )}

      {error && !loading && (
        <div className="card border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">Analysis Failed</p>
            <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-1">{error}</p>
            <p className="text-xs text-gray-500 mt-2">Make sure you have uploaded a valid PDF resume, or try uploading a new one.</p>
          </div>
        </div>
      )}

      {analysis && !loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Analysis mode indicator */}
          <div className={`md:col-span-2 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
            isOffline
              ? 'bg-amber-50/60 dark:bg-amber-950/15 border border-amber-200/60 dark:border-amber-900/30 text-amber-700 dark:text-amber-400'
              : 'bg-emerald-50/60 dark:bg-emerald-950/15 border border-emerald-200/60 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          }`}>
            {isOffline ? (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                <span>Analyzed using offline keyword extraction engine — results are based on detected patterns in your resume text.</span>
              </>
            ) : (
              <>
                <Cpu className="h-3.5 w-3.5" />
                <span>Analyzed using AI-powered engine — results reflect deep semantic understanding of your resume.</span>
              </>
            )}
          </div>

          {/* ATS Score */}
          <div className="card text-center flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-50/50 to-blue-50/20 dark:from-primary-950/20 dark:to-blue-950/10 md:col-span-2">
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> ATS Compatibility Rating</p>
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="currentColor" className="text-gray-150 dark:text-gray-800" strokeWidth="8" fill="transparent" />
                <circle cx="64" cy="64" r="54" stroke="currentColor"
                  className={`${
                    (analysis.atsScore || 0) >= 75 ? 'text-emerald-500 dark:text-emerald-400' :
                    (analysis.atsScore || 0) >= 50 ? 'text-amber-500 dark:text-amber-400' :
                    'text-red-500 dark:text-red-400'
                  }`}
                  strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - (analysis.atsScore || 0) / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute text-3xl font-extrabold text-gray-850 dark:text-white tracking-tight">
                {analysis.atsScore}%
              </div>
            </div>
            <p className={`text-xs font-semibold mt-4 ${
              (analysis.atsScore || 0) >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
              (analysis.atsScore || 0) >= 50 ? 'text-amber-600 dark:text-amber-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {(analysis.atsScore || 0) >= 75 ? 'Strong ATS compatibility — your resume is well-optimized.' :
               (analysis.atsScore || 0) >= 50 ? 'Moderate ATS compatibility — some improvements recommended.' :
               'Low ATS compatibility — significant improvements needed.'}
            </p>
          </div>

          {[
            { title: 'Strengths', items: analysis.strengths, color: 'text-green-600 dark:text-green-400 border-green-100 dark:border-green-950/50 bg-green-50/20 dark:bg-green-950/5', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
            { title: 'Weaknesses', items: analysis.weaknesses, color: 'text-red-650 dark:text-red-400 border-red-100 dark:border-red-950/50 bg-red-50/20 dark:bg-red-950/5', icon: <HelpCircle className="h-4 w-4 text-red-500" /> },
            { title: 'Missing Skills', items: analysis.missingSkills, color: 'text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-950/50 bg-orange-50/20 dark:bg-orange-950/5', icon: <Compass className="h-4 w-4 text-orange-500" /> },
            { title: 'Improvements', items: analysis.improvements, color: 'text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-950/50 bg-blue-50/20 dark:bg-blue-950/5', icon: <FileText className="h-4 w-4 text-blue-550" /> },
            { title: 'Recommended Certifications', items: analysis.recommendedCertifications, color: 'text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-950/50 bg-purple-50/20 dark:bg-purple-950/5', icon: <GraduationCap className="h-4.5 w-4.5 text-purple-500" />, colSpan: true },
          ].map(({ title, items, color, icon, colSpan }) => (
            <div key={title} className={`card ${colSpan ? 'md:col-span-2' : ''} border ${color.split(' ').slice(2).join(' ')}`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider ${color.split(' ')[0]}`}>
                {icon} {title}
              </h3>
              {(!items || items.length === 0) ? (
                <p className="text-xs text-gray-400">None identified.</p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item, i) => (
                    <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-gray-400 dark:text-gray-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisPage;
