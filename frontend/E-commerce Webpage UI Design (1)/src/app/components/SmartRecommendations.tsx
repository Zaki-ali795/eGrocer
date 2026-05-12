import { motion } from 'motion/react';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';

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

interface SmartRecommendationsProps {
  onAddToCart: (product: Product) => void;
  onWishlistToggle: (productId: number) => Promise<'added' | 'removed'>;
  wishlistItems?: Product[];
}

export function SmartRecommendations({ onAddToCart, onWishlistToggle, wishlistItems = [] }: SmartRecommendationsProps) {
  const outOfStockProduct = {
    name: 'Organic Blueberries (250g)',
    category: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1621295538579-7fd8bb7a662a?w=400',
  };

  const alternatives: Product[] = [
    {
      id: '1001',
      name: 'Organic Blackberries (250g)',
      category: 'Fresh Fruits',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1601379760607-78be3d4ff432?w=400',
      rating: 4.7,
      reviews: 142,
      inStock: true,
      organic: true,
      nutritionHighlights: ['High in antioxidants', 'Vitamin C rich', 'Low calorie'],
    },
    {
      id: '1002',
      name: 'Fresh Strawberries (500g)',
      category: 'Fresh Fruits',
      price: 649,
      image: 'https://images.unsplash.com/photo-1621295538579-7fd8bb7a662a?w=400',
      rating: 4.8,
      reviews: 256,
      inStock: true,
      organic: true,
      nutritionHighlights: ['Vitamin C powerhouse', 'Heart healthy', 'Natural sweetness'],
    },
    {
      id: '1003',
      name: 'Mixed Berry Box (400g)',
      category: 'Fresh Fruits',
      price: 899,
      originalPrice: 1199,
      image: 'https://images.unsplash.com/photo-1621295239171-6f95272fdf45?w=400',
      rating: 4.9,
      reviews: 189,
      inStock: true,
      organic: true,
      nutritionHighlights: ['Antioxidant blend', 'Variety pack', 'Superfood mix'],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Out of Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl border-2 border-orange-200"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2">
                {outOfStockProduct.name} is Currently Out of Stock
              </h3>
              <p className="text-gray-600 mb-4">
                Don't worry! We've found similar products you might love based on category, price range, and customer preferences.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lightbulb className="w-4 h-4 text-orange-500" />
                <span>Smart AI-powered recommendations tailored for you</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-primary)]/10 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--green-primary)]" />
            <span className="text-sm text-[var(--green-dark)]">Smart Recommendations</span>
          </div>
          <h2 className="mb-4">
            Similar Products You'll Love
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked alternatives matching your preferences and purchase history
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternatives.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onWishlistToggle={onWishlistToggle}
                initialIsWishlisted={wishlistItems.some(item => String(item.id) === product.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Why These Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Same Category',
              description: 'Fresh berries matching your original choice',
              icon: '🫐',
            },
            {
              title: 'Similar Price Range',
              description: 'Products within Rs 200 of your budget',
              icon: '💰',
            },
            {
              title: 'High Ratings',
              description: 'Customer favorites with 4.5+ stars',
              icon: '⭐',
            },
          ].map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gradient-to-br from-[var(--beige)] to-white rounded-2xl border border-gray-100 text-center"
            >
              <div className="text-4xl mb-3">{reason.icon}</div>
              <h4 className="mb-2">{reason.title}</h4>
              <p className="text-sm text-gray-600">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
