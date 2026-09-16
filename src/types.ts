export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'Bank Transfer' | 'Online Payment';

export type OrderType = 'Home Delivery' | 'Pickup';

export interface ExtraOption {
  id: string;
  name: string;
  price: number; // in PKR
}

export interface VariantOption {
  id: string;
  name: string; // e.g., "Regular", "Large", "Spicy", "Extra Crispy"
  priceDelta: number; // additional price in PKR
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: string;
  categoryName: string;
  isBestseller: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  calories?: number;
  spiciness?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  variants: VariantOption[];
  extras: ExtraOption[];
  rating: number;
  ratingCount: number;
  sectionTag?: 'Signature Dishes' | 'Family Bundles' | 'Chef Specials' | 'Best Sellers' | 'Deals & Promotions';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  order?: number;
}

export interface CartItemExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique item id including variant & extras
  product: Product;
  selectedVariant?: VariantOption;
  selectedExtras: CartItemExtra[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g., 20% or 150 PKR
  minOrderAmount: number;
  minOrderValue?: number;
  description?: string;
  maxDiscount?: number;
  expiryDate: string; // YYYY-MM-DD
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface DealBanner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  discountText?: string;
  badge?: string;
  image: string;
  buttonText?: string;
  targetCategory?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  dealPrice?: number;
  originalPrice?: number;
  couponCode?: string;
  itemsIncluded?: string[];
}

export interface OrderItemRecord {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  extras: { name: string; price: number }[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string; // e.g. "KAS-8492"
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerWhatsApp: string;
  customerEmail?: string;
  deliveryAddress: string;
  cityArea: string;
  deliveryInstructions?: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  appliedCouponCode?: string;
  taxAmount: number;
  grandTotal: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  addresses: {
    id: string;
    label: string; // "Home", "Office"
    address: string;
    cityArea: string;
    isDefault: boolean;
  }[];
  favoriteProductIds: string[];
  registeredAt: string;
  createdAt?: string;
  totalOrders: number;
  totalSpend: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Branch Manager' | 'Kitchen Staff';
  avatar?: string;
  lastLogin?: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  logo: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  openingTime?: string;
  closingTime?: string;
  isOpen?: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderForFreeDelivery?: number;
  minOrderAmount: number;
  estimatedDeliveryTime: string; // e.g., "30-40 mins"
  currency: string; // "PKR"
  currencySymbol: string; // "Rs."
  taxPercentage: number;
  taxRatePercent?: number;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  googleMapsUrl: string;
}

export interface AppNotification {
  id: string;
  target: 'admin' | 'customer';
  customerId?: string;
  orderId?: string;
  title: string;
  message: string;
  type: 'order_new' | 'order_status' | 'promo' | 'alert';
  isRead: boolean;
  read?: boolean;
  createdAt: string;
}

export interface ReportSummary {
  totalRevenue: number;
  totalSales?: number;
  todayRevenue: number;
  todaySales?: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  totalOrdersCount?: number;
  todayOrders: number;
  pendingOrders: number;
  activeOrders?: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  dailyRevenue?: number;
  dailyRevenueTrend: { date: string; revenue: number; orders: number }[];
  salesChartData?: { date: string; day?: string; sales: number; orders: number }[];
  weeklyRevenueTrend: { week: string; revenue: number }[];
  monthlyRevenueTrend: { month: string; revenue: number }[];
  topProducts: { name: string; salesCount: number; quantity?: number; revenue: number; image: string }[];
  categoryDistribution: { category: string; count: number; revenue: number }[];
}

export type Deal = DealBanner;
export type ProductExtra = ExtraOption;
export type ReportsData = ReportSummary;
export type DashboardStats = ReportSummary;
