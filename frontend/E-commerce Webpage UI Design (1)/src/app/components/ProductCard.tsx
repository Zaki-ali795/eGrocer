import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Star, Info, RotateCcw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  organic?: boolean;
  nutritionHighlights?: string[];
  reorderable?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/5 border border-gray-100 hover:border-[var(--green-primary)]/30 transition-all group"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[var(--beige)] to-[var(--cream)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.organic && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 bg-[var(--green-primary)] text-white text-xs rounded-full"
            >
              🌱 Organic
            </motion.div>
          )}
          {discount > 0 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 bg-[var(--terracotta)] text-white text-xs rounded-full"
            >
              -{discount}%
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-3 right-3 flex flex-col gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-md ${isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:text-red-500'
              } transition-colors`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/product/${product.id}`)}
            className="p-2 bg-white/90 rounded-full backdrop-blur-md text-gray-700 hover:text-[var(--green-primary)] transition-colors"
            title="View details"
          >
            <Info className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="px-4 py-2 bg-white rounded-full text-sm">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs text-[var(--green-primary)] mb-1">{product.category}</p>
          <h3 className="text-lg mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[var(--terracotta)] fill-current" />
              <span className="text-sm">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-2xl text-[var(--green-primary)]">
            Rs {product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through mb-1">
              Rs {product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="flex-1 py-3 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-2xl hover:shadow-lg hover:shadow-[var(--green-primary)]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>

          {product.reorderable && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 border-2 border-[var(--green-primary)] text-[var(--green-primary)] rounded-2xl hover:bg-[var(--green-primary)]/5 transition-colors"
              title="Quick Reorder"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
