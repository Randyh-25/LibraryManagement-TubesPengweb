import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext();

const STORAGE_KEY = "library-auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setToken(parsed.token);
        setUser(parsed.user);
      } catch (err) {
        console.error("Failed to parse auth cache", err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, user]);

  const login = async (email, password) => {
    setError(null);
    const res = await authApi.login({ email, password });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload) => {
    setError(null);
    await authApi.register(payload);
    return login(payload.email, payload.password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, error, setError, login, register, logout }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
