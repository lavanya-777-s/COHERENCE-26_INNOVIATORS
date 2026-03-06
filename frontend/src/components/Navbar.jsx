import { Home, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Completely hide this global navbar when on any dashboard
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center text-left">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-3xl">💰</span>
          <span className="text-xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            Budget Intelligence
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {!token ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </Link>
              <Link to="/citizen" className="text-gray-700 hover:text-blue-600 font-medium">
                Public Dashboard
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Government Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200">
                <span className="text-slate-700 text-sm font-bold">
                  {user.name} <span className="text-slate-400 font-medium">({user.role})</span>
                </span>
                <div className="w-px h-5 bg-slate-300"></div>
                <Link
                  to={
                    user.role === 'official'
                      ? '/dashboard/official'
                      : user.role === 'auditor'
                      ? '/dashboard/auditor'
                      : '/dashboard/analyst'
                  }
                  className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors"
                >
                  <Home size={16} />
                  Dashboard
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-rose-200 hover:-translate-y-0.5"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}