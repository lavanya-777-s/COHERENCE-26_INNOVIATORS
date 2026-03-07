import { AlertCircle, BarChart3, TrendingUp, Users, ChevronDown, MapPin, Search, ShieldAlert } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { STATIC_DATA, analyzeAnomalies } from '../data/budgetStaticData';

export default function CitizenPublicDashboard() {
  const [selectedState, setSelectedState] = useState(STATIC_DATA.states[0]?.id || '');
  const [selectedDistrict, setSelectedDistrict] = useState(STATIC_DATA.states[0]?.districts[0]?.id || '');

  const [globalLeakages, setGlobalLeakages] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-update district when state changes
  useEffect(() => {
    const s = STATIC_DATA.states.find(st => st.id === selectedState);
    if (s && s.districts.length > 0) {
      setSelectedDistrict(s.districts[0].id);
    }
  }, [selectedState]);

  // Extract Global Leakages ONCE
  useEffect(() => {
    const allAnomalies = [];
    STATIC_DATA.states.forEach(s => {
      s.districts.forEach(d => {
        d.departments.forEach(dept => {
          const analysis = analyzeAnomalies(dept);
          if (analysis.alert) {
            allAnomalies.push({
              department: dept.name,
              project: `${d.name} Region`,
              amount: Math.round(Math.abs(analysis.variance) / 100000).toLocaleString() + 'L',
              risk: analysis.risk === 'high' ? 'High' : (analysis.risk === 'medium' ? 'Medium' : 'Low'),
              variancePercent: analysis.variancePercent
            });
          }
        });
      });
    });
    allAnomalies.sort((a, b) => b.variancePercent - a.variancePercent);
    setGlobalLeakages(allAnomalies.slice(0, 5));
  }, []);

  const currentState = STATIC_DATA.states.find(s => s.id === selectedState);
  const currentDistrict = currentState?.districts.find(d => d.id === selectedDistrict);

  // Compute local stats based ONLY on the selected district
  const localStats = useMemo(() => {
    if (!currentDistrict) return null;
    let totalAlloc = currentDistrict.allocation;
    let totalSpent = currentDistrict.spent;
    
    // Safety check format
    if(!totalAlloc) {
         totalAlloc = currentDistrict.departments.reduce((sum, d) => sum + d.allocated, 0);
         totalSpent = currentDistrict.departments.reduce((sum, d) => sum + d.spent, 0);
    }

    const utilizationRate = totalAlloc > 0 ? ((totalSpent / totalAlloc) * 100).toFixed(1) : 0;

    const formattedDepartments = currentDistrict.departments.map(dept => {
      const percentage = dept.allocated > 0 ? Math.round((dept.spent / dept.allocated) * 100) : 0;
      return {
        name: dept.name,
        allocated: Math.round(dept.allocated / 100000), // L format
        spent: Math.round(dept.spent / 100000),
        percentage
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Extract raw projects for citizens to trace
    const localProjects = currentDistrict.departments.flatMap(dept => 
      dept.projects.map(p => ({ ...p, department: dept.name }))
    );

    return { totalAlloc, totalSpent, utilizationRate, departments: formattedDepartments, localProjects };
  }, [currentDistrict]);

  const handleFlagGhostProject = (projectName) => {
    setToastMessage(`🚨 Report for "${projectName}" sent to Auditor Hub anonymously.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  if (!localStats) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white pb-20 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-full shadow-2xl shadow-rose-900/50 flex items-center gap-3 animate-in slide-in-from-top-10 fade-in duration-300 font-bold border border-rose-400">
           <ShieldAlert size={20} />
           {toastMessage}
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-500/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs tracking-wider border border-indigo-500/30 mb-4 uppercase">Direct Public Oversight</span>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Know Your Taxes.</h1>
                <p className="text-indigo-200 text-lg max-w-xl font-medium">Transparent budget tracking for every citizen. View exactly where funds are deployed in your home district down to the project level.</p>
            </div>
            
            {/* Location Selectors */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
               <div className="flex items-center gap-3 mb-4 text-indigo-300">
                  <MapPin size={20} />
                  <h3 className="font-bold">Select Your Local Area</h3>
               </div>
               
               <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">State / Region</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl font-bold text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                    >
                      {STATIC_DATA.states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 bottom-3.5 text-slate-500 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">District / City</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl font-bold text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                    >
                      {currentState?.districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 bottom-3.5 text-slate-500 pointer-events-none" />
                  </div>
               </div>
            </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex items-center gap-3 mb-6 px-1">
           <h2 className="text-xl font-bold text-slate-900">Live Numbers for {currentDistrict?.name}</h2>
           <span className="flex h-3 w-3 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
           </span>
        </div>

        {/* Local Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:border-indigo-300 transition-colors">
            <div className="bg-indigo-50 p-3.5 rounded-xl">
               <BarChart3 className="text-indigo-600" size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Allocated Budget</p>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">₹{(localStats.totalAlloc/10000000).toFixed(2)}Cr</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:border-emerald-300 transition-colors">
            <div className="bg-emerald-50 p-3.5 rounded-xl">
               <TrendingUp className="text-emerald-600" size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fund Disbursed</p>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">₹{(localStats.totalSpent/10000000).toFixed(2)}Cr</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:border-violet-300 transition-colors">
            <div className="bg-violet-50 p-3.5 rounded-xl">
               <Users className="text-violet-600" size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Local Utilization</p>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{localStats.utilizationRate}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Department Breakdown */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">📊 Sector Spending</h2>
            <div className="space-y-5">
                {localStats.departments.map((dept, idx) => (
                <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{dept.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">₹{dept.spent}L / ₹{dept.allocated}L</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${dept.percentage > 100 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {dept.percentage}% 
                    </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${dept.percentage > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'}`}
                        style={{ width: `${Math.min(dept.percentage, 100)}%` }}
                    ></div>
                    </div>
                    {dept.percentage > 100 && <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12}/> Over Budget</p>}
                </div>
                ))}
            </div>
            </div>

            {/* Local Projects Tracker with Whistleblower */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">📍 Active Ward Projects</h2>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">Track exact funds meant for your neighborhood</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-sm">
                        {localStats.localProjects.length} Verified
                    </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {localStats.localProjects.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                           <p className="text-slate-500 font-medium">No verified projects found for this local region yet.</p>
                        </div>
                    ) : (
                        localStats.localProjects.map((proj, idx) => {
                            const pSpent = proj.spent / 100000;
                            const pAlloc = proj.allocated / 100000;
                            const percent = Math.min((pSpent / pAlloc) * 100, 100);
                            
                            return (
                            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4">
                               <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                      <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">{proj.department}</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${proj.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                         {proj.status}
                                      </span>
                                   </div>
                                   <h3 className="font-bold text-slate-900 tracking-tight">{proj.name}</h3>
                                   <div className="flex items-center gap-4 mt-3">
                                       <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                           <div className={`h-full ${proj.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{width: `${percent}%`}}></div>
                                       </div>
                                       <p className="text-xs font-bold text-slate-500">₹{pSpent.toFixed(1)}L <span className="text-slate-400 font-medium">of ₹{pAlloc.toFixed(1)}L</span></p>
                                   </div>
                               </div>

                               {/* Whistleblower Action */}
                               <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 flex items-center justify-end">
                                   <button 
                                      onClick={() => handleFlagGhostProject(proj.name)}
                                      title="This project doesn't exist? Report it!"
                                      className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold rounded-lg transition-all"
                                   >
                                      <AlertCircle size={16} />
                                      <span className="md:hidden lg:inline">Report Ghost Project</span>
                                   </button>
                               </div>
                            </div>
                        )})
                    )}
                </div>
            </div>
        </div>

        {/* Global Flagged Transactions (Trending Issues) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="mb-5">
             <h2 className="text-lg font-bold text-slate-900 border-l-4 border-rose-500 pl-3">Trending Public Flags & Investigations</h2>
             <p className="text-sm text-slate-500 mt-1 pl-4">Highest risk anomalies currently under review by the Auditor General's office nationwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalLeakages.map((leak, idx) => (
              <div key={idx} className={`border p-4 rounded-xl flex items-start gap-3 bg-rose-50 border-rose-200`}>
                <div className="bg-rose-100 p-2 rounded-lg shrink-0">
                   <AlertCircle className="text-rose-600" size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight mb-1">{leak.department} — {leak.project}</p>
                  <p className="text-sm font-medium text-slate-600">Off-budget by: <span className="font-bold">₹{leak.amount}</span></p>
                  <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded border ${leak.risk === 'High' ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
                    {leak.risk} Risk / {leak.variancePercent.toFixed(0)}% Variance
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <footer className="bg-slate-900 py-8 text-center text-slate-400 text-sm mt-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-bold tracking-wide">© 2025 Central Public Budget Interface</p>
            <div className="flex items-center gap-4 font-medium">
                <a href="#" className="hover:text-white transition-colors">Submit Physical Fraud Proof</a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-white transition-colors">Auditor Guidelines</a>
            </div>
        </div>
      </footer>
    </div>
  );
}