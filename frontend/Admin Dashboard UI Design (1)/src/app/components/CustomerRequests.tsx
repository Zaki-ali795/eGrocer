import { useState, useEffect } from 'react';
import { MessageSquare, Eye, Trash2, DollarSign, Clock, Users, Loader2, Package, Gavel, CheckCircle, ChevronRight, ShoppingBag, Search } from 'lucide-react';
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

export function CustomerRequests({ searchQuery = '' }: { searchQuery?: string }) {
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

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status.toLowerCase() === filter;
    const matchesSearch = req.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    open: requests.filter(r => r.status.toLowerCase() === 'open').length,
    active: requests.filter(r => r.status.toLowerCase() === 'active').length,
    closed: requests.filter(r => r.status.toLowerCase() === 'closed').length,
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: requests.length, status: 'all', icon: ShoppingBag },
          { label: 'Open Requests', value: stats.open, status: 'open', icon: MessageSquare },
          { label: 'Active Bidding', value: stats.active, status: 'active', icon: Gavel },
          { label: 'Closed Cases', value: stats.closed, status: 'closed', icon: CheckCircle },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const isSelected = filter === stat.status;
          
          return (
            <motion.button
              key={stat.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setFilter(stat.status as any)}
              className={`relative overflow-hidden p-6 rounded-3xl text-left transition-all duration-300 group ${
                isSelected
                  ? 'bg-[var(--green-dark)] text-white shadow-xl shadow-[var(--green-dark)]/20'
                  : 'bg-white border border-gray-100 hover:border-[var(--primary)]/20 hover:shadow-lg'
              }`}
            >
              <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 ${isSelected ? 'text-white' : 'text-emerald-900'}`}>
                <Icon className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  isSelected ? 'bg-white/20' : 'bg-[var(--primary)]/10 text-[var(--primary)]'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className={`font-['Manrope'] text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-['Crimson_Pro'] text-4xl font-bold">{stat.value}</p>
                </div>
              </div>
              
              {isSelected && (
                <motion.div 
                  layoutId="request-filter-indicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--green-secondary)]" 
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-[var(--primary)]">
            <Package className="w-5 h-5" />
          </div>
          <h2 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-900">Request Pipeline</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Status:</span>
          <div className="px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--green-dark)] rounded-full text-xs font-bold capitalize">
            {filter}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="group bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-[var(--primary)]/20 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[var(--green-dark)]/5 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--green-dark)] group-hover:text-white transition-all duration-300">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900 leading-tight">{request.product}</h3>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        request.status.toLowerCase() === 'open' ? 'bg-[var(--primary)]/10 text-[var(--green-dark)]' :
                        request.status.toLowerCase() === 'active' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          request.status.toLowerCase() === 'open' ? 'bg-[var(--primary)]' :
                          request.status.toLowerCase() === 'active' ? 'bg-amber-500' :
                          'bg-gray-400'
                        }`} />
                        {request.status}
                      </div>
                    </div>
                    <p className="font-['Manrope'] text-sm font-semibold text-gray-400 uppercase tracking-widest">
                      ID: {request.id} • Customer: <span className="text-[var(--green-dark)]">{request.customer}</span>
                    </p>
                  </div>
                </div>

                <p className="font-['Manrope'] text-gray-600 text-lg leading-relaxed max-w-2xl">
                  "{request.description}"
                </p>

                <div className="flex flex-wrap items-center gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--primary)]/5 rounded-xl flex items-center justify-center text-[var(--primary)]">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-['Manrope'] text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Budget</p>
                      <p className="font-['Manrope'] text-lg font-bold text-gray-900">{request.budget}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--primary)]/5 rounded-xl flex items-center justify-center text-[var(--primary)]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-['Manrope'] text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posted On</p>
                      <p className="font-['Manrope'] text-lg font-bold text-gray-900">
                        {new Date(request.posted).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--primary)]/5 rounded-xl flex items-center justify-center text-[var(--primary)]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-['Manrope'] text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Bids</p>
                      <p className="font-['Manrope'] text-lg font-bold text-gray-900">4 Active Offers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3">
                <button 
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[var(--green-dark)] text-white rounded-2xl font-['Manrope'] font-bold hover:bg-[var(--green-primary)] transition-all shadow-lg shadow-[var(--green-dark)]/10"
                >
                  View Bids
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-['Manrope'] font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                  <Trash2 className="w-5 h-5" />
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
