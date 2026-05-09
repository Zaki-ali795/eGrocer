import { useState, useEffect } from 'react';
import { MessageSquare, Eye, Trash2, DollarSign, Clock, Users, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

interface Request {
  id: string;
  customer: string;
  product: string;
  description: string;
  budget: string;
  status: string;
  posted: string;
}

export function CustomerRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'active' | 'closed'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await adminApi.getProductRequests();
        setRequests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter(req => req.status.toLowerCase() === filter);

  const stats = {
    open: requests.filter(r => r.status.toLowerCase() === 'open').length,
    active: requests.filter(r => r.status.toLowerCase() === 'active').length,
    closed: requests.filter(r => r.status.toLowerCase() === 'closed').length,
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load customer requests</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
    </div>
  );

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
                    request.status.toLowerCase() === 'open' ? 'bg-blue-100 text-blue-700' :
                    request.status.toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <p className="font-['Manrope'] text-sm text-gray-600 mb-3">{request.id} • Posted by {request.customer}</p>
                <p className="font-['Manrope'] text-gray-700 mb-4">{request.description}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-['Manrope'] text-xs text-gray-500">Customer Budget</p>
                      <p className="font-['Manrope'] font-bold text-gray-900">{request.budget}</p>
                    </div>
                  </div>

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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
