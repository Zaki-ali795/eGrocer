import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, DollarSign, ShoppingBag, AlertCircle, Package, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { salesData, categoryData, mockOrders } from '../data/mockData';
import { Link } from 'react-router';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  color
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: 'up' | 'down';
  color: string;
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-emerald-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-semibold text-foreground mb-2">{value}</h3>
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
            {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span className="font-medium">{change}</span>
            <span className="text-muted-foreground ml-1">vs last week</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#FBBF24', '#EF4444'];

export default function Dashboard() {
  const { sellerId } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      if (!sellerId) return;
      try {
        setLoading(true);
        const data = await sellerApi.getStats(sellerId);
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [sellerId]);

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const totalSalesValue = stats?.total_revenue || 0;
  const activeOrdersCount = stats?.total_orders || 0;
  const lowStockCount = stats?.low_stock_count || 0;
  const pendingRequestsCount = stats?.pending_requests || 0;

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales (All Time)"
          value={`Rs.${totalSalesValue.toLocaleString()}`}
          change="+0%"
          icon={DollarSign}
          trend="up"
          color="indigo"
        />
        <StatCard
          title="Total Orders"
          value={activeOrdersCount.toString()}
          change="+0%"
          icon={ShoppingBag}
          trend="up"
          color="green"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequestsCount.toString()}
          change="+0"
          icon={Package}
          trend="up"
          color="orange"
        />
        <StatCard
          title="Inventory Alerts"
          value={lowStockCount.toString()}
          change="0"
          icon={AlertCircle}
          trend="down"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Add Product
          </Link>
          <Link
            to="/inventory"
            className="px-5 py-2.5 bg-card text-foreground border border-border rounded-lg font-medium hover:bg-emerald-500 transition-all"
          >
            Update Stock
          </Link>
          <Link
            to="/requests"
            className="px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            View Requests
          </Link>
          <Link
            to="/promotions"
            className="px-5 py-2.5 bg-card text-foreground border border-border rounded-lg font-medium hover:bg-emerald-500 transition-all"
          >
            Create Promotion
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <Link to="/orders" className="text-primary hover:text-primary/80 font-medium text-sm">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recent_orders || []).map((order: any) => (
                <tr key={order.order_id} className="border-b border-border hover:bg-sidebar-accent transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{order.order_number || `#ORD-${order.order_id}`}</td>
                  <td className="py-3 px-4 text-foreground">{order.customer_name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.item_count} items</td>
                  <td className="py-3 px-4 font-medium text-foreground">Rs.{order.total_price.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.order_status === 'delivered' ? 'bg-primary/10 text-primary' :
                      order.order_status === 'processing' ? 'bg-accent/10 text-accent' :
                      order.order_status === 'pending' ? 'bg-chart-4/10 text-chart-4' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
