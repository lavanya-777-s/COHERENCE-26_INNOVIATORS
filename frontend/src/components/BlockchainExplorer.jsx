import { Database, Link2, Hexagon, Clock, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState([
    { id: '10924A', hash: '0x8f...4c21', from: 'Central.Treasury', to: 'State.Maha', amount: '₹120.5Cr', time: '12s ago' },
    { id: '109249', hash: '0x3a...9b42', from: 'State.Goa', to: 'Dist.North', amount: '₹4.2Cr', time: '45s ago' },
    { id: '109248', hash: '0x7e...1f88', from: 'Dist.Pune', to: 'Contractor.Apex', amount: '₹1.1Cr', time: '2m ago' },
    { id: '109247', hash: '0x9c...5e34', from: 'Central.Health', to: 'State.MP', amount: '₹85.0Cr', time: '5m ago' },
  ]);

  // Simulate live blocks
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks(prev => {
         const newBlock = {
           id: (parseInt(prev[0].id, 16) + 1).toString(16).toUpperCase(),
           hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
           from: ['State.Kerala', 'Dist.Mumbai', 'Central.Edu'][Math.floor(Math.random()*3)],
           to: ['Vendor.Tech', 'Contractor.Build', 'Dist.Kochi'][Math.floor(Math.random()*3)],
           amount: `₹${(Math.random() * 10).toFixed(1)}Cr`,
           time: 'Just now'
         };
         return [newBlock, ...prev.slice(0, 3)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
      {/* Tech background elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent -z-10"></div>
      <div className="absolute -left-10 -bottom-10 opacity-10"><Hexagon size={120} className="text-indigo-500" strokeWidth={1} /></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Database className="text-indigo-400" /> Web3 Transparency Ledger
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Immutable, public smart-contract execution log for all tax disbursements.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Mainnet Syncing</span>
        </div>
      </div>

      <div className="space-y-4 font-mono text-sm relative z-10">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
          <div className="col-span-2">Block</div>
          <div className="col-span-3">Txn Hash</div>
          <div className="col-span-4 lg:col-span-3 hidden sm:block">Route (From → To)</div>
          <div className="col-span-3 lg:col-span-2 text-right">Value</div>
          <div className="col-span-4 lg:col-span-2 text-right hidden lg:block">Age</div>
        </div>
        
        <div className="space-y-2.5 relative">
           {blocks.map((block, idx) => (
             <div key={`${block.id}-${idx}`} className="grid grid-cols-12 gap-4 px-4 py-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:bg-slate-800 transition-colors items-center animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
               <div className="col-span-3 sm:col-span-2 text-indigo-400 font-bold flex items-center gap-1.5 cursor-pointer hover:underline">
                  <Hexagon size={14} /> {block.id}
               </div>
               <div className="col-span-4 sm:col-span-3 text-slate-300 flex items-center gap-1.5">
                  <Link2 size={14} className="text-slate-500" />
                  <span className="truncate">{block.hash}</span>
               </div>
               <div className="col-span-4 lg:col-span-3 hidden sm:flex items-center gap-2 text-slate-400 text-xs">
                  <span className="truncate max-w-[80px]" title={block.from}>{block.from}</span>
                  <span className="text-slate-600">→</span>
                  <span className="truncate max-w-[80px]" title={block.to}>{block.to}</span>
               </div>
               <div className="col-span-5 sm:col-span-3 lg:col-span-2 text-right text-emerald-400 font-bold">
                  {block.amount}
               </div>
               <div className="col-span-2 text-right text-slate-500 hidden lg:flex items-center justify-end gap-1.5 text-xs">
                  <Clock size={12} /> {block.time}
               </div>
             </div>
           ))}
        </div>
      </div>

      <button className="w-full mt-8 py-4 bg-slate-800/50 hover:bg-slate-700 border border-slate-600/50 rounded-2xl text-slate-300 text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg relative z-10">
        View Full Explorer <ExternalLink size={16} />
      </button>

    </div>
  );
}
