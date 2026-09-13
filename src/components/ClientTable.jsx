import { Pencil, Trash2, Mail, Eye, ArrowUpDown, ArrowUp, ArrowDown, Users, FilterX } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, getInitials } from "../utils/formatters";

export default function ClientTable({
  clients,
  totalCount = 0,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
  onAddClient,
  sortConfig = { key: null, direction: "asc" },
  onSort,
}) {
  // Empty states
  if (clients.length === 0) {
    if (totalCount === 0) {
      return (
        <div className="text-center py-16 px-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-white font-medium text-base mb-1">No clients registered</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-4">
            Your client directory is currently empty. Get started by adding your first client record.
          </p>
          {onAddClient && (
            <button
              type="button"
              onClick={onAddClient}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
            >
              Add First Client
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="text-center py-16 px-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <FilterX className="w-6 h-6" />
        </div>
        <h3 className="text-white font-medium text-base mb-1">No matching clients found</h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-4">
          No records match your search or filter combination. Try adjusting your search query or reset filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-lg transition"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse" role="table">
        <thead>
          <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-900/50">
            <th scope="col" className="px-4 py-3.5 font-semibold">
              <button
                type="button"
                onClick={() => onSort && onSort("name")}
                className="flex items-center gap-1.5 hover:text-white transition"
              >
                <span>Client</span>
                {renderSortIcon("name")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3.5 font-semibold">
              <button
                type="button"
                onClick={() => onSort && onSort("company")}
                className="flex items-center gap-1.5 hover:text-white transition"
              >
                <span>Company</span>
                {renderSortIcon("company")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3.5 font-semibold">
              <button
                type="button"
                onClick={() => onSort && onSort("status")}
                className="flex items-center gap-1.5 hover:text-white transition"
              >
                <span>Status</span>
                {renderSortIcon("status")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3.5 font-semibold">
              <button
                type="button"
                onClick={() => onSort && onSort("joinedAt")}
                className="flex items-center gap-1.5 hover:text-white transition"
              >
                <span>Joined</span>
                {renderSortIcon("joinedAt")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3.5 font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-slate-800/30 transition group"
            >
              {/* Client Info */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {getInitials(client.name)}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => onView && onView(client)}
                      className="text-white text-sm font-medium hover:text-indigo-400 transition text-left"
                    >
                      {client.name}
                    </button>
                    <div className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[160px] sm:max-w-xs">{client.email}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Company */}
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-300 text-sm font-medium">
                {client.company}
              </td>

              {/* Status */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <StatusBadge status={client.status} />
              </td>

              {/* Joined Date */}
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-sm">
                {formatDate(client.joinedAt)}
              </td>

              {/* Action Buttons */}
              <td className="px-4 py-3.5 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView && onView(client)}
                    aria-label={`View ${client.name} details`}
                    title="View client details"
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(client)}
                    aria-label={`Edit ${client.name}`}
                    title="Edit client"
                    className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(client)}
                    aria-label={`Delete ${client.name}`}
                    title="Delete client"
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}