import {
  Product,
  Category,
  Order,
  Customer,
  Coupon,
  DealBanner,
  RestaurantSettings,
  AppNotification,
  ReportSummary,
  OrderStatus
} from '../types';
import { localStore } from './localStore';

const BASE_URL = '/api';
let isBackendUnavailable: boolean | null = null;

async function tryFetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  // If we already detected that backend server is not available (e.g. GitHub Pages static host), throw directly
  if (isBackendUnavailable === true) {
    throw new Error('Backend not available in static host mode');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Check if the response is actually JSON and not an HTML 404 page from GitHub Pages or static host
    const contentType = response.headers.get('content-type');
    if (!response.ok || (contentType && !contentType.includes('application/json'))) {
      if (response.status === 404) {
        isBackendUnavailable = true;
      }
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    isBackendUnavailable = false;
    return data;
  } catch (err) {
    // If running on static host like GitHub Pages, mark backend as unavailable
    if (typeof window !== 'undefined' && (window.location.hostname.includes('github.io') || isBackendUnavailable === null)) {
      isBackendUnavailable = true;
    }
    throw err;
  }
}

export const api = {
  // Settings
  getSettings: async (): Promise<RestaurantSettings> => {
    try {
      return await tryFetchJson<RestaurantSettings>(`${BASE_URL}/settings`);
    } catch {
      return localStore.getSettings();
    }
  },
  updateSettings: async (settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> => {
    try {
      return await tryFetchJson<RestaurantSettings>(`${BASE_URL}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch {
      return localStore.updateSettings(settings);
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      return await tryFetchJson<Category[]>(`${BASE_URL}/categories`);
    } catch {
      return localStore.getCategories();
    }
  },
  addCategory: async (cat: Omit<Category, 'id'>): Promise<Category> => {
    try {
      return await tryFetchJson<Category>(`${BASE_URL}/categories`, {
        method: 'POST',
        body: JSON.stringify(cat),
      });
    } catch {
      return localStore.addCategory(cat);
    }
  },
  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    try {
      return await tryFetchJson<Category>(`${BASE_URL}/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return localStore.updateCategory(id, updates);
    }
  },
  deleteCategory: async (id: string): Promise<{ success: boolean }> => {
    try {
      return await tryFetchJson<{ success: boolean }>(`${BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return localStore.deleteCategory(id);
    }
  },

  // Products
  getProducts: async (params?: { category?: string; search?: string; all?: boolean }): Promise<Product[]> => {
    try {
      const sp = new URLSearchParams();
      if (params?.category) sp.append('category', params.category);
      if (params?.search) sp.append('search', params.search);
      if (params?.all) sp.append('all', 'true');
      return await tryFetchJson<Product[]>(`${BASE_URL}/products?${sp.toString()}`);
    } catch {
      return localStore.getProducts(params);
    }
  },
  getProductById: async (id: string): Promise<Product> => {
    try {
      return await tryFetchJson<Product>(`${BASE_URL}/products/${id}`);
    } catch {
      return localStore.getProductById(id);
    }
  },
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      return await tryFetchJson<Product>(`${BASE_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(product),
      });
    } catch {
      return localStore.addProduct(product);
    }
  },
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      return await tryFetchJson<Product>(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return localStore.updateProduct(id, updates);
    }
  },
  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    try {
      return await tryFetchJson<{ success: boolean }>(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return localStore.deleteProduct(id);
    }
  },

  // Orders
  getOrders: async (params?: { status?: string; customerId?: string; search?: string }): Promise<Order[]> => {
    try {
      const sp = new URLSearchParams();
      if (params?.status) sp.append('status', params.status);
      if (params?.customerId) sp.append('customerId', params.customerId);
      if (params?.search) sp.append('search', params.search);
      return await tryFetchJson<Order[]>(`${BASE_URL}/orders?${sp.toString()}`);
    } catch {
      return localStore.getOrders(params);
    }
  },
  getOrderById: async (id: string): Promise<Order> => {
    try {
      return await tryFetchJson<Order>(`${BASE_URL}/orders/${id}`);
    } catch {
      return localStore.getOrderById(id);
    }
  },
  createOrder: async (order: Omit<Order, 'id' | 'orderNumber' | 'statusHistory' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    try {
      return await tryFetchJson<Order>(`${BASE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify(order),
      });
    } catch {
      return localStore.createOrder(order);
    }
  },
  updateOrderStatus: async (id: string, status: OrderStatus, note?: string): Promise<Order> => {
    try {
      return await tryFetchJson<Order>(`${BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    } catch {
      return localStore.updateOrderStatus(id, status, note);
    }
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    try {
      return await tryFetchJson<Customer[]>(`${BASE_URL}/customers`);
    } catch {
      return localStore.getCustomers();
    }
  },
  getCustomerById: async (id: string): Promise<Customer> => {
    try {
      return await tryFetchJson<Customer>(`${BASE_URL}/customers/${id}`);
    } catch {
      return localStore.getCustomerById(id);
    }
  },
  createCustomer: async (customer: Omit<Customer, 'id' | 'registeredAt' | 'totalOrders' | 'totalSpend'>): Promise<Customer> => {
    try {
      return await tryFetchJson<Customer>(`${BASE_URL}/customers`, {
        method: 'POST',
        body: JSON.stringify(customer),
      });
    } catch {
      return localStore.createCustomer(customer);
    }
  },
  updateCustomer: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    try {
      return await tryFetchJson<Customer>(`${BASE_URL}/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return localStore.updateCustomer(id, updates);
    }
  },
  getCustomerOrders: async (id: string): Promise<Order[]> => {
    try {
      return await tryFetchJson<Order[]>(`${BASE_URL}/customers/${id}/orders`);
    } catch {
      return localStore.getCustomerOrders(id);
    }
  },

  // Coupons
  getCoupons: async (): Promise<Coupon[]> => {
    try {
      return await tryFetchJson<Coupon[]>(`${BASE_URL}/coupons`);
    } catch {
      return localStore.getCoupons();
    }
  },
  validateCoupon: async (code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; discount: number; error?: string }> => {
    try {
      return await tryFetchJson<{ valid: boolean; coupon?: Coupon; discount: number; error?: string }>(`${BASE_URL}/coupons/validate`, {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      });
    } catch {
      return localStore.validateCoupon(code, subtotal);
    }
  },
  addCoupon: async (coupon: Omit<Coupon, 'id' | 'timesUsed'>): Promise<Coupon> => {
    try {
      return await tryFetchJson<Coupon>(`${BASE_URL}/coupons`, {
        method: 'POST',
        body: JSON.stringify(coupon),
      });
    } catch {
      return localStore.addCoupon(coupon);
    }
  },
  updateCoupon: async (id: string, updates: Partial<Coupon>): Promise<Coupon> => {
    try {
      return await tryFetchJson<Coupon>(`${BASE_URL}/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return localStore.updateCoupon(id, updates);
    }
  },
  deleteCoupon: async (id: string): Promise<{ success: boolean }> => {
    try {
      return await tryFetchJson<{ success: boolean }>(`${BASE_URL}/coupons/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return localStore.deleteCoupon(id);
    }
  },

  // Deals
  getDeals: async (): Promise<DealBanner[]> => {
    try {
      return await tryFetchJson<DealBanner[]>(`${BASE_URL}/deals`);
    } catch {
      return localStore.getDeals();
    }
  },
  addDeal: async (deal: Omit<DealBanner, 'id'>): Promise<DealBanner> => {
    try {
      return await tryFetchJson<DealBanner>(`${BASE_URL}/deals`, {
        method: 'POST',
        body: JSON.stringify(deal),
      });
    } catch {
      return localStore.addDeal(deal);
    }
  },
  updateDeal: async (id: string, updates: Partial<DealBanner>): Promise<DealBanner> => {
    try {
      return await tryFetchJson<DealBanner>(`${BASE_URL}/deals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return localStore.updateDeal(id, updates);
    }
  },
  deleteDeal: async (id: string): Promise<{ success: boolean }> => {
    try {
      return await tryFetchJson<{ success: boolean }>(`${BASE_URL}/deals/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return localStore.deleteDeal(id);
    }
  },

  // Notifications
  getNotifications: async (target?: 'admin' | 'customer', customerId?: string): Promise<AppNotification[]> => {
    try {
      const sp = new URLSearchParams();
      if (target) sp.append('target', target);
      if (customerId) sp.append('customerId', customerId);
      return await tryFetchJson<AppNotification[]>(`${BASE_URL}/notifications?${sp.toString()}`);
    } catch {
      return localStore.getNotifications(target, customerId);
    }
  },
  markNotificationRead: async (id: string): Promise<{ success: boolean }> => {
    try {
      return await tryFetchJson<{ success: boolean }>(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
      });
    } catch {
      return localStore.markNotificationRead(id);
    }
  },
  markAllNotificationsRead: async (target: 'admin' | 'customer'): Promise<{ success: boolean }> => {
    try {
      return await tryFetchJson<{ success: boolean }>(`${BASE_URL}/notifications/read-all`, {
        method: 'POST',
        body: JSON.stringify({ target }),
      });
    } catch {
      return localStore.markAllNotificationsRead(target);
    }
  },

  // Reports
  getReports: async (): Promise<ReportSummary> => {
    try {
      return await tryFetchJson<ReportSummary>(`${BASE_URL}/reports`);
    } catch {
      return localStore.getReports();
    }
  },
  getDashboardStats: async (): Promise<ReportSummary> => {
    try {
      return await tryFetchJson<ReportSummary>(`${BASE_URL}/reports`);
    } catch {
      return localStore.getReports();
    }
  },

  // Auth
  login: async (payload: { email: string; password?: string; role: 'admin' | 'customer' }) => {
    try {
      return await tryFetchJson<{ success: boolean; user?: any; customer?: Customer; token: string; message?: string }>(
        `${BASE_URL}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
    } catch {
      return localStore.login(payload);
    }
  },

  // Reset Demo
  resetDemoData: async (): Promise<{ success: boolean; message: string }> => {
    try {
      return await tryFetchJson<{ success: boolean; message: string }>(`${BASE_URL}/reset-demo`, {
        method: 'POST',
      });
    } catch {
      return localStore.resetDemoData();
    }
  },
};
