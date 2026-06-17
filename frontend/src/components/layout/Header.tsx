import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Bell, Command } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  '/':          { title: 'Dashboard',  desc: 'Executive telemetry & operational overview' },
  '/shipments': { title: 'Shipments',  desc: 'Global shipment registry & carrier tracking' },
  '/incidents': { title: 'Incidents',  desc: 'Active escalations & SLA breach management' },
  '/analytics': { title: 'Analytics',  desc: '30-day trend intelligence & cost exposure' },
  '/settings':  { title: 'Settings',   desc: 'Platform integrations & governance controls' },
  '/audit':     { title: 'Audit Logs', desc: 'System security & compliance records' },
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-[var(--header-bg)] px-6 dark:border-zinc-800">
      
      {/* Left: Page Title */}
      <div className="flex flex-col justify-center">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
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
          className="group hidden items-center gap-2 rounded-md border border-slate-200 bg-transparent px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-black hover:text-black dark:border-zinc-800 dark:text-slate-400 dark:hover:border-white dark:hover:text-white sm:flex"
        >
          <Search size={14} />
          <span>Search...</span>
          <kbd className="ml-2 flex h-5 items-center gap-1 rounded bg-slate-100 px-1.5 text-[10px] font-mono font-medium text-slate-500 dark:bg-zinc-800 dark:text-slate-400">
            <Command size={10} />K
          </kbd>
        </button>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-slate-200 dark:bg-zinc-800 sm:block" />

        {/* Live Clock */}
        <div className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 lg:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
          </span>
          {localTime}
        </div>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-black dark:text-slate-400 dark:hover:bg-zinc-900 dark:hover:text-white">
          <Bell size={16} />
          <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-black dark:text-slate-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};