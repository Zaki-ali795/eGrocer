import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Package, Truck, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

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

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="font-['Manrope'] text-gray-600">Track and manage customer orders</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-['Manrope'] font-semibold text-gray-700 hover:border-gray-300 transition-all"
        >
          <Download className="w-5 h-5" />
          Export Orders
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, status: 'all' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, status: 'pending' },
          { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, status: 'confirmed' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, status: 'processing' },
        ].map((stat, index) => (
          <motion.button
            key={stat.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => setSelectedStatus(stat.status)}
            className={`p-4 rounded-2xl text-left transition-all ${
              selectedStatus === stat.status
                ? 'bg-[#1a3a2e] text-white shadow-lg'
                : 'bg-white border border-gray-200 hover:border-[#1a3a2e]/30'
            }`}
          >
            <p className={`font-['Manrope'] text-sm mb-1 ${selectedStatus === stat.status ? 'text-white/80' : 'text-gray-600'}`}>
              {stat.label}
            </p>
            <p className="font-['Crimson_Pro'] text-3xl font-bold">{stat.value}</p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl font-['Manrope'] text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-[#1a3a2e]/20 focus:outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl font-['Manrope'] font-medium text-gray-700 hover:bg-gray-100 transition-all">
            <Filter className="w-5 h-5" />
            Filters
          </button>
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
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${statusInfo.color} border-none focus:ring-0 cursor-pointer`}
                      >
                        {Object.keys(statusConfig).map(statusKey => (
                          <option key={statusKey} value={statusKey}>{statusConfig[statusKey].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['Manrope'] text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
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
