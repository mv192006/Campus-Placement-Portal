import { useState } from 'react';
import { Sparkles, Brain, ArrowRight, MessageSquare, Compass, ListTodo, GraduationCap, Award, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { aiAPI, studentAPI } from '../../services';

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'AI Engineer'];

const InterviewPrepPage = () => {
  const [role, setRole] = useState(ROLES[0]);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [currentQ, setCurrentQ] = useState('');
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await aiAPI.interviewPrep(role);
      setQuestions(data.data);
      toast.success('Questions generated!');
    } catch {
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!currentQ || !answer) return;
    setEvaluating(true);
    try {
      const { data } = await aiAPI.mockInterview({ question: currentQ, answer, role });
      setChat((prev) => [...prev, { question: currentQ, answer, evaluation: data.data }]);
      setAnswer('');
      toast.success('Answer evaluated!');
    } catch {
      toast.error('Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const getPrediction = async () => {
    try {
      const { data } = await studentAPI.getPlacementPrediction();
      setPrediction(data.data);
      toast.success('Placement prediction updated!');
    } catch {
      toast.error('Failed to get prediction');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary-650" /> AI Interview Prep
        </h1>
        <p className="page-description text-base">Select your target industry career track, generate custom screening interview questions, and practice with real-time feedback ratings.</p>
      </div>

      {/* Role Selector & Actions */}
      <div className="card">
        <h2 className="section-title text-lg mb-1 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary-650" /> Setup Parameters
        </h2>
        <p className="text-xs text-gray-550 dark:text-gray-400 mb-5">Select a role to pull specialized mock question pools.</p>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Target Career Track</label>
            <select className="input-field py-2.5 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button onClick={generateQuestions} className="btn-primary text-xs py-3 px-5 shadow-md font-bold" disabled={loading}>
            {loading ? 'Sourcing pools...' : 'Generate Questions'}
          </button>
          <button onClick={getPrediction} className="btn-secondary text-xs py-3 px-5 font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary-600" /> placement Prediction
          </button>
        </div>
      </div>

      {/* Placement Prediction Gauge */}
      {prediction && (
        <div className="card grid md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center justify-center p-4 border-r border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Placement Odds</p>
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="6" fill="transparent" />
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-primary-650 dark:text-primary-400" strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - (prediction.probability || 60) / 100)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute text-2xl font-extrabold text-gray-850 dark:text-white tracking-tight">
                {prediction.probability}%
              </div>
            </div>
            <p className="text-[10px] text-gray-550 dark:text-gray-400 mt-3 font-semibold">Probability index based on historic placement models.</p>
          </div>

          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4.5 p-2">
            <div className="p-4 rounded-xl border border-red-100 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/5">
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><ListTodo className="h-3.5 w-3.5" /> Key Focus Areas</p>
              {(!prediction.weakAreas || prediction.weakAreas.length === 0) ? (
                <p className="text-xs text-gray-400">None identified.</p>
              ) : (
                <ul className="text-[11px] text-gray-700 dark:text-gray-300 space-y-1.5">
                  {prediction.weakAreas.map((w, i) => <li key={i} className="flex gap-1"><span>•</span> <span>{w}</span></li>)}
                </ul>
              )}
            </div>
            <div className="p-4 rounded-xl border border-green-100 dark:border-green-950/40 bg-green-50/20 dark:bg-green-950/5">
              <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Action Steps</p>
              {(!prediction.suggestions || prediction.suggestions.length === 0) ? (
                <p className="text-xs text-gray-400">None identified.</p>
              ) : (
                <ul className="text-[11px] text-gray-700 dark:text-gray-300 space-y-1.5">
                  {prediction.suggestions.map((s, i) => <li key={i} className="flex gap-1"><span>•</span> <span>{s}</span></li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated Questions panels */}
      {questions && (
        <div className="grid lg:grid-cols-3 gap-5">
          {[
            { title: 'Technical Modules', items: questions.technicalQuestions, theme: 'border-blue-100 dark:border-blue-900/30' },
            { title: 'Behavioral & HR', items: questions.hrQuestions, theme: 'border-purple-100 dark:border-purple-900/30' },
            { title: 'Scenario Casework', items: questions.scenarioQuestions, theme: 'border-orange-100 dark:border-orange-900/30' },
          ].map(({ title, items, theme }) => (
            <div key={title} className={`card flex flex-col max-h-96 border ${theme} p-4`}>
              <h3 className="section-title text-sm mb-3 font-bold text-gray-800 dark:text-gray-200">{title}</h3>
              <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 no-scrollbar">
                {(items || []).map((q, i) => (
                  <button key={i} onClick={() => setCurrentQ(q)}
                    className={`w-full text-left text-xs p-3 rounded-xl border transition-all duration-200 leading-relaxed
                      ${currentQ === q
                        ? 'bg-primary-50/70 border-primary-200 dark:bg-primary-950/40 dark:border-primary-900/80 text-primary-700 dark:text-primary-350 font-bold'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-650 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}>
                    {i + 1}. {q}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mock Interview Chat Interface */}
      <div className="card space-y-4">
        <h3 className="section-title text-base font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary-650" /> Mock Interview Chat
        </h3>
        
        {currentQ ? (
          <div className="p-4.5 bg-gradient-to-r from-primary-50/50 to-blue-50/30 dark:from-primary-950/20 dark:to-blue-950/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 animate-fade-in">
            <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5" /> Selected Question:</p>
            <p className="text-sm font-semibold text-gray-850 dark:text-white mt-1 leading-relaxed">{currentQ}</p>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            <p className="text-xs font-semibold">Select a question from the cards panel above to start the mock panel evaluation.</p>
          </div>
        )}

        <div className="space-y-4.5">
          <textarea
            className="input-field text-sm leading-relaxed"
            rows={4}
            placeholder="Structure and type your answer logs here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!currentQ}
          />
          <div className="flex justify-end">
            <button onClick={evaluateAnswer} className="btn-primary text-xs font-bold py-2.5 px-6 shadow-md" disabled={evaluating || !answer || !currentQ}>
              {evaluating ? 'Analyzing details...' : 'Submit Evaluation'}
            </button>
          </div>
        </div>

        {chat.length > 0 && (
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Evaluation History</h4>
            <div className="space-y-5">
              {chat.map((c, i) => (
                <div key={i} className="space-y-3 p-4.5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-300">Q: {c.question}</p>
                    <p className="text-xs text-gray-505 dark:text-gray-450 italic bg-white dark:bg-gray-950 p-2.5 rounded-xl border border-gray-100 dark:border-gray-900 mt-1">A: {c.answer}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    {[
                      { label: 'Technical Score', value: c.evaluation.technicalScore, color: 'text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' },
                      { label: 'Communication', value: c.evaluation.communicationScore, color: 'text-purple-650 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30' },
                      { label: 'Confidence Score', value: c.evaluation.confidenceScore, color: 'text-orange-600 dark:text-orange-400 bg-orange-50/40 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30' }
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`p-3 rounded-xl border text-center ${color}`}>
                        <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400">{label}</p>
                        <p className="text-base font-extrabold mt-0.5">{value || 0}/10</p>
                      </div>
                    ))}
                  </div>
                  
                  {c.evaluation.feedback && (
                    <div className="p-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900/60 rounded-xl mt-2.5">
                      <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> Evaluator Feedback:</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{c.evaluation.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrepPage;
