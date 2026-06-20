import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Briefcase, GraduationCap, Sparkles, Users } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const LandingPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e] text-gray-900 dark:text-gray-100 selection:bg-primary-500 selection:text-white transition-colors duration-300">
    {/* Navbar */}
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-blue-700 shadow-md shadow-primary-500/25">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-gray-950 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">PlacementAI</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Login</Link>
          <Link to="/signup" className="btn-primary text-sm shadow-sm py-2 px-4.5">Get Started</Link>
        </div>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative pt-36 pb-24 px-4 overflow-hidden bg-mesh-light dark:bg-mesh-dark">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
      <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse-slow">
          <Sparkles className="h-3.5 w-3.5" /> AI-Powered Campus Placements
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15]">
          Your Gateway to<br />
          <span className="text-gradient">Dream Careers</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Smart job matching, AI resume analysis, mock interviews, and placement predictions — all in one platform for students, recruiters, and placement officers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4.5 justify-center items-center">
          <Link to="/signup" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base shadow-lg hover:-translate-y-0.5 transition-transform duration-200">
            Start as Student <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/signup?role=recruiter" className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base hover:-translate-y-0.5 transition-transform duration-200">
            Hire Talent
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Powered by AI</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Our platform uses advanced AI/ML algorithms to simplify every stage of placement drives.</p>
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
            <div key={title} className="card-hover p-6 flex flex-col justify-between group">
              <div>
                <div className="p-3.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/30 w-fit mb-5 transition-transform group-hover:rotate-6">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2.5 tracking-tight">{title}</h3>
                <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-10 px-4 border-t border-gray-200/80 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/30 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} PlacementAI. All rights reserved.</p>
    </footer>
  </div>
);

export default LandingPage;
