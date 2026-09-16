import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { OrderType, PaymentMethod, OrderItemRecord } from '../../types';
import {
  MapPin,
  Phone,
  MessageCircle,
  CreditCard,
  Banknote,
  Building2,
  Bike,
  Store,
  ArrowLeft,
  CheckCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    discountAmount,
    taxAmount,
    grandTotal,
    appliedCoupon,
    settings,
    clearCart,
    setCurrentView,
    setLastConfirmedOrder,
    setTrackingOrderId,
    customerUser,
    showToast
  } = useApp();

  // Form State
  const [orderType, setOrderType] = useState<OrderType>('Home Delivery');
  const [fullName, setFullName] = useState(customerUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(customerUser?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(customerUser?.whatsapp || customerUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(customerUser?.addresses?.[0]?.address || '');
  const [cityArea, setCityArea] = useState(customerUser?.addresses?.[0]?.cityArea || 'Lahore');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect to menu
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="bg-[#12141e] border border-[#202334] rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-400 mb-6">
            Please add delicious crispy items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => setCurrentView('menu')}
            className="px-6 py-3 rounded-xl bg-[#ff6b00] text-white font-bold text-sm shadow-lg shadow-[#ff6b00]/25"
          >
            Browse Food Menu
          </button>
        </div>
      </div>
    );
  }

  const effectiveDeliveryFee = orderType === 'Pickup' ? 0 : deliveryFee;
  const effectiveGrandTotal = Math.max(0, subtotal - discountAmount + effectiveDeliveryFee + taxAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim()) {
      showToast('Please enter your full name and phone number', 'error');
      return;
    }

    if (orderType === 'Home Delivery' && !deliveryAddress.trim()) {
      showToast('Please enter a delivery address for Home Delivery', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems: OrderItemRecord[] = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        variantName: item.selectedVariant?.name,
        extras: item.selectedExtras.map(e => ({ name: e.name, price: e.price })),
        specialInstructions: item.specialInstructions,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      }));

      const newOrder = await api.createOrder({
        customerId: customerUser?.id,
        customerName: fullName.trim(),
        customerPhone: phoneNumber.trim(),
        customerWhatsApp: whatsappNumber.trim() || phoneNumber.trim(),
        customerEmail: customerUser?.email,
        deliveryAddress: orderType === 'Pickup' ? 'Counter Pickup - Main Branch' : deliveryAddress.trim(),
        cityArea: cityArea.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
        orderType,
        paymentMethod,
        paymentStatus: paymentMethod === 'Bank Transfer' ? 'Pending' : 'Pending',
        items: orderItems,
        subtotal,
        deliveryFee: effectiveDeliveryFee,
        discountAmount,
        appliedCouponCode: appliedCoupon?.code,
        taxAmount,
        grandTotal: effectiveGrandTotal,
        status: 'Pending',
        estimatedDeliveryMinutes: orderType === 'Pickup' ? 20 : 35
      });

      clearCart();
      setLastConfirmedOrder(newOrder);
      setTrackingOrderId(newOrder.id);
      setCurrentView('order-confirmation');
      showToast('🎉 Order placed successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Back Link */}
      <button
        type="button"
        onClick={() => setCurrentView('menu')}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
          Checkout & <span className="text-[#ff6b00]">Delivery</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review your items and complete your contact details below.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery details & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Order Type Toggle (Home Delivery vs Pickup) */}
            <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Select Order Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-order-type-delivery"
                  onClick={() => setOrderType('Home Delivery')}
                  className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border font-bold text-sm transition-all ${
                    orderType === 'Home Delivery'
                      ? 'bg-[#ff6b00] border-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/25'
                      : 'bg-[#181b28] border-[#292c3f] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <Bike className="w-5 h-5" />
                  <span>Home Delivery</span>
                </button>
                <button
                  type="button"
                  id="btn-order-type-pickup"
                  onClick={() => setOrderType('Pickup')}
                  className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border font-bold text-sm transition-all ${
                    orderType === 'Pickup'
                      ? 'bg-[#ff6b00] border-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/25'
                      : 'bg-[#181b28] border-[#292c3f] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span>Store Pickup (Free)</span>
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                <span className="w-6 h-6 rounded-full bg-[#ff6b00]/20 text-[#ff6b00] flex items-center justify-center text-xs font-black">
                  1
                </span>
                Customer Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="input-customer-name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Usman Tariq"
                    className="w-full bg-[#181a26] border border-[#272a3c] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">
                    Phone Number (for call) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      id="input-customer-phone"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-[#181a26] border border-[#272a3c] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">
                  WhatsApp Number (for real-time order updates)
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-[#84cc16] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    id="input-customer-whatsapp"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#181a26] border border-[#272a3c] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
              </div>

              {orderType === 'Home Delivery' && (
                <>
                  <div className="pt-2 border-t border-[#1e2130]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-gray-400 font-semibold mb-1">
                          City / Area <span className="text-rose-400">*</span>
                        </label>
                        <select
                          value={cityArea}
                          onChange={e => setCityArea(e.target.value)}
                          className="w-full bg-[#181a26] border border-[#272a3c] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                        >
                          <option value="Gulberg, Lahore">Gulberg, Lahore</option>
                          <option value="DHA Phase 1-6, Lahore">DHA Phase 1-6, Lahore</option>
                          <option value="Model Town, Lahore">Model Town, Lahore</option>
                          <option value="Johar Town, Lahore">Johar Town, Lahore</option>
                          <option value="Bahria Town, Lahore">Bahria Town, Lahore</option>
                          <option value="Faisal Town, Lahore">Faisal Town, Lahore</option>
                          <option value="Askari 10 & 11, Lahore">Askari 10 & 11, Lahore</option>
                          <option value="Other Area (Lahore)">Other Area (Lahore)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 font-semibold mb-1">
                          Full Delivery Address <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          id="input-delivery-address"
                          value={deliveryAddress}
                          onChange={e => setDeliveryAddress(e.target.value)}
                          placeholder="House/Apt #, Street #, Sector/Block"
                          className="w-full bg-[#181a26] border border-[#272a3c] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 font-semibold mb-1">
                        Optional Delivery Instructions for Rider
                      </label>
                      <input
                        type="text"
                        value={deliveryInstructions}
                        onChange={e => setDeliveryInstructions(e.target.value)}
                        placeholder="e.g. Ring bell twice, leave with security guard, call before arriving..."
                        className="w-full bg-[#181a26] border border-[#272a3c] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                <span className="w-6 h-6 rounded-full bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center text-xs font-black">
                  2
                </span>
                Select Payment Method
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-[#ff6b00]/10 border-[#ff6b00] text-white'
                      : 'bg-[#181a26] border-[#252839] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-[#ff6b00] w-4 h-4"
                    />
                    <Banknote className="w-5 h-5 text-[#84cc16]" />
                    <div>
                      <div className="font-bold text-sm text-white">Cash on Delivery (COD)</div>
                      <div className="text-xs text-gray-400">Pay cash to the rider when hot food arrives</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#84cc16] bg-[#84cc16]/10 px-2 py-0.5 rounded">
                    Popular
                  </span>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Bank Transfer'
                      ? 'bg-[#ff6b00]/10 border-[#ff6b00] text-white'
                      : 'bg-[#181a26] border-[#252839] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={() => setPaymentMethod('Bank Transfer')}
                      className="accent-[#ff6b00] w-4 h-4"
                    />
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-bold text-sm text-white">Bank Transfer / Raast / EasyPaisa / JazzCash</div>
                      <div className="text-xs text-gray-400">{settings.name} Account: Meezan Bank (0201-0104928192)</div>
                    </div>
                  </div>
                </label>

                {/* Online Card Payment */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Online Payment'
                      ? 'bg-[#ff6b00]/10 border-[#ff6b00] text-white'
                      : 'bg-[#181a26] border-[#252839] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Online Payment'}
                      onChange={() => setPaymentMethod('Online Payment')}
                      className="accent-[#ff6b00] w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-sky-400" />
                    <div>
                      <div className="font-bold text-sm text-white">Credit / Debit Card (Online)</div>
                      <div className="text-xs text-gray-400">Visa, Mastercard, PayPak gateway placeholder</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sticky top-24 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between font-['Outfit']">
                <span>Order Summary</span>
                <span className="text-xs font-normal text-gray-400">
                  {cart.length} items
                </span>
              </h3>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 pb-4 border-b border-[#1f2231]">
                {cart.map(item => (
                  <div key={item.cartItemId} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-[#1d202e] text-[#ff6b00] font-black flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </span>
                      <div className="truncate">
                        <span className="text-white font-medium truncate">{item.product.name}</span>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-gray-400 block truncate">
                            ({item.selectedVariant.name})
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-white shrink-0">
                      {settings.currencySymbol} {(item.totalPrice ?? 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2 text-xs text-gray-300 py-4 border-b border-[#1f2231]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">
                    {settings.currencySymbol} {(subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee ({orderType})</span>
                  <span className="text-white font-semibold">
                    {effectiveDeliveryFee === 0 ? (
                      <span className="text-[#84cc16] font-bold">FREE</span>
                    ) : (
                      `${settings.currencySymbol} ${(effectiveDeliveryFee ?? 0).toLocaleString()}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#84cc16]">
                    <span>Coupon Discount</span>
                    <span className="font-bold">
                      -{settings.currencySymbol} {(discountAmount ?? 0).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax ({settings.taxPercentage}%)</span>
                  <span className="text-white font-semibold">
                    {settings.currencySymbol} {(taxAmount ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between py-4 font-['Outfit']">
                <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-2xl font-black text-[#ff6b00]">
                  {settings.currencySymbol} {(effectiveGrandTotal ?? 0).toLocaleString()}
                </span>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-[#171a26] p-2.5 rounded-xl border border-[#23273a] mb-5">
                <ShieldCheck className="w-4 h-4 text-[#84cc16] shrink-0" />
                <span>{settings.name} Fresh Guarantee: Hot upon arrival or free replacement.</span>
              </div>

              {/* Place Order CTA */}
              <button
                id="btn-place-order"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] disabled:bg-gray-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-[#ff6b00]/30 transition hover:scale-[1.02] active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Transmitting Order...
                  </span>
                ) : (
                  <span>Place Order • {settings.currencySymbol} {(effectiveGrandTotal ?? 0).toLocaleString()}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
