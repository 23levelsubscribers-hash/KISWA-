import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, setIsAdminLoginOpen, adminUser } = useApp();

  return (
    <footer className="bg-[#090a0e] text-gray-400 border-t border-[#1c1e28] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#181a24]">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#e05600] flex items-center justify-center text-white shadow-md shadow-[#ff6b00]/20">
                <Flame className="w-6 h-6" />
              </div>
              <div className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                {settings.name ? settings.name.split(' ')[0] : 'RAJOWAL'}{' '}
                <span className="text-[#ff6b00]">
                  {settings.name && settings.name.split(' ').length > 1
                    ? settings.name.split(' ').slice(1).join(' ')
                    : 'CRICKET'}
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Crispy flavor, delivered fast. We use only 100% prime fresh chicken, hand-breaded daily with our secret recipe of 11 authentic spices.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#141620] hover:bg-[#ff6b00] text-gray-400 hover:text-white flex items-center justify-center transition"
                title="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#141620] hover:bg-[#ff6b00] text-gray-400 hover:text-white flex items-center justify-center transition"
                title="Instagram"
              >
                <span className="text-xs font-bold">ig</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#141620] hover:bg-[#84cc16] text-gray-400 hover:text-black flex items-center justify-center transition"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide font-['Outfit']">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#ff6b00] transition"
                >
                  Full Menu & Combos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('deals');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#ff6b00] transition"
                >
                  Special Deals & Promotions
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#ff6b00] transition"
                >
                  Track Live Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#ff6b00] transition"
                >
                  Our Freshness Commitment
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#ff6b00] transition"
                >
                  Branch Locations & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide font-['Outfit']">
              Store & Hotline
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}, {settings.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#84cc16] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-medium">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white font-medium"
                >
                  WhatsApp: {settings.whatsapp}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Quality & Admin Portal */}
          <div className="bg-[#12141d] p-5 rounded-2xl border border-[#202330]">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#84cc16]"></span>
              Restaurant Management
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Store managers can update the menu, edit prices, oversee kitchen orders, and configure deals in real-time.
            </p>
            {adminUser ? (
              <button
                id="btn-footer-open-admin"
                onClick={() => {
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/20 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Open Admin Dashboard
              </button>
            ) : (
              <button
                id="btn-footer-admin-login"
                onClick={() => setIsAdminLoginOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1a1c27] hover:bg-[#252838] border border-[#2e3245] text-gray-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
                Staff Admin Login
              </button>
            )}
            <div className="mt-3 text-[11px] text-gray-500 text-center">
              Demo Admin: admin@kaswah.com / admin123
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} {settings.name}. All rights reserved. Registered Restaurant Trademark.
          </div>
          <div className="flex items-center gap-2">
            <span>Freshly baked and fried with</span>
            <Heart className="w-3.5 h-3.5 text-[#ff6b00] fill-[#ff6b00]" />
            <span>in Lahore, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
