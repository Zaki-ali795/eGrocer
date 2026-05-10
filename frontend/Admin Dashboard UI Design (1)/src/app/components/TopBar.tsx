import { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, LogOut, Settings, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminApi } from '../services/api';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

export function TopBar({ onNavigate, onSearch }: { onNavigate?: (page: string) => void, onSearch?: (query: string) => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearch(query);
    onSearch?.(query);
  };

  const loadNotifications = async () => {
    try {
      const data = await adminApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await adminApi.markNotificationAsRead(id.toString());
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl font-['Manrope'] text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-[#1a3a2e]/20 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-8">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-3 rounded-xl transition-all ${isNotificationsOpen ? 'bg-orange-50 text-[#ff6b35]' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6b35] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setIsNotificationsOpen(false)}
                ></div>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[70]"
                >
                  <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs font-medium text-[#ff6b35] bg-orange-50 px-2 py-1 rounded-lg">
                      {unreadCount} Unread
                    </span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notif.isRead ? 'bg-orange-50/20' : ''}`}
                        >
                          {!notif.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6b35]"></div>
                          )}
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              notif.type === 'order' ? 'bg-blue-100 text-blue-600' :
                              notif.type === 'inventory' ? 'bg-red-100 text-red-600' :
                              'bg-emerald-100 text-emerald-600'
                            }`}>
                              {notif.type === 'order' ? <Shield className="w-5 h-5" /> : 
                               notif.type === 'inventory' ? <Settings className="w-5 h-5" /> : 
                               <User className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-bold ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                {new Date(notif.time).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50/50 border-t border-gray-50 text-center">
                    <button className="text-xs font-bold text-gray-500 hover:text-[#ff6b35] transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

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
