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
    student:   'from-primary-600 to-blue-700',
    recruiter: 'from-violet-600 to-purple-700',
    admin:     'from-emerald-600 to-teal-700',
  };
  const gradientClass = roleColors[user?.role] || 'from-primary-600 to-blue-700';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0a0f1e]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col
          bg-white dark:bg-gray-900/95 backdrop-blur-xl
          border-r border-gray-200/80 dark:border-gray-800/80
          shadow-xl shadow-black/5 dark:shadow-black/30
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg`}>
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-gray-900 dark:text-white">
              PlacementAI
            </span>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-md flex-shrink-0`}>
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? `bg-gradient-to-r ${gradientClass} text-white shadow-md`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
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
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
              text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
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
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between
          px-4 lg:px-8
          bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
          border-b border-gray-200/80 dark:border-gray-800/80
          shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
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
