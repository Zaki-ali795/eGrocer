// src/app/services/api.ts
const API_BASE_URL = '/api';

export function getLoggedInSellerId(): number | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.user_id || user.id;
  } catch (e) {
    return null;
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API error' }));
    throw new Error(error.message || 'Something went wrong');
  }

  const result = await response.json();
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  return result;
}

export const sellerApi = {
  getRequests: () => fetchApi('/sellers/requests'),
  submitBid: (bidData: any) => fetchApi('/sellers/bid', {
    method: 'POST',
    body: JSON.stringify(bidData),
  }),
  getBids: (sellerId: number) => fetchApi(`/sellers/bids/${sellerId}`),
  getProfile: (sellerId: number) => fetchApi(`/sellers/profile/${sellerId}`),
  getProducts: (sellerId: number) => fetchApi(`/sellers/products/${sellerId}`),
  updateInventory: (productId: number, quantity: number) => fetchApi('/sellers/inventory', {
    method: 'PATCH',
    body: JSON.stringify({ productId, quantity }),
  }),
  getStats: (sellerId: number) => fetchApi(`/sellers/stats/${sellerId}`),
  getSalesHistory: (sellerId: number) => fetchApi(`/sellers/stats/history/${sellerId}`),
  getOrders: (sellerId: number) => fetchApi(`/sellers/orders/${sellerId}`),
  addProduct: (productData: any) => fetchApi('/sellers/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  updateProduct: (productId: number, productData: any) => fetchApi(`/sellers/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  deleteProduct: (productId: number) => fetchApi(`/sellers/products/${productId}`, {
    method: 'DELETE',
  }),
  getPromotions: (sellerId: number) => fetchApi(`/sellers/promotions/${sellerId}`),
  createPromotion: (promoData: any) => fetchApi('/sellers/promotions', {
    method: 'POST',
    body: JSON.stringify(promoData),
  }),
  deletePromotion: (dealId: number) => fetchApi(`/sellers/promotions/${dealId}`, {
    method: 'DELETE'
  }),
  updateOrderStatus: (orderId: number, status: string) => fetchApi('/sellers/orders/status', {
    method: 'PATCH',
    body: JSON.stringify({ orderId, status })
  }),
  updateProfile: (sellerId: number, profileData: any) => fetchApi(`/sellers/profile/${sellerId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),
  getCategories: () => fetchApi('/sellers/categories'),
  getEarnings: (sellerId: number) => fetchApi(`/sellers/earnings/${sellerId}`),
};
