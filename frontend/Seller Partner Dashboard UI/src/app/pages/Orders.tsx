import { useState, useEffect } from 'react';
import { Clock, Package, CheckCircle, XCircle, Eye, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { sellerId } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (sellerId) {
      loadOrders();
    }
  }, [sellerId]);

  async function loadOrders() {
    if (!sellerId) return;
    try {
      setLoading(true);
      const data = await sellerApi.getOrders(sellerId);
      // Group by order_id since the query returns join results
      const groupedOrders: any = {};
      data.forEach((item: any) => {
        if (!groupedOrders[item.order_id]) {
          groupedOrders[item.order_id] = {
            id: item.order_number || `#ORD-${item.order_id}`,
            customerName: item.customer_name,
            orderDate: item.created_at,
            status: item.order_status,
            totalPrice: 0,
            items: []
          };
        }
        groupedOrders[item.order_id].items.push({
          productName: item.product_name,
          quantity: item.quantity,
          price: item.unit_price
        });
        groupedOrders[item.order_id].totalPrice += item.unit_price * item.quantity;
      });
      setOrders(Object.values(groupedOrders));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Extract numeric ID if it's in #ORD-ID format
      const numericId = typeof orderId === 'string' && orderId.includes('-')
        ? parseInt(orderId.split('-')[1])
        : parseInt(orderId);

      await sellerApi.updateOrderStatus(numericId, newStatus);

      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert("Failed to update order status: " + err.message);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

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
        <h1 className="text-3xl font-semibold text-foreground">Order Management</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`bg-card rounded-xl p-4 border ${filter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
            } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">All Orders</p>
          <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
        </div>

        <div
          onClick={() => setFilter('pending')}
          className={`bg-card rounded-xl p-4 border ${filter === 'pending' ? 'border-chart-4 ring-2 ring-chart-4/20' : 'border-border'
            } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-semibold text-chart-4">{stats.pending}</p>
        </div>

        <div
          onClick={() => setFilter('processing')}
          className={`bg-card rounded-xl p-4 border ${filter === 'processing' ? 'border-accent ring-2 ring-accent/20' : 'border-border'
            } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">Processing</p>
          <p className="text-2xl font-semibold text-accent">{stats.processing}</p>
        </div>

        <div
          onClick={() => setFilter('delivered')}
          className={`bg-card rounded-xl p-4 border ${filter === 'delivered' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
            } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">Delivered</p>
          <p className="text-2xl font-semibold text-primary">{stats.delivered}</p>
        </div>

        <div
          onClick={() => setFilter('cancelled')}
          className={`bg-card rounded-xl p-4 border ${filter === 'cancelled' ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'
            } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
          <p className="text-2xl font-semibold text-destructive">{stats.cancelled}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Order ID</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Date</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Items</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Total</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-emerald-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-border hover:bg-sidebar-accent/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-emerald-900">{order.id}</td>
                  <td className="py-4 px-6 text-foreground">{order.customerName}</td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {format(new Date(order.orderDate), 'MMM dd, HH:mm')}
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{order.items.length} items</td>
                  <td className="py-4 px-6 font-medium text-emerald-900">Rs.{order.totalPrice.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${order.status === 'delivered' ? 'bg-primary/10 text-primary' :
                        order.status === 'processing' ? 'bg-accent/10 text-accent' :
                          order.status === 'pending' ? 'bg-chart-4/10 text-chart-4' :
                            'bg-destructive/10 text-destructive'
                      }`}>
                      {order.status === 'delivered' ? <CheckCircle className="w-3.5 h-3.5" /> :
                        order.status === 'processing' ? <Package className="w-3.5 h-3.5" /> :
                          order.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> :
                            <XCircle className="w-3.5 h-3.5" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card rounded-2xl w-full max-w-2xl shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            <div className="border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Order Details</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Customer Information</h3>
                <div className="bg-sidebar-accent rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium text-foreground">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(selectedOrder.orderDate), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  {selectedOrder.deliveryInstructions && (
                    <div>
                      <span className="text-muted-foreground">Delivery Instructions:</span>
                      <p className="font-medium text-foreground mt-1">{selectedOrder.deliveryInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-sidebar-accent rounded-lg p-3">
                      <span className="text-foreground">{item.productName}</span>
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-lg font-medium text-foreground">Total Amount:</span>
                <span className="text-2xl font-semibold text-primary">Rs.{selectedOrder.totalPrice.toFixed(2)}</span>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Update Order Status</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${selectedOrder.status === 'pending'
                        ? 'bg-chart-4 text-white'
                        : 'bg-emerald-800 text-white hover:bg-emerald-500'
                      }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${selectedOrder.status === 'processing'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-emerald-800 text-white hover:bg-emerald-500'
                      }`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${selectedOrder.status === 'delivered'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-emerald-800 text-white hover:bg-emerald-500'
                      }`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${selectedOrder.status === 'cancelled'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-emerald-800 text-white hover:bg-emerald-500'
                      }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}