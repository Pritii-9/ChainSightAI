import { Shield, Activity, FileText, CheckCircle2, XCircle } from 'lucide-react';

const MOCK_AUDIT_LOGS = [
  { id: 'ev_9823', timestamp: '2026-06-17T08:42:15Z', actor: 'system@chainsight.ai', action: 'API_KEY_ROTATED', resource: 'Groq API Integration', status: 'success' },
  { id: 'ev_9822', timestamp: '2026-06-17T08:15:00Z', actor: 'j.smith@company.com', action: 'POLICY_UPDATED', resource: 'SLA Escalation Rules', status: 'success' },
  { id: 'ev_9821', timestamp: '2026-06-17T07:50:33Z', actor: 'agent_runner', action: 'WORKFLOW_EXECUTION_FAILED', resource: 'Vessel Delay Resolution', status: 'failure' },
  { id: 'ev_9820', timestamp: '2026-06-17T07:12:10Z', actor: 'm.chen@company.com', action: 'USER_LOGIN', resource: 'Auth Service', status: 'success' },
  { id: 'ev_9819', timestamp: '2026-06-16T22:30:00Z', actor: 'system@chainsight.ai', action: 'DATA_SYNC_COMPLETED', resource: 'SAP ERP Integration', status: 'success' },
  { id: 'ev_9818', timestamp: '2026-06-16T18:45:22Z', actor: 'system@chainsight.ai', action: 'WEBHOOK_DELIVERY_FAILED', resource: 'Slack Notifications', status: 'failure' },
];

export const Audit = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-black">
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                Security & Compliance
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              System Audit Logs
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Immutable record of all system events, authentication attempts, agent executions, and configuration changes across the control tower.
            </p>
          </div>
          
          <button className="inline-flex items-center gap-2 self-start rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-200 dark:hover:border-white dark:hover:text-white">
            <FileText size={14} /> Export CSV
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        
        {/* Left Column: Stats */}
        <div className="space-y-6 xl:col-span-1">
          <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
                <Shield size={16} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Compliance Status</h3>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Trailing 30 days uptime</p>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
                <Activity size={16} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Event Volume</h3>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">14.2k</span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Events logged today</p>
            </div>
          </div>
        </div>

        {/* Right Column: Table */}
        <div className="xl:col-span-3">
          <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Timestamp</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actor</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Resource</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {MOCK_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                      <td className="px-6 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-medium text-slate-900 dark:text-slate-300">
                        {log.actor}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {log.action}
                      </td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-400">
                        {log.resource}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {log.status === 'success' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 size={12} /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-sm border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700 dark:border-rose-800/30 dark:bg-rose-900/30 dark:text-rose-400">
                            <XCircle size={12} /> Failure
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
