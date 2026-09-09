// Duration based pricing and operator earnings helpers

export const DURATIONS = [
  { weeks: 4, label: "4 weeks" },
  { weeks: 8, label: "8 weeks" },
  { weeks: 12, label: "12 weeks" },
  { weeks: 26, label: "26 weeks" },
  { weeks: 52, label: "52 weeks" },
];

export function discountForWeeks(weeks) {
  if (weeks >= 52) return 0.10;
  if (weeks >= 26) return 0.08;
  if (weeks >= 12) return 0.06;
  if (weeks >= 4) return 0.03;
  return 0;
}

export function weeklyForWeeks(base, weeks) {
  return +(base * (1 - discountForWeeks(weeks))).toFixed(2);
}

export const PRICING_TIERS = [
  { label: "Flexible", sub: "1 to 3 weeks", weeks: 1 },
  { label: "Standard", sub: "4 to 11 weeks", weeks: 4 },
  { label: "Long term", sub: "12 weeks or more", weeks: 12 },
];

// Rough operator earnings estimate (gross, before Kharo's 10% fee)
export function estimateOperatorAnnual(fleetSizeLabel) {
  const midpoint = { "1-5": 3, "6-15": 10, "16-30": 22, "30+": 40 }[fleetSizeLabel] || 10;
  const avgWeekly = 255;
  const utilisation = 0.85;
  const perCarYear = Math.round(avgWeekly * 52 * utilisation);
  return { perCarYear, fleetYear: perCarYear * midpoint, cars: midpoint };
}

// Vehicle classes used by the interactive earnings estimator
export const VEHICLE_CLASSES = [
  { key: "hybrid", label: "Hybrid saloon", weekly: 255 },
  { key: "executive", label: "Executive", weekly: 330 },
  { key: "electric", label: "Electric", weekly: 235 },
  { key: "wav", label: "Wheelchair access", weekly: 255 },
];

export function fleetBucket(cars) {
  if (cars <= 5) return "1-5";
  if (cars <= 15) return "6-15";
  if (cars <= 30) return "16-30";
  return "30+";
}

// Interactive fleet earnings estimator (Airbnb-style)
export function estimateFleetEarnings(cars, weekly, utilisation = 0.85, feeRate = 0.10) {
  const grossWeekly = cars * weekly * utilisation;
  const grossYear = grossWeekly * 52;
  const grossMonth = grossYear / 12;
  return {
    grossMonth: Math.round(grossMonth),
    grossYear: Math.round(grossYear),
    netMonth: Math.round(grossMonth * (1 - feeRate)),
    netYear: Math.round(grossYear * (1 - feeRate)),
    perCarMonth: Math.round((weekly * utilisation * 52) / 12),
  };
}

// Driver weekly take-home estimator (based on typical London PHV fares)
export const DRIVER_CARS = [
  { key: "electric", label: "Electric", sub: "Lowest running cost" },
  { key: "hybrid", label: "Hybrid", sub: "The London workhorse" },
  { key: "executive", label: "Executive", sub: "Higher fares" },
];

export function estimateDriverWeek(carKey) {
  const grossFull = { electric: 1180, hybrid: 1220, executive: 1450 };
  const rentByCar = { electric: 235, hybrid: 255, executive: 330 };
  const gross = Math.round(grossFull[carKey] ?? 1220);
  const insurance = 72;
  const cover = 8;
  const rent = rentByCar[carKey] ?? 255;
  const fuel = carKey === "electric" ? 55 : carKey === "executive" ? 155 : 135;
  const carCost = rent + insurance + cover;
  const takeHome = Math.max(gross - carCost - fuel, 0);
  return { gross, rent, insurance, cover, fuel, carCost, takeHome };
}
