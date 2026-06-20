import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Calendar, FileText, Mail, GraduationCap, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { recruiterAPI } from '../../services';

const ApplicantsPage = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleForm, setScheduleForm] = useState({ studentId: '', interviewDate: '', mode: 'online', meetingLink: '' });

  useEffect(() => {
    recruiterAPI.getApplicants(id).then(({ data }) => setApplications(data.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (applicationId, status) => {
    try {
      await recruiterAPI.updateApplicationStatus(id, applicationId, status);
      toast.success(`Status updated to ${status}`);
      const { data } = await recruiterAPI.getApplicants(id);
      setApplications(data.data);
    } catch {
      toast.error('Update failed');
    }
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await recruiterAPI.scheduleInterview({ ...scheduleForm, jobId: id, studentId: scheduleForm.studentId });
      toast.success('Interview scheduled successfully!');
      setScheduleForm({ studentId: '', interviewDate: '', mode: 'online', meetingLink: '' });
    } catch {
      toast.error('Scheduling failed');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link to="/recruiter/jobs" className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 text-gray-500 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="page-header mb-0">
            <h1 className="page-title text-3xl">Applicants ({applications.length})</h1>
            <p className="page-description text-base font-normal">Review candidates, download resumes, modify pipeline statuses, and schedule mock-free panels.</p>
          </div>
        </div>
        <Link to={`/recruiter/jobs/${id}/rank`} className="btn-primary text-xs py-2.5 px-4.5 shadow-sm font-bold flex-shrink-0 flex items-center gap-1.5 self-start sm:self-center">
          <Sparkles className="h-4 w-4" /> AI Candidate Ranking
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-16 max-w-xl mx-auto border border-dashed border-gray-200 dark:border-gray-800">
          <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-gray-850 dark:text-white">No applicants yet</p>
          <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto">This job listing hasn't received any student applications yet. They will appear here once applied.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const initials = app.studentId?.userId?.name
              ? app.studentId.userId.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              : 'ST';
            return (
              <div key={app._id} className="card space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-550 to-purple-650 flex items-center justify-center font-bold text-white shadow-md text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <p className="font-bold text-gray-850 dark:text-white text-base tracking-tight">{app.studentId?.userId?.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {app.studentId?.userId?.email}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span className="font-bold text-gray-800 dark:text-gray-300">CGPA: {app.studentId?.cgpa}</span>
                      </div>
                    </div>
                    {app.studentId?.skills && app.studentId.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {app.studentId.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="skill-tag text-[10px] py-0.5 px-2 bg-violet-50/50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/30 text-violet-700 dark:text-violet-300">
                            {skill}
                          </span>
                        ))}
                        {app.studentId.skills.length > 5 && (
                          <span className="text-[10px] font-semibold text-gray-400">+{app.studentId.skills.length - 5} more</span>
                        )}
                      </div>
                    )}
                    {app.studentId?.resumeUrl && (
                      <a href={app.studentId.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-505">
                        <FileText className="h-3.5 w-3.5" /> View Resume PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {['shortlisted', 'interview', 'selected', 'rejected'].map((s) => {
                      const colorMap = {
                        shortlisted: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20 hover:text-yellow-600 border-yellow-200 dark:border-yellow-900/30 text-yellow-650 bg-yellow-50/20 dark:bg-yellow-950/10',
                        interview: 'hover:bg-purple-55 hover:text-purple-600 border-purple-200 dark:border-purple-900/30 text-purple-650 bg-purple-50/20 dark:bg-purple-950/10',
                        selected: 'hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-600 border-green-200 dark:border-green-900/30 text-green-650 bg-green-50/20 dark:bg-green-950/10',
                        rejected: 'hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 border-red-200 dark:border-red-900/30 text-red-650 bg-red-50/20 dark:bg-red-950/10',
                      };
                      return (
                        <button key={s} onClick={() => updateStatus(app._id, s)} className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl capitalize border transition-all duration-200 ${colorMap[s] || 'bg-gray-100'}`}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setScheduleForm({ ...scheduleForm, studentId: app.studentId._id })} className="btn-primary text-[10px] from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 shadow-sm py-2 px-3 flex items-center justify-center gap-1 font-bold">
                    <Calendar className="h-3.5 w-3.5" /> Schedule Panel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {scheduleForm.studentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <form onSubmit={scheduleInterview} className="card w-full max-w-md space-y-4 shadow-2xl relative">
            <button type="button" onClick={() => setScheduleForm({ ...scheduleForm, studentId: '' })} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="h-4.5 w-4.5 text-gray-500" />
            </button>
            
            <h3 className="section-title text-base font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-600" /> Schedule Interview Panel
            </h3>
            <p className="text-xs text-gray-550 dark:text-gray-400">Select date, timing, and meeting address for the candidate evaluation.</p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="label">Interview Date & Time</label>
                <input type="datetime-local" className="input-field" value={scheduleForm.interviewDate} onChange={(e) => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })} required />
              </div>
              <div>
                <label className="label">Meeting Link (e.g. Google Meet)</label>
                <input className="input-field" placeholder="https://meet.google.com/..." value={scheduleForm.meetingLink} onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setScheduleForm({ ...scheduleForm, studentId: '' })} className="btn-secondary text-xs font-bold py-2.5 px-4 flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs font-bold py-2.5 px-4 flex-1 shadow-md">
                Schedule Interview
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
