import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../chat/CommandPalette';
import { useAppStore } from '../../store/useAppStore';
import { useRealtime } from '../../hooks/useRealtime';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import { AlertTriangle, X } from 'lucide-react';

export const DashboardLayout = () => {
  const { dark, demoMode, setDemoMode, realtimeAlerts, removeRealtimeAlert } = useAppStore();
  
  // Initialize real-time WebSocket connection
  useRealtime();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  useEffect(() => {
    // Request notification permission for smart alerts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/health`)
      .then((res) => {
        if (res.data.demo_mode !== undefined) {
          setDemoMode(res.data.demo_mode);
        }
      })
      .catch((err) => console.error('Failed to fetch health status', err));
  }, [setDemoMode]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--page-bg)] text-slate-900 dark:text-slate-100">
      
      {/* --- Sidebar --- */}
      {/* Fixed width on desktop, hidden on mobile by default (handled inside Sidebar component) */}
      <aside className="hidden h-full flex-shrink-0 md:block">
        <Sidebar />
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        
        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="w-full bg-amber-100 text-amber-900 border-b border-amber-200 px-4 py-2 text-center text-xs font-medium tracking-wide z-50 flex justify-center items-center gap-2 dark:bg-amber-900/30 dark:border-amber-900/50 dark:text-amber-400">
            System running in demo mode (Mock data active)
          </div>
        )}

        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex-shrink-0">
          <Header />
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- Global Overlays --- */}
      <CommandPalette />

      {/* --- Real-Time Toasts --- */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
        {realtimeAlerts.map((alert) => (
          <div key={alert.id} className="relative overflow-hidden rounded-md bg-white p-4 border border-slate-200 shadow-sm dark:bg-black dark:border-zinc-800">
            {/* Severity Indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              alert.severity === 'critical' ? 'bg-red-500' :
              alert.severity === 'high' ? 'bg-amber-500' : 'bg-slate-900 dark:bg-white'
            }`} />
            
            <button 
              onClick={() => removeRealtimeAlert(alert.id)}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
            
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} strokeWidth={1.5} className={`mt-0.5 ${
                alert.severity === 'critical' ? 'text-red-500' :
                alert.severity === 'high' ? 'text-amber-500' : 'text-slate-900 dark:text-white'
              }`} />
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                  {alert.type.replace('_', ' ')}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {alert.message}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-medium text-slate-500">{alert.shipment_id}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">&rarr;</span>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    alert.status_change === 'Delayed' ? 'text-red-600 dark:text-red-400' :
                    alert.status_change === 'At Risk' ? 'text-amber-600 dark:text-amber-400' :
                    'text-slate-600 dark:text-slate-400'
                  }`}>
                    {alert.status_change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};