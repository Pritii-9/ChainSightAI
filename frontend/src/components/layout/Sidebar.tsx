import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase, IS_DEMO_MODE } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  Container, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight, 
  LogOut 
} from 'lucide-react';

export function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [userEmail, setUserEmail] = useState('admin@chainsight.io');
  const { pathname } = useLocation();

  useEffect(() => {
    if (IS_DEMO_MODE) {
      setUserEmail('demo@chainsight.io');
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const handleLogout = async () => {
    if (IS_DEMO_MODE) {
      localStorage.removeItem('demo_logged_in');
      window.location.href = '/login';
    } else {
      await supabase.auth.signOut();
    }
  };

  const menuItems = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard, category: 'OVERVIEW' },
    { id: 'shipments', path: '/shipments', label: 'Shipments', icon: Container, category: 'OVERVIEW' },
    { id: 'incidents', path: '/incidents', label: 'Incidents', icon: AlertTriangle, category: 'OVERVIEW', badge: 3 },
    { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart3, category: 'OVERVIEW' },
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings, category: 'OVERVIEW' },
    { id: 'audit', path: '/audit', label: 'Audit Logs', icon: FileSpreadsheet, category: 'SYSTEM' },
  ];

  // Group menu items by category for structured rendering
  const categories = ['OVERVIEW', 'SYSTEM'];

  return (
    <div 
      className={`h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col justify-between text-slate-600 dark:text-slate-400 relative transition-all duration-300 ease-in-out select-none
        ${isMinimized ? 'w-20 p-3' : 'w-64 p-4 md:w-72'}`}
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute top-6 -right-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full p-1 shadow-sm dark:shadow-md transition-colors z-50"
      >
        {isMinimized ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Top Section: Logo & Branding */}
      <div>
        <div className={`flex items-center gap-3 pt-2 mb-8 ${isMinimized ? 'justify-center px-0' : 'px-2'}`}>
          {/* Logo referencing your public/icons.svg */}
          <div className="flex-shrink-0 bg-black dark:bg-white rounded-xl p-2.5 flex items-center justify-center shadow-md shadow-black/10 dark:shadow-white/10 h-10 w-10">
            <svg className="w-5 h-5 text-white dark:text-black" fill="currentColor">
              <use href="/icons.svg#logo" />
            </svg>
          </div>
          
          {/* Brand Text (Hidden when minimized) */}
          {!isMinimized && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide truncate">ChainSight</span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">Operations</span>
            </div>
          )}
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-6">
          {categories.map((cat) => {
            const catItems = menuItems.filter(item => item.category === cat);
            return (
              <div key={cat} className="space-y-1.5">
                {/* Category Header */}
                {!isMinimized ? (
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-600 block px-3 mb-2 uppercase">
                    {cat}
                  </span>
                ) : (
                  <div className="border-t border-slate-200 dark:border-slate-900/50 my-3 mx-2" />
                )}

                {/* Items in Category */}
                {catItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center rounded-xl text-sm font-medium transition-all group relative
                        ${isMinimized ? 'justify-center p-3' : 'px-3 py-2.5 gap-3'}
                        ${isActive 
                          ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200 dark:bg-slate-900 dark:text-white dark:shadow-inner dark:shadow-white/5 dark:border-slate-800/50' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-200 border border-transparent'
                        }`}
                    >
                      <Icon size={18} className={isActive ? 'text-black dark:text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-200 transition-colors'} />
                      
                      {!isMinimized && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {/* Notification Badge */}
                      {item.badge && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all
                          ${isMinimized 
                            ? 'absolute top-1 right-1 bg-black text-white dark:bg-white dark:text-black border-transparent h-4 w-4 flex items-center justify-center p-0 text-[9px]' 
                            : 'bg-slate-200/50 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/50 ml-auto'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip for Minimized view */}
                      {isMinimized && (
                        <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-800 pointer-events-none">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Premium Professional Profile Card */}
      <div className={`border-t border-slate-200 dark:border-slate-900/80 pt-4 mt-auto ${isMinimized ? 'px-0' : 'px-1'}`}>
        <div className={`flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/50 transition-all duration-300
          ${isMinimized ? 'justify-center p-1 bg-transparent border-transparent dark:bg-transparent dark:border-transparent' : 'p-3 gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/40'}`}
        >
          {/* Avatar Image */}
          <div className="relative flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User profile" 
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800/40"
            />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
          </div>

          {/* Profile Text Data */}
          {!isMinimized && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">Ops Council</span>
              <span className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{userEmail}</span>
            </div>
          )}

          {/* Logout Trigger */}
          {!isMinimized && (
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-slate-900/80 transition-all ml-auto group/btn">
              <LogOut size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}