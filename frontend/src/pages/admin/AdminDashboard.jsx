import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Users, Briefcase, Building2, FileText, BarChart3, PieChart, Star } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../services';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getDashboard(), adminAPI.getAnalytics()])
      .then(([dash, anal]) => {
        setStats(dash.data.data);
        setAnalytics(anal.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  const branchData = {
    labels: (analytics?.branchWise || []).map((b) => b.branch),
    datasets: [{ label: 'Placements', data: (analytics?.branchWise || []).map((b) => b.count), backgroundColor: '#3b82f6' }],
  };

  const companyData = {
    labels: (analytics?.companyWise || []).map((c) => c.company),
    datasets: [{ data: (analytics?.companyWise || []).map((c) => c.count), backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'] }],
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-3xl flex items-center gap-2">
          Placement Analytics Panel
        </h1>
        <p className="page-description text-base">Overview of registered accounts, branch hiring distribution ratios, and employer partnerships statistics.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Students" value={stats?.students || 0} icon={Users} />
        <StatCard title="Recruiters" value={stats?.recruiters || 0} icon={Building2} color="green" />
        <StatCard title="Active Jobs" value={stats?.jobs || 0} icon={Briefcase} color="purple" />
        <StatCard title="Applications" value={stats?.applications || 0} icon={FileText} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title text-base font-bold mb-1 flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-blue-500" /> Branch-wise Placements
          </h3>
          <p className="text-xs text-gray-500 mb-5">Hiring counts distributed by engineering/academic branches.</p>
          <div className="p-2">
            {(analytics?.branchWise || []).length > 0 ? <Bar data={branchData} options={{ responsive: true }} /> : <p className="text-sm text-gray-400 py-10 text-center">No placement data yet</p>}
          </div>
        </div>
        
        <div className="card">
          <h3 className="section-title text-base font-bold mb-1 flex items-center gap-2">
            <PieChart className="h-4.5 w-4.5 text-purple-500" /> Company-wise Placements
          </h3>
          <p className="text-xs text-gray-500 mb-5">Hiring share statistics by partner corporate organizations.</p>
          <div className="p-2 max-w-[320px] mx-auto">
            {(analytics?.companyWise || []).length > 0 ? <Doughnut data={companyData} /> : <p className="text-sm text-gray-400 py-10 text-center">No placement data yet</p>}
          </div>
        </div>
      </div>

      <div className="card flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-gray-850 dark:text-white text-base">Cumulative Placement Count</p>
            <p className="text-xs text-gray-505 dark:text-gray-400 mt-0.5">Total successful candidate placement selections recorded during this session.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 tracking-tight">
            {analytics?.totalPlacements || 0}
          </p>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Offers</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
