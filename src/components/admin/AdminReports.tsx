import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ReportsData } from '../../types';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Flame,
  Award,
  Layers
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { settings, showToast } = useApp();
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReports()
      .then(setReports)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    if (!reports) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Metric,Value',
       `Daily Revenue,${reports.dailyRevenue}`,
       `Weekly Revenue,${reports.weeklyRevenue}`,
       `Monthly Revenue,${reports.monthlyRevenue}`,
       `Total Orders,${reports.totalOrdersCount}`,
       `Average Order Value,${reports.averageOrderValue}`
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kaswah_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV downloaded successfully', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Export */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Sales & Revenue Analytics
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Financial reporting, dish sales volume, and order profitability.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-2xl bg-[#ff6b00] hover:bg-[#e05600] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Summary</span>
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Daily Revenue */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Today's Revenue</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-['Outfit']">
            {settings.currencySymbol} {(reports?.dailyRevenue || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#84cc16] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Today's transactions</span>
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>7-Day Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#ff6b00]" />
          </div>
          <div className="text-2xl font-black text-white font-['Outfit']">
            {settings.currencySymbol} {(reports?.weeklyRevenue || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Past 7 continuous days</div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-[#84cc16]" />
          </div>
          <div className="text-2xl font-black text-white font-['Outfit']">
            {settings.currencySymbol} {(reports?.monthlyRevenue || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Calendar month gross</div>
        </div>

        {/* Average Order Value */}
        <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Average Order Value</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-['Outfit']">
            {settings.currencySymbol} {(reports?.averageOrderValue || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">Average ticket size</div>
        </div>
      </div>

      {/* Top Selling Products List */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Top Selling Dishes</h3>
            <p className="text-xs text-gray-400">Ranked by units sold and revenue contribution</p>
          </div>
          <Award className="w-6 h-6 text-[#ff6b00]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#212435] text-gray-400 uppercase tracking-wider">
                <th className="pb-3">Rank</th>
                <th className="pb-3">Dish Name</th>
                <th className="pb-3">Units Sold</th>
                <th className="pb-3 text-right">Gross Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1e2c]">
              {(reports?.topProducts || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-[#161826] transition">
                  <td className="py-3.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0
                          ? 'bg-[#ff6b00] text-white'
                          : idx === 1
                          ? 'bg-[#84cc16] text-black'
                          : 'bg-[#1e2130] text-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#ff6b00]" />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3.5 font-semibold text-gray-200">
                    {item.quantity} orders
                  </td>
                  <td className="py-3.5 text-right font-black text-white">
                    {settings.currencySymbol} {(item.revenue ?? 0).toLocaleString()}
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
