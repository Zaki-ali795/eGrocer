import { useState } from 'react';
import { AlertTriangle, CheckCircle, Package, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  status: 'good' | 'low' | 'critical' | 'out';
}

const mockInventory: InventoryItem[] = [
  { id: 'INV-001', name: 'Organic Bananas', category: 'Fruits', stock: 250, reorderPoint: 100, status: 'good' },
  { id: 'INV-002', name: 'Whole Milk (1L)', category: 'Dairy', stock: 180, reorderPoint: 80, status: 'good' },
  { id: 'INV-003', name: 'Organic Spinach', category: 'Vegetables', stock: 15, reorderPoint: 50, status: 'critical' },
  { id: 'INV-004', name: 'Sourdough Bread', category: 'Bakery', stock: 45, reorderPoint: 60, status: 'low' },
  { id: 'INV-005', name: 'Free Range Eggs', category: 'Dairy', stock: 120, reorderPoint: 80, status: 'good' },
  { id: 'INV-006', name: 'Blueberries', category: 'Fruits', stock: 0, reorderPoint: 30, status: 'out' },
  { id: 'INV-007', name: 'Roma Tomatoes', category: 'Vegetables', stock: 320, reorderPoint: 150, status: 'good' },
  { id: 'INV-008', name: 'Cheddar Cheese', category: 'Dairy', stock: 25, reorderPoint: 40, status: 'low' },
];

export function InventoryManagement() {
  const [filter, setFilter] = useState<'all' | 'good' | 'low' | 'critical' | 'out'>('all');

  const filteredInventory = filter === 'all'
    ? mockInventory
    : mockInventory.filter(item => item.status === filter);

  const stats = {
    good: mockInventory.filter(i => i.status === 'good').length,
    low: mockInventory.filter(i => i.status === 'low').length,
    critical: mockInventory.filter(i => i.status === 'critical').length,
    out: mockInventory.filter(i => i.status === 'out').length,
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Inventory</h1>
        <p className="font-['Manrope'] text-gray-600">Monitor stock levels and manage inventory</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-emerald-700">Well Stocked</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-emerald-900">{stats.good}</p>
            </div>
          </div>
          <button
            onClick={() => setFilter('good')}
            className={`text-xs font-['Manrope'] font-semibold ${filter === 'good' ? 'text-emerald-800' : 'text-emerald-600'}`}
          >
            View all →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-amber-700">Low Stock</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-amber-900">{stats.low}</p>
            </div>
          </div>
          <button
            onClick={() => setFilter('low')}
            className={`text-xs font-['Manrope'] font-semibold ${filter === 'low' ? 'text-amber-800' : 'text-amber-600'}`}
          >
            View all →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-orange-700">Critical</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-orange-900">{stats.critical}</p>
            </div>
          </div>
          <button
            onClick={() => setFilter('critical')}
            className={`text-xs font-['Manrope'] font-semibold ${filter === 'critical' ? 'text-orange-800' : 'text-orange-600'}`}
          >
            View all →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-red-700">Out of Stock</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-red-900">{stats.out}</p>
            </div>
          </div>
          <button
            onClick={() => setFilter('out')}
            className={`text-xs font-['Manrope'] font-semibold ${filter === 'out' ? 'text-red-800' : 'text-red-600'}`}
          >
            View all →
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">
            {filter === 'all' ? 'All Items' : filter.charAt(0).toUpperCase() + filter.slice(1) + ' Stock'}
          </h2>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="font-['Manrope'] text-sm text-[#1a3a2e] hover:text-[#2a5f4a] font-semibold"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Product</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Category</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Current Stock</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Reorder Point</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-['Manrope'] font-semibold text-gray-900">{item.name}</p>
                      <p className="font-['Manrope'] text-xs text-gray-500">{item.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-700">{item.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-['Manrope'] font-bold text-lg ${
                      item.status === 'out' ? 'text-red-600' :
                      item.status === 'critical' ? 'text-orange-600' :
                      item.status === 'low' ? 'text-amber-600' :
                      'text-emerald-600'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-600">{item.reorderPoint}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${
                      item.status === 'good' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'low' ? 'bg-amber-100 text-amber-700' :
                      item.status === 'critical' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'good' ? 'Well Stocked' :
                       item.status === 'low' ? 'Low Stock' :
                       item.status === 'critical' ? 'Critical' :
                       'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 bg-[#1a3a2e] text-white rounded-xl font-['Manrope'] text-sm font-medium hover:bg-[#234d3e] transition-colors">
                      Adjust Stock
                    </button>
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
