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
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !client) return null;

  const statuses = [
    { value: "Active", icon: CheckCircle2, color: "hover:border-success-500/50 hover:bg-success-950/20" },
    { value: "Pending", icon: Clock, color: "hover:border-warning-500/50 hover:bg-warning-950/20" },
    { value: "Inactive", icon: AlertCircle, color: "hover:border-danger-500/50 hover:bg-danger-950/20" },
  ];

  const getAvatarGradient = (name) => {
    const gradients = [
      "from-primary-500 to-primary-600",
      "from-success-500 to-success-600",
      "from-warning-500 to-warning-600",
      "from-danger-500 to-danger-600",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-detail-title"
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-modal z-10 space-y-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(client.name)} flex items-center justify-center text-white text-xl font-semibold`}>
              {getInitials(client.name)}
            </div>
            <div>
              <h2 id="client-detail-title" className="text-lg font-semibold text-white tracking-tight">
                {client.name}
              </h2>
              <p className="text-neutral-500 text-sm flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-primary-400" />
                {client.company}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close client details dialog"
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Section with Quick Transition */}
        <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide-label">
              Current Status
            </span>
            <StatusBadge status={client.status} />
          </div>
          <div className="pt-2 border-t border-neutral-800/80">
            <span className="text-xs text-neutral-500 block mb-2">Change status:</span>
            <div className="grid grid-cols-3 gap-2">
              {statuses.map((st) => {
                const Icon = st.icon;
                const isSelected = client.status === st.value;
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => onStatusChange && onStatusChange(client.id, st.value)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? "border-primary-500 bg-primary-950/30 text-primary-300 font-medium"
                        : `border-neutral-700 bg-neutral-800/60 text-neutral-300 ${st.color}`
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
          <div className="p-3 bg-neutral-950/40 border border-neutral-800 rounded-lg">
            <span className="text-neutral-500 text-xs flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5 text-neutral-600" /> Email
            </span>
            <a
              href={`mailto:${client.email}`}
              className="text-primary-400 hover:text-primary-300 hover:underline break-all font-medium"
            >
              {client.email}
            </a>
          </div>

          <div className="p-3 bg-neutral-950/40 border border-neutral-800 rounded-lg">
            <span className="text-neutral-500 text-xs flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-neutral-600" /> Phone
            </span>
            <span className="text-neutral-200 font-medium">
              {client.phone || "+1 (555) 000-0000"}
            </span>
          </div>

          <div className="p-3 bg-neutral-950/40 border border-neutral-800 rounded-lg">
            <span className="text-neutral-500 text-xs flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-600" /> Member Since
            </span>
            <span className="text-neutral-200 font-medium">
              {formatDate(client.joinedAt)}
            </span>
          </div>

          <div className="p-3 bg-neutral-950/40 border border-neutral-800 rounded-lg">
            <span className="text-neutral-500 text-xs flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-neutral-600" /> Client ID
            </span>
            <span className="text-neutral-500 font-mono text-xs">
              #{client.id}
            </span>
          </div>
        </div>

        {/* Notes */}
        {client.notes && (
          <div className="p-3.5 bg-neutral-950/40 border border-neutral-800 rounded-lg text-sm">
            <span className="text-neutral-500 text-xs flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-600" /> Account Notes
            </span>
            <p className="text-neutral-300 text-xs leading-relaxed">
              {client.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(client);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
          >
            Edit Information
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}