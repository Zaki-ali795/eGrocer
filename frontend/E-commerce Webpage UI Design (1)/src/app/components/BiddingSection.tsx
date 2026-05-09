import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, TrendingDown, CheckCircle2, Store, Clock,
  Loader2, PackageSearch, ChevronDown, ChevronUp,
  DollarSign, Tag, ShoppingBag, Sparkles, Send, AlertCircle,
  Star, Truck, Award,
} from 'lucide-react';
import { bidApi, ProductRequest } from '../../services/api';
import { toast } from 'sonner';

// ── How It Works steps (static content) ──────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    icon: MessageSquare,
    title: 'Submit a Request',
    description: "Tell us what product you're looking for — name, description, quantity, and your max budget.",
    color: 'from-[var(--green-primary)] to-[var(--green-secondary)]',
  },
  {
    step: '02',
    icon: Store,
    title: 'Sellers Compete',
    description: 'Registered sellers review your request and place competitive bids with their best prices.',
    color: 'from-[var(--terracotta)] to-orange-500',
  },
  {
    step: '03',
    icon: Award,
    title: 'Pick the Best Offer',
    description: 'Compare bids by price, delivery time, and store rating — then accept the one you like most.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    step: '04',
    icon: Truck,
    title: 'Fast Delivery',
    description: "Your chosen seller fulfils the order and delivers it right to your door.",
    color: 'from-blue-500 to-blue-700',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function HowItWorksCard({ item, index }: { item: typeof HOW_IT_WORKS[0]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      className="relative flex flex-col items-center text-center p-6"
    >
      {/* Connector line (hidden on last) */}
      {index < HOW_IT_WORKS.length - 1 && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+3rem)] right-0 h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0" />
      )}

      <div className={`relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
        <Icon className="w-9 h-9 text-white" />
        <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
          {item.step}
        </span>
      </div>

      <h4 className="font-bold text-gray-900 mb-2 text-base">{item.title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed max-w-[180px]">{item.description}</p>
    </motion.div>
  );
}

function RequestCard({
  request,
  onAccept,
}: {
  request: ProductRequest;
  onAccept: (requestId: number, bidId: number) => void;
}) {
  const [expanded, setExpanded]       = useState(false);
  const [accepting, setAccepting]     = useState<number | null>(null);

  const handleAccept = async (bidId: number) => {
    setAccepting(bidId);
    try {
      await onAccept(request.id, bidId);
    } finally {
      setAccepting(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-lg shadow-black/5 overflow-hidden border border-gray-100"
    >
      {/* Request Header */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base leading-tight">{request.productName}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                request.status === 'open'
                  ? 'bg-[var(--green-primary)]/10 text-[var(--green-dark)]'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {request.status === 'open' ? '🟢 Open' : '✅ Fulfilled'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {request.category} · {request.quantity} unit{request.quantity !== 1 ? 's' : ''} · {request.timeAgo}
            </p>
            {request.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
            )}
            {request.maxBudget && (
              <div className="flex items-center gap-1 mt-2">
                <DollarSign className="w-3.5 h-3.5 text-[var(--green-primary)]" />
                <span className="text-xs text-gray-500">Max budget: <strong className="text-gray-700">Rs {request.maxBudget.toLocaleString('en-IN')}</strong></span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center px-4 py-2.5 bg-[var(--green-primary)]/8 rounded-2xl">
              <p className="text-2xl font-bold text-[var(--green-primary)] leading-none">{request.bidCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Bid{request.bidCount !== 1 ? 's' : ''}</p>
            </div>
            {request.bidCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium transition-colors"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {expanded ? 'Hide' : 'View'} Bids
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Bids Panel */}
      <AnimatePresence>
        {expanded && request.bidCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-[var(--beige)]/20 to-white">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-semibold">Seller Bids — sorted by lowest price</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {request.bids.map((bid, i) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
                    className={`relative p-5 rounded-2xl border-2 transition-all bg-white ${
                      i === 0
                        ? 'border-[var(--green-primary)]/40 shadow-md shadow-[var(--green-primary)]/10'
                        : 'border-gray-100'
                    }`}
                  >
                    {i === 0 && (
                      <div className="absolute -top-2.5 left-4 px-3 py-0.5 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white text-xs rounded-full font-semibold shadow-sm">
                        Best Price
                      </div>
                    )}

                    {/* Store info */}
                    <div className="flex items-center gap-2.5 mb-3 pt-1">
                      <div className="w-9 h-9 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-secondary)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{bid.storeName}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-500">{bid.storeRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-[var(--green-primary)]">
                        Rs {bid.bidPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Delivery */}
                    {bid.estimatedDeliveryDays && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{bid.estimatedDeliveryDays} day{bid.estimatedDeliveryDays !== 1 ? 's' : ''} delivery</span>
                      </div>
                    )}

                    {/* Accept button */}
                    {request.status === 'open' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAccept(bid.id)}
                        disabled={accepting !== null}
                        className="w-full py-2.5 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white text-sm rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:shadow-lg hover:shadow-[var(--green-primary)]/30"
                      >
                        {accepting === bid.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <CheckCircle2 className="w-4 h-4" />
                        }
                        Accept Offer
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No bids yet */}
      {request.bidCount === 0 && (
        <div className="px-6 pb-5 text-sm text-gray-400 italic flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Waiting for sellers to place bids…
        </div>
      )}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function BiddingSection() {
  const [requests, setRequests]       = useState<ProductRequest[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showForm, setShowForm]       = useState(false);

  // Form state
  const [form, setForm] = useState({
    productName: '',
    description: '',
    quantity: 1,
    maxBudget: '',
  });

  // ── Load requests ──────────────────────────────────────────────────────────
  const loadRequests = async () => {
    try {
      const data = await bidApi.getOpenRequests();
      setRequests(data);
    } catch {
      // silently fail — section still renders with empty state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  // ── Submit request ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!form.productName.trim()) {
      setSubmitError('Please enter the product name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await bidApi.submitRequest({
        productName:  form.productName.trim(),
        description:  form.description.trim() || undefined,
        quantity:     form.quantity,
        maxBudget:    form.maxBudget ? parseFloat(form.maxBudget) : undefined,
      });

      toast.success('Request submitted! Sellers will respond shortly.');
      setForm({ productName: '', description: '', quantity: 1, maxBudget: '' });
      setShowForm(false);
      // Reload requests list
      setIsLoading(true);
      await loadRequests();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit request.';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Accept bid ─────────────────────────────────────────────────────────────
  const handleAccept = async (requestId: number, bidId: number) => {
    try {
      await bidApi.acceptBid(requestId, bidId);
      toast.success('Bid accepted! The seller will fulfil your order.');
      setIsLoading(true);
      await loadRequests();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to accept bid.';
      toast.error(message);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="bidding-section" className="py-20 bg-gradient-to-br from-white via-[var(--beige)]/30 to-[var(--cream)]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-primary)]/10 rounded-full mb-5">
            <Sparkles className="w-4 h-4 text-[var(--green-primary)]" />
            <span className="text-sm font-medium text-[var(--green-dark)]">Unique Feature</span>
          </div>
          <h2 className="mb-4 text-gray-900">
            Request &amp; Get Best Prices
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Can't find what you need? Tell us — registered sellers will <strong className="text-[var(--green-dark)]">compete</strong> with
            their best offers so you always get the lowest price.
          </p>
        </motion.div>

        {/* ── How It Works ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-black/5 p-8 mb-12"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-[var(--green-primary)] to-[var(--green-secondary)] rounded-full" />
            <h3 className="text-lg font-bold text-gray-800">How It Works</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 relative">
            {HOW_IT_WORKS.map((item, i) => (
              <HowItWorksCard key={i} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Submit Request CTA + Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-14"
        >
          {!showForm ? (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="w-full py-5 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-3xl shadow-xl shadow-[var(--green-primary)]/25 flex items-center justify-center gap-3 text-lg font-semibold hover:shadow-2xl transition-shadow"
            >
              <PackageSearch className="w-6 h-6" />
              Submit a Product Request
            </motion.button>
          ) : (
            <AnimatePresence>
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl shadow-black/8 border border-[var(--green-primary)]/15 p-8 space-y-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[var(--green-primary)]" />
                    New Product Request
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setSubmitError(''); }}
                    className="text-gray-400 hover:text-gray-600 text-sm underline"
                  >
                    Cancel
                  </button>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--green-primary)]/60" />
                    <input
                      type="text"
                      value={form.productName}
                      onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
                      placeholder="e.g. Organic Quinoa 2kg"
                      className="w-full pl-11 pr-4 py-3.5 bg-[var(--beige)]/40 border-2 border-transparent rounded-2xl focus:border-[var(--green-primary)] outline-none transition-all text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the brand, quality, or any specific requirements..."
                    rows={3}
                    className="w-full px-4 py-3.5 bg-[var(--beige)]/40 border-2 border-transparent rounded-2xl focus:border-[var(--green-primary)] outline-none transition-all resize-none text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Quantity + Max Budget */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-3.5 bg-[var(--beige)]/40 border-2 border-transparent rounded-2xl focus:border-[var(--green-primary)] outline-none transition-all text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Max Budget (Rs) <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--green-primary)]/60" />
                      <input
                        type="number"
                        min={0}
                        value={form.maxBudget}
                        onChange={e => setForm(f => ({ ...f, maxBudget: e.target.value }))}
                        placeholder="e.g. 500"
                        className="w-full pl-11 pr-4 py-3.5 bg-[var(--beige)]/40 border-2 border-transparent rounded-2xl focus:border-[var(--green-primary)] outline-none transition-all text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Error */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {submitError}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : { scale: 1.01, y: -1 }}
                  whileTap={isSubmitting ? {} : { scale: 0.99 }}
                  className="w-full py-4 bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-secondary)] text-white rounded-2xl font-semibold shadow-lg shadow-[var(--green-primary)]/30 flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:shadow-xl"
                >
                  {isSubmitting
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
                    : <><Send className="w-5 h-5" /> Submit Request</>
                  }
                </motion.button>

                <p className="text-xs text-center text-gray-400">
                  Sellers will respond within 24 hours with competitive offers
                </p>
              </motion.form>
            </AnimatePresence>
          )}
        </motion.div>

        {/* ── Active Requests List ── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingDown className="w-5 h-5 text-[var(--green-primary)]" />
            <h3 className="text-lg font-bold text-gray-800">Open Requests</h3>
            {!isLoading && (
              <span className="ml-auto px-3 py-1 bg-[var(--green-primary)]/10 text-[var(--green-dark)] text-sm rounded-full font-medium">
                {requests.length} active
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16 text-[var(--green-primary)]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200"
            >
              <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No open requests yet.</p>
              <p className="text-sm text-gray-400 mt-1">Be the first to submit one!</p>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {requests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
