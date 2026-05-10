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

  // Write Operations
  createProduct: (data: any) => fetchApi('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => fetchApi(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => fetchApi(`/admin/products/${id}`, { method: 'DELETE' }),

  createCategory: (data: any) => fetchApi('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => fetchApi(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetchApi(`/admin/categories/${id}`, { method: 'DELETE' }),

  updateOrderStatus: (id: string, status: string) => fetchApi(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  adjustStock: (id: string, quantity: number) => fetchApi(`/admin/inventory/${id}/adjust`, { method: 'PUT', body: JSON.stringify({ quantity }) }),

  createFlashDeal: (data: any) => fetchApi('/admin/flash-deals', { method: 'POST', body: JSON.stringify(data) }),
  endFlashDeal: (id: string) => fetchApi(`/admin/flash-deals/${id}/end`, { method: 'PUT' }),

  createPromotion: (data: any) => fetchApi('/admin/promotions', { method: 'POST', body: JSON.stringify(data) }),
  deletePromotion: (id: string) => fetchApi(`/admin/promotions/${id}`, { method: 'DELETE' }),

  toggleUserStatus: (id: string, isActive: boolean) => fetchApi(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive }) }),
  updateSettings: (data: any) => fetchApi('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getNotifications: () => fetchApi('/admin/notifications'),
  markNotificationAsRead: (id: string) => fetchApi(`/admin/notifications/${id}/read`, { method: 'PUT' }),
};
