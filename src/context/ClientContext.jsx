import { createContext, useContext, useState, useEffect } from "react";
import { initialClients } from "../data/mockClients";

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("clients") : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      return initialClients;
    }

    return initialClients;
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("clients", JSON.stringify(clients));
      }
    } catch {
      // Ignore write failures in restricted or storage-disabled environments.
    }
  }, [clients]);

  const addClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: Date.now(),
      joinedAt: clientData.joinedAt || new Date().toISOString().split("T")[0],
    };

    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id, updates) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const updateClientStatus = (id, newStatus) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const resetToDefaultClients = () => {
    setClients(initialClients);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("clients", JSON.stringify(initialClients));
      }
    } catch {
      // Ignore write failures
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        updateClientStatus,
        deleteClient,
        resetToDefaultClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  return context;
};