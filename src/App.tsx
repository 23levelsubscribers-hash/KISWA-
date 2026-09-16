import React, { useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Components
import { HeroBanner } from './components/customer/HeroBanner';
import { CategoryList } from './components/customer/CategoryList';
import { SignatureDishes } from './components/customer/SignatureDishes';
import { FamilyBundles } from './components/customer/FamilyBundles';
import { ChefSpecialsAndPromo } from './components/customer/ChefSpecialsAndPromo';
import { TrackerAndRewards } from './components/customer/TrackerAndRewards';
import { ProductCard } from './components/customer/ProductCard';
import { DealsSection } from './components/customer/DealsSection';
import { CartDrawer } from './components/customer/CartDrawer';
import { ProductModal } from './components/customer/ProductModal';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderConfirmationModal } from './components/customer/OrderConfirmationModal';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { CustomerProfileView } from './components/customer/CustomerProfileView';
import { AboutContactView } from './components/customer/AboutContactView';
import { BottomNav } from './components/common/BottomNav';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

import {
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  Award,
  Zap,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    products,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    settings,
    loading
  } = useApp();

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryName?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Featured / Bestseller products
  const bestsellers = useMemo(() => {
    return products.filter(p => p.isBestseller).slice(0, 4);
  }, [products]);

  // If Admin View is chosen
  if (currentView === 'admin') {
    return (
      <>
        <ToastContainer />
        <AdminDashboard />
        <AdminLoginModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-[#ff6b00] selection:text-white">
      <ToastContainer />

      {/* Persistent Customer Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="pb-24 space-y-4 sm:space-y-6">
            {/* Hero Section with Chef & Crispy Flavor Delivered Fast */}
            <HeroBanner />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Category Tiles Row (Fried Chicken, Burgers, Wraps, Sides, Drinks, Desserts, Healthy) */}
              <CategoryList />

              {/* Signature Dishes with Bestseller Tags & Orange Quick Add (+) Buttons */}
              <SignatureDishes onViewAll={() => setCurrentView('menu')} />

              {/* Family Bundles: Family Feast & Mega Bundle */}
              <FamilyBundles onViewAll={() => setCurrentView('menu')} />

              {/* Chef Specials (Hot Honey Chicken) & WEEKEND CRUNCH FEST Promo Card */}
              <ChefSpecialsAndPromo />

              {/* Live Order Tracker & Crunch Rewards */}
              <TrackerAndRewards />

              {/* Full Menu Exploration Section */}
              <section
                id="menu-section"
                className="scroll-mt-24 space-y-6 pt-6 border-t border-[#1c1f2d]"
              >
                {/* Menu Section Title */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b00]/15 border border-[#ff6b00]/30 text-[#ff6b00] text-xs font-bold uppercase tracking-wider mb-2">
                      <Flame className="w-3.5 h-3.5" />
                      <span>All Kaswah Craveables</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
                      Full Menu Selection
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
                      Browse all fresh meals, customize crusts, choose dips and add thirst-quenching sodas.
                    </p>
                  </div>

                  {/* Inline Search in Menu Header */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search chicken, burgers..."
                      className="w-full bg-[#12141f] border border-[#232738] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Active Filter Indicators */}
                {(selectedCategory !== 'all' || searchQuery) && (
                  <div className="flex items-center justify-between text-xs text-gray-400 bg-[#12141c] p-3 rounded-xl border border-[#202332]">
                    <div>
                      Filtering: <strong className="text-white">{filteredProducts.length}</strong> items
                      {searchQuery && <span> matching "{searchQuery}"</span>}
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                      }}
                      className="text-[#ff6b00] hover:underline font-bold"
                    >
                      Reset filters
                    </button>
                  </div>
                )}

                {/* Products Grid */}
                {loading ? (
                  <div className="py-24 text-center text-gray-500">
                    <div className="w-10 h-10 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm">Loading Kaswah Crispy Specials...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-16 text-center bg-[#11131c] border border-[#202334] rounded-3xl p-8 max-w-lg mx-auto">
                    <Flame className="w-12 h-12 text-[#ff6b00]/50 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-1">No items found</h3>
                    <p className="text-xs text-gray-400 mb-4">
                      We couldn't find any dishes matching your search. Try searching for "Crispy", "Wings", or "Burger".
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-5 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold"
                    >
                      Reset Search
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>

              {/* Why Choose Kaswah Feature Cards */}
              <section className="pt-6">
                <div className="bg-gradient-to-r from-[#141624] via-[#11131d] to-[#0e1017] border border-[#23273b] rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/15 text-[#84cc16] text-xs font-bold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5" />
                      <span>The Kaswah Promise</span>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black text-white font-['Outfit']">
                      Why Food Lovers Choose Kaswah
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      We take fried chicken seriously. From antibiotic-free chicken sourcing to our proprietary 11-spice marinade, crunch is guaranteed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-[#171928] border border-[#25283d] rounded-2xl p-5 text-center space-y-2 hover:border-[#ff6b00]/40 transition">
                      <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] mx-auto flex items-center justify-center font-black">
                        <Flame className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">100% Prime Fresh Chicken</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Never frozen. Hand-trimmed daily, soaked in spiced buttermilk, and coated in golden crust.
                      </p>
                    </div>

                    <div className="bg-[#171928] border border-[#25283d] rounded-2xl p-5 text-center space-y-2 hover:border-[#84cc16]/40 transition">
                      <div className="w-12 h-12 rounded-xl bg-[#84cc16]/15 text-[#84cc16] mx-auto flex items-center justify-center font-black">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">30-Min Fast Delivery</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Dispatched in thermal insulated packs so your chicken arrives steaming hot and crackling.
                      </p>
                    </div>

                    <div className="bg-[#171928] border border-[#25283d] rounded-2xl p-5 text-center space-y-2 hover:border-[#ff6b00]/40 transition">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 mx-auto flex items-center justify-center font-black">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">100% Halal & Clean Kitchen</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Strict hygiene protocols, trans-fat free oils, and pure ingredients for family peace of mind.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* MENU VIEW */}
        {currentView === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header */}
            <div className="border-b border-[#1f2231] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
                  Kaswah Fast Foods Menu
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Hand-crafted chicken meals, juicy smash burgers, and delicious sides.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search full menu..."
                  className="w-full bg-[#12141f] border border-[#232738] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <CategoryList />

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* DEALS VIEW */}
        {currentView === 'deals' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <DealsSection />
          </div>
        )}

        {/* ABOUT VIEW */}
        {currentView === 'about' && <AboutContactView />}

        {/* CONTACT VIEW */}
        {currentView === 'contact' && <AboutContactView />}

        {/* ORDER TRACKING VIEW */}
        {currentView === 'tracking' && <OrderTrackingView />}

        {/* CHECKOUT VIEW */}
        {currentView === 'checkout' && <CheckoutModal />}

        {/* CONFIRMATION VIEW */}
        {currentView === 'confirmation' && <OrderConfirmationModal />}

        {/* CUSTOMER PROFILE VIEW */}
        {currentView === 'profile' && <CustomerProfileView />}
      </main>

      {/* Customer Footer */}
      <Footer />

      {/* Persistent Bottom Mobile Navigation Matching the Screenshot */}
      <BottomNav />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <ProductModal />
      <CustomerAuthModal />
      <AdminLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
