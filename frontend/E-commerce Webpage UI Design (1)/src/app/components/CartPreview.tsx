import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, Heart, ShoppingBag, CreditCard, Wallet } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
}

export function CartPreview({ isOpen, onClose, items }: CartPreviewProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const delivery = subtotal > 5000 ? 0 : 499; // Free delivery over Rs 5,000
  const creditCardDiscount = subtotal * 0.05; // 5% discount for specific cards
  const total = subtotal + tax + delivery - creditCardDiscount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--green-primary)]/10 rounded-2xl">
                    <ShoppingBag className="w-6 h-6 text-[var(--green-primary)]" />
                  </div>
                  <h2>Shopping Cart</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-500">{items.length} items in cart</p>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 p-3 bg-[var(--beige)]/30 rounded-2xl"
                  >
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl bg-white"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <h4 className="text-sm mb-1 line-clamp-2">{item.name}</h4>
                      <p className="text-base text-[var(--green-primary)] mb-2">
                        Rs {item.price.toLocaleString('en-IN')}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-gray-100 rounded-full"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 text-gray-400 hover:text-[var(--green-primary)]"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-[var(--beige)]/20">
                {/* Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rs {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>Rs {Math.round(tax).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className={delivery === 0 ? 'text-[var(--green-primary)]' : ''}>
                      {delivery === 0 ? 'FREE' : `Rs ${delivery.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  {/* Tax Benefit */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between text-sm p-3 bg-gradient-to-r from-[var(--green-primary)]/10 to-[var(--green-secondary)]/10 rounded-xl border border-[var(--green-primary)]/20"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[var(--green-primary)]" />
                      <span className="text-[var(--green-dark)]">Card Discount (5%)</span>
                    </div>
                    <span className="text-[var(--green-primary)]">
                      -Rs {Math.round(creditCardDiscount).toLocaleString('en-IN')}
                    </span>
                  </motion.div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span>Total</span>
                      <span className="text-2xl text-[var(--green-primary)]">
                        Rs {Math.round(total).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-2xl shadow-lg shadow-[var(--green-primary)]/30 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-white border-2 border-[var(--green-primary)] text-[var(--green-primary)] rounded-2xl hover:bg-[var(--green-primary)]/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Save for Later
                  </motion.button>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Accepted Payment Methods</p>
                  <div className="flex items-center gap-2">
                    {['💳', '📱', '💵'].map((icon, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
