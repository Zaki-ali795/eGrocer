import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Download, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

const COLORS = ['#064e3b', '#10b981', '#ff6b35', '#ffa500', '#4a90e2', '#9b59b6'];

export function ReportsAnalytics() {
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
      <p className="text-red-600 font-semibold text-lg">Failed to load analytics</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
    </div>
  );

  const customerSegment = [
    { name: 'Active', value: 85 },
    { name: 'New', value: 15 },
  ];

  const handleExport = () => {
    if (!data) return;

    const sections = [
      ['--- Platform Overview ---'],
      ['Metric', 'Value'],
      ['Monthly Revenue', `Rs ${data.stats.monthly_revenue}`],
      ['Today Orders', data.stats.today_orders],
      ['Total Sellers', data.stats.seller_count],
      [''],
      ['--- Sales by Category ---'],
      ['Category', 'Sales'],
      ...data.topCategories.map((c: any) => [c.name, c.sales]),
      [''],
      ['--- Revenue History ---'],
      ['Date', 'Revenue'],
      ...data.revenueHistory.map((h: any) => [h.name, h.revenue])
    ];

    const csvContent = sections.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eGrocer_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="font-['Manrope'] text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-['Manrope'] font-semibold text-gray-700 hover:border-gray-300 transition-all">
            <Calendar className="w-5 h-5" />
            Date Range
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#064e3b] to-[#10b981] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.topCategories || []}>
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
              <Bar dataKey="sales" fill="#064e3b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-6">Customer Segments</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerSegment.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontFamily: 'Manrope',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {customerSegment.map((segment, index) => (
              <div key={segment.name} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                <span className="font-['Manrope'] text-sm text-gray-700">{segment.name} ({segment.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-6">Revenue Growth</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data?.revenueHistory || []}>
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
            <Legend wrapperStyle={{ fontFamily: 'Manrope' }} />
            <Line type="monotone" dataKey="revenue" stroke="#064e3b" strokeWidth={3} name="Revenue (Rupees)" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-emerald-700">Total Sales</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-emerald-900">Rs {data?.stats.monthly_revenue?.toLocaleString()}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-emerald-700">Live platform stats</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-blue-700">Orders</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-blue-900">{data?.stats.today_orders}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-blue-700">Total orders processed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-purple-700">Active Sellers</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-purple-900">{data?.stats.seller_count}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-purple-700">Platform scale</p>
        </motion.div>
      </div>
    </div>
  );
}
