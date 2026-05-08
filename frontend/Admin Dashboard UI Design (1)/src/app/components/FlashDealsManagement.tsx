import { useState } from 'react';
import { Zap, Plus, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface FlashDeal {
  id: string;
  product: string;
  discount: number;
  originalPrice: number;
  startTime: string;
  endTime: string;
  active: boolean;
  sales: number;
}

const mockDeals: FlashDeal[] = [
  { id: 'FD-001', product: 'Organic Bananas', discount: 25, originalPrice: 399, startTime: '2026-04-14 08:00', endTime: '2026-04-14 20:00', active: true, sales: 87 },
  { id: 'FD-002', product: 'Premium Salmon', discount: 30, originalPrice: 2499, startTime: '2026-04-14 10:00', endTime: '2026-04-14 22:00', active: true, sales: 34 },
  { id: 'FD-003', product: 'Artisan Bread Bundle', discount: 20, originalPrice: 1299, startTime: '2026-04-14 06:00', endTime: '2026-04-14 18:00', active: true, sales: 156 },
  { id: 'FD-004', product: 'Mixed Berries Pack', discount: 35, originalPrice: 1599, startTime: '2026-04-15 08:00', endTime: '2026-04-15 20:00', active: false, sales: 0 },
];

export function FlashDealsManagement() {
  const [showActive, setShowActive] = useState(true);

  const filteredDeals = mockDeals.filter(deal => showActive ? deal.active : !deal.active);

  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m left`;
  };

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
          Active Deals ({mockDeals.filter(d => d.active).length})
        </button>
        <button
          onClick={() => setShowActive(false)}
          className={`px-6 py-3 rounded-2xl font-['Manrope'] font-semibold transition-all ${
            !showActive
              ? 'bg-[#1a3a2e] text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Scheduled ({mockDeals.filter(d => !d.active).length})
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
            {deal.active && (
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

              {deal.active && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="font-['Manrope'] text-sm font-semibold text-orange-900">
                      {calculateTimeLeft(deal.endTime)}
                    </span>
                  </div>
                  <p className="font-['Manrope'] text-xs text-orange-700">
                    Ends at {new Date(deal.endTime).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {!deal.active && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
                  <p className="font-['Manrope'] text-xs text-gray-600 mb-1">Scheduled</p>
                  <p className="font-['Manrope'] text-sm font-semibold text-gray-900">
                    {new Date(deal.startTime).toLocaleDateString()} at {new Date(deal.startTime).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {deal.active && (
                <div className="flex items-center gap-2 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-['Manrope'] text-sm font-semibold">{deal.sales} sales today</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-gray-200 transition-colors">
                Edit
              </button>
              <button className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-red-100 transition-colors">
                {deal.active ? 'End Early' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
