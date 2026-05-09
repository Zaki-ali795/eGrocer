import { useState, useEffect } from 'react';
import { Zap, Plus, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

interface FlashDeal {
  id: string;
  product: string;
  discount: number;
  originalPrice: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'inactive';
  sold: number;
  max: number;
}

export function FlashDealsManagement() {
  const [deals, setDeals] = useState<FlashDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await adminApi.getFlashDeals();
        setDeals(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredDeals = deals.filter(deal => showActive ? deal.status === 'active' : deal.status === 'inactive');

  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m left`;
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load flash deals</p>
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
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Flash Deals</h1>
          <p className="font-['Manrope'] text-gray-600">Create and manage time-limited promotions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Flash Deal
        </motion.button>
      </motion.div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowActive(true)}
          className={`px-6 py-3 rounded-2xl font-['Manrope'] font-semibold transition-all ${
            showActive
              ? 'bg-[#1a3a2e] text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Active Deals ({deals.filter(d => d.status === 'active').length})
        </button>
        <button
          onClick={() => setShowActive(false)}
          className={`px-6 py-3 rounded-2xl font-['Manrope'] font-semibold transition-all ${
            !showActive
              ? 'bg-[#1a3a2e] text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Inactive/Ended ({deals.filter(d => d.status !== 'active').length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 overflow-hidden relative"
          >
            {deal.status === 'active' && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white rounded-full text-xs font-['Manrope'] font-semibold">
                  <Zap className="w-3 h-3" />
                  LIVE
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="font-['Manrope'] text-xs text-gray-500 mb-1">{deal.id}</p>
              <h3 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900 mb-2">{deal.product}</h3>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-['Crimson_Pro'] text-4xl font-bold text-[#ff6b35]">{deal.discount}%</span>
                <span className="font-['Manrope'] text-sm text-gray-600">OFF</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="font-['Manrope'] text-lg font-bold text-gray-900">
                  Rs {Math.round(deal.originalPrice * (1 - deal.discount / 100))}
                </span>
                <span className="font-['Manrope'] text-sm text-gray-500 line-through">
                  Rs {deal.originalPrice}
                </span>
              </div>

              {deal.status === 'active' && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="font-['Manrope'] text-sm font-semibold text-orange-900">
                        {calculateTimeLeft(deal.endTime)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mb-1">
                    <div 
                      className="bg-[#ff6b35] h-2 rounded-full transition-all" 
                      style={{ width: `${(deal.sold / deal.max) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-['Manrope'] text-orange-700 font-semibold">
                    <span>{deal.sold} sold</span>
                    <span>{deal.max} total</span>
                  </div>
                </div>
              )}

              {deal.status !== 'active' && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
                  <p className="font-['Manrope'] text-xs text-gray-600 mb-1">Scheduled / Ended</p>
                  <p className="font-['Manrope'] text-sm font-semibold text-gray-900">
                    {new Date(deal.startTime).toLocaleDateString()} - {new Date(deal.endTime).toLocaleDateString()}
                  </p>
                </div>
              )}

              {deal.status === 'active' && (
                <div className="flex items-center gap-2 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-['Manrope'] text-sm font-semibold">{deal.sold} items claimed</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-gray-200 transition-colors">
                Edit
              </button>
              <button className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-red-100 transition-colors">
                {deal.status === 'active' ? 'End Early' : 'Delete'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
