import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Order, Product } from '../../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  Repeat,
  ShoppingBag,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut
} from 'lucide-react';

export const CustomerProfileView: React.FC = () => {
  const {
    customerUser,
    logoutCustomer,
    products,
    addToCart,
    openProductModal,
    trackOrder,
    settings,
    setCurrentView,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address add state
  const [newAddressLabel, setNewAddressLabel] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');
  const [newAddressArea, setNewAddressArea] = useState('Gulberg, Lahore');
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    if (customerUser) {
      setLoadingOrders(true);
      api.getCustomerOrders(customerUser.id)
        .then(setOrders)
        .catch(err => console.error('Error fetching orders:', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [customerUser?.id]);

  if (!customerUser) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-8">
          <User className="w-12 h-12 text-[#ff6b00] mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to View Profile</h2>
          <p className="text-sm text-gray-400 mb-6">
            Track your past orders, reorder favorite crunch meals, and manage delivery addresses.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-3 rounded-xl bg-[#ff6b00] text-white font-bold text-sm shadow-lg shadow-[#ff6b00]/25"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Favorite items
  const favoriteProducts = products.filter(p => customerUser.favoriteProductIds?.includes(p.id));

  // Reorder handler
  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    showToast(`Items from Order #${order.orderNumber} added to cart!`, 'success');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel,
      address: newAddressText.trim(),
      cityArea: newAddressArea,
      isDefault: (customerUser.addresses || []).length === 0
    };

    const updatedAddresses = [...(customerUser.addresses || []), newAddr];
    try {
      await api.updateCustomer(customerUser.id, { addresses: updatedAddresses });
      customerUser.addresses = updatedAddresses;
      localStorage.setItem('kaswah_customer', JSON.stringify(customerUser));
      setNewAddressText('');
      setShowAddAddress(false);
      showToast('New address saved!', 'success');
    } catch {
      showToast('Failed to save address', 'error');
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    const updated = (customerUser.addresses || []).filter(a => a.id !== addrId);
    try {
      await api.updateCustomer(customerUser.id, { addresses: updated });
      customerUser.addresses = updated;
      localStorage.setItem('kaswah_customer', JSON.stringify(customerUser));
      showToast('Address removed', 'info');
    } catch {
      showToast('Failed to remove address', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Overview Card */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff6b00] to-[#84cc16] flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {customerUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-['Outfit']">
                {customerUser.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#ff6b00]" /> {customerUser.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#84cc16]" /> {customerUser.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-400">Total Spent</div>
              <div className="text-base font-black text-[#84cc16]">
                {settings.currencySymbol} {(customerUser.totalSpend ?? 0).toLocaleString()}
              </div>
            </div>

            <button
              onClick={logoutCustomer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a1c2a] hover:bg-[#25283b] text-gray-300 hover:text-rose-400 text-xs font-semibold border border-[#2a2d3e] transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#1f2233]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/20'
                : 'bg-[#181a26] text-gray-300 hover:text-white'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'favorites'
                ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/20'
                : 'bg-[#181a26] text-gray-300 hover:text-white'
            }`}
          >
            Favorites ({favoriteProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'addresses'
                ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/20'
                : 'bg-[#181a26] text-gray-300 hover:text-white'
            }`}
          >
            Saved Addresses ({(customerUser.addresses || []).length})
          </button>
        </div>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 font-['Outfit']">
            Your Orders & Live Deliveries
          </h2>

          {loadingOrders ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading order records...</div>
          ) : orders.length === 0 ? (
            <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-10 text-center text-gray-400">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-600 mb-2" />
              <p className="text-sm">You have not placed any orders yet.</p>
              <button
                onClick={() => setCurrentView('menu')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white text-xs font-bold"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-[#12141f] border border-[#232738] hover:border-[#ff6b00]/40 rounded-3xl p-6 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2231]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-black text-white">{order.id}</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-[#84cc16]/20 text-[#84cc16]'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-[#ff6b00]/20 text-[#ff6b00] animate-pulse'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.orderType}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => trackOrder(order.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#191c2a] hover:bg-[#25283c] border border-[#2c3044] text-xs font-bold text-white flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#ff6b00]" />
                      <span>Track Order</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-[#ff6b00]/20 transition"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="py-4 space-y-2 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-300">
                      <span>
                        <strong className="text-white">{item.quantity}x</strong> {item.productName}
                        {item.variantName ? ` (${item.variantName})` : ''}
                      </span>
                      <span className="font-bold text-white">
                        {settings.currencySymbol} {(item.totalPrice ?? 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#1f2231] flex items-center justify-between text-xs">
                  <span className="text-gray-400">Payment: {order.paymentMethod}</span>
                  <div className="font-black text-sm text-[#ff6b00]">
                    Total: {settings.currencySymbol} {(order.grandTotal ?? 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Favorites */}
      {activeTab === 'favorites' && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 font-['Outfit']">
            Your Favorite Meals
          </h2>
          {favoriteProducts.length === 0 ? (
            <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-10 text-center text-gray-400">
              <Heart className="w-10 h-10 mx-auto text-gray-600 mb-2" />
              <p className="text-sm">You haven't marked any favorite items yet.</p>
              <button
                onClick={() => setCurrentView('menu')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white text-xs font-bold"
              >
                Discover Dishes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map(prod => (
                <div
                  key={prod.id}
                  className="bg-[#12141f] border border-[#232738] rounded-3xl p-4 flex flex-col justify-between"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-40 object-cover rounded-2xl mb-3"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">{prod.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 my-1">{prod.description}</p>
                    <div className="text-sm font-black text-[#ff6b00] mb-3">
                      {settings.currencySymbol} {(prod.price ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => openProductModal(prod)}
                    className="w-full py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold transition"
                  >
                    Order Again
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-['Outfit']">Saved Delivery Addresses</h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="bg-[#12141f] border border-[#ff6b00]/40 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Add Delivery Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Location Label</label>
                  <select
                    value={newAddressLabel}
                    onChange={e => setNewAddressLabel(e.target.value)}
                    className="w-full bg-[#181a28] border border-[#2b2e40] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">City / Area</label>
                  <input
                    type="text"
                    required
                    value={newAddressArea}
                    onChange={e => setNewAddressArea(e.target.value)}
                    placeholder="e.g. DHA Phase 5, Lahore"
                    className="w-full bg-[#181a28] border border-[#2b2e40] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Address / Street details</label>
                <input
                  type="text"
                  required
                  value={newAddressText}
                  onChange={e => setNewAddressText(e.target.value)}
                  placeholder="House #, Street #, Sector..."
                  className="w-full bg-[#181a28] border border-[#2b2e40] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 rounded-xl bg-[#1a1c2a] text-gray-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(customerUser.addresses || []).map(addr => (
              <div
                key={addr.id}
                className="bg-[#12141f] border border-[#232738] rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1d2d] text-[#ff6b00] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{addr.label}</h4>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[#84cc16]/10 text-[#84cc16] px-1.5 py-0.5 rounded font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{addr.address}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{addr.cityArea}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-gray-500 hover:text-rose-400 p-1 transition"
                  title="Remove address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
