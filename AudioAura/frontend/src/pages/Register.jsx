import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Music2, Loader2 } from 'lucide-react';

export default function Register() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      setUser(res.data.user);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <p className="text-gray-400 text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="cooluser123"
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Email</label>
            <input
              name="email"
              type="email"
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
          <div>
            <label className="text-sm text-gray-300 block mb-1">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {['user', 'artist'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r }))}
                  className={`py-3 rounded-lg text-sm font-medium border transition-all capitalize ${
                    form.role === r
                      ? 'bg-[#1db954] border-[#1db954] text-black'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {r === 'user' ? '🎧 Listener' : '🎤 Artist'}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-[#1db954] transition-colors font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
