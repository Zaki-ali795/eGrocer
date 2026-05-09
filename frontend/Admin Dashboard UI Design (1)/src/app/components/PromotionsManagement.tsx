import { useState, useEffect } from 'react';
import { Tag, Plus, Copy, Edit, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

interface Promo {
  id: string;
  code: string;
  value: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  limit: number;
  usage: number;
  expiry: string;
  status: 'active' | 'inactive';
}

export function PromotionsManagement() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await adminApi.getPromotions();
        setPromos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPromos = filter === 'all'
    ? promos
    : promos.filter(promo => promo.status === filter);

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load promotions</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
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
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Promotions</h1>
          <p className="font-['Manrope'] text-gray-600">Manage promo codes and coupons</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1a3a2e] to-[#2a5f4a] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Promo Code
        </motion.button>
      </motion.div>

      <div className="flex gap-3">
        {(['all', 'active', 'inactive'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-3 rounded-2xl font-['Manrope'] font-semibold transition-all ${
              filter === status
                ? 'bg-[#1a3a2e] text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo, index) => {
          const usagePercentage = (promo.usage / (promo.limit || 1)) * 100;
          const isExpiringSoon = new Date(promo.expiry).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

          return (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`bg-white rounded-3xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${
                promo.status === 'active' ? 'border-emerald-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1a3a2e] to-[#2a5f4a] rounded-xl flex items-center justify-center">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-['Manrope'] font-semibold ${
                    promo.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {promo.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900">{promo.code}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(promo.code)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors" 
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="font-['Manrope'] text-sm text-gray-600">ID: {promo.id}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-['Manrope'] text-sm text-gray-600">Discount</span>
                  <span className="font-['Manrope'] font-bold text-[#1a3a2e]">
                    {promo.type === 'percentage' ? `${promo.value}%` : `Rs ${promo.value}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Manrope'] text-sm text-gray-600">Min. Order</span>
                  <span className="font-['Manrope'] font-semibold text-gray-900">
                    {promo.minOrder > 0 ? `Rs ${promo.minOrder.toLocaleString()}` : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Manrope'] text-sm text-gray-600">Expiry</span>
                  <span className={`font-['Manrope'] font-semibold ${isExpiringSoon ? 'text-orange-600' : 'text-gray-900'}`}>
                    {new Date(promo.expiry).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Manrope'] text-xs text-gray-600">Usage</span>
                  <span className="font-['Manrope'] text-xs font-semibold text-gray-900">
                    {promo.usage} / {promo.limit || '∞'}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
                    className={`h-full rounded-full ${
                      usagePercentage >= 90 ? 'bg-red-500' :
                      usagePercentage >= 70 ? 'bg-orange-500' :
                      'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-gray-200 transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-50 text-red-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
