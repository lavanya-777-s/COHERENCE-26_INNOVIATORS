import { useEffect, useState } from 'react';

export default function AuditorDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading audit dashboard...</div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Audit & Control Dashboard</h1>
          <p className="text-red-100">Auditor: {user.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Risk Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-semibold mb-2">High Risk Items</p>
            <p className="text-4xl font-bold text-red-600">5</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-600 font-semibold mb-2">Medium Risk Items</p>
            <p className="text-4xl font-bold text-yellow-600">3</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-600 font-semibold mb-2">Investigations Completed</p>
            <p className="text-4xl font-bold text-green-600">12</p>
          </div>
        </div>

        {/* Flagged Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Flagged Transactions</h2>
          
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Transaction #{item}</p>
                    <p className="text-sm text-gray-600">Risk Score: 8.{5 + item}/10</p>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Audit Trail</h2>
          
          <div className="space-y-3">
            <p className="text-gray-600">2025-03-05: Budget allocation approved for Health Dept</p>
            <p className="text-gray-600">2025-03-04: Anomaly flagged in Roads Dept spending</p>
            <p className="text-gray-600">2025-03-03: Investigation completed - No fraud found</p>
          </div>
        </div>
      </div>
    </div>
  );
}