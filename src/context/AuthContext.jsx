import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userData, token) => {
    if (token) localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
