import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Users, ChevronRight, Check } from 'lucide-react';
import { Product } from '../../types';

interface FamilyBundlesProps {
  onViewAll?: () => void;
}

export const FamilyBundles: React.FC<FamilyBundlesProps> = ({ onViewAll }) => {
  const { addToCart, settings, setCurrentView, products } = useApp();

  const bundles = [
    {
      id: 'bundle-family-feast',
      badge: 'FAMILY FEAST',
      badgeColor: 'bg-[#a3e635] text-black',
      title: 'Family Feast Platter',
      items: '10 PCS Chicken + 2 Large Sides + 4 Drinks',
      price: 2999,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80',
      description: '10 crispy fried chicken pieces with large garlic fries, coleslaw, dinner rolls, and chilled drinks.'
    },
    {
      id: 'bundle-mega-bundle',
      badge: 'MEGA BUNDLE',
      badgeColor: 'bg-amber-400 text-black',
      title: 'Mega Crunch Party Spread',
      items: '15 PCS Chicken + 3 Large Sides + 6 Drinks',
      price: 4299,
      originalPrice: 5100,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80',
      description: '15 golden chicken pieces, 3 large fries, loaded mozzarella sticks, 4 dinner rolls and 6 cold drinks.'
    }
  ];

  const handleAddBundle = (bundle: typeof bundles[0]) => {
    // Check if product exists in products or synthesize a cart item
    const existing = products.find(p => p.id === bundle.id);
    if (existing) {
      addToCart(existing, 1);
    } else {
      const syntheticProduct: Product = {
        id: bundle.id,
        name: bundle.title,
        slug: bundle.id,
        description: bundle.items,
        price: bundle.price,
        originalPrice: bundle.originalPrice,
        image: bundle.image,
        categoryId: 'cat-chicken',
        categoryName: 'Family Bundles',
        isBestseller: true,
        isFeatured: true,
        isAvailable: true,
        preparationTimeMinutes: 25,
        spiciness: 'Medium',
        variants: [],
        extras: [],
        rating: 5.0,
        ratingCount: 142
      };
      addToCart(syntheticProduct, 1);
    }
  };

  return (
    <section id="family-bundles-section" className="py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit']">
            Family Bundles
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-[#151722] px-2.5 py-0.5 rounded-full border border-[#232635]">
            <Users className="w-3 h-3 text-[#a3e635]" />
            Perfect for sharing!
          </span>
        </div>
        <button
          id="btn-view-all-bundles"
          onClick={() => {
            if (onViewAll) {
              onViewAll();
            } else {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="text-xs sm:text-sm font-bold text-gray-400 hover:text-[#ff6b00] flex items-center gap-0.5 transition-colors group"
        >
          <span>View all</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Two Side-by-Side Cards Matching the Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundles.map(bundle => (
          <div
            key={bundle.id}
            className="group relative bg-[#12141c] hover:bg-[#161824] border border-[#202332] hover:border-[#2f3348] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
          >
            {/* Top row: Badge and items preview */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className={`inline-block ${bundle.badgeColor} text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2`}>
                  {bundle.badge}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#ff6b00] transition-colors leading-snug">
                  {bundle.items}
                </h3>
              </div>
            </div>

            {/* Middle: Rich image banner */}
            <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-4 bg-[#0d0f15]">
              <img
                src={bundle.image}
                alt={bundle.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-2.5 left-3 text-xs font-semibold text-gray-300">
                {bundle.description}
              </div>
            </div>

            {/* Bottom: Price and White Circular Button with Black Arrow */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1a1c28]">
              <div>
                <span className="text-base sm:text-lg font-black text-white">
                  {settings.currencySymbol} {(bundle.price ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 line-through ml-2">
                  {settings.currencySymbol} {(bundle.originalPrice ?? 0).toLocaleString()}
                </span>
              </div>

              <button
                id={`btn-order-bundle-${bundle.id}`}
                onClick={() => handleAddBundle(bundle)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#ff6b00] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                title="Add bundle to order"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.8]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
