import { AlertCircle, BarChart3, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function CitizenPublicDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/budget/public`)
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-white">
        <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Hero */}
      <section className="py-10 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Where Did My Taxes Go?</h1>
        <p className="text-blue-100">Transparent Budget Tracking for Every Citizen</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center gap-4">
            <BarChart3 className="text-blue-600" size={32} />
            <div>
              <p className="text-gray-500 text-sm">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{data?.totalBudget}L</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center gap-4">
            <TrendingUp className="text-green-600" size={32} />
            <div>
              <p className="text-gray-500 text-sm">Amount Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{data?.spent}L</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center gap-4">
            <Users className="text-purple-600" size={32} />
            <div>
              <p className="text-gray-500 text-sm">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data?.utilizationRate}%</p>
            </div>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">📊 Department-Wise Spending</h2>
          <div className="space-y-4">
            {data?.departments.map((dept, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <span className="text-gray-500 text-sm">₹{dept.spent}L / ₹{dept.allocated}L</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${dept.percentage > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-green-500'}`}
                    style={{ width: `${Math.min(dept.percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {dept.percentage}% spent
                  {dept.percentage > 100 && <span className="text-red-600 font-bold ml-2">⚠️ Over Budget!</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Transactions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">⚠️ Flagged Transactions</h2>
          <div className="space-y-3">
            {data?.leakages.map((leak, idx) => (
              <div key={idx} className={`border-l-4 p-4 rounded flex items-start gap-3 ${
                leak.risk === 'High' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
              }`}>
                <AlertCircle className={leak.risk === 'High' ? 'text-red-500' : 'text-yellow-500'} size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{leak.department} — {leak.project}</p>
                  <p className="text-sm text-gray-600">Overspent: ₹{leak.amount}K</p>
                  <span className={`text-xs font-bold ${leak.risk === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {leak.risk} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💬 Share Your Feedback</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Your Name (Optional)"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
            <input type="email" placeholder="Your Email (Optional)"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
            <textarea placeholder="Tell us about budget spending in your area..." rows="4"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 resize-none"></textarea>
            <button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition">
              Submit Feedback
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-gray-500 text-sm mt-8">
        © 2025 Budget Intelligence Platform
      </footer>
    </div>
  );
}