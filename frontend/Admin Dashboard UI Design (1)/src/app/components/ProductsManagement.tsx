import { useState, useEffect } from 'react';
import { Filter, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { adminApi } from '../services/api';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  seller?: string;
}

interface ProductsManagementProps {
  initialCategory?: string;
  searchQuery?: string;
}

export function ProductsManagement({ initialCategory, searchQuery = '' }: ProductsManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const productsData = await adminApi.getProducts();
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.deleteProduct(id);
        loadData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const categoryList = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
      <p className="text-red-600 font-semibold text-lg">Failed to load products</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button onClick={loadData} className="mt-4 text-emerald-600 font-bold underline">Try Again</button>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="font-['Manrope'] text-gray-600">View and manage the product catalog</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-['Manrope'] font-medium transition-all ${isFilterOpen ? 'bg-[#064e3b] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 p-4">
                  <h4 className="font-bold text-sm text-gray-900 mb-3">Filter by Category</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <button onClick={() => { setSelectedCategory('all'); setIsFilterOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'}`}>
                      All Categories
                    </button>
                    {categoryList.map(cat => (
                      <button key={cat} onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Product</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Category</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Brand</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Seller</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Price</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Stock</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center overflow-hidden">
                        {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : '📦'}
                      </div>
                      <div>
                        <p className="font-['Manrope'] font-semibold text-gray-900">{product.name}</p>
                        <p className="font-['Manrope'] text-xs text-gray-500">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4"><span className="font-['Manrope'] text-sm text-gray-700">{product.category}</span></td>
                  <td className="py-4 px-4"><span className="font-['Manrope'] text-sm text-gray-700">{product.brand}</span></td>
                  <td className="py-4 px-4"><span className="font-['Manrope'] text-sm text-gray-700">{product.seller || '—'}</span></td>
                  <td className="py-4 px-4"><span className="font-['Manrope'] font-semibold text-gray-900">Rs {product.price}</span></td>
                  <td className="py-4 px-4">
                    <span className={`font-['Manrope'] font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 50 ? 'text-orange-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.status === 'active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {product.status}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Delete Product">
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
