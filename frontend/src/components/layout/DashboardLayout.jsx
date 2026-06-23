import { Link, Outlet, useLocation } from 'react-router-dom';
import { Briefcase, LogOut, Menu, Bell, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import ThemeToggle from '../common/ThemeToggle';
import { useNotifications } from '../../context/NotificationContext';

const DashboardLayout = ({ navItems, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useNotifications();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const roleColors = {
    student:   'from-primary-600 to-indigo-500',
    recruiter: 'from-violet-600 to-fuchsia-600',
    admin:     'from-emerald-600 to-teal-500',
  };
  const gradientClass = roleColors[user?.role] || 'from-primary-600 to-indigo-500';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col
          bg-white dark:bg-slate-900/95 backdrop-blur-xl
          border-r border-slate-200/80 dark:border-slate-800/80
          shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradientClass} shadow-soft`}>
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-[18px] tracking-tight text-slate-900 dark:text-white">
              PlacementAI
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-soft flex-shrink-0`}>
              <span className="text-white text-sm font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                  ${active
                    ? `bg-gradient-to-r ${gradientClass} text-white shadow-soft translate-x-1`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                  }`}
              >
                <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${active ? 'text-white' : ''}`} />
                <span>{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold
              text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between
          px-4 lg:px-8
          bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl
          border-b border-slate-200/80 dark:border-slate-800/80
          shadow-sm z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button className="p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors relative">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
