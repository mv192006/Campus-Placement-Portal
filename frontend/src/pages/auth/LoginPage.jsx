import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful!');
      const role = result.payload.user.role;
      navigate(role === 'student' ? '/student/dashboard' : role === 'recruiter' ? '/recruiter/dashboard' : '/admin/dashboard');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-mesh-light dark:bg-mesh-dark">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <div className="card-glass w-full max-w-md animate-fade-in shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-purple-500 rounded-xl w-fit mx-auto mb-4 shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30 border border-white/20 dark:border-white/10 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your PlacementAI account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input-field" placeholder="name@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label mb-0">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">Forgot password?</Link>
            </div>
            <input type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="text-red-500 text-xs font-medium bg-red-50/50 dark:bg-red-950/20 border border-red-205 dark:border-red-900/30 p-2.5 rounded-lg">{error}</p>}
          <button type="submit" className="btn-primary w-full py-3 mt-2 font-bold shadow-lg" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <Link to="/signup" className="font-semibold text-primary-650 hover:text-primary-505 dark:text-primary-400 dark:hover:text-primary-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
