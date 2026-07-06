import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Briefcase, GraduationCap, Sparkles, Users } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const LandingPage = () => (
  <div className="min-h-screen bg-apple-gray dark:bg-black text-apple-dark dark:text-apple-gray selection:bg-primary-500 selection:text-white transition-colors duration-300">
    {/* Navbar */}
    <nav className="fixed top-0 w-full z-50 bg-[#ffffffcc] dark:bg-[#000000cc] backdrop-blur-md border-b border-gray-200/50 dark:border-[#333336] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Briefcase className="h-5 w-5 text-apple-dark dark:text-white" />
          <span className="font-semibold text-lg tracking-tight text-apple-dark dark:text-white">PlacementAI</span>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-medium text-apple-dark dark:text-apple-gray hover:text-black dark:hover:text-white transition-colors">Log In</Link>
          <Link to="/signup" className="text-sm font-medium text-black dark:text-white hover:underline transition-all">Sign Up</Link>
        </div>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative pt-40 pb-32 px-4 flex items-center justify-center min-h-screen bg-mesh-light dark:bg-mesh-dark">
      <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in w-full">
        <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-6 text-apple-dark dark:text-white leading-[1.05]">
          Your Gateway to<br />Dream Careers.
        </h1>
        <p className="text-xl sm:text-2xl text-[#86868b] dark:text-[#86868b] max-w-3xl mx-auto mb-12 font-medium tracking-tight">
          Smart job matching, AI resume analysis, mock interviews, and placement predictions — all in one platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup" className="btn-primary w-full sm:w-auto">
            Start as Student
          </Link>
          <Link to="/signup?role=recruiter" className="btn-outline w-full sm:w-auto">
            Hire Talent
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-32 px-4 relative bg-white dark:bg-[#1d1d1f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter text-apple-dark dark:text-white">Powered by AI.</h2>
          <p className="mt-6 text-xl text-[#86868b] dark:text-[#86868b] font-medium tracking-tight">Simplify every stage of placement drives.</p>
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
            <div key={title} className="card-hover p-8 flex flex-col justify-between group bg-apple-gray dark:bg-black rounded-3xl">
              <div>
                <Icon className="h-10 w-10 text-apple-dark dark:text-white mb-6" strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-apple-dark dark:text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-[#86868b] font-medium leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-4 bg-apple-gray dark:bg-black text-center text-sm text-[#86868b]">
      <p>&copy; {new Date().getFullYear()} PlacementAI. All rights reserved.</p>
    </footer>
  </div>
);

export default LandingPage;
