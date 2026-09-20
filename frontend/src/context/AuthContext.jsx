import { createContext, useContext, useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(false); // false = signed out; an object = signed in
  // The session lives in an httpOnly cookie, so on a fresh load the only way to
  // know who is signed in is to ask. Without this, /admin and the consoles
  // showed the sign-in form again on every reload even with a valid cookie.
  useEffect(() => {
    let alive = true;
    api.get("/auth/me").then((r) => { if (alive) setUser(r.data); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("caro_saved") || "[]"); } catch { return []; }
  });
  const [compare, setCompare] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kharo_compare") || "[]"); } catch { return []; }
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


  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, forgotPassword, resetPassword, saved, toggleSaved, compare, toggleCompare, clearCompare }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
