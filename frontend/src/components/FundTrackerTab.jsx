import { ChevronRight, ArrowDownRight, Building, MapPin, Briefcase, PlusCircle, Activity } from 'lucide-react';
import { useState } from 'react';

export default function FundTrackerTab({ states, onAllocate }) {
  const [expandedState, setExpandedState] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);

  // Helper to calculate utilized %
  const getUtilized = (spent, allocated) => {
    if (!allocated) return 0;
    return Math.min(Math.round((spent / allocated) * 100), 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="text-indigo-600" /> National Fund Tracer
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Visualize the entire hierarchical flow of budget from Center to Department
            </p>
          </div>
          <button 
            onClick={() => onAllocate({ type: 'state', target: states[0] })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
          >
            <PlusCircle size={18} /> Allocate to State
          </button>
        </div>

        {/* Tree Visualization */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          
          {/* Central Root */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg">
              <Building size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Central Government (Ministry of Finance)</h3>
              <p className="text-sm font-semibold text-emerald-600">Total Outlay: ₹50,000 Cr</p>
            </div>
          </div>

          <div className="ml-6 pl-6 border-l-2 border-slate-300 space-y-4 pt-2">
            {states.map(state => {
              const isStateExpanded = expandedState === state.id;
              
              // Calculate macro state stats (mock aggregation)
              const stateAllocated = state.districts.reduce((sum, d) => sum + d.allocation, 0) * 1.5; // Mocking higher state level
              const stateSpent = state.districts.reduce((sum, d) => sum + d.spent, 0);
              const stateUtilized = getUtilized(stateSpent, stateAllocated);

              return (
                <div key={state.id} className="relative">
                  {/* State Node */}
                  <div 
                    onClick={() => setExpandedState(isStateExpanded ? null : state.id)}
                    className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md ${isStateExpanded ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-slate-200 hover:border-indigo-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isStateExpanded ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{state.name}</h4>
                        <p className="text-xs font-semibold text-slate-500">State Government</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">₹{(stateAllocated / 10000000).toFixed(1)}Cr</p>
                        <p className="text-xs font-medium text-slate-500">Allocated Base</p>
                      </div>
                      <div className="w-24 bg-slate-100 rounded-full h-2 hidden md:block">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${stateUtilized}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{stateUtilized}% Used</span>
                      <ChevronRight size={20} className={`text-slate-400 transition-transform ${isStateExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Districts Tree (Expanded) */}
                  {isStateExpanded && (
                    <div className="ml-8 pl-6 border-l-2 border-indigo-200 space-y-3 mt-3 pt-2 pb-2">
                       <div className="mb-2 flex justify-end">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAllocate({ type: 'district', target: state.districts[0] }); }}
                            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1"
                          >
                            <PlusCircle size={14} /> Distribute to District
                          </button>
                       </div>

                      {state.districts.map(district => {
                        const isDistExpanded = expandedDistrict === district.id;
                        const distUtilized = getUtilized(district.spent, district.allocation);

                        return (
                          <div key={district.id} className="relative">
                            {/* District Node */}
                            <div 
                              onClick={(e) => { e.stopPropagation(); setExpandedDistrict(isDistExpanded ? null : district.id); }}
                              className={`bg-white rounded-lg p-3 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDistExpanded ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                            >
                              <div className="flex items-center gap-2">
                                <ArrowDownRight size={16} className="text-slate-400" />
                                <h5 className="font-bold text-slate-800 text-sm">{district.name} District</h5>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-700">₹{(district.allocation / 10000000).toFixed(1)}Cr</span>
                                <div className="w-16 bg-slate-200 rounded-full h-1.5 hidden sm:block">
                                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${distUtilized}%` }}></div>
                                </div>
                                <ChevronRight size={16} className={`text-slate-400 transition-transform ${isDistExpanded ? 'rotate-90' : ''}`} />
                              </div>
                            </div>

                            {/* Departments Tree (Expanded) */}
                            {isDistExpanded && (
                              <div className="ml-6 pl-4 border-l border-blue-200 space-y-2 mt-2 pt-1 pb-2">
                                {district.departments.map(dept => {
                                  const deptUtilized = getUtilized(dept.spent, dept.allocated);
                                  const isAlert = deptUtilized > 90;

                                  return (
                                    <div key={dept.id} className="bg-slate-50 rounded p-2.5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white transition-colors">
                                      <div className="flex items-center gap-2">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700">{dept.name}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-semibold text-slate-500">₹{(dept.allocated / 10000000).toFixed(1)}Cr</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isAlert ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                          {deptUtilized}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
