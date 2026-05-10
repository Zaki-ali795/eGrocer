import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, Warehouse, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // On mount, check if user is already logged in from the login-sign-up app
  useState(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.user_type === 'admin') {
          onLogin();
        }
      } catch {}
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
      // Verify this is an admin user
      const user = result.data.user;
      if (user.user_type !== 'admin') {
        throw new Error('Access denied. This portal is for administrators only.');
      }
      // Store auth data
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#064e3b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[450px] relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/20"
            >
              <Warehouse className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-['Crimson_Pro'] text-4xl font-bold text-white mb-2">eGrocer Admin</h1>
            <p className="font-['Manrope'] text-emerald-100/60 font-medium tracking-wide uppercase text-xs">Secure Portal Login</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl">
              <p className="font-['Manrope'] text-sm text-red-200 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-['Manrope'] text-sm font-bold text-emerald-100 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-['Manrope'] placeholder:text-emerald-100/30 focus:outline-none focus:bg-white/10 focus:border-emerald-400/50 transition-all"
                  placeholder="Enter your admin email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-['Manrope'] text-sm font-bold text-emerald-100">Password</label>
                <button type="button" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-white transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-['Manrope'] placeholder:text-emerald-100/30 focus:outline-none focus:bg-white/10 focus:border-emerald-400/50 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-['Manrope'] font-bold py-4 rounded-2xl shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-emerald-100/40 text-sm font-medium">
              Protected by Enterprise Shield Security
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-emerald-100/30 text-xs font-medium">
          &copy; 2026 eGrocer Systems Ltd. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
}
