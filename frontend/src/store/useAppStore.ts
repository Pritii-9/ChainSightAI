import { create } from 'zustand';
import type { ChatMessage } from '../types';

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
}));
