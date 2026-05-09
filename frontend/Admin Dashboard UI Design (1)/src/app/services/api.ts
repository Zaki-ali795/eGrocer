// src/app/services/api.ts
const API_BASE_URL = '/api';

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

export const adminApi = {
  getDashboardOverview: () => fetchApi('/admin/dashboard/overview'),
  getUsers: () => fetchApi('/admin/users'),
  getCategories: () => fetchApi('/admin/categories'),
  getProducts: () => fetchApi('/admin/products'),
  getOrders: () => fetchApi('/admin/orders'),
  getFlashDeals: () => fetchApi('/admin/flash-deals'),
  getInventory: () => fetchApi('/admin/inventory'),
  getPromotions: () => fetchApi('/admin/promotions'),
  getPayments: () => fetchApi('/admin/payments'),
  getProductRequests: () => fetchApi('/admin/product-requests'),
};
