import { motion } from 'motion/react';
import { RotateCcw, Calendar, ShoppingBag } from 'lucide-react';

interface PreviousOrder {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
}

interface PreviousOrdersProps {
  onReorder: (orderId: string) => void;
}

export function PreviousOrders({ onReorder }: PreviousOrdersProps) {
  const previousOrders: PreviousOrder[] = [
    {
      id: 'ORD-2845',
      date: 'April 28, 2026',
      items: [
        {
          id: 'p1',
          name: 'Organic Baby Spinach (300g)',
          price: 399,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1599660869952-3852916ff82b?w=200',
        },
        {
          id: 'p2',
          name: 'Fresh Carrots Bundle (1kg)',
          price: 299,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1549248581-cf105cd081f8?w=200',
        },
        {
          id: 'p3',
          name: 'Fresh Tomatoes (500g)',
          price: 349,
          quantity: 3,
          image: 'https://images.unsplash.com/photo-1606836484371-483e90c5d19a?w=200',
        },
      ],
      total: 2144,
    },
    {
      id: 'ORD-2842',
      date: 'April 24, 2026',
      items: [
        {
          id: 'p4',
          name: 'Organic Sweet Peppers (3 pack)',
          price: 599,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=200',
        },
        {
          id: 'p5',
          name: 'Premium Mixed Greens',
          price: 449,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1687199126330-556bb3c85b2f?w=200',
        },
      ],
      total: 1497,
    },
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
          {previousOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="mb-1">{order.id}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="text-xl text-[var(--green-primary)]">
                      Rs {order.total.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onReorder(order.id)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reorder All Items
                </motion.button>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="text-sm text-gray-500 mb-4">
                  {order.items.length} items
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2 mb-1">{item.name}</p>
                        <p className="text-xs text-gray-500 mb-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-[var(--green-primary)]">
                          Rs {item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
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
