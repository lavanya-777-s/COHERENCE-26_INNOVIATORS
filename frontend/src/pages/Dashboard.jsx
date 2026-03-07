import { BarChart3, Building2, Calendar, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Main Content - NO NAVBAR HERE (Navbar in App.js handles it) */}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white mb-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}! 👋</h2>
          <p className="text-blue-100">You are successfully logged into Smart Governance Platform</p>
        </div>

        {/* User Info & Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="text-blue-600" size={24} />
              Citizen Profile
            </h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Full Name</p>
                  <p className="text-gray-900 font-semibold">{user.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email Address</p>
                  <p className="text-gray-900 font-semibold">{user.email}</p>
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Member Since</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={24} />
              Account Overview
            </h3>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-600 text-sm">Verification Status</p>
                <p className="text-green-600 font-semibold text-lg">✓ Verified</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm">Account Status</p>
                <p className="text-blue-600 font-semibold text-lg">Active</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-gray-600 text-sm">Access Level</p>
                <p className="text-purple-600 font-semibold text-lg">Citizen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h3>
          <p className="text-gray-600 mb-6">
            Access a range of government services and features through this platform.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 p-4 rounded-lg transition text-left hover:shadow-md">
              <h4 className="text-gray-900 font-semibold mb-2">📋 File Applications</h4>
              <p className="text-gray-600 text-sm">Submit government applications online</p>
            </button>
            <button className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 p-4 rounded-lg transition text-left hover:shadow-md">
              <h4 className="text-gray-900 font-semibold mb-2">📊 Track Status</h4>
              <p className="text-gray-600 text-sm">Monitor your application progress in real-time</p>
            </button>
            <button className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-400 p-4 rounded-lg transition text-left hover:shadow-md">
              <h4 className="text-gray-900 font-semibold mb-2">📄 Documents</h4>
              <p className="text-gray-600 text-sm">Access and manage your digital documents</p>
            </button>
            <button className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:border-orange-400 p-4 rounded-lg transition text-left hover:shadow-md">
              <h4 className="text-gray-900 font-semibold mb-2">💬 Support</h4>
              <p className="text-gray-600 text-sm">Get help from support center 24/7</p>
            </button>
            <button className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 hover:border-red-400 p-4 rounded-lg transition text-left hover:shadow-md">
              <h4 className="text-gray-900 font-semibold mb-2">📢 Announcements</h4>
              <p className="text-gray-600 text-sm">Stay updated with latest government news</p>
            </button>
            <button className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:border-indigo-400 p-4 rounded-lg transition text-left hover:shadow-md">
              <h4 className="text-gray-900 font-semibold mb-2">🏛️ Services</h4>
              <p className="text-gray-600 text-sm">Explore all available government services</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}