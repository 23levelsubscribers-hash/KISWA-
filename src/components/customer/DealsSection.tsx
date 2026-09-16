import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Tag, ArrowRight, Clock, Copy, Check } from 'lucide-react';

export const DealsSection: React.FC = () => {
  const { deals, coupons, applyCoupon, setIsCartOpen, showToast, settings } = useApp();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const activeDeals = deals.filter(d => d.isActive);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Copied coupon code: ${code}`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleClaimCoupon = async (code: string) => {
    const res = await applyCoupon(code);
    if (res.success) {
      showToast(`🎉 Coupon ${code} applied to your order!`, 'success');
      setIsCartOpen(true);
    } else {
      showToast(res.message, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6b00]/15 border border-[#ff6b00]/30 text-[#ff6b00] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Special Promotions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
          Hot Deals & <span className="text-[#84cc16]">Mega Saver</span> Combos
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Save big on family buckets, duo crunch boxes, and weekday madness discounts.
        </p>
      </div>

      {/* Featured Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {activeDeals.map(deal => (
          <div
            key={deal.id}
            className="group relative bg-[#12141f] border border-[#242738] hover:border-[#ff6b00]/40 rounded-3xl overflow-hidden shadow-2xl transition duration-300 flex flex-col justify-between"
          >
            <div className="relative h-64 sm:h-72 overflow-hidden bg-black">
              <img
                src={deal.image}
                alt={deal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141f] via-transparent to-black/40"></div>

              {deal.originalPrice && deal.dealPrice && deal.originalPrice > deal.dealPrice ? (
                <div className="absolute top-4 left-4 bg-[#ff6b00] text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                  Save Rs. {deal.originalPrice - deal.dealPrice}
                </div>
              ) : deal.discountText ? (
                <div className="absolute top-4 left-4 bg-[#ff6b00] text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                  {deal.discountText}
                </div>
              ) : null}

              {deal.badge && (
                <div className="absolute top-4 right-4 bg-[#84cc16] text-black text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                  {deal.badge}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-2 font-['Outfit']">
                  {deal.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {deal.description || deal.subtitle || ''}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1f2233] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  {deal.dealPrice != null ? (
                    <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                      {settings.currencySymbol} {(deal.dealPrice ?? 0).toLocaleString()}
                    </span>
                  ) : deal.discountText ? (
                    <span className="text-2xl sm:text-3xl font-black text-[#ff6b00] font-['Outfit']">
                      {deal.discountText}
                    </span>
                  ) : null}
                  {deal.originalPrice != null && (
                    <span className="text-sm text-gray-500 line-through">
                      {settings.currencySymbol} {(deal.originalPrice ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {deal.couponCode && (
                    <button
                      type="button"
                      onClick={() => handleClaimCoupon(deal.couponCode!)}
                      className="px-4 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#ff6b00]/20 transition"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Use Code: {deal.couponCode}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Coupons Banner Section */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">Active Discount Promo Codes</h3>
            <p className="text-xs text-gray-400">Copy any coupon code and apply it during checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.filter(c => c.isActive).map(c => (
            <div
              key={c.id}
              className="bg-[#161826] border border-dashed border-[#2f334a] hover:border-[#84cc16] rounded-2xl p-4 flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-base text-[#84cc16] tracking-wider">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold bg-[#ff6b00]/15 text-[#ff6b00] px-2 py-0.5 rounded">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF`
                      : `Rs. ${c.discountValue} OFF`}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-2">{c.description}</p>
                <div className="text-[11px] text-gray-500">
                  Min order: {settings.currencySymbol} {c.minOrderValue}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#232638] flex items-center justify-between">
                <button
                  onClick={() => handleCopyCoupon(c.code)}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#84cc16]" />
                      <span className="text-[#84cc16] font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleClaimCoupon(c.code)}
                  className="text-xs font-bold text-[#ff6b00] hover:underline"
                >
                  Apply to Cart →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
