import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Bell, Command } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  '/':          { title: 'Dashboard',  desc: 'Executive telemetry & operational overview' },
  '/shipments': { title: 'Shipments',  desc: 'Global shipment registry & carrier tracking' },
  '/incidents': { title: 'Incidents',  desc: 'Active escalations & SLA breach management' },
  '/settings':  { title: 'Settings',   desc: 'Platform integrations & governance controls' },
};

export const Header = () => {
  const { dark, toggleTheme } = useAppStore();
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { title, desc } = PAGE_TITLES[location.pathname] ?? { title: 'Operations', desc: 'System overview' };
  const localTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const triggerSearch = () => {
    // Dispatching a custom event or directly calling a store action is often cleaner,
    // but this mimics the keyboard shortcut for the CommandPalette
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true, bubbles: true }));
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      
      {/* Left: Page Title */}
      <div className="flex flex-col justify-center">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {desc}
        </p>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        
        {/* Search Trigger */}
        <button
          onClick={triggerSearch}
          className="group hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 sm:flex"
        >
          <Search size={14} />
          <span>Search...</span>
          <kbd className="ml-2 flex h-5 items-center gap-1 rounded border border-slate-200 bg-white px-1.5 text-[10px] font-mono font-semibold text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500">
            <Command size={10} />K
          </kbd>
        </button>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        {/* Live Clock */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 lg:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          {localTime}
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-800" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-amber-400"
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};