import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  ShoppingBag, Trash2, Heart, Plus, Minus,
  Tag, ChevronRight, PackageCheck, Truck, CreditCard, Loader2
} from 'lucide-react';
import { orderApi } from '../../services/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  originalPrice?: number;
  brand?: string;
  category?: string;
}

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function CartPage({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartPageProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal        = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax             = subtotal * 0.08;
  const delivery        = subtotal > 5000 ? 0 : 499;
  const cardDiscount    = subtotal * 0.05;
  const total           = subtotal + tax + delivery - cardDiscount;
  const itemCount       = items.reduce((s, i) => s + i.quantity, 0);
  const freeDeliveryGap = Math.max(0, 5000 - subtotal);

  /* ── Empty state ── */
  if (items.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-28 h-28 mx-auto mb-6 bg-[var(--green-primary)]/10 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-14 h-14 text-[var(--green-primary)]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse our fresh products and add items to your cart.</p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/categories')}
          className="px-8 py-3 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-2xl font-semibold shadow-lg shadow-[var(--green-primary)]/30"
        >
          Start Shopping
        </motion.button>
      </motion.div>
    </div>
  );

  const handleCheckout = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const checkoutItems = items.map(i => ({ id: i.id, quantity: i.quantity }));
      await orderApi.createOrder(checkoutItems);
      
      onClearCart();
      navigate('/previous-orders');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-[var(--green-primary)]" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">Shopping Cart</span>
          <span className="ml-2 px-2 py-0.5 bg-[var(--green-primary)]/10 text-[var(--green-primary)] rounded-full text-xs font-semibold">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ════════════════════════════════════════
              LEFT — Cart Items
          ════════════════════════════════════════ */}
          <div className="flex flex-col gap-4">

            {/* Free delivery progress */}
            {freeDeliveryGap > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--green-primary)]/10 border border-[var(--green-primary)]/20 rounded-2xl px-5 py-3 flex items-center gap-3"
              >
                <Truck className="w-5 h-5 text-[var(--green-primary)] shrink-0" />
                <p className="text-sm text-[var(--green-dark)]">
                  Add <strong>Rs {freeDeliveryGap.toLocaleString('en-IN')}</strong> more to get <strong>FREE delivery</strong>!
                </p>
              </motion.div>
            )}
            {freeDeliveryGap === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--green-primary)]/10 border border-[var(--green-primary)]/20 rounded-2xl px-5 py-3 flex items-center gap-3"
              >
                <PackageCheck className="w-5 h-5 text-[var(--green-primary)] shrink-0" />
                <p className="text-sm text-[var(--green-dark)] font-semibold">🎉 You've unlocked FREE delivery!</p>
              </motion.div>
            )}

            {/* Items */}
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-4 hover:border-[var(--green-primary)]/20 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      {/* Name + category */}
                      <div>
                        {item.category && (
                          <span className="text-xs text-[var(--green-primary)] font-medium">{item.category}</span>
                        )}
                        <h3
                          className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-[var(--green-primary)] transition-colors"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        {item.brand && (
                          <span className="text-xs text-gray-400">{item.brand}</span>
                        )}
                      </div>

                      {/* Price row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-[var(--green-primary)]">
                          Rs {item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs {item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs px-2 py-0.5 bg-[var(--terracotta)]/10 text-[var(--terracotta)] rounded-full font-medium">
                            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>

                      {/* Controls row */}
                      <div className="flex items-center gap-3 flex-wrap mt-auto">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </motion.button>
                          <span className="px-4 py-2 text-sm font-semibold text-gray-800 min-w-[2.5rem] text-center border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>

                        {/* Item total */}
                        <span className="text-sm text-gray-500">
                          = <span className="font-semibold text-gray-700">
                              Rs {(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                        </span>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Wishlist */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-50"
                          title="Save for later"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>

                        {/* Remove */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onRemoveItem(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500
                                     border border-red-200 rounded-xl hover:bg-red-100
                                     transition-colors text-xs font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/categories')}
              className="w-full py-3 border-2 border-dashed border-[var(--green-primary)]/30
                         text-[var(--green-primary)] rounded-2xl hover:border-[var(--green-primary)]/60
                         hover:bg-[var(--green-primary)]/5 transition-all text-sm font-medium"
            >
              + Continue Shopping
            </motion.button>
          </div>

          {/* ════════════════════════════════════════
              RIGHT — Order Summary (sticky)
          ════════════════════════════════════════ */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-gray-800">Rs {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-gray-800">Rs {Math.round(tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={`font-medium ${delivery === 0 ? 'text-[var(--green-primary)]' : 'text-gray-800'}`}>
                    {delivery === 0 ? 'FREE' : `Rs ${delivery.toLocaleString('en-IN')}`}
                  </span>
                </div>

                {/* Card discount */}
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[var(--green-primary)]/10 to-[var(--green-secondary)]/10 border border-[var(--green-primary)]/20 rounded-xl">
                  <div className="flex items-center gap-2 text-[var(--green-dark)]">
                    <CreditCard className="w-4 h-4 text-[var(--green-primary)]" />
                    <span>Card Discount (5%)</span>
                  </div>
                  <span className="text-[var(--green-primary)] font-semibold">
                    -Rs {Math.round(cardDiscount).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Voucher */}
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-[var(--beige)]/30">
                    <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Enter voucher code"
                      className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2.5 bg-[var(--green-primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-[var(--green-primary)]">
                      Rs {Math.round(total).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 space-y-3">
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)]
                             text-white rounded-2xl font-bold shadow-lg shadow-[var(--green-primary)]/30
                             flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                  {isSubmitting ? 'Processing...' : `Proceed to Checkout (${itemCount})`}
                </motion.button>
              </div>
            </div>

            {/* Payment methods */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 px-5 py-4">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Accepted Payments</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { icon: '💳', label: 'Card' },
                  { icon: '📱', label: 'JazzCash' },
                  { icon: '💵', label: 'Cash' },
                  { icon: '🏦', label: 'Bank' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--beige)]/50 border border-gray-200 rounded-xl text-xs text-gray-600">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
