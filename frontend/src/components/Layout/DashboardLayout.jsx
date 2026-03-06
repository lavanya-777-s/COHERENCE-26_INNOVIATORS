import { AlertCircle, BarChart3, FileText, Home, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Overview', href: '/dashboard/official' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: AlertCircle, label: 'Alerts', href: '/dashboard/alerts' },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col fixed h-screen z-40 shadow-2xl`}>
        
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h1 className="text-sm font-bold">Budget Intel</h1>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                location.pathname === item.href
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700 space-y-4">
          {sidebarOpen && (
            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-400 font-semibold">LOGGED IN AS</p>
              <p className="font-bold text-white mt-1">{user.name}</p>
              <p className="text-xs text-slate-400 mt-1 capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold text-sm"
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col transition-all duration-300`}>
        
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Smart Governance Budget Platform</h2>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}