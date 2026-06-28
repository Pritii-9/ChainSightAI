import { useState } from 'react';
import axios from 'axios';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return; // 'otp' is used as password state here to minimize diff
    
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/auth/login`, {
        username: email,
        password: otp
      });
      localStorage.setItem('chainsight_token', res.data.token);
      localStorage.setItem('demo_logged_in', 'true');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    } finally {
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
            {isOtpSent ? 'Verify your identity to continue.' : 'Login with default: admin / admin123'}
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
                


                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Username
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200" />
                      </div>
                      <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full h-11 pl-10 pr-4 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white transition-all duration-200 text-sm shadow-sm"
                        placeholder="admin"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <KeyRound size={18} className="text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors duration-200" />
                      </div>
                      <input
                        id="otp"
                        type="password"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="block w-full h-11 pl-10 pr-4 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white transition-all duration-200 text-sm shadow-sm"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email || !otp}
                    className="group relative w-full h-11 flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-zinc-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-black/10 dark:shadow-white/10"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span className="tracking-wide text-sm">Sign In</span>
                        <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : null}
            
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