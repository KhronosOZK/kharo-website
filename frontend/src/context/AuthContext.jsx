import { createContext, useContext, useState } from "react";
import { api, formatApiError } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false); // login removed; kept for shortlist state only
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("caro_saved") || "[]"); } catch { return []; }
  });
  const [compare, setCompare] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kharo_compare") || "[]"); } catch { return []; }
  });
  // Sale listings are kept apart from rental saves. They are different objects
  // with different fields, so merging the two lists would break both pages.
  const [savedSales, setSavedSales] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kharo_saved_sales") || "[]"); } catch { return []; }
  });

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      return { ok: true, user: data };
    } catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      setUser(data);
      return { ok: true };
    } catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const logout = async () => { await api.post("/auth/logout").catch(() => {}); setUser(false); };

  const forgotPassword = async (email) => {
    try { await api.post("/auth/forgot-password", { email }); return { ok: true }; }
    catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const resetPassword = async (token, password) => {
    try { await api.post("/auth/reset-password", { token, password }); return { ok: true }; }
    catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const toggleSaved = (id) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("caro_saved", JSON.stringify(next));
      return next;
    });
  };

  const toggleCompare = (id) => {
    setCompare((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("kharo_compare", JSON.stringify(next));
      return next;
    });
  };

  const clearCompare = () => { setCompare([]); localStorage.setItem("kharo_compare", "[]"); };

  const toggleSavedSale = (id) => {
    setSavedSales((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("kharo_saved_sales", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, forgotPassword, resetPassword, saved, toggleSaved, compare, toggleCompare, clearCompare, savedSales, toggleSavedSale }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
