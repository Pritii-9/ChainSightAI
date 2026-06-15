import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Ship, AlertTriangle, Settings, ArrowRight, Command } from 'lucide-react';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { name: 'Go to Dashboard',  path: '/',          icon: LayoutDashboard, category: 'Navigation' },
    { name: 'View Shipments',   path: '/shipments', icon: Ship,            category: 'Navigation' },
    { name: 'Check Incidents',  path: '/incidents', icon: AlertTriangle,   category: 'Navigation' },
    { name: 'System Settings',  path: '/settings',  icon: Settings,        category: 'Configuration' },
  ];

  const filteredActions = actions.filter((action) => 
    action.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-4 pt-[15vh] backdrop-blur-sm transition-opacity"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <Search size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500"
          />
          <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500 sm:inline-block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filteredActions.length > 0 ? (
            <div className="space-y-1">
              {filteredActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.path}
                    onClick={() => handleSelect(action.path)}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
                        {action.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {action.category}
                      </span>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className="text-slate-300 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 dark:text-slate-600" 
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search size={20} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No results found</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                We couldn't find anything matching "{query}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span>Pro tip: Use <kbd className="font-mono font-bold">⌘K</kbd> to open quickly</span>
            <span className="flex items-center gap-1">
              <Command size={12} /> + K
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};