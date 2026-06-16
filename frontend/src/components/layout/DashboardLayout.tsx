import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../chat/CommandPalette';
import { useAppStore } from '../../store/useAppStore';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

export const DashboardLayout = () => {
  const { dark, demoMode, setDemoMode } = useAppStore();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

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
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      
      {/* --- Sidebar --- */}
      {/* Fixed width on desktop, hidden on mobile by default (handled inside Sidebar component) */}
      <aside className="hidden h-full flex-shrink-0 md:block">
        <Sidebar />
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        
        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="w-full bg-amber-500 text-amber-950 px-4 py-2 text-center text-xs font-bold tracking-wide z-50 flex justify-center items-center gap-2">
            ⚠️ SYSTEM RUNNING IN DEMO MODE — MOCK DATA ACTIVE (MISSING LLM API KEY)
          </div>
        )}

        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex-shrink-0">
          <Header />
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- Global Overlays --- */}
      <CommandPalette />
    </div>
  );
};