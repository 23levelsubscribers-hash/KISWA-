import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  Smile,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const STAGES: { status: OrderStatus; label: string; icon: any; description: string }[] = [
  { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, description: 'Order verified & sent to the kitchen' },
  { status: 'Preparing', label: 'Preparing', icon: ChefHat, description: 'Frying & cooking fresh crispy chicken' },
  { status: 'Ready', label: 'Ready', icon: PackageCheck, description: 'Packed hot in insulated thermal bags' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, description: 'Rider is on the way to your address' },
  { status: 'Delivered', label: 'Delivered', icon: Smile, description: 'Enjoy your hot & crunchy Kaswah feast!' }
];

export const OrderTrackingView: React.FC = () => {
  const { trackingOrderId, setTrackingOrderId, settings, setCurrentView, showToast } = useApp();

  const [inputOrderId, setInputOrderId] = useState(trackingOrderId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.getOrderById(id.trim());
      setOrder(data);
    } catch (err: any) {
      setErrorMsg(`Order "${id}" could not be found. Please check your Order ID.`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingOrderId) {
      setInputOrderId(trackingOrderId);
      fetchOrder(trackingOrderId);
    } else {
      // Default to demo order if available
      fetchOrder('KAS-8492');
      setInputOrderId('KAS-8492');
    }
  }, [trackingOrderId]);

  // Live polling for this order every 4 seconds
  useEffect(() => {
    if (!order) return;
    const timer = setInterval(async () => {
      try {
        const refreshed = await api.getOrderById(order.id);
        if (refreshed) {
          setOrder(refreshed);
        }
      } catch {
        // silent
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [order?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOrderId.trim()) return;
    setTrackingOrderId(inputOrderId.trim());
    fetchOrder(inputOrderId.trim());
  };

  const getStageIndex = (status: OrderStatus): number => {
    if (status === 'Cancelled') return -1;
    const idx = STAGES.findIndex(s => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStageIndex = order ? getStageIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
          Live Order <span className="text-[#ff6b00]">Tracking</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Follow your hot & crispy meal in real time from our fryers to your doorstep.
        </p>

        {/* Search Order Form */}
        <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-tracking-id"
              value={inputOrderId}
              onChange={e => setInputOrderId(e.target.value.toUpperCase())}
              placeholder="Enter Order ID (e.g. KAS-8492)"
              className="w-full bg-[#141622] border border-[#262a3c] rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-bold text-sm shadow-lg shadow-[#ff6b00]/25 transition active:scale-95"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="bg-[#241315] border border-rose-500/40 text-rose-300 p-4 rounded-2xl text-center text-sm mb-8 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {order && (
        <div className="bg-[#12141f] border border-[#252839] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-300">
          {/* Order Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#212435]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Order ID
                </span>
                <span className="text-xl font-black text-white font-mono">{order.id}</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-[#84cc16]/20 text-[#84cc16] border border-[#84cc16]/40'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/40 animate-pulse'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.orderType}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchOrder(order.id)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-[#171926] px-3 py-2 rounded-xl border border-[#272a3c] transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Live Refresh</span>
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 text-xs text-[#84cc16] bg-[#84cc16]/10 hover:bg-[#84cc16]/20 px-3 py-2 rounded-xl border border-[#84cc16]/30 font-semibold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Help Hotline</span>
              </a>
            </div>
          </div>

          {/* 5-Stage Visual Progress Bar */}
          {order.status === 'Cancelled' ? (
            <div className="bg-[#2a1417] border border-rose-500/30 p-6 rounded-2xl text-center">
              <h3 className="text-lg font-bold text-rose-400 mb-1">Order Cancelled</h3>
              <p className="text-xs text-gray-300">
                This order has been cancelled. If you have questions or made an advance payment, please contact our restaurant hotline at {settings.phone}.
              </p>
            </div>
          ) : (
            <div className="py-2">
              <div className="relative">
                {/* Horizontal connection line for desktop */}
                <div className="hidden sm:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-[#23273a] z-0">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff6b00] to-[#84cc16] transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`
                    }}
                  ></div>
                </div>

                {/* 5 Stage Points */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const IconComponent = stage.icon;

                    return (
                      <div
                        key={stage.status}
                        className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2 rounded-xl transition-colors ${
                          isCurrent ? 'bg-[#181b29] sm:bg-transparent' : ''
                        }`}
                      >
                        {/* Icon Circle */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                            isCurrent
                              ? 'bg-[#ff6b00] border-[#ff6b00] text-white shadow-xl shadow-[#ff6b00]/40 scale-110'
                              : isDone
                              ? 'bg-[#84cc16] border-[#84cc16] text-black shadow-md shadow-[#84cc16]/20'
                              : 'bg-[#181a26] border-[#292c3f] text-gray-500'
                          }`}
                        >
                          <IconComponent className="w-5 h-5 stroke-[2.5]" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 sm:flex-none">
                          <div
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-[#ff6b00]' : isDone ? 'text-white' : 'text-gray-500'
                            }`}
                          >
                            {stage.label}
                          </div>
                          <p className="text-[11px] text-gray-400 leading-tight hidden sm:block mt-1">
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#161826] border border-[#232637] p-4 rounded-2xl space-y-1">
              <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#84cc16]" /> Estimated Time
              </span>
              <div className="text-base font-black text-white">
                {order.estimatedDeliveryMinutes || 35} mins
              </div>
              <div className="text-gray-400 text-[11px]">
                Target: {new Date(new Date(order.createdAt).getTime() + (order.estimatedDeliveryMinutes || 35) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="bg-[#161826] border border-[#232637] p-4 rounded-2xl space-y-1">
              <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" /> Destination
              </span>
              <div className="text-xs font-bold text-white truncate">{order.deliveryAddress}</div>
              <div className="text-gray-400 text-[11px] truncate">{order.cityArea}</div>
            </div>

            <div className="bg-[#161826] border border-[#232637] p-4 rounded-2xl space-y-1">
              <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Payment & Total
              </span>
              <div className="text-base font-black text-[#ff6b00]">
                {settings.currencySymbol} {(order.grandTotal ?? 0).toLocaleString()}
              </div>
              <div className="text-gray-400 text-[11px]">{order.paymentMethod}</div>
            </div>
          </div>

          {/* Status History Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-[#161826] border border-[#232637] p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Order Timeline Log
              </h3>
              <div className="space-y-3">
                {order.statusHistory.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{item.status}</span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-gray-300 text-[11px] mt-0.5">{item.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ordered Items Accordion */}
          <div className="bg-[#161826] border border-[#232637] p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Items in this Order ({order.items.length})</span>
            </h3>
            <div className="space-y-2.5 divide-y divide-[#212435]">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-black shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{item.productName}</div>
                      {item.variantName && (
                        <div className="text-[11px] text-[#84cc16] truncate">
                          Variant: {item.variantName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-gray-400 mr-2">{item.quantity}x</span>
                    <span className="font-bold text-white">
                      {settings.currencySymbol} {(item.totalPrice ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
