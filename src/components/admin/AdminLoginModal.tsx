import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Lock, Mail, Flame } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    loginAdmin,
    setCurrentView,
    showToast
  } = useApp();

  const [email, setEmail] = useState('admin@kaswah.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginAdmin(email, password);
    setLoading(false);

    if (success) {
      setIsAdminLoginOpen(false);
      setCurrentView('admin');
      showToast('Welcome to Kaswah Admin Management Portal', 'success');
    } else {
      showToast('Invalid admin credentials. Try admin@kaswah.com / admin123', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#0f111a] border border-[#272b3e] rounded-3xl p-6 sm:p-8 shadow-2xl text-white"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAdminLoginOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#ff6b00]/15 border border-[#ff6b00]/40 text-[#ff6b00] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#ff6b00]/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
            Admin Portal Access
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Kaswah Fast Foods Central Kitchen & Restaurant Management
          </p>
        </div>

        {/* Credentials Pill */}
        <div className="bg-[#161826] border border-[#292c42] p-3.5 rounded-2xl mb-6 text-xs text-gray-300">
          <div className="font-bold text-[#84cc16] mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#ff6b00]" /> Pre-configured Credentials:
          </div>
          <div className="font-mono text-[11px] text-gray-400 space-y-0.5">
            <div>Email: <span className="text-white">admin@kaswah.com</span></div>
            <div>Password: <span className="text-white">admin123</span></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                id="admin-login-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#161826] border border-[#272a3d] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                id="admin-login-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#161826] border border-[#272a3d] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="btn-admin-submit-login"
            className="w-full py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-extrabold text-sm shadow-xl shadow-[#ff6b00]/25 transition active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Sign In to Management'}
          </button>
        </form>
      </div>
    </div>
  );
};
