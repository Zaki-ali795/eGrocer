import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Plus, Minus, Loader2 } from 'lucide-react';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Inventory() {
  const { sellerId } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'low-stock' | 'out-of-stock'>('all');

  useEffect(() => {
    loadInventory();
  }, [sellerId]);

  async function loadInventory() {
    if (!sellerId) return;
    try {
      setLoading(true);
      const data = await sellerApi.getProducts(sellerId);
      const mappedProducts = data.map((p: any) => ({
        id: p.product_id,
        name: p.product_name,
        category: p.category_name,
        stock: p.inventory,
        image: p.image_url || 'https://via.placeholder.com/150',
        status: p.inventory === 0 ? 'out-of-stock' : p.inventory < 20 ? 'low-stock' : 'available'
      }));
      setProducts(mappedProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateStock = async (id: number, change: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStock = Math.max(0, product.stock + change);
    try {
      await sellerApi.updateInventory(id, newStock);
      setProducts(
        products.map((p) => {
          if (p.id === id) {
            const newStatus = newStock === 0 ? 'out-of-stock' : newStock < 20 ? 'low-stock' : 'available';
            return { ...p, stock: newStock, status: newStatus };
          }
          return p;
        })
      );
    } catch (err: any) {
      alert("Failed to update stock: " + err.message);
    }
  };

  const filteredProducts = filter === 'all' ? products : products.filter((p) => p.status === filter);

  const stats = {
    total: products.length,
    available: products.filter((p) => p.status === 'available').length,
    lowStock: products.filter((p) => p.status === 'low-stock').length,
    outOfStock: products.filter((p) => p.status === 'out-of-stock').length
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
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and update stock levels in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-foreground">{stats.total}</p>
        </div>

        <div
          onClick={() => setFilter('available')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'available' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Available</p>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-primary">{stats.available}</p>
        </div>

        <div
          onClick={() => setFilter('low-stock')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'low-stock' ? 'border-chart-3 ring-2 ring-chart-3/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-chart-3" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-chart-3">{stats.lowStock}</p>
        </div>

        <div
          onClick={() => setFilter('out-of-stock')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'out-of-stock' ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-destructive">{stats.outOfStock}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Product</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Category</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Stock Level</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-border hover:bg-sidebar-accent/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-foreground">{product.category}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px]">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              product.status === 'available' ? 'bg-primary' :
                              product.status === 'low-stock' ? 'bg-chart-3' :
                              'bg-destructive'
                            }`}
                            style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-medium text-foreground min-w-[60px]">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                      product.status === 'available' ? 'bg-primary/10 text-primary' :
                      product.status === 'low-stock' ? 'bg-chart-3/10 text-chart-3' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {product.status === 'available' ? <CheckCircle className="w-3.5 h-3.5" /> :
                       product.status === 'low-stock' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                       <XCircle className="w-3.5 h-3.5" />}
                      {product.status === 'available' ? 'Available' :
                       product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStock(product.id, -10)}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStock(product.id, 10)}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
