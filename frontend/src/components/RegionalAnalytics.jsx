import { BarChart3, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function RegionalAnalytics({ currentState }) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  if (!currentState || !currentState.districts) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 mt-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="text-indigo-600" /> Geospatial Budget Heatmap
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Visual distribution of deployed funds across <b>{currentState.name}</b>'s zones.
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

      {/* Abstract Map Container */}
      <div className="relative w-full h-[400px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mt-4 mb-8">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {currentState.districts.map((district, idx) => {
          const utilized = Math.min(Math.round((district.spent / district.allocation) * 100), 100);
          const isCritical = utilized > 90;
          const isWarning = utilized > 70 && utilized <= 90;

          // Generate abstract fixed positions so they look like a map layout (pseudo-random but seeded by index)
          const topPos = 20 + ((idx * 37) % 60); 
          const leftPos = 15 + ((idx * 53) % 70);
          const size = 40 + (district.allocation % 60);

          const bgColor = isCritical ? 'bg-rose-500 shadow-rose-500/50' : isWarning ? 'bg-amber-400 shadow-amber-400/50' : 'bg-emerald-400 shadow-emerald-400/50';
          const ringColor = isCritical ? 'ring-rose-200' : isWarning ? 'ring-amber-100' : 'ring-emerald-100';

          return (
            <div 
              key={idx}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ top: `${topPos}%`, left: `${leftPos}%`, zIndex: hoveredDistrict === idx ? 50 : 10 }}
              onMouseEnter={() => setHoveredDistrict(idx)}
              onMouseLeave={() => setHoveredDistrict(null)}
            >
              {/* Pulse effect for critical */}
              {isCritical && (
                <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-75" style={{ width: size, height: size }}></div>
              )}
              
              {/* Map Node */}
              <div 
                className={`relative rounded-full shadow-lg border-4 border-white ${bgColor} flex items-center justify-center transition-transform duration-300 ${hoveredDistrict === idx ? 'scale-125 ring-8 ' + ringColor : ''}`}
                style={{ width: size, height: size }}
              >
                <span className="text-white font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {utilized}%
                </span>
              </div>
              
              {/* Label */}
              <div className="absolute top-100 left-1/2 transform -translate-x-1/2 mt-2 w-max text-center pointer-events-none">
                <p className="text-xs font-bold text-slate-800 bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow-sm border border-slate-100">
                  {district.name}
                </p>
              </div>

              {/* Hover Floating Card */}
              {hoveredDistrict === idx && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{district.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                      {utilized}% Used
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-2xl font-black text-slate-800 tracking-tight">
                      ₹{(district.spent / 10000000).toFixed(1)}<span className="text-xs text-slate-400 font-medium ml-1">Cr</span>
                    </p>
                    <p className="text-xs font-bold text-slate-400">/ ₹{(district.allocation / 10000000).toFixed(1)}Cr</p>
                  </div>
                  
                  {isCritical && (
                    <div className="bg-rose-50 p-2 rounded-lg flex items-start gap-2 border border-rose-100 mt-2">
                      <AlertCircle className="text-rose-600 mt-0.5" size={12} />
                      <p className="text-[10px] text-rose-700 font-medium leading-tight">High risk of exhaustion. Sector review recommended.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Mini Insight */}
      <div className="mt-2 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm mt-1 shrink-0">
           <BarChart3 size={18} />
        </div>
        <div>
           <h4 className="font-bold text-indigo-900 text-sm">Predictor AI Insight</h4>
           <p className="text-indigo-700 text-sm mt-1 leading-relaxed font-medium">
             Spatial analysis reveals a concentration of rapid fund consumption in the {currentState.districts[0]?.name || 'central'} zone. Suggest activating Reallocation AI to shift surplus funds from peripheral districts.
           </p>
        </div>
      </div>
    </div>
  );
}
