import { CheckCircle2, Activity, Database, Wifi, Cloud, FileText, Cpu, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const DATA_SOURCES = [
  { name: 'SAP ERP',       icon: Database, latency: '12ms', status: 'active' },
  { name: 'IoT Telemetry', icon: Wifi,     latency: '4ms',  status: 'active' },
  { name: 'Weather API',   icon: Cloud,    latency: '38ms', status: 'active' },
  { name: 'SLA Contracts', icon: FileText, latency: '8ms',  status: 'active' },
];

export const ExecutionTimeline = () => {
  const { activeTrace, loading } = useAppStore();
  const traceSteps = activeTrace ?? [];

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- Main Trace Card --- */}
      <div className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <CheckCircle2 size={14} className="text-blue-500" />
            Reasoning Trace
          </h3>
          {traceSteps.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              <Cpu size={10} />
              {traceSteps.length} Steps
            </span>
          )}
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto p-6">
          {traceSteps.length > 0 ? (
            <div className="relative space-y-6 pl-2">
              {/* Vertical Line */}
              <div className="absolute bottom-6 left-[15px] top-6 w-px bg-slate-200 dark:bg-slate-800" />

              {traceSteps.map((step, index) => {
                const isLatest = index === traceSteps.length - 1;
                const isCompleted = !loading || index < traceSteps.length - 1;

                return (
                  <div key={index} className="relative flex gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    {/* Dot Indicator */}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-white dark:bg-slate-900 dark:ring-slate-900">
                      <div className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        isCompleted 
                          ? 'bg-blue-500' 
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-baseline justify-between">
                        <p className={`text-sm leading-relaxed ${
                          isLatest && loading 
                            ? 'font-semibold text-slate-900 dark:text-white' 
                            : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          {step}
                        </p>
                        {isCompleted && (
                          <span className="ml-2 text-[10px] font-mono text-slate-400">
                            +{(index * 0.65).toFixed(1)}s
                          </span>
                        )}
                      </div>
                      
                      {/* Loading Indicator for latest step */}
                      {isLatest && loading && (
                        <div className="mt-2 flex items-center gap-2">
                          <Loader2 size={12} className="animate-spin text-blue-500" />
                          <span className="text-xs text-blue-500">Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <Activity size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Awaiting Analysis</h4>
              <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Ask the copilot a question to watch the AI reasoning process populate in real-time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Data Sources Card --- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Connected Sources
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>

        <div className="space-y-2">
          {DATA_SOURCES.map(({ name, icon: Icon, latency }) => (
            <div 
              key={name} 
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 transition-colors hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-300">
                  <Icon size={14} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{name}</span>
              </div>
              <span className="font-mono text-xs font-medium text-slate-400 dark:text-slate-500">
                {latency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};