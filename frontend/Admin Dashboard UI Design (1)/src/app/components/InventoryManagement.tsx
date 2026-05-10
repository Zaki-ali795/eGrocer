import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Package, TrendingDown, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  reorderLevel: number;
  status: string;
}

export function InventoryManagement({ searchQuery = '' }: { searchQuery?: string }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'good' | 'low' | 'critical' | 'out'>('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getInventory();
      setInventory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (id: string) => {
    const amount = window.prompt('Enter amount to add (positive) or subtract (negative):');
    if (amount) {
      const quantity = parseInt(amount);
      if (!isNaN(quantity)) {
        try {
          await adminApi.adjustStock(id, quantity);
          loadData();
        } catch (err: any) {
          alert(err.message);
        }
      }
    }
  };

  const getStatus = (item: InventoryItem) => {
    if (item.stock <= 0) return 'out';
    if (item.stock <= item.reorderLevel * 0.5) return 'critical';
    if (item.stock <= item.reorderLevel) return 'low';
    return 'good';
  };

  const inventoryWithStatus = inventory.map(item => ({
    ...item,
    calculatedStatus: getStatus(item)
  }));

  const filteredInventory = inventoryWithStatus.filter(item => {
    const matchesFilter = filter === 'all' || item.calculatedStatus === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    good: inventoryWithStatus.filter(i => i.calculatedStatus === 'good').length,
    low: inventoryWithStatus.filter(i => i.calculatedStatus === 'low').length,
    critical: inventoryWithStatus.filter(i => i.calculatedStatus === 'critical').length,
    out: inventoryWithStatus.filter(i => i.calculatedStatus === 'out').length,
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load inventory</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button onClick={loadData} className="mt-4 text-emerald-600 font-bold underline">Try Again</button>
    </div>
  );

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
          onClick={() => setFilter('good')}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 cursor-pointer hover:shadow-md transition-shadow"
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
          onClick={() => setFilter('low')}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200 cursor-pointer hover:shadow-md transition-shadow"
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
          onClick={() => setFilter('critical')}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
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
              className="font-['Manrope'] text-sm text-[#064e3b] hover:text-[#10b981] font-semibold"
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
                    <span className={`font-['Manrope'] font-bold text-lg ${
                      item.calculatedStatus === 'out' ? 'text-red-600' :
                      item.calculatedStatus === 'critical' ? 'text-orange-600' :
                      item.calculatedStatus === 'low' ? 'text-amber-600' :
                      'text-emerald-600'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-600">{item.reorderLevel}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${
                      item.calculatedStatus === 'good' ? 'bg-emerald-100 text-emerald-700' :
                      item.calculatedStatus === 'low' ? 'bg-amber-100 text-amber-700' :
                      item.calculatedStatus === 'critical' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.calculatedStatus === 'good' ? 'Well Stocked' :
                       item.calculatedStatus === 'low' ? 'Low Stock' :
                       item.calculatedStatus === 'critical' ? 'Critical' :
                       'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => handleAdjustStock(item.id)}
                      className="px-4 py-2 bg-[#064e3b] text-white rounded-xl font-['Manrope'] text-sm font-medium hover:bg-[#234d3e] transition-colors"
                    >
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
