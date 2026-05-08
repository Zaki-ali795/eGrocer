import { Users, ShoppingCart, DollarSign, Zap, Package, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { KPICard } from './KPICard';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 45000, orders: 320 },
  { name: 'Feb', revenue: 52000, orders: 380 },
  { name: 'Mar', revenue: 48000, orders: 350 },
  { name: 'Apr', revenue: 61000, orders: 430 },
  { name: 'May', revenue: 55000, orders: 390 },
  { name: 'Jun', revenue: 67000, orders: 480 },
  { name: 'Jul', revenue: 72000, orders: 520 },
];

const categoryData = [
  { name: 'Fruits', sales: 12500 },
  { name: 'Vegetables', sales: 9800 },
  { name: 'Dairy', sales: 15200 },
  { name: 'Bakery', sales: 8900 },
  { name: 'Meat', sales: 11300 },
];

const recentActivities = [
  { id: 1, type: 'order', message: 'New order #12847 received', time: '2 min ago', icon: ShoppingCart },
  { id: 2, type: 'refund', message: 'Refund processed for order #12839', time: '15 min ago', icon: DollarSign },
  { id: 3, type: 'user', message: 'New seller registration: Fresh Farms Co.', time: '1 hour ago', icon: Users },
  { id: 4, type: 'inventory', message: 'Low stock alert: Organic Bananas', time: '2 hours ago', icon: Package },
  { id: 5, type: 'order', message: 'Order #12845 marked as delivered', time: '3 hours ago', icon: ShoppingCart },
];

export function DashboardOverview() {
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
          value="24,583"
          change="+12.5%"
          changeType="positive"
          icon={Users}
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          delay={0.1}
          subtitle={<span>18,234 customers • 6,349 sellers</span>}
        />
        <KPICard
          title="Today's Orders"
          value="847"
          change="+8.2%"
          changeType="positive"
          icon={ShoppingCart}
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          delay={0.2}
          subtitle={<span>673 processing • 174 delivered</span>}
        />
        <KPICard
          title="Revenue (Monthly)"
          value="Rs 72,400"
          change="+15.3%"
          changeType="positive"
          icon={DollarSign}
          gradient="bg-gradient-to-br from-amber-400 to-amber-600"
          delay={0.3}
          subtitle={<span>Rs 2,413 avg order value</span>}
        />
        <KPICard
          title="Active Flash Deals"
          value="12"
          change="3 ending soon"
          changeType="neutral"
          icon={Zap}
          gradient="bg-gradient-to-br from-orange-400 to-orange-600"
          delay={0.4}
          subtitle={<span>89% avg engagement rate</span>}
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
              <p className="font-['Manrope'] text-sm text-gray-500">Last 7 months performance</p>
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
            <AreaChart data={revenueData}>
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
            <BarChart data={categoryData}>
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
          <button className="font-['Manrope'] text-sm text-[#1a3a2e] hover:text-[#2a5f4a] font-semibold">View All</button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
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
                    <span className="font-['Manrope'] text-xs text-gray-500">{activity.time}</span>
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
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-emerald-700">Inventory Health</p>
              <p className="font-['Crimson_Pro'] text-2xl font-bold text-emerald-900">92%</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-emerald-700">347 products well-stocked</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-orange-700">Low Stock Alert</p>
              <p className="font-['Crimson_Pro'] text-2xl font-bold text-orange-900">23</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-orange-700">Products need restocking</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-red-700">Pending Refunds</p>
              <p className="font-['Crimson_Pro'] text-2xl font-bold text-red-900">Rs 3,240</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-red-700">8 refund requests awaiting</p>
        </motion.div>
      </div>
    </div>
  );
}
