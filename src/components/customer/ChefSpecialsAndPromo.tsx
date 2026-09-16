import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Check, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../../types';

export const ChefSpecialsAndPromo: React.FC = () => {
  const { addToCart, settings, setCurrentView, products } = useApp();
  const [isAddedSpecial, setIsAddedSpecial] = useState(false);

  const specialDish = {
    id: 'prod-hot-honey-chicken',
    name: 'Hot Honey Chicken',
    description: 'Crispy chicken drizzled with signature spicy hot honey glaze and fresh herb sprinkles.',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80'
  };

  const handleAddSpecial = () => {
    const existing = products.find(p => p.id === specialDish.id);
    if (existing) {
      addToCart(existing, 1);
    } else {
      const syntheticProduct: Product = {
        id: specialDish.id,
        name: specialDish.name,
        slug: 'hot-honey-chicken',
        description: specialDish.description,
        price: specialDish.price,
        image: specialDish.image,
        categoryId: 'cat-chicken',
        categoryName: 'Fried Chicken',
        isBestseller: true,
        isFeatured: true,
        isAvailable: true,
        preparationTimeMinutes: 18,
        spiciness: 'Hot',
        variants: [],
        extras: [],
        rating: 4.9,
        ratingCount: 215
      };
      addToCart(syntheticProduct, 1);
    }

    setIsAddedSpecial(true);
    setTimeout(() => setIsAddedSpecial(false), 1200);
  };

  const handlePromoOrderNow = () => {
    setCurrentView('deals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Chef Specials */}
        <div className="bg-[#12141c] hover:bg-[#161824] border border-[#202332] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight font-['Outfit']">
                  Chef Specials
                </h3>
                <span>👑</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> by our chefs
              </span>
            </div>

            {/* Product Image & Info */}
            <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-3 bg-[#0d0f15]">
              <img
                src={specialDish.image}
                alt={specialDish.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-2.5 left-3">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {specialDish.name}
                </h4>
              </div>
            </div>

            <p className="text-xs text-gray-300 mb-3 line-clamp-2 leading-relaxed">
              {specialDish.description}
            </p>
          </div>

          {/* Price and Plus Button */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1a1c28]">
            <span className="text-base font-black text-white">
              {settings.currencySymbol} {(specialDish.price ?? 0).toLocaleString()}
            </span>

            <button
              id="btn-quick-add-chef-special"
              onClick={handleAddSpecial}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                isAddedSpecial
                  ? 'bg-[#a3e635] text-black scale-110'
                  : 'bg-[#ff6b00] hover:bg-[#e65500] text-white hover:scale-110 active:scale-95 shadow-[#ff6b00]/30'
              }`}
              title="Add Chef Special to order"
            >
              {isAddedSpecial ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Right Card: WEEKEND CRUNCH FEST Promo Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#ff6b00] via-[#f25c05] to-[#c73b00] p-5 sm:p-6 text-white flex flex-col justify-between shadow-2xl shadow-[#ff6b00]/25 group">
          {/* Subtle light bursts / rays */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <span className="inline-block bg-black/25 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3">
              ★ WEEKEND EXCLUSIVE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2 font-['Outfit'] drop-shadow-md">
              WEEKEND CRUNCH FEST
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/90 drop-shadow mb-4">
              Up to 25% OFF on selected items
            </p>
          </div>

          {/* Bottom Area: Drumstick photo & Order Now Button */}
          <div className="flex items-end justify-between gap-4 mt-2">
            <button
              id="btn-order-weekend-fest"
              onClick={handlePromoOrderNow}
              className="bg-[#a3e635] hover:bg-[#b8f542] text-black text-xs sm:text-sm font-black px-5 py-2.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.8]" />
            </button>

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform group-hover:rotate-3 transition-transform duration-300 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1562967914-608f82629710?w=400&auto=format&fit=crop&q=80"
                alt="Crunch Fest Fried Drumsticks"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
