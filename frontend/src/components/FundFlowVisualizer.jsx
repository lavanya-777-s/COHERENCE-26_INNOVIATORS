import { CheckCircle2, ChevronRight, Landmark, IndianRupee, Truck, Building2, AlertTriangle } from 'lucide-react';

export default function FundFlowVisualizer({ districtName }) {
  const flowNodes = [
    { label: 'Central Treasury', amount: '₹100 Cr', icon: Landmark, color: 'indigo', status: 'verified', drop: '0%' },
    { label: 'State Allocation', amount: '₹98.5 Cr', icon: Building2, color: 'blue', status: 'verified', drop: '1.5%' },
    { label: `${districtName || 'District'} Nodal`, amount: '₹92.0 Cr', icon: IndianRupee, color: 'emerald', status: 'warning', drop: '6.5%' },
    { label: 'Primary Contractor', amount: '₹74.5 Cr', icon: Truck, color: 'amber', status: 'alert', drop: '17.5%' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all">
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          🔍 Follow the Rupee
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Trace how a ₹100Cr central block gets diluted before reaching the grassroots.</p>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-100 -translate-y-1/2 rounded-full">
           <div className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-500 opacity-50 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative z-10">
          {flowNodes.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div key={idx} className="relative group">
                {idx !== flowNodes.length -1 && (
                   <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                      <ChevronRight size={24} />
                   </div>
                )}
                
                <div className={`bg-white border rounded-2xl p-5 lg:p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                   node.status === 'alert' ? 'border-rose-200 hover:shadow-rose-100 hover:border-rose-400' :
                   node.status === 'warning' ? 'border-amber-200 hover:shadow-amber-100 hover:border-amber-400' :
                   'border-indigo-100/50 hover:border-indigo-300 hover:shadow-indigo-100'
                }`}>
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                     node.status === 'alert' ? 'bg-rose-50 text-rose-600' :
                     node.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                     'bg-indigo-50/50 text-indigo-600'
                  }`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  
                  <h3 className="font-bold text-slate-800 mb-1 leading-tight">{node.label}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">{node.amount}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    {node.status === 'alert' ? (
                       <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded"><AlertTriangle size={12}/> High Attrition</span>
                    ) : node.status === 'warning' ? (
                       <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded">Moderate Loss</span>
                    ) : (
                       <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded"><CheckCircle2 size={12}/> Verified</span>
                    )}
                    
                    {idx > 0 && (
                      <span className="text-slate-400">-{node.drop} gap</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 flex items-start gap-4">
         <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
         <p className="text-sm text-slate-600 font-medium">
           <strong className="text-slate-800">Transparency Insight:</strong> By the time funds reach the primary contractor, nearly <strong>25.5%</strong> is lost to administrative overhead, processing delays, and unverifiable line items.
         </p>
      </div>
    </div>
  );
}
