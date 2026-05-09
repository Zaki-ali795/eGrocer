import { useState, useEffect } from 'react';
import { Tag, Plus, X, Calendar, Percent, Clock, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { sellerApi } from '../services/api';

export default function Promotions() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    discount: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [promoData, prodData] = await Promise.all([
        sellerApi.getPromotions(2),
        sellerApi.getProducts(2)
      ]);

      const mappedPromos = promoData.map((p: any) => ({
        id: p.deal_id,
        productName: p.product_name,
        discount: p.discount_percentage,
        startDate: p.start_datetime,
        endDate: p.end_datetime,
        isActive: p.is_active && new Date(p.start_datetime) <= new Date() && new Date(p.end_datetime) >= new Date()
      }));

      const mappedProds = prodData.map((p: any) => ({
        id: p.product_id,
        name: p.product_name
      }));

      setPromotions(mappedPromos);
      setProducts(mappedProds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const deletePromotion = async (id: number) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      try {
        await sellerApi.deletePromotion(id);
        setPromotions(promotions.filter((p) => p.id !== id));
      } catch (err: any) {
        alert("Failed to delete promotion: " + err.message);
      }
    }
  };

  const getDaysRemaining = (endDate: string) => {
    return Math.max(0, differenceInDays(new Date(endDate), new Date()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sellerApi.createPromotion({
        productId: parseInt(formData.productId),
        discountPercentage: parseFloat(formData.discount),
        startDatetime: formData.startDate,
        endDatetime: formData.endDate
      });
      setShowModal(false);
      setFormData({ productId: '', discount: '', startDate: '', endDate: '' });
      loadData();
    } catch (err: any) {
      alert("Failed to create promotion: " + err.message);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Promotions & Deals</h1>
          <p className="text-muted-foreground mt-1">Create flash deals and discount campaigns</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Create Promotion
        </button>
      </div>

      {/* Active Promotions */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Promotions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions
            .filter((p) => p.isActive)
            .map((promo) => {
              const daysLeft = getDaysRemaining(promo.endDate);
              return (
                <div
                  key={promo.id}
                  className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-6 border border-accent/30 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                          <Percent className="w-3 h-3" />
                          {promo.discount}% OFF
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">{promo.productName}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(promo.startDate), 'MMM dd')} - {format(new Date(promo.endDate), 'MMM dd')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="font-medium text-accent">
                        {daysLeft > 0 ? `${daysLeft} days remaining` : 'Ends today'}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            ((differenceInDays(new Date(), new Date(promo.startDate)) /
                              differenceInDays(new Date(promo.endDate), new Date(promo.startDate))) *
                              100)
                          )
                        )}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Scheduled Promotions */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Scheduled & Past Promotions</h3>
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-emerald-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Product</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Discount</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Start Date</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">End Date</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-t border-border hover:bg-sidebar-accent/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-emerald-900">{promo.productName}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                      {promo.discount}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{format(new Date(promo.startDate), 'MMM dd, yyyy')}</td>
                  <td className="py-4 px-6 text-muted-foreground">{format(new Date(promo.endDate), 'MMM dd, yyyy')}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${promo.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            <div className="border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Create New Promotion</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Product</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Discount Percentage</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-5 py-2.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-all shadow-md"
                >
                  Create Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}