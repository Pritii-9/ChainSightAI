import { AlertTriangle, Clock3, DollarSign, ArrowUpRight, ShieldAlert, Download } from 'lucide-react';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

const SEVERITY_STYLES = {
  Critical: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20',
    iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  },
  Warning: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  },
  Info: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
};

const SUMMARY = [
  { label: 'Critical Alerts', value: '02',    icon: AlertTriangle },
  { label: 'Warning Queue',   value: '01',    icon: Clock3 },
  { label: 'SLA Exposure',    value: '$34.5K',icon: DollarSign },
];

export const Incidents = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/incidents`);
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Open' ? 'Investigating' : currentStatus === 'Investigating' ? 'Resolved' : 'Open';
    try {
      await axios.patch(`${BACKEND_URL}/incidents/${id}/status`, { status: nextStatus });
      fetchIncidents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="flex flex-col gap-8 animate-fade-in">
    
    {/* --- Hero Section --- */}
    <section className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-black">
      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
              Incident Response
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Escalations presented with <br className="hidden lg:block" />
            <span className="text-slate-400 dark:text-slate-500">clarity and next-best action.</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Surface the highest-cost threats, give leaders immediate context, and move teams from alert review to mitigation faster.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-4 rounded-md border border-slate-200 bg-transparent px-5 py-4 dark:border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 dark:bg-zinc-900">
            <ShieldAlert size={16} className="text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Escalation Posture</div>
            <div className="text-base font-semibold text-slate-900 dark:text-white">Priority Watch</div>
          </div>
        </div>
      </div>
    </section>

    {/* --- Summary Cards --- */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {SUMMARY.map(({ label, value, icon: Icon }) => (
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

    {/* --- Incident List --- */}
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-zinc-800 dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-black">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Live Incident Stream</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{incidents.length} active investigations</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-200 dark:hover:border-white dark:hover:text-white">
          <Download size={16} />
          Export Log
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading incidents...</div>
        ) : (
          incidents.map((incident) => {
            const styles = SEVERITY_STYLES[incident.severity as keyof typeof SEVERITY_STYLES];
            
            return (
              <div 
                key={incident.id}
                className={`group flex flex-col gap-4 p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 md:flex-row md:items-center md:justify-between ${incident.status === 'Resolved' ? 'opacity-60 grayscale' : ''}`}
              >
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.iconBg}`}>
                    <AlertTriangle size={20} strokeWidth={2} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{incident.title}</h3>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}>
                        {incident.severity}
                      </span>
                      <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        incident.status === 'Open' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                        incident.status === 'Investigating' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">{incident.id}</span>
                      <span>Shipment <span className="font-medium text-slate-700 dark:text-slate-300">{incident.shipment}</span></span>
                      <span>{incident.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Impact & Action */}
                <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-4 md:border-0 md:pt-0 dark:border-slate-800">
                  <div className="text-right">
                    <div className={`font-mono text-base font-semibold ${
                      incident.sla === 'Nominal' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {incident.sla}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Impact</div>
                  </div>
                  
                  <button 
                    onClick={() => handleUpdateStatus(incident.id, incident.status)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-200 dark:hover:border-white dark:hover:text-white"
                  >
                    {incident.status === 'Open' ? 'Investigate' : incident.status === 'Investigating' ? 'Resolve' : 'Reopen'}
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-black dark:group-hover:text-white" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  </div>
  );
};