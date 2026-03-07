import axios from 'axios';
import { Building2, Loader, Lock, Mail, User, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [govId, setGovId] = useState('');
  const [pin, setPin] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [accessToken, setAccessToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('officer'); // default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!govId.startsWith('GEID-')) {
      setError('Gov ID must start with GEID-');
      return;
    }

    if (pin.length !== 6) {
      setError('Secret PIN must be exactly 6 digits');
      return;
    }

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setShowOtpStep(true);
      setLoading(false);
      const interval = setInterval(() => {
        setTimer(t => (t > 0 ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }, 1500);
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Invalid OTP. Use 123456 for the demo.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`,
        { 
          name, 
          email, 
          phone,
          password,
          role,
          officerId: govId, // Map govId to officerId for backend
          pin,
          accessToken,
          ministry: role === 'officer' ? department : 'Auditor General' // Map department to ministry
        }
      );

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
          <p className="text-gray-600">Government Staff Registration</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
          {!showOtpStep ? (
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm transition-all animate-in fade-in">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* EMAIL & PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="official@gov.in"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ROLE SELECTION */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="officer">Officer</option>
                    <option value="auditor">Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gov ID (GEID)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={govId}
                      onChange={(e) => setGovId(e.target.value.toUpperCase())}
                      placeholder="GEID-..."
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* DEPARTMENT & ACCESS TOKEN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {role === 'officer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                        required
                      >
                        <option value="">Select Dept</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Roads">Roads</option>
                        <option value="Water">Water</option>
                        <option value="Energy">Energy</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className={role !== 'officer' ? 'col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Token
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="AUTH-..."
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECRET PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Governance PIN (6-digits)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••"
                    maxLength={6}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* REGISTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Request OTP'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinalRegister} className="space-y-6 animate-in slide-in-from-right-5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <Smartphone className="text-green-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Verify Your Phone</h2>
                <p className="text-sm text-gray-500 mt-2">
                  We've sent a verification code to <strong>{phone}</strong>
                </p>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
              {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">{success}</div>}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-gray-50 border-2 border-dashed border-gray-300 text-center text-2xl font-black tracking-[1em] py-4 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : 'Confirm & Create Account'}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Didn't receive code? {timer > 0 ? (
                    <span className="text-green-600 font-bold">Resend in {timer}s</span>
                  ) : (
                    <button type="button" onClick={() => setTimer(30)} className="text-green-600 font-bold hover:underline">Resend Now</button>
                  )}
                </p>
                <button 
                  type="button" 
                  onClick={() => setShowOtpStep(false)}
                  className="text-xs text-gray-400 font-medium hover:text-gray-600 mt-4 underline"
                >
                  Edit Registration Details
                </button>
              </div>
            </form>
          )}

          {/* LOGIN LINK */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}