import {
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Target,
  TrendingUp,
  Users,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-gray-900" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono-c { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* HERO */}
      <section className="px-6 pt-28 pb-20 max-w-3xl mx-auto text-center">

        <h1 className="font-display text-5xl md:text-6xl text-gray-900 leading-[1.0] tracking-tight mb-6">
          Smart Governance<br />
          <em className="not-italic text-emerald-600">Budget Intelligence.</em>
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
          A civic-tech prototype built to make India's public budget data transparent, searchable, and citizen-accessible.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="px-6 py-16 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
          {[
            {
              icon: Target,
              label: 'MISSION',
              title: 'Make budget data legible.',
              desc: "India's Union Budget is public — but it lives in dense PDFs, legacy portals, and inaccessible spreadsheets. SGBI aggregates, structures, and visualises it so any citizen can understand where their tax money goes.",
              accent: 'text-emerald-600',
            },
            {
              icon: Lightbulb,
              label: 'VISION',
              title: 'Accountable governance by default.',
              desc: 'We envision a future where budget irregularities are caught early, schemes are tracked to the last rupee, and citizens have the data they need to hold institutions accountable — without filing an RTI.',
              accent: 'text-blue-600',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10">
              <div className="flex items-center gap-2 mb-6">
                <item.icon size={16} className={item.accent} />
                <span className="font-mono-c text-xs text-gray-400 tracking-widest">{item.label}</span>
              </div>
              <h2 className="font-display text-2xl text-gray-900 mb-4 leading-snug">{item.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="px-6 py-20 border-t border-gray-200 bg-[#f8f7f4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono-c text-xs text-emerald-600 tracking-widest mb-3">PRINCIPLES</p>
            <h2 className="font-display text-3xl text-gray-900">What we stand for.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'Transparency', desc: 'Every rupee allocated, spent, or lapsed — shown openly. No spin, no summaries.', accent: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Users, title: 'Citizen-First', desc: 'Built for the person filing an RTI, not the ministry reviewing one.', accent: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: TrendingUp, title: 'Data Accuracy', desc: 'All numbers sourced from CGA, CAG, and official budget volumes only.', accent: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Globe, title: 'Inclusivity', desc: 'Designed to be readable across literacy levels and device sizes.', accent: 'text-violet-600', bg: 'bg-violet-50' },
            ].map((v, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className={`w-8 h-8 rounded-lg ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon size={15} className={v.accent} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{v.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-6 py-20 border-t border-gray-200 bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono-c text-xs text-emerald-600 tracking-widest mb-3">WHAT WE OFFER</p>
            <h2 className="font-display text-3xl text-gray-900">Why use SGBI?</h2>
          </div>
          <div className="space-y-2">
            {[
              'Ministry-wise budget breakdown with BE vs RE vs Actual comparison',
              'Search across 1,000+ Centrally Sponsored Schemes in seconds',
              'CAG audit findings in plain language — no legal jargon',
              'Track PMGSY, Smart Cities, AMRUT project completion & cost overruns',
              'Download structured CSV/JSON datasets from official sources',
              'File grievances tied to specific budget lines and track responses',
              'Historical budget archive from FY2000 to FY2025',
              'No paywalls. No login required to browse. Fully open access.',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="px-6 py-24 border-t border-gray-200 bg-gray-900">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-mono-c text-xs text-emerald-400 tracking-widest mb-6">JOIN THE MISSION</p>
          <h2 className="font-display text-3xl text-white mb-4 leading-tight">
            Public money.<br />Public data.<br />Your right.
          </h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-xs mx-auto">
            Create an account to track schemes, set fund-release alerts, and export data for RTI filings.
          </p>
          <div className="flex items-center gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded transition-colors">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-400 hover:text-white border border-white/20 hover:border-white/40 rounded transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}