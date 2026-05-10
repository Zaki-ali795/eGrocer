import { useState, useEffect } from 'react';
import { Zap, Plus, Clock, TrendingUp, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminApi } from '../services/api';

interface FlashDeal {
  id: string;
  product: string;
  product_id?: number;
  discount: number;
  originalPrice: number;
  startTime: string;
  endTime: string;
  status: string;
  sold: number;
  max: number;
}

export function FlashDealsManagement({ searchQuery = '' }: { searchQuery?: string }) {
  const [deals, setDeals] = useState<FlashDeal[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<FlashDeal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productId: '',
    discount: '10',
    price: '',
    start: '',
    end: '',
    max: '50'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dealsData, productsData] = await Promise.all([
        adminApi.getFlashDeals(),
        adminApi.getProducts()
      ]);
      setDeals(dealsData);
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.productId && products.length > 0) {
      const product = products.find(p => p.id.toString() === formData.productId);
      if (product) {
        const discount = parseFloat(formData.discount) || 0;
        const calculatedPrice = product.price * (1 - discount / 100);
        setFormData(prev => ({ ...prev, price: calculatedPrice.toFixed(2) }));
      }
    }
  }, [formData.productId, formData.discount, products]);

  const handleOpenModal = (deal: FlashDeal | null = null) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        name: '', // Flash deals might not have a separate name in the schema, but keeping it for UI
        description: '',
        productId: deal.product_id?.toString() || '',
        discount: deal.discount.toString(),
        price: deal.originalPrice.toString(),
        start: deal.startTime.split('.')[0], // Handle ISO format
        end: deal.endTime.split('.')[0],
        max: deal.max.toString()
      });
    } else {
      setEditingDeal(null);
      setFormData({
        name: '',
        description: '',
        productId: '',
        discount: '10',
        price: '',
        start: '',
        end: '',
        max: '50'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        productId: parseInt(formData.productId),
        discount: parseFloat(formData.discount),
        price: parseFloat(formData.price),
        max: parseInt(formData.max),
        adminId: 1 // Default admin ID
      };

      if (editingDeal) {
        // await adminApi.updateFlashDeal(editingDeal.id, data);
        alert('Update functionality coming soon in backend');
      } else {
        await adminApi.createFlashDeal(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEndEarly = async (id: string) => {
    if (window.confirm('Are you sure you want to end this flash deal early?')) {
      try {
        await adminApi.endFlashDeal(id);
        loadData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesStatus = showActive ? deal.status === 'active' : deal.status !== 'active';
    const matchesSearch = deal.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
      <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load flash deals</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button onClick={loadData} className="mt-4 text-[#ff6b35] font-bold underline">Try Again</button>
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
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all"
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
              ? 'bg-[var(--green-dark)] text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Active Deals ({deals.filter(d => d.status === 'active').length})
        </button>
        <button
          onClick={() => setShowActive(false)}
          className={`px-6 py-3 rounded-2xl font-['Manrope'] font-semibold transition-all ${
            !showActive
              ? 'bg-[var(--green-dark)] text-white shadow-lg'
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
                <div className="flex items-center gap-2 text-[var(--green-dark)]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-['Manrope'] text-sm font-semibold">{deal.sold} items claimed</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenModal(deal)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleEndEarly(deal.id)}
                className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-red-100 transition-colors"
              >
                {deal.status === 'active' ? 'End Early' : 'Delete'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900">
                  {editingDeal ? 'Edit Flash Deal' : 'Create Flash Deal'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Deal Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#ff6b35]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Product</label>
                  <select
                    required
                    value={formData.productId}
                    onChange={e => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#ff6b35]/20 focus:outline-none"
                  >
                    <option value="">Select Product</option>
                    {products.map(prod => (
                      <option key={prod.id} value={prod.id}>{prod.name} (Rs {prod.price})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Discount (%)</label>
                    <input
                      required
                      type="number"
                      value={formData.discount}
                      onChange={e => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#ff6b35]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Deal Price</label>
                    <input
                      readOnly
                      type="number"
                      value={formData.price}
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl focus:outline-none cursor-not-allowed font-bold text-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Start Time</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.start}
                      onChange={e => setFormData({ ...formData, start: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#ff6b35]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">End Time</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.end}
                      onChange={e => setFormData({ ...formData, end: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#ff6b35]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Max Quantity</label>
                  <input
                    required
                    type="number"
                    value={formData.max}
                    onChange={e => setFormData({ ...formData, max: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#ff6b35]/20 focus:outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {editingDeal ? 'Update Deal' : 'Create Deal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
