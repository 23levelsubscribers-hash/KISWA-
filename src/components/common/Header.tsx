import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChefHatLogo } from './ChefHatLogo';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Flame,
  ChevronDown,
  Bell,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    totalCartItemCount,
    setIsCartOpen,
    currentView,
    setCurrentView,
    customerUser,
    setIsAuthModalOpen,
    setIsAdminLoginOpen,
    adminUser,
    searchQuery,
    setSearchQuery,
    unreadAdminCount
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('Home');

  const addresses = [
    { label: 'Home', detail: 'Plot 18-C, Gulberg III, Lahore', icon: '🏠' },
    { label: 'Work', detail: 'Floor 4, Software Tech Park, DHA', icon: '🏢' },
    { label: 'Current Location', detail: 'Detecting via GPS...', icon: '📍' }
  ];

  const notifications = [
    { id: 'n1', title: 'Order #104 In the Kitchen', desc: 'Chef is frying your hot crispy bucket!', time: '5m ago', read: false },
    { id: 'n2', title: 'Weekend Crunch Fest Active', desc: 'Use code CRISPY20 for 20% OFF today!', time: '1h ago', read: false },
    { id: 'n3', title: 'Crunch Points Earned', desc: '+150 pts added to your rewards wallet', time: '3h ago', read: false }
  ];

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Menu', view: 'menu' },
    { label: 'Deals', view: 'deals' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
    { label: 'Track Order', view: 'tracking' }
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090d]/95 backdrop-blur-md border-b border-[#1b1d28]">
      {/* Top micro bar for phone & opening hours */}
      <div className="hidden lg:block bg-[#0e1017] border-b border-[#181a24] py-1.5 px-4 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-[#84cc16]" />
              <span>{settings.openingHours}</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <PhoneCall className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>Call to Order: <strong className="text-white">{settings.phone}</strong></span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#84cc16] flex items-center gap-1 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse"></span>
              Live Kitchen & Delivery Open
            </span>
            {adminUser ? (
              <button
                id="btn-switch-admin-header"
                onClick={() => setCurrentView('admin')}
                className="text-xs bg-[#ff6b00]/20 hover:bg-[#ff6b00]/30 text-[#ff6b00] px-2.5 py-0.5 rounded-lg border border-[#ff6b00]/40 font-bold flex items-center gap-1 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
                {unreadAdminCount > 0 && (
                  <span className="bg-[#ff6b00] text-black text-[10px] px-1.5 rounded-full font-black">
                    {unreadAdminCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                id="btn-admin-login-topbar"
                onClick={() => setIsAdminLoginOpen(true)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                Admin Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar Matching the Theme */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left Side: Hamburger & Deliver To */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger Menu Button */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-[#12141c] hover:bg-[#1a1c26] border border-[#222533] text-gray-200 flex items-center justify-center transition"
            title="Open Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Deliver To Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-deliver-to-selector"
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              className="flex flex-col text-left group"
            >
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Deliver to
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-white group-hover:text-[#ff6b00] transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#ff6b00] shrink-0" />
                <span>{selectedAddress}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform duration-200" />
              </div>
            </button>

            {/* Address Popover */}
            {showAddressDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#12141c] border border-[#252838] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-bold text-gray-400 px-3 py-1.5 uppercase tracking-wider border-b border-[#1c1f2c]">
                  Select Delivery Location
                </div>
                <div className="mt-1 space-y-1">
                  {addresses.map(addr => (
                    <button
                      key={addr.label}
                      onClick={() => {
                        setSelectedAddress(addr.label);
                        setShowAddressDropdown(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition ${
                        selectedAddress === addr.label
                          ? 'bg-[#ff6b00]/15 border border-[#ff6b00]/40 text-white'
                          : 'hover:bg-[#191b26] text-gray-300'
                      }`}
                    >
                      <span className="text-base">{addr.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold">{addr.label}</div>
                        <div className="text-[11px] text-gray-400 truncate">{addr.detail}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Minimalist Orange Chef Hat Logo */}
        <div
          id="brand-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex flex-col sm:flex-row items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="p-1.5 rounded-2xl bg-[#141620] border border-[#242738] group-hover:border-[#ff6b00]/60 transition-all duration-300 shadow-md shadow-black/50">
            <ChefHatLogo size={36} className="transform group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                {settings.name ? settings.name.split(' ')[0] : 'RAJOWAL'}
              </span>
              {settings.name && settings.name.split(' ').length > 1 && (
                <span className="text-[10px] font-black tracking-wider bg-[#a3e635] text-black px-1.5 py-0.5 rounded uppercase">
                  {settings.name.split(' ').slice(1).join(' ')}
                </span>
              )}
            </div>
            <p className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase">
              {settings.tagline || 'Crispy Flavor • Delivered Fast'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                id={`nav-link-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#1a1c26] border border-[#2c2f40] shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-[#13151f]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Notification Bell + Cart Button + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              id="btn-header-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-xl bg-[#12141c] hover:bg-[#1a1c26] border border-[#222533] text-gray-300 hover:text-white flex items-center justify-center transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff6b00] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#12141c] border border-[#252838] rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#1c1f2c] text-xs font-bold text-white">
                  <span>Notifications</span>
                  <span className="text-[10px] text-[#ff6b00] font-semibold">3 New</span>
                </div>
                <div className="divide-y divide-[#1b1d2a] mt-1">
                  {notifications.map(item => (
                    <div key={item.id} className="py-2.5 px-1 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-gray-500 font-normal">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile on Desktop */}
          {customerUser ? (
            <button
              id="btn-customer-profile-header"
              onClick={() => handleNavClick('profile')}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                currentView === 'profile'
                  ? 'bg-[#84cc16]/15 border-[#84cc16]/40 text-[#84cc16]'
                  : 'bg-[#12141c] hover:bg-[#1a1c26] border-[#222533] text-gray-200'
              }`}
            >
              <User className="w-4 h-4 text-[#84cc16]" />
              <span className="max-w-[80px] truncate">{customerUser.name}</span>
            </button>
          ) : (
            <button
              id="btn-customer-login-header"
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#12141c] hover:bg-[#1a1c26] border border-[#222533] text-gray-200 transition"
            >
              <User className="w-4 h-4 text-[#ff6b00]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            id="btn-header-cart-open"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e65500] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#ff6b00]/30 transition hover:scale-105 active:scale-95"
            title="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalCartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-black flex items-center justify-center">
                {totalCartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0b10] border-b border-[#1c1e28] px-4 py-5 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navItems.map(item => (
              <button
                key={item.view}
                id={`mobile-nav-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left font-bold text-sm ${
                  currentView === item.view
                    ? 'bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/30'
                    : 'text-gray-200 hover:bg-[#13151f]'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-gray-500">→</span>
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-[#181a24] flex flex-col gap-2">
              <button
                id="btn-mobile-admin-access"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (adminUser) {
                    setCurrentView('admin');
                  } else {
                    setIsAdminLoginOpen(true);
                  }
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#12141c] border border-[#222533] text-gray-300"
              >
                <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
                <span>{adminUser ? 'Open Admin Portal' : 'Staff / Admin Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
