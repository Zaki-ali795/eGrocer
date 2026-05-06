import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, TrendingDown, CheckCircle2, Store, Clock } from 'lucide-react';

interface BidOffer {
  id: string;
  storeName: string;
  price: number;
  originalPrice: number;
  rating: number;
  deliveryTime: string;
  inStock: boolean;
}

export function BiddingSection() {
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [requestText, setRequestText] = useState('');

  const mockRequests = [
    {
      id: '1',
      product: 'Organic Avocados (6 pack)',
      category: 'Fresh Fruits',
      requestedBy: 'You',
      timeAgo: '2 hours ago',
      offers: [
        { id: '1', storeName: 'Fresh Farms Market', price: 899, originalPrice: 1299, rating: 4.8, deliveryTime: '2 hours', inStock: true },
        { id: '2', storeName: 'Organic Valley', price: 949, originalPrice: 1349, rating: 4.9, deliveryTime: '1 hour', inStock: true },
        { id: '3', storeName: 'Green Grocers', price: 1099, originalPrice: 1499, rating: 4.7, deliveryTime: '3 hours', inStock: true },
      ] as BidOffer[]
    },
    {
      id: '2',
      product: 'Fresh Salmon Fillet (1kg)',
      category: 'Seafood',
      requestedBy: 'You',
      timeAgo: '5 hours ago',
      offers: [
        { id: '1', storeName: 'Ocean Fresh', price: 2499, originalPrice: 3299, rating: 4.9, deliveryTime: '1 hour', inStock: true },
        { id: '2', storeName: 'Seafood Express', price: 2650, originalPrice: 3499, rating: 4.6, deliveryTime: '2 hours', inStock: true },
      ] as BidOffer[]
    }
  ];

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle request submission
    setRequestText('');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-[var(--beige)]/30 to-[var(--cream)]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-primary)]/10 rounded-full mb-4">
            <TrendingDown className="w-4 h-4 text-[var(--green-primary)]" />
            <span className="text-sm text-[var(--green-dark)]">Unique Feature</span>
          </div>
          <h2 className="mb-4">
            Request & Get Best Prices
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Can't find what you need? Submit a product request and let registered stores compete with their best offers
          </p>
        </motion.div>

        {/* Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12"
        >
          <form onSubmit={handleSubmitRequest} className="bg-white rounded-3xl shadow-lg shadow-[var(--green-primary)]/5 p-6 border border-[var(--green-primary)]/10">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--green-primary)]/60" />
                <input
                  type="text"
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="Describe the product you're looking for (e.g., 'Organic quinoa 2kg')"
                  className="w-full pl-12 pr-4 py-4 bg-[var(--beige)]/50 rounded-2xl border-2 border-transparent focus:border-[var(--green-primary)] outline-none transition-all"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-2xl shadow-lg shadow-[var(--green-primary)]/30"
              >
                Submit Request
              </motion.button>
            </div>
            <p className="text-sm text-gray-500 mt-3 ml-12">
              Stores will respond within 24 hours with their best competitive offers
            </p>
          </form>
        </motion.div>

        {/* Active Requests */}
        <div className="space-y-6">
          {mockRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg shadow-[var(--green-primary)]/5 overflow-hidden border border-[var(--green-primary)]/10"
            >
              {/* Request Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="mb-1">{request.product}</h3>
                    <p className="text-sm text-gray-500">
                      {request.category} · Requested {request.timeAgo}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-[var(--green-primary)]/10 rounded-full">
                    <span className="text-sm text-[var(--green-dark)]">
                      {request.offers.length} Offers
                    </span>
                  </div>
                </div>
              </div>

              {/* Offers Grid */}
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {request.offers.map((offer, offerIndex) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: offerIndex * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                      className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[var(--green-primary)]/30 transition-all cursor-pointer bg-gradient-to-br from-white to-[var(--beige)]/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)] rounded-xl flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm">{offer.storeName}</p>
                            <p className="text-xs text-gray-500">⭐ {offer.rating}</p>
                          </div>
                        </div>
                        {offerIndex === 0 && (
                          <div className="px-2 py-1 bg-[var(--terracotta)] text-white text-xs rounded-full">
                            Best
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl text-[var(--green-primary)]">
                            Rs {offer.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            Rs {offer.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="inline-block px-2 py-1 bg-[var(--green-secondary)]/10 text-[var(--green-dark)] text-xs rounded-lg">
                          Save Rs {(offer.originalPrice - offer.price).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{offer.deliveryTime} delivery</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 bg-[var(--green-primary)] text-white rounded-xl hover:bg-[var(--green-dark)] transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Offer
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
