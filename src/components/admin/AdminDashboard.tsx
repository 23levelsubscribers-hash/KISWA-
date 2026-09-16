import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AdminOverview } from './AdminOverview';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminCustomers } from './AdminCustomers';
import { AdminCoupons } from './AdminCoupons';
import { AdminDeals } from './AdminDeals';
import { AdminNotificationsView } from './AdminNotificationsView';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminUser, setIsAdminLoginModalOpen, setCurrentView, settings } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Cross-component modals & triggers
  const [selectedOrderIdForModal, setSelectedOrderIdForModal] = useState<string | null>(null);
  const [forceAddProduct, setForceAddProduct] = useState(false);
  const [forceAddDeal, setForceAddDeal] = useState(false);

  // If not logged in as Admin, show unauthenticated gatekeeper
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4">
        <div className="bg-[#11131c] border border-[#272a3d] rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#ff6b00]/15 text-[#ff6b00] mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Staff Portal Protected
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Access to {settings.name} Admin & Operations terminal requires authorized credentials.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6b00]/25 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin Login</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="w-full py-3 rounded-2xl bg-[#181a28] hover:bg-[#222538] text-gray-400 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#272a3c] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Customer Menu</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenOrder = (orderId: string) => {
    setSelectedOrderIdForModal(orderId);
    setCurrentTab('orders');
  };

  const handleOpenAddProduct = () => {
    setCurrentTab('products');
    setForceAddProduct(true);
  };

  const handleOpenAddDeal = () => {
    setCurrentTab('deals');
    setForceAddDeal(true);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopNav
          currentTab={currentTab}
          setMobileOpen={setMobileSidebarOpen}
          setCurrentTab={setCurrentTab}
        />

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <AdminOverview
              setCurrentTab={setCurrentTab}
              openOrderModalWithId={handleOpenOrder}
              openAddProductModal={handleOpenAddProduct}
              openAddDealModal={handleOpenAddDeal}
            />
          )}

          {currentTab === 'orders' && (
            <AdminOrders
              selectedOrderId={selectedOrderIdForModal}
              onClearSelectedOrder={() => setSelectedOrderIdForModal(null)}
            />
          )}

          {currentTab === 'products' && (
            <AdminProducts
              forceOpenAddModal={forceAddProduct}
              onModalClose={() => setForceAddProduct(false)}
            />
          )}

          {currentTab === 'categories' && <AdminCategories />}

          {currentTab === 'customers' && <AdminCustomers />}

          {currentTab === 'coupons' && <AdminCoupons />}

          {currentTab === 'deals' && (
            <AdminDeals
              forceOpenAddModal={forceAddDeal}
              onModalClose={() => setForceAddDeal(false)}
            />
          )}

          {currentTab === 'notifications' && (
            <AdminNotificationsView onSelectOrder={handleOpenOrder} />
          )}

          {currentTab === 'reports' && <AdminReports />}

          {currentTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
