import { useState, useMemo } from 'react';
import { ShieldCheck, MapPin, Bell, AlertTriangle, CheckCircle, Clock, Info, MessageSquare, Send, Lock, Unlock, Camera, FileText, ThumbsUp } from 'lucide-react';

// ── Budget Data (from budget_data.csv) ────────────────────────────────────────
const BUDGET_DATA = [
  { department: "Health", district: "Nairobi", project: "Hospital Renovation", allocated: 5000000, spent: 5100000, month: "January" },
  { department: "Education", district: "Mombasa", project: "School Construction", allocated: 3000000, spent: 2900000, month: "January" },
  { department: "Water", district: "Kisumu", project: "Borehole Drilling", allocated: 1500000, spent: 1450000, month: "January" },
  { department: "Roads", district: "Nakuru", project: "Road Repair Phase 1", allocated: 8000000, spent: 7800000, month: "January" },
  { department: "Agriculture", district: "Eldoret", project: "Irrigation Setup", allocated: 2000000, spent: 1900000, month: "January" },
  { department: "Health", district: "Nairobi", project: "Medical Equipment", allocated: 4000000, spent: 3950000, month: "February" },
  { department: "Education", district: "Mombasa", project: "Teacher Training", allocated: 500000, spent: 490000, month: "February" },
  { department: "Water", district: "Kisumu", project: "Pipeline Extension", allocated: 2500000, spent: 2480000, month: "February" },
  { department: "Roads", district: "Nakuru", project: "Bridge Construction", allocated: 12000000, spent: 11500000, month: "February" },
  { department: "Agriculture", district: "Eldoret", project: "Seed Distribution", allocated: 800000, spent: 780000, month: "February" },
  { department: "Health", district: "Nairobi", project: "Drug Procurement", allocated: 6000000, spent: 9500000, month: "March" },
  { department: "Education", district: "Mombasa", project: "Textbook Supply", allocated: 1200000, spent: 1180000, month: "March" },
  { department: "Water", district: "Kisumu", project: "Purification Plant", allocated: 7000000, spent: 6800000, month: "March" },
  { department: "Roads", district: "Nakuru", project: "Highway Expansion", allocated: 20000000, spent: 19800000, month: "March" },
  { department: "Agriculture", district: "Eldoret", project: "Fertilizer Supply", allocated: 1500000, spent: 200000, month: "March" },
  { department: "Health", district: "Nairobi", project: "Ambulance Purchase", allocated: 3000000, spent: 4500000, month: "April" },
  { department: "Education", district: "Mombasa", project: "Lab Equipment", allocated: 2000000, spent: 1950000, month: "April" },
  { department: "Water", district: "Kisumu", project: "Water Towers", allocated: 5000000, spent: 4900000, month: "April" },
  { department: "Roads", district: "Nakuru", project: "Street Lighting", allocated: 1000000, spent: 980000, month: "April" },
  { department: "Agriculture", district: "Eldoret", project: "Cold Storage", allocated: 3000000, spent: 2950000, month: "April" },
  { department: "Health", district: "Nairobi", project: "Staff Housing", allocated: 4000000, spent: 3900000, month: "May" },
  { department: "Education", district: "Mombasa", project: "Computer Lab", allocated: 2500000, spent: 2400000, month: "May" },
  { department: "Water", district: "Kisumu", project: "Sewage System", allocated: 8000000, spent: 7800000, month: "May" },
  { department: "Roads", district: "Nakuru", project: "Pedestrian Walkways", allocated: 600000, spent: 580000, month: "May" },
  { department: "Agriculture", district: "Eldoret", project: "Market Construction", allocated: 4000000, spent: 3900000, month: "May" },
  { department: "Health", district: "Nairobi", project: "ICU Setup", allocated: 10000000, spent: 9800000, month: "June" },
  { department: "Education", district: "Mombasa", project: "Sports Facilities", allocated: 1500000, spent: 50000, month: "June" },
  { department: "Water", district: "Kisumu", project: "Meter Installation", allocated: 500000, spent: 495000, month: "June" },
  { department: "Roads", district: "Nakuru", project: "Traffic Signals", allocated: 800000, spent: 790000, month: "June" },
  { department: "Agriculture", district: "Eldoret", project: "Greenhouse Project", allocated: 2000000, spent: 1950000, month: "June" },
  { department: "Health", district: "Nairobi", project: "Mental Health Unit", allocated: 3000000, spent: 2950000, month: "July" },
  { department: "Education", district: "Mombasa", project: "Library Setup", allocated: 1800000, spent: 1750000, month: "July" },
  { department: "Water", district: "Kisumu", project: "Reservoir Upgrade", allocated: 6000000, spent: 8900000, month: "July" },
  { department: "Roads", district: "Nakuru", project: "Rural Access Roads", allocated: 5000000, spent: 4800000, month: "July" },
  { department: "Agriculture", district: "Eldoret", project: "Training Center", allocated: 1000000, spent: 980000, month: "July" },
  { department: "Health", district: "Nairobi", project: "Vaccination Drive", allocated: 2000000, spent: 1950000, month: "August" },
  { department: "Education", district: "Mombasa", project: "Scholarship Fund", allocated: 3000000, spent: 2900000, month: "August" },
  { department: "Water", district: "Kisumu", project: "Desalination Study", allocated: 500000, spent: 490000, month: "August" },
  { department: "Roads", district: "Nakuru", project: "Drainage Systems", allocated: 4000000, spent: 3900000, month: "August" },
  { department: "Agriculture", district: "Eldoret", project: "Crop Insurance", allocated: 700000, spent: 680000, month: "August" },
  { department: "Health", district: "Nairobi", project: "Radiology Equipment", allocated: 8000000, spent: 12000000, month: "September" },
  { department: "Education", district: "Mombasa", project: "University Grants", allocated: 5000000, spent: 4900000, month: "September" },
  { department: "Water", district: "Kisumu", project: "Smart Meters", allocated: 2000000, spent: 1950000, month: "September" },
  { department: "Roads", district: "Nakuru", project: "Road Marking", allocated: 300000, spent: 295000, month: "September" },
  { department: "Agriculture", district: "Eldoret", project: "Export Support", allocated: 1200000, spent: 1150000, month: "September" },
  { department: "Health", district: "Nairobi", project: "Dialysis Center", allocated: 6000000, spent: 5900000, month: "October" },
  { department: "Education", district: "Mombasa", project: "Adult Literacy", allocated: 400000, spent: 30000, month: "October" },
  { department: "Water", district: "Kisumu", project: "Leak Detection", allocated: 1000000, spent: 980000, month: "October" },
  { department: "Roads", district: "Nakuru", project: "Bypass Construction", allocated: 15000000, spent: 14800000, month: "October" },
  { department: "Agriculture", district: "Eldoret", project: "Livestock Support", allocated: 900000, spent: 870000, month: "October" },
  { department: "Health", district: "Nairobi", project: "Surgery Wing", allocated: 12000000, spent: 11800000, month: "November" },
  { department: "Education", district: "Mombasa", project: "STEM Programs", allocated: 1500000, spent: 1450000, month: "November" },
  { department: "Water", district: "Kisumu", project: "Community Taps", allocated: 800000, spent: 780000, month: "November" },
  { department: "Roads", district: "Nakuru", project: "Rest Areas", allocated: 600000, spent: 585000, month: "November" },
  { department: "Agriculture", district: "Eldoret", project: "Agri-Tech Pilot", allocated: 2000000, spent: 1950000, month: "November" },
  { department: "Health", district: "Nairobi", project: "Staff Training", allocated: 1000000, spent: 980000, month: "December" },
  { department: "Education", district: "Mombasa", project: "Exam Centers", allocated: 700000, spent: 685000, month: "December" },
  { department: "Water", district: "Kisumu", project: "Annual Maintenance", allocated: 500000, spent: 490000, month: "December" },
  { department: "Roads", district: "Nakuru", project: "Year-End Audit", allocated: 200000, spent: 195000, month: "December" },
  { department: "Agriculture", district: "Eldoret", project: "Annual Review", allocated: 300000, spent: 290000, month: "December" },
];

// ── Audit Results Data (from AuditorDashboard) ────────────────────────────────
const AUDIT_SUMMARY = {
  highRisk: 5,
  mediumRisk: 3,
  completed: 12,
  lastUpdated: "2025-03-05",
};

const FLAGGED_TRANSACTIONS = [
  { id: 1, project: "Drug Procurement", department: "Health", district: "Nairobi", month: "March", riskScore: 8.6, allocated: 6000000, spent: 9500000, status: "Under Investigation" },
  { id: 2, project: "Ambulance Purchase", department: "Health", district: "Nairobi", month: "April", riskScore: 8.7, allocated: 3000000, spent: 4500000, status: "Under Investigation" },
  { id: 3, project: "Radiology Equipment", department: "Health", district: "Nairobi", month: "September", riskScore: 8.8, allocated: 8000000, spent: 12000000, status: "Under Investigation" },
  { id: 4, project: "Reservoir Upgrade", department: "Water", district: "Kisumu", month: "July", riskScore: 8.5, allocated: 6000000, spent: 8900000, status: "Under Investigation" },
  { id: 5, project: "Hospital Renovation", department: "Health", district: "Nairobi", month: "January", riskScore: 8.5, allocated: 5000000, spent: 5100000, status: "Under Investigation" },
];

const AUDIT_TRAIL = [
  { date: "2025-03-05", event: "Budget allocation approved for Health Dept", type: "approved" },
  { date: "2025-03-04", event: "Anomaly flagged in Roads Dept spending", type: "flagged" },
  { date: "2025-03-03", event: "Investigation completed — No fraud found in Water Dept", type: "completed" },
  { date: "2025-03-02", event: "Over-expenditure detected in Radiology Equipment project", type: "flagged" },
  { date: "2025-03-01", event: "Quarterly audit review initiated for all districts", type: "info" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000000 ? `KES ${(n / 1000000).toFixed(1)}M` : `KES ${(n / 1000).toFixed(0)}K`;
const pct = (s, a) => a > 0 ? Math.round((s / a) * 100) : 0;
const DISTRICTS = [...new Set(BUDGET_DATA.map(d => d.district))];
const MONTHS = [...new Set(BUDGET_DATA.map(d => d.month))];
const DEPT_ICONS = { Health: "🏥", Education: "🎓", Water: "💧", Roads: "🛣️", Agriculture: "🌾" };

// ── Sub Components ────────────────────────────────────────────────────────────
function Bar({ spent, allocated }) {
  const over = spent > allocated;
  const w = Math.min((spent / allocated) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${over ? 'bg-rose-400' : w > 85 ? 'bg-emerald-400' : 'bg-blue-400'}`} style={{ width: `${w}%` }} />
    </div>
  );
}

function Badge({ label, color }) {
  const s = { red: "bg-rose-50 text-rose-600", amber: "bg-amber-50 text-amber-600", green: "bg-emerald-50 text-emerald-600", blue: "bg-blue-50 text-blue-600", gray: "bg-gray-100 text-gray-500" };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s[color] || s.gray}`}>{label}</span>;
}

function RiskDot({ score }) {
  const color = score >= 8.7 ? 'bg-rose-500' : score >= 8.5 ? 'bg-amber-400' : 'bg-yellow-300';
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1.5`} />;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CitizenDashboard() {
  const [tab, setTab] = useState("audit");
  const [district, setDistrict] = useState("All");
  const [month, setMonth] = useState("All");
  const [reportType, setReportType] = useState('fraud');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() =>
    BUDGET_DATA.filter(r =>
      (district === "All" || r.district === district) &&
      (month === "All" || r.month === month)
    ), [district, month]);

  const totalAllocated = filtered.reduce((s, r) => s + r.allocated, 0);
  const totalSpent = filtered.reduce((s, r) => s + r.spent, 0);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Sora', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">PublicLedger</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-1">· Kenya National Budget FY 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              Last audit: {AUDIT_SUMMARY.lastUpdated}
            </span>
            <Bell size={16} className="text-gray-400" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-7 space-y-6">

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 flex items-start gap-3">
          <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700 font-medium">
            This page displays <strong>official audit results</strong> published by the Auditor General's office. Data is updated after each audit cycle and is read-only for public transparency.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { id: "audit", label: "Audit Results" },
            { id: "budget", label: "Budget Overview" },
            { id: "trail", label: "Audit Trail" },
            { id: "feedback", label: "Speak Up" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: AUDIT RESULTS ══ */}
        {tab === "audit" && (
          <section className="space-y-6">

            {/* Risk Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-rose-100 rounded-2xl px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-widest mb-1">High Risk</p>
                <p className="text-3xl font-bold text-rose-500">{AUDIT_SUMMARY.highRisk}</p>
                <p className="text-xs text-gray-400 mt-0.5">items flagged</p>
              </div>
              <div className="bg-white border border-amber-100 rounded-2xl px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest mb-1">Medium Risk</p>
                <p className="text-3xl font-bold text-amber-500">{AUDIT_SUMMARY.mediumRisk}</p>
                <p className="text-xs text-gray-400 mt-0.5">items flagged</p>
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-widest mb-1">Completed</p>
                <p className="text-3xl font-bold text-emerald-500">{AUDIT_SUMMARY.completed}</p>
                <p className="text-xs text-gray-400 mt-0.5">investigations closed</p>
              </div>
            </div>

            {/* Flagged Transactions */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Flagged Transactions — Published by Auditor General
              </p>
              <div className="space-y-3">
                {FLAGGED_TRANSACTIONS.map((item) => {
                  const overspend = item.spent - item.allocated;
                  const overpct = pct(item.spent, item.allocated);
                  return (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span className="text-sm">{DEPT_ICONS[item.department]}</span>
                            <Badge label={item.department} color="blue" />
                            <Badge label={item.district} color="gray" />
                            <Badge label={item.month} color="gray" />
                          </div>
                          <p className="font-semibold text-gray-900">{item.project}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end mb-1">
                            <RiskDot score={item.riskScore} />
                            <span className="text-xs font-bold text-gray-600">Risk {item.riskScore}/10</span>
                          </div>
                          <Badge label={item.status} color="amber" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl px-4 py-3 text-xs">
                        <div>
                          <p className="text-gray-400 mb-0.5">Allocated</p>
                          <p className="font-bold text-gray-700">{fmt(item.allocated)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-0.5">Spent</p>
                          <p className="font-bold text-rose-600">{fmt(item.spent)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-0.5">Overspend</p>
                          <p className="font-bold text-rose-600">+{fmt(overspend)} ({overpct}%)</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══ TAB: BUDGET OVERVIEW ══ */}
        {tab === "budget" && (
          <section className="space-y-4">

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <MapPin size={11} /> Filter
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "District", value: district, set: setDistrict, options: ["All", ...DISTRICTS] },
                  { label: "Month", value: month, set: setMonth, options: ["All", ...MONTHS] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                    <select value={f.value} onChange={e => f.set(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400 cursor-pointer">
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Allocated</p>
                <p className="text-xl font-bold text-gray-900">{fmt(totalAllocated)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Spent</p>
                <p className={`text-xl font-bold ${totalSpent > totalAllocated ? 'text-rose-500' : 'text-emerald-600'}`}>{fmt(totalSpent)}</p>
              </div>
            </div>

            {/* Projects list */}
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{filtered.length} Projects</p>
            <div className="space-y-2">
              {filtered.map((row, i) => {
                const p = pct(row.spent, row.allocated);
                const over = row.spent > row.allocated;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-sm">{DEPT_ICONS[row.department]}</span>
                          <Badge label={row.department} color="blue" />
                          <Badge label={row.district} color="gray" />
                          <Badge label={row.month} color="gray" />
                          {over && <Badge label="Over Budget" color="red" />}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{row.project}</p>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${over ? 'text-rose-500' : 'text-gray-500'}`}>{p}%</span>
                    </div>
                    <Bar spent={row.spent} allocated={row.allocated} />
                    <p className="text-xs text-gray-400 mt-1.5">{fmt(row.spent)} spent of {fmt(row.allocated)} allocated</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ TAB: AUDIT TRAIL ══ */}
        {tab === "trail" && (
          <section className="space-y-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Official Audit Trail</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {AUDIT_TRAIL.map((item, i) => {
                const iconMap = {
                  approved: <CheckCircle size={15} className="text-emerald-500" />,
                  flagged: <AlertTriangle size={15} className="text-rose-400" />,
                  completed: <CheckCircle size={15} className="text-blue-400" />,
                  info: <Clock size={15} className="text-gray-400" />,
                };
                const bgMap = {
                  approved: "bg-emerald-50",
                  flagged: "bg-rose-50",
                  completed: "bg-blue-50",
                  info: "bg-gray-50",
                };
                return (
                  <div key={i} className="px-5 py-4 flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${bgMap[item.type]}`}>
                      {iconMap[item.type]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.event}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ TAB: SPEAK UP (FEEDBACK) ══ */}
        {tab === "feedback" && (
          <section className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {submitted ? (
              <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-10 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ThumbsUp size={36} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Secured</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">Your report has been encrypted and submitted to the independent oversight committee. Thank you for contributing to national accountability.</p>
                <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all">Submit Another Report</button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-50 pb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Confidential Report</h2>
                      <p className="text-sm text-gray-500 mt-1">Report anomalies, broken infrastructure, or suggest improvements.</p>
                    </div>
                    {/* Anonymous Toggle - Unique UI */}
                    <button 
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`shrink-0 relative flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${isAnonymous ? 'bg-gray-900 border-gray-900 text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.2)]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {isAnonymous ? <Lock size={16} className="text-emerald-400" /> : <Unlock size={16} />}
                      <span className="text-xs font-bold uppercase tracking-widest">{isAnonymous ? 'Anonymous On' : 'Public Mode'}</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Category Selector */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Classification</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'fraud', icon: AlertTriangle, title: "Fraud / Corruption", desc: "Report missing or misused funds", color: "rose" },
                          { id: 'infrastructure', icon: Camera, title: "Infrastructure", desc: "Report broken roads, water issues", color: "blue" },
                          { id: 'feedback', icon: MessageSquare, title: "General Feedback", desc: "Suggestions or general praise", color: "emerald" }
                        ].map((type) => {
                          const active = reportType === type.id;
                          const c = type.color === 'rose' ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-sm' : type.color === 'blue' ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm' : 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm';
                          return (
                            <div 
                              key={type.id} 
                              onClick={() => setReportType(type.id)}
                              className={`cursor-pointer rounded-2xl p-4 md:p-5 border-2 transition-all duration-200 ${active ? c : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                            >
                              <type.icon size={24} className={`mb-3 ${active ? '' : 'text-gray-400'}`} />
                              <h4 className={`font-bold text-sm ${active ? '' : 'text-gray-700'}`}>{type.title}</h4>
                              <p className={`text-xs mt-1 leading-relaxed ${active ? 'opacity-80' : 'text-gray-400'}`}>{type.desc}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Location Binding */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Tag Affected Region (Optional)</label>
                        <div className="flex gap-2">
                           <div className="relative w-full">
                              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <select className="appearance-none w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-gray-400 transition-all cursor-pointer">
                                  <option>Detecting current region...</option>
                                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                              </select>
                           </div>
                        </div>
                    </div>

                    {/* Text Area */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Description / Evidence Narrative</label>
                      <textarea 
                        rows="4" 
                        placeholder={reportType === 'fraud' ? "Provide detailed information. Mention specific project names, contractor details, or anomalies noticed..." : "Describe the issue or feedback in detail..."}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Media Upload Dummy */}
                    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                       <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                          <FileText size={20} className="text-blue-500" />
                       </div>
                       <p className="text-sm font-bold text-gray-800">Attach Supporting Evidence</p>
                       <p className="text-xs text-gray-400 mt-1">Upload images (JPEG/PNG), PDFs, or Audio Files (Max 25MB)</p>
                    </div>

                  </div>
                </div>

                {/* Footer / Submit */}
                <div className="bg-gray-50 border-t border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <p className="text-xs font-semibold text-gray-500 flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500"/> Data encrypted. Protected by Whistleblower Act 2024.</p>
                   <button 
                     onClick={() => setSubmitted(true)}
                     className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2 group"
                   >
                      Submit Report <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            )}
          </section>
        )}

      </main>

      <footer className="border-t border-gray-100 mt-10 py-6 text-center text-xs text-gray-400">
        © 2025 PublicLedger · Kenya National Budget Transparency Portal · Audit data published by Office of the Auditor General
      </footer>
    </div>
  );
}