import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coupon } from '../../types';
import { Plus, Tag, Trash2, X, Check, Copy } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, createCoupon, updateCoupon, deleteCoupon, settings, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1000,
    description: '',
    expiryDate: '2026-12-31',
    isActive: true,
    usageLimit: 100
  });

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) {
      showToast('Please enter coupon code and discount amount', 'error');
      return;
    }

    try {
      await createCoupon({
        code: newCoupon.code.toUpperCase().trim(),
        discountType: newCoupon.discountType || 'percentage',
        discountValue: Number(newCoupon.discountValue),
        minOrderValue: Number(newCoupon.minOrderValue) || 0,
        description: newCoupon.description || 'Special promotion discount',
        expiryDate: newCoupon.expiryDate || '2026-12-31',
        isActive: newCoupon.isActive !== false,
        usageLimit: Number(newCoupon.usageLimit) || 100
      });
      setIsModalOpen(false);
      setNewCoupon({
        code: '',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 1000,
        description: '',
        expiryDate: '2026-12-31',
        isActive: true,
        usageLimit: 100
      });
    } catch {
      showToast('Error creating coupon', 'error');
    }
  };

  const handleToggleActive = async (c: Coupon) => {
    await updateCoupon(c.id, { isActive: !c.isActive });
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Delete coupon code "${code}"?`)) {
      await deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-['Outfit']">Coupons & Promo Codes</h2>
          <p className="text-xs text-gray-400">
            Create discount incentives and special marketing vouchers for customer orders.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map(c => (
          <div
            key={c.id}
            className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex flex-col justify-between hover:border-[#84cc16]/50 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-black text-lg text-[#84cc16] tracking-wider">
                  {c.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(c)}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                    c.isActive
                      ? 'bg-[#84cc16]/20 text-[#84cc16] border border-[#84cc16]/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="text-sm font-bold text-white mb-1">
                {c.discountType === 'percentage'
                  ? `${c.discountValue}% Off Total Order`
                  : `Flat ${settings.currencySymbol} ${c.discountValue} Off`}
              </div>

              <p className="text-xs text-gray-400 mb-3">{c.description}</p>

              <div className="text-[11px] text-gray-400 space-y-1 bg-[#161826] p-3 rounded-xl border border-[#222536]">
                <div className="flex justify-between">
                  <span>Minimum Order:</span>
                  <span className="text-white font-semibold">
                    {settings.currencySymbol} {c.minOrderValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <span className="text-white font-semibold">
                    {c.usedCount || 0} / {c.usageLimit || '∞'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span className="text-white font-semibold">{c.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-[#1c1e2b] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  showToast(`Copied ${c.code}`, 'info');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(c.id, c.code)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-md bg-[#11131c] border border-[#272a3d] rounded-3xl p-6 shadow-2xl text-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#212435] mb-4">
              <h3 className="text-base font-bold text-white">Create New Coupon</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#181a28] text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRUNCHY30"
                  value={newCoupon.code || ''}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={e =>
                      setNewCoupon({ ...newCoupon, discountType: e.target.value as any })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCoupon.discountValue || ''}
                    onChange={e =>
                      setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Min Order Value</label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.minOrderValue || ''}
                    onChange={e =>
                      setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={newCoupon.usageLimit || ''}
                    onChange={e =>
                      setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 15% discount on all family crunch combos"
                  value={newCoupon.description || ''}
                  onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={newCoupon.expiryDate || '2026-12-31'}
                  onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#212435] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#181a28] text-gray-400 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ff6b00] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
