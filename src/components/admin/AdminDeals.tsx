import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal } from '../../types';
import { Plus, Edit2, Trash2, Sparkles, X, Tag } from 'lucide-react';

interface AdminDealsProps {
  forceOpenAddModal?: boolean;
  onModalClose?: () => void;
}

export const AdminDeals: React.FC<AdminDealsProps> = ({
  forceOpenAddModal,
  onModalClose
}) => {
  const { deals, createDeal, updateDeal, deleteDeal, settings, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(forceOpenAddModal || false);
  const [editingDeal, setEditingDeal] = useState<Partial<Deal> | null>(null);

  React.useEffect(() => {
    if (forceOpenAddModal) {
      handleOpenCreate();
    }
  }, [forceOpenAddModal]);

  const handleOpenCreate = () => {
    setEditingDeal({
      title: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80',
      itemsIncluded: ['4 Pcs Chicken', 'Fries', '2 Soft Drinks'],
      originalPrice: 2000,
      dealPrice: 1599,
      couponCode: 'COMBO10',
      badge: 'Save 20%',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal({ ...deal });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
    if (onModalClose) onModalClose();
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal || !editingDeal.title || !editingDeal.dealPrice) {
      showToast('Please fill in title and deal price', 'error');
      return;
    }

    try {
      if (editingDeal.id) {
        await updateDeal(editingDeal.id, editingDeal);
      } else {
        await createDeal(editingDeal as any);
      }
      closeModal();
    } catch {
      showToast('Error saving deal', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete promotion deal "${title}"?`)) {
      await deleteDeal(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-['Outfit']">Special Deals & Bundles</h2>
          <p className="text-xs text-gray-400">
            Configure featured promotions and discounted meal packages shown on the website.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Deal</span>
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deals.map(deal => (
          <div
            key={deal.id}
            className="bg-[#12141f] border border-[#232738] rounded-3xl overflow-hidden hover:border-[#ff6b00]/40 transition flex flex-col justify-between"
          >
            <div className="relative h-52 overflow-hidden bg-black">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
              {deal.originalPrice && deal.dealPrice && deal.originalPrice > deal.dealPrice ? (
                <div className="absolute top-3 left-3 bg-[#ff6b00] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                  Save Rs. {deal.originalPrice - deal.dealPrice}
                </div>
              ) : deal.discountText ? (
                <div className="absolute top-3 left-3 bg-[#ff6b00] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                  {deal.discountText}
                </div>
              ) : null}
              {deal.badge && (
                <div className="absolute top-3 right-3 bg-[#84cc16] text-black text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                  {deal.badge}
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 font-['Outfit']">{deal.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{deal.description || deal.subtitle || ''}</p>

                {deal.itemsIncluded && deal.itemsIncluded.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {deal.itemsIncluded.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-[#1a1d2c] text-gray-300 px-2.5 py-0.5 rounded-lg border border-[#262a3e]"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#1c1f2d] flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-white">
                    {settings.currencySymbol} {(deal.dealPrice ?? 0).toLocaleString()}
                  </span>
                  {deal.originalPrice != null && (
                    <span className="text-xs text-gray-500 line-through ml-2">
                      {settings.currencySymbol} {(deal.originalPrice ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(deal)}
                    className="p-2 rounded-xl bg-[#1a1d2c] hover:bg-[#ff6b00] text-gray-300 hover:text-white transition"
                    title="Edit deal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id, deal.title)}
                    className="p-2 rounded-xl bg-[#1a1d2c] hover:bg-rose-600 text-gray-300 hover:text-white transition"
                    title="Delete deal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deal Add/Edit Modal */}
      {isModalOpen && editingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-xl bg-[#11131c] border border-[#272a3d] rounded-3xl p-6 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#212435] mb-4">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                {editingDeal.id ? 'Edit Deal Bundle' : 'Create Special Deal'}
              </h3>
              <button
                onClick={closeModal}
                className="w-7 h-7 rounded-lg bg-[#181a28] text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={editingDeal.title || ''}
                  onChange={e => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  placeholder="e.g. Mega Family Feast Bundle"
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingDeal.description || ''}
                  onChange={e => setEditingDeal({ ...editingDeal, description: e.target.value })}
                  placeholder="Details of the combo deal..."
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Deal Price (PKR)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingDeal.dealPrice || ''}
                    onChange={e =>
                      setEditingDeal({ ...editingDeal, dealPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingDeal.originalPrice || ''}
                    onChange={e =>
                      setEditingDeal({ ...editingDeal, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingDeal.image || ''}
                  onChange={e => setEditingDeal({ ...editingDeal, image: e.target.value })}
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Save 25%"
                    value={editingDeal.badge || ''}
                    onChange={e => setEditingDeal({ ...editingDeal, badge: e.target.value })}
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Linked Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MEGA20"
                    value={editingDeal.couponCode || ''}
                    onChange={e => setEditingDeal({ ...editingDeal, couponCode: e.target.value })}
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">
                  Items Included (comma separated)
                </label>
                <input
                  type="text"
                  value={(editingDeal.itemsIncluded || []).join(', ')}
                  onChange={e =>
                    setEditingDeal({
                      ...editingDeal,
                      itemsIncluded: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  placeholder="e.g. 8 Pcs Chicken, Large Fries, 1.5L Coke"
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#212435] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-[#181a28] text-gray-400 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ff6b00] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
