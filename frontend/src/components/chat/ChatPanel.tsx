import { useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { Network, Loader2, Send, Bot, Activity, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BACKEND_URL, EXAMPLE_QUERIES } from '../../constants';
import type { CopilotResponse } from '../../types';

// --- Configuration & Styles ---
const STATUS_CONFIG = {
  'Critical Delay': {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20',
    headerBg: 'bg-gradient-to-r from-rose-50/80 to-transparent dark:from-rose-900/10',
  },
  'At Risk': {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    headerBg: 'bg-gradient-to-r from-amber-50/80 to-transparent dark:from-amber-900/10',
  },
  'On Schedule': {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
    headerBg: 'bg-gradient-to-r from-emerald-50/80 to-transparent dark:from-emerald-900/10',
  },
} as const;

export const ChatPanel = () => {
  const { query, setQuery, loading, setLoading, messages, addMessage, setActiveTrace, addTraceStep } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (event?: FormEvent) => {
    if (event) event.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: query, timestamp: new Date() };
    addMessage(userMsg);
    setQuery('');
    setLoading(true);
    setActiveTrace([]);

    try {
      const res = await axios.post(`${BACKEND_URL}/copilot`, { query: userMsg.content });
      const data: CopilotResponse = res.data;

      // Simulate thinking steps for UI feedback
      if (data.thought_process?.length) {
        for (let i = 0; i < data.thought_process.length; i += 1) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          addTraceStep(data.thought_process[i]);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.final_answer.root_cause,
        responsePayload: data,
        timestamp: new Date(),
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      const axiosErrorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${axiosErrorMsg || errorMsg}`,
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Bot size={20} strokeWidth={2} className={loading ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Copilot</h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                LLaMA 3.3
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">• RAG Enhanced</span>
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">System Online</span>
        </div>
      </div>

      {/* --- Messages Area --- */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 dark:bg-slate-950/50">
        <div className="mx-auto max-w-3xl space-y-8">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                {msg.role === 'user' ? 'ME' : <Network size={14} />}
              </div>

              {/* Content Bubble */}
              <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start max-w-[85%]'}`}>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {msg.role === 'user' ? 'You' : 'ChainSight AI'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.role === 'user' ? (
                  <div className="rounded-2xl rounded-tr-sm bg-slate-900 px-5 py-3 text-sm leading-relaxed text-white shadow-md dark:bg-slate-100 dark:text-slate-900">
                    {msg.content}
                  </div>
                ) : !msg.responsePayload ? (
                  <div className="rounded-2xl rounded-tl-sm bg-white px-5 py-3 text-sm leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                    {msg.content}
                  </div>
                ) : (
                  /* --- Rich Response Card --- */
                  (() => {
                    const statusKey = msg.responsePayload.final_answer.status as keyof typeof STATUS_CONFIG;
                    const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG['On Schedule'];

                    return (
                      <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                        {/* Status Header */}
                        <div className={`flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-700 ${cfg.headerBg}`}>
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                            Analysis Complete
                          </div>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                            {msg.responsePayload.final_answer.status}
                          </span>
                        </div>

                        <div className="p-5 space-y-6">
                          {/* Root Cause & Impact Grid */}
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Root Cause</h4>
                              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                {msg.responsePayload.final_answer.root_cause}
                              </p>
                            </div>
                            <div>
                              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Financial Impact</h4>
                              <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">
                                {msg.responsePayload.final_answer.financial_impact}
                              </p>
                            </div>
                          </div>

                          {/* Downstream Impact */}
                          <div>
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Downstream Impact</h4>
                            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                              {msg.responsePayload.final_answer.downstream_impact}
                            </p>
                          </div>

                          {/* Mitigations */}
                          {msg.responsePayload.final_answer.prescriptive_mitigations.length > 0 && (
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                              <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <Sparkles size={12} className="text-amber-500" />
                                Prescriptive Mitigations
                              </h4>
                              <div className="space-y-3">
                                {msg.responsePayload.final_answer.prescriptive_mitigations.map((mitigation, idx) => (
                                  <div key={idx} className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-blue-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-800 dark:hover:bg-slate-800 lg:flex-row lg:items-center">
                                    <div className="flex-1">
                                      <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        {mitigation.action_id}
                                      </div>
                                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {mitigation.option}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 lg:justify-end">
                                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold font-mono ${
                                        mitigation.cost_implication.startsWith('+')
                                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                      }`}>
                                        {mitigation.cost_implication}
                                      </span>
                                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-95">
                                        Execute
                                        <ChevronRight size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div className="flex gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <div className="flex items-center gap-3 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                <span className="flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </span>
                Analyzing telemetry data...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- Input Area --- */}
      <div className="border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {/* Suggested Queries */}
        <div className="mb-4 flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((sample) => (
            <button
              key={sample}
              onClick={() => setQuery(sample)}
              disabled={loading}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <AlertCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about delays, risks, or actions..."
              disabled={loading}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={2.5} />}
          </button>
        </form>
      </div>
    </div>
  );
};