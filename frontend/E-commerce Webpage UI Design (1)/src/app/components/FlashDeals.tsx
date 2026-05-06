import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  stock: number;
  totalStock: number;
  endsAt: Date;
}

export function FlashDeals() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: string}>({});

  const deals: Deal[] = [
    {
      id: '1',
      name: 'Organic Strawberries (500g)',
      image: 'https://images.unsplash.com/photo-1621295538579-7fd8bb7a662a?w=400',
      price: 499,
      originalPrice: 899,
      stock: 15,
      totalStock: 50,
      endsAt: new Date(Date.now() + 3600000 * 4), // 4 hours
    },
    {
      id: '2',
      name: 'Fresh Avocado Bundle',
      image: 'https://images.unsplash.com/photo-1601379760607-78be3d4ff432?w=400',
      price: 699,
      originalPrice: 1199,
      stock: 8,
      totalStock: 30,
      endsAt: new Date(Date.now() + 3600000 * 2), // 2 hours
    },
    {
      id: '3',
      name: 'Premium Mixed Nuts (1kg)',
      image: 'https://images.unsplash.com/photo-1621295239171-6f95272fdf45?w=400',
      price: 1299,
      originalPrice: 1999,
      stock: 22,
      totalStock: 40,
      endsAt: new Date(Date.now() + 3600000 * 6), // 6 hours
    },
    {
      id: '4',
      name: 'Exotic Fruit Mix',
      image: 'https://images.unsplash.com/photo-1623125489492-6d3641414e37?w=400',
      price: 999,
      originalPrice: 1599,
      stock: 12,
      totalStock: 25,
      endsAt: new Date(Date.now() + 3600000 * 5), // 5 hours
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: {[key: string]: string} = {};
      deals.forEach(deal => {
        const now = new Date().getTime();
        const distance = deal.endsAt.getTime() - now;

        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          newTimeRemaining[deal.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeRemaining[deal.id] = 'EXPIRED';
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('flash-deals-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[var(--cream)] via-white to-[var(--beige)]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-[var(--terracotta)] to-orange-500 rounded-2xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="bg-gradient-to-r from-[var(--terracotta)] to-orange-500 bg-clip-text text-transparent">
                Flash Deals
              </h2>
            </div>
            <p className="text-gray-600">Limited time offers - grab them before they're gone!</p>
          </motion.div>

          <div className="hidden md:flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="p-3 bg-white border-2 border-gray-200 rounded-full hover:border-[var(--green-primary)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="p-3 bg-white border-2 border-gray-200 rounded-full hover:border-[var(--green-primary)] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Scrollable Deals */}
        <div
          id="flash-deals-scroll"
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {deals.map((deal, index) => {
            const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
            const stockPercentage = (deal.stock / deal.totalStock) * 100;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-none w-72 bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/5 border-2 border-[var(--terracotta)]/20 snap-start"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-[var(--beige)] to-[var(--cream)]">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      className="px-4 py-2 bg-gradient-to-r from-[var(--terracotta)] to-orange-500 text-white rounded-full shadow-lg"
                    >
                      <span className="text-lg">-{discount}%</span>
                    </motion.div>
                  </div>

                  {/* Timer Badge */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-2xl text-white flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-mono">
                        {timeRemaining[deal.id] || 'Loading...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="mb-3 line-clamp-2">{deal.name}</h4>

                  {/* Price */}
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-2xl text-[var(--green-primary)]">
                      Rs {deal.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-gray-400 line-through mb-1">
                      Rs {deal.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Stock Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Available</span>
                      <span className={`${stockPercentage < 30 ? 'text-red-500' : 'text-[var(--green-primary)]'}`}>
                        {deal.stock}/{deal.totalStock}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stockPercentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          stockPercentage < 30
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Buy Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-[var(--terracotta)] to-orange-500 text-white rounded-2xl shadow-lg shadow-[var(--terracotta)]/30 hover:shadow-xl transition-shadow"
                  >
                    Grab Deal Now
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
