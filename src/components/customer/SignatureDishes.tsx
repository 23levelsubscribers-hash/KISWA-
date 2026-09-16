import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Plus, Check, Sparkles, ChevronRight } from 'lucide-react';

interface SignatureDishesProps {
  onViewAll?: () => void;
  onOpenProductModal?: (product: Product) => void;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({
  onViewAll,
  onOpenProductModal
}) => {
  const { products, addToCart, settings, setCurrentView } = useApp();
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Take top signature dishes or bestsellers
  const signatureProducts = products
    .filter(p => p.isAvailable && (p.isBestseller || p.isFeatured || p.sectionTag === 'Signature Dishes'))
    .slice(0, 6);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1200);
  };

  const handleCardClick = (product: Product) => {
    if (onOpenProductModal) {
      onOpenProductModal(product);
    }
  };

  if (signatureProducts.length === 0) return null;

  return (
    <section id="signature-dishes-section" className="py-6 sm:py-8">
      {/* Section Header with Doodle / Sparkle & View All */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit']">
            Signature Dishes
          </h2>
          <span className="text-lg">💫</span>
        </div>
        <button
          id="btn-view-all-signature"
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

      {/* Horizontal Scroll / Responsive Grid matching the screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {signatureProducts.map(product => {
          const isAdded = recentlyAddedId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => handleCardClick(product)}
              className="group relative bg-[#12141c] hover:bg-[#181a24] border border-[#202332] hover:border-[#2e3347] rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg hover:shadow-black/60 hover:-translate-y-1"
            >
              <div>
                {/* Bestseller Lime Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#a3e635] text-black font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                    BESTSELLER
                  </span>
                  {product.spiciness === 'Hot' && (
                    <span className="text-[10px] text-red-400 font-bold">🌶️ Hot</span>
                  )}
                </div>

                {/* Product Image */}
                <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden mb-3 bg-[#0d0f15]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Product Title */}
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ff6b00] transition-colors line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-1 mb-3">
                  {product.description}
                </p>
              </div>

              {/* Price and Circular Orange Add Button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1a1c28]">
                <div>
                  <span className="text-xs sm:text-sm font-black text-white">
                    {settings.currencySymbol} {(product.price ?? 0).toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[10px] text-gray-500 line-through ml-1.5 hidden sm:inline">
                      {settings.currencySymbol} {(product.originalPrice ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  id={`btn-quick-add-${product.id}`}
                  type="button"
                  onClick={e => handleQuickAdd(e, product)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    isAdded
                      ? 'bg-[#a3e635] text-black scale-110'
                      : 'bg-[#ff6b00] hover:bg-[#e65500] text-white hover:scale-110 active:scale-95 shadow-[#ff6b00]/30'
                  }`}
                  title="Quick add to order"
                >
                  {isAdded ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[3]" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
