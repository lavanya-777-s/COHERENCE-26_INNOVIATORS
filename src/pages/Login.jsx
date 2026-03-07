import axios from 'axios';
import { Building2, Loader, Lock, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [govId, setGovId] = useState('');
  const [pin, setPin] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
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
        if (govId === 'GEID-2025-PUNE' && pin === '123456') {
          // Trigger OTP step instead of direct login
          setShowOtpStep(true);
          setLoading(false);
          // Start countdown
          const interval = setInterval(() => {
            setTimer(t => (t > 0 ? t - 1 : 0));
          }, 1000);
          return () => clearInterval(interval);
        } else {
          setError('Invalid Gov ID or Secret PIN. Try GEID-2025-PUNE / 123456');
          setLoading(false);
          return;
        }
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
        { email, password, role: selectedRole, officerId: govId, pin } // Map govId to officerId
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
      if (!showOtpStep) setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      const fakeUser = {
        id: 'auth-1',
        name: 'Chief Officer',
        email: email,
        role: 'officer'
      };
      localStorage.setItem('token', 'mock_token_officer');
      localStorage.setItem('user', JSON.stringify(fakeUser));
      navigate('/dashboard/official');
    } else {
      setError('Invalid OTP. Use 123456 for the demo.');
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

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
          {!showOtpStep ? (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* ROLE SELECTION */}
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
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* GOV ID INPUT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
                    Gov ID (GEID)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={govId}
                      onChange={(e) => setGovId(e.target.value.toUpperCase())}
                      placeholder="GEID-2025-..."
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-mono"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secret PIN
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••"
                      maxLength={6}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
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
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <Smartphone className="text-blue-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2-Step Verification</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Enter the 6-digit code sent to your registered mobile number ending in **42.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-gray-50 border-2 border-dashed border-gray-300 text-center text-2xl font-black tracking-[1em] py-4 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                Verify & Access Dashboard
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Didn't receive code? {timer > 0 ? (
                    <span className="text-blue-600 font-bold">Resend in {timer}s</span>
                  ) : (
                    <button type="button" onClick={() => setTimer(30)} className="text-blue-600 font-bold hover:underline">Resend Now</button>
                  )}
                </p>
                <button 
                  type="button" 
                  onClick={() => setShowOtpStep(false)}
                  className="text-xs text-gray-400 font-medium hover:text-gray-600 mt-4 underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* PUBLIC LINK */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Are you a citizen?{' '}
              <Link to="/citizen" className="text-blue-600 hover:text-blue-700 font-medium">
                View Public Dashboard
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}