import { useState, useRef, useEffect } from "react";
import { Menu, Bell, LogOut, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/formatters";

const initialNotifications = [
  {
    id: 1,
    title: "New Client Added",
    message: "Emma Wilson has joined via StartupX.",
    time: "10m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Contract In Review",
    message: "Sarah Khan's TechCorp agreement was updated.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "System Maintenance",
    message: "Quarterly database indexing completed successfully.",
    time: "3h ago",
    unread: false,
  },
];

const titles = {
  dashboard: "Dashboard Overview",
  clients: "Client Directory",
  reports: "Analytics & Reports",
  settings: "Workspace Settings",
};

export default function Header({ onMenuClick, activeTab = "dashboard" }) {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const popoverRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-white font-semibold text-base sm:text-lg tracking-tight">
            {titles[activeTab] || "Dashboard Overview"}
          </h1>
          <p className="text-slate-500 text-xs hidden sm:block">
            Real-time client management and operational metrics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Notifications Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl border text-xs transition ${
                      notif.unread
                        ? "bg-indigo-950/20 border-indigo-900/40 text-slate-200"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {notif.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                        )}
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{notif.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-snug">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {getInitials(user?.name || "Admin User")}
          </div>
          <div className="text-xs hidden md:block">
            <div className="text-white font-medium leading-tight">
              {user?.name || "Admin"}
            </div>
            <div className="text-slate-500 text-[11px]">
              {user?.role || "Administrator"}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          aria-label="Log out of session"
          title="Log out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}