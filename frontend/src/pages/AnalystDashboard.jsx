import { useEffect, useState } from 'react';

export default function AnalystDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Budget Analyst Dashboard</h1>
          <p className="text-purple-100">
            {user.name} ({user.department})
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Department Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">Department: {user.department}</p>
              <p className="text-gray-600 mb-2">Budget Allocated: ₹2,500 Cr</p>
              <p className="text-gray-600 mb-2">Amount Spent: ₹1,500 Cr</p>
              <p className="text-gray-600 mb-2">Utilization: 60%</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mb-2">
                Request Reallocation
              </button>
              <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-600 px-4 py-2 rounded">
                View Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Spending Forecast */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending Forecast</h2>
          <p className="text-gray-600">Budget will be fully utilized by: September 2025</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div className="bg-purple-600 h-4 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}