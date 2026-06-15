import React from 'react';
import { Clock, ArrowUpRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';
import { ChatPanel } from '../components/chat/ChatPanel';
import { ExecutionTimeline } from '../components/timeline/ExecutionTimeline';
import { KPI_TILES } from '../constants';

// --- Types ---
interface HeroMetric {
  label: string;
  value: string;
  tone: string;
  icon?: React.ReactNode;
}

// --- Constants ---
const HERO_METRICS: HeroMetric[] = [
  { 
    label: 'Autonomous Actions', 
    value: '148', 
    tone: 'text-blue-600 dark:text-blue-400',
    icon: <Zap size={16} className="text-blue-500" />
  },
  { 
    label: 'SLA Exposure Reduced', 
    value: '18.4%', 
    tone: 'text-emerald-600 dark:text-emerald-400',
    icon: <ShieldCheck size={16} className="text-emerald-500" />
  },
  { 
    label: 'Decision Latency', 
    value: '2.1m', 
    tone: 'text-slate-900 dark:text-white',
    icon: <Activity size={16} className="text-slate-500" />
  },
];

export const Dashboard: React.FC = () => {
  const now: string = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-8 p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:p-10">
        {/* Subtle background gradient for depth */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl dark:bg-blue-900/10 pointer-events-none" />
        
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          
          {/* Header Text */}
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Control Tower
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Live Telemetry
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Clear operational control <br className="hidden lg:block" />
              <span className="text-slate-500 dark:text-slate-400">across every lane.</span>
            </h1>
            
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              ChainSight combines live telemetry, exception tracking, and explainable AI actions in a clear, executive workspace designed for rapid decision-making.
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Clock size={14} className="text-slate-400" />
                {now}
              </span>
            </div>
          </div>

          {/* Hero Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:w-[480px]">
            {HERO_METRICS.map((item) => (
              <div
                key={item.label}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-slate-200 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.label}
                  </span>
                  {item.icon && <div className="opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</div>}
                </div>
                <span className={`text-2xl font-bold tracking-tight ${item.tone}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- KPI TILES --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {KPI_TILES.map((kpi: any) => (
          <AnalyticsCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        
        {/* Left Column: Decision Studio */}
        <div className="flex flex-col gap-4 xl:col-span-8">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Decision Studio
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                AI copilot for exception resolution
              </h2>
            </div>
            <button className="group hidden items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-blue-600 hover:ring-blue-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-600 lg:inline-flex">
              View automations
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
             <ChatPanel />
          </div>
        </div>

        {/* Right Column: Reasoning Visibility */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <div className="px-1 space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Reasoning Visibility
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Trace every AI move
            </h2>
          </div>
          
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <ExecutionTimeline />
          </div>
        </div>

      </section>
    </div>
  );
};