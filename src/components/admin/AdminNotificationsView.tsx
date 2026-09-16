import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, ShoppingBag, Clock, ArrowRight } from 'lucide-react';

interface AdminNotificationsViewProps {
  onSelectOrder: (orderId: string) => void;
}

export const AdminNotificationsView: React.FC<AdminNotificationsViewProps> = ({
  onSelectOrder
}) => {
  const {
    adminNotifications,
    unreadAdminCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-['Outfit']">Live Order Notifications</h2>
          <p className="text-xs text-gray-400">
            Real-time feed of kitchen orders, status changes, and customer actions.
          </p>
        </div>

        {unreadAdminCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 rounded-xl bg-[#181a28] hover:bg-[#25283b] text-gray-200 text-xs font-bold border border-[#2c3044] flex items-center gap-1.5 transition"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#84cc16]" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-[#12141f] border border-[#232738] rounded-3xl p-6 shadow-2xl space-y-3">
        {adminNotifications.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            No notifications in the log.
          </div>
        ) : (
          adminNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.orderId) {
                  onSelectOrder(n.orderId);
                }
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                !n.read
                  ? 'bg-[#181a28] border-[#ff6b00]/40 shadow-md shadow-[#ff6b00]/5'
                  : 'bg-[#151722] border-[#222536] hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    !n.read
                      ? 'bg-[#ff6b00]/20 text-[#ff6b00]'
                      : 'bg-[#1f2231] text-gray-400'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#ff6b00]"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">{n.message}</p>
                  <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</span>
                  </div>
                </div>
              </div>

              {n.orderId && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:underline self-end sm:self-center">
                  <span>Open Ticket</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
