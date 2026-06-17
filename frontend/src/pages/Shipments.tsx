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
  { label: 'On-time Confidence', value: '92.4%', icon: TrendingUp },
  { label: 'Risked Shipments',   value: '02',    icon: Clock3 },
  { label: 'Ocean Lanes Tracked',value: '14',    icon: Ship },
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
      <section className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-black">
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                Shipment Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Operational visibility into <br className="hidden lg:block" />
              <span className="text-slate-400 dark:text-slate-500">every active move.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Monitor carrier performance, ETA confidence, and SLA exposure through a restrained operational view built for daily execution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-200 dark:hover:border-white dark:hover:text-white">
              <Filter size={16} />
              Refine View
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
              <Download size={16} />
              Export Snapshot
            </button>
          </div>
        </div>
      </section>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="group relative overflow-hidden rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-black dark:border-zinc-800 dark:bg-black dark:hover:border-white">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-semibold tracking-tight text-black dark:text-white">{value}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400">
                <Icon size={14} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Shipment Table --- */}
      <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-black lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Operational Movement Board</h2>
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
                className="w-full rounded-md border border-slate-200 bg-transparent py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:ring-white" 
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-200 dark:hover:border-white dark:hover:text-white">
              <ArrowUpDown size={16} />
              Sort
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-slate-400">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Origin</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3">Carrier</th>
                <th className="px-6 py-3">ETA</th>
                <th className="px-6 py-3">SLA Exposure</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {filtered.map((ship) => (
                <tr key={ship.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-black dark:text-white">{ship.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_STYLES[ship.status as keyof typeof STATUS_STYLES]}`}>
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
                    <span className={`font-mono text-sm font-medium ${
                      ship.sla === 'Nominal' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {ship.sla}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-slate-200">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> of {shipments.length} active shipments
          </span>
          <div className="flex gap-2">
            <button className="rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm font-medium text-slate-600 disabled:opacity-50 dark:border-zinc-800 dark:text-slate-400" disabled>
              Previous
            </button>
            <button className="rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm font-medium text-slate-600 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-400 dark:hover:border-white dark:hover:text-white">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};