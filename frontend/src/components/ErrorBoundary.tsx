import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-2xl border border-rose-200 bg-rose-50/50 p-8 dark:border-rose-800 dark:bg-rose-950/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <AlertTriangle size={28} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
            <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              {this.state.error?.message ?? 'An unexpected error occurred in this component.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-700 hover:shadow-xl active:scale-95"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
