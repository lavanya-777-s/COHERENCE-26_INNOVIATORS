import { Workflow, Sparkles, TrendingDown, TrendingUp, ArrowRight, BrainCircuit } from 'lucide-react';
import { useState } from 'react';

export default function ReallocationTab({ district }) {
  const [simulating, setSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setShowResults(true);
    }, 2000);
  };

  const optimizations = [
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
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="text-emerald-800 font-bold text-lg">Optimization Complete</h3>
                    <p className="text-emerald-700 text-sm">Found 2 critical reallocations that could save ₹67.5Cr from lapsing.</p>
                </div>
              </div>

              {optimizations.map((opt) => (
                <div key={opt.id} className="bg-white border text-left border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 transition-colors shadow-sm relative">
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
                  <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end gap-3">
                     <button className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-sm">Dismiss</button>
                     <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-md">Execute Reallocation</button>
                  </div>
                </div>
              ))}
           </div>
        )}

      </div>
    </div>
  );
}
