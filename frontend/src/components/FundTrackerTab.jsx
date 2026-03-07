import { Network, Search, Building2, Map, ArrowDown, ChevronRight, Activity, CalendarDays, Receipt } from 'lucide-react';
import { useState } from 'react';

// Reusing same color palette and components from Overview for consistency
export default function FundTrackerTab({ states, onAllocate }) {
  const [selectedStateId, setSelectedStateId] = useState(states[0]?.id);
  const selectedState = states.find(s => s.id === selectedStateId);
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable tree states
  const [expandedDistricts, setExpandedDistricts] = useState({});
  const [expandedDepts, setExpandedDepts] = useState({});

  const toggleDistrict = (id) => setExpandedDistricts(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleDept = (id) => setExpandedDepts(prev => ({ ...prev, [id]: !prev[id] }));

  // Helper formats
  const formatMoney = (amount) => '₹' + (amount / 10000000).toFixed(1) + 'Cr';
  const calculateUtil = (spent, allocated) => Math.min(Math.round((spent / allocated) * 100), 100);

  if (!selectedState) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Network className="text-indigo-600" /> Hierarchical Fund Tracer
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              End-to-end lineage of budget distribution from Central to Project level.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-slate-400" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search entities..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
               />
             </div>
             
             <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition-colors outline-none appearance-none cursor-pointer"
             >
                {states.map(s => <option key={s.id} value={s.id}>{s.name} (State)</option>)}
             </select>
          </div>
        </div>

        {/* Root Node (Central / State) */}
        <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-lg shadow-indigo-200 mb-6">
           <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                 <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Building2 size={24} />
                 </div>
                 <div>
                    <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Origin Source</h3>
                    <p className="text-xl font-bold">{selectedState.name} Consolidated Fund</p>
                 </div>
              </div>
              <div className="text-right">
                  <p className="text-sm text-indigo-200 font-medium">Total Outlay FY24-25</p>
                  <p className="text-3xl font-black">{formatMoney(selectedState.districts.reduce((sum, d) => sum + d.allocation, 0))}</p>
              </div>
           </div>
        </div>

        {/* Tree Container */}
        <div className="pl-4 md:pl-8 space-y-4 border-l-2 border-slate-100 ml-4 md:ml-8 relative">
            
            {selectedState.districts.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === '').map((district, dIdx) => {
                const dUtil = calculateUtil(district.spent, district.allocation);
                const isDExpanded = expandedDistricts[district.id];

                return (
                  <div key={district.id} className="relative">
                      {/* Connection Line to parent */}
                      <div className="absolute -left-4 md:-left-8 top-8 w-4 md:w-8 h-0.5 bg-slate-200"></div>
                      
                      {/* District Node */}
                      <div 
                        onClick={() => toggleDistrict(district.id)}
                        className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-indigo-300 transition-all cursor-pointer shadow-sm group relative z-10"
                      >
                         <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                            <div className="flex items-start gap-3">
                               <button className={`mt-1 p-1 rounded-md transition-colors ${isDExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                                  <ChevronRight size={16} className={`transition-transform duration-300 ${isDExpanded ? 'rotate-90' : ''}`} />
                               </button>
                               <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                                  <Map size={20} />
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <h4 className="font-bold text-slate-800 text-lg">{district.name} Administration</h4>
                                     <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">Level 2: District</span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1.5">
                                     <span className="text-sm font-bold text-slate-600">Allocation: <span className="text-slate-900">{formatMoney(district.allocation)}</span></span>
                                     <span className="text-slate-300">|</span>
                                     <span className="text-sm font-bold text-slate-600">Spent: <span className="text-slate-900">{formatMoney(district.spent)}</span></span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-6 ml-12 lg:ml-0">
                               <div className="w-32 sm:w-48">
                                  <div className="flex justify-between text-xs font-bold mb-1">
                                      <span className={`${dUtil > 90 ? 'text-rose-600' : 'text-slate-500'}`}>{dUtil}% Burned</span>
                                  </div>
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all ${dUtil > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${dUtil}%`}}></div>
                                  </div>
                               </div>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); onAllocate({ type: 'district', target: district }); }}
                                 className="text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
                               >
                                  Inject Funds
                               </button>
                            </div>
                         </div>
                      </div>

                      {/* Departments Container (Level 3) */}
                      {isDExpanded && (
                         <div className="pl-6 md:pl-10 space-y-3 mt-3 border-l-2 border-slate-100 ml-6 md:ml-10 relative pb-2 animate-in slide-in-from-top-2 duration-300 fade-in">
                            {district.departments.map(dept => {
                               const deptUtil = calculateUtil(dept.spent, dept.allocated);
                               const isDeptExpanded = expandedDepts[dept.id];
                               
                               return (
                                 <div key={dept.id} className="relative">
                                    {/* Connection Line to parent district */}
                                    <div className="absolute -left-6 md:-left-10 top-6 w-6 md:w-10 h-0.5 bg-slate-200"></div>
                                    
                                    <div 
                                      onClick={() => toggleDept(dept.id)}
                                      className="bg-white border text-left border-slate-200 rounded-xl p-3 hover:border-indigo-300 transition-all cursor-pointer shadow-sm group z-10 relative"
                                    >
                                       <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3">
                                          <div className="flex items-center gap-3">
                                             <button className={`p-1 rounded transition-colors ${isDeptExpanded ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                                                <ChevronRight size={14} className={`transition-transform duration-300 ${isDeptExpanded ? 'rotate-90' : ''}`} />
                                             </button>
                                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                                <Activity size={16} />
                                             </div>
                                             <div>
                                                <div className="flex items-center gap-2">
                                                   <h5 className="font-bold text-slate-800 text-sm">{dept.name}</h5>
                                                   <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">Level 3: Dept</span>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500 mt-0.5">Available: <span className="text-slate-700">{formatMoney(dept.allocated - dept.spent)}</span></p>
                                             </div>
                                          </div>
                                          
                                          <div className="flex justify-between items-center gap-4 ml-10 lg:ml-0">
                                             <div className="flex flex-col items-end">
                                                <div className="text-xs font-bold text-slate-700">{deptUtil}%</div>
                                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                                                    <div className={`h-full rounded-full transition-all ${deptUtil > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{width: `${deptUtil}%`}}></div>
                                                </div>
                                             </div>
                                             <button 
                                                onClick={(e) => { e.stopPropagation(); onAllocate({ type: 'dept', target: dept }); }}
                                                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                                             >
                                                Issue
                                             </button>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Projects Container (Level 4 - Leaf Nodes) */}
                                    {isDeptExpanded && (
                                       <div className="pl-8 md:pl-12 space-y-2 mt-2 border-l-2 border-slate-100 ml-5 relative pb-2 animate-in slide-in-from-top-1 duration-200 fade-in">
                                          {dept.projects.map((proj, pIdx) => (
                                             <div key={pIdx} className="relative group/proj">
                                                {/* Connection Line to parent dept */}
                                                <div className="absolute -left-8 md:-left-12 top-1/2 w-8 md:w-12 h-0.5 bg-slate-200"></div>
                                                
                                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-left hover:border-indigo-200 transition-colors z-10 relative">
                                                   <div className="flex items-center gap-3">
                                                      <div className="bg-white border border-slate-200 p-1.5 rounded text-slate-400 group-hover/proj:text-indigo-500 transition-colors">
                                                         <Receipt size={14} />
                                                      </div>
                                                      <div>
                                                         <p className="text-xs font-bold text-slate-800 leading-tight">{proj.name}</p>
                                                         <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Level 4: Project</span>
                                                            <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-0.5"><CalendarDays size={10}/> Last draw: {new Date(proj.lastDrawdown).toLocaleDateString('en-IN')}</span>
                                                         </div>
                                                      </div>
                                                   </div>
                                                   <div className="text-right ml-2 shrink-0">
                                                      <p className="text-[10px] font-bold text-slate-500 uppercase">Disbursed</p>
                                                      <p className="text-sm font-black text-slate-900">{formatMoney(proj.budget)}</p>
                                                   </div>
                                                </div>
                                             </div>
                                          ))}
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
  );
}
