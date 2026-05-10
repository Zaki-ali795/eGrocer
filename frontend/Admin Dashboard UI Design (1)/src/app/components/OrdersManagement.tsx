import { Search, Download, Eye, Package, Truck, CheckCircle, XCircle, Loader2, ArrowUpRight, Clock, ShieldCheck, ShoppingBag, RefreshCw, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  date: string;
}

const statusConfig: any = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Package },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: Package },
  processing: { label: 'Processing', color: 'bg-indigo-100 text-indigo-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

export function OrdersManagement({ searchQuery = '' }: { searchQuery?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleExport = () => {
    const headers = ['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'];
    const csvRows = [
      headers.join(','),
      ...filteredOrders.map(o => [
        o.orderNumber,
        `"${o.customer}"`,
        o.items,
        o.total,
        o.status,
        new Date(o.date).toLocaleDateString()
      ].join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const combinedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch = order.orderNumber.toLowerCase().includes(combinedSearch) ||
                         order.customer.toLowerCase().includes(combinedSearch);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load orders</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button onClick={loadData} className="mt-4 text-emerald-600 font-bold underline">Try Again</button>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="font-['Manrope'] text-gray-600">Track and manage customer fulfillment</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-[#064e3b] text-white rounded-2xl font-['Manrope'] font-bold shadow-lg shadow-emerald-900/20 hover:bg-[#053d2e] transition-all"
          >
            <Download className="w-5 h-5" />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, status: 'all', icon: ShoppingBag, color: 'emerald' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, status: 'pending', icon: Clock, color: 'amber' },
          { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, status: 'confirmed', icon: ShieldCheck, color: 'blue' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, status: 'processing', icon: RefreshCw, color: 'indigo' },
        ].map((stat, index) => {
          const Icon = stat.icon || Package;
          const isSelected = selectedStatus === stat.status;
          
          return (
            <motion.button
              key={stat.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setSelectedStatus(stat.status)}
              className={`relative overflow-hidden p-6 rounded-3xl text-left transition-all duration-300 group ${
                isSelected
                  ? 'bg-[#064e3b] text-white shadow-xl shadow-emerald-900/20'
                  : 'bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-lg'
              }`}
            >
              <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 ${isSelected ? 'text-white' : 'text-emerald-900'}`}>
                <Icon className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  isSelected ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className={`font-['Manrope'] text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-['Crimson_Pro'] text-4xl font-bold">{stat.value}</p>
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    +12%
                  </span>
                </div>
              </div>
              
              {isSelected && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400" 
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Order Manifest</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Showing:</span>
            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold capitalize">
              {selectedStatus}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Order ID</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Customer</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Items</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Total</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Date</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const statusInfo = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100', icon: Package };
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-['Manrope'] font-semibold text-gray-900">{order.orderNumber}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['Manrope'] text-sm text-gray-700">{order.customer}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['Manrope'] text-sm text-gray-700">{order.items} items</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['Manrope'] font-semibold text-gray-900">Rs {order.total.toLocaleString()}</span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="relative group/status w-fit">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`appearance-none pl-10 pr-8 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${statusInfo.color} border-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer transition-all hover:scale-105`}
                        >
                          {Object.keys(statusConfig).map(statusKey => (
                            <option key={statusKey} value={statusKey}>{statusConfig[statusKey].label}</option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-3 h-3 opacity-50" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['Manrope'] text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </div>
                        <button className="text-xs font-bold text-emerald-600 hover:underline">
                          View Items
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
