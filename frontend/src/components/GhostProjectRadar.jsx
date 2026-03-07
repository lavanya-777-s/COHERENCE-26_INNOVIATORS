import { Radar, MapPin, Check, AlertCircle } from 'lucide-react';

export default function GhostProjectRadar() {
  const projects = [
    { title: 'Sector 4 Metro Station', location: 'North District', reporters: 14, status: 'red' },
    { title: 'Govt. Primary School Annex', location: 'Rural Block C', reporters: 5, status: 'amber' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] group transition-all flex flex-col h-full">
      <div className="p-6 border-b border-slate-100/60 flex justify-between items-center relative overflow-hidden">
        {/* Radar animation background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
           <div className="w-32 h-32 border-2 border-slate-900 rounded-full animate-ping"></div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Radar className="text-indigo-600" /> Ghost Radar
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Community-flagged non-existent projects.</p>
        </div>
        <div className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-rose-100">
           <AlertCircle size={14} /> Critical
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col space-y-4">
        {projects.map((proj, idx) => (
          <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                 <h3 className="font-bold text-slate-800 tracking-tight">{proj.title}</h3>
                 <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={12} /> {proj.location}
                 </p>
              </div>
              <div className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                 <AlertCircle size={10} /> {proj.reporters} Flags
              </div>
            </div>
            
            <p className="text-xs text-slate-600 mb-4 font-medium">
               "Allocated funds marked as 'spent' but physical construction has not begun."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button className="w-full bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <AlertCircle size={14} /> Corroborate
              </button>
              <button className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <Check size={14} /> Verify Exists
              </button>
            </div>
          </div>
        ))}

        <button className="w-full mt-auto border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-500 hover:text-indigo-600 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
          <span className="text-xl leading-none mb-0.5">+</span> Flag New Location
        </button>
      </div>
    </div>
  );
}
