import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, RefreshCw, CreditCard, Smartphone, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '../services/api';

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

export function PaymentsManagement({ searchQuery = '' }: { searchQuery?: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [txnData, overviewData] = await Promise.all([
          adminApi.getPayments(),
          adminApi.getDashboardOverview()
        ]);
        setTransactions(txnData);
        setOverview(overviewData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredTransactions = transactions.filter(txn => {
    const matchesFilter = filter === 'all' || txn.status.toLowerCase() === filter;
    const matchesSearch = txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = transactions.filter(t => t.status === 'completed' || t.status === 'Success').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const refundedAmount = transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0);

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load payments</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
    </div>
  );

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
          onClick={() => setFilter('completed')}
          className={`rounded-3xl p-6 border transition-all cursor-pointer hover:shadow-md ${
            filter === 'completed' ? 'bg-emerald-100 border-emerald-300 shadow-inner' : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <IndianRupee className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-emerald-700">Completed</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-emerald-900">Rs {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="w-4 h-4" />
            <span className="font-['Manrope'] text-sm font-semibold">+Live tracking enabled</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setFilter('pending')}
          className={`rounded-3xl p-6 border transition-all cursor-pointer hover:shadow-md ${
            filter === 'pending' ? 'bg-amber-100 border-amber-300 shadow-inner' : 'bg-amber-50 border-amber-200'
          }`}
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
            {transactions.filter(t => t.status === 'pending').length} transactions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setFilter('refunded')}
          className={`rounded-3xl p-6 border transition-all cursor-pointer hover:shadow-md ${
            filter === 'refunded' ? 'bg-red-100 border-red-300 shadow-inner' : 'bg-red-50 border-red-200'
          }`}
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
            {transactions.filter(t => t.status === 'refunded').length} refund requests
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-6">Revenue History</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={overview?.revenueHistory || []}>
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
            <Line type="monotone" dataKey="amount" stroke="var(--green-dark)" strokeWidth={3} dot={{ fill: 'var(--green-dark)', r: 5 }} />
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
                    ? 'bg-[var(--green-dark)] text-white'
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
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Order ID</th>
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
                    <span className="font-['Manrope'] font-semibold text-gray-900">{txn.orderId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] font-bold text-gray-900">Rs {txn.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {txn.method.toLowerCase().includes('card') ? (
                        <CreditCard className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="font-['Manrope'] text-sm text-gray-700">{txn.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${
                      (txn.status === 'completed' || txn.status === 'Success') ? 'bg-[var(--primary)]/10 text-[var(--green-dark)]' :
                      txn.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-600">{new Date(txn.date).toLocaleDateString()}</span>
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
