import { Activity, Target, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export default function VotedPartyProgress({ stateName, districtName }) {
  // Mock data representing the party the citizen voted for in their district/state
  const votedParty = {
    name: "Democratic Alliance (DA)",
    level: "State & District",
    since: "2024 Elections",
    promises: [
      { text: "Build 5 New Tech Hubs", status: "in-progress", progress: 60 },
      { text: "Improve Rural Healthcare", status: "completed", progress: 100 },
      { text: "Reduce Farm Tax by 15%", status: "stalled", progress: 15 }
    ],
    overallScore: 78
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden group">
      {/* Visual background flairs */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -z-10 group-hover:opacity-30 transition-opacity"></div>
       <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-10 -z-10"></div>

       <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <span className="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded inline-flex items-center gap-1 mb-3 uppercase tracking-wider backdrop-blur-sm">
            <Target size={12} /> My Voted Representative
          </span>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            {votedParty.name}
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
            Current leadership for {districtName}, {stateName}
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
           <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
             <span className="text-xl font-black text-emerald-400">{votedParty.overallScore}</span>
           </div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 text-center w-full">Trust Score</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
         <div className="flex items-center gap-2 mb-2">
            <Activity size={18} className="text-indigo-400" />
            <h3 className="font-bold text-slate-200">Manifesto Promises Tracking</h3>
         </div>

         <div className="space-y-4">
           {votedParty.promises.map((promise, idx) => (
             <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-bold text-slate-200 text-sm">{promise.text}</p>
                  
                  {promise.status === 'completed' && (
                     <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                       <CheckCircle2 size={12} /> Done
                     </span>
                  )}
                  {promise.status === 'in-progress' && (
                     <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                       <Activity size={12} /> Active
                     </span>
                  )}
                  {promise.status === 'stalled' && (
                     <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                       <AlertCircle size={12} /> Stalled
                     </span>
                  )}
                </div>

                <div className="w-full bg-slate-900 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                   <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                         promise.status === 'completed' ? 'bg-emerald-500' :
                         promise.status === 'in-progress' ? 'bg-indigo-500' :
                         'bg-rose-500'
                      }`} 
                      style={{ width: `${promise.progress}%` }}
                   ></div>
                </div>
             </div>
           ))}
         </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
         <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <Calendar size={14} /> Data refreshed directly from State APIs
         </div>
         <button className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]">
           View Detailed Report Card
         </button>
      </div>

    </div>
  );
}
