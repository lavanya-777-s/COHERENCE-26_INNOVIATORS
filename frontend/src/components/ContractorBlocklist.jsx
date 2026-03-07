import { ShieldAlert, AlertOctagon, TrendingDown, ExternalLink } from 'lucide-react';

export default function ContractorBlocklist() {
  const blocklist = [
    { name: 'Apex BuildTech Corp', reason: 'Ghost Project (Roads)', amount: '₹45 Cr', duration: '5 Years', date: 'Oct 2024' },
    { name: 'Nova Infra Solutions', reason: 'Substandard Materials', amount: '₹12 Cr', duration: '2 Years', date: 'Jan 2025' },
    { name: 'Global Tech Providers', reason: 'Duplicate Invoicing', amount: '₹8.5 Cr', duration: 'Permanent', date: 'Feb 2025' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-rose-200/60 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(225,29,72,0.04)] group transition-all flex flex-col h-full">
      <div className="bg-rose-50/50 p-6 border-b border-rose-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-rose-900 flex items-center gap-2">
            <ShieldAlert className="text-rose-600" /> Public Blocklist
          </h2>
          <p className="text-sm font-medium text-rose-700/70 mt-1">Contractors barred from accepting government tenders.</p>
        </div>
        <div className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-rose-200">
           <AlertOctagon size={14} /> 14 Active Bans
        </div>
      </div>

      <div className="divide-y divide-slate-100 flex-1">
        {blocklist.map((item, idx) => (
          <div key={idx} className="p-5 hover:bg-rose-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 font-bold text-slate-500">
                 {item.name.charAt(0)}
               </div>
               <div>
                 <h3 className="font-bold text-slate-900">{item.name}</h3>
                 <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
                    <TrendingDown size={12} /> {item.reason}
                 </p>
               </div>
            </div>
            
            <div className="flex items-center gap-6 sm:justify-end">
               <div className="text-left sm:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Funds at Risk</p>
                  <p className="font-extrabold text-slate-800">{item.amount}</p>
               </div>
               <div className="text-left sm:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ban Period</p>
                  <p className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-sm border border-rose-100 inline-block">{item.duration}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-rose-600 hover:bg-rose-700 text-white text-center py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 mt-auto">
        View Complete Blocklist Register <ExternalLink size={16} />
      </button>
    </div>
  );
}
