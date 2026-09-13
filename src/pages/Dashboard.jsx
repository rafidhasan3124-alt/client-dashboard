import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  Clock,
  UserX,
  RotateCcw,
  X,
  RefreshCw,
  TrendingUp,
  Shield,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import ClientTable from "../components/ClientTable";
import ClientModal from "../components/ClientModal";
import ClientDetailModal from "../components/ClientDetailModal";
import ConfirmModal from "../components/ConfirmModal";
import { useClients } from "../context/ClientContext";

export default function Dashboard() {
  const {
    clients,
    addClient,
    updateClient,
    updateClientStatus,
    deleteClient,
    resetToDefaultClients,
  } = useClients();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search, Filter & Sort States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Filter and Sort Processing
  const filteredAndSortedClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = clients.filter((c) => {
      const matchesSearch =
        !normalizedSearch ||
        (c.name && c.name.toLowerCase().includes(normalizedSearch)) ||
        (c.email && c.email.toLowerCase().includes(normalizedSearch)) ||
        (c.company && c.company.toLowerCase().includes(normalizedSearch)) ||
        (c.phone && c.phone.toLowerCase().includes(normalizedSearch));

      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || "";
        const valB = b[sortConfig.key] || "";

        let comparison = 0;
        if (typeof valA === "string" && typeof valB === "string") {
          comparison = valA.localeCompare(valB);
        } else if (valA < valB) {
          comparison = -1;
        } else if (valA > valB) {
          comparison = 1;
        }

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [clients, search, statusFilter, sortConfig]);

  // Overall Stats Calculation
  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter((c) => c.status === "Active").length;
    const pending = clients.filter((c) => c.status === "Pending").length;
    const inactive = clients.filter((c) => c.status === "Inactive").length;
    const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;

    return { total, active, pending, inactive, activeRate };
  }, [clients]);

  const hasActiveFilters = statusFilter !== "All" || search.trim().length > 0;

  // Sorting Handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return { key: null, direction: "asc" }; // reset sort on third click
      }
      return { key, direction: "asc" };
    });
  };

  // Form Save Handler
  const handleFormSave = (formData) => {
    if (editingClient) {
      updateClient(editingClient.id, formData);
      // Update selected detail view client if open
      if (selectedClient && selectedClient.id === editingClient.id) {
        setSelectedClient({ ...selectedClient, ...formData });
      }
    } else {
      addClient(formData);
    }
    setEditingClient(null);
  };

  // Action Triggers
  const handleOpenAddModal = () => {
    setEditingClient(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setEditingClient(client);
    setFormModalOpen(true);
  };

  const handleOpenDetailModal = (client) => {
    setSelectedClient(client);
    setDetailModalOpen(true);
  };

  const handleQuickStatusChange = (id, newStatus) => {
    updateClientStatus(id, newStatus);
    if (selectedClient && selectedClient.id === id) {
      setSelectedClient((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleRequestDelete = (client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      if (selectedClient && selectedClient.id === clientToDelete.id) {
        setDetailModalOpen(false);
      }
      setClientToDelete(null);
    }
  };

  const handleConfirmReset = () => {
    resetToDefaultClients();
    setSearch("");
    setStatusFilter("All");
    setSortConfig({ key: null, direction: "asc" });
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSortConfig({ key: null, direction: "asc" });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        clientCount={clients.length}
      />

      {/* Main App Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          activeTab={activeTab}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Top KPI Cards (Interactive Filters) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard
              label="Total Clients"
              value={stats.total}
              color="bg-indigo-600"
              icon={Users}
              isActive={statusFilter === "All"}
              onClick={() => setStatusFilter("All")}
              helperText="All records"
            />
            <StatsCard
              label="Active"
              value={stats.active}
              color="bg-emerald-600"
              icon={UserCheck}
              isActive={statusFilter === "Active"}
              onClick={() => setStatusFilter("Active")}
              helperText={`${stats.activeRate}% of total`}
            />
            <StatsCard
              label="Pending"
              value={stats.pending}
              color="bg-amber-600"
              icon={Clock}
              isActive={statusFilter === "Pending"}
              onClick={() => setStatusFilter("Pending")}
              helperText="Awaiting review"
            />
            <StatsCard
              label="Inactive"
              value={stats.inactive}
              color="bg-rose-600"
              icon={UserX}
              isActive={statusFilter === "Inactive"}
              onClick={() => setStatusFilter("Inactive")}
              helperText="Paused / archived"
            />
          </div>

          {/* Conditional View by Active Tab */}
          {activeTab === "reports" ? (
            /* Analytics & Reports View */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h2 className="text-white text-lg font-bold">Client Portfolio Health & Analytics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                    Active Client Ratio
                  </span>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">{stats.activeRate}%</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.activeRate}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                    Pending Onboardings
                  </span>
                  <div className="text-2xl font-bold text-amber-400 mb-1">{stats.pending}</div>
                  <p className="text-slate-500 text-xs">Awaiting legal and security sign-offs</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                    Retention / Inactive
                  </span>
                  <div className="text-2xl font-bold text-rose-400 mb-1">{stats.inactive}</div>
                  <p className="text-slate-500 text-xs">Archived accounts eligible for re-engagement</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("clients")}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition flex items-center gap-1.5"
              >
                Go to client directory →
              </button>
            </div>
          ) : activeTab === "settings" ? (
            /* Workspace Settings View */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h2 className="text-white text-lg font-bold">Workspace Configuration & Data Management</h2>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <h3 className="text-white text-sm font-semibold mb-1">Prototype Demo Data</h3>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                    Reset all client records back to the initial enterprise mock dataset. This will overwrite any client additions, updates, or deletions made during testing.
                  </p>
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-500/10 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold rounded-lg transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Default Demo Clients
                  </button>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <h3 className="text-white text-sm font-semibold mb-1">Deployment Environment</h3>
                  <p className="text-slate-400 text-xs mb-2">
                    Running in prototype mode with HTML5 LocalStorage persistence.
                  </p>
                  <span className="inline-block px-2.5 py-1 text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                    ClientHub v1.0.0 (Advanced Frontend Architecture)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard & Clients Directory Table */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Table Controls & Filter Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-white font-bold text-base sm:text-lg tracking-tight">
                      Client Records
                    </h2>
                    <p className="text-slate-400 text-xs">
                      Manage client lifecycle, status verification, and contact data
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 justify-center shadow-lg shadow-indigo-600/20 transition"
                  >
                    <Plus className="w-4 h-4" /> Add New Client
                  </button>
                </div>

                {/* Filter and Search Inputs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input with Clear Button */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Search clients by name, email, or company"
                      placeholder="Search clients by name, email, or company..."
                      className="bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full transition"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label="Clear search input"
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5 rounded transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="status-filter-select" className="sr-only">
                      Filter by status
                    </label>
                    <select
                      id="status-filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      aria-label="Filter clients by status"
                      className="bg-slate-950/60 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition min-w-[130px]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active Only</option>
                      <option value="Pending">Pending Only</option>
                      <option value="Inactive">Inactive Only</option>
                    </select>

                    {/* Reset Filters Action */}
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        title="Reset search and filters"
                        className="inline-flex items-center gap-1.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-xl transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Header Bar */}
              <div className="px-4 py-2.5 text-xs text-slate-400 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <span>
                  Showing <strong className="text-white">{filteredAndSortedClients.length}</strong> of{" "}
                  <strong className="text-white">{clients.length}</strong> total clients
                  {statusFilter !== "All" && (
                    <span className="ml-1 text-indigo-400">({statusFilter} filter active)</span>
                  )}
                </span>
                {sortConfig.key && (
                  <span className="text-[11px] text-slate-500">
                    Sorted by {sortConfig.key} ({sortConfig.direction})
                  </span>
                )}
              </div>

              {/* Client Table */}
              <ClientTable
                clients={filteredAndSortedClients}
                totalCount={clients.length}
                sortConfig={sortConfig}
                onSort={handleSort}
                onView={handleOpenDetailModal}
                onEdit={handleOpenEditModal}
                onDelete={handleRequestDelete}
                onResetFilters={handleClearFilters}
                onAddClient={handleOpenAddModal}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {/* 1. Add / Edit Modal */}
      <ClientModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleFormSave}
        client={editingClient}
      />

      {/* 2. Client Detail View Modal */}
      <ClientDetailModal
        isOpen={detailModalOpen}
        client={selectedClient}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedClient(null);
        }}
        onEdit={(client) => {
          setDetailModalOpen(false);
          handleOpenEditModal(client);
        }}
        onStatusChange={handleQuickStatusChange}
      />

      {/* 3. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Client Record"
        message={`Are you sure you want to permanently delete "${clientToDelete?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete Client"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setClientToDelete(null);
        }}
      />

      {/* 4. Reset Demo Data Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title="Reset Demo Database"
        message="Are you sure you want to reset the client database to default demo records? Any custom clients added or modified during this session will be restored."
        confirmText="Reset to Defaults"
        cancelText="Cancel"
        isDanger={false}
        onConfirm={handleConfirmReset}
        onClose={() => setResetModalOpen(false)}
      />
    </div>
  );
}