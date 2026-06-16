import { useAppStore } from '../../store/useAppStore';

// Approximate Mercator-projected coordinates for major ports (x: 0-1000, y: 0-500)
const PORTS: Record<string, { x: number; y: number; label: string }> = {
  'Shanghai Port, CN':  { x: 810, y: 195, label: 'Shanghai' },
  'Shenzhen, CN':       { x: 790, y: 220, label: 'Shenzhen' },
  'Kaohsiung, TW':      { x: 800, y: 215, label: 'Kaohsiung' },
  'Busan, KR':          { x: 820, y: 180, label: 'Busan' },
  'Singapore, SG':      { x: 760, y: 290, label: 'Singapore' },
  'Hong Kong, HK':      { x: 790, y: 215, label: 'Hong Kong' },
  'Long Beach, CA':     { x: 155, y: 190, label: 'Long Beach' },
  'Los Angeles, CA':    { x: 150, y: 192, label: 'Los Angeles' },
  'Seattle, WA':        { x: 155, y: 155, label: 'Seattle' },
  'Savannah, GA':       { x: 260, y: 200, label: 'Savannah' },
  'Rotterdam, NL':      { x: 490, y: 140, label: 'Rotterdam' },
  'Hamburg, DE':         { x: 500, y: 135, label: 'Hamburg' },
};

const STATUS_COLORS: Record<string, string> = {
  'On Schedule': '#10b981',
  'In Transit':  '#3b82f6',
  'At Risk':     '#f59e0b',
  'Delayed':     '#ef4444',
};

// SVG world map outline — simplified continental boundaries
const WORLD_PATH = `
  M 120,130 L 180,110 220,115 260,105 280,120 300,115 320,130 280,145 260,140 240,155
  260,180 280,200 300,240 290,280 260,310 240,340 220,360 200,340 180,310 160,280
  150,260 140,240 130,220 125,190 120,160 Z
  M 420,80 L 450,75 480,80 510,90 540,100 560,105 580,110 600,130 580,150
  560,160 540,150 520,140 500,130 480,125 470,120 460,115 440,110 430,100 420,90 Z
  M 460,130 L 480,125 520,140 560,160 600,170 640,180 680,180 720,170 760,160
  800,170 840,180 860,170 880,180 900,200 880,220 860,240 840,260 820,250
  800,240 780,230 760,250 740,270 720,280 700,300 680,290 660,280 640,270
  620,260 600,240 580,220 560,200 540,190 520,180 500,170 480,160 460,150 Z
  M 660,300 L 700,290 740,310 780,330 800,350 790,380 770,400 740,410
  710,390 690,370 670,350 660,330 Z
  M 830,320 L 870,310 910,320 940,340 950,370 940,400 910,420 870,430
  840,420 820,400 810,370 820,350 Z
`;

export const ShipmentMap = () => {
  const { shipments } = useAppStore();

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
      {/* Title overlay */}
      <div className="absolute left-5 top-4 z-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Global Shipment Routes
        </h3>
        <div className="mt-2 flex items-center gap-4">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 1000 500"
        className="h-auto w-full"
        style={{ minHeight: 280 }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-slate-200 dark:text-slate-800" />
          </pattern>
          {/* Route glow filter */}
          <filter id="routeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="1000" height="500" fill="url(#mapGrid)" />

        {/* Continental outlines */}
        <path
          d={WORLD_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-slate-300 dark:text-slate-700 fill-slate-200/50 dark:fill-slate-800/50"
        />

        {/* Trade routes */}
        {shipments.map((s) => {
          const origin = PORTS[s.origin];
          const dest = PORTS[s.destination];
          if (!origin || !dest) return null;

          const color = STATUS_COLORS[s.status] ?? '#6b7280';
          // Curved path via control point
          const midX = (origin.x + dest.x) / 2;
          const midY = Math.min(origin.y, dest.y) - 60;
          const pathD = `M ${origin.x} ${origin.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`;

          return (
            <g key={s.id}>
              {/* Route line */}
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.6"
                filter="url(#routeGlow)"
              >
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
              </path>

              {/* Moving dot along path */}
              <circle r="4" fill={color} opacity="0.9">
                <animateMotion dur="4s" repeatCount="indefinite" path={pathD} />
              </circle>

              {/* Shipment ID label at midpoint */}
              <text
                x={midX}
                y={midY - 8}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400"
                style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700 }}
              >
                {s.id}
              </text>
            </g>
          );
        })}

        {/* Port markers */}
        {Object.entries(PORTS).map(([key, { x, y, label }]) => {
          // Check if any shipment uses this port
          const isActive = shipments.some(s => s.origin === key || s.destination === key);
          if (!isActive) return null;

          return (
            <g key={key}>
              {/* Pulse ring */}
              <circle cx={x} cy={y} r="8" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4">
                <animate attributeName="r" values="6;14;6" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
              </circle>
              {/* Port dot */}
              <circle cx={x} cy={y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" className="dark:stroke-slate-900" />
              {/* Label */}
              <text
                x={x}
                y={y + 14}
                textAnchor="middle"
                className="fill-slate-700 dark:fill-slate-300"
                style={{ fontSize: 9, fontWeight: 600 }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
