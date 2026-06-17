import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { ChatMessage, RealtimeAlert, Shipment, LiveShip } from '../types';

interface AppState {
  dark: boolean;
  toggleTheme: () => void;
  preset: 'premium' | 'compact';
  setPreset: (p: 'premium' | 'compact') => void;
  togglePreset: () => void;
  
  query: string;
  setQuery: (q: string) => void;
  
  loading: boolean;
  setLoading: (l: boolean) => void;
  
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  
  activeTrace: string[] | null;
  setActiveTrace: (trace: string[] | null) => void;
  addTraceStep: (step: string) => void;

  demoMode: boolean;
  setDemoMode: (d: boolean) => void;

  realtimeAlerts: RealtimeAlert[];
  addRealtimeAlert: (alert: Omit<RealtimeAlert, 'id'>) => void;
  removeRealtimeAlert: (id: string) => void;

  shipments: Shipment[];
  updateShipmentStatus: (shipmentId: string, status: string) => void;

  liveShips: Record<number, LiveShip>;
  addLiveShip: (ship: LiveShip) => void;

  fetchShipments: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  dark: true,
  toggleTheme: () => set((state) => ({ dark: !state.dark })),
  
  // UI preset: 'premium' (rich visuals) or 'compact' (denser layout)
  preset: 'premium',
  setPreset: (p: 'premium' | 'compact') => set({ preset: p }),
  togglePreset: () => set((state) => ({ preset: state.preset === 'premium' ? 'compact' : 'premium' })),
  
  query: '',
  setQuery: (query) => set({ query }),
  
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello. I am the ChainSight AI Copilot. How can I assist you with your supply chain operations today?',
      timestamp: new Date()
    }
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  
  activeTrace: null,
  setActiveTrace: (trace) => set({ activeTrace: trace }),
  addTraceStep: (step) => set((state) => ({ activeTrace: [...(state.activeTrace || []), step] })),
  
  demoMode: false,
  setDemoMode: (demoMode) => set({ demoMode }),

  realtimeAlerts: [],
  addRealtimeAlert: (alert) => set((state) => {
    // Keep only the 3 most recent alerts to avoid clutter
    const newAlerts: RealtimeAlert[] = [{ ...alert, id: Date.now().toString() }, ...state.realtimeAlerts].slice(0, 3);
    return { realtimeAlerts: newAlerts };
  }),
  removeRealtimeAlert: (id) => set((state) => ({
    realtimeAlerts: state.realtimeAlerts.filter(a => a.id !== id)
  })),

  shipments: [
    { id: 'SO-4521', origin: 'Shanghai Port, CN',  destination: 'Long Beach, CA',   status: 'On Schedule', eta: 'Jun 12', carrier: 'Maersk',      sla: '$18,500' },
    { id: 'SO-4522', origin: 'Shenzhen, CN',        destination: 'Rotterdam, NL',    status: 'In Transit',  eta: 'Jun 15', carrier: 'MSC',          sla: 'Nominal' },
    { id: 'SO-4523', origin: 'Kaohsiung, TW',       destination: 'Los Angeles, CA',  status: 'On Schedule', eta: 'Jun 14', carrier: 'Evergreen',    sla: '$6,200'  },
    { id: 'SO-4524', origin: 'Busan, KR',           destination: 'Seattle, WA',      status: 'On Schedule', eta: 'Jun 11', carrier: 'Hapag-Lloyd',  sla: 'Nominal' },
    { id: 'SO-4525', origin: 'Singapore, SG',       destination: 'Hamburg, DE',      status: 'On Schedule', eta: 'Jun 18', carrier: 'CMA CGM',      sla: 'Nominal' },
    { id: 'SO-4526', origin: 'Hong Kong, HK',       destination: 'Savannah, GA',     status: 'In Transit',  eta: 'Jun 20', carrier: 'COSCO',        sla: 'Nominal' },
  ],
  updateShipmentStatus: (shipmentId, status) => set((state) => ({
    shipments: state.shipments.map(s => s.id === shipmentId ? { ...s, status } : s)
  })),

  liveShips: {},
  addLiveShip: (ship) => set((state) => {
    // Keep max 500 ships to prevent memory issues
    const newShips = { ...state.liveShips, [ship.mmsi]: ship };
    if (Object.keys(newShips).length > 500) {
      const oldestKey = Object.keys(newShips)[0];
      delete newShips[oldestKey as unknown as number];
    }
    return { liveShips: newShips };
  }),

  fetchShipments: async () => {
    try {
      const { data, error } = await supabase.from('shipments').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        set({ shipments: data });
      }
    } catch (err) {
      console.warn('Failed to fetch shipments from Supabase. Falling back to default data.', err);
    }
  }
}));
