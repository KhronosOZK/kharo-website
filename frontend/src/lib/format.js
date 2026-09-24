// Small display helpers shared by the cards, the listing page, compare and
// the filters. Used by components/VehicleCard.jsx, components/CompareTable.jsx,
// components/FiltersDialog.jsx, pages/VehicleDetail.jsx and pages/HomeFunctional.jsx.

import { APPLICATION_FLOW } from "@/content/pages/applicationFlow";

/** True when the first photograph genuinely shows the listed car (the
 * matched catalogue or a local photograph), false for a same-model stand-in. */
export function hasOwnPhoto(v) {
  const p = v?.photos?.[0];
  return typeof p === "string" && (p.startsWith("/images/listings/") || p.includes("prod-images.emergentagent.com"));
}

const WEEKS = { monthly: 4.33, sixMonthly: 26, annual: 52 };
/** A quote's price for one term, as a weekly figure. */
export function weeklyInsurance(quote, term = "monthly") {
  return Math.round(quote.price[term] / WEEKS[term]);
}
/** The cheapest sample cover, per week: what "insurance from" means on a card. */
export const INSURANCE_FROM_WEEKLY = Math.min(...APPLICATION_FLOW.quotes.map((q) => weeklyInsurance(q, "monthly")));

/** Rent is quoted per week and paid monthly: 52 weeks spread over 12 months. */
export function monthlyFromWeekly(weekly) {
  return Math.round((weekly * 52) / 12);
}

/** A listing's yearly mileage allowance. 0 means unlimited. */
export function mileageLabel(n, short = false) {
  if (!n) return short ? "Unlimited" : "Unlimited mileage";
  return short ? `${n.toLocaleString()} a year` : `${n.toLocaleString()} miles a year`;
}
