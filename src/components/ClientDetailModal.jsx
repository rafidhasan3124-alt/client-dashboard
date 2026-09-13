import { useEffect } from "react";
import { X, Mail, Phone, Building2, Calendar, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, getInitials } from "../utils/formatters";

export default function ClientDetailModal({
  isOpen,
  client,
  onClose,
  onEdit,
  onStatusChange,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !client) return null;

  const statuses = [
    { value: "Active", icon: CheckCircle2, color: "hover:border-green-500/50 hover:bg-green-500/10" },
    { value: "Pending", icon: Clock, color: "hover:border-yellow-500/50 hover:bg-yellow-500/10" },
    { value: "Inactive", icon: AlertCircle, color: "hover:border-red-500/50 hover:bg-red-500/10" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-detail-title"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
              {getInitials(client.name)}
            </div>
            <div>
              <h2 id="client-detail-title" className="text-xl font-bold text-white">
                {client.name}
              </h2>
              <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {client.company}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close client details dialog"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Section with Quick Transition */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current Status
            </span>
            <StatusBadge status={client.status} />
          </div>
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-2">Change status:</span>
            <div className="grid grid-cols-3 gap-2">
              {statuses.map((st) => {
                const Icon = st.icon;
                const isSelected = client.status === st.value;
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => onStatusChange && onStatusChange(client.id, st.value)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold"
                        : `border-slate-700 bg-slate-800/60 text-slate-300 ${st.color}`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {st.value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> Email
            </span>
            <a
              href={`mailto:${client.email}`}
              className="text-indigo-400 hover:text-indigo-300 hover:underline break-all font-medium"
            >
              {client.email}
            </a>
          </div>

          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Phone
            </span>
            <span className="text-slate-200 font-medium">
              {client.phone || "+1 (555) 000-0000"}
            </span>
          </div>

          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Member Since
            </span>
            <span className="text-slate-200 font-medium">
              {formatDate(client.joinedAt)}
            </span>
          </div>

          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" /> Client ID
            </span>
            <span className="text-slate-400 font-mono text-xs">
              #{client.id}
            </span>
          </div>
        </div>

        {/* Notes */}
        {client.notes && (
          <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-lg text-sm">
            <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Account Notes
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              {client.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(client);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
          >
            Edit Information
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
