
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
  const iconBgClass = 'bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400';

  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-black dark:border-zinc-800 dark:bg-black dark:hover:border-white">
      
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
            {value}
          </h3>
          {sublabel && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{sublabel}</p>
          )}
        </div>
        
        {/* Icon Box */}
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${iconBgClass}`}>
          <Activity size={14} strokeWidth={1.5} />
        </div>
      </div>

      {/* Footer Section: Trend & Sparkline */}
      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-zinc-800/50">
        <div className="flex flex-col gap-1">
          <div
            className={`inline-flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${
              isPositive
                ? 'bg-slate-100 text-black dark:bg-zinc-900 dark:text-white'
                : 'bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400'
            }`}
          >
            <TrendIcon size={10} strokeWidth={2} />
            {trendVal}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
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