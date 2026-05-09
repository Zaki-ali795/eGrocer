import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, X, Eye, Loader2 } from 'lucide-react';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { sellerId } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    discount: '',
    stock: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    loadData();
  }, [sellerId]);

  async function loadData() {
    if (!sellerId) return;
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        sellerApi.getProducts(sellerId),
        sellerApi.getCategories()
      ]);
      setCategories(catData);
      const data = prodData; // For compatibility with existing mapping logic
      const mappedProducts = data.map((p: any) => ({
        id: p.product_id,
        name: p.product_name,
        category: p.category_name,
        brand: p.brand || 'No Brand',
        price: p.sale_price || p.base_price,
        originalPrice: p.base_price,
        discount: p.sale_price ? Math.round(((p.base_price - p.sale_price) / p.base_price) * 100) : null,
        stock: p.inventory,
        status: p.inventory === 0 ? 'out-of-stock' : p.inventory < 20 ? 'low-stock' : 'available',
        image: p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        description: p.description
      }));
      setProducts(mappedProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      discount: '',
      stock: '0',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.originalPrice.toString(),
      discount: product.discount?.toString() || '',
      stock: product.stock.toString(),
      description: product.description,
      image: product.image
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await sellerApi.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err: any) {
        alert("Failed to delete product: " + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerId) return;
    const payload = {
      sellerId,
      name: formData.name,
      categoryId: parseInt(formData.category),
      brand: formData.brand,
      basePrice: parseFloat(formData.price),
      salePrice: formData.discount ? parseFloat(formData.price) * (1 - parseFloat(formData.discount) / 100) : null,
      description: formData.description,
      imageUrl: formData.image,
      stockQuantity: parseInt(formData.stock) || 0
    };

    try {
      if (editingProduct) {
        await sellerApi.updateProduct(editingProduct.id, payload);
      } else {
        await sellerApi.addProduct(payload);
      }
      setShowModal(false);
      loadData(); // Refresh list
    } catch (err: any) {
      alert("Failed to save product: " + err.message);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.discount && (
                <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  -{product.discount}%
                </div>
              )}
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${product.status === 'available' ? 'bg-primary/90 text-primary-foreground' :
                product.status === 'low-stock' ? 'bg-chart-3/90 text-white' :
                  'bg-destructive/90 text-destructive-foreground'
                }`}>
                {product.status === 'available' ? 'In Stock' :
                  product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category} • {product.brand}</p>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-2xl font-semibold text-primary">Rs.{product.price}</p>
                  <p className="text-sm text-muted-foreground">{product.stock} units</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-200 text-emerald-800 rounded-lg hover:bg-emerald-300 transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-5 py-2.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}