import { useState } from 'react';

export default function ReallocationTab({ departments }) {
  const [reallocateModal, setReallocateModal] = useState(false);
  const [reallocateForm, setReallocateForm] = useState({ from: '', to: '', amount: '' });
  const [reallocations, setReallocations] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const handleReallocate = () => {
    if (!reallocateForm.from || !reallocateForm.to || !reallocateForm.amount) return;
    if (reallocateForm.from === reallocateForm.to) {
      alert('From and To department cannot be same!');
      return;
    }
    const entry = {
      ...reallocateForm,
      date: new Date().toLocaleDateString(),
      id: Date.now()
    };
    setReallocations([...reallocations, entry]);
    setReallocateModal(false);
    setReallocateForm({ from: '', to: '', amount: '' });
    setSuccessMsg(`✅ ₹${entry.amount}L reallocated from ${entry.from} to ${entry.to}`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const underutilized = departments.filter(d => d.status === 'warning');

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">🔄 Fund Reallocation</h2>
        <button
          onClick={() => setReallocateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + New Reallocation
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">
          {successMsg}
        </div>
      )}

      {/* Underutilized Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-yellow-800 font-semibold mb-2">⚠️ Underutilized Departments (Fund Lapse Risk)</p>
        {underutilized.length === 0
          ? <p className="text-sm text-yellow-700">No underutilized departments currently</p>
          : underutilized.map((d, idx) => (
            <p key={idx} className="text-sm text-yellow-700">
              • {d.name}: Only {d.percentage}% utilized — ₹{d.budget - d.spent}L at risk of lapse
            </p>
          ))
        }
      </div>

      {/* Reallocation History */}
      {reallocations.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">📋 Reallocation History</h3>
          <div className="space-y-2">
            {reallocations.map((r) => (
              <div key={r.id} className="flex justify-between items-center bg-blue-50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.from} → {r.to}</p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
                <span className="text-blue-600 font-bold">₹{r.amount}L</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">No reallocations done yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click "New Reallocation" to shift funds</p>
        </div>
      )}

      {/* Modal */}
      {reallocateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 New Fund Reallocation</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">From Department</label>
                <select
                  value={reallocateForm.from}
                  onChange={e => setReallocateForm({...reallocateForm, from: e.target.value})}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">To Department</label>
                <select
                  value={reallocateForm.to}
                  onChange={e => setReallocateForm({...reallocateForm, to: e.target.value})}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Amount (in Lakhs)</label>
                <input
                  type="number"
                  value={reallocateForm.amount}
                  onChange={e => setReallocateForm({...reallocateForm, amount: e.target.value})}
                  placeholder="e.g. 50"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleReallocate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                Confirm Reallocation
              </button>
              <button onClick={() => setReallocateModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}