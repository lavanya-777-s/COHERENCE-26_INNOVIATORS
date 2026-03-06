import { Workflow, Sparkles, TrendingDown, TrendingUp, ArrowRight, BrainCircuit, CheckCircle2, XCircle, History } from 'lucide-react';
import { useState } from 'react';

const INITIAL_OPTIMIZATIONS = [
  {
    id: 1,
    from: 'Tourism Development',
    to: 'Public Health',
    amount: 45.5,
    reason: 'Tourism Dept has only utilized 12% of Q1 budget. Public Health is fast approaching limit due to unexpected rural clinic demands. Forecasting 100% depletion in 3 weeks.',
    impact: '+18% better overall fund utilization. Prevents health sector stall.'
  },
  {
    id: 2,
    from: 'Urban Transport',
    to: 'Education Infrastructure',
    amount: 22.0,
    reason: 'Supply chain delays on transport procurement. Funds will lapse. Education has 5 pending approved smart-school projects ready for immediate execution.',
    impact: '0 funds lapsed. Immediate commencement of 5 educational projects.'
  },
  {
    id: 3,
    from: 'Public Works',
    to: 'Rural Electrification',
    amount: 15.8,
    reason: 'Contractor disputes have halted 3 major bridge projects. Funds are idle. Rural electrification targets for Q3 are falling behind due to recent material cost spikes.',
    impact: 'Keeps rural grid expansion on schedule. Avoids unspent lap-back penalties.'
  }
];

export default function ReallocationTab({ district, onReallocate }) {
  const [simulating, setSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [opts, setOpts] = useState(INITIAL_OPTIMIZATIONS);
  
  // History Tracking for GovTech Feel
  const [executed, setExecuted] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  
  const [processingId, setProcessingId] = useState(null);
  const [completedId, setCompletedId] = useState(null);
  const [dismissingId, setDismissingId] = useState(null);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setShowResults(true);
      // Only reset active opts if we haven't processed them all
      if (executed.length === 0 && dismissed.length === 0) {
        setOpts(INITIAL_OPTIMIZATIONS); 
      }
    }, 2000);
  };

  const handleDismiss = (id) => {
    setDismissingId(id);
    const item = opts.find(o => o.id === id);
    setTimeout(() => {
      setDismissed(prev => [item, ...prev]);
      setOpts(prev => prev.filter(o => o.id !== id));
      setDismissingId(null);
    }, 600);
  };

  const handleExecute = (id) => {
    setProcessingId(id);
    const item = opts.find(o => o.id === id);
    setTimeout(() => {
      setProcessingId(null);
      setCompletedId(id);
      
      // Fire to global dashboard transaction history
      if (onReallocate) onReallocate(item);

      setTimeout(() => {
        setExecuted(prev => [item, ...prev]);
        setOpts(prev => prev.filter(o => o.id !== id));
        setCompletedId(null);
      }, 1500); // Remove after showing success checkmark
    }, 1500);
  };

  const totalSaved = executed.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        
        {/* Header & Stats Banner */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" size={24} />
              AI Fund Reallocation Optimizer
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Forecast underutilization and dynamically balance the fiscal load</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Executed</span>
                  <span className="text-sm font-black text-slate-800 leading-tight">{executed.length}</span>
                </div>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                <XCircle size={16} className="text-rose-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Dismissed</span>
                  <span className="text-sm font-black text-slate-800 leading-tight">{dismissed.length}</span>
                </div>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm">
                <Sparkles size={16} className="text-indigo-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase leading-none">Funds Saved</span>
                  <span className="text-sm font-black leading-tight">₹{totalSaved.toFixed(1)}Cr</span>
                </div>
             </div>
          </div>
        </div>

        {/* Initial CTA Box */}
        {!showResults && !simulating && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center animate-in zoom-in-95">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Workflow className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Scan Fiscal Inefficiencies</h3>
            <p className="text-slate-500 max-w-lg mx-auto mb-6">Our predictive model analyzes current spending velocity against historical trends to identify funds at risk of lapsing, and suggests optimal reallocations to high-performing sectors.</p>
            <button 
              onClick={handleSimulate}
              className="bg-indigo-600 hover:bg-indigo-700 mx-auto text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-200"
            >
              <Sparkles size={18} /> Initialize AI Scan
            </button>
          </div>
        )}

        {/* Loading State */}
        {simulating && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Running Predictive Models</h3>
            <p className="text-slate-500 animate-pulse">Scanning departments... cross-referencing spending velocity... identifying underutilization risks...</p>
          </div>
        )}

        {/* Results Area */}
        {showResults && (
           <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              
              {opts.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                          <Sparkles size={24} />
                      </div>
                      <div>
                          <h3 className="text-emerald-800 font-bold text-lg">AI Recommendations Active</h3>
                          <p className="text-emerald-700 text-sm">Found {opts.length} critical actions requiring official review.</p>
                      </div>
                  </div>
                </div>
              )}

              {/* Empty Queue State */}
              {opts.length === 0 && showResults && (
                <div className="flex flex-col md:flex-row gap-6">
                  
                  <div className="flex-1 text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                     <CheckCircle2 size={56} className="text-emerald-400 mb-4" />
                     <h3 className="text-slate-800 font-bold text-xl mb-1">Queue Cleared</h3>
                     <p className="text-slate-500 text-sm max-w-sm">All AI recommendations have been processed. The fiscal load is currently optimal.</p>
                     <button onClick={() => { setExecuted([]); setDismissed([]); handleSimulate(); }} className="mt-6 text-indigo-600 font-bold text-sm bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2">
                        <History size={16} /> Reset & Rescan
                     </button>
                  </div>
                  
                  {/* Miniature History Feed */}
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-h-[300px] overflow-y-auto hide-scrollbar">
                     <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <History size={18} className="text-slate-400"/> Session Audit Log
                     </h4>
                     
                     <div className="space-y-3">
                        {executed.map((ex, i) => (
                           <div key={`ex-${i}`} className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start gap-3">
                              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                              <div>
                                 <p className="text-sm font-bold text-emerald-900">Executed Transfer</p>
                                 <p className="text-xs text-emerald-700 font-medium">₹{ex.amount}Cr: {ex.from} → {ex.to}</p>
                              </div>
                           </div>
                        ))}
                        {dismissed.map((ds, i) => (
                           <div key={`ds-${i}`} className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start gap-3">
                              <XCircle size={16} className="text-rose-500 mt-0.5" />
                              <div>
                                 <p className="text-sm font-bold text-rose-900">Dismissed AI Suggestion</p>
                                 <p className="text-xs text-rose-700 font-medium">Ignored ₹{ds.amount}Cr transfer rule for {ds.from}.</p>
                              </div>
                           </div>
                        ))}
                        {executed.length === 0 && dismissed.length === 0 && (
                          <p className="text-center text-sm text-slate-400 py-4 font-medium">No actions taken this session.</p>
                        )}
                     </div>
                  </div>
                </div>
              )}

              {/* Active Recommendations */}
              {opts.map((opt) => (
                <div key={opt.id} className={`bg-white border text-left rounded-2xl overflow-hidden shadow-sm relative transition-all duration-300 ${
                  dismissingId === opt.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                } ${completedId === opt.id ? 'border-emerald-400 shadow-emerald-100' : 'border-slate-200 hover:border-indigo-300'}`}>
                  
                  {completedId === opt.id && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                       <div className="bg-emerald-100 p-4 rounded-full mb-3">
                           <CheckCircle2 size={36} className="text-emerald-600" />
                       </div>
                       <p className="font-extrabold text-emerald-800 text-xl tracking-tight">Reallocation Executed Securely</p>
                       <p className="text-emerald-600 font-medium mt-1">Funds locked to {opt.to}</p>
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                     
                     <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6 mb-6">
                        {/* FROM */}
                        <div className="flex-1 bg-rose-50 border border-rose-100 p-4 md:p-5 rounded-xl w-full">
                            <p className="text-[10px] sm:text-xs font-bold text-rose-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><TrendingDown size={14}/> Underutilizing Origin</p>
                            <p className="text-base sm:text-lg font-bold text-rose-900 leading-tight">{opt.from}</p>
                        </div>

                        {/* ARROW */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                            <span className="text-2xl font-black text-indigo-600 mb-1 lg:mb-2 whitespace-nowrap">₹{opt.amount}Cr</span>
                            <div className="bg-slate-100 p-2 lg:p-3 rounded-full hidden md:block border border-slate-200/60 shadow-inner">
                                <ArrowRight className="text-slate-400" size={20} />
                            </div>
                        </div>

                        {/* TO */}
                        <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 md:p-5 rounded-xl w-full">
                            <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><TrendingUp size={14}/> Over-performing Target</p>
                            <p className="text-base sm:text-lg font-bold text-emerald-900 leading-tight">{opt.to}</p>
                        </div>
                     </div>

                     <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                        <div className="mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><BrainCircuit size={14}/> AI Reasoning</span>
                            <p className="text-slate-700 font-medium text-sm mt-1.5 leading-relaxed">{opt.reason}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles size={14}/> Projected Impact</span>
                            <p className="text-indigo-700 font-bold text-sm mt-1.5">{opt.impact}</p>
                        </div>
                     </div>

                  </div>
                  <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col sm:flex-row justify-end gap-3 transition-opacity">
                     <button 
                       onClick={() => handleDismiss(opt.id)}
                       disabled={processingId === opt.id || completedId === opt.id || dismissingId === opt.id}
                       className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Dismiss / Reject
                     </button>
                     <button 
                       onClick={() => handleExecute(opt.id)}
                       disabled={processingId === opt.id || completedId === opt.id || dismissingId === opt.id}
                       className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md shadow-indigo-200 disabled:opacity-80 flex items-center justify-center min-w-[200px]"
                     >
                       {processingId === opt.id ? (
                         <span className="flex items-center gap-2">
                           <Sparkles size={16} className="animate-spin" /> Executing Action...
                         </span>
                       ) : (
                         "Execute Reallocation"
                       )}
                     </button>
                  </div>
                </div>
              ))}
           </div>
        )}

      </div>
    </div>
  );
}
