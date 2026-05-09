// src/services/api.ts

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data as T;
}

// ─── Types ──────────────────────────────────────────────────────
export interface Category {
  category_id: number;
  category_name: string;
  description: string | null;
  image_url: string | null;
  parent_category_id: number | null;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  brand: string | null;
  sku: string | null;
  unit: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  taxPercent: number;
  image: string;
  nutritionalInfo: string | null;
  isPerishable: boolean;
  inStock: boolean;
  stockQty: number;
  category: string;
  categoryId: number;
  // UI extras (optional)
  rating?: number;
  reviews?: number;
  organic?: boolean;
}

export interface FlashDeal {
  id: string;
  name: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  totalStock: number;
  endsAt: string;
}

// ─── Search Filters type ─────────────────────────────────────────
export interface SearchFilters {
  q?: string;
  minPrice?: number | '';
  maxPrice?: number | '';
  brands?: string[];      // array of brand names
  categoryId?: number;
  inStockOnly?: boolean;
}

// ─── Product API calls ───────────────────────────────────────────
export const productApi = {
  getCategories: () => request<Category[]>('/products/categories'),

  getProductsByCategory: (categoryId: number) =>
    request<Product[]>(`/products/category/${categoryId}`),

  getFeaturedProducts: (limit = 8) =>
    request<Product[]>(`/products/featured?limit=${limit}`),

  getProductById: (productId: number) =>
    request<Product>(`/products/${productId}`),

  getBrands: (categoryId?: number) => {
    const qs = categoryId ? `?categoryId=${categoryId}` : '';
    return request<string[]>(`/products/brands${qs}`);
  },

  getFlashDeals: () => request<FlashDeal[]>('/products/flash-deals'),

  searchProducts: (filters: SearchFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.minPrice !== '' && filters.minPrice !== undefined)
      params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== '' && filters.maxPrice !== undefined)
      params.set('maxPrice', String(filters.maxPrice));
    if (filters.brands && filters.brands.length > 0)
      params.set('brands', filters.brands.join(','));
    if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
    if (filters.inStockOnly) params.set('inStockOnly', 'true');
    return request<Product[]>(`/products/search?${params.toString()}`);
  },
};

// ─── Order Types ──────────────────────────────────────────────────
export interface OrderItem {
  order_item_id: number;
  product_id: number;
  product_name: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  brand: string | null;
}

export interface Order {
  order_id: number;
  order_number: string;
  customer_id: number;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;       // from Deliveries table (joined in backend)
  discount_amount: number;
  total_amount: number;        // computed at runtime in backend
  order_status: string;
  delivery_status: string;     // from Deliveries table
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

export interface CheckoutRequestItem {
  id: number | string;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutRequestItem[];
  shippingAddressId?: number;  // optional — defaults to billing address in backend
}

export interface TrackingOrder {
  id: string;
  status: string;
  orderStatus?: string;
  deliveryStatus?: string;
  currentStep?: number;
  estimatedDelivery: string;
  items: number;
  total: number;
  deliveryInstructions: string;
  steps: Array<{
    label: string;
    time: string;
    completed: boolean;
  }>;
  notifications: Array<{
    time: string;
    message: string;
  }>;
}

// ─── Order API calls ─────────────────────────────────────────────
export const orderApi = {
  createOrder: async (items: CheckoutRequestItem[], shippingAddressId?: number) => {
    const res = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, shippingAddressId }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to place order');
    return json.data;
  },

  getPreviousOrders: () => request<Order[]>('/orders/me'),
  getTrackingData: () => request<TrackingOrder[]>('/orders/tracking'),
};

// ─── Bid / Product Request Types ─────────────────────────────────────────────
export interface ProductRequest {
  id: number;
  productName: string;
  description: string;
  category: string;
  quantity: number;
  maxBudget: number | null;
  status: string;
  createdAt: string;
  timeAgo: string;
  customerName: string;
  bidCount: number;
  bids: BidOffer[];
}

export interface BidOffer {
  id: number;
  storeName: string;
  storeRating: number;
  bidPrice: number;
  estimatedDeliveryDays: number | null;
  status: string;
  createdAt: string;
  linkedProductName: string | null;
  linkedProductImage: string | null;
}

export interface SubmitRequestPayload {
  productName: string;
  description?: string;
  categoryId?: number;
  quantity?: number;
  maxBudget?: number;
}

// ─── Bid API calls ────────────────────────────────────────────────────────────
export const bidApi = {
  /** Fetch all open product requests (displayed on homepage & requests page) */
  getOpenRequests: () => request<ProductRequest[]>('/bids/requests'),

  /** Fetch a single request with all its bids */
  getRequestWithBids: (requestId: number) =>
    request<ProductRequest>(`/bids/requests/${requestId}`),

  /** Customer submits a new product request */
  submitRequest: async (payload: SubmitRequestPayload) => {
    const res = await fetch(`${BASE_URL}/bids/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to submit request');
    return json.data;
  },

  /** Accept a bid on a request (customer action) */
  acceptBid: async (requestId: number, bidId: number) => {
    const res = await fetch(`${BASE_URL}/bids/requests/${requestId}/bids/${bidId}/accept`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to accept bid');
    return json.data;
  },
};

// ─── User Profile API calls ────────────────────────────────────────────────────────────
export interface UserProfile {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export const userApi = {
  getProfile: () => request<UserProfile>('/users/me'),
  updateProfile: async (profileData: UserProfile) => {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update profile');
    return json.data as UserProfile;
  },
};

