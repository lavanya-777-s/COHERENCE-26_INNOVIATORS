export default function DepartmentsTab({ departments }) {

  const exportCSV = () => {
    const rows = [
      ['Department', 'Allocated (L)', 'Spent (L)', 'Utilization %', 'Risk Score', 'Status'],
      ...departments.map(d => [d.name, d.budget, d.spent, d.percentage, d.riskScore, d.status])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget_report.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">🏛️ Department Status</h2>
        <button
          onClick={exportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          📥 Export CSV
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {departments.map((dept, idx) => (
          <div key={idx} className={`border rounded-xl p-5 ${
            dept.status === 'anomaly' ? 'bg-red-50 border-red-200' :
            dept.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{dept.name}</h3>
                <p className="text-sm text-gray-600">₹{dept.spent}L spent / ₹{dept.budget}L allocated</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{dept.riskScore}
                  <span className="text-sm text-gray-500">/10</span>
                </p>
                <p className="text-xs text-gray-500">Risk Score</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className={`h-3 rounded-full ${
                dept.status === 'anomaly' ? 'bg-red-500' :
                dept.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
              }`} style={{ width: `${Math.min(dept.percentage, 100)}%` }}></div>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">{dept.percentage}% utilized</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                dept.status === 'anomaly' ? 'bg-red-100 text-red-700' :
                dept.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {dept.status === 'anomaly' ? '🚨 Anomaly' :
                 dept.status === 'warning' ? '⚠️ Warning' : '✅ Normal'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}