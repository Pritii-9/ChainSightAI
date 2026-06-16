
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, Tooltip, YAxis, ResponsiveContainer } from 'recharts';

// --- Sparkline Component ---
interface SparklineProps {
  data: number[];
  color: string;
}

export const Sparkline = ({ data, color }: SparklineProps) => {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
          <Tooltip
            cursor={false}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-slate-700 dark:bg-slate-800 dark:ring-slate-600">
                  {payload[0].value}
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fillOpacity={1}
            fill={`url(#color-${color})`}
            strokeWidth={2}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Analytics Card Component ---
interface AnalyticsCardProps {
  label: string;
  value: string;
  trend: 'up' | 'down';
  trendVal: string;
  chart: number[];
  sublabel?: string;
  positiveDown?: boolean;
}

export const AnalyticsCard = ({
  label,
  value,
  trend,
  trendVal,
  chart,
  sublabel,
  positiveDown,
}: AnalyticsCardProps) => {
  const isPositive = positiveDown ? trend === 'down' : trend === 'up';
  const chartColor = isPositive ? '#10b981' : '#f43f5e'; // Emerald-500 : Rose-500
  
  // Dynamic Icon Styling based on label context
  let iconBgClass = 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
  if (label.includes('Delay') || label.includes('Alert') || label.includes('Error')) {
    iconBgClass = 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400';
  } else if (label.includes('Exposure') || label.includes('Risk')) {
    iconBgClass = 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
  } else if (label.includes('Success') || label.includes('Uptime')) {
    iconBgClass = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
  }

  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
          {sublabel && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{sublabel}</p>
          )}
        </div>
        
        {/* Icon Box */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgClass} transition-colors`}>
          <Activity size={18} strokeWidth={2} />
        </div>
      </div>

      {/* Footer Section: Trend & Sparkline */}
      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <div
            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
            }`}
          >
            <TrendIcon size={12} strokeWidth={2.5} />
            {trendVal}
          </div>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            vs last week
          </span>
        </div>

        {/* Sparkline Chart */}
        <div className="opacity-80 transition-opacity group-hover:opacity-100">
          <Sparkline data={chart} color={chartColor} />
        </div>
      </div>
    </div>
  );
};