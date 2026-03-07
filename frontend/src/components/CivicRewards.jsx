import { Shield, Sparkles, Trophy, Target, Star } from 'lucide-react';

export default function CivicRewards() {
  const achievements = [
    { title: 'First Audit', desc: 'Reviewed your local district data', icon: Shield, unlocked: true },
    { title: 'Ghost Buster', desc: 'Flagged a suspicious project', icon: Target, unlocked: true },
    { title: 'Civic Eagle', desc: 'Active for 7 straight days', icon: Star, unlocked: false },
  ];

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group text-white h-full flex flex-col">
      {/* Glow effects */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/50 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="text-yellow-400" /> Civic Rewards
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Earn points by securing your nation's budget.</p>
        </div>
        <div className="text-right shrink-0">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Title</p>
           <p className="text-sm font-bold text-indigo-300 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-700/50">Level 4 Citizen</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8 relative z-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shadow-[0_0_30px_rgb(250,204,21,0.3)]">
           <div className="w-full h-full bg-slate-900 rounded-full border-2 border-slate-900 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-yellow-400/20"></div>
             <Sparkles className="text-yellow-400 absolute opacity-50 w-full h-full animate-spin-slow" />
             <span className="text-2xl font-black text-white relative z-10">1.2k</span>
           </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
             <span>Current XP</span>
             <span>1,250 / 2,000 to Rank 5</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 shadow-inner border border-slate-700">
             <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full mt-[1px] ml-[1px]" style={{ width: '62%' }}></div>
          </div>
        </div>
      </div>

      <div className="space-y-3 relative z-10 flex-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-700/50 pb-2">Recent Badges</p>
        {achievements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
               item.unlocked ? 'bg-slate-800/80 border-slate-600 hover:border-indigo-400' : 'bg-slate-800/30 border-slate-800 opacity-60'
            }`}>
               <div className={`p-2 rounded-lg ${item.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                 <Icon size={18} />
               </div>
               <div>
                  <h4 className={`text-sm font-bold ${item.unlocked ? 'text-slate-100' : 'text-slate-500'}`}>{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.desc}</p>
               </div>
            </div>
          )
        })}
      </div>
      
    </div>
  );
}
