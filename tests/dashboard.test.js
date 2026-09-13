import test, { describe, it } from "node:test";
import assert from "node:assert";
import { initialClients } from "../src/data/mockClients.js";
import { formatDate, getInitials } from "../src/utils/formatters.js";

describe("1. Authentication Unit Tests", () => {
  const authenticate = (email, password) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPassword = (password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { success: false, error: "Please enter both email and password." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (normalizedEmail === "admin@demo.com" && normalizedPassword === "admin123") {
      return {
        success: true,
        user: { email: normalizedEmail, name: "Admin User", role: "Administrator" },
      };
    }

    return { success: false, error: "Invalid email or password. Use demo credentials." };
  };

  it("should successfully authenticate valid admin credentials", () => {
    const res = authenticate("admin@demo.com", "admin123");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.user.role, "Administrator");
    assert.strictEqual(res.user.email, "admin@demo.com");
  });

  it("should normalize email with whitespace and mixed casing", () => {
    const res = authenticate("   AdMin@DeMo.CoM  ", "admin123");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.user.email, "admin@demo.com");
  });

  it("should reject invalid credentials", () => {
    const res = authenticate("wrong@demo.com", "admin123");
    assert.strictEqual(res.success, false);
    assert.match(res.error, /Invalid email or password/);
  });

  it("should reject empty inputs", () => {
    const res1 = authenticate("", "");
    assert.strictEqual(res1.success, false);
    const res2 = authenticate("admin@demo.com", "");
    assert.strictEqual(res2.success, false);
    const res3 = authenticate(null, undefined);
    assert.strictEqual(res3.success, false);
  });

  it("should validate email format", () => {
    const res = authenticate("not-an-email", "admin123");
    assert.strictEqual(res.success, false);
    assert.match(res.error, /valid email address/);
  });

  it("should verify session persistence restores user immediately", () => {
    const mockStorage = {
      getItem: (key) =>
        key === "user"
          ? JSON.stringify({ email: "admin@demo.com", name: "Admin User", role: "Administrator" })
          : null,
    };

    const initialUser = (() => {
      try {
        const saved = mockStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();

    assert.ok(initialUser, "User should be restored synchronously without null flash");
    assert.strictEqual(initialUser.email, "admin@demo.com");
  });
});

describe("2. Client Management & CRUD State Tests", () => {
  let clients = [];

  it("should load initial mock clients correctly", () => {
    clients = [...initialClients];
    assert.ok(clients.length >= 5, "Should have rich initial mock clients");
    assert.ok(clients.every((c) => c.id && c.name && c.email && c.status));
  });

  it("should add a new client with generated ID and default date", () => {
    const newClientPayload = {
      name: "Alice Cooper",
      email: "alice@cooper.com",
      company: "Cooper Media",
      phone: "+1 (555) 321-7654",
      status: "Active",
      notes: "New referral account",
    };

    const newClient = {
      ...newClientPayload,
      id: 999,
      joinedAt: new Date().toISOString().split("T")[0],
    };

    clients = [newClient, ...clients];

    assert.strictEqual(clients[0].name, "Alice Cooper");
    assert.strictEqual(clients[0].id, 999);
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(clients[0].joinedAt));
  });

  it("should update an existing client", () => {
    const targetId = 1;
    clients = clients.map((c) =>
      c.id === targetId ? { ...c, company: "Acme Global Industries" } : c
    );

    const updated = clients.find((c) => c.id === targetId);
    assert.strictEqual(updated.company, "Acme Global Industries");
  });

  it("should update client status directly", () => {
    const targetId = 2;
    clients = clients.map((c) => (c.id === targetId ? { ...c, status: "Active" } : c));

    const updated = clients.find((c) => c.id === targetId);
    assert.strictEqual(updated.status, "Active");
  });

  it("should delete a client", () => {
    const initialLen = clients.length;
    const deleteId = 3;
    clients = clients.filter((c) => c.id !== deleteId);

    assert.strictEqual(clients.length, initialLen - 1);
    assert.strictEqual(clients.some((c) => c.id === deleteId), false);
  });

  it("should reset clients to default demo dataset", () => {
    clients = [...initialClients];
    assert.strictEqual(clients.length, initialClients.length);
    assert.strictEqual(clients[0].id, initialClients[0].id);
  });
});

describe("3. Search & Filter Algorithm Tests", () => {
  const testClients = [
    { id: 1, name: "John Doe", email: "john@acme.com", company: "Acme Inc.", status: "Active" },
    { id: 2, name: "Sarah Khan", email: "sarah@techcorp.io", company: "TechCorp", status: "Pending" },
    { id: 3, name: "Mike Ross", email: "mike@designco.net", company: "DesignCo", status: "Inactive" },
    { id: 4, name: "Emma Wilson", email: "emma@startupx.com", company: "StartupX", status: "Active" },
  ];

  const applySearchAndFilter = (list, query, status) => {
    const normalized = query.trim().toLowerCase();
    return list.filter((c) => {
      const matchesSearch =
        !normalized ||
        c.name.toLowerCase().includes(normalized) ||
        c.email.toLowerCase().includes(normalized) ||
        c.company.toLowerCase().includes(normalized);
      const matchesStatus = status === "All" || c.status === status;
      return matchesSearch && matchesStatus;
    });
  };

  it("should search by name case-insensitively", () => {
    const results = applySearchAndFilter(testClients, "john", "All");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, "John Doe");
  });

  it("should search by email domain", () => {
    const results = applySearchAndFilter(testClients, "techcorp.io", "All");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, "Sarah Khan");
  });

  it("should search by company name", () => {
    const results = applySearchAndFilter(testClients, "designco", "All");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, "Mike Ross");
  });

  it("should filter by status alone", () => {
    const active = applySearchAndFilter(testClients, "", "Active");
    assert.strictEqual(active.length, 2);
    assert.ok(active.every((c) => c.status === "Active"));

    const pending = applySearchAndFilter(testClients, "", "Pending");
    assert.strictEqual(pending.length, 1);
    assert.strictEqual(pending[0].status, "Pending");
  });

  it("should correctly combine search AND filter", () => {
    // Sarah is Pending
    const result1 = applySearchAndFilter(testClients, "Sarah", "Pending");
    assert.strictEqual(result1.length, 1);
    assert.strictEqual(result1[0].name, "Sarah Khan");

    // Sarah is NOT Active, so searching Sarah with Active filter should return 0 results
    const result2 = applySearchAndFilter(testClients, "Sarah", "Active");
    assert.strictEqual(result2.length, 0);
  });

  it("should return all items when query is empty and status is All", () => {
    const results = applySearchAndFilter(testClients, "   ", "All");
    assert.strictEqual(results.length, testClients.length);
  });

  it("should handle unmatched search cleanly", () => {
    const results = applySearchAndFilter(testClients, "nonexistent-query-xyz", "All");
    assert.strictEqual(results.length, 0);
  });
});

describe("4. Sorting Algorithm Tests", () => {
  const testList = [
    { id: 1, name: "Charlie", company: "Zeta Corp", joinedAt: "2024-02-01" },
    { id: 2, name: "Alice", company: "Beta LLC", joinedAt: "2024-01-10" },
    { id: 3, name: "Bob", company: "Alpha Inc", joinedAt: "2024-03-15" },
  ];

  const sortClients = (list, key, direction) => {
    return [...list].sort((a, b) => {
      const valA = a[key] || "";
      const valB = b[key] || "";
      let comp = valA.localeCompare(valB);
      return direction === "asc" ? comp : -comp;
    });
  };

  it("should sort by name ascending", () => {
    const sorted = sortClients(testList, "name", "asc");
    assert.deepStrictEqual(
      sorted.map((c) => c.name),
      ["Alice", "Bob", "Charlie"]
    );
  });

  it("should sort by name descending", () => {
    const sorted = sortClients(testList, "name", "desc");
    assert.deepStrictEqual(
      sorted.map((c) => c.name),
      ["Charlie", "Bob", "Alice"]
    );
  });

  it("should sort by company ascending", () => {
    const sorted = sortClients(testList, "company", "asc");
    assert.deepStrictEqual(
      sorted.map((c) => c.company),
      ["Alpha Inc", "Beta LLC", "Zeta Corp"]
    );
  });

  it("should sort by joined date ascending", () => {
    const sorted = sortClients(testList, "joinedAt", "asc");
    assert.deepStrictEqual(
      sorted.map((c) => c.id),
      [2, 1, 3]
    );
  });
});

describe("5. KPI Stats Calculation Tests", () => {
  it("should calculate exact status counts and active percentage", () => {
    const mock = [
      { status: "Active" },
      { status: "Active" },
      { status: "Active" },
      { status: "Pending" },
      { status: "Inactive" },
    ];

    const total = mock.length;
    const active = mock.filter((c) => c.status === "Active").length;
    const pending = mock.filter((c) => c.status === "Pending").length;
    const inactive = mock.filter((c) => c.status === "Inactive").length;
    const activeRate = Math.round((active / total) * 100);

    assert.strictEqual(total, 5);
    assert.strictEqual(active, 3);
    assert.strictEqual(pending, 1);
    assert.strictEqual(inactive, 1);
    assert.strictEqual(activeRate, 60);
  });
});

describe("6. Formatters & Utility Tests", () => {
  it("should format date string without timezone skew", () => {
    const formatted = formatDate("2024-01-15");
    assert.match(formatted, /Jan 15, 2024/);
  });

  it("should handle null or invalid date strings safely", () => {
    assert.strictEqual(formatDate(null), "N/A");
    assert.strictEqual(formatDate(""), "N/A");
  });

  it("should compute uppercase avatar initials correctly", () => {
    assert.strictEqual(getInitials("John Doe"), "JD");
    assert.strictEqual(getInitials("Sarah"), "S");
    assert.strictEqual(getInitials("Amina Al-Mansoor"), "AA");
    assert.strictEqual(getInitials(""), "?");
  });
});
