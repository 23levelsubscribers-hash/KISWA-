import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Check,
  CheckCheck
} from 'lucide-react';

interface AdminTopNavProps {
  currentTab: string;
  setMobileOpen: (open: boolean) => void;
  setCurrentTab: (tab: any) => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  currentTab,
  setMobileOpen,
  setCurrentTab
}) => {
  const {
    adminNotifications,
    unreadAdminCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView
  } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles: Record<string, string> = {
    overview: 'Dashboard Overview',
    orders: 'Order Processing & Kitchen',
    products: 'Product Inventory & Add-ons',
    categories: 'Menu Categories',
    customers: 'Customer Registry',
    coupons: 'Coupons & Discounts',
    deals: 'Special Deals & Bundles',
    notifications: 'Live Restaurant Alerts',
    reports: 'Sales & Performance Reports',
    settings: 'Restaurant System Settings'
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0d0e15]/95 backdrop-blur-md border-b border-[#1e2130] px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Toggle & Tab Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-[#151722] border border-[#252838] text-gray-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight font-['Outfit']">
            {tabTitles[currentTab] || 'Management Portal'}
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            Kaswah Fast Foods Central Kitchen & Operations
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
            soundEnabled
              ? 'bg-[#84cc16]/10 border-[#84cc16]/30 text-[#84cc16]'
              : 'bg-[#151722] border-[#252838] text-gray-400'
          }`}
          title={soundEnabled ? 'Order sound alert ON' : 'Order sound alert OFF'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            id="btn-admin-notifications-bell"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-[#151722] hover:bg-[#1d202e] border border-[#252838] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Bell className="w-4 h-4 text-[#ff6b00]" />
            <span className="hidden sm:inline">Alerts</span>
            {unreadAdminCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#ff6b00] text-black text-[10px] font-black flex items-center justify-center">
                {unreadAdminCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#12141f] border border-[#262a3d] rounded-2xl shadow-2xl p-4 text-white z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#1f2231] mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-white">
                    Live Order Alerts
                  </span>
                  {unreadAdminCount > 0 && (
                    <span className="bg-[#ff6b00] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadAdminCount} new
                    </span>
                  )}
                </div>
                {unreadAdminCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3 text-[#84cc16]" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-[#1c1f2e]">
                {adminNotifications.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    No notifications yet.
                  </div>
                ) : (
                  adminNotifications.slice(0, 8).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.orderId) {
                          setCurrentTab('orders');
                          setShowNotifications(false);
                        }
                      }}
                      className={`pt-2 p-2 rounded-xl text-xs cursor-pointer transition ${
                        !n.read ? 'bg-[#ff6b00]/10 border border-[#ff6b00]/20' : 'hover:bg-[#181a26]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-white leading-tight">{n.title}</div>
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px] mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 mt-2 border-t border-[#1f2231] text-center">
                <button
                  onClick={() => {
                    setCurrentTab('notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-bold text-[#ff6b00] hover:underline"
                >
                  View All Alerts in Full Screen →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Customer Website CTA */}
        <button
          type="button"
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ff6b00]/20 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </button>
      </div>
    </header>
  );
};
