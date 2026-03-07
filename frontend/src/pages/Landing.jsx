import {
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  TrendingUp,
  PieChart,
  Search,
  Bell,
  Shield,
  Database,
  GitBranch,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f7f4] text-gray-900" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono-c { font-family: 'DM Mono', monospace; }
        .bar-fill { animation: barGrow 1.4s cubic-bezier(.4,0,.2,1) forwards; transform-origin: left; }
        @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>





      {/* HERO */}
      <section className="relative px-6 pt-28 pb-28 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-8">

        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-[0.95] tracking-tight mb-6">
          Budget<br />
          <em className="not-italic text-emerald-600">Intelligence</em><br />
          for India.
        </h1>

        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Track how public funds are allocated, spent, and audited — across Union and State budgets — in one transparent, citizen-accessible platform.
        </p>

        <div className="flex items-center gap-3 justify-center">
          <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded transition-colors">
            Explore Dashboard <ArrowRight size={14} />
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded transition-colors">
            Sign In
          </Link>
        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-24 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono-c text-xs text-emerald-600 tracking-widest mb-3">PLATFORM CAPABILITIES</p>
            <h2 className="font-display text-4xl text-gray-900 mb-4">What SGBI tracks.</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              Built for journalists, researchers, RTI activists, and citizens who deserve to know where public money goes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: PieChart,
                title: 'Budget Allocation Explorer',
                desc: 'Drill into Union & State budgets ministry-wise. Switch between BE (Budget Estimate) and RE (Revised Estimate) views. Visualise fund flow across 28+ departments.',
                tag: 'CORE',
                accent: 'group-hover:bg-emerald-50 group-hover:text-emerald-600',
              },
              {
                icon: TrendingUp,
                title: 'Expenditure Tracking',
                desc: 'Compare sanctioned vs. actual spend using CGA monthly accounts. Spot chronic underspenders — in FY24, ₹1.1L Cr of capex was unspent by Q3.',
                tag: 'LIVE DATA',
                accent: 'group-hover:bg-blue-50 group-hover:text-blue-600',
              },
              {
                icon: Search,
                title: 'Scheme Intelligence',
                desc: 'Search 1,000+ Centrally Sponsored Schemes. Filter by state, sector, or release status. See how much reached beneficiaries vs. what was sanctioned.',
                tag: 'SEARCH',
                accent: 'group-hover:bg-violet-50 group-hover:text-violet-600',
              },
              {
                icon: FileText,
                title: 'CAG Audit Findings',
                desc: 'Read Comptroller & Auditor General reports in plain language. Track pending Action Taken Reports (ATRs) and ministry responses across audit cycles.',
                tag: 'AUDIT',
                accent: 'group-hover:bg-amber-50 group-hover:text-amber-600',
              },
              {
                icon: Building2,
                title: 'Project & Infra Monitor',
                desc: 'Track PMGSY, Smart Cities Mission, and AMRUT projects by state. See cost overruns, delay reasons, and on-ground completion percentages.',
                tag: 'PROJECTS',
                accent: 'group-hover:bg-orange-50 group-hover:text-orange-600',
              },
              {
                icon: Database,
                title: 'Open Data Export',
                desc: 'Download structured budget datasets in CSV or JSON — sourced from Expenditure Budget Vol. 1 & 2, RBI State Finances, and data.gov.in.',
                tag: 'OPEN API',
                accent: 'group-hover:bg-cyan-50 group-hover:text-cyan-600',
              },
              {
                icon: Bell,
                title: 'Fund Release Alerts',
                desc: 'Follow specific schemes and get email/in-app alerts when the Finance Ministry releases tranches to your state. Never miss a fund disbursement.',
                tag: 'ALERTS',
                accent: 'group-hover:bg-rose-50 group-hover:text-rose-600',
              },
              {
                icon: Shield,
                title: 'Citizen Grievance Portal',
                desc: 'File structured grievances on budget irregularities or fund misuse. Attach supporting documents, link to scheme data, and track ministry response timelines.',
                tag: 'CIVIC',
                accent: 'group-hover:bg-indigo-50 group-hover:text-indigo-600',
              },
              {
                icon: GitBranch,
                title: 'Historical Budget Archive',
                desc: 'Explore Union Budgets from FY2000–FY2025. Compare how allocations shifted across governments, recessions, COVID years, and infrastructure pushes.',
                tag: 'ARCHIVE',
                accent: 'group-hover:bg-teal-50 group-hover:text-teal-600',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group border border-gray-100 rounded-xl p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center transition-colors duration-200 ${f.accent}`}>
                    <f.icon size={16} className="text-gray-400 group-hover:inherit transition-colors duration-200" />
                  </div>
                  <span className="font-mono-c text-[9px] text-gray-300 tracking-widest pt-1">{f.tag}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="px-6 py-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono-c text-xs text-emerald-600 tracking-widest mb-12 text-center">HOW IT WORKS</p>
          <div className="grid md:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            {[
              { step: '01', title: 'Data Ingested', desc: 'SGBI pulls official budget PDFs, CGA expenditure statements, and CAG audit reports monthly. Data is parsed, structured, and version-controlled.' },
              { step: '02', title: 'You Explore', desc: 'Search by ministry, scheme, state, or keyword. Visualise allocations vs. actuals. Set alerts for schemes relevant to your district.' },
              { step: '03', title: 'Drive Accountability', desc: 'Export data for RTI filings. Raise grievances tied to specific budget lines. Share public dashboards with your community or press.' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 hover:bg-gray-50 transition-colors">
                <div className="font-display text-5xl text-gray-100 mb-4">{s.step}</div>
                <h3 className="font-semibold text-gray-900 text-base mb-3">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-gray-200 bg-gray-900">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-mono-c text-xs text-emerald-400 tracking-widest mb-6">OPEN ACCESS</p>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4 leading-tight">
            Public money.<br />Public data.<br />Your right.
          </h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-xs mx-auto">
            SGBI is free for all citizens. No login required to browse. Sign up to track schemes, get alerts, and export data.
          </p>
          <div className="flex items-center gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded transition-colors">
              Create Free Account <ArrowRight size={14} />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-400 hover:text-white border border-white/20 hover:border-white/40 rounded transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white px-6 pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
                  <BarChart3 size={12} className="text-white" />
                </div>
                <span className="font-mono-c text-gray-900 font-medium text-sm">SGBI</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-5">
                Smart Governance Budget Intelligence. Budget data sourced exclusively from official Government of India portals.
              </p>
              <div className="flex flex-wrap gap-2">
                {['data.gov.in', 'indiabudget.gov.in', 'cag.gov.in'].map((src) => (
                  <span key={src} className="font-mono-c text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded">{src}</span>
                ))}
              </div>
            </div>

            {[
              { title: 'PLATFORM', links: ['Budget Explorer', 'Scheme Search', 'CAG Reports', 'Expenditure Tracker'] },
              { title: 'RESOURCES', links: ['About the Project', 'Data Sources', 'API Docs', 'Methodology'] },
              { title: 'LEGAL', links: ['Privacy Policy', 'Terms of Use', 'Data Attribution', 'Open Source'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-mono-c text-[10px] text-gray-400 tracking-widest mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}><button className="text-gray-400 hover:text-gray-700 text-xs transition-colors">{l}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-mono-c text-xs text-gray-300">
              © {new Date().getFullYear()} Team Innovators · Coherence 2026 · MIT Licensed
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono-c text-xs text-gray-300">Data: Union Budget FY2024-25 (official)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}