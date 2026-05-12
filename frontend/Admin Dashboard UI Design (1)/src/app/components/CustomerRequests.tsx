import { useState, useEffect } from 'react';
import { MessageSquare, Eye, Trash2, Banknote, Clock, Users, Loader2, Package, Gavel, CheckCircle, ChevronRight, ShoppingBag, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

interface Request {
  id: string;
  customer: string;
  product: string;
  description: string;
  budget: string;
  status: string;
  date: string;
  bids: number;
}

export function CustomerRequests({ searchQuery = '' }: { searchQuery?: string }) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'active' | 'closed'>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingBids, setFetchingBids] = useState(false);

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
  
  const handleViewBids = async (request: Request) => {
    try {
      setSelectedRequest(request);
      setFetchingBids(true);
      setIsModalOpen(true);
      const data = await adminApi.getRequestBids(request.id);
      // Handle various response formats (array vs object with bids property)
      const bidsList = Array.isArray(data) ? data : (data?.bids || []);
      setBids(bidsList);
    } catch (err: any) {
      console.error('Failed to fetch bids:', err);
      setBids([]);
    } finally {
      setFetchingBids(false);
    }
  };

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
                      <Banknote className="w-5 h-5" />
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
                        {request.date ? new Date(request.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--primary)]/5 rounded-xl flex items-center justify-center text-[var(--primary)]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-['Manrope'] text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Bids</p>
                      <p className="font-['Manrope'] text-lg font-bold text-gray-900">{request.bids || 0} Active Offers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3">
                <button 
                  onClick={() => handleViewBids(request)}
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

      {/* Bids Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900">Bids for {selectedRequest?.product}</h2>
                <p className="font-['Manrope'] text-gray-500 text-sm">Request ID: {selectedRequest?.id} • Customer: {selectedRequest?.customer}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {fetchingBids ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
                  <p className="font-['Manrope'] text-gray-400 font-medium">Fetching live bids from sellers...</p>
                </div>
              ) : bids.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                  <Gavel className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="font-['Crimson_Pro'] text-2xl font-bold text-gray-400">No Bids Yet</h3>
                  <p className="font-['Manrope'] text-gray-500">Wait for sellers to place their offers.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bids.map((bid, i) => (
                    <motion.div
                      key={bid.bid_id || bid.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-[var(--primary)]/30 hover:shadow-xl hover:shadow-gray-100 transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold border border-emerald-100 group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-500">
                          {(bid.store_name || bid.storeName)?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-['Crimson_Pro'] text-xl font-bold text-gray-900">{bid.store_name || bid.storeName}</h4>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold border border-amber-100">
                              ★ {bid.store_rating || bid.storeRating || '5.0'}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {bid.estimated_delivery_days || bid.estimatedDeliveryDays || '—'} days delivery
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {bid.bid_status || bid.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-['Manrope'] text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Offer Price</p>
                        <p className="font-['Crimson_Pro'] text-3xl font-bold text-[var(--green-dark)]">
                          Rs. {(bid.bid_price || bid.bidPrice || 0).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-['Manrope'] font-bold hover:bg-gray-100 transition-all shadow-sm"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
