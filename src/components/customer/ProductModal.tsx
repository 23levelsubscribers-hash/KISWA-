import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VariantOption, CartItemExtra } from '../../types';
import { X, Plus, Minus, Check, Flame, MessageSquare, ShoppingBag } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProductForModal,
    closeProductModal,
    addToCart,
    settings,
    setIsCartOpen
  } = useApp();

  const product = selectedProductForModal;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<CartItemExtra[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
      setSelectedExtras([]);
      setSpecialInstructions('');
    }
  }, [product]);

  if (!product) return null;

  const handleExtraToggle = (extra: { id: string; name: string; price: number }) => {
    setSelectedExtras(prev => {
      const exists = prev.some(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const currentUnitPrice =
    product.price +
    (selectedVariant ? selectedVariant.priceDelta : 0) +
    selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const totalCalculated = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedExtras, specialInstructions);
    closeProductModal();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-2xl bg-[#11131c] border border-[#26293a] rounded-3xl overflow-hidden shadow-2xl my-8 text-white max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-product-modal"
          type="button"
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Large Product Image Header */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0a0a0f] border border-[#202230]">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {product.isBestseller && (
                <span className="bg-[#ff6b00] text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Bestseller
                </span>
              )}
              <span className="bg-[#181a26]/90 backdrop-blur-md text-[#84cc16] border border-[#84cc16]/30 text-xs font-bold px-2.5 py-1 rounded-lg">
                {product.categoryName}
              </span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-xs text-gray-300 font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                  ⏱ {product.preparationTimeMinutes || 15} Mins Fresh Prep
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white font-['Outfit']">
                  {settings.currencySymbol} {(currentUnitPrice ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 font-['Outfit']">
              {product.name}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants Selection (e.g. Size, Crust, Spice) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 bg-[#161824] p-4 rounded-2xl border border-[#232738]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Select Variant / Crust
                </label>
                <span className="text-xs text-[#ff6b00] font-semibold">Required (Choose 1)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map(variant => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#ff6b00]/15 border-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/10'
                          : 'bg-[#1b1e2c] border-[#292c3d] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#ff6b00] bg-[#ff6b00]' : 'border-gray-500'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{variant.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#84cc16]">
                        {variant.priceDelta > 0
                          ? `+${settings.currencySymbol} ${variant.priceDelta}`
                          : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons & Extras */}
          {product.extras && product.extras.length > 0 && (
            <div className="space-y-3 bg-[#161824] p-4 rounded-2xl border border-[#232738]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Add-ons & Extras
                </label>
                <span className="text-xs text-gray-400">Optional</span>
              </div>
              <div className="space-y-2">
                {product.extras.map(extra => {
                  const isSelected = selectedExtras.some(e => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => handleExtraToggle(extra)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#84cc16]/10 border-[#84cc16] text-white'
                          : 'bg-[#1b1e2c] border-[#292c3d] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-[#84cc16] border-[#84cc16]' : 'border-gray-500'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{extra.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#ff6b00]">
                        +{settings.currencySymbol} {extra.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2 bg-[#161824] p-4 rounded-2xl border border-[#232738]">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#ff6b00]" />
              Special Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra spicy, sauce on the side, no onions..."
              className="w-full bg-[#1b1e2c] border border-[#292c3d] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-[#0e1017] border-t border-[#232637] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-[#191c29] border border-[#2a2e40] rounded-2xl p-1.5">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-xl bg-[#222638] hover:bg-[#2d3249] text-gray-200 flex items-center justify-center transition active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-extrabold text-base text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl bg-[#222638] hover:bg-[#2d3249] text-gray-200 flex items-center justify-center transition active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            id="btn-modal-add-to-cart"
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-[#ff6b00]/25 transition hover:scale-[1.02] active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart • {settings.currencySymbol} {(totalCalculated ?? 0).toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
