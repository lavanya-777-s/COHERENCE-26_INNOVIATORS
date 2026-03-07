export default function AlertsTab({ anomalies }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-5">🚨 Critical Alerts — Leakage Detected</h2>

      {anomalies.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-600 font-semibold text-lg">✅ No anomalies detected!</p>
          <p className="text-gray-500 text-sm mt-1">All departments are within budget</p>
        </div>
      ) : (
        <div className="space-y-4">
          {anomalies.map((a, idx) => (
            <div key={idx} className="bg-white border-l-4 border-red-500 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900 text-lg">{a.department} — {a.project}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {a.district} &nbsp;|&nbsp; 📅 {a.month}
                  </p>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    <span className="text-sm text-gray-600">
                      Allocated: <strong>₹{a.allocated}K</strong>
                    </span>
                    <span className="text-sm text-gray-600">
                      Spent: <strong className="text-red-600">₹{a.spent}K</strong>
                    </span>
                    <span className="text-sm text-red-600 font-bold">
                      Overspent: ₹{a.overBy}K
                    </span>
                  </div>
                  <p className="text-xs text-red-600 font-medium mt-2 bg-red-50 px-2 py-1 rounded inline-block">
                    {a.reason}
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-3xl font-bold text-red-600">{a.riskScore}</p>
                  <p className="text-xs text-gray-500">Risk Score</p>
                  <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    🔍 Investigate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}