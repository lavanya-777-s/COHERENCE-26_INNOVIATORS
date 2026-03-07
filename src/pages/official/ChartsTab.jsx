import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ChartsTab({ departments, monthlyData }) {
  const pieData = departments.map(d => ({ name: d.name, value: d.budget }));

  return (
    <div className="space-y-6">

      {/* Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Allocation vs Spent</h2>
        <ResponsiveContainer width="100%" height={320}>
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

      {/* Pie Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🥧 Budget Distribution</h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%" cy="50%"
              outerRadius={120}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `₹${val}L`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Line Chart */}
      {monthlyData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📈 Monthly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(val) => `₹${val}L`} />
              <Legend />
              <Line type="monotone" dataKey="allocated" name="Allocated" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spent" name="Spent" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}