import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function TopBar() {
  const [notifications] = useState(7);

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

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#1a3a2e] to-[#2a5f4a] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-['Manrope'] font-semibold text-sm text-gray-800">Admin User</p>
              <p className="font-['Manrope'] text-xs text-gray-500">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
