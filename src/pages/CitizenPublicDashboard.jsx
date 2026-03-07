import { AlertCircle, BarChart3, TrendingUp, Users, ChevronDown, MapPin, Search, ShieldAlert, Fingerprint, Clock, CheckCircle, Landmark, CheckSquare, MessageSquare, ExternalLink, ShieldCheck, Database, Zap, ArrowRight, MinusCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { STATIC_DATA, analyzeAnomalies } from '../data/budgetStaticData';

// --- NEW SUB-COMPONENT: Blockchain Explorer Modal ---
const BlockchainExplorerModal = ({ txn, onClose }) => {
    if (!txn) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 flex flex-col max-h-[90vh]">
                <div className="p-6 bg-gradient-to-r from-indigo-900/50 to-slate-900 border-b border-indigo-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Database className="text-indigo-400" size={24} />
                        <div>
                            <h2 className="text-white font-bold text-xl tracking-tight">Public Blockchain Ledger</h2>
                            <p className="text-indigo-300/60 text-[10px] font-mono uppercase tracking-widest leading-none mt-1">Immutable Verification Node #402-B</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <AlertCircle size={20} className="rotate-45" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                    {/* Transaction Identity */}
                    <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Transaction Hash</span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20 uppercase">Verified</span>
                        </div>
                        <p className="font-mono text-xs text-slate-300 break-all bg-black/30 p-3 rounded-lg border border-white/5">
                            0x{txn.hash || '4f2e9d...'}{Array(32).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}
                        </p>
                    </div>

                    {/* Verification Flow */}
                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-indigo-500/20"></div>

                        {[
                            { step: 'Central Treasury', status: 'Authorized', icon: <Landmark size={14} />, color: 'text-blue-400' },
                            { step: 'Smart Contract V2.1', status: 'Executed', icon: <ShieldCheck size={14} />, color: 'text-indigo-400' },
                            { step: 'District Disbursement', status: 'Settled', icon: <MapPin size={14} />, color: 'text-emerald-400' },
                            { step: 'Contractor Wallet', status: 'Received', icon: <Users size={14} />, color: 'text-amber-400' },
                        ].map((node, i) => (
                            <div key={i} className="flex items-start gap-6 relative mb-6 last:mb-0">
                                <div className="z-10 bg-slate-900 border-2 border-indigo-500 p-2 rounded-full ring-4 ring-slate-900 ring-offset-0">
                                    <div className={node.color}>{node.icon}</div>
                                </div>
                                <div className="pt-1 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-bold text-slate-200">{node.step}</h4>
                                        <span className="text-[10px] font-mono text-slate-500">{new Date(Date.now() - (3 - i) * 3600000).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Verified by 12/12 Consensus Nodes</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="text-indigo-400" size={20} />
                            <div>
                                <p className="text-indigo-200 text-xs font-bold">Consensus Method</p>
                                <p className="text-indigo-300/60 text-[10px] uppercase font-bold tracking-wider">Proof of Governance (PoG)</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/40 border border-indigo-400/30">
                            Download Certificate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CitizenPublicDashboard() {
    // Use Maharashtra as default for Indian dashboard
    const defaultStateId = STATIC_DATA.states.find(s => s.id === 'mh')?.id || STATIC_DATA.states[0]?.id || '';
    const defaultState = STATIC_DATA.states.find(s => s.id === defaultStateId);
    const defaultDistrictId = defaultState?.districts[0]?.id || '';

    const [selectedState, setSelectedState] = useState(defaultStateId);
    const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrictId);

    const [globalLeakages, setGlobalLeakages] = useState([]);
    const [toastMessage, setToastMessage] = useState('');
    const [activeTxn, setActiveTxn] = useState(null);
    const [tracedProject, setTracedProject] = useState(null);

    // Auto-update district when state changes
    useEffect(() => {
        const s = STATIC_DATA.states.find(st => st.id === selectedState);
        if (s && s.districts.length > 0) {
            // Only update if current district is NOT in the new state
            const isDistrictInState = s.districts.some(d => d.id === selectedDistrict);
            if (!isDistrictInState) {
                setSelectedDistrict(s.districts[0].id);
            }
        }
    }, [selectedState]);

    // Extract Global Leakages ONCE
    useEffect(() => {
        const allAnomalies = [];
        STATIC_DATA.states.forEach(s => {
            s.districts.forEach(d => {
                d.departments.forEach(dept => {
                    const analysis = analyzeAnomalies(dept);
                    if (analysis.alert) {
                        allAnomalies.push({
                            department: dept.name,
                            project: `${d.name} Region`,
                            amount: Math.round(Math.abs(analysis.variance) / 100000).toLocaleString() + 'L',
                            risk: analysis.risk === 'high' ? 'High' : (analysis.risk === 'medium' ? 'Medium' : 'Low'),
                            variancePercent: analysis.variancePercent
                        });
                    }
                });
            });
        });
        allAnomalies.sort((a, b) => b.variancePercent - a.variancePercent);
        setGlobalLeakages(allAnomalies.slice(0, 5));
    }, []);

    const currentState = STATIC_DATA.states.find(s => s.id === selectedState);
    const currentDistrict = currentState?.districts.find(d => d.id === selectedDistrict);

    const lastSyncTime = useMemo(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), []);

    // Compute local stats based ONLY on the selected district
    const localStats = useMemo(() => {
        if (!currentDistrict) return null;
        let totalAlloc = currentDistrict.allocation;
        let totalSpent = currentDistrict.spent;

        // Safety check format
        if (!totalAlloc) {
            totalAlloc = currentDistrict.departments.reduce((sum, d) => sum + d.allocated, 0);
            totalSpent = currentDistrict.departments.reduce((sum, d) => sum + d.spent, 0);
        }

        const utilizationRate = totalAlloc > 0 ? ((totalSpent / totalAlloc) * 100).toFixed(1) : 0;

        const formattedDepartments = currentDistrict.departments.map(dept => {
            const percentage = dept.allocated > 0 ? Math.round((dept.spent / dept.allocated) * 100) : 0;
            return {
                name: dept.name,
                allocated: Math.round(dept.allocated / 100000), // L format
                spent: Math.round(dept.spent / 100000),
                percentage
            };
        }).sort((a, b) => b.percentage - a.percentage);

        // Extract raw projects for citizens to trace
        const localProjects = currentDistrict.departments.flatMap(dept =>
            dept.projects.map(p => ({ ...p, department: dept.name }))
        );

        // Aggregate public transactions for the ledger
        const publicTransactions = localProjects.map(proj => ({
            id: proj.id,
            hash: `TXN-P-${proj.id}-${proj.name.length}${proj.allocated.toString().slice(-2)}`,
            project: proj.name,
            dept: proj.department,
            amount: (proj.spent / 100000).toFixed(2) + 'L',
            date: 'Today, ' + lastSyncTime,
            status: 'Verified'
        })).reverse(); // Reverse for latest first, avoiding string ID sort NaN issues

        return { totalAlloc, totalSpent, utilizationRate, departments: formattedDepartments, localProjects, publicTransactions };
    }, [currentDistrict, lastSyncTime]);

    const handleFlagGhostProject = (projectName) => {
        setToastMessage(`🚨 Report for "${projectName}" sent to Auditor Hub anonymously.`);
        setTimeout(() => setToastMessage(''), 4000);
    };

    if (!localStats) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white pb-20 relative">

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-full shadow-2xl shadow-rose-900/50 flex items-center gap-3 animate-in slide-in-from-top-10 fade-in duration-300 font-bold border border-rose-400">
                    <ShieldAlert size={20} />
                    {toastMessage}
                </div>
            )}

            {/* Hero Section */}
            <section className="pt-20 pb-12 px-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-500/30">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs tracking-wider border border-indigo-500/30 mb-4 uppercase">Direct Public Oversight</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Know Your Taxes.</h1>
                        <p className="text-indigo-200 text-lg max-w-xl font-medium">Transparent budget tracking for every citizen. View exactly where funds are deployed in your home district down to the project level.</p>
                    </div>

                    {/* Location Selectors */}
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
                        <div className="flex items-center gap-3 mb-4 text-indigo-300">
                            <MapPin size={20} />
                            <h3 className="font-bold">Select Your Local Area</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">State / Region</label>
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="appearance-none w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl font-bold text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                    {STATIC_DATA.states.map(state => (
                                        <option key={state.id} value={state.id}>{state.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 bottom-3.5 text-slate-500 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">District / City</label>
                                <select
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    className="appearance-none w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl font-bold text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                    {currentState?.districts.map(district => (
                                        <option key={district.id} value={district.id}>{district.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 bottom-3.5 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-8">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3 px-1">
                        <h2 className="text-xl font-bold text-slate-900">Live Numbers for {currentDistrict?.name}</h2>
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    </div>
                    {/* Trust Marker Element */}
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                        <CheckCircle size={14} className="text-emerald-500" />
                        Synced with Treasury: Today at {lastSyncTime}
                    </div>
                </div>

                {/* Local Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:border-indigo-300 transition-colors">
                        <div className="bg-indigo-50 p-3.5 rounded-xl">
                            <BarChart3 className="text-indigo-600" size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Allocated Budget</p>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">₹{(localStats.totalAlloc / 10000000).toFixed(2)}Cr</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:border-emerald-300 transition-colors">
                        <div className="bg-emerald-50 p-3.5 rounded-xl">
                            <TrendingUp className="text-emerald-600" size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fund Disbursed</p>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">₹{(localStats.totalSpent / 10000000).toFixed(2)}Cr</p>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:border-violet-300 transition-colors">
                        <div className="bg-violet-50 p-3.5 rounded-xl">
                            <Users className="text-violet-600" size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Local Utilization</p>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{localStats.utilizationRate}%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Department Breakdown */}
                    <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">📊 Sector Spending</h2>
                        <div className="space-y-5">
                            {localStats.departments.map((dept, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{dept.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium">₹{dept.spent}L / ₹{dept.allocated}L</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${dept.percentage > 100 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {dept.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${dept.percentage > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'}`}
                                            style={{ width: `${Math.min(dept.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    {dept.percentage > 100 && <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> Over Budget</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Local Projects Tracker with Whistleblower */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">📍 Active Ward Projects</h2>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">Track exact funds meant for your neighborhood</p>
                            </div>
                            <div className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-sm">
                                {localStats.localProjects.length} Verified
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar-dark">
                            {localStats.localProjects.length === 0 ? (
                                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                                    <p className="text-slate-500 font-medium">No verified projects found for this local region yet.</p>
                                </div>
                            ) : (
                                localStats.localProjects.map((proj, idx) => {
                                    const pSpent = proj.spent / 100000;
                                    const pAlloc = proj.allocated / 100000;
                                    const percent = Math.min((pSpent / pAlloc) * 100, 100);
                                    const txnId = `TXN-P-${proj.id}-${proj.name.length}${proj.allocated.toString().slice(-2)}`;
                                    const isTraced = tracedProject === proj.id;

                                    return (
                                        <div key={idx} className={`bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col gap-4 relative overflow-hidden ${isTraced ? 'border-indigo-400 ring-1 ring-indigo-500/20 shadow-indigo-100' : ''}`}>

                                            {/* Tracing Background Pulse */}
                                            {isTraced && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-emerald-500/5 animate-pulse pointer-events-none"></div>
                                            )}

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">{proj.department}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${proj.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {proj.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                                        {proj.name}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setActiveTxn({ id: proj.id, hash: txnId }); }}
                                                            className="text-indigo-400 hover:text-indigo-600 transition-colors"
                                                            title="View Blockchain Ledger"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </button>
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 mb-2">
                                                        <Fingerprint size={12} className="text-indigo-400" />
                                                        <span
                                                            onClick={() => setActiveTxn({ id: proj.id, hash: txnId })}
                                                            className="font-mono text-[10px] text-indigo-500 tracking-wide bg-indigo-50 px-1.5 rounded border border-indigo-100 uppercase cursor-pointer hover:bg-indigo-100 transition-colors"
                                                        >
                                                            {txnId}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                            <div className={`h-full ${proj.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div>
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-500">₹{pSpent.toFixed(1)}L <span className="text-slate-400 font-medium">of ₹{pAlloc.toFixed(1)}L</span></p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setTracedProject(isTraced ? null : proj.id)}
                                                        className={`flex items-center gap-2 px-3 py-2 border-2 ${isTraced ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:bg-indigo-50'} text-xs font-bold rounded-lg transition-all relative group`}
                                                    >
                                                        <Search size={16} className={isTraced ? 'animate-spin' : ''} />
                                                        <span>{isTraced ? 'Fund Traced' : 'Follow The Rupee'}</span>
                                                        {!isTraced && (
                                                            <span className="absolute -top-2 -right-2 bg-indigo-500 text-[8px] text-white px-1 rounded-full animate-bounce">NEW</span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleFlagGhostProject(proj.name)}
                                                        title="This project doesn't exist? Report it!"
                                                        className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold rounded-lg transition-all"
                                                    >
                                                        <AlertCircle size={16} />
                                                        <span className="md:hidden lg:inline">Report Ghost</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Funding Path Visualization (Conditional) */}
                                            {isTraced && (
                                                <div className="mt-2 pt-4 border-t border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                                                    <div className="flex items-center justify-between px-2">
                                                        <div className="flex flex-col items-center gap-1 group/node cursor-default">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-blue-200">
                                                                <Landmark size={14} />
                                                            </div>
                                                            <span className="text-[9px] font-bold text-slate-500 uppercase">Treasury</span>
                                                        </div>
                                                        <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-indigo-300 mx-1 relative overflow-hidden">
                                                            <div className="absolute inset-0 animate-shimmer"></div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-2 border-indigo-200">
                                                                <Database size={14} />
                                                            </div>
                                                            <span className="text-[9px] font-bold text-slate-500 uppercase">District</span>
                                                        </div>
                                                        <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-emerald-300 mx-1 relative overflow-hidden">
                                                            <div className="absolute inset-0 animate-shimmer"></div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-emerald-200">
                                                                <Users size={14} />
                                                            </div>
                                                            <span className="text-[9px] font-bold text-slate-500 uppercase">Contractor</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-center text-indigo-500 font-bold mt-3 bg-indigo-50 py-1 rounded-full border border-indigo-100">
                                                        Live Status: Fund Settlement Confirmed at 0x4f2..93a
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Contractor Accountablity (Ranking) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 bg-rose-500/5 rounded-full blur-3xl -mr-12 -mt-12"></div>
                    <div className="flex justify-between items-center mb-6 relative">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ShieldAlert className="text-rose-500" size={20} />
                                Contractor Accountability Hub
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Audit ranking of private contractors handling public funds.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded border border-rose-200">⚠️ 4 High-Risk Patterns</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agency Name</th>
                                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ongoing Value</th>
                                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Civic Rating</th>
                                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: "Global Infra-Build LTD", value: "₹45.5Cr", rating: "4.2", status: "Verified", color: "emerald" },
                                    { name: "Apex Road Services", value: "₹12.1Cr", rating: "1.8", status: "Investigation", color: "rose" },
                                    { name: "Metro Green Projects", value: "₹28.4Cr", rating: "3.5", status: "Caution", color: "amber" },
                                ].map((contractor, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4">
                                            <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{contractor.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">Reg: GOV-IN-{i}92-X</p>
                                        </td>
                                        <td className="py-4 text-slate-900 font-extrabold text-sm">{contractor.value}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`h-1.5 w-1.5 rounded-full ${contractor.rating < 2.5 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                <span className="font-bold text-slate-700 text-sm">{contractor.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-${contractor.color}-100 text-${contractor.color}-700 border border-${contractor.color}-200`}>
                                                {contractor.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- NEW SECTION: Public Transaction Ledger (Live) --- */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Database className="text-indigo-400" size={20} />
                                <span className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em]">Blockchain Network</span>
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Public Transaction Ledger</h2>
                            <p className="text-slate-400 text-sm mt-1 font-medium">Real-time immutable record of every rupee spent in {currentDistrict?.name}.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Network Status</span>
                                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Operational
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-dark">
                        {localStats.publicTransactions.map((txn, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveTxn({ id: txn.id, hash: txn.hash })}
                                className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer group/row"
                            >
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-xl group-hover/row:scale-110 transition-transform">
                                        <Landmark size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{txn.date}</p>
                                        <h3 className="text-white font-bold group-hover/row:text-indigo-300 transition-colors uppercase">{txn.project}</h3>
                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 break-all">ID: {txn.hash}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Amount Disbursed</p>
                                        <p className="text-lg font-black text-emerald-400 leading-none">₹{txn.amount}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <ShieldCheck className="text-emerald-500" size={14} />
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{txn.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-center">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="h-px w-12 bg-slate-800"></span>
                            End of Regional Ledger
                            <span className="h-px w-12 bg-slate-800"></span>
                        </p>
                    </div>
                </div>

                {/* Global Flagged Transactions (Trending Issues) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-slate-900 border-l-4 border-rose-500 pl-3">Trending Public Flags & Investigations</h2>
                        <p className="text-sm text-slate-500 mt-1 pl-4">Highest risk anomalies currently under review by the Auditor General's office nationwide.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {globalLeakages.map((leak, idx) => (
                            <div key={idx} className={`border p-4 rounded-xl flex items-start gap-3 bg-rose-50 border-rose-200`}>
                                <div className="bg-rose-100 p-2 rounded-lg shrink-0">
                                    <AlertCircle className="text-rose-600" size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 leading-tight mb-1">{leak.department} — {leak.project}</p>
                                    <p className="text-sm font-medium text-slate-600">Off-budget by: <span className="font-bold">₹{leak.amount}</span></p>
                                    <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded border ${leak.risk === 'High' ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
                                        {leak.risk} Risk / {leak.variancePercent.toFixed(0)}% Variance
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- NEW SECTION: Political Party Accountability & Feedback --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Political Party Manifesto Tracker */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Landmark className="text-blue-600" size={20} />
                                    Elected Representative Progress
                                </h2>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">Tracking official manifesto promises against delivered budgets</p>
                            </div>
                            <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-sm border border-blue-200">
                                Term: 2024-2029
                            </span>
                        </div>

                        <div className="space-y-5">
                            {[
                                { promise: "Build 5 New Healthcare Clinics", status: "In Progress", progress: 60, allocated: "₹12.5Cr", spent: "₹7.5Cr" },
                                { promise: "Upgrade Main District Highway", status: "Completed", progress: 100, allocated: "₹45.0Cr", spent: "₹45.0Cr" },
                                { promise: "Digital Smart Schools Program", status: "Delayed", progress: 25, allocated: "₹20.0Cr", spent: "₹5.0Cr" },
                            ].map((manifesto, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-1 rounded-full ${manifesto.progress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                                <CheckSquare size={16} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{manifesto.promise}</h3>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">Manifesto ID: EL-24-{900 + idx}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${manifesto.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                manifesto.status === 'Delayed' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {manifesto.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div className={`h-full ${manifesto.progress === 100 ? 'bg-emerald-500' : manifesto.progress < 50 ? 'bg-rose-400' : 'bg-blue-500'}`} style={{ width: `${manifesto.progress}%` }}></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <span className="text-slate-900">₹{manifesto.spent}</span> / ₹{manifesto.allocated}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Citizen Rewards Portal */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl text-white text-center flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-1000"></div>

                        <div className="relative z-10 w-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Zap className="text-amber-400" size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Impact Score</p>
                                    <p className="text-3xl font-black text-white leading-none">850</p>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-2 text-left">Civic Rewards Portal</h2>
                            <p className="text-indigo-200 text-sm font-medium mb-8 text-left leading-relaxed">
                                You have earned <span className="text-white font-bold text-base">₹4,200</span> in Tax Rebates by helping audit <span className="text-white font-bold">12 local projects</span>.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left flex items-center justify-between group/item hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-white">Whistleblower Status</p>
                                            <p className="text-[10px] text-slate-400">Verified Auditor</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-500 group-hover/item:translate-x-1 transition-transform" />
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left flex items-center justify-between group/item hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                                            <Landmark size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-white">Next Tax Rebate</p>
                                            <p className="text-[10px] text-slate-400">Projected: 2.5% Off</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-500 group-hover/item:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            <button className="w-full py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-indigo-50 transition-colors text-sm shadow-lg shadow-black/20 flex items-center justify-center gap-2">
                                <Zap size={16} />
                                Redeem Rewards
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            <footer className="bg-slate-900 py-6 mt-12 border-t border-slate-800 absolute bottom-0 w-full">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p className="font-bold text-slate-400 tracking-wide">© 2025 Central Public Budget Interface (India)</p>
                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Submit Anonymous Proof</a>
                        <span className="text-slate-700">•</span>
                        <a href="#" className="hover:text-amber-400 transition-colors">RTI Guidelines</a>
                        <span className="text-slate-700">•</span>
                        <div className="flex items-center gap-1 text-emerald-500">
                            <ShieldAlert size={14} />
                            <span>Verified Blockchain Records</span>
                        </div>
                    </div>
                </div>
            </footer>
            {/* --- Modals and Overlays --- */}
            <BlockchainExplorerModal txn={activeTxn} onClose={() => setActiveTxn(null)} />
        </div>
    );
}