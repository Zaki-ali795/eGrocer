import { Users, ShoppingCart, DollarSign, Zap, Package, TrendingUp, TrendingDown, Clock, Loader2 } from 'lucide-react';
import { KPICard } from './KPICard';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';

interface DashboardOverviewProps {
  onNavigate: (page: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const overview = await adminApi.getDashboardOverview();
        setData(overview);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load platform data</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
    </div>
  );

  const { stats, revenueHistory, topCategories, recentActivity } = data;

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Welcome back, Admin</h1>
        <p className="font-['Manrope'] text-gray-600">Here's what's happening with your platform today.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Users"
          value={(stats.customer_count + stats.seller_count).toLocaleString()}
          change="+0%"
          changeType="positive"
          icon={Users}
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          delay={0.1}
          subtitle={<span>{stats.customer_count.toLocaleString()} customers • {stats.seller_count.toLocaleString()} sellers</span>}
        />
        <KPICard
          title="Today's Orders"
          value={stats.today_orders.toLocaleString()}
          change="+0%"
          changeType="positive"
          icon={ShoppingCart}
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          delay={0.2}
          subtitle={<span>{stats.today_processing} processing • {stats.today_delivered} delivered</span>}
        />
        <KPICard
          title="Revenue (Monthly)"
          value={`Rs ${stats.monthly_revenue.toLocaleString()}`}
          change="+0%"
          changeType="positive"
          icon={DollarSign}
          gradient="bg-gradient-to-br from-amber-400 to-amber-600"
          delay={0.3}
          subtitle={<span>Rs {(stats.monthly_revenue / (stats.today_orders || 1)).toFixed(0)} avg order value</span>}
        />
        <KPICard
          title="Active Flash Deals"
          value={stats.active_flash_deals.toString()}
          change="Live now"
          changeType="neutral"
          icon={Zap}
          gradient="bg-gradient-to-br from-orange-400 to-orange-600"
          delay={0.4}
          subtitle={<span>Across all categories</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Revenue Overview</h2>
              <p className="font-['Manrope'] text-sm text-gray-500">Platform performance</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#1a3a2e] rounded-full"></div>
                <span className="font-['Manrope'] text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#ff6b35] rounded-full"></div>
                <span className="font-['Manrope'] text-sm text-gray-600">Orders</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueHistory}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a3a2e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1a3a2e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
              <YAxis stroke="#888" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'Manrope',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#1a3a2e" strokeWidth={3} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="orders" stroke="#ff6b35" strokeWidth={3} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-2">Top Categories</h2>
          <p className="font-['Manrope'] text-sm text-gray-500 mb-6">By sales volume</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" style={{ fontFamily: 'Manrope', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#888" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'Manrope',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="sales" fill="#1a3a2e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Recent Activity</h2>
            <p className="font-['Manrope'] text-sm text-gray-500">Real-time platform updates</p>
          </div>
          <button 
            onClick={() => onNavigate('orders')}
            className="font-['Manrope'] text-sm text-[#1a3a2e] hover:text-[#2a5f4a] font-semibold"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity: any, index: number) => {
            const Icon = activity.type === 'order' ? ShoppingCart : activity.type === 'user' ? Users : Package;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="font-['Manrope'] text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="font-['Manrope'] text-xs text-gray-500">{new Date(activity.time).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          onClick={() => onNavigate('inventory')}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-emerald-700">Inventory Health</p>
              <p className="font-['Crimson_Pro'] text-2xl font-bold text-emerald-900">Good</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-emerald-700">{stats.low_stock_count} products need attention</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          onClick={() => onNavigate('inventory')}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-orange-700">Low Stock Alert</p>
              <p className="font-['Crimson_Pro'] text-2xl font-bold text-orange-900">{stats.low_stock_count}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-orange-700">Restock recommended soon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={() => onNavigate('requests')}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-red-700">Pending Requests</p>
              <p className="font-['Crimson_Pro'] text-2xl font-bold text-red-900">{stats.pending_refunds_count}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-red-700">Awaiting administrative action</p>
        </motion.div>
      </div>
    </div>
  );
}
