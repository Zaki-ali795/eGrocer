import { motion } from 'motion/react';
import { Package, Truck, CheckCircle2, MapPin, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { TrackingOrder } from '../../services/api';

interface OrderTrackingProps {
  orders: TrackingOrder[];
  isLoading: boolean;
}

export function OrderTracking({ orders, isLoading }: OrderTrackingProps) {

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-primary)]/10 rounded-full mb-4">
            <Package className="w-4 h-4 text-[var(--green-primary)]" />
            <span className="text-sm text-[var(--green-dark)]">Live Tracking</span>
          </div>
          <h2 className="mb-4">
            Track Your Orders
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time updates on your delivery status with estimated arrival times
          </p>
        </motion.div>

        {/* Orders */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-12 text-[var(--green-primary)]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              You have no active orders to track.
            </div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-[var(--beige)]/30 rounded-3xl shadow-lg shadow-black/5 overflow-hidden border border-gray-100"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                          order.status === 'Delivered'
                            ? 'bg-[var(--green-primary)]/10 text-[var(--green-dark)]'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{order.items} {order.items === 1 ? 'item' : 'items'}</span>
                        <span>•</span>
                        <span className="text-[var(--green-primary)] font-bold">
                          Rs {order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)] rounded-2xl shadow-sm">
                        {order.status === 'Delivered' ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                          <Truck className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {order.status === 'Delivered' ? 'Delivered' : 'Estimated Delivery'}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid lg:grid-cols-2 gap-6">
                  {/* Progress Steps */}
                  <div>
                    <h4 className="mb-6 font-bold text-gray-800">Delivery Progress</h4>
                    <div className="space-y-6">
                      {order.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: stepIndex * 0.1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                step.completed
                                  ? 'bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)]'
                                  : 'bg-gray-100 border-2 border-gray-200'
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                              )}
                            </motion.div>
                            {stepIndex < order.steps.length - 1 && (
                              <div
                                className={`w-0.5 h-12 my-1 ${
                                  order.steps[stepIndex + 1]?.completed ? 'bg-[var(--green-primary)]' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>

                          <div className="flex-1 pb-4 pt-1">
                            <p className={`mb-1 font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            <p className="text-xs text-gray-500">{step.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info & Notifications */}
                  <div className="space-y-6">
                    {/* Delivery Instructions */}
                    <div className="p-5 bg-[var(--beige)]/50 rounded-2xl border border-[var(--green-primary)]/10">
                      <div className="flex items-start gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-[var(--green-primary)] mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Delivery Instructions</h4>
                          <p className="text-sm text-gray-600">{order.deliveryInstructions}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-sm text-[var(--green-primary)] font-semibold hover:underline"
                      >
                        Edit Instructions
                      </motion.button>
                    </div>

                    {/* Notifications */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-[var(--green-primary)]" />
                        <h4 className="text-sm font-semibold text-gray-800">Live Updates</h4>
                      </div>
                      <div className="space-y-3">
                        {order.notifications.map((notification, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                          >
                            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium mb-1">{notification.message}</p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
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
