import { motion } from 'motion/react';
import { Package, Truck, CheckCircle2, MapPin, Clock, MessageSquare } from 'lucide-react';

export function OrderTracking() {
  const orders = [
    {
      id: '#ORD-2847',
      status: 'In Transit',
      currentStep: 2,
      estimatedDelivery: 'Today, 4:00 PM - 6:00 PM',
      items: 12,
      total: 8745,
      deliveryInstructions: 'Leave at doorstep',
      steps: [
        { label: 'Order Confirmed', time: '10:30 AM', completed: true },
        { label: 'Processing', time: '11:15 AM', completed: true },
        { label: 'Out for Delivery', time: '2:45 PM', completed: true },
        { label: 'Delivered', time: 'Pending', completed: false },
      ],
      notifications: [
        { time: '2:45 PM', message: 'Your order is out for delivery' },
        { time: '11:15 AM', message: 'Order is being prepared' },
      ]
    },
    {
      id: '#ORD-2846',
      status: 'Delivered',
      currentStep: 3,
      estimatedDelivery: 'Delivered on Apr 12, 3:30 PM',
      items: 8,
      total: 5230,
      deliveryInstructions: 'Ring doorbell',
      steps: [
        { label: 'Order Confirmed', time: 'Apr 12, 9:00 AM', completed: true },
        { label: 'Processing', time: 'Apr 12, 10:30 AM', completed: true },
        { label: 'Out for Delivery', time: 'Apr 12, 2:00 PM', completed: true },
        { label: 'Delivered', time: 'Apr 12, 3:30 PM', completed: true },
      ],
      notifications: [
        { time: '3:30 PM', message: 'Order delivered successfully' },
        { time: '2:00 PM', message: 'Driver is 10 minutes away' },
      ]
    }
  ];

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
          {orders.map((order, index) => (
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
                      <h3>{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'Delivered'
                          ? 'bg-[var(--green-primary)]/10 text-[var(--green-dark)]'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{order.items} items</span>
                      <span>•</span>
                      <span className="text-[var(--green-primary)]">
                        Rs {order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)] rounded-2xl">
                      {order.status === 'Delivered' ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Truck className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {order.status === 'Delivered' ? 'Delivered' : 'Estimated Delivery'}
                      </p>
                      <p className="text-sm">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid lg:grid-cols-2 gap-6">
                {/* Progress Steps */}
                <div>
                  <h4 className="mb-6">Delivery Progress</h4>
                  <div className="space-y-6">
                    {order.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: stepIndex * 0.1 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed
                                ? 'bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)]'
                                : 'bg-gray-200'
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </motion.div>
                          {stepIndex < order.steps.length - 1 && (
                            <div
                              className={`w-0.5 h-12 ${
                                step.completed ? 'bg-[var(--green-primary)]' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex-1 pb-4">
                          <p className={`mb-1 ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-500">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info & Notifications */}
                <div className="space-y-6">
                  {/* Delivery Instructions */}
                  <div className="p-5 bg-[var(--beige)]/50 rounded-2xl border border-gray-100">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-[var(--green-primary)] mt-0.5" />
                      <div>
                        <h4 className="text-sm mb-1">Delivery Instructions</h4>
                        <p className="text-sm text-gray-600">{order.deliveryInstructions}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-sm text-[var(--green-primary)] hover:underline"
                    >
                      Edit Instructions
                    </motion.button>
                  </div>

                  {/* Notifications */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-[var(--green-primary)]" />
                      <h4 className="text-sm">Updates</h4>
                    </div>
                    <div className="space-y-3">
                      {order.notifications.map((notification, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100"
                        >
                          <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
