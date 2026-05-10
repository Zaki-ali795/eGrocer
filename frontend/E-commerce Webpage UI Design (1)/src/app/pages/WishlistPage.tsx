// src/app/pages/WishlistPage.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router';
import { wishlistApi, Product } from '../../services/api';

interface WishlistPageProps {
  onAddToCart: (product: Product) => void;
  items: Product[];
  onWishlistUpdate: () => void;
}

export default function WishlistPage({ onAddToCart, items, onWishlistUpdate }: WishlistPageProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRemove = async (productId: number) => {
    try {
      await wishlistApi.toggleWishlist(productId); // toggle acts as remove if it exists
      onWishlistUpdate();
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--green-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          </div>
          <span className="px-4 py-2 bg-[var(--green-primary)]/10 text-[var(--green-primary)] rounded-full font-medium">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you like to buy them later!</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-[var(--green-primary)] text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow group relative"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/150'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--green-primary)] font-medium mb-1 uppercase tracking-wider">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-bold text-[var(--green-primary)]">
                          Rs {item.price}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs {item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => onAddToCart(item)}
                      className="flex-1 py-3 bg-[var(--green-primary)] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
