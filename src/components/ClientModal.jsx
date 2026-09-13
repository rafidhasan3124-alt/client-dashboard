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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-modal-title"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <div>
            <h2 id="client-modal-title" className="text-xl font-bold text-white">
              {client ? "Edit Client Profile" : "Add New Client"}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {client ? "Update existing client record details" : "Register a new client into the directory"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close client modal"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Field */}
          <div>
            <label htmlFor="client-name" className="text-slate-300 text-sm mb-1 block font-medium">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="client-name"
              type="text"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="e.g. Jane Doe"
              className={`w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none transition ${
                errors.name ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {errors.name && (
              <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client-email" className="text-slate-300 text-sm mb-1 block font-medium">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                id="client-email"
                type="email"
                value={form.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="jane@company.com"
                className={`w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none transition ${
                  errors.email ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-slate-700 focus:border-indigo-500"
                }`}
              />
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="client-phone" className="text-slate-300 text-sm mb-1 block font-medium">
                Phone Number
              </label>
              <input
                id="client-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Company & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client-company" className="text-slate-300 text-sm mb-1 block font-medium">
                Company <span className="text-rose-400">*</span>
              </label>
              <input
                id="client-company"
                type="text"
                value={form.company}
                onChange={(e) => handleFieldChange("company", e.target.value)}
                placeholder="Acme Corp"
                className={`w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none transition ${
                  errors.company ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-slate-700 focus:border-indigo-500"
                }`}
              />
              {errors.company && (
                <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.company}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="client-status" className="text-slate-300 text-sm mb-1 block font-medium">
                Status
              </label>
              <select
                id="client-status"
                value={form.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="client-notes" className="text-slate-300 text-sm mb-1 block font-medium">
              Internal Notes
            </label>
            <textarea
              id="client-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Contract status, SLA tier, project scope notes..."
              className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-lg border border-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-lg transition shadow-lg shadow-indigo-600/20"
            >
              {client ? "Update Client" : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}