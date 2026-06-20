import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services';
import toast from 'react-hot-toast';
import ThemeToggle from '../../components/common/ThemeToggle';
import { KeyRound } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent if email exists');
    } catch {
      toast.error('Failed to send reset email');
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
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Enter your email to receive a recovery link</p>
        </div>
        {sent ? (
          <div className="text-center py-4">
            <p className="text-green-600 dark:text-green-400 font-medium mb-5 bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-3.5 rounded-xl">Check your email for the password reset link.</p>
            <Link to="/login" className="btn-secondary w-full py-2.5 font-bold">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input-field" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full py-3 shadow-lg">Send Reset Link</button>
            <Link to="/login" className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 mt-4">Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
