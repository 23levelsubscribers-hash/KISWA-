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
  ReportSummary
} from '../types';

export const INITIAL_SETTINGS: RestaurantSettings = {
  name: 'KASWAH FAST FOODS',
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

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-chicken', name: 'Fried Chicken', slug: 'fried-chicken', iconName: 'Drumstick', isActive: true, displayOrder: 1 },
  { id: 'cat-burgers', name: 'Burgers', slug: 'burgers', iconName: 'Sandwich', isActive: true, displayOrder: 2 },
  { id: 'cat-wraps', name: 'Wraps', slug: 'wraps', iconName: 'Scroll', isActive: true, displayOrder: 3 },
  { id: 'cat-sides', name: 'Sides', slug: 'sides', iconName: 'FrenchFries', isActive: true, displayOrder: 4 },
  { id: 'cat-drinks', name: 'Drinks', slug: 'drinks', iconName: 'CupSoda', isActive: true, displayOrder: 5 },
  { id: 'cat-desserts', name: 'Desserts', slug: 'desserts', iconName: 'IceCream', isActive: true, displayOrder: 6 },
  { id: 'cat-healthy', name: 'Healthy', slug: 'healthy', iconName: 'Salad', isActive: true, displayOrder: 7 }
];

export const INITIAL_PRODUCTS: Product[] = [
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
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    calories: 590,
    spiciness: 'Hot',
    rating: 4.9,
    ratingCount: 264,
    sectionTag: 'Signature Dishes',
    variants: [
      { id: 'ten-5', name: '5 Pcs Tenders', priceDelta: 0 },
      { id: 'ten-10', name: '10 Pcs Tenders', priceDelta: 650 }
    ],
    extras: [
      { id: 'ex-honey-dip', name: 'Extra Hot Honey Cup', price: 90 },
      { id: 'ex-fries-side', name: 'Side of Seasoned Fries', price: 150 }
    ]
  },
  {
    id: 'prod-smash-beef-burger',
    name: 'Kaswah Double Smashed Beef Burger',
    slug: 'kaswah-double-smashed-beef-burger',
    description: 'Two 100% pure Angus beef patties smashed crispy with caramelized onions, melted American cheddar, dill pickles and house special burger relish on toasted potato bun.',
    price: 890,
    originalPrice: 990,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-burgers',
    categoryName: 'Burgers',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 18,
    calories: 860,
    spiciness: 'Mild',
    rating: 4.9,
    ratingCount: 420,
    sectionTag: 'Signature Dishes',
    variants: [
      { id: 'smash-double', name: 'Double Patty (2x 100g)', priceDelta: 0 },
      { id: 'smash-triple', name: 'Triple Patty Beast (3x 100g)', priceDelta: 290 }
    ],
    extras: [
      { id: 'ex-beef-bacon', name: 'Crispy Beef Bacon', price: 140 },
      { id: 'ex-double-cheese', name: 'Extra Melted Cheddar Slice', price: 80 }
    ]
  },
  {
    id: 'prod-twister-wrap',
    name: 'Crispy Zesty Chicken Twister Wrap',
    slug: 'crispy-zesty-chicken-twister-wrap',
    description: 'Golden fried chicken tenders wrapped in warm toasted tortilla with diced ripe tomatoes, shredded crunchy lettuce, pepper jack cheese and garlic herb aioli.',
    price: 590,
    originalPrice: 650,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-wraps',
    categoryName: 'Wraps',
    isBestseller: false,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    calories: 520,
    spiciness: 'Medium',
    rating: 4.7,
    ratingCount: 184,
    sectionTag: 'Best Sellers',
    variants: [
      { id: 'wrap-single', name: 'Regular Wrap', priceDelta: 0 },
      { id: 'wrap-jumbo', name: 'Jumbo Size (2x Chicken)', priceDelta: 240 }
    ],
    extras: [
      { id: 'ex-guac', name: 'Avocado Guacamole Dip', price: 120 },
      { id: 'ex-jalapenos-wrap', name: 'Pickled Jalapenos', price: 50 }
    ]
  },
  {
    id: 'prod-loaded-fries',
    name: 'Kaswah Volcano Loaded Cheese Fries',
    slug: 'kaswah-volcano-loaded-cheese-fries',
    description: 'Crispy skin-on golden fries smothered in warm spiced cheddar cheese sauce, crispy fried chicken popcorn chunks, jalapenos, and chipotle mayo drizzle.',
    price: 520,
    originalPrice: 590,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-sides',
    categoryName: 'Sides',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 680,
    spiciness: 'Medium',
    rating: 4.9,
    ratingCount: 460,
    sectionTag: 'Signature Dishes',
    variants: [
      { id: 'lf-reg', name: 'Regular Loaded', priceDelta: 0 },
      { id: 'lf-party', name: 'Party Platter (Double Size)', priceDelta: 380 }
    ],
    extras: [
      { id: 'ex-extra-cheese', name: 'Extra Melted Cheddar', price: 90 },
      { id: 'ex-bacon-bits', name: 'Crispy Chicken Crunch Bits', price: 100 }
    ]
  },
  {
    id: 'prod-onion-rings',
    name: 'Beer-Battered Crisp Onion Rings (10 Pcs)',
    slug: 'beer-battered-crisp-onion-rings',
    description: 'Jumbo sweet onions cut thick and coated in light seasoned tempura batter fried until shatteringly crisp. Served with smoky BBQ dip.',
    price: 360,
    image: 'https://images.unsplash.com/photo-1639024471287-032f66e53093?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-sides',
    categoryName: 'Sides',
    isBestseller: false,
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 8,
    calories: 390,
    spiciness: 'Mild',
    rating: 4.6,
    ratingCount: 95,
    variants: [],
    extras: [
      { id: 'ex-bbq-cup', name: 'Smoky BBQ Sauce Cup', price: 60 },
      { id: 'ex-garlic-cup', name: 'Garlic Mayo Cup', price: 60 }
    ]
  },
  {
    id: 'prod-mint-margarita',
    name: 'Icy Fresh Mint Lemonade Fizz',
    slug: 'icy-fresh-mint-lemonade-fizz',
    description: 'Fresh crushed garden mint leaves, freshly squeezed Persian limes, rock salt, crushed crystal ice and sparkling soda.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-drinks',
    categoryName: 'Drinks',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
    calories: 110,
    spiciness: 'Mild',
    rating: 4.9,
    ratingCount: 310,
    sectionTag: 'Signature Dishes',
    variants: [
      { id: 'drink-reg', name: 'Regular (350ml)', priceDelta: 0 },
      { id: 'drink-large', name: 'Large Jar (500ml)', priceDelta: 80 }
    ],
    extras: []
  },
  {
    id: 'prod-choc-lava',
    name: 'Warm Belgian Molten Chocolate Lava Cake',
    slug: 'warm-belgian-molten-chocolate-lava-cake',
    description: 'Decadent dark Belgian chocolate sponge cake with an irresistible warm flowing chocolate center, dusted with powdered sugar.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    categoryId: 'cat-desserts',
    categoryName: 'Desserts',
    isBestseller: true,
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
    calories: 460,
    spiciness: 'Mild',
    rating: 4.9,
    ratingCount: 220,
    variants: [],
    extras: [
      { id: 'ex-vanilla-icecream', name: 'Scoop of Vanilla Ice Cream', price: 120 }
    ]
  }
];

export const INITIAL_DEALS: DealBanner[] = [
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

export const INITIAL_COUPONS: Coupon[] = [
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

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Hamza Khan (Head Manager)',
    email: 'admin@kaswah.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastLogin: new Date().toISOString()
  }
];
