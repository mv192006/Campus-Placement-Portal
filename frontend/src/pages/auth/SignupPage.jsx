import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerStudent, registerRecruiter } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student');
  const [form, setForm] = useState({
    name: '', email: '', password: '', branch: '', graduationYear: new Date().getFullYear(),
    companyName: '', companyDescription: '', website: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = role === 'student' ? registerStudent : registerRecruiter;
    const result = await dispatch(action(form));
    if (action.fulfilled.match(result)) {
      toast.success('Registration successful!');
      navigate(role === 'student' ? '/student/dashboard' : '/recruiter/dashboard');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-mesh-light dark:bg-mesh-dark">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <div className="card-glass w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-purple-500 rounded-xl w-fit mx-auto mb-4 shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30 border border-white/20 dark:border-white/10 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get started with PlacementAI today</p>
        </div>

        <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          {['student', 'recruiter'].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg font-semibold capitalize text-sm transition-all duration-205 ${role === r ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input-field" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input-field" placeholder="name@domain.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>

          {role === 'student' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Branch</label>
                <input className="input-field" placeholder="e.g. Computer Science" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
              </div>
              <div>
                <label className="label">Graduation Year</label>
                <input type="number" className="input-field" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: Number(e.target.value) })} />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="label">Company Name</label>
                <input className="input-field" placeholder="e.g. Google Inc" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
              </div>
              <div>
                <label className="label">Company Description</label>
                <textarea className="input-field" rows={3} placeholder="Tell us about your company..." value={form.companyDescription} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} />
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input-field" placeholder="https://domain.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary w-full py-3.5 mt-2 font-bold shadow-lg">Create Account</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <Link to="/login" className="font-semibold text-primary-650 hover:text-primary-505 dark:text-primary-400 dark:hover:text-primary-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
