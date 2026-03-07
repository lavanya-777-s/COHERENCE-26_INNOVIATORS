import axios from 'axios';
import { Loader, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('officer'); // Default to officer
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Offline Hackathon Bypass logic
      if ((email === 'official@gov.in' || email === 'officer@gov.in') && password === '12345678') {
        const fakeUser = {
          id: 'auth-1',
          name: 'Chief Officer',
          email: email,
          role: 'officer'
        };
        localStorage.setItem('token', 'mock_token_officer');
        localStorage.setItem('user', JSON.stringify(fakeUser));
        navigate('/dashboard/official'); // Routing to the official dashboard we built
        return;
      }
      
      if (email === 'auditor@gov.in' && password === '12345678') {
        const fakeUser = {
          id: 'auth-2',
          name: 'Lead Auditor',
          email: email,
          role: 'auditor'
        };
        localStorage.setItem('token', 'mock_token_auditor');
        localStorage.setItem('user', JSON.stringify(fakeUser));
        navigate('/dashboard/auditor'); 
        return;
      }

      // Try actual backend if not offline bypassed
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`,
        { email, password, role: selectedRole }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      const userRole = response.data.user.role;
      if (userRole === 'official' || userRole === 'officer') {
        navigate('/dashboard/official');
      } else if (userRole === 'auditor') {
        navigate('/dashboard/auditor');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Note: Use official@gov.in / 12345678 to test.');
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
          
          {/* ROLE SELECTION - ADD THIS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="space-y-2">
              {[
                { value: 'officer', label: 'Government Officer' },
                { value: 'auditor', label: 'Auditor' }
              ].map((role) => (
                <label key={role.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{role.label}</span>
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