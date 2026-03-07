import { Send, X } from 'lucide-react';
import { useState } from 'react';

export default function AllocationModal({ 
  isOpen, 
  onClose, 
  target, 
  type = 'dept', // 'state', 'district', 'dept'
  district,
  onAllocate 
}) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      setMessage({ type: 'error', text: 'Enter valid amount' });
      return;
    }

    const baseAllocated = target?.allocated || target?.allocation || 0;
    const baseSpent = target?.spent || 0;
    const availableFunds = ((baseAllocated - baseSpent) / 10000000).toFixed(1);
    
    if (parseFloat(amount) > parseFloat(availableFunds) && type === 'dept') {
      setMessage({ type: 'error', text: `Amount exceeds available ${type} funds!` });
      return;
    }

    if (!reason.trim()) {
      setMessage({ type: 'error', text: 'Enter reason for allocation' });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const name = target?.name || 'Unknown';
      onAllocate({
        departmentId: target?.id || 'id',
        departmentName: name,
        entityType: type,
        districtName: district?.name || name,
        amount: parseFloat(amount),
        reason: reason,
        date: new Date().toLocaleDateString('en-IN'),
        status: 'pending'
      });

      setMessage({ 
        type: 'success', 
        text: `✅ Budget successfully issued to ${name} for ₹${amount}Cr` 
      });
      
      setTimeout(() => {
        setAmount('');
        setReason('');
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error submitting allocation' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-6 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold">Allocate Budget</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Target Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 font-semibold uppercase">
               Allocating Funds To: {type === 'state' ? 'State Government' : type === 'district' ? 'District Administration' : 'Department'}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">{target?.name}</p>
            {type === 'dept' && (
              <>
                <p className="text-sm text-gray-600 mt-1">Allocated: ₹{((target?.allocated || 0) / 10000000).toFixed(1)}Cr</p>
                <p className="text-sm text-gray-600">Spent: ₹{((target?.spent || 0) / 10000000).toFixed(1)}Cr</p>
              </>
            )}
            {type !== 'dept' && (
               <p className="text-sm text-gray-600 mt-1">Current Outlay: ₹{((target?.allocation || 0) / 10000000).toFixed(1)}Cr</p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Amount to Issue (in Crore ₹)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500"
              className="w-full text-gray-900 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 font-medium focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Reason for Allocation
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this allocation needed?"
              rows="3"
              className="w-full text-gray-900 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 font-medium focus:border-blue-600 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              {loading ? 'Allocating...' : 'Allocate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}