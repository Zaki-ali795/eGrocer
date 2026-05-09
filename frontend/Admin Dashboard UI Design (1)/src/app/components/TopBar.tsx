import { Search, Bell, User, ChevronDown, LogOut, Settings, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function TopBar({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [notifications] = useState(7);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = () => {
    // In a real app, clear tokens/session
    window.location.reload(); 
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm"
    >
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-[#1a3a2e]" />
            <input
              type="text"
              placeholder="Search products, orders, users..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl font-['Manrope'] text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-[#1a3a2e]/20 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6b35] text-white text-xs font-['Manrope'] font-bold rounded-full flex items-center justify-center"
              >
                {notifications}
              </motion.span>
            )}
          </motion.button>

          <div className="h-8 w-px bg-gray-300"></div>

          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Administrator</p>
                <p className="text-sm font-bold text-gray-800 leading-none">Rehan Ahmed</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[60]" 
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[70]"
                  >
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Rehan Ahmed</p>
                          <p className="text-xs text-gray-500">rehan.admin@egrocer.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => { setIsUserMenuOpen(false); onNavigate?.('settings'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-colors"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </button>
                      <button 
                        onClick={() => { setIsUserMenuOpen(false); onNavigate?.('settings'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-50">
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure you want to sign out?')) {
                            handleSignOut();
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
