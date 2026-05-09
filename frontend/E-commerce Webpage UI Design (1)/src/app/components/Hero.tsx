import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartShopping?: () => void;
  onHowBiddingWorks?: () => void;
}

export function Hero({ onStartShopping, onHowBiddingWorks }: HeroProps) {
  return (
    <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-[var(--green-light)]/20 via-[var(--cream)] to-[var(--beige)]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1573481078935-b9605167e06b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Fresh vegetables"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-primary)]/10 rounded-full mb-6 border border-[var(--green-primary)]/20"
          >
            <Sparkles className="w-4 h-4 text-[var(--green-primary)]" />
            <span className="text-sm text-[var(--green-dark)]">Farm-Fresh Quality Guaranteed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <span className="block text-5xl sm:text-6xl lg:text-7xl mb-2">
              Fresh Groceries
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] bg-clip-text text-transparent">
              Delivered to Your Doorstep
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed"
          >
            Experience the convenience of premium quality groceries delivered fresh from local farms.
            Shop smart with our competitive bidding system and save big on your favorites.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(39, 174, 96, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartShopping}
              className="px-8 py-4 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[var(--green-primary)]/30 group"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHowBiddingWorks}
              className="px-8 py-4 bg-white text-[var(--green-primary)] rounded-full border-2 border-[var(--green-primary)] hover:bg-[var(--green-primary)]/5 transition-colors"
            >
              How Bidding Works
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 grid grid-cols-3 gap-8"
          >
            {[
              { value: '50K+', label: 'Products' },
              { value: '100+', label: 'Local Farms' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl text-[var(--green-primary)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-20 w-32 h-32 bg-[var(--green-secondary)]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 right-40 w-40 h-40 bg-[var(--terracotta)]/10 rounded-full blur-3xl"
      />
    </section>
  );
}
