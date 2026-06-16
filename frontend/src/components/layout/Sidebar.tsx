import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ship, AlertTriangle, Settings, Network, ShieldCheck, LogOut } from 'lucide-react';

const NAV = [
  { name: 'Dashboard',  path: '/',          icon: LayoutDashboard, sub: 'Executive telemetry' },
  { name: 'Shipments',  path: '/shipments', icon: Ship,            sub: 'Global movement grid' },
  { name: 'Incidents',  path: '/incidents', icon: AlertTriangle,   sub: 'Escalation center', badge: 3 },
  { name: 'Settings',   path: '/settings',  icon: Settings,        sub: 'Platform governance' },
];

export const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
      
      {/* --- Brand Header --- */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
        <img src="/icons.svg" alt="ChainSight AI Logo" className="h-9 w-9 object-contain" />
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            ChainSight AI
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            Control Tower
          </span>
        </div>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Menu
        </div>
        
        <div className="space-y-1">
          {NAV.map(({ name, path, icon: Icon, badge }) => {
            const isActive = pathname === path;
            
            return (
              <Link
                key={path}
                to={path}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 h-6 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                )}
                
                <Icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`} 
                />
                
                <span className="flex-1">{name}</span>
                
                {badge ? (
                  <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive 
                      ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                  }`}>
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Secondary Section Example */}
        <div className="mt-8 mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          System
        </div>
        <div className="space-y-1">
           <Link to="/audit" className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
              <ShieldCheck size={18} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500" />
              <span>Audit Logs</span>
           </Link>
        </div>
      </nav>

      {/* --- User Footer --- */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 pr-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
            <span className="text-xs font-bold">OC</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              Ops Council
            </div>
            <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              VP, Global Operations
            </div>
          </div>
          <LogOut size={16} className="text-slate-400 hover:text-rose-500 dark:text-slate-500" />
        </div>
      </div>
    </aside>
  );
};