import { AlertCircle, ArrowLeftRight, Building2, ChevronDown, Download, History, LayoutDashboard, Plus, Search, LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllocationModal from '../components/AllocationModal';
import { STATIC_DATA, analyzeAnomalies } from '../data/budgetStaticData';
import ReallocationTab from '../components/ReallocationTab';
import FundTrackerTab from '../components/FundTrackerTab';
import Chatbot from '../components/Chatbot';
import RegionalAnalytics from '../components/RegionalAnalytics';
import { Network } from 'lucide-react';

export default function OfficialDashboard() {
  const [selectedState, setSelectedState] = useState('mh');
  const [selectedDistrict, setSelectedDistrict] = useState('mh-pune');
  const [expandedDept, setExpandedDept] = useState(null);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [allocationTarget, setAllocationTarget] = useState({ target: null, type: 'dept' });
  const [allocations, setAllocations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentState = STATIC_DATA.states.find(s => s.id === selectedState);
  const currentDistrict = currentState?.districts.find(d => d.id === selectedDistrict);

  // Calculate stats
  const stats = useMemo(() => {
    if (!currentDistrict) return null;
    
    const baseAllocated = currentDistrict.allocation;
    const baseSpent = currentDistrict.spent;
    
    // Add up runtime allocations made in this session
    const runtimeAllocatedTotal = allocations.reduce((sum, alloc) => sum + (alloc.amount * 10000000), 0);
    
    const allocated = baseAllocated;
    const spent = baseSpent + runtimeAllocatedTotal;
    const remaining = allocated - spent;
    const utilization = Math.round((spent / allocated) * 100);

    let anomalies = [];
    currentDistrict.departments.forEach(dept => {
      const analysis = analyzeAnomalies(dept);
      if (analysis.alert) {
        anomalies.push({ ...analysis, dept: dept.name, type: 'dept' });
      }
    });

    return { allocated, spent, remaining, utilization, anomalies };
  }, [currentDistrict]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAllocate = (allocationData) => {
    // Adding the allocation so it shows up in history immediately
    setAllocations(prev => [{
      id: prev.length + 1,
      ...allocationData,
      status: 'Success'
    }, ...prev]);
  };

  const openAllocationModal = (target, type = 'dept') => {
    setAllocationTarget({ target, type });
    setAllocationModalOpen(true);
  };

  if (!currentState || !currentDistrict || !stats) return null;

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tracer', label: 'Fund Flow Tracer', icon: Network },
    { id: 'allocate', label: 'Department Allocation', icon: ArrowLeftRight },
    { id: 'reallocation', label: 'Reallocation AI', icon: Plus },
    { id: 'history', label: 'Transaction History', icon: History },
    { id: 'reports', label: 'Reports', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Dashboard Page Header - Fused with Navbar */}
      <div className="bg-white border-b border-slate-200 shadow-sm pt-4 pb-2 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Central Allocation Dashboard
                </h1>
                <p className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-2">
                  <Building2 size={18} className="text-indigo-500" /> Welcome back, {user.name} ({user.role})
                </p>
              </div>

              {/* Mobile Logout Button (Visible only on small screens) */}
              <button
                onClick={handleLogout}
                className="lg:hidden flex items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-700 p-2.5 rounded-xl transition-colors ml-4"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
            
            {/* Context Selectors and Desktop Logout */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const newState = STATIC_DATA.states.find(s => s.id === e.target.value);
                    setSelectedDistrict(newState?.districts[0]?.id || '');
                  }}
                  className="appearance-none w-full sm:w-40 md:w-48 pl-4 pr-10 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  {STATIC_DATA.states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-3 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="appearance-none w-full sm:w-40 md:w-48 pl-4 pr-10 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  {currentState?.districts.map(district => (
                    <option key={district.id} value={district.id}>{district.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-3 text-slate-500 pointer-events-none" />
              </div>

              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-rose-200 hover:-translate-y-0.5 ml-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Premium Tabs Navigation */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-8 pb-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* --- TAB: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-indigo-50 p-2.5 rounded-lg">
                    <span className="text-xl">🏛️</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">FY 24-25</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Parliament Budget</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{(stats.allocated / 10000000).toFixed(1)}<span className="text-sm text-slate-500 ml-1">Cr</span></p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-emerald-50 p-2.5 rounded-lg">
                    <span className="text-xl">📈</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">{stats.utilization}% Utilized</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Funds Released</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{(stats.spent / 10000000).toFixed(1)}<span className="text-sm text-slate-500 ml-1">Cr</span></p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-violet-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-violet-50 p-2.5 rounded-lg">
                    <span className="text-xl">🏦</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Remaining Balance</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{(Math.abs(stats.remaining) / 10000000).toFixed(1)}<span className="text-sm text-slate-500 ml-1">Cr</span></p>
              </div>

              <div className="bg-rose-50 rounded-xl p-5 border border-rose-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-rose-200/50 p-2.5 rounded-lg">
                    <AlertCircle className="text-rose-700" size={20} />
                  </div>
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">Alerts</span>
                </div>
                <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">Critical Anomalies</p>
                <p className="text-2xl font-bold text-rose-700 tracking-tight">{stats.anomalies.length}</p>
              </div>
            </div>

            {/* Main Progress Chart Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Macro Budget Utilization</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Status of allocations vs actual expenditures</p>
                </div>
                <button 
                  onClick={() => setActiveTab('allocate')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus size={16} strokeWidth={2.5}/> Allocate New Funds
                </button>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-4xl font-extrabold text-slate-800">{stats.utilization}% <span className="text-base font-semibold text-slate-400">Deployed</span></span>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full tracking-wide">ON TRACK</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden p-1 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${Math.min(stats.utilization, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Graph / Regional Heatmap */}
            <RegionalAnalytics currentState={currentState} />

            {/* Critical Alerts Highlights */}
            {stats.anomalies.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-200 border-l-4 border-l-rose-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-rose-100 p-1.5 rounded text-rose-600">
                    <AlertCircle size={18} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Priority Review Required</h2>
                  <span className="ml-auto bg-rose-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                    {stats.anomalies.length} Flags
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stats.anomalies.slice(0, 4).map((anomaly, idx) => (
                    <div key={idx} className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 hover:border-rose-300 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 text-sm">
                            {anomaly.type === 'project' ? `${anomaly.project} (${anomaly.dept})` : anomaly.dept}
                          </p>
                          <p className="text-xs font-medium text-slate-600 mt-1">{anomaly.alert}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm ${
                            anomaly.risk === 'high' ? 'bg-rose-600' :
                            anomaly.risk === 'medium' ? 'bg-amber-500' :
                            'bg-orange-500'
                          }`}>
                            {anomaly.variancePercent.toFixed(1)}% Var
                          </span>
                          <button className="text-indigo-600 text-sm font-bold hover:underline">Investigate →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: ALLOCATE FUNDS --- */}
        {activeTab === 'allocate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Department Disbursements</h2>
                <p className="text-slate-500 font-medium mt-1">Review department requirements and allocate funds securely</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                
                {/* Search / Filter (Mock) */}
                <div className="lg:col-span-2 relative mb-2">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Search className="h-5 w-5 text-slate-400" />
                   </div>
                   <input type="text" placeholder="Search departments by name..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700" />
                </div>

                {currentDistrict.departments.map((dept, idx) => {
                  
                  // Calculate new spent amount incorporating current session allocations
                  const runtimeDeptAllocations = allocations
                    .filter(a => a.departmentId === dept.id)
                    .reduce((sum, a) => sum + (a.amount * 10000000), 0);
                    
                  const newSpent = dept.spent + runtimeDeptAllocations;  
                  const percent = Math.min((newSpent / dept.allocated) * 100, 100);
                  const isCritical = percent > 90;
                  
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCritical ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                            {percent.toFixed(0)}% Used
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Allocated</p>
                             <p className="text-lg font-bold text-slate-800">₹{(dept.allocated / 10000000).toFixed(1)}Cr</p>
                           </div>
                           <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Spent</p>
                             <p className="text-lg font-bold text-slate-800">₹{(newSpent / 10000000).toFixed(1)}Cr</p>
                           </div>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-2 text-right">Available: ₹{((dept.allocated - newSpent) / 10000000).toFixed(1)}Cr</p>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button
                          onClick={() => openAllocationModal({ ...dept, spent: newSpent })}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 group"
                        >
                          <Plus size={18} className="transition-transform group-hover:scale-125" />
                          Issue New Tranche
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: HISTORY --- */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[400px]">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Allocations</h2>
                <p className="text-slate-500 font-medium mt-1">Audit log of all funds disbursed during your session</p>
              </div>

              {allocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-slate-50 p-6 rounded-full border-2 border-dashed border-slate-200 mb-4">
                    <History size={48} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Allocations Yet</h3>
                  <p className="text-slate-500 max-w-sm">You haven't made any budget allocations during this session. Switch to the Allocate Funds tab to begin.</p>
                  <button onClick={() => setActiveTab('allocate')} className="mt-6 text-indigo-600 font-bold hover:underline">Go to Allocations →</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {allocations.slice().reverse().map((alloc) => (
                    <div key={alloc.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 p-3 rounded-xl">
                          <ArrowLeftRight size={24} className="text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{alloc.departmentName}</p>
                          <p className="text-sm font-medium text-slate-600 mt-1 max-w-xl">{alloc.reason}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs font-bold text-slate-400">ID: TXN-BGT-{String(alloc.id).padStart(4, '0')}</span>
                            <span className="text-xs font-bold text-slate-400">📅 {alloc.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end md:items-end justify-center">
                        <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">+₹{alloc.amount}Cr</p>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mt-2 shadow-sm border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Settled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB: REPORTS --- */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports & Audits</h2>
                <p className="text-slate-500 font-medium mt-1">Download comprehensive reports for governance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Full Utilization Report FY24", desc: "Detailed breakdown of all department spends", type: "PDF" },
                  { name: "Anomaly Audit Log", desc: "List of all critical alerts and overspends", type: "CSV" },
                  { name: "Predictive Forecasting", desc: "AI-generated budget requirement for FY25", type: "XLSX" }
                ].map((report, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Download size={20} />
                        </div>
                        <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">{report.type}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{report.name}</h3>
                      <p className="text-sm font-medium text-slate-500 mt-2">{report.desc}</p>
                    </div>
                    <button 
                      onClick={() => alert(`Starting download for: ${report.name} (${report.type})`)}
                      className="mt-6 w-full text-center text-sm font-bold text-indigo-600 bg-white border border-indigo-200 py-2.5 rounded-xl group-hover:bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      Download Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: FUND TRACER --- */}
        {activeTab === 'tracer' && (
          <FundTrackerTab 
             states={STATIC_DATA.states} 
             onAllocate={({ type, target }) => openAllocationModal(target, type)} 
          />
        )}

        {/* --- TAB: REALLOCATION AI --- */}
        {activeTab === 'reallocation' && (
          <ReallocationTab district={currentDistrict} />
        )}

      </div>

      {/* Allocation Modal Popup */}
      <AllocationModal
        isOpen={allocationModalOpen}
        onClose={() => setAllocationModalOpen(false)}
        target={allocationTarget.target || {}}
        type={allocationTarget.type}
        district={currentDistrict}
        onAllocate={handleAllocate}
      />

      {/* Floating Lumina AI Chatbot */}
      <Chatbot district={currentDistrict} />
    </div>
  );
}