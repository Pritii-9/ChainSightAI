import { Link, useLocation } from 'react-router-dom';
import { supabase, IS_DEMO_MODE } from '../../lib/supabase';
import { LayoutDashboard, Ship, AlertTriangle, BarChart3, Settings, ShieldCheck, LogOut } from 'lucide-react';

const NAV = [
  { name: 'Dashboard',  path: '/',          icon: LayoutDashboard, sub: 'Executive telemetry' },
  { name: 'Shipments',  path: '/shipments', icon: Ship,            sub: 'Global movement grid' },
  { name: 'Incidents',  path: '/incidents', icon: AlertTriangle,   sub: 'Escalation center', badge: 3 },
  { name: 'Analytics',  path: '/analytics', icon: BarChart3,       sub: 'Trend intelligence' },
  { name: 'Settings',   path: '/settings',  icon: Settings,        sub: 'Platform governance' },
];

export const Sidebar = () => {
  const { pathname } = useLocation();

  const handleLogout = async () => {
    if (IS_DEMO_MODE) {
      localStorage.removeItem('demo_logged_in');
      window.location.href = '/login';
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-200 bg-[var(--sidebar-bg)] dark:border-zinc-800 md:flex">
      
      {/* --- Brand Header --- */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black">
          <span className="font-bold text-xs">CS</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            ChainSight
          </span>
        </div>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Overview
        </div>
        
        <div className="space-y-0.5">
          {NAV.map(({ name, path, icon: Icon, badge }) => {
            const isActive = pathname === path;
            
            return (
              <Link
                key={path}
                to={path}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-black dark:bg-zinc-900 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-zinc-900/50 dark:hover:text-slate-200'
                }`}
              >
                <Icon 
                  size={16} 
                  strokeWidth={isActive ? 2 : 1.5} 
                  className={isActive ? 'text-black dark:text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500'} 
                />
                
                <span className="flex-1">{name}</span>
                
                {badge ? (
                  <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-medium ${
                    isActive 
                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                      : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-400'
                  }`}>
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Secondary Section */}
        <div className="mt-8 mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          System
        </div>
        <div className="space-y-0.5">
           <Link to="/audit" className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-zinc-900/50 dark:hover:text-slate-200 transition-colors">
              <ShieldCheck size={16} strokeWidth={1.5} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500" />
              <span>Audit Logs</span>
           </Link>
        </div>
      </nav>

      {/* --- User Footer --- */}
      <div className="border-t border-slate-200 p-4 dark:border-zinc-800">
        <div onClick={handleLogout} className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-slate-300">
            <span className="text-xs font-medium">OC</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-slate-900 dark:text-white">
              Ops Council
            </div>
          </div>
          <LogOut size={14} className="text-slate-400 hover:text-black dark:text-slate-500 dark:hover:text-white" />
        </div>
      </div>
    </aside>
  );
};