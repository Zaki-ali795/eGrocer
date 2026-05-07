// src/app/pages/SearchResultsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Search, Package, X, Check } from 'lucide-react';
import { productApi, Product } from '../../services/api';
import { ProductCard } from '../components/ProductCard';

interface SearchResultsPageProps {
  onAddToCart: (product: Product) => void;
}

export function SearchResultsPage({ onAddToCart }: SearchResultsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL State
  const initialQuery = searchParams.get('q') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialBrands = searchParams.get('brands') ? searchParams.get('brands')!.split(',') : [];
  const initialInStock = searchParams.get('inStockOnly') === 'true';

  // Local State
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter UI State
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);
  const [inStockOnly, setInStockOnly] = useState(initialInStock);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  // Fetch search results when URL params change
  useEffect(() => {
    setLoading(true);
    productApi.searchProducts({
      q: initialQuery,
      minPrice: initialMinPrice ? Number(initialMinPrice) : undefined,
      maxPrice: initialMaxPrice ? Number(initialMaxPrice) : undefined,
      brands: initialBrands.length > 0 ? initialBrands : undefined,
      inStockOnly: initialInStock || undefined,
    })
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [initialQuery, initialMinPrice, initialMaxPrice, searchParams.get('brands'), initialInStock]);

  // Fetch all brands once for the filter panel
  useEffect(() => {
    productApi.getBrands().then(setAvailableBrands).catch(console.error);
  }, []);

  const hasActiveFilters = initialMinPrice !== '' || initialMaxPrice !== '' || initialBrands.length > 0 || initialInStock;

  // Apply filters via URL params
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (queryInput) params.set('q', queryInput);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (inStockOnly) params.set('inStockOnly', 'true');
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setInStockOnly(false);
    const params = new URLSearchParams();
    if (queryInput) params.set('q', queryInput);
    setSearchParams(params);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Local Sort
  const displayedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    // 'relevance' uses DB default sorting
    return sorted;
  }, [products, sortBy]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-white/80">
              {loading ? 'Searching...' : `Found ${products.length} results for "${initialQuery}"`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Main Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:outline-none transition-colors"
            />
          </form>

          {/* Sort & Filter Toggle */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[var(--green-primary)] focus:outline-none cursor-pointer"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-2xl transition-colors flex items-center gap-2
                ${showFilters || hasActiveFilters
                  ? 'bg-[var(--green-primary)] text-white border-[var(--green-primary)]'
                  : 'bg-white border-gray-200 hover:border-[var(--green-primary)]'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 bg-white rounded-full" />
              )}
            </motion.button>
          </div>
        </div>

        {/* ── Filter Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white p-6 rounded-3xl border border-[var(--green-primary)]/20 shadow-lg shadow-[var(--green-primary)]/5">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[var(--green-primary)]" />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min (Rs)"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--beige)]/50 border border-transparent rounded-xl focus:border-[var(--green-primary)] focus:bg-white outline-none"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder="Max (Rs)"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--beige)]/50 border border-transparent rounded-xl focus:border-[var(--green-primary)] focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Availability</h4>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${inStockOnly ? 'bg-[var(--green-primary)] border-[var(--green-primary)]' : 'border-gray-300 group-hover:border-[var(--green-primary)]'}`}
                      >
                        {inStockOnly && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="hidden"
                      />
                      <span className="text-gray-600 group-hover:text-gray-900">In Stock Only</span>
                    </label>
                  </div>

                  {/* Brands */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Brands</h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                      {availableBrands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`px-3 py-1.5 rounded-xl text-sm transition-colors border
                            ${selectedBrands.includes(brand)
                              ? 'bg-[var(--green-primary)]/10 border-[var(--green-primary)]/30 text-[var(--green-dark)]'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-[var(--green-primary)]/30'
                            }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyFilters}
                    className="px-8 py-3 bg-[var(--green-primary)] text-white rounded-xl font-semibold shadow-lg shadow-[var(--green-primary)]/20 hover:shadow-[var(--green-primary)]/40 transition-shadow"
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-100 rounded-full w-1/3 mb-2" />
                <div className="h-5 bg-gray-100 rounded-full w-3/4 mb-4" />
                <div className="h-8 bg-gray-100 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">
              We couldn't find anything matching your search. Try adjusting your filters or query.
            </p>
            <button
              onClick={() => {
                setQueryInput('');
                clearFilters();
              }}
              className="px-6 py-2.5 border-2 border-[var(--green-primary)] text-[var(--green-primary)] rounded-xl font-semibold hover:bg-[var(--green-primary)] hover:text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  id: String(product.id),
                  rating: product.rating ?? 4.5,
                  reviews: product.reviews ?? 0,
                }}
                onAddToCart={() => onAddToCart(product)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
