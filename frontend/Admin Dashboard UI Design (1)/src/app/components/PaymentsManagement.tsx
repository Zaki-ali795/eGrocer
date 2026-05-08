import { useState } from 'react';
import { DollarSign, TrendingUp, RefreshCw, CreditCard, Smartphone, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'refunded';
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-8473', orderId: 'ORD-12847', customer: 'Sarah Johnson', amount: 12745, method: 'Credit Card', status: 'completed', date: '2026-04-14' },
  { id: 'TXN-8472', orderId: 'ORD-12846', customer: 'Michael Chen', amount: 8999, method: 'PayPal', status: 'completed', date: '2026-04-14' },
  { id: 'TXN-8471', orderId: 'ORD-12845', customer: 'Emma Wilson', amount: 20350, method: 'Credit Card', status: 'completed', date: '2026-04-13' },
  { id: 'TXN-8470', orderId: 'ORD-12844', customer: 'James Brown', amount: 4520, method: 'Debit Card', status: 'pending', date: '2026-04-13' },
  { id: 'TXN-8469', orderId: 'ORD-12840', customer: 'Lucas Anderson', amount: 3450, method: 'Digital Wallet', status: 'refunded', date: '2026-04-11' },
];

const revenueData = [
  { date: '04/08', amount: 8500 },
  { date: '04/09', amount: 9200 },
  { date: '04/10', amount: 7800 },
  { date: '04/11', amount: 10500 },
  { date: '04/12', amount: 11200 },
  { date: '04/13', amount: 9800 },
  { date: '04/14', amount: 12400 },
];

export function PaymentsManagement() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all');

  const filteredTransactions = filter === 'all'
    ? mockTransactions
    : mockTransactions.filter(txn => txn.status === filter);

  const totalRevenue = mockTransactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = mockTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const refundedAmount = mockTransactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="font-['Manrope'] text-gray-600">Financial overview and transaction management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-emerald-700">Total Revenue</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-emerald-900">Rs {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="w-4 h-4" />
            <span className="font-['Manrope'] text-sm font-semibold">+15.3% from last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border border-amber-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-amber-700">Pending</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-amber-900">Rs {pendingAmount.toLocaleString()}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-amber-700">
            {mockTransactions.filter(t => t.status === 'pending').length} transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-red-700">Refunded</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-red-900">Rs {refundedAmount.toLocaleString()}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-red-700">
            {mockTransactions.filter(t => t.status === 'refunded').length} refund requests
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-6">Revenue Trend (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
            <YAxis stroke="#888" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                fontFamily: 'Manrope',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Line type="monotone" dataKey="amount" stroke="#1a3a2e" strokeWidth={3} dot={{ fill: '#1a3a2e', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Recent Transactions</h2>
          <div className="flex gap-2">
            {(['all', 'completed', 'pending', 'refunded'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-['Manrope'] text-sm font-medium transition-all ${
                  filter === status
                    ? 'bg-[#1a3a2e] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Transaction ID</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Order ID</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Customer</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Amount</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Method</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, index) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] font-semibold text-gray-900">{txn.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-700">{txn.orderId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-700">{txn.customer}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] font-bold text-gray-900">Rs {txn.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {txn.method.includes('Card') ? (
                        <CreditCard className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="font-['Manrope'] text-sm text-gray-700">{txn.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${
                      txn.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      txn.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-600">{txn.date}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
