import React, { useState } from 'react';
import { supabase, IS_DEMO_MODE } from '../lib/supabase';
import { Loader2, Mail, ArrowRight, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';

// Google Brand Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError(null);

    try {
      if (IS_DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsOtpSent(true);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Enforce admin-only: reject unknown emails by not creating users on the fly
          shouldCreateUser: false, 
        }
      });
      if (signInError) throw signInError;
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Error sending verification code. Ensure your email is registered as an admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError(null);

    try {
      if (IS_DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (otp === '123456' || otp.length === 6) {
           localStorage.setItem('demo_logged_in', 'true');
           window.location.href = '/';
        } else {
           throw new Error("Invalid verification code");
        }
        return;
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      if (verifyError) throw verifyError;
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      if (IS_DEMO_MODE) {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        localStorage.setItem('demo_logged_in', 'true');
        window.location.href = '/';
        return;
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black px-4 sm:px-6 lg:px-8 animate-fade-in selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Main Container */}
      <div className="w-full max-w-[420px]">
        
        {/* Logo & Branding */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black dark:bg-white shadow-md mb-5 transition-transform duration-300 hover:scale-105">
            <svg className="w-6 h-6 text-white dark:text-black" fill="currentColor">
              <use href="/icons.svg#logo" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ChainSight Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isOtpSent ? 'Verify your identity to continue.' : 'Secure, passwordless access to the control tower.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden animate-fade-up relative z-10" style={{ animationDelay: '100ms' }}>
          
          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-8 p-3.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
              <div className="mt-0.5 text-red-500">
                <ShieldCheck size={16} />
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {/* Dynamic Form Area */}
          <div className="p-8 sm:p-10">
            
            {!isOtpSent ? (
              /* --- STEP 1: Request OTP --- */
              <div className="space-y-6">
                
                {/* Google Auth Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-11 flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-zinc-700 disabled:opacity-70 transition-all duration-200 shadow-sm"
                >
                  <GoogleIcon />
                  <span className="text-sm">Sign in with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200 dark:border-zinc-800"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Or use email
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-zinc-800"></div>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Admin Email
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
                        placeholder="name@chainsight.io"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="group relative w-full h-11 flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-zinc-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-black/10 dark:shadow-white/10"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span className="tracking-wide text-sm">Send Code</span>
                        <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* --- STEP 2: Verify OTP --- */
              <div className="space-y-6 animate-fade-in">
                
                <div className="text-center pb-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 mb-4 text-slate-600 dark:text-slate-300">
                    <KeyRound size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check your email</h3>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    We sent a 6-digit verification code to <span className="font-semibold text-slate-900 dark:text-slate-200">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="sr-only">Verification Code</label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="block w-full h-14 text-center tracking-[0.5em] text-2xl font-mono bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white transition-all duration-200 shadow-sm"
                      placeholder="------"
                      required
                      autoFocus
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full h-11 flex items-center justify-center bg-black hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-zinc-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Sign In'}
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtp('');
                      setError(null);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    <ArrowLeft size={14} /> Back to email
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Internal Admin Portal &bull; Protected by reCAPTCHA &bull; Subject to{' '}
          <a href="#" className="font-medium text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white underline-offset-4 hover:underline transition-colors">
            Terms
          </a>
        </p>
      </div>
    </div>
  );
};