import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Lazily initialize user state directly from localStorage so page reloads
  // evaluate immediately in ProtectedRoute without kicking the user to /login
  const [user, setUser] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPassword = (password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { success: false, error: "Please enter both email and password." };
    }

    if (normalizedEmail === "admin@demo.com" && normalizedPassword === "admin123") {
      const authenticatedUser = {
        email: normalizedEmail,
        name: "Admin User",
        role: "Administrator",
        lastLogin: new Date().toISOString(),
      };
      setUser(authenticatedUser);
      try {
        localStorage.setItem("user", JSON.stringify(authenticatedUser));
      } catch {
        // Handle restricted or full storage environments gracefully
      }
      return { success: true };
    }

    return { success: false, error: "Invalid email or password. Use demo credentials." };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
    } catch {
      // Ignore storage errors on cleanup
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};