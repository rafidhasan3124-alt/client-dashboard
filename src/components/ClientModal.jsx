import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

export default function ClientModal({ isOpen, onClose, onSave, client }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    status: "Active",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || "",
        email: client.email || "",
        company: client.company || "",
        phone: client.phone || "",
        status: client.status || "Active",
        notes: client.notes || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        status: "Active",
        notes: "",
      });
    }
    setErrors({});
  }, [client, isOpen]);

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

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedCompany = form.company.trim();

    if (!trimmedName) {
      newErrors.name = "Full name is required";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please provide a valid email address";
    }

    if (!trimmedCompany) {
      newErrors.company = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      company: form.company.trim(),
      phone: form.phone.trim() || "+1 (555) 000-0000",
      notes: form.notes.trim(),
    });
    onClose();
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const statusOptions = ["Active", "Pending", "Inactive"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-modal-title"
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-modal z-10 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
          <div>
            <h2 id="client-modal-title" className="text-lg font-semibold text-white tracking-tight">
              {client ? "Edit Client" : "Add New Client"}
            </h2>
            <p className="text-neutral-500 text-xs mt-0.5">
              {client ? "Update client details" : "Create a new client record"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close client modal"
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Field */}
          <div>
            <label htmlFor="client-name" className="text-neutral-300 text-xs font-medium mb-1.5 block">
              Full Name <span className="text-danger-400">*</span>
            </label>
            <input
              id="client-name"
              type="text"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="e.g. Jane Doe"
              className={`w-full bg-neutral-800 border rounded-lg px-3.5 py-2.5 text-white text-sm input-focus-ring transition-colors ${
                errors.name ? "border-danger-500" : "border-neutral-700"
              }`}
            />
            {errors.name && (
              <p className="text-danger-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client-email" className="text-neutral-300 text-xs font-medium mb-1.5 block">
                Email Address <span className="text-danger-400">*</span>
              </label>
              <input
                id="client-email"
                type="email"
                value={form.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="jane@company.com"
                className={`w-full bg-neutral-800 border rounded-lg px-3.5 py-2.5 text-white text-sm input-focus-ring transition-colors ${
                  errors.email ? "border-danger-500" : "border-neutral-700"
                }`}
              />
              {errors.email && (
                <p className="text-danger-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="client-phone" className="text-neutral-300 text-xs font-medium mb-1.5 block">
                Phone Number
              </label>
              <input
                id="client-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2.5 text-white text-sm input-focus-ring transition-colors"
              />
            </div>
          </div>

          {/* Company Field */}
          <div>
            <label htmlFor="client-company" className="text-neutral-300 text-xs font-medium mb-1.5 block">
              Company <span className="text-danger-400">*</span>
            </label>
            <input
              id="client-company"
              type="text"
              value={form.company}
              onChange={(e) => handleFieldChange("company", e.target.value)}
              placeholder="Acme Corp"
              className={`w-full bg-neutral-800 border rounded-lg px-3.5 py-2.5 text-white text-sm input-focus-ring transition-colors ${
                errors.company ? "border-danger-500" : "border-neutral-700"
              }`}
            />
            {errors.company && (
              <p className="text-danger-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.company}
              </p>
            )}
          </div>

          {/* Status Segmented Control */}
          <div role="group" aria-labelledby="client-status-label">
            <span id="client-status-label" className="text-neutral-300 text-xs font-medium mb-1.5 block">
              Status
            </span>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleFieldChange("status", status)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    form.status === status
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 border border-neutral-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="client-notes" className="text-neutral-300 text-xs font-medium mb-1.5 block">
              Internal Notes
            </label>
            <textarea
              id="client-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Contract status, SLA tier, project scope notes..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2.5 text-white text-sm input-focus-ring transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium py-2.5 rounded-lg border border-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {client ? "Update Client" : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}