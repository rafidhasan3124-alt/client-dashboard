import { useEffect } from "react";
import { LayoutDashboard, Users, BarChart3, Settings, HelpCircle, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/formatters";

const navGroups = [
  {
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "clients", label: "Clients", icon: Users },
      { id: "reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
      { id: "help", label: "Help", icon: HelpCircle },
    ],
  },
];

export default function Sidebar({
  open,
  onClose,
  activeTab = "dashboard",
  onSelectTab,
  clientCount = 0,
}) {
  const { user, logout } = useAuth();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleTabClick = (tabId) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-200"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        aria-label="Main Navigation"
        className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-neutral-950 border-r border-neutral-800 z-40 flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <span className="text-white font-semibold text-base tracking-tight">
                ClientHub
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation sidebar"
            className="lg:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 overflow-y-auto space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <span className="px-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wide-label block mb-2">
                {group.label}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-primary-500/10 text-primary-400 border-l-2 border-primary-500"
                          : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 border-l-2 border-transparent"
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] ${isActive ? "text-primary-400" : "text-neutral-400"}`} strokeWidth={1.75} />
                      <span>{item.label}</span>
                      {item.id === "clients" && clientCount > 0 && (
                        <span className="ml-auto text-xs text-neutral-500">
                          {clientCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-900/50 border border-neutral-800/80">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {getInitials(user?.name || "Admin User")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                {user?.name || "Admin User"}
              </div>
              <div className="text-neutral-500 text-xs truncate">
                {user?.email || "admin@demo.com"}
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
              className="text-neutral-400 hover:text-danger-400 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}