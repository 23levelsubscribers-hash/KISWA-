import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2
} from 'lucide-react';

export const AboutContactView: React.FC = () => {
  const { settings, showToast } = useApp();

  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMessage) {
      showToast('Please fill in your name and message', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Thank you! Your inquiry has been forwarded to our management team.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* About Story Hero */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84cc16]/15 text-[#84cc16] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Heritage</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Outfit']">
              The Legend of <span className="text-[#ff6b00]">Golden Crunch</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Founded in Lahore, Pakistan, <strong className="text-white">KASWAH FAST FOODS</strong> was established with a singular mission: to redefine the fast-food fried chicken experience by combining authentic culinary craftsmanship with uncompromising freshness.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Unlike industrial fast food chains that rely on frozen patties and pre-fried pieces, every single cut at Kaswah is 100% prime fresh grain-fed chicken, marinated for 12 hours in our secret blend of 11 spices, hand-breaded on demand, and fried in pure trans-fat free oil for that signature crunch outside and juicy tenderness inside.
            </p>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#161926] border border-[#262a3d] p-4 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="text-white font-bold text-sm">100% Halal Certified</h4>
                <p className="text-xs text-gray-400 mt-1">Sourced directly from verified local poultry partners daily.</p>
              </div>
              <div className="bg-[#161926] border border-[#262a3d] p-4 rounded-2xl">
                <Flame className="w-6 h-6 text-[#ff6b00] mb-2" />
                <h4 className="text-white font-bold text-sm">11 Secret Spices</h4>
                <p className="text-xs text-gray-400 mt-1">Our proprietary recipe creates unmatchable aroma and crunch.</p>
              </div>
              <div className="bg-[#161926] border border-[#262a3d] p-4 rounded-2xl">
                <Award className="w-6 h-6 text-[#84cc16] mb-2" />
                <h4 className="text-white font-bold text-sm">Thermal Packaging</h4>
                <p className="text-xs text-gray-400 mt-1">High-grade heat lock boxes keep meals sizzling hot upon delivery.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border-2 border-[#2b2f42] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&auto=format&fit=crop&q=80"
                alt="Kaswah Fresh Fried Chicken Kitchen"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact, Locations & Inquiry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white mb-6 font-['Outfit']">
              Branch & Order Hotline
            </h3>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#191c2b] text-[#ff6b00] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase">Flagship Location</div>
                  <div className="font-bold text-white mt-0.5">{settings.address}</div>
                  <div className="text-xs text-gray-400">{settings.city}, Pakistan</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#191c2b] text-[#84cc16] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase">Direct Telephone</div>
                  <a href={`tel:${settings.phone}`} className="font-bold text-white hover:text-[#ff6b00] mt-0.5 block">
                    {settings.phone}
                  </a>
                  <div className="text-xs text-gray-400">Lines open 11:00 AM - 03:00 AM</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#191c2b] text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase">WhatsApp Ordering</div>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-white hover:text-emerald-400 mt-0.5 block"
                  >
                    {settings.whatsapp}
                  </a>
                  <div className="text-xs text-gray-400">Direct order confirmation & catering quotes</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#191c2b] text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase">Service Hours</div>
                  <div className="font-bold text-white mt-0.5">{settings.openingHours}</div>
                  <div className="text-xs text-gray-400">Monday through Sunday (All Week)</div>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick CTA */}
            <div className="mt-8 pt-6 border-t border-[#1f2231]">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Kaswah%20Fast%20Foods,%20I%20would%20like%20to%20place%20an%20order!`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Customer Feedback & Catering Inquiries */}
        <div className="lg:col-span-7">
          <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white mb-2 font-['Outfit']">
              Send us a Message or Catering Inquiry
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Have feedback about your recent meal, or planning a birthday party or corporate lunch? Let us know.
            </p>

            {submitted ? (
              <div className="bg-[#182619] border border-[#84cc16]/40 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#84cc16] mx-auto" />
                <h4 className="text-lg font-bold text-white">Message Received!</h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto">
                  Thank you for reaching out to Kaswah Fast Foods. Our guest relations manager will review your message promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#233524] text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={feedbackName}
                      onChange={e => setFeedbackName(e.target.value)}
                      placeholder="e.g. Bilal Ahmed"
                      className="w-full bg-[#181a28] border border-[#282b3d] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={feedbackEmail}
                      onChange={e => setFeedbackEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-[#181a28] border border-[#282b3d] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Subject</label>
                  <select
                    value={feedbackSubject}
                    onChange={e => setFeedbackSubject(e.target.value)}
                    className="w-full bg-[#181a28] border border-[#282b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  >
                    <option value="Food Quality & Feedback">Food Quality & Feedback</option>
                    <option value="Party & Catering Bundle Request">Party & Catering Bundle Request</option>
                    <option value="Delivery Experience">Delivery Experience</option>
                    <option value="Franchise Inquiry">Franchise Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackMessage}
                    onChange={e => setFeedbackMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-[#181a28] border border-[#282b3d] rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
