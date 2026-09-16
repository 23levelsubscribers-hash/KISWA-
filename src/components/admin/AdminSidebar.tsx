import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Drumstick,
  FolderTree,
  Users,
  Tag,
  Sparkles,
  Bell,
  BarChart3,
  Settings,
  Flame,
  ArrowLeft,
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileOpen,
  setMobileOpen
}) => {
  const {
    adminUser,
    logoutAdmin,
    setCurrentView,
    activeOrdersCount,
    unreadAdminCount,
    settings
  } = useApp();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: activeOrdersCount },
    { id: 'products', label: 'Products', icon: Drumstick },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'deals', label: 'Deals & Combos', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadAdminCount },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Restaurant Settings', icon: Settings }
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0d0e15] border-r border-[#1e2130] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-[#1b1e2c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#e05600] flex items-center justify-center text-white shadow-md shadow-[#ff6b00]/25">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-base text-white font-['Outfit'] truncate max-w-[140px]">
                  {settings.name || 'RAJOWAL CRICKET'}
                </div>
                <div className="text-[10px] font-bold text-[#84cc16] uppercase tracking-wider">
                  Admin Command
                </div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {menuItems.map(item => {
              const isActive = currentTab === item.id;
              const IconComp = item.icon;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/20'
                      : 'text-gray-300 hover:text-white hover:bg-[#161824]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-[#ff6b00] text-white shadow-sm'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#1b1e2c] space-y-2">
          {/* Back to Customer Web */}
          <button
            type="button"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#141622] hover:bg-[#1d2030] text-gray-300 hover:text-white text-xs font-semibold border border-[#242738] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>Visit Customer Website</span>
          </button>

          {/* Admin User info & logout */}
          <div className="bg-[#141622] border border-[#242738] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center font-bold text-xs shrink-0">
                A
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {adminUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {adminUser?.role || 'Super Admin'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logoutAdmin}
              className="text-gray-400 hover:text-rose-400 p-1 transition"
              title="Logout of admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
