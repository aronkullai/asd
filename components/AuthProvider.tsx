"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  email: string;
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  async function refreshAuth() {
    setLoading(true);
    const response = await fetch("/api/auth/me", { cache: "no-store" }).catch(() => null);
    const payload = response?.ok ? await response.json().catch(() => null) : null;
    setUser(payload?.user || null);
    setLoading(false);
  }

  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    if (response?.ok) {
      setUser(null);
      return true;
    }
    return false;
  }

  useEffect(() => {
    refreshAuth();
  }, []);

  const value = useMemo(() => ({ user, loading, refreshAuth, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

