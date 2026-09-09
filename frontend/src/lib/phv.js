// Helpers for the private hire vehicle sales marketplace.
// Licensing dates are the thing buyers shop on, so they get first class
// formatting rather than a raw ISO string.

export const BODY_TYPES = ["any", "saloon", "estate", "executive", "mpv", "wav"];
export const FUELS = ["any", "hybrid", "electric", "petrol", "diesel"];
export const SELLER_TYPES = [
  { value: "any", label: "Any seller" },
  { value: "driver", label: "Private drivers" },
  { value: "operator", label: "Fleet operators" },
];
export const PCO_MINIMUMS = [
  { value: "0", label: "Any" },
  { value: "3", label: "3 months or more" },
  { value: "6", label: "6 months or more" },
  { value: "9", label: "9 months or more" },
];

export function monthsLeft(iso) {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  if (target <= today) return 0;
  let months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
  if (target.getDate() < today.getDate()) months -= 1;
  return Math.max(months, 0);
}

export function formatDate(iso) {
  if (!iso) return "Not supplied";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not supplied";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatPrice(n) {
  if (n == null) return "Price on request";
  return `£${Number(n).toLocaleString("en-GB")}`;
}

export function formatMileage(n) {
  if (n == null) return "Not supplied";
  return `${Number(n).toLocaleString("en-GB")} miles`;
}

// Colour and wording for the licence countdown badge. Long licence is good
// news, a short one is not a warning so much as a cost to plan for.
export function licenceTone(months) {
  if (months == null) return { tone: "neutral", text: "Expiry not supplied" };
  if (months >= 6) return { tone: "good", text: `${months} months PCO left` };
  if (months >= 3) return { tone: "fair", text: `${months} months PCO left` };
  if (months >= 1) return { tone: "short", text: `${months} month${months === 1 ? "" : "s"} PCO left` };
  return { tone: "short", text: "PCO renewal due" };
}

export const TONE_CLASSES = {
  good: "bg-[#0B6B4F] text-white",
  fair: "bg-[#5FD3A6] text-[#0A130F]",
  short: "bg-[#C08A2D] text-white",
  neutral: "bg-[#E7E4DD] text-[#4A564F]",
};

export function typeLabel(t) {
  if (!t) return "";
  if (t === "wav") return "WAV";
  if (t === "mpv") return "MPV";
  return t.charAt(0).toUpperCase() + t.slice(1);
}
