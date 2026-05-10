import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminApi } from '../services/api';

interface Product {
  id: string;
  name: string;
  category: string;
  category_id?: number;
  brand: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  description?: string;
  sku?: string;
  unit?: string;
  nutritional_info?: string;
  is_perishable?: boolean;
}

interface ProductsManagementProps {
  initialCategory?: string;
  searchQuery?: string;
}

export function ProductsManagement({ initialCategory, searchQuery = '' }: ProductsManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    brand: '',
    sku: '',
    unit: 'piece',
    basePrice: '',
    salePrice: '',
    imageUrl: '',
    nutritionalInfo: '',
    isPerishable: false,
    isActive: true,
    stock: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);




  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        categoryId: product.category_id?.toString() || '',
        brand: product.brand,
        sku: product.sku || '',
        unit: product.unit || 'piece',
        basePrice: product.price.toString(),
        salePrice: '',
        imageUrl: product.image,
        nutritionalInfo: product.nutritional_info || '',
        isPerishable: product.is_perishable || false,
        isActive: product.status === 'active',
        stock: product.stock.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        brand: '',
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        unit: 'piece',
        basePrice: '',
        salePrice: '',
        imageUrl: '',
        nutritionalInfo: '',
        isPerishable: false,
        isActive: true,
        stock: '0'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        basePrice: parseFloat(formData.basePrice),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock),
        status: formData.isActive ? 'active' : 'inactive'
      };

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, data);
      } else {
        await adminApi.createProduct(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

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

  const filteredProducts = products.filter(product => {
    const combinedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(combinedSearch);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryList = Array.from(new Set(products.map(p => p.category)));

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-['Crimson_Pro'] text-5xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="font-['Manrope'] text-gray-600">Manage your product catalog</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#064e3b] to-[#10b981] text-white rounded-2xl font-['Manrope'] font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-['Manrope'] font-medium transition-all ${
                isFilterOpen ? 'bg-[#064e3b] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 p-4"
                >
                  <h4 className="font-bold text-sm text-gray-900 mb-3">Filter by Category</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    <button
                      onClick={() => { setSelectedCategory('all'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedCategory === 'all' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      All Categories
                    </button>
                    {categoryList.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedCategory === cat ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
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
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Price</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Stock</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-['Manrope'] font-semibold text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div>
                        <p className="font-['Manrope'] font-semibold text-gray-900">{product.name}</p>
                        <p className="font-['Manrope'] text-xs text-gray-500">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-700">{product.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] text-sm text-gray-700">{product.brand}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Manrope'] font-semibold text-gray-900">Rs {product.price}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-['Manrope'] font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 50 ? 'text-orange-600' :
                      'text-gray-900'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      product.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {product.status}
                    </div>
                  </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" 
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group" 
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Crimson_Pro'] text-3xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Category</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">SKU</label>
                    <input
                      required
                      type="text"
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Price (Rs)</label>
                    <input
                      required
                      type="number"
                      value={formData.basePrice}
                      onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Stock</label>
                    <input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#064e3b]/20 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-['Manrope'] font-semibold text-gray-700">Perishable Product</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPerishable}
                        onChange={(e) => setFormData({ ...formData, isPerishable: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-['Manrope'] font-semibold text-gray-700">Active Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#064e3b] to-[#10b981] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
