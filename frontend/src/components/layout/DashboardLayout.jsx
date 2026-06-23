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
    student:   'bg-black dark:bg-white text-white dark:text-black',
    recruiter: 'bg-gray-800 dark:bg-gray-200 text-white dark:text-black',
    admin:     'bg-gray-600 text-white',
  };
  const gradientClass = roleColors[user?.role] || 'bg-black dark:bg-white text-white dark:text-black';

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen flex bg-apple-gray dark:bg-black">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col
          bg-apple-gray dark:bg-[#1d1d1f]
          border-r border-gray-200/80 dark:border-[#333336]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200/50 dark:border-[#333336] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`p-2 rounded-xl bg-apple-dark dark:bg-white`}>
              <Briefcase className="h-4 w-4 text-white dark:text-apple-dark" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-apple-dark dark:text-white">
              PlacementAI
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-[#333336]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-[#86868b]" />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 my-6 p-4 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-[#333336]">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${gradientClass}`}>
              <span className="text-sm font-semibold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-apple-dark dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-[#86868b] capitalize font-medium">{user?.role}</p>
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
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200
                  ${active
                    ? `bg-[#e8e8ed] dark:bg-[#333336] text-apple-dark dark:text-white`
                    : 'text-[#86868b] hover:bg-gray-200/50 dark:hover:bg-[#333336]/50 hover:text-apple-dark dark:hover:text-white'
                  }`}
              >
                <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${active ? 'text-white' : ''}`} />
                <span>{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-gray-200/50 dark:border-[#333336]">
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium
              text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#333336]/50 transition-colors duration-200"
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
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between
          px-4 lg:px-8
          bg-[#ffffffcc] dark:bg-[#000000cc] backdrop-blur-md
          border-b border-gray-200/50 dark:border-[#333336]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-[#333336] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-apple-dark dark:text-white" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-apple-dark dark:text-white tracking-tight">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button className="p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-[#333336] transition-colors relative">
                <Bell className="h-5 w-5 text-[#86868b]" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-black dark:bg-white rounded-full" />
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
