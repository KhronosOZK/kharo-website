// Labels for the homepage search instrument.
export const HERO_SEARCH = {
  city: "City",
  area: "Area",
  price: "Weekly rent",
  fuel: "Fuel and make",
  make: "Make",
  anyCity: "Pick a city",
  anyArea: "All areas",
  anyFuel: "Any fuel",
  anyPrice: "Any price",
  submit: "Search",
  pickCityFirst: "Choose a city first and the areas appear here.",
  resetPrice: "Reset price",
  inRange: (n) => `${n} ${n === 1 ? "car" : "cars"} in range`,
  matching: (n) => `${n} ${n === 1 ? "car matches" : "cars match"} right now`,
  near: {
    label: "Use my location",
    found: (c) => `Closest city: ${c}.`,
    denied: "No problem, pick a city instead.",
    unsupported: "Your browser will not share a location. Pick a city instead.",
  },
};
