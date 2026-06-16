import { useState } from 'react';
import { Search, Filter, ArrowUpDown, Ship, Clock3, TrendingUp, Download, MoreHorizontal, MapPin } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const STATUS_STYLES = {
  Delayed:       'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20',
  'At Risk':     'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  'In Transit':  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
  'On Schedule': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
};

const SUMMARY_CARDS = [
  { label: 'On-time Confidence', value: '92.4%', icon: TrendingUp, accent: 'text-blue-600 dark:text-blue-400',         bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { label: 'Risked Shipments',   value: '02',    icon: Clock3,     accent: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-500/10' },
  { label: 'Ocean Lanes Tracked',value: '14',    icon: Ship,       accent: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
];

export const Shipments = () => {
  const { shipments } = useAppStore();
  const [search, setSearch] = useState('');
  
  const filtered = shipments.filter((s: any) =>
    [s.id, s.carrier, s.origin, s.destination].some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl dark:bg-blue-900/10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                Shipment Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Operational visibility into <br className="hidden lg:block" />
              <span className="text-slate-500 dark:text-slate-400">every active move.</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Monitor carrier performance, ETA confidence, and SLA exposure through a restrained operational view built for daily execution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <Filter size={16} />
              Refine View
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40">
              <Download size={16} />
              Export Snapshot
            </button>
          </div>
        </div>
      </section>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
                <p className={`mt-2 text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} transition-transform group-hover:scale-110`}>
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Shipment Table --- */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Operational Movement Board</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Global shipment registry</p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, carriers..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-900" 
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <ArrowUpDown size={16} />
              Sort
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Origin</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Carrier</th>
                <th className="px-6 py-4">ETA</th>
                <th className="px-6 py-4">SLA Exposure</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((ship) => (
                <tr key={ship.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{ship.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[ship.status as keyof typeof STATUS_STYLES]}`}>
                      {ship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <MapPin size={14} className="text-slate-400" />
                      {ship.origin}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{ship.destination}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{ship.carrier}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">{ship.eta}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-sm font-bold ${
                      ship.sla === 'Nominal' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {ship.sla}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> of {shipments.length} active shipments
          </span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" disabled>
              Previous
            </button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};