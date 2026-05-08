import { useState } from 'react';
import { Search, Filter, Download, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  payment: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-12847', customer: 'Sarah Johnson', items: 8, total: 12745, payment: 'Credit Card', status: 'processing', date: '2026-04-14' },
  { id: 'ORD-12846', customer: 'Michael Chen', items: 5, total: 8999, payment: 'PayPal', status: 'shipped', date: '2026-04-14' },
  { id: 'ORD-12845', customer: 'Emma Wilson', items: 12, total: 20350, payment: 'Credit Card', status: 'delivered', date: '2026-04-13' },
  { id: 'ORD-12844', customer: 'James Brown', items: 3, total: 4520, payment: 'Debit Card', status: 'processing', date: '2026-04-13' },
  { id: 'ORD-12843', customer: 'Olivia Davis', items: 7, total: 15675, payment: 'Credit Card', status: 'pending', date: '2026-04-13' },
  { id: 'ORD-12842', customer: 'William Garcia', items: 4, total: 6780, payment: 'PayPal', status: 'delivered', date: '2026-04-12' },
  { id: 'ORD-12841', customer: 'Sophia Martinez', items: 15, total: 28999, payment: 'Credit Card', status: 'shipped', date: '2026-04-12' },
  { id: 'ORD-12840', customer: 'Lucas Anderson', items: 2, total: 3450, payment: 'Debit Card', status: 'cancelled', date: '2026-04-11' },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Package },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
          { label: 'Total Orders', value: mockOrders.length, status: 'all' },
          { label: 'Processing', value: mockOrders.filter(o => o.status === 'processing').length, status: 'processing' },
          { label: 'Shipped', value: mockOrders.filter(o => o.status === 'shipped').length, status: 'shipped' },
          { label: 'Delivered', value: mockOrders.filter(o => o.status === 'delivered').length, status: 'delivered' },
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
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Payment</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Date</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const statusInfo = statusConfig[order.status];
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
                      <span className="font-['Manrope'] font-semibold text-gray-900">{order.id}</span>
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
                      <span className="font-['Manrope'] text-sm text-gray-700">{order.payment}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${statusInfo.color} w-fit`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-['Manrope'] text-sm text-gray-600">{order.date}</span>
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

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <p className="font-['Manrope'] text-sm text-gray-600">
            Showing {filteredOrders.length} of {mockOrders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 rounded-xl font-['Manrope'] text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#1a3a2e] text-white rounded-xl font-['Manrope'] text-sm font-medium hover:bg-[#234d3e] transition-colors">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
