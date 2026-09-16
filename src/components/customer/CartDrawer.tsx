import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    deliveryFee,
    discountAmount,
    taxAmount,
    grandTotal,
    settings,
    setCurrentView
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponInput);
    setCouponLoading(false);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeDeliveryDelta = Math.max(0, settings.freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#11131c] border-l border-[#242738] shadow-2xl flex flex-col text-white">
          {/* Cart Header */}
          <div className="p-5 bg-[#0e1017] border-b border-[#202334] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white font-['Outfit']">Your Cart</h3>
                <span className="text-xs text-gray-400">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  id="btn-clear-cart"
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-rose-400 transition mr-2"
                >
                  Clear all
                </button>
              )}
              <button
                id="btn-close-cart-drawer"
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#1a1d2b] hover:bg-[#25293d] text-gray-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Goal Progress */}
          {cart.length > 0 && (
            <div className="bg-[#161824] px-5 py-3 border-b border-[#222536]">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                {freeDeliveryDelta === 0 ? (
                  <span className="text-[#84cc16] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> FREE Delivery unlocked!
                  </span>
                ) : (
                  <span className="text-gray-300">
                    Add <strong className="text-[#ff6b00]">{settings.currencySymbol} {(freeDeliveryDelta ?? 0).toLocaleString()}</strong> for Free Delivery
                  </span>
                )}
                <span className="text-gray-400 text-[11px] font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#252838] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6b00] to-[#84cc16] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#181a26] border border-[#26293a] flex items-center justify-center text-gray-500">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Your Cart is Empty</h4>
                  <p className="text-xs text-gray-400 max-w-xs">
                    Satisfy your crunch cravings! Explore our hot fried chicken buckets, burgers & deals.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('menu');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#ff6b00] text-white text-xs font-bold shadow-lg shadow-[#ff6b00]/20 hover:bg-[#e05600] transition"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.cartItemId}
                  id={`cart-item-${item.cartItemId}`}
                  className="bg-[#151722] border border-[#242738] rounded-2xl p-3.5 flex gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-black shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate font-['Outfit']">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-500 hover:text-rose-400 p-0.5 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variant & Extras description */}
                    <div className="text-[11px] text-gray-400 space-y-0.5 my-1">
                      {item.selectedVariant && (
                        <div className="text-[#84cc16]">
                          • Variant: {item.selectedVariant.name}
                        </div>
                      )}
                      {item.selectedExtras && item.selectedExtras.length > 0 && (
                        <div className="text-amber-300">
                          • Extras: {item.selectedExtras.map(e => e.name).join(', ')}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <div className="italic text-gray-400">
                          "{item.specialInstructions}"
                        </div>
                      )}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1f2231]">
                      <span className="text-sm font-black text-white">
                        {settings.currencySymbol} {(item.totalPrice ?? 0).toLocaleString()}
                      </span>

                      <div className="flex items-center bg-[#1c1f2d] border border-[#2b2f42] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-5 h-5 rounded text-gray-400 hover:text-white flex items-center justify-center transition text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-5 h-5 rounded text-gray-400 hover:text-white flex items-center justify-center transition text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#0e1017] border-t border-[#202334] space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#84cc16]/15 border border-[#84cc16]/30 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-[#84cc16] font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Applied: {appliedCoupon.code}</span>
                      <span className="text-white">(-{settings.currencySymbol} {appliedCoupon.discount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. CRISPY20)"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full bg-[#161824] border border-[#272b3c] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-[#222538] hover:bg-[#2e334d] text-white text-xs font-bold transition disabled:opacity-50"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMsg.error ? 'text-rose-400' : 'text-[#84cc16]'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-[#1c1f2d]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    {settings.currencySymbol} {(subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-[#84cc16] font-bold">FREE</span>
                    ) : (
                      `${settings.currencySymbol} ${(deliveryFee ?? 0).toLocaleString()}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#84cc16]">
                    <span>Discount</span>
                    <span className="font-bold">
                      -{settings.currencySymbol} {(discountAmount ?? 0).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax ({settings.taxPercentage}%)</span>
                  <span className="font-semibold text-white">
                    {settings.currencySymbol} {(taxAmount ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#232738] font-['Outfit']">
                  <span>Grand Total</span>
                  <span className="text-[#ff6b00]">
                    {settings.currencySymbol} {(grandTotal ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="btn-proceed-checkout"
                onClick={handleProceedToCheckout}
                disabled={subtotal < settings.minOrderAmount}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] disabled:bg-gray-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#ff6b00]/25 transition hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {subtotal < settings.minOrderAmount && (
                <p className="text-[11px] text-center text-amber-400">
                  Minimum order amount is {settings.currencySymbol} {settings.minOrderAmount}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
