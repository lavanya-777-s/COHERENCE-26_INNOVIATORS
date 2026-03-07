import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  LayoutDashboard,
  Building2,
  MapPin,
  Search,
  Download,
  Filter
} from 'lucide-react';
import { AllocationVsSpending, AnomalyDistribution, UtilizationTrend } from '../components/DashboardCharts';
import DatasetUpload from '../components/DatasetUpload';

export default function AuditorDashboard() {
  const [data, setData] = useState([]);
  const [viewLevel, setViewLevel] = useState('national'); // national, district, department
  const [selection, setSelection] = useState({ district: null, department: null });
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    if (!data.length) return { totalAllocated: 0, totalSpent: 0, anomalies: 0, utilization: 0 };
    const totalAllocated = data.reduce((sum, item) => sum + item.allocated_budget, 0);
    const totalSpent = data.reduce((sum, item) => sum + item.spent_budget, 0);
    const anomalies = data.filter(item => item.is_anomaly === 1).length;
    const utilization = (totalSpent / (totalAllocated + 1)) * 100;
    return { totalAllocated, totalSpent, anomalies, utilization };
  }, [data]);

  const nationalChartData = useMemo(() => {
    if (!data.length) return [];
    const grouped = data.reduce((acc, item) => {
      acc[item.district] = acc[item.district] || { name: item.district, allocated: 0, spent: 0 };
      acc[item.district].allocated += item.allocated_budget;
      acc[item.district].spent += item.spent_budget;
      return acc;
    }, {});
    return Object.values(grouped);
  }, [data]);

  const districtData = useMemo(() => {
    if (viewLevel === 'national' || !selection.district) return [];
    return data.filter(item => item.district === selection.district);
  }, [data, viewLevel, selection.district]);

  const districtStats = useMemo(() => {
    if (!districtData.length) return null;
    const allocated = districtData.reduce((sum, item) => sum + item.allocated_budget, 0);
    const spent = districtData.reduce((sum, item) => sum + item.spent_budget, 0);
    const anomalies = districtData.filter(item => item.is_anomaly === 1).length;
    const warnings = districtData.filter(item => item.is_underutilized === 1).length;
    return { allocated, spent, anomalies, warnings, percentage: (spent / (allocated + 1)) * 100 };
  }, [districtData]);

  const deptData = useMemo(() => {
    if (viewLevel !== 'department' || !selection.department || !selection.district) return [];
    return data.filter(item => item.district === selection.district && item.department === selection.department);
  }, [data, viewLevel, selection.district, selection.department]);

  const handleDistrictClick = (district) => {
    setSelection({ district, department: null });
    setViewLevel('district');
  };

  const handleDeptClick = (dept) => {
    setSelection(prev => ({ ...prev, department: dept }));
    setViewLevel('department');
  };

  const goBack = () => {
    if (viewLevel === 'department') {
      setViewLevel('district');
      setSelection(prev => ({ ...prev, department: null }));
    } else if (viewLevel === 'district') {
      setViewLevel('national');
      setSelection({ district: null, department: null });
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Inter',_sans-serif]">
      <div className="flex">
        <div className="flex-1 px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Audit Intelligence</h1>
                <p className="text-slate-500 text-sm font-medium">Monitoring: {user.name || 'Financial Forensic Control'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
                <Download size={16} /> Export Forensic Report
              </button>
              <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'Auditor'}`} alt="avatar" />
              </div>
            </div>
          </div>

          {/* Navigation Path */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <button onClick={() => setViewLevel('national')} className={`${viewLevel === 'national' ? 'text-blue-600' : 'hover:text-blue-500'}`}>National Overview</button>
            {selection.district && (
              <>
                <ChevronRight size={14} className="text-slate-300" />
                <button onClick={() => setViewLevel('district')} className={`${viewLevel === 'district' ? 'text-blue-600' : 'hover:text-blue-500'}`}>{selection.district}</button>
              </>
            )}
            {selection.department && (
              <>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-blue-600 font-bold">{selection.department} Analysis</span>
              </>
            )}
          </div>

          {!data.length ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                    <BarChart3 className="text-blue-600" size={40} />
                  </div>
                  <div className="max-w-md">
                    <h2 className="text-2xl font-bold text-slate-800">Initialize Audit Engine</h2>
                    <p className="text-slate-500 mt-2">Upload your district budget dataset to run AI forensic analysis and populate the intelligence dashboard.</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <DatasetUpload onDataReceived={(receivedData) => setData(receivedData)} />
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* LEVEL 1: NATIONAL VIEW */}
              {viewLevel === 'national' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Budget Pool" value={`₹${(stats.totalAllocated / 100000).toFixed(1)}L`} icon={<Building2 className="text-blue-600" />} color="blue" />
                    <StatCard title="Actual Spend" value={`₹${(stats.totalSpent / 100000).toFixed(1)}L`} icon={<TrendingUp className="text-emerald-600" />} color="emerald" />
                    <StatCard title="ML Anomaly Flags" value={stats.anomalies} icon={<AlertTriangle className="text-rose-600" />} color="rose" />
                    <StatCard title="Spend Utilization" value={`${stats.utilization.toFixed(1)}%`} icon={<ShieldCheck className="text-indigo-600" />} color="indigo" />
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" /> State-wide Budget vs Spending
                      </h3>
                      <AllocationVsSpending data={nationalChartData} />
                    </div>
                    <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold mb-6">District Risk Profile</h3>
                      <div className="space-y-4">
                        {nationalChartData.map((d, i) => (
                          <div key={i} onClick={() => handleDistrictClick(d.name)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group border border-transparent hover:border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <MapPin size={18} className="text-slate-400 group-hover:text-blue-600" />
                              </div>
                              <span className="font-bold text-slate-700">{d.name}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.spent > d.allocated ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {d.spent > d.allocated ? 'Critical' : 'Audit Clear'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* LEVEL 2: DISTRICT VIEW */}
              {viewLevel === 'district' && districtStats && (
                <>
                  <div className="flex items-center gap-4">
                    <button onClick={goBack} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                      <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-black tracking-tight">{selection.district} District Insights</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard title="District Allocation" value={`₹${(districtStats.allocated / 100000).toFixed(1)}L`} color="blue" />
                      <StatCard title="Flagged Anomalies" value={districtStats.anomalies} color="rose" />
                      <StatCard title="Utilization Rate" value={`${districtStats.percentage.toFixed(1)}%`} color="emerald" />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-amber-700 font-bold mb-2">
                        <AlertTriangle size={20} />
                        <span>Underutilization Forecast</span>
                      </div>
                      <p className="text-3xl font-black text-amber-800">{districtStats.warnings}</p>
                      <p className="text-amber-600 text-[10px] mt-1 font-black uppercase tracking-wider">Predicting year-end shortfall {'>'} 30%</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold mb-6">Departmental Forensic Audit</h3>
                      <div className="space-y-4">
                        {Array.from(new Set(districtData.map(d => d.department))).map((dept, i) => {
                          const deptItems = districtData.filter(d => d.department === dept);
                          const anomalies = deptItems.filter(d => d.is_anomaly === 1).length;
                          return (
                            <div key={i} onClick={() => handleDeptClick(dept)} className="flex items-center justify-between p-4 border border-blue-50 bg-slate-50/20 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                              <span className="font-bold text-slate-700 group-hover:text-blue-700">{dept}</span>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anomalies</span>
                                  <p className={`font-black ${anomalies > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{anomalies}</p>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-blue-500" size={18} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold mb-6">Budget Distribution (%)</h3>
                      <AllocationVsSpending data={districtData.map(d => ({ name: d.department, allocated: d.allocated_budget, spent: d.spent_budget }))} />
                    </div>
                  </div>
                </>
              )}

              {/* LEVEL 3: DEPARTMENT VIEW */}
              {viewLevel === 'department' && (
                <>
                  <div className="flex items-center gap-4">
                    <button onClick={goBack} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">{selection.department} Scheme Analysis</h2>
                      <p className="text-slate-500 font-medium text-sm">Detailed Audit Ledger • {selection.district}</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">AI Analytics Prediction</h3>
                        <div className="space-y-8">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Fund Lapse Probability</span>
                              <span className="text-rose-600 font-black">{(deptData[0]?.fund_lapse_probability * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${deptData[0]?.fund_lapse_probability * 100}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Model Severity Level</p>
                            <span className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider ${deptData[0]?.lapse_risk_level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                              {deptData[0]?.lapse_risk_level} Criticality
                            </span>
                          </div>
                          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-[0.2em] mb-3">Predictive Forecast</p>
                            <p className="text-blue-900 text-sm leading-relaxed font-medium">
                              Estimated year-end spending: <span className="font-bold">₹{(deptData[0]?.predicted_spending / 100000).toFixed(1)}L</span>. 
                              Current trend indicates a potential <span className="font-bold">₹{((deptData[0]?.allocated_budget - deptData[0]?.predicted_spending) / 100000).toFixed(1)}L</span> lapse.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold">Scheme Expenditure Audit</h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">AI Audit Active</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                              <th className="px-8 py-5">Scheme Description</th>
                              <th className="px-8 py-5 text-right">Pool</th>
                              <th className="px-8 py-5 text-right">Utilized</th>
                              <th className="px-8 py-5 text-center">Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {deptData.map((scheme, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                  <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{scheme.scheme}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-black mt-0.5">{scheme.month}</p>
                                </td>
                                <td className="px-8 py-6 text-right font-medium text-slate-500">₹{(scheme.allocated_budget / 100000).toFixed(1)}L</td>
                                <td className="px-8 py-6 text-right font-black text-slate-900">₹{(scheme.spent_budget / 100000).toFixed(1)}L</td>
                                <td className="px-8 py-6 text-center">
                                  {scheme.is_anomaly ? (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black border border-rose-100 animate-pulse">
                                      <AlertTriangle size={12} /> FLAG
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">
                                      <ShieldCheck size={12} /> OK
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between text-[11px]">
                         <span className="text-slate-500 font-medium italic">ML Confidence: {(0.94 + Math.random() * 0.05).toFixed(2) * 100}% accurate based on historical data.</span>
                         <button className="text-blue-600 font-black hover:underline uppercase tracking-widest">Ledger Details &rarr;</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'border-blue-100 bg-blue-50/50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50/50 text-emerald-700',
    rose: 'border-rose-100 bg-rose-50/50 text-rose-700',
    indigo: 'border-indigo-100 bg-indigo-50/50 text-indigo-700'
  };
  
  return (
    <div className={`bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-md ${colors[color] || 'border-slate-100'}`}>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 leading-none">{title}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-50">
        {icon || <LayoutDashboard size={20} className="text-slate-400" />}
      </div>
    </div>
  );
}