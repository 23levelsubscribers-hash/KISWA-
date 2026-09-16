import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Filter,
  Eye,
  Printer,
  X,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Bike,
  ChefHat,
  PackageCheck,
  Smile,
  Ban
} from 'lucide-react';

interface AdminOrdersProps {
  selectedOrderId?: string | null;
  onClearSelectedOrder?: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  selectedOrderId,
  onClearSelectedOrder
}) => {
  const { orders, updateOrderStatus, cancelOrder, settings, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [cancelReasonInput, setCancelReasonInput] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  // If parent passed selectedOrderId, open it
  React.useEffect(() => {
    if (selectedOrderId) {
      const match = orders.find(o => o.id === selectedOrderId);
      if (match) {
        setActiveModalOrder(match);
      }
    }
  }, [selectedOrderId, orders]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!activeModalOrder) return;
    await updateOrderStatus(activeModalOrder.id, newStatus, adminNoteInput || undefined);
    setAdminNoteInput('');
    // Refresh modal order reference
    const updated = orders.find(o => o.id === activeModalOrder.id);
    if (updated) {
      setActiveModalOrder(updated);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    if (!cancelReasonInput.trim()) {
      showToast('Please enter a reason for cancellation', 'error');
      return;
    }
    await cancelOrder(activeModalOrder.id, cancelReasonInput);
    setShowCancelPrompt(false);
    setCancelReasonInput('');
    const updated = orders.find(o => o.id === activeModalOrder.id);
    if (updated) {
      setActiveModalOrder(updated);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusOptions: OrderStatus[] = [
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Delivered'
  ];

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, order ID, phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#181a28] border border-[#272b3c] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {['all', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map(
            status => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/20'
                    : 'bg-[#181a28] text-gray-400 hover:text-white border border-[#242738]'
                }`}
              >
                {status === 'all' ? 'All Orders' : status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0e1018] border-b border-[#202334] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-4 pl-6">Order ID</th>
                <th className="py-4">Time</th>
                <th className="py-4">Customer Details</th>
                <th className="py-4">Type & Area</th>
                <th className="py-4">Items</th>
                <th className="py-4">Total Amount</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-right pr-6">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1e2c]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#161826] transition-colors">
                    <td className="py-4 pl-6 font-mono font-bold text-white">
                      {order.id}
                    </td>
                    <td className="py-4 text-gray-400">
                      <div>
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-gray-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-gray-200">{order.orderType}</div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[140px]">
                        {order.cityArea}
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">
                      {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="py-4 font-black text-white">
                      {settings.currencySymbol} {(order.grandTotal ?? 0).toLocaleString()}
                      <div className="text-[10px] text-gray-400 font-normal">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-[#84cc16]/20 text-[#84cc16] border border-[#84cc16]/30'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30 animate-pulse'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-6">
                      <button
                        onClick={() => setActiveModalOrder(order)}
                        className="px-3.5 py-2 rounded-xl bg-[#1e2130] hover:bg-[#ff6b00] text-gray-200 hover:text-white font-bold transition inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Management Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-3xl bg-[#11131c] border border-[#282c3f] rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#212435]">
              <div className="flex items-center gap-3">
                <div className="font-mono text-xl font-black text-white">
                  {activeModalOrder.id}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                    activeModalOrder.status === 'Delivered'
                      ? 'bg-[#84cc16]/20 text-[#84cc16]'
                      : activeModalOrder.status === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-[#ff6b00]/20 text-[#ff6b00]'
                  }`}
                >
                  {activeModalOrder.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReceiptPreview(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#181a28] hover:bg-[#23273a] text-gray-300 text-xs font-semibold border border-[#2b2f44] flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModalOrder(null);
                    if (onClearSelectedOrder) onClearSelectedOrder();
                  }}
                  className="w-8 h-8 rounded-xl bg-[#181a28] hover:bg-[#23273a] text-gray-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content Scrollable */}
            <div className="overflow-y-auto flex-1 py-4 space-y-6">
              {/* Status Changer Buttons */}
              <div className="bg-[#161826] border border-[#252838] p-4 rounded-2xl">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Progress Order Status:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {statusOptions.map(status => {
                    const isCurrent = activeModalOrder.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(status)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                          isCurrent
                            ? 'bg-[#ff6b00] border-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/25'
                            : 'bg-[#1b1e2c] border-[#292c3d] text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer & Delivery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#161826] border border-[#252838] p-4 rounded-2xl space-y-2">
                  <div className="font-bold text-gray-400 uppercase tracking-wider">
                    Customer Information
                  </div>
                  <div className="text-sm font-bold text-white">{activeModalOrder.customerName}</div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <a href={`tel:${activeModalOrder.customerPhone}`} className="hover:underline">
                      {activeModalOrder.customerPhone}
                    </a>
                  </div>
                  {activeModalOrder.customerWhatsApp && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MessageCircle className="w-3.5 h-3.5 text-[#84cc16]" />
                      <a
                        href={`https://wa.me/${activeModalOrder.customerWhatsApp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-emerald-400"
                      >
                        WhatsApp: {activeModalOrder.customerWhatsApp}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-[#161826] border border-[#252838] p-4 rounded-2xl space-y-2">
                  <div className="font-bold text-gray-400 uppercase tracking-wider">
                    Delivery & Logistics
                  </div>
                  <div className="font-bold text-white">{activeModalOrder.orderType}</div>
                  <div className="text-gray-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff6b00] shrink-0 mt-0.5" />
                    <span>
                      {activeModalOrder.deliveryAddress} ({activeModalOrder.cityArea})
                    </span>
                  </div>
                  {activeModalOrder.deliveryInstructions && (
                    <div className="text-amber-300 italic text-[11px]">
                      Instructions: "{activeModalOrder.deliveryInstructions}"
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="bg-[#161826] border border-[#252838] p-4 rounded-2xl space-y-3">
                <div className="font-bold text-gray-400 uppercase tracking-wider text-xs">
                  Food Order Items
                </div>
                <div className="divide-y divide-[#202334] text-xs">
                  {activeModalOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#222538] text-[#ff6b00] font-black flex items-center justify-center">
                          {item.quantity}x
                        </span>
                        <div>
                          <div className="font-bold text-white">{item.productName}</div>
                          {item.variantName && (
                            <div className="text-[11px] text-[#84cc16]">
                              Variant: {item.variantName}
                            </div>
                          )}
                          {item.extras && item.extras.length > 0 && (
                            <div className="text-[10px] text-gray-400">
                              Extras: {item.extras.map(e => e.name).join(', ')}
                            </div>
                          )}
                          {item.specialInstructions && (
                            <div className="text-[10px] text-amber-300 italic">
                              "{item.specialInstructions}"
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-white">
                        {settings.currencySymbol} {(item.totalPrice ?? 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-[#23273a] space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{settings.currencySymbol} {(activeModalOrder.subtotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{settings.currencySymbol} {(activeModalOrder.deliveryFee ?? 0).toLocaleString()}</span>
                  </div>
                  {activeModalOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-[#84cc16]">
                      <span>Discount ({activeModalOrder.appliedCouponCode})</span>
                      <span>-{settings.currencySymbol} {(activeModalOrder.discountAmount ?? 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-[#ff6b00] pt-2 border-t border-[#202334]">
                    <span>Grand Total</span>
                    <span>{settings.currencySymbol} {(activeModalOrder.grandTotal ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Internal Admin Note & Timeline */}
              <div className="bg-[#161826] border border-[#252838] p-4 rounded-2xl space-y-3">
                <div className="font-bold text-gray-400 uppercase tracking-wider text-xs">
                  Kitchen Log / Timeline Notes
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={e => setAdminNoteInput(e.target.value)}
                    placeholder="Add an update note (e.g. Rider dispatched on Honda 125)..."
                    className="flex-1 bg-[#1c1f2e] border border-[#2b2f44] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                  />
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeModalOrder.status)}
                    className="px-4 py-2 bg-[#262a3d] hover:bg-[#32374e] rounded-xl text-xs font-bold text-white transition"
                  >
                    Add Note
                  </button>
                </div>

                {activeModalOrder.statusHistory && (
                  <div className="space-y-1 text-[11px] text-gray-400 mt-2">
                    {activeModalOrder.statusHistory.map((h, i) => (
                      <div key={i} className="flex justify-between py-0.5 border-b border-[#1f2231]">
                        <span>
                          <strong className="text-white">{h.status}</strong>
                          {h.note ? ` - ${h.note}` : ''}
                        </span>
                        <span className="font-mono text-gray-500">
                          {new Date(h.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cancel Prompt */}
              {showCancelPrompt ? (
                <form onSubmit={handleCancelSubmit} className="bg-[#261316] border border-rose-500/40 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Confirm Order Cancellation</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={cancelReasonInput}
                    onChange={e => setCancelReasonInput(e.target.value)}
                    placeholder="Reason for cancellation (e.g. Customer requested, address unserviceable)..."
                    className="w-full bg-[#1e1416] border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-3 py-1.5 bg-transparent text-gray-300 text-xs font-bold"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </form>
              ) : (
                activeModalOrder.status !== 'Cancelled' &&
                activeModalOrder.status !== 'Delivered' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(true)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold underline"
                    >
                      Cancel this order
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {showReceiptPreview && activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white text-black p-8 rounded-2xl max-w-sm w-full font-mono text-xs shadow-2xl relative">
            <button
              onClick={() => setShowReceiptPreview(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3 border-b-2 border-dashed border-black">
              <h2 className="text-lg font-black tracking-tighter">{settings.name}</h2>
              <p className="text-[10px]">{settings.address}, {settings.city}</p>
              <p className="text-[10px]">Ph: {settings.phone}</p>
              <p className="text-[10px] mt-1 font-bold">KITCHEN TICKET / TAX RECEIPT</p>
            </div>

            <div className="py-3 border-b border-dashed border-black text-[11px] space-y-0.5">
              <div>Order: <strong>{activeModalOrder.id}</strong></div>
              <div>Date: {activeModalOrder.createdAt ? new Date(activeModalOrder.createdAt).toLocaleString() : ''}</div>
              <div>Customer: {activeModalOrder.customerName} ({activeModalOrder.customerPhone})</div>
              <div>Type: {activeModalOrder.orderType}</div>
              <div>Address: {activeModalOrder.deliveryAddress}</div>
            </div>

            <div className="py-3 border-b border-dashed border-black space-y-1.5">
              {activeModalOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.quantity}x {item.productName}</span>
                  <span>Rs. {item.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="py-3 border-b-2 border-dashed border-black space-y-1 text-right">
              <div>Subtotal: Rs. {activeModalOrder.subtotal}</div>
              <div>Delivery: Rs. {activeModalOrder.deliveryFee}</div>
              {activeModalOrder.discountAmount > 0 && (
                <div>Discount: -Rs. {activeModalOrder.discountAmount}</div>
              )}
              <div className="text-sm font-black pt-1 border-t border-black">
                TOTAL: Rs. {activeModalOrder.grandTotal}
              </div>
              <div className="text-[10px]">Method: {activeModalOrder.paymentMethod}</div>
            </div>

            <div className="text-center pt-3 text-[10px] text-gray-600">
              <p>Thank you for choosing {settings.name}!</p>
              <p>Hot, crunchy & made fresh for you.</p>
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Send to Thermal Printer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
