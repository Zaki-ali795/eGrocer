import { useState, useEffect } from 'react';
import { Handshake, MapPin, Calendar, Send, CheckCircle, XCircle, Clock, X, Package, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { sellerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Requests() {
  const { sellerId } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerNotes, setOfferNotes] = useState('');
  const [filter, setFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    loadRequests();
  }, [sellerId]);

  async function loadRequests() {
    if (!sellerId) return;
    try {
      setLoading(true);
      const data = await sellerApi.getRequests(sellerId);
      // Map database fields to UI expectations if necessary
      const mappedRequests = data.map((r: any) => ({
        id: r.request_id,
        productName: r.product_name,
        customerName: r.customer_name,
        quantity: r.quantity,
        location: 'Local Delivery', 
        requestDate: r.created_at,
        status: r.request_status === 'open' ? 'pending' : r.request_status,
        yourOffer: r.your_bid_price,
        maxBudget: r.max_budget
      }));
      setRequests(mappedRequests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = filter === 'all' ? requests : requests.filter((r: any) => r.status === filter);

  const submitOffer = async () => {
    if (!sellerId) return;
    if (selectedRequest && offerPrice) {
      try {
        await sellerApi.submitBid({
          requestId: selectedRequest.id,
          sellerId: sellerId,
          productId: null, // Optional in DB
          bidPrice: parseFloat(offerPrice),
          estimatedDeliveryDays: 3, // Could be an input
        });

        // Update local state to show offered status
        setRequests(
          requests.map((r: any) =>
            r.id === selectedRequest.id
              ? { ...r, status: 'offered', yourOffer: parseFloat(offerPrice) }
              : r
          )
        );
        setSelectedRequest(null);
        setOfferPrice('');
        setOfferNotes('');
      } catch (err: any) {
        alert("Failed to submit bid: " + err.message);
      }
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r: any) => r.status === 'pending').length,
    offered: requests.filter((r: any) => r.status === 'offered').length,
    accepted: requests.filter((r: any) => r.status === 'accepted').length
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-3 text-lg font-medium">Loading requests...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
      <p className="text-red-600 font-semibold">Error: {error}</p>
      <button onClick={loadRequests} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Customer Requests</h1>
        <p className="text-muted-foreground mt-1">Submit competitive offers for customer product requests</p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-6 border border-accent/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Handshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">How Bidding Works</h3>
            <p className="text-sm text-muted-foreground">
              Customers can request products they're looking for. Review their requests and submit your best price
              offer along with delivery details. Quick responses increase your chances of winning the bid!
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">All Requests</p>
          <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
        </div>

        <div
          onClick={() => setFilter('pending')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'pending' ? 'border-chart-3 ring-2 ring-chart-3/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-semibold text-chart-3">{stats.pending}</p>
        </div>

        <div
          onClick={() => setFilter('offered')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'offered' ? 'border-accent ring-2 ring-accent/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">Offered</p>
          <p className="text-2xl font-semibold text-accent">{stats.offered}</p>
        </div>

        <div
          onClick={() => setFilter('accepted')}
          className={`bg-card rounded-xl p-5 border ${
            filter === 'accepted' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
          } cursor-pointer hover:shadow-md transition-all`}
        >
          <p className="text-sm text-muted-foreground mb-1">Accepted</p>
          <p className="text-2xl font-semibold text-primary">{stats.accepted}</p>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request: any) => (
          <div
            key={request.id}
            className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{request.productName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'accepted' ? 'bg-primary/10 text-primary' :
                    request.status === 'offered' ? 'bg-accent/10 text-accent' :
                    request.status === 'pending' ? 'bg-chart-3/10 text-chart-3' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {request.status === 'accepted' ? <CheckCircle className="w-3 h-3 inline mr-1" /> :
                     request.status === 'offered' ? <Send className="w-3 h-3 inline mr-1" /> :
                     request.status === 'pending' ? <Clock className="w-3 h-3 inline mr-1" /> :
                     <XCircle className="w-3 h-3 inline mr-1" />}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Request ID: {request.id}</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium text-foreground">{request.quantity} units</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{request.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-chart-4" />
                </div>
                <div>
                  <p className="text-muted-foreground">Requested</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(request.requestDate), 'MMM dd, HH:mm')}
                  </p>
                </div>
              </div>
              
              {request.maxBudget && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-[10px]">Rs.</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Budget</p>
                    <p className="font-bold text-emerald-600">Rs. {request.maxBudget.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}

              {request.yourOffer && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-[10px]">Rs.</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Your Offer</p>
                    <p className="text-lg font-semibold text-primary">Rs.{request.yourOffer.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className="font-medium text-foreground">{request.customerName}</span>
              </div>
              {request.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setOfferPrice('');
                    setOfferNotes('');
                  }}
                  className="w-full mt-3 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Offer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Offer Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            <div className="border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Submit Your Offer</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedRequest.productName}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Request Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium text-foreground">{selectedRequest.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium text-foreground">{selectedRequest.quantity} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">{selectedRequest.location}</span>
                </div>
                {selectedRequest.maxBudget && (
                  <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                    <span className="text-emerald-600 font-bold">Max Budget:</span>
                    <span className="font-bold text-emerald-600 underline decoration-2">Rs. {selectedRequest.maxBudget.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Offer Price */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Price Offer (per unit) *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">
                    Rs.
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-medium"
                  />
                </div>
                {offerPrice && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Total: Rs.{(parseFloat(offerPrice) * selectedRequest.quantity).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes (Delivery time, alternatives, etc.)
                </label>
                <textarea
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  rows={4}
                  placeholder="E.g., Can deliver within 24 hours, Fresh organic stock available..."
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={submitOffer}
                disabled={!offerPrice}
                className="w-full px-5 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Competitive Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
