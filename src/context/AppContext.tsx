import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Product,
  Category,
  Order,
  Customer,
  RestaurantSettings,
  DealBanner,
  CartItem,
  VariantOption,
  CartItemExtra,
  AppNotification,
  Coupon,
  OrderStatus
} from '../types';
import { api } from '../services/api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Data
  products: Product[];
  categories: Category[];
  settings: RestaurantSettings;
  deals: any[];
  orders: Order[];
  coupons: any[];
  loading: boolean;
  refreshData: () => Promise<void>;

  // Products CRUD
  createProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, updates: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Categories CRUD
  createCategory: (category: any) => Promise<void>;
  updateCategory: (id: string, updates: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Coupons CRUD
  createCoupon: (coupon: any) => Promise<void>;
  updateCoupon: (id: string, updates: any) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  // Deals CRUD
  createDeal: (deal: any) => Promise<void>;
  updateDeal: (id: string, updates: any) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;

  // Settings
  updateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<void>;

  // Orders CRUD
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => Promise<void>;
  cancelOrder: (id: string, reason?: string) => Promise<void>;
  activeOrdersCount: number;

  // Navigation & Views
  currentView: string;
  setCurrentView: (view: string) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;

  // Search & Filter
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: VariantOption,
    extras?: CartItemExtra[],
    specialInstructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  totalCartItemCount: number;

  // Orders & Tracking
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  trackOrder: (orderId: string) => void;

  // Customer Authentication
  customerUser: Customer | null;
  loginCustomer: (email: string) => Promise<boolean>;
  logoutCustomer: () => void;
  toggleFavorite: (productId: string) => Promise<void>;

  // Admin Authentication
  adminUser: { id: string; name: string; email: string; role: string } | null;
  adminToken: string | null;
  loginAdmin: (firstArg: string, secondArg?: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // Notifications
  adminNotifications: AppNotification[];
  customerNotifications: AppNotification[];
  unreadAdminCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (target: 'admin' | 'customer') => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'RAJOWAL CRICKET',
  tagline: 'Crispy Flavor, Delivered Fast. Hot, crunchy & made fresh for you.',
  logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=80',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  email: 'orders@kaswahfastfoods.com',
  address: 'Plot 18-C, Commercial Zone, Main Boulevard, Gulberg III, Lahore',
  city: 'Lahore, Pakistan',
  openingHours: '11:00 AM - 03:00 AM (Daily)',
  deliveryFee: 150,
  freeDeliveryThreshold: 2500,
  minOrderAmount: 500,
  estimatedDeliveryTime: '30-40 mins',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  taxPercentage: 5,
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  googleMapsUrl: 'https://maps.google.com'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [deals, setDeals] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Views & Filters
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kaswah_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Order Tracking
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Users
  const [customerUser, setCustomerUser] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('kaswah_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<{ id: string; name: string; email: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('kaswah_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('kaswah_admin_token') || null;
  });

  // Notifications & Toasts
  const [adminNotifications, setAdminNotifications] = useState<AppNotification[]>([]);
  const [customerNotifications, setCustomerNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('kaswah_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [cart]);

  // Toast Helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch initial data & sync
  const refreshData = useCallback(async () => {
    try {
      const [prodsRes, catsRes, setsRes, dealsRes, ordersRes, coupsRes] = await Promise.all([
        api.getProducts({ all: true }).catch(() => []),
        api.getCategories().catch(() => []),
        api.getSettings().catch(() => DEFAULT_SETTINGS),
        api.getDeals().catch(() => []),
        api.getOrders().catch(() => []),
        api.getCoupons().catch(() => [])
      ]);
      setProducts(prodsRes);
      setCategories(catsRes);
      setSettings(setsRes);
      setDeals(dealsRes);
      setOrders(ordersRes);
      setCoupons(coupsRes);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load & Polling for notifications / live sync
  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      refreshData();
      if (adminUser) {
        api.getNotifications('admin').then(setAdminNotifications).catch(() => {});
      }
      if (customerUser) {
        api.getNotifications('customer', customerUser.id).then(setCustomerNotifications).catch(() => {});
      }
    }, 6000); // 6-second polling for live sync between admin and customer

    return () => clearInterval(interval);
  }, [refreshData, adminUser, customerUser]);

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = subtotal === 0 || subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * settings.taxPercentage) / 100);
  const grandTotal = Math.max(0, taxableAmount + deliveryFee + taxAmount);
  const totalCartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cart Actions
  const addToCart = (
    product: Product,
    quantity = 1,
    variant?: VariantOption,
    extras: CartItemExtra[] = [],
    specialInstructions = ''
  ) => {
    const variantId = variant ? variant.id : 'default';
    const extrasKey = extras.map(e => e.id).sort().join('_');
    const cartItemId = `${product.id}__${variantId}__${extrasKey}__${specialInstructions.trim()}`;

    const unitPrice = product.price + (variant ? variant.priceDelta : 0) + extras.reduce((sum, e) => sum + e.price, 0);

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          product,
          selectedVariant: variant,
          selectedExtras: extras,
          specialInstructions,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    try {
      const result = await api.validateCoupon(code, subtotal);
      if (result.valid && result.coupon) {
        setAppliedCoupon({ code: result.coupon.code, discount: result.discount });
        showToast(`Coupon "${result.coupon.code}" applied! You saved ${settings.currencySymbol} ${result.discount}`, 'success');
        return { success: true, message: `Coupon applied! Saved ${settings.currencySymbol} ${result.discount}` };
      } else {
        showToast(result.error || 'Invalid coupon', 'error');
        return { success: false, message: result.error || 'Invalid coupon' };
      }
    } catch (err: any) {
      const msg = err.message || 'Error validating coupon';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Product modal
  const openProductModal = (product: Product) => {
    setSelectedProductForModal(product);
  };

  const closeProductModal = () => {
    setSelectedProductForModal(null);
  };

  // Order Tracking
  const trackOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCurrentView('tracking');
  };

  // Customer Auth
  const loginCustomer = async (email: string): Promise<boolean> => {
    try {
      const res = await api.login({ email, role: 'customer' });
      if (res.customer) {
        setCustomerUser(res.customer);
        localStorage.setItem('kaswah_customer', JSON.stringify(res.customer));
        showToast(`Welcome back, ${res.customer.name}!`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Customer login failed', 'error');
      return false;
    }
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
    localStorage.removeItem('kaswah_customer');
    showToast('Logged out of customer account', 'info');
  };

  const toggleFavorite = async (productId: string) => {
    if (!customerUser) {
      setIsAuthModalOpen(true);
      showToast('Please login to save favorite items', 'info');
      return;
    }
    const isFav = customerUser.favoriteProductIds?.includes(productId);
    const updatedFavs = isFav
      ? customerUser.favoriteProductIds.filter(id => id !== productId)
      : [...(customerUser.favoriteProductIds || []), productId];

    const updated = await api.updateCustomer(customerUser.id, { favoriteProductIds: updatedFavs });
    if (updated) {
      setCustomerUser(updated);
      localStorage.setItem('kaswah_customer', JSON.stringify(updated));
      showToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', 'success');
    }
  };

  // Admin Auth (handles both (email, password) and (password, email))
  const loginAdmin = async (firstArg: string, secondArg?: string): Promise<boolean> => {
    let email = 'admin@kaswah.com';
    let password = 'admin123';

    if (secondArg) {
      email = firstArg;
      password = secondArg;
    } else {
      if (firstArg.includes('@')) {
        email = firstArg;
      } else {
        password = firstArg;
      }
    }

    try {
      const res = await api.login({ email, password, role: 'admin' });
      if (res.success && res.user) {
        setAdminUser(res.user);
        setAdminToken(res.token);
        localStorage.setItem('kaswah_admin_user', JSON.stringify(res.user));
        localStorage.setItem('kaswah_admin_token', res.token);
        showToast(`Welcome to Admin Panel, ${res.user.name}`, 'success');
        setCurrentView('admin');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Invalid admin credentials', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('kaswah_admin_user');
    localStorage.removeItem('kaswah_admin_token');
    showToast('Admin logged out successfully', 'info');
    setCurrentView('home');
  };

  // Product CRUD
  const createProduct = async (product: any) => {
    const created = await api.addProduct(product);
    setProducts(prev => [created, ...prev]);
    showToast(`Added "${created.name}" to menu`, 'success');
  };

  const updateProduct = async (id: string, updates: any) => {
    const updated = await api.updateProduct(id, updates);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    showToast(`Updated product "${updated.name}"`, 'success');
  };

  const deleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed from menu', 'info');
  };

  // Category CRUD
  const createCategory = async (cat: any) => {
    const created = await api.addCategory(cat);
    setCategories(prev => [...prev, created]);
    showToast(`Created category "${created.name}"`, 'success');
  };

  const updateCategory = async (id: string, updates: any) => {
    const updated = await api.updateCategory(id, updates);
    setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
    showToast(`Updated category "${updated.name}"`, 'success');
  };

  const deleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted', 'info');
  };

  // Coupon CRUD
  const createCoupon = async (coupon: any) => {
    const created = await api.addCoupon(coupon);
    setCoupons(prev => [created, ...prev]);
    showToast(`Created coupon "${created.code}"`, 'success');
  };

  const updateCoupon = async (id: string, updates: any) => {
    const updated = await api.updateCoupon(id, updates);
    setCoupons(prev => prev.map(c => (c.id === id ? updated : c)));
    showToast(`Updated coupon "${updated.code}"`, 'success');
  };

  const deleteCoupon = async (id: string) => {
    await api.deleteCoupon(id);
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon removed', 'info');
  };

  // Deal CRUD
  const createDeal = async (deal: any) => {
    const created = await api.addDeal(deal);
    setDeals(prev => [created, ...prev]);
    showToast(`Created deal "${created.title}"`, 'success');
  };

  const updateDeal = async (id: string, updates: any) => {
    const updated = await api.updateDeal(id, updates);
    setDeals(prev => prev.map(d => (d.id === id ? updated : d)));
    showToast(`Updated deal "${updated.title}"`, 'success');
  };

  const deleteDeal = async (id: string) => {
    await api.deleteDeal(id);
    setDeals(prev => prev.filter(d => d.id !== id));
    showToast('Deal removed', 'info');
  };

  // Settings
  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    showToast('Restaurant settings updated', 'success');
  };

  // Order status
  const updateOrderStatus = async (id: string, status: OrderStatus, note?: string) => {
    const updated = await api.updateOrderStatus(id, status, note);
    setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
    showToast(`Order ${id} marked as ${status}`, 'success');
  };

  const cancelOrder = async (id: string, reason?: string) => {
    const updated = await api.updateOrderStatus(id, 'Cancelled', reason);
    setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
    showToast(`Order ${id} has been cancelled`, 'info');
  };

  const activeOrdersCount = orders.filter(o =>
    ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery'].includes(o.status)
  ).length;

  // Notifications
  const markNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setAdminNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    setCustomerNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = async (target: 'admin' | 'customer') => {
    await api.markAllNotificationsRead(target);
    if (target === 'admin') {
      setAdminNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } else {
      setCustomerNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const markNotificationAsRead = markNotificationRead;
  const markAllNotificationsAsRead = () => markAllNotificationsRead('admin');
  const unreadAdminCount = adminNotifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        settings,
        deals,
        orders,
        coupons,
        loading,
        refreshData,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        createDeal,
        updateDeal,
        deleteDeal,
        updateSettings,
        updateOrderStatus,
        cancelOrder,
        activeOrdersCount,
        currentView,
        setCurrentView,
        activeAdminTab,
        setActiveAdminTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        setIsAdminLoginModalOpen: setIsAdminLoginOpen,
        selectedProductForModal,
        openProductModal,
        closeProductModal,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        discountAmount,
        taxAmount,
        grandTotal,
        totalCartItemCount,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        trackingOrderId,
        setTrackingOrderId,
        trackOrder,
        customerUser,
        loginCustomer,
        logoutCustomer,
        toggleFavorite,
        adminUser,
        adminToken,
        loginAdmin,
        logoutAdmin,
        adminNotifications,
        customerNotifications,
        unreadAdminCount,
        markNotificationRead,
        markNotificationAsRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
