import {
  Product,
  Category,
  Order,
  Customer,
  Coupon,
  DealBanner,
  RestaurantSettings,
  AppNotification,
  AdminUser,
  ReportSummary,
  OrderStatus
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DEALS,
  INITIAL_COUPONS,
  INITIAL_ADMINS
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'kaswah_db_settings',
  CATEGORIES: 'kaswah_db_categories',
  PRODUCTS: 'kaswah_db_products',
  ORDERS: 'kaswah_db_orders',
  CUSTOMERS: 'kaswah_db_customers',
  COUPONS: 'kaswah_db_coupons',
  DEALS: 'kaswah_db_deals',
  NOTIFICATIONS: 'kaswah_db_notifications',
  ADMINS: 'kaswah_db_admins'
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

export const localStore = {
  getSettings: (): RestaurantSettings => {
    return getItem<RestaurantSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  updateSettings: (updates: Partial<RestaurantSettings>): RestaurantSettings => {
    const current = localStore.getSettings();
    const updated = { ...current, ...updates };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  getCategories: (): Category[] => {
    return getItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  addCategory: (cat: Omit<Category, 'id'>): Category => {
    const categories = localStore.getCategories();
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`
    };
    categories.push(newCat);
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },
  updateCategory: (id: string, updates: Partial<Category>): Category => {
    const categories = localStore.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories[index] = { ...categories[index], ...updates };
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  },
  deleteCategory: (id: string): { success: boolean } => {
    let categories = localStore.getCategories();
    categories = categories.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CATEGORIES, categories);
    return { success: true };
  },

  getProducts: (params?: { category?: string; search?: string; all?: boolean }): Product[] => {
    let prods = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!params?.all) {
      prods = prods.filter(p => p.isAvailable);
    }
    if (params?.category && params.category !== 'all') {
      prods = prods.filter(p => p.categoryId === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return prods;
  },
  getProductById: (id: string): Product => {
    const prods = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const prod = prods.find(p => p.id === id);
    if (!prod) throw new Error('Product not found');
    return prod;
  },
  addProduct: (product: Omit<Product, 'id'>): Product => {
    const prods = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    prods.unshift(newProd);
    setItem(STORAGE_KEYS.PRODUCTS, prods);
    return newProd;
  },
  updateProduct: (id: string, updates: Partial<Product>): Product => {
    const prods = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = prods.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    prods[index] = { ...prods[index], ...updates };
    setItem(STORAGE_KEYS.PRODUCTS, prods);
    return prods[index];
  },
  deleteProduct: (id: string): { success: boolean } => {
    let prods = getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    prods = prods.filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PRODUCTS, prods);
    return { success: true };
  },

  getOrders: (params?: { status?: string; customerId?: string; search?: string }): Order[] => {
    let orders = getItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    if (params?.status) {
      orders = orders.filter(o => o.status.toLowerCase() === params.status?.toLowerCase());
    }
    if (params?.customerId) {
      orders = orders.filter(o => o.customerId === params.customerId);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return orders;
  },
  getOrderById: (id: string): Order => {
    const orders = localStore.getOrders();
    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) throw new Error('Order not found');
    return order;
  },
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'statusHistory' | 'createdAt' | 'updatedAt'>): Order => {
    const orders = getItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const now = new Date().toISOString();
    const orderNumber = `KW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Order placed by customer via web'
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    orders.unshift(newOrder);
    setItem(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },
  updateOrderStatus: (id: string, status: OrderStatus, note?: string): Order => {
    const orders = getItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (index === -1) throw new Error('Order not found');
    const now = new Date().toISOString();
    orders[index].status = status;
    orders[index].updatedAt = now;
    orders[index].statusHistory.push({
      status,
      timestamp: now,
      note: note || `Status updated to ${status}`
    });
    setItem(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  getCustomers: (): Customer[] => {
    return getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  },
  getCustomerById: (id: string): Customer => {
    const customers = localStore.getCustomers();
    const customer = customers.find(c => c.id === id || c.email === id);
    if (!customer) throw new Error('Customer not found');
    return customer;
  },
  createCustomer: (customer: Omit<Customer, 'id' | 'registeredAt' | 'totalOrders' | 'totalSpend'>): Customer => {
    const customers = localStore.getCustomers();
    const existing = customers.find(c => c.email.toLowerCase() === customer.email.toLowerCase());
    if (existing) return existing;
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpend: 0
    };
    customers.push(newCustomer);
    setItem(STORAGE_KEYS.CUSTOMERS, customers);
    return newCustomer;
  },
  updateCustomer: (id: string, updates: Partial<Customer>): Customer => {
    const customers = localStore.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    customers[index] = { ...customers[index], ...updates };
    setItem(STORAGE_KEYS.CUSTOMERS, customers);
    return customers[index];
  },
  getCustomerOrders: (id: string): Order[] => {
    return localStore.getOrders({ customerId: id });
  },

  getCoupons: (): Coupon[] => {
    return getItem<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },
  validateCoupon: (code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; error?: string } => {
    const coupons = localStore.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, error: 'Invalid or inactive coupon code' };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        error: `Minimum order amount of Rs. ${coupon.minOrderAmount} required`
      };
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
    return { valid: true, coupon, discount };
  },
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>): Coupon => {
    const coupons = localStore.getCoupons();
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      timesUsed: 0
    };
    coupons.push(newCoupon);
    setItem(STORAGE_KEYS.COUPONS, coupons);
    return newCoupon;
  },
  updateCoupon: (id: string, updates: Partial<Coupon>): Coupon => {
    const coupons = localStore.getCoupons();
    const index = coupons.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Coupon not found');
    coupons[index] = { ...coupons[index], ...updates };
    setItem(STORAGE_KEYS.COUPONS, coupons);
    return coupons[index];
  },
  deleteCoupon: (id: string): { success: boolean } => {
    let coupons = localStore.getCoupons();
    coupons = coupons.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.COUPONS, coupons);
    return { success: true };
  },

  getDeals: (): DealBanner[] => {
    return getItem<DealBanner[]>(STORAGE_KEYS.DEALS, INITIAL_DEALS);
  },
  addDeal: (deal: Omit<DealBanner, 'id'>): DealBanner => {
    const deals = localStore.getDeals();
    const newDeal: DealBanner = {
      ...deal,
      id: `deal-${Date.now()}`
    };
    deals.push(newDeal);
    setItem(STORAGE_KEYS.DEALS, deals);
    return newDeal;
  },
  updateDeal: (id: string, updates: Partial<DealBanner>): DealBanner => {
    const deals = localStore.getDeals();
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    deals[index] = { ...deals[index], ...updates };
    setItem(STORAGE_KEYS.DEALS, deals);
    return deals[index];
  },
  deleteDeal: (id: string): { success: boolean } => {
    let deals = localStore.getDeals();
    deals = deals.filter(d => d.id !== id);
    setItem(STORAGE_KEYS.DEALS, deals);
    return { success: true };
  },

  getNotifications: (target?: 'admin' | 'customer', customerId?: string): AppNotification[] => {
    let notes = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        title: 'Welcome to Kaswah Fast Foods!',
        message: 'Get 20% off on your first order using code CRISPY20',
        target: 'customer',
        type: 'promo',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        title: 'Order Tracking Active',
        message: 'You can track orders live with preparation stages.',
        target: 'customer',
        type: 'order_status',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ]);
    if (target) {
      notes = notes.filter(n => n.target === target);
    }
    if (customerId) {
      notes = notes.filter(n => !n.customerId || n.customerId === customerId);
    }
    return notes;
  },
  markNotificationRead: (id: string): { success: boolean } => {
    const notes = localStore.getNotifications();
    const index = notes.findIndex(n => n.id === id);
    if (index > -1) {
      notes[index].isRead = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, notes);
    }
    return { success: true };
  },
  markAllNotificationsRead: (target: 'admin' | 'customer'): { success: boolean } => {
    const notes = localStore.getNotifications();
    notes.forEach(n => {
      if (n.target === target) {
        n.isRead = true;
      }
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, notes);
    return { success: true };
  },

  getReports: (): ReportSummary => {
    const orders = localStore.getOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.grandTotal : 0), 0);
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
    const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;
    const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

    return {
      totalRevenue: totalRevenue || 345200,
      todayRevenue: 24800,
      weeklyRevenue: 142000,
      monthlyRevenue: 580000,
      totalOrders: orders.length || 184,
      todayOrders: 14,
      pendingOrders: pendingCount || 6,
      completedOrders: deliveredCount || 172,
      cancelledOrders: cancelledCount || 6,
      averageOrderValue: Math.round(totalRevenue / (orders.length || 1)) || 1876,
      totalCustomers: 89,
      dailyRevenueTrend: [
        { date: 'Mon', revenue: 42000, orders: 24 },
        { date: 'Tue', revenue: 38500, orders: 21 },
        { date: 'Wed', revenue: 51200, orders: 28 },
        { date: 'Thu', revenue: 49000, orders: 26 },
        { date: 'Fri', revenue: 68400, orders: 38 },
        { date: 'Sat', revenue: 76000, orders: 42 },
        { date: 'Sun', revenue: 71000, orders: 39 }
      ],
      weeklyRevenueTrend: [
        { week: 'W1', revenue: 120000 },
        { week: 'W2', revenue: 135000 },
        { week: 'W3', revenue: 154000 },
        { week: 'W4', revenue: 171000 }
      ],
      monthlyRevenueTrend: [
        { month: 'Jan', revenue: 450000 },
        { month: 'Feb', revenue: 510000 },
        { month: 'Mar', revenue: 580000 }
      ],
      topProducts: [
        { name: 'Crispy Chicken Bucket (8 Pcs)', salesCount: 98, revenue: 185220, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200' },
        { name: 'Spicy Crunch Zinger Burger', salesCount: 142, revenue: 92300, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
        { name: 'Hot Honey Chicken Tenders', salesCount: 86, revenue: 61920, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200' }
      ],
      categoryDistribution: [
        { category: 'Fried Chicken', count: 240, revenue: 320000 },
        { category: 'Burgers', count: 180, revenue: 135000 },
        { category: 'Sides', count: 150, revenue: 78000 },
        { category: 'Drinks', count: 210, revenue: 42000 }
      ]
    };
  },

  login: (payload: { email: string; password?: string; role: 'admin' | 'customer' }) => {
    if (payload.role === 'admin') {
      const admins = getItem<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
      const admin = admins.find(a => a.email.toLowerCase() === payload.email.toLowerCase()) || {
        id: 'admin-1',
        name: 'Manager',
        email: payload.email,
        role: 'Super Admin' as const,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lastLogin: new Date().toISOString()
      };
      return {
        success: true,
        user: admin,
        token: `mock-token-${Date.now()}`,
        message: 'Admin authenticated successfully'
      };
    } else {
      const customers = localStore.getCustomers();
      let customer = customers.find(c => c.email.toLowerCase() === payload.email.toLowerCase());
      if (!customer) {
        customer = localStore.createCustomer({
          name: payload.email.split('@')[0],
          email: payload.email,
          phone: '+92 300 0000000',
          addresses: [],
          favoriteProductIds: []
        });
      }
      return {
        success: true,
        customer,
        token: `cust-token-${Date.now()}`,
        message: 'Customer signed in successfully'
      };
    }
  },

  resetDemoData: () => {
    setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    setItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setItem(STORAGE_KEYS.DEALS, INITIAL_DEALS);
    setItem(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    setItem(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    setItem(STORAGE_KEYS.ORDERS, []);
    return { success: true, message: 'Demo data reset successfully' };
  }
};
