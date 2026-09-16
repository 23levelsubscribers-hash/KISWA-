import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Drumstick,
  Sandwich,
  Scroll,
  UtensilsCrossed,
  CupSoda,
  IceCream,
  Salad,
  Sparkles
} from 'lucide-react';

const categoryIconMap: Record<string, React.ReactNode> = {
  'Fried Chicken': <Drumstick className="w-6 h-6 stroke-[2.2]" />,
  'Burgers': <Sandwich className="w-6 h-6 stroke-[2.2]" />,
  'Wraps': <Scroll className="w-6 h-6 stroke-[2.2]" />,
  'Sides': <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />,
  'Drinks': <CupSoda className="w-6 h-6 stroke-[2.2]" />,
  'Desserts': <IceCream className="w-6 h-6 stroke-[2.2]" />,
  'Healthy': <Salad className="w-6 h-6 stroke-[2.2]" />
};

export const CategoryList: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useApp();

  const activeCategories = categories.filter(c => c.isActive);

  return (
    <div id="category-filter-bar" className="w-full py-4 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-3 sm:gap-4 pb-2 min-w-max px-1">
        {/* All Items Tile */}
        <button
          id="cat-tile-all"
          onClick={() => setSelectedCategory('all')}
          className={`flex flex-col items-center justify-center w-22 h-24 sm:w-24 sm:h-26 rounded-2xl p-2.5 transition-all duration-200 shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#ff6b00] text-black font-extrabold shadow-lg shadow-[#ff6b00]/30 scale-105 ring-2 ring-[#ff6b00]'
              : 'bg-[#13151f] hover:bg-[#1a1c28] border border-[#212433] text-gray-300 hover:text-white'
          }`}
        >
          <div className="mb-2">
            <Sparkles className={`w-6 h-6 stroke-[2.2] ${selectedCategory === 'all' ? 'text-black' : 'text-[#ff6b00]'}`} />
          </div>
          <span className="text-xs font-bold text-center leading-tight">All</span>
          <span className={`text-[9px] mt-1 font-extrabold px-1.5 py-0.2 rounded-full ${
            selectedCategory === 'all' ? 'bg-black/20 text-black' : 'text-gray-500'
          }`}>
            {products.length}
          </span>
        </button>

        {/* Categories as Vertical Rounded Cards matching the screenshot */}
        {activeCategories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const count = products.filter(p => p.categoryId === cat.id && p.isAvailable).length;
          const icon = categoryIconMap[cat.name] || <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />;

          return (
            <button
              key={cat.id}
              id={`cat-tile-${cat.slug}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center w-22 h-24 sm:w-24 sm:h-26 rounded-2xl p-2.5 transition-all duration-200 shrink-0 group ${
                isSelected
                  ? 'bg-[#ff6b00] text-black font-black shadow-lg shadow-[#ff6b00]/30 scale-105 ring-2 ring-[#ff6b00]'
                  : 'bg-[#13151f] hover:bg-[#1a1c28] border border-[#212433] text-gray-300 hover:text-white'
              }`}
            >
              <div className={`mb-2 transition-transform duration-200 group-hover:scale-110 ${
                isSelected ? 'text-black' : 'text-gray-200 group-hover:text-[#ff6b00]'
              }`}>
                {icon}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-center leading-tight line-clamp-1">
                {cat.name}
              </span>
              <span className={`text-[9px] mt-0.5 font-bold ${
                isSelected ? 'text-black/80' : 'text-gray-500'
              }`}>
                {count} items
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
