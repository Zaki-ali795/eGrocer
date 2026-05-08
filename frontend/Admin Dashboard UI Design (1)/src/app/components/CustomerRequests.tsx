import { useState } from 'react';
import { MessageSquare, Eye, Trash2, DollarSign, Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface Request {
  id: string;
  customer: string;
  product: string;
  description: string;
  budget: number;
  offers: number;
  bestOffer: number;
  status: 'open' | 'active' | 'closed';
  posted: string;
}

const mockRequests: Request[] = [
  { id: 'REQ-001', customer: 'Sarah Johnson', product: 'Organic Tomatoes (Bulk)', description: 'Need 50kg of organic tomatoes for restaurant', budget: 15000, offers: 7, bestOffer: 12800, status: 'active', posted: '2026-04-14' },
  { id: 'REQ-002', customer: 'Michael Chen', product: 'Fresh Salmon Fillet', description: 'Looking for fresh wild-caught salmon, 10kg', budget: 20000, offers: 4, bestOffer: 18500, status: 'active', posted: '2026-04-13' },
  { id: 'REQ-003', customer: 'Emma Wilson', product: 'Artisan Bread Wholesale', description: 'Weekly supply of sourdough and rye bread', budget: 30000, offers: 12, bestOffer: 26500, status: 'active', posted: '2026-04-13' },
  { id: 'REQ-004', customer: 'James Brown', product: 'Free Range Eggs', description: 'Need 20 dozen eggs weekly', budget: 8000, offers: 0, bestOffer: 0, status: 'open', posted: '2026-04-14' },
  { id: 'REQ-005', customer: 'Olivia Davis', product: 'Seasonal Vegetables Mix', description: 'Mixed vegetables for catering business', budget: 25000, offers: 15, bestOffer: 22000, status: 'closed', posted: '2026-04-10' },
];

export function CustomerRequests() {
  const [filter, setFilter] = useState<'all' | 'open' | 'active' | 'closed'>('all');

  const filteredRequests = filter === 'all'
    ? mockRequests
    : mockRequests.filter(req => req.status === filter);

  const stats = {
    open: mockRequests.filter(r => r.status === 'open').length,
    active: mockRequests.filter(r => r.status === 'active').length,
    closed: mockRequests.filter(r => r.status === 'closed').length,
  };

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Customer Requests</h1>
        <p className="font-['Manrope'] text-gray-600">Monitor bidding system and product requests</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-blue-700">Open Requests</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-blue-900">{stats.open}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-blue-700">Awaiting seller offers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-emerald-700">Active Bidding</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-emerald-900">{stats.active}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-emerald-700">Competitive offers received</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-['Manrope'] text-xs text-gray-700">Closed</p>
              <p className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900">{stats.closed}</p>
            </div>
          </div>
          <p className="font-['Manrope'] text-sm text-gray-700">Successfully fulfilled</p>
        </motion.div>
      </div>

      <div className="flex gap-3">
        {(['all', 'open', 'active', 'closed'] as const).map(status => (
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

      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">{request.product}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold ${
                    request.status === 'open' ? 'bg-blue-100 text-blue-700' :
                    request.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="font-['Manrope'] text-sm text-gray-600 mb-3">{request.id} • Posted by {request.customer}</p>
                <p className="font-['Manrope'] text-gray-700 mb-4">{request.description}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-['Manrope'] text-xs text-gray-500">Customer Budget</p>
                      <p className="font-['Manrope'] font-bold text-gray-900">Rs {request.budget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-['Manrope'] text-xs text-gray-500">Offers Received</p>
                      <p className="font-['Manrope'] font-bold text-gray-900">{request.offers}</p>
                    </div>
                  </div>

                  {request.bestOffer > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-['Manrope'] text-xs text-gray-500">Best Offer</p>
                        <p className="font-['Manrope'] font-bold text-emerald-600">Rs {request.bestOffer.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-['Manrope'] text-xs text-gray-500">Posted</p>
                      <p className="font-['Manrope'] font-semibold text-gray-700">
                        {new Date(request.posted).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors" title="View Details">
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 hover:bg-red-50 rounded-xl transition-colors" title="Remove">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            {request.status === 'active' && request.offers > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <button className="font-['Manrope'] text-sm text-[#1a3a2e] hover:text-[#2a5f4a] font-semibold">
                  View {request.offers} seller offers →
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
