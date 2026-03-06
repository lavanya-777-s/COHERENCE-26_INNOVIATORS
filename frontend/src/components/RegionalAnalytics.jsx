import { BarChart3, Map, TrendingUp } from 'lucide-react';

export default function RegionalAnalytics({ currentState }) {
  if (!currentState || !currentState.districts) return null;

  // Calculate stats for the graph
  const maxAllocation = Math.max(...currentState.districts.map(d => d.allocation));

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="text-indigo-600" /> Regional Utilization Heatmap
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Comparative analysis of budget absorption across <b>{currentState.name}</b>'s zones.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold text-slate-600">Optimal (&lt;70%)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-xs font-bold text-slate-600">Warning (70-90%)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600">Critical (&gt;90%)</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentState.districts.map((district, idx) => {
          const utilized = Math.min(Math.round((district.spent / district.allocation) * 100), 100);
          const isCritical = utilized > 90;
          const isWarning = utilized > 70 && utilized <= 90;

          // Relative width for the backdrop bar (allocation comparison)
          const allocationRelativePercent = (district.allocation / maxAllocation) * 100;

          return (
            <div key={idx} className="group relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  {district.name}
                  {isCritical && <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>}
                </span>
                <span className="text-sm font-bold text-slate-600">
                  ₹{(district.spent / 10000000).toFixed(1)}Cr / ₹{(district.allocation / 10000000).toFixed(1)}Cr
                </span>
              </div>
              
              {/* Stacked Bar container */}
              <div className="w-full bg-slate-100 rounded-full h-4 relative overflow-hidden flex items-center">
                {/* Total Allocation Width Indicator (relative to max) */}
                <div 
                  className="absolute left-0 h-full bg-slate-200/50 rounded-full transition-all duration-1000"
                  style={{ width: `${allocationRelativePercent}%` }}
                ></div>

                {/* Spent Width Indicator (Absolute to its own allocation) */}
                <div 
                  className={`absolute left-0 h-full rounded-full transition-all duration-1000 ease-out z-10 
                    ${isCritical ? 'bg-gradient-to-r from-rose-400 to-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.4)]' 
                    : isWarning ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                    : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`
                  }
                  style={{ width: `${(utilized / 100) * allocationRelativePercent}%` }}
                >
                   {isCritical && <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite]"></div>}
                </div>
              </div>

              {/* Hover Tooltip equivalent */}
              <div className="flex justify-between mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                   {utilized}% Utilized
                 </span>
                 <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <TrendingUp size={10} /> 
                    {district.departments.length} Departments
                 </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Mini Insight */}
      <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm mt-1">
           <BarChart3 size={18} />
        </div>
        <div>
           <h4 className="font-bold text-indigo-900 text-sm">Predictor AI Insight</h4>
           <p className="text-indigo-700 text-sm mt-1 leading-relaxed font-medium">
             Based on the regional spread, {currentState.districts.find(d => (d.spent/d.allocation) > 0.9)?.name || 'certain zones'} are burning through funds 2.4x faster than the state average. Consider triggering the Reallocation AI to balance the fiscal load.
           </p>
        </div>
      </div>
    </div>
  );
}
