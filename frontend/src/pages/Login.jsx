import axios from 'axios';
import { Loader, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('official'); // ADD THIS
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`,
        { email, password, role: selectedRole } // ADD role
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // ADD THIS - Role-based redirect
      const userRole = response.data.user.role;
      if (userRole === 'official') {
        navigate('/dashboard/official');
      } else if (userRole === 'auditor') {
        navigate('/dashboard/auditor');
      } else if (userRole === 'analyst') {
        navigate('/dashboard/analyst');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Budget Intelligence Platform
          </h1>
          <p className="text-gray-600">Government Login</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg space-y-6">
          
          {/* ROLE SELECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Official Portal Access (Select Role):
            </label>
            <div className="space-y-3">
              {[
                { value: 'official', label: 'Government Central Authority', desc: 'Allocate funds to states & districts' },
                { value: 'auditor', label: 'Financial Auditor', desc: 'Review anomalies and transactions' }
              ].map((role) => (
                <label key={role.value} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRole === role.value 
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm shadow-indigo-100' 
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-4 h-4 text-indigo-600 mt-1"
                  />
                  <div>
                    <span className={`block font-bold ${selectedRole === role.value ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {role.label}
                    </span>
                    <span className="block text-xs font-medium text-slate-500 mt-0.5">
                      {role.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* EMAIL INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="official@gov.in"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* PUBLIC LINK */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Are you a citizen?{' '}
              <Link to="/citizen" className="text-blue-600 hover:text-blue-700 font-medium">
                View Public Dashboard
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}