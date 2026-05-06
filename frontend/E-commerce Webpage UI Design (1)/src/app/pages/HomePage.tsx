import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  organic?: boolean;
  nutritionHighlights?: string[];
  reorderable?: boolean;
}

interface HomePageProps {
  onAddToCart: (product: Product) => void;
}

export function HomePage({ onAddToCart }: HomePageProps) {
  const featuredProducts: Product[] = [
    {
      id: 'p1',
      name: 'Organic Baby Spinach (300g)',
      category: 'Fresh Vegetables',
      price: 399,
      originalPrice: 549,
      image: 'https://images.unsplash.com/photo-1599660869952-3852916ff82b?w=600',
      rating: 4.8,
      reviews: 234,
      inStock: true,
      organic: true,
      nutritionHighlights: ['High in iron', 'Rich in vitamins', 'Low calorie'],
      reorderable: true,
    },
    {
      id: 'p2',
      name: 'Fresh Carrots Bundle (1kg)',
      category: 'Fresh Vegetables',
      price: 299,
      image: 'https://images.unsplash.com/photo-1549248581-cf105cd081f8?w=600',
      rating: 4.6,
      reviews: 189,
      inStock: true,
      organic: false,
      nutritionHighlights: ['Beta-carotene rich', 'Eye health', 'Crunchy & sweet'],
    },
    {
      id: 'p3',
      name: 'Premium Mixed Greens',
      category: 'Fresh Vegetables',
      price: 449,
      originalPrice: 699,
      image: 'https://images.unsplash.com/photo-1687199126330-556bb3c85b2f?w=600',
      rating: 4.9,
      reviews: 312,
      inStock: true,
      organic: true,
      nutritionHighlights: ['Superfood blend', 'Antioxidants', 'Farm fresh'],
      reorderable: true,
    },
    {
      id: 'p4',
      name: 'Fresh Tomatoes (500g)',
      category: 'Fresh Vegetables',
      price: 349,
      image: 'https://images.unsplash.com/photo-1606836484371-483e90c5d19a?w=600',
      rating: 4.7,
      reviews: 198,
      inStock: true,
      organic: false,
      nutritionHighlights: ['Lycopene rich', 'Vitamin C', 'Heart healthy'],
    },
    {
      id: 'p5',
      name: 'Organic Sweet Peppers (3 pack)',
      category: 'Fresh Vegetables',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=600',
      rating: 4.8,
      reviews: 267,
      inStock: true,
      organic: true,
      nutritionHighlights: ['Vitamin packed', 'Colorful variety', 'Crisp texture'],
    },
    {
      id: 'p6',
      name: 'Fresh Green Beans (400g)',
      category: 'Fresh Vegetables',
      price: 329,
      image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?w=600',
      rating: 4.5,
      reviews: 156,
      inStock: true,
      organic: false,
      nutritionHighlights: ['Fiber rich', 'Low calorie', 'Versatile cooking'],
      reorderable: true,
    },
    {
      id: 'p7',
      name: 'Organic Grape Tomatoes (250g)',
      category: 'Fresh Vegetables',
      price: 499,
      image: 'https://images.unsplash.com/photo-1552825896-8059df63a1fb?w=600',
      rating: 4.9,
      reviews: 423,
      inStock: true,
      organic: true,
      nutritionHighlights: ['Sweet flavor', 'Perfect snacking', 'Rich color'],
    },
    {
      id: 'p8',
      name: 'Fresh Broccoli Crown',
      category: 'Fresh Vegetables',
      price: 279,
      image: 'https://images.unsplash.com/photo-1681782420230-000e854cdbcb?w=600',
      rating: 4.6,
      reviews: 178,
      inStock: false,
      organic: false,
      nutritionHighlights: ['Vitamin K', 'Calcium source', 'Anti-inflammatory'],
    },
  ];

  return (
    <>
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-br from-white via-[var(--cream)]/30 to-[var(--beige)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-primary)]/10 rounded-full mb-4">
              <span className="text-sm text-[var(--green-dark)]">🌿 Farm Fresh Selection</span>
            </div>
            <h2 className="mb-4">
              Today's Fresh Picks
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-selected produce delivered daily from local organic farms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
