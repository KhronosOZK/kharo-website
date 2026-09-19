// Copy for the operator earnings calculator.
export const OPERATOR_EARNINGS = {
  heading: "See what your fleet could earn.",
  sub: "Move the dials to your own fleet. The second number is what the empty seats cost you over a year, which is usually the one that decides it.",
  carsLabel: "Cars in your fleet",
  utilLabel: "Weeks rented out of every 10",
  utilNote: "Most fleets sit between 70% and 90% once drivers are matched properly.",
  rateLabel: "Weekly rate you would set",
  rateNote: "The bars show what comparable cars rent for across our launch cities.",
  comparable: (n) => `${n} comparable ${n === 1 ? "car" : "cars"}`,
  yearLabel: "Rent collected a year",
  weekLabel: "A week",
  rentedLabel: "Cars earning",
  idleLabel: "Lost to idle cars a year",
  disclaimer: "An illustration based on your inputs and the rates comparable cars are listed at, not a quote or a guarantee.",
  cta: "List your fleet",
  ctaNote: "Free to list. We call you within one working day.",
};
