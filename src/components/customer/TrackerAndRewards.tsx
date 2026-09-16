import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Flame, Bike, Home, Gift, Award, ArrowRight } from 'lucide-react';

export const TrackerAndRewards: React.FC = () => {
  const { setCurrentView, customerUser } = useApp();

  const handleTrackOrderClick = () => {
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRewardsClick = () => {
    setCurrentView('deals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Live Order Tracker */}
        <div className="bg-[#12141c] hover:bg-[#161824] border border-[#202332] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight font-['Outfit']">
                  Live Order Tracker
                </h3>
                <span className="text-base">🛵</span>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                ETA: <strong className="text-[#a3e635]">18–22 min</strong>
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-5">
              Your order is being prepared with crisp perfection!
            </p>

            {/* 4-Step Interactive Timeline matching the screenshot */}
            <div className="relative flex items-center justify-between px-2 mb-6">
              {/* Connecting Background Line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#1f2230] z-0"></div>
              {/* Active Progress Highlight */}
              <div className="absolute left-6 right-1/2 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#a3e635] to-[#ff6b00] z-0"></div>

              {/* Step 1: Confirmed */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#a3e635] text-black flex items-center justify-center font-bold shadow-md ring-4 ring-[#12141c]">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-gray-300 mt-1.5">Confirmed</span>
              </div>

              {/* Step 2: Preparing (Active Hot) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#ff6b00] text-white flex items-center justify-center font-bold shadow-lg shadow-[#ff6b00]/40 ring-4 ring-[#12141c] animate-pulse">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
                <span className="text-[10px] font-black text-[#ff6b00] mt-1.5">Preparing</span>
              </div>

              {/* Step 3: On the way */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#1e202d] text-gray-400 flex items-center justify-center ring-4 ring-[#12141c]">
                  <Bike className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-1.5">On the way</span>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#1e202d] text-gray-400 flex items-center justify-center ring-4 ring-[#12141c]">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-1.5">Delivered</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1a1c28]">
            <span className="text-xs text-gray-400">
              Active Order: <strong className="text-white">#KW-8921</strong>
            </span>
            <button
              id="btn-track-order-tile"
              onClick={handleTrackOrderClick}
              className="text-xs font-black text-[#ff6b00] hover:text-[#ff8533] flex items-center gap-1 group py-1"
            >
              <span>Track Order</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Card: Crunch Rewards */}
        <div className="bg-[#12141c] hover:bg-[#161824] border border-[#202332] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight font-['Outfit']">
                  Crunch Rewards
                </h3>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <span className="bg-amber-400/15 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/30">
                Gold Tier Member
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-4">
              Earn points with every bite. Get delicious free meals!
            </p>

            {/* Points Summary & Progress Bar */}
            <div className="bg-[#181a26] border border-[#26293a] rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-semibold">Your Points Balance</span>
                <span className="text-base font-black text-amber-400 flex items-center gap-1">
                  <span>🪙</span>
                  <span>1,250 pts</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#0f1017] rounded-full overflow-hidden mb-1.5 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#ff6b00] rounded-full"
                  style={{ width: '62%' }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Current: 1,250 pts</span>
                <span className="text-gray-300 font-bold">Next Reward: 2,000 pts (Free Loaded Fries) 🍟</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1a1c28]">
            <span className="text-xs text-gray-400">
              Redeem rewards at checkout
            </span>
            <button
              id="btn-view-rewards-tile"
              onClick={handleRewardsClick}
              className="text-xs font-black text-[#ff6b00] hover:text-[#ff8533] flex items-center gap-1 group py-1"
            >
              <span>View Rewards</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
