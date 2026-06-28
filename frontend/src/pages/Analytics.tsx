import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Shield, Globe, Loader2, RefreshCw, Download } from 'lucide-react';
import { BACKEND_URL } from '../constants';

// ---------- types ----------
interface VolumeDatum   { date: string; shipments: number }
interface DelayCause    { cause: string; count: number; color: string }
interface CostDatum     { date: string; daily: number; cumulative: number }
interface RegionRow     { lane: string; volume: number; on_time: number; avg_delay: number; sla_exposure: string }
interface SlaCompliance { compliant: number; at_risk: number; breached: number }

interface TrendsPayload {
  volume_trend: VolumeDatum[];
  delay_causes: DelayCause[];
  sla_compliance: SlaCompliance;
  regional_performance: RegionRow[];
  cost_impact: CostDatum[];
  generated_at: string;
}

// ---------- palette ----------
const DONUT_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const fmtDate = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ---------- custom tooltip ----------
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

// ---------- component ----------
export const Analytics = () => {
  const [data, setData] = useState<TrendsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}/analytics/trends`);
      setData(res.data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    
    const headers = ['Trade Lane', 'Volume', 'On-Time %', 'Avg Delay (h)', 'SLA Exposure'];
    const rows = data.regional_performance.map(r => [
      r.lane, 
      r.volume.toString(), 
      r.on_time.toString(), 
      r.avg_delay.toString(), 
      r.sla_exposure
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chainsight_regional_performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-sm text-rose-500">{error ?? 'Unknown error'}</p>
        <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const donutData = [
    { name: 'Compliant', value: data.sla_compliance.compliant },
    { name: 'At Risk',   value: data.sla_compliance.at_risk },
    { name: 'Breached',  value: data.sla_compliance.breached },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* --- Hero --- */}
      <section className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-black">
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                Advanced Analytics
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Operational intelligence <br className="hidden lg:block" />
              <span className="text-slate-400 dark:text-slate-500">across every metric.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              30-day trend analysis of shipment volume, delay root causes, SLA compliance posture, and cumulative cost exposure across all active trade lanes.
            </p>
          </div>
          <div className="flex gap-3 self-start">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-200 dark:hover:border-white dark:hover:text-white"
            >
              <RefreshCw size={14} /> Refresh Data
            </button>
          </div>
        </div>
      </section>

      {/* --- Charts Grid --- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* 1. Volume Trend */}
        <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shipment Volume</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily shipments over 30 days</p>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.volume_trend}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="shipments" name="Shipments" stroke="#3b82f6" fill="url(#volumeGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 2. Delay Causes */}
        <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delay Root Causes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distribution by category</p>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.delay_causes} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis type="category" dataKey="cause" width={120} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Incidents" radius={[0, 6, 6, 0]}>
                  {data.delay_causes.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 3. SLA Compliance Donut */}
        <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">SLA Compliance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Contract adherence breakdown</p>
            </div>
          </div>
          <div className="flex items-center justify-center p-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  formatter={(value: string) => (
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</span>
                  )}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 4. Cost Impact Timeline */}
        <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cumulative SLA Cost Exposure</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">30-day penalty accrual ($K)</p>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.cost_impact}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="cumulative" name="Cumulative ($K)" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#ef4444' }} />
                <Line type="monotone" dataKey="daily" name="Daily ($K)" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* --- Regional Performance Table --- */}
      <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
            <Globe size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Regional Performance</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Key trade lane metrics</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trade Lane</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Volume</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">On-Time %</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Avg Delay</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">SLA Exposure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {data.regional_performance.map((row) => (
                <tr key={row.lane} className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.lane}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{row.volume.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium ${
                      row.on_time >= 95 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30' :
                      row.on_time >= 90 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30' :
                      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/30'
                    }`}>
                      {row.on_time}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{row.avg_delay}h</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">{row.sla_exposure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
