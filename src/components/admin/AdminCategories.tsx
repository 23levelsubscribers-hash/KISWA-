import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, FolderTree, X, Check } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory, products, showToast } = useApp();

  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingCategory({
      name: '',
      slug: '',
      icon: 'drumstick',
      order: categories.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) {
      showToast('Please provide a category name', 'error');
      return;
    }

    const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, '-');

    try {
      if (editingCategory.id) {
        await updateCategory(editingCategory.id, {
          ...editingCategory,
          slug
        });
      } else {
        await createCategory({
          name: editingCategory.name,
          slug,
          icon: editingCategory.icon || 'drumstick',
          order: Number(editingCategory.order) || categories.length + 1,
          isActive: editingCategory.isActive !== false
        });
      }
      closeModal();
    } catch {
      showToast('Error saving category', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const productsInCat = products.filter(p => p.categoryId === id);
    if (productsInCat.length > 0) {
      showToast(`Cannot delete "${name}". It has ${productsInCat.length} products assigned.`, 'error');
      return;
    }
    if (window.confirm(`Delete category "${name}"?`)) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-['Outfit']">Menu Categories</h2>
          <p className="text-xs text-gray-400">
            Organize food sections for customer menu browsing.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex items-center justify-between hover:border-[#ff6b00]/40 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1a1d2c] border border-[#272b3d] text-[#84cc16] flex items-center justify-center font-bold">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{cat.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                        cat.isActive
                          ? 'bg-[#84cc16]/20 text-[#84cc16]'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {count} {count === 1 ? 'product' : 'products'} assigned
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-xl bg-[#1a1d2c] hover:bg-[#ff6b00] text-gray-300 hover:text-white transition"
                  title="Edit category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 rounded-xl bg-[#1a1d2c] hover:bg-rose-600 text-gray-300 hover:text-white transition"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-md bg-[#11131c] border border-[#272a3d] rounded-3xl p-6 shadow-2xl text-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#212435] mb-4">
              <h3 className="text-base font-bold text-white">
                {editingCategory.id ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={closeModal}
                className="w-7 h-7 rounded-lg bg-[#181a28] text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Loaded Burgers"
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. loaded-burgers"
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Display Order Position
                </label>
                <input
                  type="number"
                  value={editingCategory.order || 1}
                  onChange={e =>
                    setEditingCategory({ ...editingCategory, order: Number(e.target.value) })
                  }
                  className="w-full bg-[#181a28] border border-[#272a3c] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="py-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive !== false}
                    onChange={e =>
                      setEditingCategory({ ...editingCategory, isActive: e.target.checked })
                    }
                    className="accent-[#84cc16] w-4 h-4"
                  />
                  <span>Display on Customer Website</span>
                </label>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
