import type { StatusType } from '../types';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const EXAMPLE_QUERIES = [
  'Why is shipment SO-4521 delayed at Long Beach port?',
  'Assess weather risk for containers in South China Sea this week',
  'SLA exposure status on Toyota TMMK inbound supply line',
  'Status check on all active Tier-1 supplier inbounds',
];

export const KPI_TILES: { label: string; value: string; trend: 'up' | 'down'; trendVal: string; chart: number[]; sublabel?: string; positiveDown?: boolean }[] = [
  { label: 'Active Shipments', value: '2,847', trend: 'up',   trendVal: '+4.2%', chart: [12,14,18,15,20,24,22], sublabel: '14 ocean carriers' },
  { label: 'Critical Alerts',  value: '12',    trend: 'down', trendVal: '−15%',  chart: [30,25,20,22,18,15,12], sublabel: '3 require action', positiveDown: true },
  { label: 'SLA Exposure',     value: '$2.4M', trend: 'up',   trendVal: '+8.1%', chart: [1.8,2.0,1.9,2.1,2.3,2.2,2.4], sublabel: 'Tier-1 contracts' },
  { label: 'Avg Delay',        value: '6.2h',  trend: 'down', trendVal: '−1.2h', chart: [8.0,7.5,7.8,6.9,6.5,6.3,6.2], sublabel: 'vs 7.4h prior week', positiveDown: true },
];

export const STATUS_MAP: Record<StatusType, { color: string; bg: string }> = {
  'Critical Delay': { color: 'text-rose-500', bg: 'bg-rose-500/10' },
  'At Risk': { color: 'text-amber-500', bg: 'bg-amber-500/10' },
  'On Schedule': { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
};
