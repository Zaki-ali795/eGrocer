import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Download, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

const salesByCategory = [
  { name: 'Fruits', value: 12500 },
  { name: 'Vegetables', value: 9800 },
  { name: 'Dairy', value: 15200 },
  { name: 'Bakery', value: 8900 },
  { name: 'Meat', value: 11300 },
  { name: 'Beverages', value: 13400 },
];

const monthlyGrowth = [
  { month: 'Oct', sales: 45000, orders: 320, customers: 156 },
  { month: 'Nov', sales: 52000, orders: 380, customers: 189 },
  { month: 'Dec', sales: 48000, orders: 350, customers: 201 },
  { month: 'Jan', sales: 61000, orders: 430, customers: 234 },
  { month: 'Feb', sales: 55000, orders: 390, customers: 267 },
  { month: 'Mar', sales: 67000, orders: 480, customers: 298 },
];

const customerSegment = [
  { name: 'Returning', value: 68 },
  { name: 'New', value: 32 },
];

const COLORS = ['#1a3a2e', '#2a5f4a', '#ff6b35', '#ffa500', '#4a90e2', '#9b59b6'];

export function ReportsAnalytics() {
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
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1a3a2e] to-[#2a5f4a] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all">
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
            <BarChart data={salesByCategory}>
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
              <Bar dataKey="value" fill="#1a3a2e" radius={[8, 8, 0, 0]} />
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
                  {customerSegment.map((entry, index) => (
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
        <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-6">6-Month Performance Overview</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888" style={{ fontFamily: 'Manrope', fontSize: 12 }} />
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
            <Line type="monotone" dataKey="sales" stroke="#1a3a2e" strokeWidth={3} name="Sales (Rupees)" />
            <Line type="monotone" dataKey="orders" stroke="#ff6b35" strokeWidth={3} name="Orders" />
            <Line type="monotone" dataKey="customers" stroke="#4a90e2" strokeWidth={3} name="New Customers" />
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
              <p className="font-['Manrope'] text-xs text-emerald-700">Avg Order Value</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-emerald-900">Rs 40,000</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-emerald-700">+8.4% from last month</p>
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
              <p className="font-['Manrope'] text-xs text-blue-700">Customer Retention</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-blue-900">68%</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-blue-700">Returning customers</p>
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
              <p className="font-['Manrope'] text-xs text-purple-700">Conversion Rate</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-purple-900">3.8%</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-purple-700">+0.6% improvement</p>
        </motion.div>
      </div>
    </div>
  );
}
