import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, SlidersHorizontal, Flame, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onToggleFilters?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onToggleFilters }) => {
  const { searchQuery, setSearchQuery, setCurrentView } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu-section') || document.getElementById('signature-dishes-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('menu');
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#07080c] border-b border-[#181a24]">
      {/* Background Graphic & Chef Image with Atmospheric Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1600&auto=format&fit=crop&q=85"
          alt="Chef preparing fresh crispy fried chicken"
          className="w-full h-full object-cover object-top opacity-30 lg:opacity-40 filter contrast-125"
          referrerPolicy="no-referrer"
        />
        {/* Dark Vignettes to guarantee contrast and deep black atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-[#07080c]/90 to-transparent"></div>
        {/* Golden flame/spark glowing ambient lights */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#ff6b00]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Search Area */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Handwritten / Brush Script Heading matching the screenshot */}
            <div className="mb-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight font-['Permanent_Marker','Kaushan_Script','Outfit',sans-serif]">
                <span className="block drop-shadow-lg">Crispy</span>
                <span className="block drop-shadow-lg">Flavor,</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] via-[#ff8800] to-[#ffa500] drop-shadow-[0_4px_16px_rgba(255,107,0,0.4)]">
                  Delivered Fast
                </span>
              </h1>
              {/* Handwritten style decorative underline stroke */}
              <div className="w-48 sm:w-64 h-1.5 bg-gradient-to-r from-[#ff6b00] to-transparent rounded-full mt-2"></div>
            </div>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-gray-300 font-medium mb-7 max-w-md leading-relaxed">
              Hot, crunchy & made fresh for you.
            </p>

            {/* Pill Search Bar with Orange Circular Filter Button */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-md bg-[#13151f]/95 border border-[#232635] p-1.5 pl-4 rounded-full shadow-2xl flex items-center gap-2 focus-within:border-[#ff6b00] transition-colors"
            >
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for meals, combos, drinks..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 py-2 focus:outline-none"
              />
              <button
                id="btn-hero-filter"
                type="button"
                onClick={() => {
                  if (onToggleFilters) {
                    onToggleFilters();
                  } else {
                    const el = document.getElementById('category-filter-bar');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-10 h-10 rounded-full bg-[#ff6b00] hover:bg-[#e65500] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#ff6b00]/30 transition transform active:scale-90"
                title="Filter menu"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Area: Showcase crispy golden chicken with wire rack and sparks */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
            <div className="relative w-full max-w-sm group">
              {/* Glowing halo behind food */}
              <div className="absolute inset-0 m-auto w-64 h-64 rounded-full bg-gradient-to-tr from-[#ff6b00]/25 to-amber-500/20 blur-2xl animate-pulse"></div>

              <div className="relative rounded-3xl overflow-hidden border border-[#242738] shadow-2xl shadow-black/90">
                <img
                  src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=85"
                  alt="Crispy Golden Fried Chicken"
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#a3e635] tracking-wider">
                      ★ CHEF SIGNATURE
                    </span>
                    <div className="text-sm font-bold text-white">Crispy Chicken Bucket</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#ff6b00] font-black">Rs. 1,890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
