import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, VariantOption, ProductExtra } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  Flame,
  X,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface AdminProductsProps {
  forceOpenAddModal?: boolean;
  onModalClose?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  forceOpenAddModal,
  onModalClose
}) => {
  const {
    products,
    categories,
    createProduct,
    updateProduct,
    deleteProduct,
    settings,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(forceOpenAddModal || false);

  // Variant editing state
  const [tempVariantName, setTempVariantName] = useState('');
  const [tempVariantDelta, setTempVariantDelta] = useState(0);

  // Extra editing state
  const [tempExtraName, setTempExtraName] = useState('');
  const [tempExtraPrice, setTempExtraPrice] = useState(0);

  React.useEffect(() => {
    if (forceOpenAddModal) {
      handleOpenCreate();
    }
  }, [forceOpenAddModal]);

  const handleOpenCreate = () => {
    setEditingProduct({
      name: '',
      categoryId: categories[0]?.id || 'cat-1',
      categoryName: categories[0]?.name || 'Fried Chicken',
      price: 500,
      originalPrice: 600,
      description: '',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
      isBestseller: false,
      isAvailable: true,
      preparationTimeMinutes: 15,
      calories: 550,
      spiciness: 'Medium',
      variants: [],
      extras: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    if (onModalClose) onModalClose();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) {
      showToast('Please fill in required fields (Name & Price)', 'error');
      return;
    }

    const selectedCat = categories.find(c => c.id === editingProduct.categoryId);
    const categoryName = selectedCat ? selectedCat.name : 'Meals';

    try {
      if (editingProduct.id) {
        await updateProduct(editingProduct.id, {
          ...editingProduct,
          categoryName
        });
      } else {
        await createProduct({
          ...editingProduct,
          categoryName
        } as any);
      }
      closeModal();
    } catch {
      showToast('Error saving product', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      await deleteProduct(id);
    }
  };

  // Add Variant
  const handleAddVariant = () => {
    if (!tempVariantName.trim()) return;
    const newVariant: VariantOption = {
      id: `var-${Date.now()}`,
      name: tempVariantName.trim(),
      priceDelta: Number(tempVariantDelta) || 0
    };
    setEditingProduct(prev => ({
      ...prev,
      variants: [...(prev?.variants || []), newVariant]
    }));
    setTempVariantName('');
    setTempVariantDelta(0);
  };

  const handleRemoveVariant = (varId: string) => {
    setEditingProduct(prev => ({
      ...prev,
      variants: (prev?.variants || []).filter(v => v.id !== varId)
    }));
  };

  // Add Extra
  const handleAddExtra = () => {
    if (!tempExtraName.trim()) return;
    const newExtra: ProductExtra = {
      id: `ext-${Date.now()}`,
      name: tempExtraName.trim(),
      price: Number(tempExtraPrice) || 0
    };
    setEditingProduct(prev => ({
      ...prev,
      extras: [...(prev?.extras || []), newExtra]
    }));
    setTempExtraName('');
    setTempExtraPrice(0);
  };

  const handleRemoveExtra = (extId: string) => {
    setEditingProduct(prev => ({
      ...prev,
      extras: (prev?.extras || []).filter(e => e.id !== extId)
    }));
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar: Search, Category Filter & Add CTA */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes by title or ingredients..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#181a28] border border-[#272b3c] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#181a28] border border-[#272b3c] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          id="btn-admin-add-product"
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(prod => (
          <div
            key={prod.id}
            className="bg-[#12141f] border border-[#232738] rounded-3xl overflow-hidden p-4 flex flex-col justify-between hover:border-[#ff6b00]/40 transition group"
          >
            <div>
              {/* Image & Quick Toggles */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-3">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {prod.isBestseller && (
                    <span className="bg-[#ff6b00] text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Bestseller
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      prod.isAvailable
                        ? 'bg-[#84cc16] text-black'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Title & Category */}
              <div className="mb-2">
                <span className="text-[10px] text-[#84cc16] font-bold uppercase tracking-wider">
                  {prod.categoryName}
                </span>
                <h3 className="text-white font-bold text-base leading-tight mt-0.5">
                  {prod.name}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 mt-1">{prod.description}</p>
              </div>

              {/* Customizations Tag */}
              <div className="text-[11px] text-gray-500 space-y-0.5 mb-3">
                <div>Variants: {prod.variants?.length || 0}</div>
                <div>Add-ons: {prod.extras?.length || 0}</div>
              </div>
            </div>

            {/* Bottom Price & Actions */}
            <div className="pt-3 border-t border-[#1c1e2c] flex items-center justify-between">
              <div>
                <span className="text-base font-black text-white">
                  {settings.currencySymbol} {(prod.price ?? 0).toLocaleString()}
                </span>
                {prod.originalPrice && (
                  <span className="text-xs text-gray-500 line-through ml-1.5">
                    {settings.currencySymbol} {(prod.originalPrice ?? 0).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(prod)}
                  className="p-2 rounded-xl bg-[#1a1d2c] hover:bg-[#ff6b00] text-gray-300 hover:text-white transition"
                  title="Edit product"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(prod.id, prod.name)}
                  className="p-2 rounded-xl bg-[#1a1d2c] hover:bg-rose-600 text-gray-300 hover:text-white transition"
                  title="Delete product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-[#11131c] border border-[#272a3d] rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#212435]">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {editingProduct.id ? 'Edit Menu Product' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-xl bg-[#181a28] hover:bg-[#23273a] text-gray-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto flex-1 py-4 space-y-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Dish Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Kaswah Crispy Drumsticks"
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Selling Price (PKR) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Original / Strikethrough Price (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.originalPrice || ''}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })
                    }
                    placeholder="Optional for discount display"
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Describe ingredients, crunchiness, and spice blend..."
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.image || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* Prep time, Calories, Spiciness */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={editingProduct.preparationTimeMinutes || 15}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        preparationTimeMinutes: Number(e.target.value)
                      })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={editingProduct.calories || 500}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, calories: Number(e.target.value) })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Spiciness</label>
                  <select
                    value={editingProduct.spiciness || 'Medium'}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, spiciness: e.target.value as any })
                    }
                    className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot 🌶️</option>
                    <option value="Extra Hot">Extra Hot 🔥</option>
                  </select>
                </div>
              </div>

              {/* Toggles (Bestseller & Available) */}
              <div className="flex flex-wrap gap-6 py-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestseller || false}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })
                    }
                    className="accent-[#ff6b00] w-4 h-4"
                  />
                  <span>Mark as Chef Bestseller Badge</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable !== false}
                    onChange={e =>
                      setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })
                    }
                    className="accent-[#84cc16] w-4 h-4"
                  />
                  <span>Available in Kitchen (In Stock)</span>
                </label>
              </div>

              {/* Variants Configuration */}
              <div className="bg-[#161826] border border-[#242738] p-4 rounded-2xl space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  Variants (e.g. Size, Crust, Spice Level)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Variant name (e.g. Spicy Crispy Crust)"
                    value={tempVariantName}
                    onChange={e => setTempVariantName(e.target.value)}
                    className="flex-1 bg-[#1a1d2c] border border-[#282b3d] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Price Delta (+PKR)"
                    value={tempVariantDelta || ''}
                    onChange={e => setTempVariantDelta(Number(e.target.value))}
                    className="w-28 bg-[#1a1d2c] border border-[#282b3d] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1.5 rounded-xl bg-[#26293d] hover:bg-[#ff6b00] text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(editingProduct.variants || []).map(v => (
                    <span
                      key={v.id}
                      className="inline-flex items-center gap-1.5 bg-[#1e2133] border border-[#2e324c] px-2.5 py-1 rounded-lg text-xs text-white"
                    >
                      <span>
                        {v.name} (+Rs. {v.priceDelta})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="text-gray-400 hover:text-rose-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Add-ons / Extras Configuration */}
              <div className="bg-[#161826] border border-[#242738] p-4 rounded-2xl space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  Add-ons / Extras (e.g. Garlic Mayo Dip, Extra Cheese)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add-on name (e.g. Garlic Mayo Dip)"
                    value={tempExtraName}
                    onChange={e => setTempExtraName(e.target.value)}
                    className="flex-1 bg-[#1a1d2c] border border-[#282b3d] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Price (+PKR)"
                    value={tempExtraPrice || ''}
                    onChange={e => setTempExtraPrice(Number(e.target.value))}
                    className="w-28 bg-[#1a1d2c] border border-[#282b3d] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddExtra}
                    className="px-3 py-1.5 rounded-xl bg-[#26293d] hover:bg-[#84cc16] hover:text-black text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(editingProduct.extras || []).map(e => (
                    <span
                      key={e.id}
                      className="inline-flex items-center gap-1.5 bg-[#1e2133] border border-[#2e324c] px-2.5 py-1 rounded-lg text-xs text-white"
                    >
                      <span>
                        {e.name} (+Rs. {e.price})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExtra(e.id)}
                        className="text-gray-400 hover:text-rose-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#212435] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl bg-[#1a1d2c] text-gray-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold shadow-lg shadow-[#ff6b00]/25"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
