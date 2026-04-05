import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/auth';
import PlayerBar from './PlayerBar';
import toast from 'react-hot-toast';
import { Home, Disc3, LayoutDashboard, LogOut, Music2 } from 'lucide-react';

export default function Layout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    setUser(null);
    toast.success('Logged out');
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#1a1a1a] text-white'
        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
    }`;

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden sm:flex flex-col w-56 bg-[#111] border-r border-[#1a1a1a] p-4 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className="w-8 h-8 bg-[#1db954] rounded-full flex items-center justify-center">
            <Music2 size={16} className="text-black" />
          </div>
          <span className="font-bold text-white text-base">AudioAura</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {user?.role === 'user' && (
            <>
              <NavLink to="/" end className={navClass}>
                <Home size={17} /> Home
              </NavLink>
              <NavLink to="/albums" className={navClass}>
                <Disc3 size={17} /> Albums
              </NavLink>
            </>
          )}
          {user?.role === 'artist' && (
            <NavLink to="/dashboard" className={navClass}>
              <LayoutDashboard size={17} /> Dashboard
            </NavLink>
          )}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-[#1a1a1a] pt-4 mt-4">
          <div className="flex items-center gap-2 px-1 mb-3">
            <div className="w-7 h-7 bg-[#282828] rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.username?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="sm:hidden flex items-center justify-between bg-[#111] border-b border-[#1a1a1a] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1db954] rounded-full flex items-center justify-center">
              <Music2 size={14} className="text-black" />
            </div>
            <span className="font-bold text-white text-sm">Spotify Clone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 capitalize">{user?.role}</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 pb-32">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="sm:hidden fixed bottom-20 left-0 right-0 bg-[#111] border-t border-[#1a1a1a] flex justify-around py-2 z-40">
          {user?.role === 'user' && (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs transition-colors ${
                    isActive ? 'text-[#1db954]' : 'text-gray-400'
                  }`
                }
              >
                <Home size={20} />
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/albums"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs transition-colors ${
                    isActive ? 'text-[#1db954]' : 'text-gray-400'
                  }`
                }
              >
                <Disc3 size={20} />
                <span>Albums</span>
              </NavLink>
            </>
          )}
          {user?.role === 'artist' && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs transition-colors ${
                  isActive ? 'text-[#1db954]' : 'text-gray-400'
                }`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Player bar */}
      <PlayerBar />
    </div>
  );
}
