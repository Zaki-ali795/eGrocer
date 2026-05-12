import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Settings, CheckCheck, Clock, ShoppingBag, AlertTriangle, MessageSquare, Tag } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { sellerApi } from '../services/api';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export function NotificationPopover({ isOpen, onClose, userId }: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const data = await sellerApi.getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await sellerApi.markAllNotificationsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'stock': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'request': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'promotion': return <Tag className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-2xl z-[110] border border-gray-100 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                Notifications
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={markAllRead}
                  className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-[var(--green-primary)] transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              {isLoading ? (
                <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-[var(--green-primary)] border-t-transparent rounded-full animate-spin" /></div>
              ) : notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div
                      key={n.notification_id}
                      className={`p-4 flex gap-4 transition-colors hover:bg-gray-50/80 cursor-pointer ${!n.is_read ? 'bg-[var(--green-primary)]/5' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${!n.is_read ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                        {getTypeIcon(n.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.is_read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.is_read && <div className="w-2 h-2 bg-[var(--green-primary)] rounded-full mt-2" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-50 text-center">
              <Link
                to="/notifications"
                onClick={onClose}
                className="text-xs font-bold text-[var(--green-primary)] hover:underline inline-block w-full"
              >
                View All Activity
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
