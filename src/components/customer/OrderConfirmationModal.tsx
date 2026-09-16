import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Flame
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { lastConfirmedOrder, setCurrentView, trackOrder, settings } = useApp();

  if (!lastConfirmedOrder) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white mb-4">No Recent Order</h2>
        <button
          onClick={() => setCurrentView('menu')}
          className="px-6 py-3 rounded-xl bg-[#ff6b00] text-white font-bold"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const order = lastConfirmedOrder;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[#12141f] border border-[#262a3d] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#84cc16]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Celebration Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#84cc16]/20 border border-[#84cc16]/40 text-[#84cc16] shadow-xl shadow-[#84cc16]/15 mb-2 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
            Order Confirmed!
          </h1>
          <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{order.customerName}</strong>! Our kitchen has received your order and is pre-heating the fryers.
          </p>

          <div className="inline-block bg-[#1a1d2c] border border-[#2b2f44] px-4 py-2 rounded-2xl text-xs font-mono font-bold text-[#ff6b00]">
            Order ID: <span className="text-white text-sm font-black tracking-wider">{order.id}</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs">
          <div className="bg-[#161826] border border-[#252839] p-4 rounded-2xl">
            <div className="text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#84cc16]" />
              Estimated Delivery Time
            </div>
            <div className="text-base font-black text-white">
              {order.estimatedDeliveryMinutes || 35} - 45 Minutes
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Fresh & piping hot right to your door</div>
          </div>

          <div className="bg-[#161826] border border-[#252839] p-4 rounded-2xl">
            <div className="text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#ff6b00]" />
              Delivery Destination
            </div>
            <div className="text-sm font-bold text-white truncate">
              {order.deliveryAddress}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">{order.cityArea} • {order.orderType}</div>
          </div>
        </div>

        {/* Items Purchased Box */}
        <div className="bg-[#161826] border border-[#252839] rounded-2xl p-5 mb-8">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between font-['Outfit']">
            <span>Ordered Dishes</span>
            <span className="text-xs text-gray-400">{order.items.length} items</span>
          </h3>

          <div className="divide-y divide-[#222536] space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#212435] text-[#ff6b00] font-black text-xs flex items-center justify-center">
                    {item.quantity}x
                  </span>
                  <div>
                    <div className="font-bold text-white">{item.productName}</div>
                    {item.variantName && (
                      <div className="text-[11px] text-[#84cc16]">Variant: {item.variantName}</div>
                    )}
                    {item.extras && item.extras.length > 0 && (
                      <div className="text-[10px] text-gray-400">
                        Extras: {item.extras.map(e => e.name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="font-bold text-white">
                  {settings.currencySymbol} {(item.totalPrice ?? 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#23273a] flex items-baseline justify-between">
            <span className="text-xs text-gray-400 font-semibold">
              Payment Method: <strong className="text-white">{order.paymentMethod}</strong>
            </span>
            <div className="text-right">
              <span className="text-xs text-gray-400 mr-2">Grand Total:</span>
              <span className="text-lg font-black text-[#ff6b00]">
                {settings.currencySymbol} {(order.grandTotal ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="btn-live-track-order"
            onClick={() => trackOrder(order.id)}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#ff6b00]/25 transition hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <span>Live Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('menu')}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#191b29] hover:bg-[#232638] border border-[#2b2f43] text-gray-200 font-bold text-sm transition"
          >
            Order More Food
          </button>
        </div>
      </div>
    </div>
  );
};
