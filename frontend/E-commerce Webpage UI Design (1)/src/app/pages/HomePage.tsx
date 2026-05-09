import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { productApi, Product } from '../../services/api';

interface HomePageProps {
  onAddToCart: (product: Product) => void;
}

export function HomePage({ onAddToCart }: HomePageProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getFeaturedProducts(28)
      .then(setProducts)
      .catch(() => setProducts([]))   // silently fail — hero still shows
      .finally(() => setLoading(false));
  }, []);

  const handleStartShopping = () => {
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHowBiddingWorks = () => {
    navigate('/requests');
  };

  return (
    <>
      <Hero onStartShopping={handleStartShopping} onHowBiddingWorks={handleHowBiddingWorks} />

      {/* Featured Products Section */}
      <section id="products-section" className="py-16 bg-gradient-to-br from-white via-[var(--cream)]/30 to-[var(--beige)]/50">
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
            <h2 className="mb-4">Today's Fresh Picks</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-selected produce delivered daily from local organic farms
            </p>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md">
                  <div className="aspect-square bg-gray-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded-full animate-pulse w-1/3" />
                    <div className="h-5 bg-gray-100 rounded-full animate-pulse w-2/3" />
                    <div className="h-8 bg-gray-100 rounded-full animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product grid — real DB data */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    id: String(product.id),       // ProductCard expects string id
                    rating: product.rating ?? 4.5,
                    reviews: product.reviews ?? 0,
                  }}
                  onAddToCart={() => onAddToCart(product)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>No products available yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
