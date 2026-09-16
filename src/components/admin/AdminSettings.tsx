import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RestaurantSettings } from '../../types';
import { Settings, Save, Store, Clock, Phone, MapPin, DollarSign, ShieldAlert } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [formData, setFormData] = useState<RestaurantSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      showToast('Restaurant settings updated successfully', 'success');
    } catch {
      showToast('Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">
            Restaurant Configuration & Store Status
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage store operating hours, delivery fees, contact lines, and store availability.
          </p>
        </div>

        {/* Live Store Toggle */}
        <div className="flex items-center gap-3 bg-[#181a28] border border-[#2b2f44] p-2.5 rounded-2xl">
          <Store className={`w-5 h-5 ${formData.isOpen ? 'text-[#84cc16]' : 'text-rose-400'}`} />
          <div className="text-xs">
            <div className="font-bold text-white">Store Status</div>
            <div className="text-[10px] text-gray-400">
              {formData.isOpen ? 'Accepting Orders' : 'Store Temporarily Closed'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isOpen: !formData.isOpen })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ml-2 ${
              formData.isOpen
                ? 'bg-[#84cc16] text-black shadow-md shadow-[#84cc16]/20'
                : 'bg-rose-600 text-white'
            }`}
          >
            {formData.isOpen ? 'OPEN' : 'CLOSED'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-[#212435] pb-3">
            Branch Identity & Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Restaurant Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Official Phone Line</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Operating City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-400 font-semibold mb-1">Physical Kitchen Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Pricing, Logistics & Timing */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-[#212435] pb-3">
            Pricing, Delivery & Operating Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Currency Code</label>
              <input
                type="text"
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Flat Delivery Fee (PKR)</label>
              <input
                type="number"
                min={0}
                value={formData.deliveryFee}
                onChange={e => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                min={0}
                value={formData.minOrderForFreeDelivery}
                onChange={e =>
                  setFormData({ ...formData, minOrderForFreeDelivery: Number(e.target.value) })
                }
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Tax Percentage (%)</label>
              <input
                type="number"
                min={0}
                value={formData.taxRatePercent}
                onChange={e => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Est. Delivery Time</label>
              <input
                type="text"
                value={formData.estimatedDeliveryTime}
                onChange={e => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Daily Opening Time</label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Daily Closing Time</label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                className="w-full bg-[#181a28] border border-[#272b3c] rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-[#ff6b00]/25 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Updates...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
