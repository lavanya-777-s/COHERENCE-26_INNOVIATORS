import { Workflow, Sparkles, TrendingDown, TrendingUp, ArrowRight, BrainCircuit, CheckCircle2 } from 'lucide-react';
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
  }
];

export default function ReallocationTab({ district }) {
  const [simulating, setSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [opts, setOpts] = useState(INITIAL_OPTIMIZATIONS);
  const [processingId, setProcessingId] = useState(null);
  const [completedId, setCompletedId] = useState(null);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setShowResults(true);
      setOpts(INITIAL_OPTIMIZATIONS); // reset if simulated again
    }, 2000);
  };

  const handleDismiss = (id) => {
    setOpts(prev => prev.filter(o => o.id !== id));
  };

  const handleExecute = (id) => {
    setProcessingId(id);
    setTimeout(() => {
      setProcessingId(null);
      setCompletedId(id);
      
      setTimeout(() => {
        setOpts(prev => prev.filter(o => o.id !== id));
        setCompletedId(null);
      }, 1500); // Remove after showing success checkmark
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" size={24} />
              AI Fund Reallocation Optimizer
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Forecast underutilization and prevent fund lapsing</p>
          </div>
          
          {!showResults && (
            <button 
              onClick={handleSimulate}
              disabled={simulating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
            >
              {simulating ? (
                <><Sparkles className="animate-spin" size={18} /> Analyzing Data...</>
              ) : (
                <><Sparkles size={18} /> Run Optimization Scan</>
              )}
            </button>
          )}
        </div>

        {!showResults && !simulating && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Workflow className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Scan Fiscal Inefficiencies</h3>
            <p className="text-slate-500 max-w-lg mx-auto mb-6">Our predictive model analyzes current spending velocity against historical trends to identify funds at risk of lapsing, and suggests optimal reallocations to high-performing sectors.</p>
          </div>
        )}

        {simulating && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Running Predictive Models</h3>
            <p className="text-slate-500 animate-pulse">Scanning 14 departments... cross-referencing spending velocity... identifying underutilization risks...</p>
          </div>
        )}

        {showResults && (
           <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="text-emerald-800 font-bold text-lg">Optimization Complete</h3>
                        <p className="text-emerald-700 text-sm">Found {opts.length} critical reallocations that could save funds from lapsing.</p>
                    </div>
                </div>
                {opts.length === 0 && (
                   <button onClick={handleSimulate} className="text-emerald-700 font-bold text-sm bg-emerald-100 px-4 py-2 rounded-lg hover:bg-emerald-200">Rescan</button>
                )}
              </div>

              {opts.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                   <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
                   <p className="text-slate-600 font-bold text-lg">All optimizations processed!</p>
                   <p className="text-slate-500 text-sm">The fiscal load is balanced.</p>
                </div>
              )}

              {opts.map((opt) => (
                <div key={opt.id} className="bg-white border text-left border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 transition-colors shadow-sm relative">
                  
                  {completedId === opt.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                       <div className="bg-emerald-100 p-4 rounded-full mb-3">
                           <CheckCircle2 size={32} className="text-emerald-600" />
                       </div>
                       <p className="font-bold text-emerald-800 text-lg">Reallocation Executed</p>
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                     
                     <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                        {/* FROM */}
                        <div className="flex-1 bg-rose-50 border border-rose-100 p-4 rounded-xl w-full">
                            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Take From (Underutilizing)</p>
                            <p className="text-lg font-bold text-rose-900">{opt.from}</p>
                            <div className="flex items-center gap-1 text-rose-600 text-sm mt-2 font-semibold">
                                <TrendingDown size={16} /> Velocity too slow
                            </div>
                        </div>

                        {/* ARROW */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                            <span className="text-2xl font-black text-indigo-600 mb-2">₹{opt.amount}Cr</span>
                            <div className="bg-slate-100 p-3 rounded-full hidden md:block">
                                <ArrowRight className="text-slate-400" size={24} />
                            </div>
                        </div>

                        {/* TO */}
                        <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 rounded-xl w-full">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Reallocate To (Over-performing)</p>
                            <p className="text-lg font-bold text-emerald-900">{opt.to}</p>
                            <div className="flex items-center gap-1 text-emerald-600 text-sm mt-2 font-semibold">
                                <TrendingUp size={16} /> Needs immediate funds
                            </div>
                        </div>
                     </div>

                     <div className="bg-slate-50 rounded-xl p-5">
                        <div className="mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Reasoning</span>
                            <p className="text-slate-700 font-medium text-sm mt-1 leading-relaxed">{opt.reason}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected Impact</span>
                            <p className="text-indigo-700 font-bold text-sm mt-1">{opt.impact}</p>
                        </div>
                     </div>

                  </div>
                  <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end gap-3 transition-opacity">
                     <button 
                       onClick={() => handleDismiss(opt.id)}
                       disabled={processingId === opt.id || completedId === opt.id}
                       className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-sm disabled:opacity-50"
                     >
                       Dismiss
                     </button>
                     <button 
                       onClick={() => handleExecute(opt.id)}
                       disabled={processingId === opt.id || completedId === opt.id}
                       className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-md disabled:opacity-80 flex items-center justify-center min-w-[180px]"
                     >
                       {processingId === opt.id ? (
                         <span className="flex items-center gap-2">
                           <Sparkles size={16} className="animate-spin" /> Executing...
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
