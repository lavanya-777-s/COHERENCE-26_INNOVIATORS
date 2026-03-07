import { MapPin, ChevronDown, CheckCircle2, TrendingUp } from 'lucide-react';
import { STATIC_DATA } from '../data/budgetStaticData';

export default function LocationBudgetDashboard({ 
  selectedState, setSelectedState, 
  selectedDistrict, setSelectedDistrict, 
  currentState, currentDistrict, localStats 
}) {
  if (!localStats) return null;

  const utilizationRate = parseFloat(localStats.utilizationRate);
  const strokeDasharray = 440; // Approx 2 * pi * 70
  const strokeDashoffset = strokeDasharray - (strokeDasharray * utilizationRate) / 100;

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative -mt-10 mx-auto max-w-6xl z-20 flex flex-col lg:flex-row">
      
      {/* LEFT PANEL: Location Selection */}
      <div className="bg-slate-50/50 p-8 lg:p-10 lg:w-1/3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100 relative">
        <div className="flex items-center gap-4 mb-8">
           <div className="bg-indigo-50 p-3 rounded-2xl">
              <MapPin size={24} className="text-indigo-600" />
           </div>
           <div>
             <h3 className="font-bold text-slate-900 text-lg">Target Zone</h3>
             <p className="text-sm text-slate-500">Select a region to analyze</p>
           </div>
        </div>
        
        <div className="space-y-6 relative z-10">
           {/* State Selector */}
           <div className="group">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block group-hover:text-indigo-500 transition-colors">Select State</label>
             <div className="relative">
               <select
                 value={selectedState}
                 onChange={(e) => setSelectedState(e.target.value)}
                 className="appearance-none w-full bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl py-3.5 pl-4 pr-12 text-slate-900 font-bold text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm"
               >
                 {STATIC_DATA.states.map(state => (
                   <option key={state.id} value={state.id}>{state.name}</option>
                 ))}
               </select>
               <div className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-50 border border-slate-100 p-1.5 rounded-lg pointer-events-none group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 text-slate-400 transition-colors">
                 <ChevronDown size={16} />
               </div>
             </div>
           </div>

           {/* District Selector */}
           <div className="group">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block group-hover:text-emerald-500 transition-colors">Select District</label>
             <div className="relative">
               <select
                 value={selectedDistrict}
                 onChange={(e) => setSelectedDistrict(e.target.value)}
                 className="appearance-none w-full bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl py-3.5 pl-4 pr-12 text-slate-900 font-bold text-[15px] focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer shadow-sm"
               >
                 {currentState?.districts.map(district => (
                   <option key={district.id} value={district.id}>{district.name}</option>
                 ))}
               </select>
               <div className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-50 border border-slate-100 p-1.5 rounded-lg pointer-events-none group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 text-slate-400 transition-colors">
                 <ChevronDown size={16} />
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL: Minimalist Budget Visualizer */}
      <div className="p-8 lg:p-12 lg:w-2/3 flex flex-col xl:flex-row items-center justify-between gap-10 bg-white relative">
         <div className="flex-1 w-full z-10">
            <div className="mb-6 flex items-center gap-2.5">
               <span className="flex h-2.5 w-2.5 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
               </span>
               <span className="text-emerald-600 text-[10px] font-bold tracking-widest uppercase">
                 Live Feed Connected
               </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">
               {currentDistrict?.name} <span className="font-medium text-slate-400">Budget</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-5">
               <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                     <TrendingUp size={14} className="text-indigo-500" /> Allocated
                  </p>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">
                     ₹{(localStats.totalAlloc/10000000).toFixed(2)}<span className="text-base text-slate-400 ml-0.5 font-medium">Cr</span>
                  </p>
               </div>
               
               <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                     <CheckCircle2 size={14} className="text-emerald-500" /> Disbursed
                  </p>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">
                     ₹{(localStats.totalSpent/10000000).toFixed(2)}<span className="text-base text-slate-400 ml-0.5 font-medium">Cr</span>
                  </p>
               </div>
            </div>
         </div>

         {/* Minimalist Circular Gauge */}
         <div className="shrink-0 relative flex items-center justify-center w-56 h-56 lg:w-64 lg:h-64">
            <svg className="w-full h-full transform -rotate-90 relative z-10 transition-all">
               <circle 
                  cx="50%" cy="50%" r="42%"
                  className="fill-none stroke-slate-50"
                  strokeWidth="8%"
               />
               <circle 
                  cx="50%" cy="50%" r="42%"
                  className="fill-none stroke-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="8%"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
               />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
               <span className="text-5xl font-black text-slate-900 tracking-tight">
                  {localStats.utilizationRate}
                  <span className="text-xl text-slate-400 font-medium ml-0.5">%</span>
               </span>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Utilization</p>
            </div>
         </div>

      </div>
    </div>
  );
}
