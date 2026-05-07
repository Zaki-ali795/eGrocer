import { motion } from 'motion/react';
import { RotateCcw, Calendar, ShoppingBag, Loader2 } from 'lucide-react';
import { Order } from '../../services/api';

interface PreviousOrdersProps {
  orders: Order[];
  isLoading: boolean;
  onReorder: (orderId: string) => void;
}

export function PreviousOrders({ orders, isLoading, onReorder }: PreviousOrdersProps) {


  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
            <ShoppingBag className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-700">Order History</span>
          </div>
          <h2 className="mb-4">Previous Orders</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quickly reorder your favorite items from past purchases
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12 text-[var(--green-primary)]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You have no previous orders yet.
            </div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 bg-gradient-to-r from-[var(--green-primary)]/5 to-[var(--green-secondary)]/5 border-b border-[var(--green-primary)]/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="mb-1 font-bold text-lg">{order.order_number}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-[var(--green-primary)]" />
                        <span>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="px-2 py-0.5 bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-xs rounded-full font-semibold uppercase">{order.order_status}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="text-xl font-bold text-[var(--green-primary)]">
                        Rs {order.total_amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReorder(order.order_number)}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-xl hover:shadow-lg hover:shadow-[var(--green-primary)]/30 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reorder All Items
                  </motion.button>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-sm text-gray-500 mb-4 font-medium">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.order_item_id}
                        className="flex gap-3 p-3 bg-[var(--beige)]/30 rounded-2xl hover:bg-[var(--beige)]/60 transition-colors border border-transparent hover:border-[var(--green-primary)]/10"
                      >
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-xl bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{item.product_name}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <p className="text-xs text-gray-500 font-medium">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-bold text-[var(--green-primary)]">
                              Rs {item.unit_price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
