import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import logo from '../../assets/logo.png';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        // Clear any old session data first
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        const user = result.data.user;
        if (user.user_type !== 'admin') {
          throw new Error('Access denied. Admin account required.');
        }
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', result.data.token);
        onLogin();
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[450px] relative z-10"
      >
        <div className="bg-white border border-[var(--primary)]/10 rounded-[2.5rem] p-10 shadow-2xl shadow-[var(--green-dark)]/5">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white border border-[var(--primary)]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--primary)]/10 p-4"
            >
              <img src={logo} alt="eGrocer Logo" className="w-full h-full object-contain" />
            </motion.div>
            <h1 className="font-['Crimson_Pro'] text-4xl font-bold text-[var(--green-dark)] mb-2">eGrocer Admin</h1>
            <p className="font-['Manrope'] text-[var(--primary)]/60 font-bold tracking-wide uppercase text-[10px]">Secure Portal Login</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-['Manrope'] text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-['Manrope'] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                  placeholder="Enter your admin email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="px-1">
                <label className="font-['Manrope'] text-sm font-bold text-gray-700">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-gray-900 font-['Manrope'] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
              <div className="flex justify-end px-1">
                <button 
                  type="button" 
                  onClick={() => alert('Administrative Password Recovery:\n\nPlease contact your System Administrator or IT Department to reset your portal credentials. For security reasons, admin passwords cannot be reset via email.')}
                  className="text-xs font-bold text-[var(--primary)] hover:text-[var(--green-dark)] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--green-dark)] text-white font-['Manrope'] font-bold py-4 rounded-2xl shadow-xl shadow-[var(--primary)]/10 flex items-center justify-center gap-2 transition-all disabled:opacity-70 group"
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
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Enterprise Shield Security
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-xs font-medium">
          &copy; 2026 eGrocer Systems Ltd. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
}
