import { Outlet, NavLink } from 'react-router';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Handshake,
  Tag,
  Wallet,
  Settings,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProfileModal } from './ProfileModal';
import { NotificationPopover } from './NotificationPopover';
import logo from '../../imports/logo.png';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/requests', label: 'Requests', icon: Handshake },
  { path: '/promotions', label: 'Promotions', icon: Tag },
  { path: '/payments', label: 'Payments', icon: Wallet },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export default function Layout() {
  const { sellerId, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    const hostname = window.location.hostname;
    window.location.href = `http://${hostname}:3003`;
  };
  const [requestCount, setRequestCount] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadLayoutData = async () => {
    if (!sellerId) return;
    try {
      console.log("[Layout] Loading data for sellerId:", sellerId);
      
      // Load stats
      try {
        const result = await sellerApi.getStats(Number(sellerId));
        console.log("[Layout] Stats result:", result);
        // Handle both { pending_requests } and { data: { pending_requests } } if fetchApi was inconsistent
        const statsData = result.data || result;
        const count = statsData.pending_requests !== undefined ? statsData.pending_requests : 0;
        console.log("[Layout] Setting request count to:", count);
        setRequestCount(count);
      } catch (err) {
        console.error("[Layout] Failed to load stats:", err);
      }

      // Load profile
      try {
        const prof = await sellerApi.getProfile(Number(sellerId));
        setProfile(prof);
      } catch (err) {
        console.error("[Layout] Failed to load profile:", err);
      }

      // Load notifications
      try {
        const notifs = await sellerApi.getNotifications(Number(sellerId));
        setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
      } catch (err) {
        console.error("[Layout] Failed to load notifications:", err);
      }
    } catch (err) {
      console.error("[Layout] loadLayoutData error:", err);
    }
  };

  useEffect(() => {
    loadLayoutData();
  }, [sellerId]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[var(--green-dark)] via-[var(--green-primary)] to-[var(--green-dark)] flex flex-col shadow-xl z-20">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg transition-all duration-300 hover:scale-105 group">
              <img src={logo} alt="eGrocer Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">eGrocer</h1>
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Seller Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-white text-[var(--green-dark)] shadow-xl shadow-black/10 font-bold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                  <span className="font-medium">{item.label}</span>
                  {item.label === 'Requests' && (
                    <span className="ml-auto bg-[#F39C12] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                      {requestCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Seller Info */}
        <div className="p-4 border-t border-white/10 bg-black/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 mb-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-white text-[var(--green-primary)] flex items-center justify-center font-bold shadow-inner">
              {profile?.first_name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">{profile?.first_name || 'Loading...'}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">{profile?.verification_status || 'Seller'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/80 hover:text-white hover:bg-red-500/20 rounded-xl transition-all group"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Welcome back, {profile?.first_name || 'Seller'}!</h2>
              <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your store today</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationPopoverOpen(!isNotificationPopoverOpen)}
                  className={`p-2.5 rounded-lg hover:bg-muted transition-colors ${isNotificationPopoverOpen ? 'bg-muted' : ''}`}
                >
                  <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-[var(--green-primary)]' : 'text-muted-foreground'}`} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-card animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationPopover 
                  isOpen={isNotificationPopoverOpen} 
                  onClose={() => setIsNotificationPopoverOpen(false)} 
                  userId={Number(sellerId)} 
                />
              </div>
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="p-2.5 rounded-lg hover:bg-muted transition-colors group"
              >
                <User className="w-5 h-5 text-muted-foreground group-hover:text-[var(--green-primary)] transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-background">
          <Outlet />
        </main>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        sellerId={Number(sellerId)} 
        initialData={profile} 
        onUpdate={loadLayoutData}
      />
    </div>
  );
}
