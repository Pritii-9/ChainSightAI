import { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, ArrowUpRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard';
import { ChatPanel } from '../components/chat/ChatPanel';
import { ExecutionTimeline } from '../components/timeline/ExecutionTimeline';
import { ShipmentMap } from '../components/map/ShipmentMap';
import { BACKEND_URL } from '../constants';

// --- Types ---
interface HeroMetric {
  label: string;
  value: string;
  tone: string;
  icon?: React.ReactNode;
}

interface KpiTile {
  label: string;
  value: string;
  trend: 'up' | 'down';
  trendVal: string;
  sublabel?: string;
  positiveDown?: boolean;
  chart: number[];
}

// --- Constants ---
const HERO_METRICS: HeroMetric[] = [
  { 
    label: 'Autonomous Actions', 
    value: '148', 
    tone: 'text-black dark:text-white',
    icon: <Zap size={16} className="text-slate-400" />
  },
  { 
    label: 'SLA Exposure Reduced', 
    value: '18.4%', 
    tone: 'text-black dark:text-white',
    icon: <ShieldCheck size={16} className="text-slate-400" />
  },
  { 
    label: 'Decision Latency', 
    value: '2.1m', 
    tone: 'text-black dark:text-white',
    icon: <Activity size={16} className="text-slate-400" />
  },
];

// --- Animated Counter Hook ---

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KpiTile[]>([]);
  const [kpiLoading, setKpiLoading] = useState(true);

  const now: string = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    axios.get(`${BACKEND_URL}/analytics/summary`)
      .then(res => {
        setKpis(res.data.kpis);
      })
      .catch(() => {
        // Fallback to static data if API is down
        setKpis([
          { label: 'Active Shipments', value: '2,847', trend: 'up', trendVal: '+4.2%', chart: [12,14,18,15,20,24,22], sublabel: '14 ocean carriers' },
          { label: 'Critical Alerts', value: '12', trend: 'down', trendVal: '−15%', chart: [30,25,20,22,18,15,12], sublabel: '3 require action', positiveDown: true },
          { label: 'SLA Exposure', value: '$2.4M', trend: 'up', trendVal: '+8.1%', chart: [1.8,2.0,1.9,2.1,2.3,2.2,2.4], sublabel: 'Tier-1 contracts' },
          { label: 'Avg Delay', value: '6.2h', trend: 'down', trendVal: '−1.2h', chart: [8.0,7.5,7.8,6.9,6.5,6.3,6.2], sublabel: 'vs 7.4h prior week', positiveDown: true },
        ]);
      })
      .finally(() => setKpiLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 bg-transparent min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-black xl:p-10">
        
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          
          {/* Header Text */}
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                Control Tower
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-zinc-600" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Live Telemetry
              </span>
            </div>
            
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
              Clear operational control <br className="hidden lg:block" />
              <span className="text-slate-400 dark:text-slate-500">across every lane.</span>
            </h1>
            
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              ChainSight combines live telemetry, exception tracking, and explainable AI actions in a clear, executive workspace designed for rapid decision-making.
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-zinc-800 dark:text-slate-400">
                <Clock size={12} className="text-slate-400" />
                {now}
              </span>
            </div>
          </div>

          {/* Hero Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:w-[480px]">
            {HERO_METRICS.map((item) => (
              <div
                key={item.label}
                className="group flex flex-col justify-between rounded-md border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-black dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-white"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.label}
                  </span>
                  {item.icon && <div className="opacity-50">{item.icon}</div>}
                </div>
                <span className={`text-2xl font-bold tracking-tight ${item.tone}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- KPI TILES (from backend) --- */}
      {kpiLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-md border border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <AnalyticsCard key={kpi.label} {...kpi} />
          ))}
        </div>
      )}

      {/* --- SHIPMENT MAP --- */}
      <ShipmentMap />

      {/* --- MAIN CONTENT GRID --- */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        
        {/* Left Column: Decision Studio */}
        <div className="flex flex-col gap-4 xl:col-span-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Decision Studio
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                AI copilot for exception resolution
              </h2>
            </div>
            <button className="group hidden items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors border border-slate-200 hover:bg-slate-50 hover:text-black dark:border-zinc-800 dark:bg-black dark:text-slate-300 dark:hover:bg-zinc-900 dark:hover:text-white lg:inline-flex">
              View automations
              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-black dark:group-hover:text-white" />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
             <ChatPanel />
          </div>
        </div>

        {/* Right Column: Reasoning Visibility */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Reasoning Visibility
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Trace every AI move
            </h2>
          </div>
          
          <div className="flex-1 rounded-md border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <ExecutionTimeline />
          </div>
        </div>

      </section>
    </div>
  );
};