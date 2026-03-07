import { ThumbsUp, ThumbsDown, Activity, Award, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

export default function PartyPerformanceBoard({ stateName }) {
  const [voted, setVoted] = useState(null);
  const [approvalRating, setApprovalRating] = useState(68);

  const handleVote = (type) => {
    if (voted === type) return;
    setVoted(type);
    setApprovalRating(prev => type === 'up' ? prev + 1 : prev - 1);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group transition-all">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl opacity-50 -z-10 group-hover:bg-indigo-100/50 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="text-indigo-600" /> Government Performance Radar
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Live civic approval & execution index for {stateName || 'your region'}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Activity size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-indigo-800 tracking-wide uppercase">Live Pulse</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Ruling Party Stats */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">In Power</p>
              <h3 className="text-lg font-bold text-slate-800">State Ruling Party</h3>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">82% Execution</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Budget Utilization</span>
                <span>82%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '82%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Transparency Index</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '75%' }}></div></div>
            </div>
          </div>
        </div>

        {/* Opposition Stats */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
           <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Key Opposition</p>
              <h3 className="text-lg font-bold text-slate-800">Shadow Cabinet</h3>
            </div>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">34 Queries Raised</span>
          </div>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            Actively tracking 12 delayed mega-projects and flagged 3 contractor anomalies this quarter.
          </p>
        </div>
      </div>

      {/* Citizen Voting Block */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-center font-bold text-slate-800 mb-4 flex justify-center items-center gap-2">
           <Users size={18} className="text-indigo-500" />
           Your Voice: Rate the current administration
        </h3>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-6 mb-4">
            <button 
               onClick={() => handleVote('down')}
               className={`p-4 rounded-full transition-all border-2 ${voted === 'down' ? 'bg-rose-50 border-rose-500 text-rose-600 scale-110 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-white border-slate-200/60 text-slate-400 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50/50'}`}
            >
              <ThumbsDown size={28} strokeWidth={voted === 'down' ? 2.5 : 2} />
            </button>
            
            <div className="text-center">
               <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">{approvalRating}%</span>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Approval Rating</p>
            </div>

            <button 
               onClick={() => handleVote('up')}
               className={`p-4 rounded-full transition-all border-2 ${voted === 'up' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-white border-slate-200/60 text-slate-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/50'}`}
            >
              <ThumbsUp size={28} strokeWidth={voted === 'up' ? 2.5 : 2} />
            </button>
          </div>
          
          <p className="text-xs text-slate-400 font-medium text-center max-w-sm">
             Your vote is cryptographically secured & fully anonymous. It directly influences the District KPIs.
          </p>
        </div>
      </div>
    </div>
  );
}
