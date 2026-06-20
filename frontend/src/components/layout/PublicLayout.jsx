import { Link, Outlet } from 'react-router-dom';
import { Briefcase, LogIn, UserPlus } from 'lucide-react';
import { useSelector } from 'react-redux';
import ThemeToggle from '../common/ThemeToggle';

const PublicLayout = () => {
  const { user } = useSelector((state) => state.auth);

  const dashboardPath =
    user?.role === 'student'
      ? '/student/dashboard'
      : user?.role === 'recruiter'
        ? '/recruiter/dashboard'
        : user?.role === 'admin'
          ? '/admin/dashboard'
          : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0f1e] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-blue-700 shadow-md shadow-primary-500/25">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[17px] tracking-tight bg-gradient-to-r from-gray-950 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">PlacementAI</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {dashboardPath ? (
              <Link to={dashboardPath} className="btn-primary text-xs py-2 px-4 shadow-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-650 dark:text-gray-350 hover:text-primary-600 dark:hover:text-primary-450 transition-colors">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-xs py-2 px-4 shadow-sm">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-slide-up">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} PlacementAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
