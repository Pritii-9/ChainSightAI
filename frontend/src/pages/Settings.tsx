import { Key, Bell, Shield, Globe, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

const SETTINGS_SECTIONS = [
  {
    title: 'API Integrations',
    icon: Key,
    items: [
      { label: 'Groq AI API Key',     value: 'sk-••••••••••••2f9a',        status: 'Connected' },
      { label: 'SAP ERP Endpoint',    value: 'https://erp.internal:8080',  status: 'Connected' },
      { label: 'Weather API Key',     value: 'Not configured',             status: 'Disconnected' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Critical SLA Alerts', value: 'Email + Slack', status: 'Active' },
      { label: 'Daily Digest',        value: '08:00 UTC',     status: 'Active' },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { label: 'Authentication', value: 'JWT (RS256)',  status: 'Enabled' },
      { label: 'Audit Logging',  value: 'CloudWatch',  status: 'Enabled' },
    ],
  },
];

const STATUS_STYLES = {
  Connected:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  Active:       'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  Enabled:      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
  Disconnected: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20',
};

export const Settings = () => (
  <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 animate-fade-in">
    
    {/* --- Hero Section --- */}
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl dark:bg-blue-900/10 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              Platform Governance
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Control integrations, trust boundaries, <br className="hidden lg:block" />
            <span className="text-slate-500 dark:text-slate-400">and enterprise readiness.</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Present operational configuration as a polished admin surface with clear status hierarchy and room to scale into larger enterprise workflows.
          </p>
        </div>

        {/* Tier Badge */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-700">
            <Sparkles size={20} className="text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Workspace Tier</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Preview</div>
          </div>
        </div>
      </div>
    </section>

    {/* --- Main Content Grid --- */}
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
      
      {/* Left Column: Configuration Sections */}
      <div className="space-y-6 xl:col-span-2">
        {SETTINGS_SECTIONS.map(({ title, icon: Icon, items }) => (
          <section key={title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Section Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configuration group</p>
              </div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map(({ label, value, status }) => (
                <div 
                  key={label} 
                  className="group flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
                    <p className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">{value}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[status as keyof typeof STATUS_STYLES]}`}>
                      {status}
                    </span>
                    <ChevronRight size={16} className="text-slate-300 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 dark:text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Right Column: Side Panels */}
      <div className="space-y-6">
        
        {/* Environment Posture */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Environment Posture
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
              <Globe size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Development Environment</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Production hardening, RBAC policy bundles, and audit controls can be elevated from this panel.
              </p>
            </div>
          </div>

          <button className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl dark:bg-blue-600 dark:hover:bg-blue-500">
            Upgrade Posture
          </button>
        </section>

        {/* Readiness Checklist */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Readiness Checklist
          </div>
          
          <div className="space-y-3">
            {[
              'Integration health verified', 
              'Notification pathways active', 
              'Security baseline enabled'
            ].map((item) => (
              <div 
                key={item} 
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
              >
                <CheckCircle2 size={16} className="text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  </div>
);