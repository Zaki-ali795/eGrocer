// src/app/pages/CategoryBrowsePage.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Package, Search, SlidersHorizontal, X, Check } from 'lucide-react';
import { useLocation } from 'react-router';
import { productApi, Category, Product } from '../../services/api';
import { ProductCard } from '../components/ProductCard';

interface CategoryBrowsePageProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  onWishlistToggle: (productId: number) => Promise<'added' | 'removed'>;
  wishlistItems: Product[];
}

export function CategoryBrowsePage({ onAddToCart, onWishlistToggle, wishlistItems }: CategoryBrowsePageProps) {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Reset view when navigating to /categories (e.g. from Navbar)
  useEffect(() => {
    if (location.pathname === '/categories') {
      setSelectedCategory(null);
    }
  }, [location.pathname, location.key]); // Use location.key to detect clicks on the same route
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Filter state ──────────────────────────────────────────────
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    productApi.getCategories()
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingCats(false));
  }, []);

  // Fetch products + available brands when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    setLoadingProducts(true);
    setProducts([]);
    // Reset filters when switching category
    setMinPrice(''); setMaxPrice(''); setSelectedBrands([]); setInStockOnly(false);
    Promise.all([
      productApi.getProductsByCategory(selectedCategory.category_id),
      productApi.getBrands(selectedCategory.category_id),
    ])
      .then(([prods, brands]) => { setProducts(prods); setAvailableBrands(brands); })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingProducts(false));
  }, [selectedCategory]);

  // Toggle a brand in the selected list
  const toggleBrand = (brand: string) =>
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );

  // Clear all filters
  const clearFilters = () => {
    setMinPrice(''); setMaxPrice(''); setSelectedBrands([]); setInStockOnly(false);
  };

  const hasActiveFilters = minPrice !== '' || maxPrice !== '' || selectedBrands.length > 0 || inStockOnly;

  // Filter + sort locally (combines search + filter panel)
  const displayed = useMemo(() => products
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !(p.brand || '').toLowerCase().includes(q)) return false;
      if (minPrice !== '' && p.price < Number(minPrice)) return false;
      if (maxPrice !== '' && p.price > Number(maxPrice)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand || '')) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    }),
    [products, searchQuery, minPrice, maxPrice, selectedBrands, inStockOnly, sortBy]);

  const categoryEmojis: Record<string, string> = {
    'Fruits & Vegetables': '🥦',
    'Dairy & Eggs': '🥛',
    'Meat & Seafood': '🥩',
    'Bakery': '🍞',
    'Beverages': '🧃',
    'Snacks': '🍿',
    'Pantry': '🫙',
    'Frozen': '🧊',
    'Personal Care': '🧴',
    'Household': '🏠',
  };

  const getEmoji = (name: string) =>
    categoryEmojis[name] ?? '🛒';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--cream)]/20 to-[var(--beige)]/30">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <span className="cursor-pointer hover:text-white" onClick={() => setSelectedCategory(null)}>
                All Categories
              </span>
              {selectedCategory && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-white">{selectedCategory.category_name}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {selectedCategory ? selectedCategory.category_name : 'Browse Categories'}
            </h1>
            <p className="text-white/80">
              {selectedCategory
                ? `${products.length} products found`
                : 'Choose a category to explore fresh products'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ── Category Grid ── */}
        {!selectedCategory && (
          <>
            {loadingCats ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-36 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No categories found in the database yet.</p>
                <p className="text-sm mt-1 text-gray-400">Add some categories via SQL to see them here.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.06 } },
                  hidden: {},
                }}
              >
                {categories.map((cat) => (
                  <motion.div
                    key={cat.category_id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 20 },
                      visible: { opacity: 1, scale: 1, y: 0 },
                    }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCategory(cat)}
                    className="bg-white rounded-3xl p-6 shadow-md shadow-black/5 border border-gray-100
                               hover:border-[var(--green-primary)]/30 hover:shadow-xl
                               hover:shadow-[var(--green-primary)]/10 cursor-pointer transition-all group"
                  >
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.category_name}
                        className="w-16 h-16 object-cover rounded-2xl mb-4 mx-auto"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--green-primary)]/10 to-[var(--green-secondary)]/10
                                      rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto
                                      group-hover:from-[var(--green-primary)]/20 group-hover:to-[var(--green-secondary)]/20 transition-all">
                        {getEmoji(cat.category_name)}
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-center text-gray-800 group-hover:text-[var(--green-primary)] transition-colors line-clamp-2">
                      {cat.category_name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-gray-400 text-center mt-1 line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* ── Products in Category ── */}
        {selectedCategory && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in this category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl
                             focus:border-[var(--green-primary)] focus:outline-none transition-colors"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-2xl
                             focus:border-[var(--green-primary)] focus:outline-none cursor-pointer"
                >
                  <option value="name">Sort: A–Z</option>
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
                    <span className="w-5 h-5 bg-white text-[var(--green-primary)] rounded-full text-xs flex items-center justify-center font-bold">
                      {[minPrice !== '', maxPrice !== '', selectedBrands.length > 0, inStockOnly].filter(Boolean).length}
                    </span>
                  )}
                </motion.button>

                {/* Back button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedCategory(null); setProducts([]); setSearchQuery(''); clearFilters(); }}
                  className="px-4 py-3 bg-[var(--green-primary)]/10 text-[var(--green-primary)]
                             rounded-2xl hover:bg-[var(--green-primary)]/20 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </motion.button>
              </div>
            </div>

            {/* ── Filter Panel (slides in below toolbar, above products) ── */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  key="filter-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-6">

                    {/* Price Range */}
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range (Rs)</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          min={0}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm
                                     focus:border-[var(--green-primary)] focus:outline-none transition-colors"
                        />
                        <span className="text-gray-400 text-sm shrink-0">–</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          min={0}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm
                                     focus:border-[var(--green-primary)] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Brand Filter */}
                    {availableBrands.length > 0 && (
                      <div className="flex-1 min-w-[180px]">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Brand</p>
                        <div className="flex flex-wrap gap-2">
                          {availableBrands.map((brand) => (
                            <button
                              key={brand}
                              onClick={() => toggleBrand(brand)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition-all
                                ${selectedBrands.includes(brand)
                                  ? 'bg-[var(--green-primary)] text-white border-[var(--green-primary)]'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--green-primary)]'
                                }`}
                            >
                              {selectedBrands.includes(brand) && <Check className="w-3 h-3" />}
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* In Stock Toggle + Clear */}
                    <div className="flex flex-col justify-between gap-3 shrink-0">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Availability</p>
                        <button
                          onClick={() => setInStockOnly(!inStockOnly)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all
                            ${inStockOnly
                              ? 'bg-[var(--green-primary)] text-white border-[var(--green-primary)]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--green-primary)]'
                            }`}
                        >
                          {inStockOnly && <Check className="w-4 h-4" />}
                          In stock only
                        </button>
                      </div>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-[var(--green-primary)] hover:underline text-left"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active filter chips */}
                  {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {minPrice !== '' && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-[var(--green-primary)]/10 text-[var(--green-primary)] rounded-full text-xs">
                          Min Rs {minPrice}
                          <button onClick={() => setMinPrice('')}><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {maxPrice !== '' && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-[var(--green-primary)]/10 text-[var(--green-primary)] rounded-full text-xs">
                          Max Rs {maxPrice}
                          <button onClick={() => setMaxPrice('')}><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {selectedBrands.map(b => (
                        <span key={b} className="flex items-center gap-1 px-3 py-1 bg-[var(--green-primary)]/10 text-[var(--green-primary)] rounded-full text-xs">
                          {b}
                          <button onClick={() => toggleBrand(b)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      {inStockOnly && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-[var(--green-primary)]/10 text-[var(--green-primary)] rounded-full text-xs">
                          In stock
                          <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading skeleton */}
            {loadingProducts && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
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

            {/* Empty state */}
            {!loadingProducts && displayed.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg text-gray-500">No products found.</p>
                {(searchQuery || hasActiveFilters) && (
                  <button
                    onClick={() => { setSearchQuery(''); clearFilters(); }}
                    className="mt-3 text-sm text-[var(--green-primary)] hover:underline"
                  >
                    Clear search &amp; filters
                  </button>
                )}
              </div>
            )}

            {/* Product grid */}
            <AnimatePresence>
              {!loadingProducts && displayed.length > 0 && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: {},
                  }}
                >
                  {displayed.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <ProductCard
                        product={{
                          ...product,
                          id: String(product.id),
                          rating: product.rating ?? 4.5,
                          reviews: product.reviews ?? 0,
                        }}
                        onAddToCart={(p) => onAddToCart({ ...product, id: product.id })}
                        onWishlistToggle={onWishlistToggle}
                        initialIsWishlisted={wishlistItems.some(item => item.id === product.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
