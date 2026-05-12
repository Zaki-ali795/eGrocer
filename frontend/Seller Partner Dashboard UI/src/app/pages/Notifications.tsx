import { useState, useEffect } from 'react';
import { Bell, Clock, ShoppingBag, AlertTriangle, MessageSquare, Tag, CheckCheck, Loader2 } from 'lucide-react';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function Notifications() {
  const { sellerId } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, [sellerId]);

  async function loadNotifications() {
    if (!sellerId) return;
    try {
      setLoading(true);
      const data = await sellerApi.getNotifications(sellerId);
      setNotifications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    if (!sellerId) return;
    try {
      await sellerApi.markAllNotificationsRead(sellerId);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err: any) {
      console.error(err);
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case 'stock': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'request': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'promotion': return <Tag className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Notification Center</h1>
          <p className="text-muted-foreground mt-1">Keep track of your store's activity and alerts</p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No notifications yet</h3>
            <p className="text-muted-foreground">We'll notify you when something important happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                className={`p-6 flex gap-6 transition-all hover:bg-gray-50/80 cursor-pointer ${!n.is_read ? 'bg-primary/5' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${!n.is_read ? 'bg-white shadow-sm border border-primary/10' : 'bg-gray-50'}`}>
                  {getTypeIcon(n.notification_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`text-base ${!n.is_read ? 'font-bold text-gray-900' : 'text-gray-700 font-medium'}`}>
                      {n.title}
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(n.created_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                  {!n.is_read && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        New Activity
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
