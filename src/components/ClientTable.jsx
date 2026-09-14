import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Mail, Users, FilterX, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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
  pageSize = 6,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination bounds
  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  // Reset page when clients list shrinks below current page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [clients.length, totalPages, currentPage]);

  // Empty states
  if (clients.length === 0) {
    if (totalCount === 0) {
      return (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center mb-4">
            <Users className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-white font-medium text-base mb-2">No clients registered</h3>
          <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6">
            Your client directory is currently empty. Get started by adding your first client record.
          </p>
          {onAddClient && (
            <button
              type="button"
              onClick={onAddClient}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add First Client
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center mb-4">
          <FilterX className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h3 className="text-white font-medium text-base mb-2">No matching clients found</h3>
        <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6">
          No records match your search or filter combination. Try adjusting your search query or reset filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-sm font-medium rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  const startIndex = (validPage - 1) * pageSize;
  const paginatedClients = clients.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-neutral-600 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary-400" />
    );
  };

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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse" role="table">
        <thead className="sticky top-0 bg-neutral-900 z-10">
          <tr className="text-[11px] text-neutral-500 uppercase tracking-wide-label border-b border-neutral-800">
            <th scope="col" className="px-4 py-3 font-medium">
              <button
                type="button"
                onClick={() => onSort && onSort("name")}
                className="group flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
              >
                <span>Client</span>
                {renderSortIcon("name")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <button
                type="button"
                onClick={() => onSort && onSort("company")}
                className="group flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
              >
                <span>Company</span>
                {renderSortIcon("company")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <button
                type="button"
                onClick={() => onSort && onSort("status")}
                className="group flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
              >
                <span>Status</span>
                {renderSortIcon("status")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <button
                type="button"
                onClick={() => onSort && onSort("joinedAt")}
                className="group flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
              >
                <span>Joined</span>
                {renderSortIcon("joinedAt")}
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-right w-16">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {paginatedClients.map((client) => (
            <tr
              key={client.id}
              className="table-row-hover group h-16"
            >
              {/* Client Info */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getAvatarGradient(client.name)} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                    {getInitials(client.name)}
                  </div>
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onView && onView(client)}
                      className="text-white text-sm font-medium hover:text-primary-400 transition-colors text-left block truncate"
                    >
                      {client.name}
                    </button>
                    <div className="text-neutral-500 text-xs flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[160px] sm:max-w-xs">{client.email}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Company */}
              <td className="px-4 py-3 text-neutral-300 text-sm">
                {client.company}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <StatusBadge status={client.status} />
              </td>

              {/* Joined Date */}
              <td className="px-4 py-3 text-neutral-500 text-sm">
                {formatDate(client.joinedAt)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onView && onView(client)}
                    aria-label={`View ${client.name} details`}
                    title="View client details"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(client)}
                    aria-label={`Edit ${client.name}`}
                    title="Edit client"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(client)}
                    aria-label={`Delete ${client.name}`}
                    title="Delete client"
                    className="p-1.5 rounded-lg hover:bg-danger-950/20 text-neutral-400 hover:text-danger-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
        <span>
          Showing <strong className="text-neutral-300">{startIndex + 1}–{Math.min(startIndex + pageSize, clients.length)}</strong> of{" "}
          <strong className="text-neutral-300">{clients.length}</strong> {clients.length !== totalCount ? `(filtered from ${totalCount})` : "clients"}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-neutral-400">
            Page {validPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed text-neutral-300 border border-neutral-700 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed text-neutral-300 border border-neutral-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}