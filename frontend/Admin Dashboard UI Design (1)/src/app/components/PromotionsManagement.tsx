import { useState, useEffect } from 'react';
import { Tag, Plus, Copy, Edit, Trash2, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminApi } from '../services/api';

interface Promo {
  id: string;
  code: string;
  value: number;
  type: string;
  minOrder: number;
  limit: number;
  usage: number;
  expiry: string;
  status: string;
  maxCap?: number;
}

export function PromotionsManagement({ searchQuery = '' }: { searchQuery?: string }) {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '0',
    limit: '100',
    maxCap: '',
    expiry: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPromotions();
      setPromos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (promo: Promo | null = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        code: promo.code,
        type: promo.type,
        value: promo.value.toString(),
        minOrder: promo.minOrder.toString(),
        limit: promo.limit.toString(),
        maxCap: promo.maxCap?.toString() || '',
        expiry: promo.expiry.split('T')[0]
      });
    } else {
      setEditingPromo(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minOrder: '0',
        limit: '100',
        maxCap: '',
        expiry: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        code: formData.code,
        type: formData.type === 'fixed' ? 'fixed_amount' : 'percentage',
        value: parseFloat(formData.value),
        minOrder: parseFloat(formData.minOrder),
        limit: parseInt(formData.limit),
        maxCap: formData.maxCap ? parseFloat(formData.maxCap) : null,
        description: '',
        start: new Date().toISOString(),
        end: formData.expiry
      };

      if (editingPromo) {
        alert('Update functionality coming soon in backend');
      } else {
        await adminApi.createPromotion(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await adminApi.deletePromotion(id);
        loadData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredPromos = promos.filter(promo => {
    const matchesFilter = filter === 'all' || promo.status === filter;
    const matchesSearch = promo.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load promotions</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button onClick={loadData} className="mt-4 text-emerald-600 font-bold underline">Try Again</button>
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
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#064e3b] to-[#10b981] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all"
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
            className={`px-6 py-3 rounded-2xl font-['Manrope'] font-semibold transition-all ${filter === status
              ? 'bg-[#064e3b] text-white shadow-lg'
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
              className={`bg-white rounded-3xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${promo.status === 'active' ? 'border-emerald-200' : 'border-gray-200'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#064e3b] to-[#10b981] rounded-xl flex items-center justify-center">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-['Manrope'] font-semibold ${promo.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
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
                  <span className="font-['Manrope'] font-bold text-[#064e3b]">
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
                    className={`h-full rounded-full ${usagePercentage >= 90 ? 'bg-red-500' :
                      usagePercentage >= 70 ? 'bg-orange-500' :
                        'bg-emerald-500'
                      }`}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(promo)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-xl font-['Manrope'] text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
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
              className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900">
                  {editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Promo Code</label>
                  <input
                    required
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    placeholder="SAVE20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Type</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Value</label>
                    <input
                      required
                      type="number"
                      value={formData.value}
                      onChange={e => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Min. Order</label>
                    <input
                      required
                      type="number"
                      value={formData.minOrder}
                      onChange={e => setFormData({ ...formData, minOrder: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Usage Limit</label>
                    <input
                      required
                      type="number"
                      value={formData.limit}
                      onChange={e => setFormData({ ...formData, limit: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Max Discount Cap (Rs)</label>
                    <input
                      type="number"
                      value={formData.maxCap}
                      onChange={e => setFormData({ ...formData, maxCap: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                      placeholder="Optional cap e.g. 500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                  <input
                    required
                    type="date"
                    value={formData.expiry}
                    onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#064e3b] to-[#10b981] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {editingPromo ? 'Update Promo' : 'Create Promo'}
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
