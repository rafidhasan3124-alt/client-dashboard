import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, LogOut, Check, MoreVertical } from "lucide-react";
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
  dashboard: "Dashboard",
  clients: "Clients",
  reports: "Reports",
  settings: "Settings",
  help: "Help",
};

export default function Header({ onMenuClick, activeTab = "dashboard", onSearchClick }) {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  const isMac = typeof navigator !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (onSearchClick) onSearchClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchClick]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (notificationsOpen || userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen, userMenuOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
          className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-white font-semibold text-base tracking-tight">
            {titles[activeTab] || "Dashboard"}
          </h1>
        </div>
      </div>

      {/* Command Palette Trigger */}
      <button
        type="button"
        onClick={onSearchClick}
        title={`Search clients (${isMac ? "⌘K" : "Ctrl+K"})`}
        className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-800/80 border border-neutral-700 hover:border-neutral-600 rounded-lg w-80 text-left transition-colors cursor-pointer"
      >
        <Search className="w-4 h-4 text-neutral-400" />
        <span className="text-neutral-400 text-sm flex-1">Search clients...</span>
        <kbd className="px-1.5 py-0.5 text-xs text-neutral-400 bg-neutral-700 rounded font-mono font-medium">
          {isMac ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-overlay p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                <span className="text-white text-sm font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-lg border text-xs transition-colors ${
                      notif.unread
                        ? "bg-primary-950/20 border-primary-900/40 text-neutral-200"
                        : "bg-neutral-950/40 border-neutral-800 text-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white flex items-center gap-1.5">
                        {notif.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        )}
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-neutral-500">{notif.time}</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-snug">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(user?.name || "Admin User")}
            </div>
            <MoreVertical className="w-4 h-4 text-neutral-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-overlay p-1 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                <div className="text-white text-sm font-medium">{user?.name || "Admin"}</div>
                <div className="text-neutral-500 text-xs truncate">{user?.email || "admin@demo.com"}</div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}