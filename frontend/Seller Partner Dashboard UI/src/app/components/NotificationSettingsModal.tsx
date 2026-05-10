import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, ShoppingBag, AlertTriangle, MessageSquare, Tag, BarChart3, Save, Loader2 } from 'lucide-react';
import { sellerApi } from '../services/api';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export function NotificationSettingsModal({ isOpen, onClose, userId }: NotificationSettingsModalProps) {
  const [settings, setSettings] = useState({
    new_orders: true,
    low_stock: true,
    new_customer_requests: true,
    promotion_updates: false,
    weekly_sales_report: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await sellerApi.getNotificationSettings(userId);
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await sellerApi.updateNotificationSettings(userId, settings);
      onClose();
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const options = [
    { key: 'new_orders', label: 'New Orders', desc: 'Get notified when you receive new orders', icon: ShoppingBag },
    { key: 'low_stock', label: 'Low Stock Alerts', desc: 'Alert when products are running low', icon: AlertTriangle },
    { key: 'new_customer_requests', label: 'New Customer Requests', desc: 'Notification for new bidding requests', icon: MessageSquare },
    { key: 'promotion_updates', label: 'Promotion Updates', desc: 'Updates about your active promotions', icon: Tag },
    { key: 'weekly_sales_report', label: 'Weekly Sales Report', desc: 'Receive weekly performance summary', icon: BarChart3 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[90] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--green-primary)]/10 flex items-center justify-center text-[var(--green-primary)]">
                  <Bell className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--green-primary)]" />
                </div>
              ) : (
                options.map((opt) => (
                  <div 
                    key={opt.key}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:border-[var(--green-primary)]/30"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSetting(opt.key as any)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                        settings[opt.key as keyof typeof settings] ? 'bg-[var(--green-primary)]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                        settings[opt.key as keyof typeof settings] ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-8 py-2 bg-[var(--green-primary)] text-white text-sm font-bold rounded-xl shadow-lg shadow-[var(--green-primary)]/20 flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
