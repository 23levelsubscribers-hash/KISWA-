import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Customer, Order } from '../../types';
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  X,
  DollarSign
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { settings } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCustomerModal = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setLoadingOrders(true);
    try {
      const orders = await api.getCustomerOrders(cust.id);
      setCustomerOrders(orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Top Search Bar */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#181a28] border border-[#272b3c] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
          />
        </div>

        <div className="text-xs text-gray-400 font-semibold shrink-0">
          Showing {filteredCustomers.length} registered customers
        </div>
      </div>

      {/* Customer Registry Table */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0e1018] border-b border-[#202334] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-4 pl-6">Customer</th>
                <th className="py-4">Contact</th>
                <th className="py-4">Orders Count</th>
                <th className="py-4">Total Spent</th>
                <th className="py-4">Registered Date</th>
                <th className="py-4 text-right pr-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1e2c]">
              {filteredCustomers.map(cust => (
                <tr key={cust.id} className="hover:bg-[#161826] transition-colors">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-[#84cc16] text-white flex items-center justify-center font-bold text-xs">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{cust.name}</div>
                        <div className="text-[11px] text-gray-400">ID: {cust.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#ff6b00]" /> {cust.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-[#84cc16]" /> {cust.phone}
                    </div>
                  </td>
                  <td className="py-4 font-bold text-white">
                    {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="py-4 font-black text-[#84cc16]">
                    {settings.currencySymbol} {(cust.totalSpend ?? 0).toLocaleString()}
                  </td>
                  <td className="py-4 text-gray-400">
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right pr-6">
                    <button
                      onClick={() => handleOpenCustomerModal(cust)}
                      className="px-3.5 py-2 rounded-xl bg-[#1e2130] hover:bg-[#ff6b00] text-gray-200 hover:text-white font-bold transition inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-[#11131c] border border-[#272a3d] rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#212435]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-[#84cc16] text-white flex items-center justify-center font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedCustomer.name}</h3>
                  <div className="text-xs text-gray-400">{selectedCustomer.email}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-xl bg-[#181a28] hover:bg-[#23273a] text-gray-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 py-4 space-y-6 text-xs">
              {/* Lifetime KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#161826] border border-[#252838] p-3.5 rounded-2xl">
                  <span className="text-gray-400 text-[11px]">Total Spent</span>
                  <div className="text-base font-black text-[#84cc16] mt-0.5">
                    {settings.currencySymbol} {(selectedCustomer.totalSpend ?? 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#161826] border border-[#252838] p-3.5 rounded-2xl">
                  <span className="text-gray-400 text-[11px]">Orders Placed</span>
                  <div className="text-base font-black text-white mt-0.5">
                    {selectedCustomer.totalOrders}
                  </div>
                </div>
                <div className="bg-[#161826] border border-[#252838] p-3.5 rounded-2xl">
                  <span className="text-gray-400 text-[11px]">Phone Contact</span>
                  <div className="text-xs font-bold text-white mt-1">
                    {selectedCustomer.phone}
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="bg-[#161826] border border-[#252838] p-4 rounded-2xl space-y-2">
                <div className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">
                  Saved Addresses
                </div>
                {(selectedCustomer.addresses || []).length === 0 ? (
                  <p className="text-gray-500">No saved addresses on file.</p>
                ) : (
                  (selectedCustomer.addresses || []).map(a => (
                    <div key={a.id} className="flex items-start gap-2 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-[#ff6b00] shrink-0 mt-0.5" />
                      <div>
                        <strong>{a.label}:</strong> {a.address} ({a.cityArea})
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order History */}
              <div className="bg-[#161826] border border-[#252838] p-4 rounded-2xl space-y-3">
                <div className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">
                  Order History ({customerOrders.length})
                </div>

                {loadingOrders ? (
                  <div className="py-4 text-center text-gray-500">Loading orders...</div>
                ) : customerOrders.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">No orders recorded yet.</div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-[#202334]">
                    {customerOrders.map(o => (
                      <div key={o.id} className="pt-2 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-white">{o.id}</div>
                          <div className="text-gray-400 text-[11px]">
                            {new Date(o.createdAt).toLocaleDateString()} • {o.items.length} items •{' '}
                            <span className="text-[#84cc16] font-bold">{o.status}</span>
                          </div>
                        </div>
                        <div className="font-black text-white">
                          {settings.currencySymbol} {(o.grandTotal ?? 0).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
