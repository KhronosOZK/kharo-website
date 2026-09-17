import axios from "axios";

// REACT_APP_BACKEND_URL is set in Vercel's project env vars, but that value
// has drifted to a localhost URL left over from local development. When the
// app itself isn't running on localhost, a localhost backend can never be
// reachable, so treat that combination as unset and fall back to the real
// backend instead of firing requests at a dead address on every page view.
const envBackend = process.env.REACT_APP_BACKEND_URL;
const envIsLocalhost = envBackend && /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(envBackend);
const appIsLocalhost = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
const BASE =
  envBackend && !(envIsLocalhost && !appIsLocalhost)
    ? envBackend
    : "https://kharo-backend.onrender.com";
export const API = `${BASE}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export function trackEvent(type, data) {
  api.post("/events", { type, data }).catch(() => {});
}
