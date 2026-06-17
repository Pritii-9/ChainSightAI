import React, { useState } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';
import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (IS_DEMO_MODE) {
        // Mock network delay for demo mode
        await new Promise(resolve => setTimeout(resolve, 800));
        if (isSignUp) {
          alert('Check your email for the confirmation link! (Demo Mode)');
        } else {
          localStorage.setItem('demo_logged_in', 'true');
          window.location.href = '/';
        }
        return;
      }

      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        alert('Check your email for the confirmation link!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black px-4 sm:px-6 lg:px-8 animate-fade-in selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Main Container - Constrained width for focus */}
      <div className="w-full max-w-md">
        
        {/* Logo & Branding - Centered and Spaced */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black dark:bg-white shadow-md mb-6 transition-transform duration-300 hover:scale-105">
            <img src="/icons.svg" alt="ChainSight" className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            ChainSight
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Create your account to start building.' : 'Welcome back. Please enter your details.'}
          </p>
        </div>

        {/* Card - Clean, elevated, with subtle border */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-md overflow-hidden animate-fade-up relative z-10" style={{ animationDelay: '100ms' }}>
          
          {/* Error Message - Dismissible style */}
          {error && (
            <div className="mx-8 mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
              <div className="mt-0.5 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Form - Generous Padding */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-5">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full h-11 pl-10 pr-4 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white transition-all duration-200 text-sm shadow-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900 dark:text-white">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full h-11 pl-10 pr-10 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white transition-all duration-200 text-sm shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button - Premium Feel */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-11 flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-zinc-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span className="tracking-wide text-sm">{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider - Subtle */}
          <div className="px-8 sm:px-10 pb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-4 bg-white dark:bg-zinc-900 text-slate-400 font-medium">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Mode - Secondary Action */}
          <div className="px-8 sm:px-10 pb-10 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-slate-500 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer - Minimal */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Protected by reCAPTCHA and subject to the{' '}
          <a href="#" className="font-medium text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white underline-offset-4 hover:underline transition-colors">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white underline-offset-4 hover:underline transition-colors">
            Terms of Service
          </a>.
        </p>
      </div>
    </div>
  );
};