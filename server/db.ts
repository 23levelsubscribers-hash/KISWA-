import fs from 'fs';
import path from 'path';
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
} from '../src/types';

interface DatabaseSchema {
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  deals: DealBanner[];
  notifications: AppNotification[];
  admins: AdminUser[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-chicken', name: 'Fried Chicken', slug: 'fried-chicken', iconName: 'Drumstick', isActive: true, displayOrder: 1 },
  { id: 'cat-burgers', name: 'Burgers', slug: 'burgers', iconName: 'Sandwich', isActive: true, displayOrder: 2 },
  { id: 'cat-wraps', name: 'Wraps', slug: 'wraps', iconName: 'Scroll', isActive: true, displayOrder: 3 },
  { id: 'cat-sides', name: 'Sides', slug: 'sides', iconName: 'FrenchFries', isActive: true, displayOrder: 4 },
  { id: 'cat-drinks', name: 'Drinks', slug: 'drinks', iconName: 'CupSoda', isActive: true, displayOrder: 5 },
  { id: 'cat-desserts', name: 'Desserts', slug: 'desserts', iconName: 'IceCream', isActive: true, displayOrder: 6 },
  { id: 'cat-healthy', name: 'Healthy', slug: 'healthy', iconName: 'Salad', isActive: true, displayOrder: 7 },
];

const INITIAL_SETTINGS: RestaurantSettings = {
  name: 'RAJOWAL CRICKET',
  tagline: 'Crispy Flavor, Delivered Fast. Hot, crunchy & made fresh for you.',
  logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=80',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  email: 'support@kaswahfoods.com',
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
  facebookUrl: 'https://facebook.com/kaswahfastfoods',
  instagramUrl: 'https://instagram.com/kaswahfastfoods',
  tiktokUrl: 'https://tiktok.com/@kaswahfastfoods',
  googleMapsUrl: 'https://maps.google.com/?q=Kaswah+Fast+Foods'
};

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Hamza Khan (Head Manager)',
    email: 'admin@kaswah.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastLogin: new Date().toISOString()
  }
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'CRISPY20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1200,
    maxDiscount: 500,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    timesUsed: 64,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'KASWAH150',
    discountType: 'fixed',
    discountValue: 150,
    minOrderAmount: 800,
    expiryDate: '2026-12-31',
    usageLimit: 300,
    timesUsed: 112,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'FAMILY500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    expiryDate: '2026-12-31',
    usageLimit: 200,
    timesUsed: 42,
    isActive: true
  }
];

const INITIAL_DEALS: DealBanner[] = [
  {
    id: 'deal-1',
    title: 'Weekend Crunch Fiesta',
    subtitle: 'Get 20% OFF on all Signature Buckets with free loaded garlic fries!',
    description: '8 Pcs crispy fried chicken, large loaded garlic fries, 2 dinner rolls, and 2 chilled soft drinks.',
    discountText: 'SAVE 20%',
    badge: 'LIMITED TIME DEAL',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Order Bucket Now',
    targetCategory: 'cat-chicken',
    dealPrice: 1799,
    originalPrice: 2250,
    couponCode: 'CRISPY20',
    itemsIncluded: ['8 Pcs Golden Chicken', 'Large Garlic Mayo Fries', '2 Dinner Rolls', '2 Colas 350ml'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'deal-2',
    title: 'Midnight Duo Crave Pack',
    subtitle: '2 Spicy Crunch Burgers + 4 BBQ Wings + 2 Chilled Colas for just Rs. 1,490',
    description: '2 Crispy Zinger Crunch Burgers, 4 spicy BBQ wings, 1 regular fries, and 2 chilled drinks.',
    discountText: 'FLAT RS. 350 OFF',
    badge: 'CHEF SPECIAL',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Claim Offer',
    targetCategory: 'cat-burgers',
    dealPrice: 1490,
    originalPrice: 1840,
    couponCode: 'CRUNCHDUO',
    itemsIncluded: ['2 Spicy Crunch Burgers', '4 BBQ Wings', '1 Regular Fries', '2 Chilled Colas'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-bucket-8',
    name: 'Crispy Chicken Bucket (8 Pcs)',
    slug: 'crispy-chicken-bucket-8',
    description: 'Golden, extra-crispy fried chicken with tender, juicy meat infused with 11 secret Kaswah spices. Includes 2 dinner rolls, 1 regular fries and 2 garlic dips.',
    price: 1890,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-chicken',
    categoryName: 'Fried Chicken',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 20,
    calories: 1420,
    spiciness: 'Medium',
    rating: 4.9,
    ratingCount: 384,
    sectionTag: 'Signature Dishes',
    variants: [
      { id: 'v-original', name: 'Original Crispy Crust', priceDelta: 0 },
      { id: 'v-spicy', name: 'Spicy Ghost Pepper Crust', priceDelta: 50 },
      { id: 'v-half-half', name: 'Half Original / Half Spicy', priceDelta: 30 }
    ],
    extras: [
      { id: 'ex-garlic', name: 'Extra Signature Garlic Mayo Dip', price: 90 },
      { id: 'ex-cheese', name: 'Warm Melted Cheddar Dip', price: 140 },
      { id: 'ex-fries', name: 'Upsize to Large Fries', price: 120 },
      { id: 'ex-roll', name: '2 Extra Sweet Dinner Rolls', price: 110 }
    ]
  },
  {
    id: 'prod-spicy-crunch-burger',
    name: 'Spicy Crunch Zinger Burger',
    slug: 'spicy-crunch-zinger-burger',
    description: 'Thick marinated chicken thigh fillet fried to supreme crunchiness, slathered in spicy sriracha mayo, crisp iceberg lettuce and melted American cheese in a brioche bun.',
    price: 650,
    originalPrice: 750,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-burgers',
    categoryName: 'Burgers',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 780,
    spiciness: 'Hot',
    rating: 4.8,
    ratingCount: 512,
    sectionTag: 'Best Sellers',
    variants: [
      { id: 'v-single', name: 'Single Crispy Patty', priceDelta: 0 },
      { id: 'v-double', name: 'Double Patty Monster', priceDelta: 320 }
    ],
    extras: [
      { id: 'ex-cheese-slice', name: 'Extra Cheese Slice', price: 80 },
      { id: 'ex-jalapeno', name: 'Pickled Jalapenos', price: 60 },
      { id: 'ex-bacon-strip', name: 'Crispy Chicken Strip Addon', price: 160 }
    ]
  },
  {
    id: 'prod-korean-bbq-wings',
    name: 'Korean BBQ Glazed Wings (6 Pcs)',
    slug: 'korean-bbq-glazed-wings',
    description: 'Crispy wings tossed in authentic sticky sweet, savory and smoky Korean gochujang glaze, garnished with toasted sesame seeds and sliced scallions.',
    price: 790,
    originalPrice: 890,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-chicken',
    categoryName: 'Fried Chicken',
    isBestseller: false,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 640,
    spiciness: 'Medium',
    rating: 4.9,
    ratingCount: 198,
    sectionTag: 'Chef Specials',
    variants: [
      { id: 'w-6pcs', name: '6 Pieces Wings', priceDelta: 0 },
      { id: 'w-12pcs', name: '12 Pieces Wings', priceDelta: 690 }
    ],
    extras: [
      { id: 'ex-ranch', name: 'Herb Ranch Sauce Dip', price: 90 },
      { id: 'ex-extra-glaze', name: 'Extra Korean Glaze Cup', price: 80 }
    ]
  },
  {
    id: 'prod-hot-honey-chicken',
    name: 'Hot Honey Fried Chicken Tenders (5 Pcs)',
    slug: 'hot-honey-fried-chicken-tenders',
    description: 'Whole chicken breast strips coated in crunchy buttermilk batter, drizzled with homemade habanero hot honey, served with tangy honey mustard.',
    price: 720,
    originalPrice: 820,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-chicken',
    categoryName: 'Fried Chicken',
    isBestseller: true,
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 12,
    calories: 590,
    spiciness: 'Medium',
    rating: 4.7,
    ratingCount: 220,
    sectionTag: 'Chef Specials',
    variants: [
      { id: 't-5pcs', name: '5 Strips', priceDelta: 0 },
      { id: 't-8pcs', name: '8 Strips', priceDelta: 360 }
    ],
    extras: [
      { id: 'ex-hot-honey', name: 'Extra Hot Honey Drizzle', price: 90 },
      { id: 'ex-garlic-aioli', name: 'Garlic Aioli', price: 80 }
    ]
  },
  {
    id: 'prod-family-feast',
    name: 'Kaswah Mega Family Feast',
    slug: 'kaswah-mega-family-feast',
    description: 'The ultimate party bundle! 12 Pcs Golden Fried Chicken, 4 Spicy Crunch Burgers, 2 Loaded Peri-Peri Fries, 4 Dips, and 1.5L Chilled Soft Drink.',
    price: 4650,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-chicken',
    categoryName: 'Fried Chicken',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 25,
    calories: 3800,
    spiciness: 'Medium',
    rating: 4.95,
    ratingCount: 420,
    sectionTag: 'Family Bundles',
    variants: [
      { id: 'fb-standard', name: 'Classic Family Bundle', priceDelta: 0 },
      { id: 'fb-spicy-all', name: 'All Spicy Ghost Edition', priceDelta: 150 }
    ],
    extras: [
      { id: 'ex-drink-upsize', name: 'Add 2nd 1.5L Drink', price: 220 },
      { id: 'ex-churros', name: 'Add 4 Pcs Dessert Churros', price: 380 }
    ]
  },
  {
    id: 'prod-mega-bundle',
    name: 'Mega Crunch Duo Bundle',
    slug: 'mega-crunch-duo-bundle',
    description: 'Perfect for two: 2 Zinger Crunch Burgers, 4 Crispy Hot Wings, 1 Seasoned Fries, 2 Dips and 2 Soft Drinks (330ml).',
    price: 1650,
    originalPrice: 1950,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-burgers',
    categoryName: 'Burgers',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 18,
    calories: 1850,
    spiciness: 'Hot',
    rating: 4.85,
    ratingCount: 310,
    sectionTag: 'Family Bundles',
    variants: [
      { id: 'mb-coke', name: 'With Chilled Coke', priceDelta: 0 },
      { id: 'mb-sprite', name: 'With Crisp Sprite', priceDelta: 0 }
    ],
    extras: [
      { id: 'ex-loaded-cheese', name: 'Upgrade Fries to Loaded Cheese Fries', price: 180 }
    ]
  },
  {
    id: 'prod-zinger-wrap',
    name: 'Kaswah Spicy Tortilla Zinger Wrap',
    slug: 'kaswah-spicy-tortilla-zinger-wrap',
    description: 'Double crunchy chicken tenders rolled in a warm toasted flour tortilla with diced vine tomatoes, shredded cabbage, cheddar cheese sauce and smoked spicy mayo.',
    price: 590,
    originalPrice: 680,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-wraps',
    categoryName: 'Wraps',
    isBestseller: false,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    calories: 580,
    spiciness: 'Hot',
    rating: 4.75,
    ratingCount: 165,
    sectionTag: 'Signature Dishes',
    variants: [
      { id: 'w-spicy', name: 'Spicy Zinger', priceDelta: 0 },
      { id: 'w-bbq', name: 'Sweet Smoky BBQ', priceDelta: 0 }
    ],
    extras: [
      { id: 'ex-wrap-cheese', name: 'Double Melted Cheddar', price: 90 },
      { id: 'ex-wrap-fries', name: 'Small Fries Combo', price: 150 }
    ]
  },
  {
    id: 'prod-peri-fries',
    name: 'Loaded Peri-Peri Cheese Fries',
    slug: 'loaded-peri-peri-cheese-fries',
    description: 'Crispy skin-on french fries showered in fiery peri-peri seasoning, drizzled generously with warm yellow cheese sauce, crispy fried chicken bites and pickled jalapeno slices.',
    price: 480,
    originalPrice: 550,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-sides',
    categoryName: 'Sides',
    isBestseller: true,
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 620,
    spiciness: 'Medium',
    rating: 4.8,
    ratingCount: 380,
    sectionTag: 'Best Sellers',
    variants: [
      { id: 'pf-regular', name: 'Regular Loaded', priceDelta: 0 },
      { id: 'pf-monster', name: 'Monster Sharing Bowl', priceDelta: 240 }
    ],
    extras: [
      { id: 'ex-jalapenos', name: 'Extra Jalapenos', price: 50 },
      { id: 'ex-chicken-chunks', name: 'Extra Crispy Chicken Chunks', price: 150 }
    ]
  },
  {
    id: 'prod-mint-lemonade',
    name: 'Chilled Mint Margarita Fizz',
    slug: 'chilled-mint-margarita-fizz',
    description: 'Refreshing blended fresh garden mint leaves, freshly squeezed lime juice, rock salt and sparkling soda served over crushed ice.',
    price: 290,
    originalPrice: 340,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-drinks',
    categoryName: 'Drinks',
    isBestseller: false,
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 120,
    rating: 4.9,
    ratingCount: 140,
    sectionTag: 'Chef Specials',
    variants: [
      { id: 'm-500', name: '500ml Regular Cup', priceDelta: 0 },
      { id: 'm-750', name: '750ml Jumbo Cup', priceDelta: 90 }
    ],
    extras: []
  },
  {
    id: 'prod-soft-drink',
    name: 'Chilled Soft Drink (Can 330ml)',
    slug: 'chilled-soft-drink-330ml',
    description: 'Served ice cold. Choose your favorite refreshment.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-drinks',
    categoryName: 'Drinks',
    isBestseller: false,
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 2,
    calories: 140,
    rating: 4.6,
    ratingCount: 420,
    variants: [
      { id: 'sd-coke', name: 'Coca Cola Original', priceDelta: 0 },
      { id: 'sd-coke-zero', name: 'Coca Cola Zero Sugar', priceDelta: 0 },
      { id: 'sd-sprite', name: 'Sprite Lemon Lime', priceDelta: 0 },
      { id: 'sd-fanta', name: 'Fanta Orange', priceDelta: 0 }
    ],
    extras: []
  },
  {
    id: 'prod-molten-lava',
    name: 'Belgian Molten Choco Lava Cake',
    slug: 'belgian-molten-choco-lava-cake',
    description: 'Decadent dark Belgian chocolate sponge cake with an irresistible warm flowing chocolate magma heart, dusted with sweet vanilla sugar.',
    price: 520,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-desserts',
    categoryName: 'Desserts',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 480,
    rating: 4.9,
    ratingCount: 230,
    sectionTag: 'Chef Specials',
    variants: [
      { id: 'des-classic', name: 'Single Molten Cake', priceDelta: 0 }
    ],
    extras: [
      { id: 'ex-vanilla-icecream', name: 'Scoop of Gourmet Vanilla Bean Ice Cream', price: 160 }
    ]
  },
  {
    id: 'prod-healthy-bowl',
    name: 'Flame-Grilled Tender Protein Salad Bowl',
    slug: 'flame-grilled-tender-protein-salad-bowl',
    description: 'Succulent herb-rubbed grilled chicken breast slices, organic red quinoa, crisp romaine, cherry tomatoes, cucumbers, feta crumbles and lemon-olive oil dressing.',
    price: 850,
    originalPrice: 950,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-healthy',
    categoryName: 'Healthy',
    isBestseller: false,
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 390,
    rating: 4.7,
    ratingCount: 88,
    sectionTag: 'Chef Specials',
    variants: [
      { id: 'hl-grilled', name: 'Grilled Herb Chicken', priceDelta: 0 },
      { id: 'hl-spicy-grilled', name: 'Chili Lime Grilled Chicken', priceDelta: 40 }
    ],
    extras: [
      { id: 'ex-avocado', name: 'Hass Avocado Slices', price: 180 },
      { id: 'ex-boiled-egg', name: 'Organic Hard Boiled Egg', price: 60 }
    ]
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Usman Tariq',
    email: 'usman.tariq@gmail.com',
    phone: '+92 321 4455667',
    whatsapp: '+92 321 4455667',
    registeredAt: '2026-02-10T14:30:00.000Z',
    totalOrders: 6,
    totalSpend: 11450,
    favoriteProductIds: ['prod-bucket-8', 'prod-spicy-crunch-burger'],
    addresses: [
      { id: 'addr-1', label: 'Home', address: 'House 42, Street 7, Sector Y, DHA Phase 3', cityArea: 'DHA Phase 3, Lahore', isDefault: true },
      { id: 'addr-2', label: 'Office', address: 'Floor 4, Arfa Software Technology Park, Ferozepur Rd', cityArea: 'Gulberg, Lahore', isDefault: false }
    ]
  },
  {
    id: 'cust-2',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@outlook.com',
    phone: '+92 301 9988776',
    whatsapp: '+92 301 9988776',
    registeredAt: '2026-02-18T18:20:00.000Z',
    totalOrders: 4,
    totalSpend: 7800,
    favoriteProductIds: ['prod-korean-bbq-wings', 'prod-peri-fries'],
    addresses: [
      { id: 'addr-3', label: 'Home', address: 'Apartment 2B, Askari 11 Tower', cityArea: 'Askari 11, Lahore', isDefault: true }
    ]
  },
  {
    id: 'cust-3',
    name: 'Bilal Ahmad',
    email: 'customer@kaswah.com',
    phone: '+92 333 1122334',
    whatsapp: '+92 333 1122334',
    registeredAt: '2026-03-01T11:00:00.000Z',
    totalOrders: 2,
    totalSpend: 4200,
    favoriteProductIds: ['prod-family-feast', 'prod-spicy-crunch-burger'],
    addresses: [
      { id: 'addr-4', label: 'Home', address: 'Bungalow 18, Block G, Model Town', cityArea: 'Model Town, Lahore', isDefault: true }
    ]
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'KAS-7821',
    orderNumber: '7821',
    customerId: 'cust-1',
    customerName: 'Usman Tariq',
    customerPhone: '+92 321 4455667',
    customerWhatsApp: '+92 321 4455667',
    customerEmail: 'usman.tariq@gmail.com',
    deliveryAddress: 'House 42, Street 7, Sector Y, DHA Phase 3',
    cityArea: 'DHA Phase 3, Lahore',
    deliveryInstructions: 'Ring doorbell twice, please keep sauces separate.',
    orderType: 'Home Delivery',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    items: [
      {
        productId: 'prod-bucket-8',
        productName: 'Crispy Chicken Bucket (8 Pcs)',
        productImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80',
        variantName: 'Original Crispy Crust',
        extras: [{ name: 'Extra Signature Garlic Mayo Dip', price: 90 }],
        specialInstructions: 'Extra crunchy pieces please!',
        quantity: 1,
        unitPrice: 1980,
        totalPrice: 1980
      },
      {
        productId: 'prod-peri-fries',
        productName: 'Loaded Peri-Peri Cheese Fries',
        productImage: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
        variantName: 'Regular Loaded',
        extras: [],
        quantity: 1,
        unitPrice: 480,
        totalPrice: 480
      }
    ],
    subtotal: 2460,
    deliveryFee: 150,
    discountAmount: 200,
    appliedCouponCode: 'CRISPY20',
    taxAmount: 123,
    grandTotal: 2533,
    status: 'Delivered',
    statusHistory: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'Order received and verified' },
      { status: 'Preparing', timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), note: 'Frying fresh chicken in kitchen' },
      { status: 'Ready', timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(), note: 'Packed with heating insulation' },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(), note: 'Rider assigned: Ali (+92 312 9998877)' },
      { status: 'Delivered', timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), note: 'Handed to customer. Payment collected.' }
    ],
    estimatedDeliveryMinutes: 35,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1.2).toISOString()
  },
  {
    id: 'KAS-8492',
    orderNumber: '8492',
    customerId: 'cust-3',
    customerName: 'Bilal Ahmad',
    customerPhone: '+92 333 1122334',
    customerWhatsApp: '+92 333 1122334',
    customerEmail: 'customer@kaswah.com',
    deliveryAddress: 'Bungalow 18, Block G, Model Town',
    cityArea: 'Model Town, Lahore',
    deliveryInstructions: 'Call upon reaching gate',
    orderType: 'Home Delivery',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    items: [
      {
        productId: 'prod-spicy-crunch-burger',
        productName: 'Spicy Crunch Zinger Burger',
        productImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
        variantName: 'Double Patty Monster',
        extras: [{ name: 'Extra Cheese Slice', price: 80 }],
        specialInstructions: 'Extra spicy sauce inside',
        quantity: 2,
        unitPrice: 1050,
        totalPrice: 2100
      },
      {
        productId: 'prod-korean-bbq-wings',
        productName: 'Korean BBQ Glazed Wings (6 Pcs)',
        productImage: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80',
        variantName: '6 Pieces Wings',
        extras: [],
        quantity: 1,
        unitPrice: 790,
        totalPrice: 790
      }
    ],
    subtotal: 2890,
    deliveryFee: 0, // Above free delivery threshold
    discountAmount: 150,
    appliedCouponCode: 'KASWAH150',
    taxAmount: 144,
    grandTotal: 2884,
    status: 'Out for Delivery',
    statusHistory: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 0.7).toISOString(), note: 'Order accepted by manager' },
      { status: 'Preparing', timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(), note: 'Cooking in batch #4' },
      { status: 'Ready', timestamp: new Date(Date.now() - 3600000 * 0.3).toISOString(), note: 'Bagged with condiments' },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 0.1).toISOString(), note: 'Rider Farhan on Honda 125 bike' }
    ],
    estimatedDeliveryMinutes: 30,
    createdAt: new Date(Date.now() - 3600000 * 0.7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 0.1).toISOString()
  },
  {
    id: 'KAS-9104',
    orderNumber: '9104',
    customerName: 'Fatima Noor',
    customerPhone: '+92 345 8899001',
    customerWhatsApp: '+92 345 8899001',
    deliveryAddress: 'Main Counter Pickup',
    cityArea: 'Gulberg III, Lahore',
    orderType: 'Pickup',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    items: [
      {
        productId: 'prod-family-feast',
        productName: 'Kaswah Mega Family Feast',
        productImage: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop&q=80',
        variantName: 'Classic Family Bundle',
        extras: [],
        quantity: 1,
        unitPrice: 4650,
        totalPrice: 4650
      }
    ],
    subtotal: 4650,
    deliveryFee: 0,
    discountAmount: 500,
    appliedCouponCode: 'FAMILY500',
    taxAmount: 232,
    grandTotal: 4382,
    status: 'Preparing',
    statusHistory: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 900000).toISOString(), note: 'Payment slip verified' },
      { status: 'Preparing', timestamp: new Date(Date.now() - 300000).toISOString(), note: 'Chef prepping Mega Feast' }
    ],
    estimatedDeliveryMinutes: 20,
    createdAt: new Date(Date.now() - 900000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString()
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    target: 'admin',
    orderId: 'KAS-9104',
    title: 'New Pickup Order #9104',
    message: 'Fatima Noor placed a Mega Family Feast order (Rs. 4,382). Bank transfer verified.',
    type: 'order_new',
    isRead: false,
    createdAt: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 'notif-2',
    target: 'customer',
    customerId: 'cust-3',
    orderId: 'KAS-8492',
    title: 'Order Out For Delivery! 🛵',
    message: 'Rider Farhan is on the way to Bungalow 18, Block G, Model Town.',
    type: 'order_status',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 0.1).toISOString()
  }
];

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading database, seeding defaults:', err);
    }

    // Default Seed
    const initial: DatabaseSchema = {
      settings: INITIAL_SETTINGS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      coupons: INITIAL_COUPONS,
      deals: INITIAL_DEALS,
      notifications: INITIAL_NOTIFICATIONS,
      admins: INITIAL_ADMINS
    };

    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(dataToSave = this.data) {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Settings
  getSettings(): RestaurantSettings {
    return this.data.settings;
  }

  updateSettings(newSettings: Partial<RestaurantSettings>): RestaurantSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveDatabase();
    return this.data.settings;
  }

  // Categories
  getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  addCategory(categoryData: Omit<Category, 'id'>): Category {
    const id = `cat-${Date.now()}`;
    const newCategory: Category = { ...categoryData, id };
    this.data.categories.push(newCategory);
    this.saveDatabase();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.saveDatabase();
    return this.data.categories[index];
  }

  deleteCategory(id: string): boolean {
    const initialLength = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLength) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Products
  getProducts(includeInactive = false): Product[] {
    if (includeInactive) {
      return this.data.products;
    }
    return this.data.products.filter(p => p.isAvailable);
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(productData: Omit<Product, 'id'>): Product {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      rating: productData.rating || 5.0,
      ratingCount: productData.ratingCount || 1,
      variants: productData.variants || [],
      extras: productData.extras || []
    };
    this.data.products.unshift(newProduct);
    this.saveDatabase();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.saveDatabase();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLength = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLength) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): Order[] {
    return [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id.toUpperCase() === id.toUpperCase() || o.orderNumber === id);
  }

  getCustomerOrders(customerIdOrEmailOrPhone: string): Order[] {
    const query = customerIdOrEmailOrPhone.toLowerCase();
    return this.data.orders.filter(
      o =>
        (o.customerId && o.customerId.toLowerCase() === query) ||
        (o.customerEmail && o.customerEmail.toLowerCase() === query) ||
        o.customerPhone.includes(query)
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'statusHistory' | 'createdAt' | 'updatedAt'>): Order {
    const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
    const id = `KAS-${randomNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber: randomNum,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Order placed by customer. Waiting for confirmation.'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    this.data.orders.unshift(newOrder);

    // Notify Admin
    this.addNotification({
      target: 'admin',
      orderId: newOrder.id,
      title: `New Order #${newOrder.orderNumber} Received!`,
      message: `${newOrder.customerName} placed order of ${newOrder.items.length} items (${this.data.settings.currencySymbol} ${newOrder.grandTotal.toLocaleString()}).`,
      type: 'order_new',
      isRead: false
    });

    // Update coupon usage
    if (orderData.appliedCouponCode) {
      const coupon = this.data.coupons.find(c => c.code.toUpperCase() === orderData.appliedCouponCode?.toUpperCase());
      if (coupon) {
        coupon.timesUsed += 1;
      }
    }

    // Update customer stats if registered
    if (orderData.customerId) {
      const cust = this.data.customers.find(c => c.id === orderData.customerId);
      if (cust) {
        cust.totalOrders += 1;
        cust.totalSpend += newOrder.grandTotal;
      }
    }

    this.saveDatabase();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    order.status = status;
    order.updatedAt = now;
    order.statusHistory.push({
      status,
      timestamp: now,
      note: note || `Order status updated to ${status}.`
    });

    // Notify customer
    this.addNotification({
      target: 'customer',
      customerId: order.customerId,
      orderId: order.id,
      title: `Order #${order.orderNumber} is ${status}!`,
      message: note || `Your order status is now: ${status}.`,
      type: 'order_status',
      isRead: false
    });

    this.saveDatabase();
    return order;
  }

  // Customers
  getCustomers(): Customer[] {
    return this.data.customers;
  }

  getCustomerById(id: string): Customer | undefined {
    return this.data.customers.find(c => c.id === id || c.email.toLowerCase() === id.toLowerCase());
  }

  addCustomer(customerData: Omit<Customer, 'id' | 'registeredAt' | 'totalOrders' | 'totalSpend'>): Customer {
    const id = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      ...customerData,
      id,
      registeredAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpend: 0,
      favoriteProductIds: customerData.favoriteProductIds || [],
      addresses: customerData.addresses || []
    };
    this.data.customers.push(newCustomer);
    this.saveDatabase();
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.data.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.customers[index] = { ...this.data.customers[index], ...updates };
    this.saveDatabase();
    return this.data.customers[index];
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; error?: string } {
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, discount: 0, error: 'Invalid coupon code.' };
    }
    if (!coupon.isActive) {
      return { valid: false, discount: 0, error: 'This coupon is no longer active.' };
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, error: 'This coupon has expired.' };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        error: `Minimum order amount for this coupon is ${this.data.settings.currencySymbol} ${coupon.minOrderAmount}.`
      };
    }
    if (coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, discount: 0, error: 'Coupon usage limit has been reached.' };
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
  }

  addCoupon(couponData: Omit<Coupon, 'id' | 'timesUsed'>): Coupon {
    const id = `coup-${Date.now()}`;
    const newCoupon: Coupon = { ...couponData, id, timesUsed: 0 };
    this.data.coupons.push(newCoupon);
    this.saveDatabase();
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const index = this.data.coupons.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.coupons[index] = { ...this.data.coupons[index], ...updates };
    this.saveDatabase();
    return this.data.coupons[index];
  }

  deleteCoupon(id: string): boolean {
    const initial = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    if (this.data.coupons.length !== initial) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Deals
  getDeals(): DealBanner[] {
    return this.data.deals;
  }

  addDeal(dealData: Omit<DealBanner, 'id'>): DealBanner {
    const id = `deal-${Date.now()}`;
    const newDeal: DealBanner = { ...dealData, id };
    this.data.deals.push(newDeal);
    this.saveDatabase();
    return newDeal;
  }

  updateDeal(id: string, updates: Partial<DealBanner>): DealBanner | null {
    const index = this.data.deals.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.data.deals[index] = { ...this.data.deals[index], ...updates };
    this.saveDatabase();
    return this.data.deals[index];
  }

  deleteDeal(id: string): boolean {
    const initial = this.data.deals.length;
    this.data.deals = this.data.deals.filter(d => d.id !== id);
    if (this.data.deals.length !== initial) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Notifications
  getNotifications(target?: 'admin' | 'customer', customerId?: string): AppNotification[] {
    let list = this.data.notifications;
    if (target) {
      list = list.filter(n => n.target === target);
    }
    if (customerId) {
      list = list.filter(n => n.customerId === customerId || !n.customerId);
    }
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addNotification(notifData: Omit<AppNotification, 'id' | 'createdAt'>): AppNotification {
    const id = `notif-${Date.now()}`;
    const newNotif: AppNotification = {
      ...notifData,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(newNotif);
    this.saveDatabase();
    return newNotif;
  }

  markNotificationRead(id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  markAllNotificationsRead(target: 'admin' | 'customer'): void {
    this.data.notifications.forEach(n => {
      if (n.target === target) {
        n.isRead = true;
      }
    });
    this.saveDatabase();
  }

  // Reports
  getReports(): ReportSummary {
    const orders = this.data.orders;
    const completedOrders = orders.filter(o => o.status === 'Delivered');
    const totalRevenue = completedOrders.reduce((acc, o) => acc + o.grandTotal, 0);

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const todayOrdersList = orders.filter(o => o.createdAt.startsWith(todayStr));
    const todayRevenue = todayOrdersList
      .filter(o => o.status !== 'Cancelled')
      .reduce((acc, o) => acc + o.grandTotal, 0);

    const pendingOrders = orders.filter(o => ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery'].includes(o.status)).length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    // Daily revenue last 7 days
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dayKey = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      dailyMap.set(dayKey, { revenue: 0, orders: 0 });
    }

    orders.forEach(o => {
      const dayKey = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      if (dailyMap.has(dayKey)) {
        const item = dailyMap.get(dayKey)!;
        item.orders += 1;
        if (o.status !== 'Cancelled') {
          item.revenue += o.grandTotal;
        }
      }
    });

    const dailyRevenueTrend = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    }));

    // Product frequency
    const productSalesMap = new Map<string, { count: number; revenue: number; image: string }>();
    orders.forEach(o => {
      if (o.status !== 'Cancelled') {
        o.items.forEach(item => {
          const cur = productSalesMap.get(item.productName) || { count: 0, revenue: 0, image: item.productImage };
          cur.count += item.quantity;
          cur.revenue += item.totalPrice;
          productSalesMap.set(item.productName, cur);
        });
      }
    });

    const topProducts = Array.from(productSalesMap.entries())
      .map(([name, data]) => ({
        name,
        salesCount: data.count,
        revenue: data.revenue,
        image: data.image
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    // Category distribution
    const categoryCountMap = new Map<string, { count: number; revenue: number }>();
    this.data.products.forEach(p => {
      categoryCountMap.set(p.categoryName, { count: 0, revenue: 0 });
    });

    orders.forEach(o => {
      if (o.status !== 'Cancelled') {
        o.items.forEach(it => {
          const prod = this.data.products.find(p => p.id === it.productId);
          const cat = prod?.categoryName || 'Fried Chicken';
          const val = categoryCountMap.get(cat) || { count: 0, revenue: 0 };
          val.count += it.quantity;
          val.revenue += it.totalPrice;
          categoryCountMap.set(cat, val);
        });
      }
    });

    const categoryDistribution = Array.from(categoryCountMap.entries()).map(([category, val]) => ({
      category,
      count: val.count,
      revenue: val.revenue
    }));

    return {
      totalRevenue,
      todayRevenue,
      weeklyRevenue: Math.round(totalRevenue * 0.45),
      monthlyRevenue: totalRevenue,
      totalOrders: orders.length,
      todayOrders: todayOrdersList.length,
      pendingOrders,
      completedOrders: completedOrders.length,
      cancelledOrders,
      averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / (completedOrders.length || 1)) : 0,
      totalCustomers: this.data.customers.length,
      dailyRevenueTrend,
      weeklyRevenueTrend: [
        { week: 'Week 1', revenue: Math.round(totalRevenue * 0.18) },
        { week: 'Week 2', revenue: Math.round(totalRevenue * 0.24) },
        { week: 'Week 3', revenue: Math.round(totalRevenue * 0.28) },
        { week: 'Week 4', revenue: Math.round(totalRevenue * 0.30) }
      ],
      monthlyRevenueTrend: [
        { month: 'Jan', revenue: 145000 },
        { month: 'Feb', revenue: 198000 },
        { month: 'Mar', revenue: 234000 }
      ],
      topProducts,
      categoryDistribution
    };
  }

  // Reset database for clean demo testing
  resetToDefaults(): void {
    this.data = {
      settings: INITIAL_SETTINGS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      coupons: INITIAL_COUPONS,
      deals: INITIAL_DEALS,
      notifications: INITIAL_NOTIFICATIONS,
      admins: INITIAL_ADMINS
    };
    this.saveDatabase();
  }
}

export const db = new DatabaseService();
