import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, Flame, Sparkles, Heart, SlidersHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    settings,
    addToCart,
    openProductModal,
    customerUser,
    toggleFavorite
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  const isFavorite = customerUser?.favoriteProductIds?.includes(product.id);
  const hasCustomizations = (product.variants && product.variants.length > 0) || (product.extras && product.extras.length > 0);

  const handleCardClick = () => {
    openProductModal(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasCustomizations) {
      openProductModal(product);
    } else {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative bg-[#13151f] hover:bg-[#181a26] border border-[#212433] hover:border-[#ff6b00]/40 rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff6b00]/10 cursor-pointer"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3.5 bg-[#0b0c11]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            {product.isBestseller && (
              <span className="bg-[#ff6b00] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 fill-white" />
                Bestseller
              </span>
            )}
            {product.sectionTag && !product.isBestseller && (
              <span className="bg-[#84cc16] text-black text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-md">
                {product.sectionTag}
              </span>
            )}
            {product.spiciness && (
              <span className="bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                🌶️ {product.spiciness}
              </span>
            )}
          </div>

          {/* Favorite heart button */}
          <button
            id={`fav-btn-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition hover:scale-110"
            title="Save to favorites"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-white'}`}
            />
          </button>

          {/* Preparation time & calories tag */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-gray-300 font-medium">
            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              ⏱ {product.preparationTimeMinutes || 15} mins
            </span>
            {product.calories && (
              <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                {product.calories} kcal
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-white font-bold text-base sm:text-lg leading-tight group-hover:text-[#ff6b00] transition-colors font-['Outfit']">
              {product.name}
            </h3>
          </div>
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>
      </div>

      {/* Bottom Price & Controls */}
      <div className="pt-2 border-t border-[#1c1e2b] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-white font-['Outfit']">
                {settings.currencySymbol} {(product.price ?? 0).toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {settings.currencySymbol} {(product.originalPrice ?? 0).toLocaleString()}
                </span>
              )}
            </div>
            {hasCustomizations && (
              <span className="text-[10px] text-[#84cc16] font-semibold flex items-center gap-1">
                <SlidersHorizontal className="w-2.5 h-2.5" /> Options Available
              </span>
            )}
          </div>

          {/* Quantity Selector on card */}
          {!hasCustomizations && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-[#1b1e2b] rounded-xl border border-[#2c3042] p-0.5"
            >
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-lg text-gray-400 hover:text-white hover:bg-[#252838] flex items-center justify-center transition text-xs"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded-lg text-gray-400 hover:text-white hover:bg-[#252838] flex items-center justify-center transition text-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          id={`btn-add-cart-${product.id}`}
          type="button"
          onClick={handleQuickAdd}
          className="w-full py-2.5 px-4 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/20 transition-all active:scale-95"
        >
          {hasCustomizations ? (
            <>
              <SlidersHorizontal className="w-4 h-4" />
              <span>Customize & Add</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
