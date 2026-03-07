import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function OverviewTab({ summary, departments, anomalies, setActiveTab }) {
  return (
    <div>
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-xs mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">₹{summary.totalBudget}L</p>
            <p className="text-xs text-gray-400 mt-1">Fiscal Year 2024-25</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-xs mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.spent}L</p>
            <p className="text-xs text-gray-400 mt-1">{summary.utilizationRate}% utilized</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-xs mb-1">Remaining</p>
            <p className="text-2xl font-bold text-blue-600">₹{summary.totalBudget - summary.spent}L</p>
            <p className="text-xs text-gray-400 mt-1">Available funds</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-xs mb-1">At Risk</p>
            <p className="text-2xl font-bold text-red-600">₹{summary.atRisk}L</p>
            <p className="text-xs text-gray-400 mt-1">{anomalies.length} anomalies</p>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Allocation vs Spent</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(val) => `₹${val}L`} />
            <Legend />
            <Bar dataKey="budget" name="Allocated" fill="#3B82F6" radius={[4,4,0,0]} />
            <Bar dataKey="spent" name="Spent" fill="#10B981" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Alert Banner */}
      {anomalies.length > 0 && (
        <div
          className="bg-red-50 border border-red-200 rounded-xl p-4 cursor-pointer hover:bg-red-100 transition"
          onClick={() => setActiveTab('anomalies')}
        >
          <p className="text-red-700 font-semibold">
            🚨 {anomalies.length} anomalies detected! Click here to view details →
          </p>
        </div>
      )}
    </div>
  );
}