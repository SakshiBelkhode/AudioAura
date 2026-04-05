import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Music2, Loader2 } from 'lucide-react';

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      setUser(res.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center mb-3">
            <Music2 size={24} className="text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">Spotify Clone</h1>
          <p className="text-gray-400 text-sm mt-1">Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Email or Username</label>
            <input
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Log In
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-[#1db954] transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
