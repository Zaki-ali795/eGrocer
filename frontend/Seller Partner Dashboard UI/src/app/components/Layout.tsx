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
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { sellerApi } from '../services/api';

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
  const [requestCount, setRequestCount] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadLayoutData() {
      try {
        const [stats, prof] = await Promise.all([
          sellerApi.getStats(2),
          sellerApi.getProfile(2)
        ]);
        setRequestCount(stats.pending_requests);
        setProfile(prof);
      } catch (err) {
        console.error("Failed to load layout data", err);
      }
    }
    loadLayoutData();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-sidebar-foreground">eGrocer</h1>
              <p className="text-xs text-sidebar-foreground/60">Seller Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                  {item.label === 'Requests' && requestCount > 0 && (
                    <span className="ml-auto bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                      {requestCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Seller Info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {profile?.store_name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-sidebar-foreground truncate">{profile?.store_name || 'Loading...'}</p>
              <p className="text-xs text-sidebar-foreground/60">{profile?.verification_status || 'Seller'}</p>
            </div>
          </div>
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
              <button className="relative p-2.5 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {requestCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-card"></span>
                )}
              </button>
              <button className="p-2.5 rounded-lg hover:bg-muted transition-colors">
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
