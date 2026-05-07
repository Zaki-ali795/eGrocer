// src/app/pages/ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ShoppingCart, ArrowLeft, Star, Package,
  CheckCircle, XCircle, Tag, Leaf, Zap, Heart,
} from 'lucide-react';
import { productApi, Product } from '../../services/api';

interface ProductDetailPageProps {
  onAddToCart: (product: Product) => void;
}

export function ProductDetailPage({ onAddToCart }: ProductDetailPageProps) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    productApi.getProductById(Number(productId))
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    // Pass quantity by calling onAddToCart `quantity` times
    for (let i = 0; i < quantity; i++) onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) onAddToCart(product);
    navigate('/');          // TODO: navigate to checkout when implemented
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--green-primary)]/30 border-t-[var(--green-primary)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading product...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error || !product) return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30 flex items-center justify-center">
      <div className="text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">{error || 'Product not found.'}</p>
        <button onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[var(--green-primary)] text-white rounded-2xl hover:opacity-90 transition-opacity">
          Go Back
        </button>
      </div>
    </div>
  );

  const nutritionItems = product.nutritionalInfo
    ? product.nutritionalInfo.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30">

      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--green-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT: Product Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] shadow-2xl shadow-black/10">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800';
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.organic && (
                  <span className="px-3 py-1.5 bg-[var(--green-primary)] text-white text-xs rounded-full flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Organic
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-3 py-1.5 bg-[var(--terracotta)] text-white text-xs rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" /> -{product.discountPercent}% OFF
                  </span>
                )}
                {product.isPerishable && (
                  <span className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Fresh
                  </span>
                )}
              </div>

              {/* Wishlist button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:text-red-500'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Out of stock overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-6 py-3 bg-white rounded-full text-gray-800 font-semibold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT: Product Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Category + Name */}
            <div>
              <span className="text-sm text-[var(--green-primary)] font-medium">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(product.rating ?? 4) ? 'text-[var(--terracotta)] fill-current' : 'text-gray-200 fill-current'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating ?? '4.5'} · {product.reviews ?? 0} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 pb-4 border-b border-gray-100">
              <span className="text-4xl font-bold text-[var(--green-primary)]">
                Rs {product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through mb-1">
                    Rs {product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="mb-1 px-2 py-0.5 bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-sm rounded-lg font-medium">
                    Save Rs {(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Unit', value: product.unit },
                { label: 'Brand', value: product.brand || 'N/A' },
                { label: 'SKU', value: product.sku || 'N/A' },
                {
                  label: 'Availability',
                  value: product.inStock ? `In Stock (${product.stockQty} left)` : 'Out of Stock',
                  icon: product.inStock
                    ? <CheckCircle className="w-4 h-4 text-[var(--green-primary)]" />
                    : <XCircle className="w-4 h-4 text-red-500" />,
                  color: product.inStock ? 'text-[var(--green-primary)]' : 'text-red-500',
                },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="bg-[var(--beige)]/50 rounded-2xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <div className="flex items-center gap-1.5">
                    {icon}
                    <span className={`text-sm font-semibold ${color || 'text-gray-800'}`}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Nutritional info */}
            {nutritionItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Nutritional Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nutritionItems.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-sm rounded-full flex items-center gap-1"
                    >
                      <Leaf className="w-3 h-3" /> {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-lg font-semibold text-gray-600"
                  >−</button>
                  <span className="px-5 py-2 text-gray-800 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stockQty || 99, q + 1))}
                    disabled={!product.inStock}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-lg font-semibold text-gray-600 disabled:opacity-40"
                  >+</button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 py-4 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)]
                             text-white rounded-2xl font-semibold flex items-center justify-center gap-2
                             hover:shadow-lg hover:shadow-[var(--green-primary)]/30 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addedToCart ? '✓ Added!' : 'Add to Cart'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 py-4 bg-[var(--terracotta)] text-white rounded-2xl font-semibold
                             flex items-center justify-center gap-2
                             hover:shadow-lg hover:shadow-[var(--terracotta)]/30 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </motion.button>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
