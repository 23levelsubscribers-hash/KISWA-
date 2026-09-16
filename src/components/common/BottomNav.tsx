import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, UtensilsCrossed, ShoppingBag, Tag, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, totalCartItemCount, setIsCartOpen, setIsAuthModalOpen, customerUser } = useApp();

  const handleOrderClick = () => {
    // Open cart drawer or go to menu to order
    if (totalCartItemCount > 0) {
      setIsCartOpen(true);
    } else {
      setCurrentView('menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProfileClick = () => {
    if (customerUser) {
      setCurrentView('profile');
    } else {
      setIsAuthModalOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0d0f15]/95 backdrop-blur-lg border-t border-[#1e202d] px-3 py-1.5 pb-safe">
      <div className="max-w-md mx-auto flex items-end justify-between relative">
        {/* Home */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'home' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        {/* Menu */}
        <button
          onClick={() => {
            setCurrentView('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'menu' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Menu</span>
        </button>

        {/* Center Floating Order Button */}
        <div className="flex-1 flex flex-col items-center relative -top-3">
          <button
            onClick={handleOrderClick}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#ff5500] to-[#ff7a00] text-white flex items-center justify-center shadow-xl shadow-[#ff6b00]/40 ring-4 ring-[#0d0f15] hover:scale-105 active:scale-95 transition-all"
            title="Start Order / Open Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              {totalCartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#ff6b00] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {totalCartItemCount}
                </span>
              )}
            </div>
          </button>
          <span className="text-[10px] font-bold text-[#ff6b00] mt-0.5">Order</span>
        </div>

        {/* Deals */}
        <button
          onClick={() => {
            setCurrentView('deals');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'deals' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Tag className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Deals</span>
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'profile' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>
    </div>
  );
};
