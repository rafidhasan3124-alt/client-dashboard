import { useState, useMemo, useRef } from "react";
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
  HelpCircle,
  ExternalLink,
  BookOpen,
  Keyboard,
  UploadCloud,
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
  const searchInputRef = useRef(null);

  const handleHeaderSearchClick = () => {
    if (activeTab !== "dashboard" && activeTab !== "clients") {
      setActiveTab("clients");
    }
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 50);
  };

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
    <div className="min-h-screen bg-neutral-950 flex flex-col lg:flex-row">
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
          onSearchClick={handleHeaderSearchClick}
        />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Top KPI Cards (Interactive Filters) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Clients"
              value={stats.total}
              color="bg-primary-600"
              icon={Users}
              isActive={statusFilter === "All"}
              onClick={() => setStatusFilter("All")}
              helperText="All records"
            />
            <StatsCard
              label="Active"
              value={stats.active}
              color="bg-success-600"
              icon={UserCheck}
              isActive={statusFilter === "Active"}
              onClick={() => setStatusFilter("Active")}
              helperText={`${stats.activeRate}% of total`}
              trend={{ type: 'positive', value: '12%' }}
            />
            <StatsCard
              label="Pending"
              value={stats.pending}
              color="bg-warning-600"
              icon={Clock}
              isActive={statusFilter === "Pending"}
              onClick={() => setStatusFilter("Pending")}
              helperText="Awaiting review"
            />
            <StatsCard
              label="Inactive"
              value={stats.inactive}
              color="bg-danger-600"
              icon={UserX}
              isActive={statusFilter === "Inactive"}
              onClick={() => setStatusFilter("Inactive")}
              helperText="Paused / archived"
              trend={{ type: 'negative', value: '3%' }}
            />
          </div>

          {/* Conditional View by Active Tab */}
          {activeTab === "reports" ? (
            /* Analytics & Reports View */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h2 className="text-white text-lg font-semibold tracking-tight">Client Portfolio Health & Analytics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-xl">
                  <span className="text-neutral-500 text-xs font-medium uppercase tracking-wide-label block mb-2">
                    Active Client Ratio
                  </span>
                  <div className="text-2xl font-semibold text-success-400 mb-3 tabular-nums">{stats.activeRate}%</div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-success-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.activeRate}%` }}
                    />
                  </div>
                </div>

                <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-xl">
                  <span className="text-neutral-500 text-xs font-medium uppercase tracking-wide-label block mb-2">
                    Pending Onboardings
                  </span>
                  <div className="text-2xl font-semibold text-warning-400 mb-1 tabular-nums">{stats.pending}</div>
                  <p className="text-neutral-500 text-xs">Awaiting legal and security sign-offs</p>
                </div>

                <div className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-xl">
                  <span className="text-neutral-500 text-xs font-medium uppercase tracking-wide-label block mb-2">
                    Retention / Inactive
                  </span>
                  <div className="text-2xl font-semibold text-danger-400 mb-1 tabular-nums">{stats.inactive}</div>
                  <p className="text-neutral-500 text-xs">Archived accounts eligible for re-engagement</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("clients")}
                className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                Go to client directory →
              </button>
            </div>
          ) : activeTab === "settings" ? (
            /* Workspace Settings View */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
                <Shield className="w-5 h-5 text-primary-400" />
                <h2 className="text-white text-lg font-semibold tracking-tight">Workspace Configuration & Data Management</h2>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <h3 className="text-white text-sm font-semibold mb-1">Prototype Demo Data</h3>
                  <p className="text-neutral-500 text-xs mb-4 leading-relaxed">
                    Reset all client records back to the initial enterprise mock dataset. This will overwrite any client additions, updates, or deletions made during testing.
                  </p>
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-danger-950/20 text-danger-300 hover:text-danger-200 border border-danger-500/30 text-xs font-medium rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Default Demo Clients
                  </button>
                </div>

                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <h3 className="text-white text-sm font-semibold mb-1">Deployment Environment</h3>
                  <p className="text-neutral-500 text-xs mb-2">
                    Running in prototype mode with HTML5 LocalStorage persistence.
                  </p>
                  <span className="inline-block px-2.5 py-1 text-[11px] font-mono bg-primary-950/30 text-primary-300 border border-primary-500/20 rounded-md">
                    ClientHub v1.0.0 (Advanced Frontend Architecture)
                  </span>
                </div>
              </div>
            </div>
          ) : activeTab === "help" ? (
            /* Help & Support Center View */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
                <HelpCircle className="w-5 h-5 text-primary-400" />
                <h2 className="text-white text-lg font-semibold tracking-tight">Help, Documentation & Deployment Guide</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Netlify Drag and Drop Guide */}
                <div className="p-5 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm">
                    <UploadCloud className="w-4 h-4" />
                    <h3>Netlify Drag & Drop Deployment</h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Deploying this application to Netlify is instant and requires zero server configuration:
                  </p>
                  <ol className="list-decimal list-inside text-xs text-neutral-300 space-y-1.5 pl-1">
                    <li>Run <code className="bg-neutral-800 text-primary-300 px-1.5 py-0.5 rounded font-mono">npm run build</code> in the project directory to generate the production bundle.</li>
                    <li>Open <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-primary-400 hover:underline inline-flex items-center gap-1">Netlify Drop <ExternalLink className="w-3 h-3" /></a> in your browser.</li>
                    <li>Drag and drop the generated <strong className="text-white">dist</strong> folder directly into the Netlify drop zone.</li>
                    <li>SPA redirects (<code className="bg-neutral-800 text-neutral-300 px-1 py-0.5 rounded font-mono">_redirects</code>) are pre-configured so deep routes like <code className="text-neutral-300">/login</code> never 404.</li>
                  </ol>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="p-5 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm">
                    <Keyboard className="w-4 h-4" />
                    <h3>Keyboard Shortcuts</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/80">
                      <span className="text-neutral-300">Focus Client Search</span>
                      <kbd className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700 font-mono text-[11px]">
                        Ctrl + K / ⌘ + K
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/80">
                      <span className="text-neutral-300">Close Modals / Overlays</span>
                      <kbd className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700 font-mono text-[11px]">
                        Escape
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-neutral-800/80">
                      <span className="text-neutral-300">Demo Login Auto-fill</span>
                      <span className="text-neutral-400 text-[11px]">One-click button on login screen</span>
                    </div>
                  </div>
                </div>

                {/* Client Status Guide */}
                <div className="p-5 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <h3>Client Lifecycle Statuses</h3>
                  </div>
                  <div className="space-y-2.5 text-xs text-neutral-300">
                    <div className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-success-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Active:</strong> Verified accounts currently receiving active services and SLA support.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-warning-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Pending:</strong> Accounts undergoing legal agreement, security audit, or onboarding review.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-danger-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Inactive:</strong> Completed projects, archived contracts, or paused accounts eligible for re-engagement.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Persistence FAQ */}
                <div className="p-5 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm">
                    <Shield className="w-4 h-4" />
                    <h3>Storage & Data Persistence</h3>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    ClientHub persists your changes immediately in browser LocalStorage. You can add, edit, or delete clients freely.
                  </p>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Need to start fresh? Navigate to <strong className="text-white">Settings</strong> and click <strong className="text-white">Reset to Default Demo Clients</strong> to restore the enterprise mock database at any time.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("clients")}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  ← Return to client directory
                </button>
              </div>
            </div>
          ) : (
            /* Dashboard & Clients Directory Table */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              {/* Table Controls & Filter Bar */}
              <div className="p-5 border-b border-neutral-800 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-white font-semibold text-base tracking-tight">
                      Client Records
                    </h2>
                    <p className="text-neutral-500 text-xs">
                      Manage client lifecycle, status verification, and contact data
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add New Client
                  </button>
                </div>

                {/* Filter and Search Inputs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input with Clear Button */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                    <input
                      ref={searchInputRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Search clients by name, email, or company"
                      placeholder="Search clients by name, email, or company..."
                      className="bg-neutral-950/60 border border-neutral-700 rounded-lg pl-10 pr-9 py-2 text-sm text-white placeholder-neutral-500 input-focus-ring w-full transition-colors"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label="Clear search input"
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
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
                      className="bg-neutral-950/60 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white input-focus-ring transition-colors min-w-[130px]"
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
                        className="inline-flex items-center gap-1.5 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm px-3 py-2 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Header Bar */}
              <div className="px-5 py-2.5 text-xs text-neutral-500 border-b border-neutral-800 bg-neutral-950/40 flex items-center justify-between">
                <span>
                  Showing <strong className="text-neutral-300">{filteredAndSortedClients.length}</strong> of{" "}
                  <strong className="text-neutral-300">{clients.length}</strong> total clients
                  {statusFilter !== "All" && (
                    <span className="ml-1 text-primary-400">({statusFilter} filter active)</span>
                  )}
                </span>
                {sortConfig.key && (
                  <span className="text-[11px] text-neutral-500">
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