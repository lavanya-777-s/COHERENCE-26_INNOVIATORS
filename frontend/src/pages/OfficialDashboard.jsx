import { useEffect, useState } from 'react';
import AlertsTab from './official/AlertsTab';
import ChartsTab from './official/ChartsTab';
import DepartmentsTab from './official/DepartmentsTab';
import OverviewTab from './official/OverviewTab';
import ReallocationTab from './official/ReallocationTab';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function OfficialDashboard() {
<<<<<<< Updated upstream
  const [summary, setSummary] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
=======
  const [selectedState, setSelectedState] = useState(STATIC_DATA.states[0]?.id || '');
  const [selectedDistrict, setSelectedDistrict] = useState(STATIC_DATA.states[0]?.districts[0]?.id || '');
  const [expandedDept, setExpandedDept] = useState(null);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [allocationTarget, setAllocationTarget] = useState({ target: null, type: 'dept' });
  const [allocations, setAllocations] = useState([]);
>>>>>>> Stashed changes
  const [activeTab, setActiveTab] = useState('overview');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [summaryRes, deptRes, anomalyRes, monthlyRes] = await Promise.all([
          fetch(`${API}/budget/summary`, { headers }),
          fetch(`${API}/budget/departments`, { headers }),
          fetch(`${API}/budget/anomalies`, { headers }),
          fetch(`${API}/budget/monthly`, { headers })
        ]);
        setSummary(await summaryRes.json());
        const deptData = await deptRes.json();
        setDepartments(Array.isArray(deptData) ? deptData : []);
        const anomalyData = await anomalyRes.json();
        setAnomalies(Array.isArray(anomalyData) ? anomalyData : []);
        const monthlyD = await monthlyRes.json();
        setMonthlyData(Array.isArray(monthlyD) ? monthlyD : []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-xl text-gray-600 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'departments', label: '🏛️ Departments' },
    { id: 'charts', label: '📈 Charts' },
    { id: 'anomalies', label: `🚨 Alerts (${anomalies.length})` },
    { id: 'reallocation', label: '🔄 Reallocation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">💰 Budget Intelligence Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Welcome, {user.name} | Role: Official</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

<<<<<<< Updated upstream
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            summary={summary}
            departments={departments}
            anomalies={anomalies}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'departments' && (
          <DepartmentsTab departments={departments} />
        )}
        {activeTab === 'charts' && (
          <ChartsTab departments={departments} monthlyData={monthlyData} />
        )}
        {activeTab === 'anomalies' && (
          <AlertsTab anomalies={anomalies} />
        )}
        {activeTab === 'reallocation' && (
          <ReallocationTab departments={departments} />
        )}
      </div>
=======
      {/* Allocation Modal Popup */}
      <AllocationModal
        isOpen={allocationModalOpen}
        onClose={() => setAllocationModalOpen(false)}
        target={allocationTarget.target || {}}
        type={allocationTarget.type}
        district={currentDistrict}
        onAllocate={handleAllocate}
      />

      {/* Floating Predictor AI Chatbot */}
      <Chatbot district={currentDistrict} />
>>>>>>> Stashed changes
    </div>
  );
}