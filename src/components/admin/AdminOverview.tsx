import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { DashboardStats, Order } from '../../types';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface AdminOverviewProps {
  setCurrentTab: (tab: any) => void;
  openOrderModalWithId: (orderId: string) => void;
  openAddProductModal: () => void;
  openAddDealModal: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  setCurrentTab,
  openOrderModalWithId,
  openAddProductModal,
  openAddDealModal
}) => {
  const { settings, orders } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch(err => console.error('Error loading stats:', err))
      .finally(() => setLoading(false));
  }, [orders]);

  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Quick Action Top Banner */}
      <div className="bg-gradient-to-r from-[#181a26] via-[#151722] to-[#12131c] border border-[#242738] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit']">
            Kitchen Operations Center
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor real-time food orders, manage branch inventory, and oversee kitchen fulfillment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-quick-add-product"
            type="button"
            onClick={openAddProductModal}
            className="px-3.5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#ff6b00]/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dish</span>
          </button>
          <button
            id="btn-quick-add-deal"
            type="button"
            onClick={openAddDealModal}
            className="px-3.5 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#74b313] text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#84cc16]/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Deal</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('orders')}
            className="px-3.5 py-2.5 rounded-xl bg-[#1f2231] hover:bg-[#2a2e42] text-gray-200 text-xs font-bold flex items-center gap-1.5 border border-[#2b2f42] transition"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              {settings.currencySymbol} {(stats?.totalSales || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#84cc16]" />
              <span>Lifetime sales volume</span>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Active Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#84cc16]/15 text-[#84cc16] flex items-center justify-center animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#84cc16] font-['Outfit']">
              {stats?.activeOrders || 0}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Currently preparing & in transit
            </div>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Today's Sales
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              {settings.currencySymbol} {(stats?.todaySales || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              {stats?.todayOrders || 0} orders processed today
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              {stats?.totalCustomers || 0}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Registered foodies in database
            </div>
          </div>
        </div>
      </div>

      {/* Visual Sales Bar Chart (Pure CSS / SVG mathematical scale) */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Weekly Sales Performance</h3>
            <p className="text-xs text-gray-400">Daily revenue across Kaswah Fast Foods</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="w-3 h-3 rounded-md bg-[#ff6b00]"></span>
              <span>Daily Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="w-3 h-3 rounded-md bg-[#84cc16]"></span>
              <span>Orders Count</span>
            </div>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 border-b border-[#212435]">
          {(stats?.salesChartData || []).map(day => {
            const maxSales = Math.max(...(stats?.salesChartData || []).map(d => d.sales), 25000);
            const heightPercent = Math.max(12, Math.round((day.sales / maxSales) * 100));

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black/90 text-white px-2 py-1 rounded-md pointer-events-none whitespace-nowrap shadow-lg">
                  Rs. {(day.sales ?? 0).toLocaleString()} ({day.orders} orders)
                </div>

                <div className="w-full max-w-[48px] bg-[#1a1c29] rounded-xl overflow-hidden flex flex-col justify-end h-36">
                  <div
                    className="w-full bg-gradient-to-t from-[#ff6b00] to-[#ff8f3d] rounded-xl transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>

                <div className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">
                  {day.day || day.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Recent Orders</h3>
            <p className="text-xs text-gray-400">Incoming tickets and order dispatches</p>
          </div>
          <button
            onClick={() => setCurrentTab('orders')}
            className="text-xs font-bold text-[#ff6b00] hover:underline flex items-center gap-1"
          >
            <span>See All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#212435] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1e2c]">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#161826] transition-colors">
                  <td className="py-3 pl-2 font-mono font-bold text-white">{order.id}</td>
                  <td className="py-3">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-gray-400">{order.customerPhone}</div>
                  </td>
                  <td className="py-3 text-gray-300">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3">
                    <span className="bg-[#1b1e2c] text-gray-300 px-2 py-0.5 rounded text-[11px]">
                      {order.orderType}
                    </span>
                  </td>
                  <td className="py-3 font-black text-white">
                    {settings.currencySymbol} {(order.grandTotal ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-[#84cc16]/20 text-[#84cc16]'
                          : order.status === 'Cancelled'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-[#ff6b00]/20 text-[#ff6b00]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={() => openOrderModalWithId(order.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#1e2130] hover:bg-[#ff6b00] text-gray-200 hover:text-white font-semibold transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
