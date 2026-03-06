import { AlertBox, AlertCircle, AlertTriangle, CheckCircle, Clock, FileWarning, Mail, ShieldAlert, UserX, PauseCircle, Users } from 'lucide-react';
import { useState } from 'react';

export default function AuditorResolutionHub({ district }) {
  // Mock data for incoming auditor flags
  const [flags, setFlags] = useState([
    {
      id: 'AUD-2025-081',
      date: 'Today, 10:30 AM',
      department: 'Roads & Highways',
      project: 'NH-44 Bypass Resurfacing',
      issue: 'Fund Utilization mismatch. 80% funds withdrawn but physical progress reported by satellite is only 30%.',
      severity: 'Critical',
      amountAtRisk: '₹14.5 Cr',
      status: 'Pending Review',
      timeline: [
        { time: '10:30 AM', event: 'Anomaly Flagged by Central Auditor Node' }
      ]
    },
    {
      id: 'AUD-2025-076',
      date: 'Yesterday, 04:15 PM',
      department: 'Health Department',
      project: 'Rural Clinic Supply Chain',
      issue: 'Identical vendor invoices submitted across 4 different districts simultaneously.',
      severity: 'High',
      amountAtRisk: '₹2.2 Cr',
      status: 'Pending Review',
      timeline: [
        { time: 'Yesterday 04:15 PM', event: 'Pattern detected by Predictor AI' },
        { time: 'Yesterday 04:20 PM', event: 'Verified and escalated by Auditor' }
      ]
    }
  ]);

  const [selectedFlag, setSelectedFlag] = useState(null);

  const takeAction = (flagId, actionType) => {
    setFlags(prev => prev.map(flag => {
      if (flag.id === flagId) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let newEvent = '';
        let newStatus = '';
        
        switch (actionType) {
          case 'summon':
            newEvent = 'Summon Notice dispatched to Department Secretary';
            newStatus = 'Awaiting Clarification';
            break;
          case 'freeze':
            newEvent = 'Account Freeze initiated at State Treasury Level 🔒';
            newStatus = 'Funds Frozen';
            break;
          case 'dispatch':
            newEvent = 'Physical Inspection Team deployed to coordinates';
            newStatus = 'Under Field Inspection';
            break;
          case 'resolve':
            newEvent = 'Issue resolved. Compliance confirmed.';
            newStatus = 'Closed';
            break;
          default:
            return flag;
        }

        const newTimelineContext = [...flag.timeline, { time: timeNow, event: newEvent }];
        if (selectedFlag && selectedFlag.id === flagId) {
             setSelectedFlag({ ...flag, status: newStatus, timeline: newTimelineContext });
        }
        
        return { ...flag, status: newStatus, timeline: newTimelineContext };
      }
      return flag;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-indigo-600" size={28} /> Auditor Resolution Hub
            </h2>
            <p className="text-slate-500 font-medium mt-1">Direct inbox for escalating and resolving third-party or AI governance audits.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 flex items-center gap-2">
               <AlertCircle size={18} className="text-rose-600" />
               <span className="text-rose-800 font-bold text-sm">{flags.filter(f => f.status === 'Pending Review').length} Pending Actions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inbox Queue */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Mail size={18} className="text-slate-500"/> Action Queue
             </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 relative hide-scrollbar">
            {flags.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <CheckCircle size={40} className="mb-2 opacity-50"/>
                    <p className="font-bold">Zero active anomalies</p>
                </div>
            ) : (
                flags.map(flag => (
                <div 
                    key={flag.id}
                    onClick={() => setSelectedFlag(flag)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedFlag?.id === flag.id 
                        ? 'border-indigo-400 bg-indigo-50 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-500">{flag.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            flag.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>{flag.severity}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm truncate">{flag.department}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-1 truncate">{flag.project}</p>
                    
                    <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-3">
                        <span className="text-xs font-bold text-slate-400">{flag.date}</span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${
                            flag.status === 'Pending Review' ? 'text-rose-500' : 
                            flag.status === 'Closed' ? 'text-emerald-500' : 'text-indigo-500'
                        }`}>
                           {flag.status === 'Pending Review' ? <AlertCircle size={10}/> : 
                            flag.status === 'Closed' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                           {flag.status}
                        </span>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
          {!selectedFlag ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <FileWarning size={64} className="mb-4 opacity-20" />
                <p className="font-medium text-slate-500">Select an anomaly flag from the queue to take action.</p>
             </div>
          ) : (
             <>
               {/* Detail Header */}
               <div className="p-8 border-b border-slate-100">
                   <div className="flex justify-between items-start mb-4">
                       <div>
                           <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-xl font-black text-slate-900">{selectedFlag.department}</h3>
                             <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{selectedFlag.id}</span>
                           </div>
                           <p className="text-sm font-bold text-slate-500">Project: {selectedFlag.project}</p>
                       </div>
                       <div className="text-right">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Exposure</p>
                           <p className="text-2xl font-black text-rose-600">{selectedFlag.amountAtRisk}</p>
                       </div>
                   </div>

                   <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mt-6">
                       <p className="text-sm font-bold text-rose-800">Auditor's Note:</p>
                       <p className="text-sm font-medium text-rose-700 mt-1 leading-relaxed">{selectedFlag.issue}</p>
                   </div>
               </div>

               {/* Timeline & Actions */}
               <div className="flex-1 p-8 bg-slate-50/50 flex flex-col justify-between overflow-y-auto hide-scrollbar">
                   
                   <div className="mb-8">
                       <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                           <Clock size={16} className="text-indigo-500"/> Chain of Custody
                       </h4>
                       <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-300 before:to-slate-200">
                           {selectedFlag.timeline.map((event, idx) => (
                               <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                   <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-indigo-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                   <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                       <div className="flex items-center justify-between mb-1">
                                           <time className="text-[10px] font-bold text-indigo-500">{event.time}</time>
                                       </div>
                                       <div className="text-xs font-bold text-slate-700">{event.event}</div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Action Buttons */}
                   {selectedFlag.status !== 'Closed' && (
                   <div className="mt-auto">
                       <h4 className="text-sm font-bold text-slate-800 mb-3">Gov. Action Directives</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           <button 
                             onClick={() => takeAction(selectedFlag.id, 'summon')}
                             className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 group transition-all"
                           >
                               <UserX className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" size={24}/>
                               <span className="font-bold text-sm text-slate-700 group-hover:text-amber-700">Summon Secy</span>
                           </button>
                           
                           <button 
                             onClick={() => takeAction(selectedFlag.id, 'freeze')}
                             className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 group transition-all"
                           >
                               <PauseCircle className="text-rose-500 mb-2 group-hover:scale-110 transition-transform" size={24}/>
                               <span className="font-bold text-sm text-slate-700 group-hover:text-rose-700">Freeze Funds</span>
                           </button>

                           <button 
                             onClick={() => takeAction(selectedFlag.id, 'dispatch')}
                             className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 group transition-all"
                           >
                               <Users className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={24}/>
                               <span className="font-bold text-sm text-slate-700 group-hover:text-blue-700">Dispatch Squad</span>
                           </button>
                       </div>
                       {selectedFlag.status !== 'Pending Review' && (
                           <button onClick={() => takeAction(selectedFlag.id, 'resolve')} className="w-full mt-3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-md text-sm cursor-pointer">
                               Mark Resolved & Close
                           </button>
                       )}
                   </div>
                   )}
               </div>
             </>
          )}
        </div>

      </div>
    </div>
  );
}
