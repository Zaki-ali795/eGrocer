import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Payments() {
  const { sellerId } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEarnings();
  }, [sellerId]);

  async function loadEarnings() {
    if (!sellerId) return;
    try {
      setLoading(true);
      const data = await sellerApi.getEarnings(sellerId);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const totalEarnings = transactions
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const pendingPayments = transactions
    .filter((t: any) => t.status === 'pending' || t.status === 'processing')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const refunds = transactions
    .filter((t: any) => t.type === 'refund')
    .reduce((sum: number, t: any) => Math.abs(t.amount) + sum, 0);

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Payments & Earnings</h1>
        <p className="text-muted-foreground mt-1">Track your revenue and transaction history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 mb-1">Total Earnings</p>
              <h3 className="text-4xl font-semibold">Rs.{totalEarnings.toFixed(2)}</h3>
              <p className="text-sm text-white/70 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +18.2% from last month
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground mb-1">Pending Payments</p>
              <h3 className="text-3xl font-semibold text-accent">Rs.{pendingPayments.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Processing
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground mb-1">Total Refunds</p>
              <h3 className="text-3xl font-semibold text-destructive">Rs.{refunds.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground mt-2">This month</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Weekly Revenue</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactions.slice(0, 7).map((t: any) => ({ date: format(new Date(t.date), 'MM/dd'), sales: t.amount }))}>
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
            <Bar dataKey="sales" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">eGrocer Wallet</p>
                  <p className="text-sm text-muted-foreground">Primary method</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Bank Transfer</p>
                  <p className="text-sm text-muted-foreground">Account ending in 4532</p>
                </div>
              </div>
              <button className="text-sm text-primary font-medium hover:text-primary/80">Edit</button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-6 border border-accent/30">
          <h3 className="text-lg font-semibold text-foreground mb-3">Payout Schedule</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your earnings are automatically transferred to your bank account every Monday.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next payout:</span>
              <span className="font-medium text-foreground">Next Monday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="text-lg font-semibold text-primary">Rs.{pendingPayments.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Transaction ID</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Order ID</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Date</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Type</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: any) => (
                <tr key={transaction.transaction_id} className="border-t border-border hover:bg-sidebar-accent/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-emerald-900">TXN-{transaction.transaction_id}</td>
                  <td className="py-4 px-6 text-muted-foreground">#{transaction.order_id}</td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {format(new Date(transaction.date), 'MMM dd, HH:mm')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'payment' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {transaction.type === 'payment' ? 'Payment' : 'Refund'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-emerald-900">
                    {transaction.amount >= 0 ? '+' : ''}Rs.{transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                      transaction.status === 'delivered' ? 'bg-primary/10 text-primary' :
                      transaction.status === 'processing' ? 'bg-accent/10 text-accent' :
                      'bg-chart-4/10 text-chart-4'
                    }`}>
                      {transaction.status === 'delivered' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
