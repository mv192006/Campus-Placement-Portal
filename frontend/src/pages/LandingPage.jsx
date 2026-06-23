import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Briefcase, GraduationCap, Sparkles, Users } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const LandingPage = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary-500 selection:text-white transition-colors duration-300">
    {/* Navbar */}
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 rounded-2xl bg-primary-600 shadow-glow flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">PlacementAI</span>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Login</Link>
          <Link to="/signup" className="btn-primary text-sm shadow-soft hover:shadow-glow py-2.5 px-6">Get Started</Link>
        </div>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative pt-40 pb-32 px-4 overflow-hidden bg-mesh-light dark:bg-mesh-dark min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
      <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in w-full">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold uppercase tracking-widest mb-10 shadow-sm">
          <Sparkles className="h-4 w-4" /> AI-Powered Campus Placements
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Your Gateway to<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-400">Dream Careers</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Smart job matching, AI resume analysis, mock interviews, and placement predictions — all in one platform for students, recruiters, and placement officers.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link to="/signup" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 text-lg hover:-translate-y-1 transition-all duration-300">
            Start as Student <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/signup?role=recruiter" className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 text-lg hover:-translate-y-1 transition-all duration-300">
            Hire Talent
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-32 px-4 relative bg-white dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">Powered by AI</h2>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400">Our platform uses advanced AI/ML algorithms to simplify every stage of placement drives.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: 'Resume Analyzer', desc: 'Get ATS scores, identify skill gaps, and receive suggestions for improving your profile instantly.' },
            { icon: Briefcase, title: 'Smart Job Matching', desc: 'Our matching algorithm processes your skills and projects to compare against job descriptions.' },
            { icon: GraduationCap, title: 'Interview Prep', desc: 'Practice with a real-time AI mock interviewer generating personalized behavioral and technical questions.' },
            { icon: Sparkles, title: 'Placement Prediction', desc: 'Check your current industry placement probability based on academic records and historical hiring data.' },
            { icon: Users, title: 'Candidate Ranking', desc: 'Recruiters can screen hundreds of applicants instantly with dynamic AI matching leaderboards.' },
            { icon: ArrowRight, title: 'Real-time Updates', desc: 'Never miss an invite. Stay updated with immediate status shifts, alerts, and schedules.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-hover p-8 flex flex-col justify-between group bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-soft text-primary-600 dark:text-primary-400 border border-slate-100 dark:border-slate-700 w-fit mb-8 transition-all group-hover:scale-110 group-hover:-rotate-3">
                  <Icon className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h3>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center text-sm text-slate-500 dark:text-slate-400">
      <p>&copy; {new Date().getFullYear()} PlacementAI. All rights reserved.</p>
    </footer>
  </div>
);

export default LandingPage;
