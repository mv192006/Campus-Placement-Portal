import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authAPI } from '../../services';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.resetPassword(token, password);
      localStorage.setItem('token', data.token);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch {
      toast.error('Invalid or expired reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-mesh-light dark:bg-mesh-dark">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <div className="card-glass w-full max-w-md animate-fade-in shadow-2xl">
        <div className="text-center mb-8">
          <div className="p-3 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl w-fit mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Create a strong new password for your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary w-full py-3 shadow-lg">Reset Password</button>
        </form>
        <Link to="/login" className="block text-center text-sm font-semibold text-primary-650 hover:text-primary-505 dark:text-primary-400 dark:hover:text-primary-300 mt-6">Back to Login</Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
