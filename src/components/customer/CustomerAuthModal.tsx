import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Mail, Phone, Lock, Flame } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginCustomer, showToast } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }
    setSubmitting(true);
    const success = await loginCustomer(email.trim());
    setSubmitting(false);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setSubmitting(true);
    const success = await loginCustomer(demoEmail);
    setSubmitting(false);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#12141e] border border-[#262a3d] rounded-3xl p-6 sm:p-8 shadow-2xl text-white"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#e05600] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#ff6b00]/25">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
            {isRegister ? 'Create Customer Account' : 'Customer Sign In'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Access your saved addresses, favorites & order history.
          </p>
        </div>

        {/* Quick Demo Login Pill */}
        <div className="bg-[#181b28] border border-[#272b3e] p-3 rounded-2xl mb-5 text-center">
          <p className="text-[11px] text-gray-400 mb-2">Instant demo testing customer:</p>
          <button
            type="button"
            onClick={() => handleDemoLogin('customer@kaswah.com')}
            className="text-xs font-bold text-[#84cc16] hover:underline bg-[#84cc16]/10 px-3 py-1.5 rounded-xl border border-[#84cc16]/30 inline-block transition"
          >
            Sign in as Bilal Ahmad (customer@kaswah.com)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Usman Tariq"
                  className="w-full bg-[#181b28] border border-[#292c3f] rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                id="input-customer-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#181b28] border border-[#292c3f] rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-[#181b28] border border-[#292c3f] rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-extrabold text-sm shadow-lg shadow-[#ff6b00]/25 transition active:scale-95"
          >
            {submitting ? 'Authenticating...' : isRegister ? 'Register & Continue' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-gray-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-[#ff6b00] font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              First time ordering?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-[#ff6b00] font-bold hover:underline ml-1"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
