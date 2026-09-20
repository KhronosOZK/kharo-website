// Small display helpers shared by the cards, the listing page, compare and
// the filters. Used by components/VehicleCard.jsx, components/CompareTable.jsx,
// components/FiltersDialog.jsx, pages/VehicleDetail.jsx and pages/HomeFunctional.jsx.

/** A listing's yearly mileage allowance. 0 means unlimited. */
export function mileageLabel(n, short = false) {
  if (!n) return short ? "Unlimited" : "Unlimited mileage";
  return short ? `${n.toLocaleString()} a year` : `${n.toLocaleString()} miles a year`;
}
