// Copy for the marketplace browse surface: the vehicle card, search results,
// vehicle detail, compare and saved pages. Kept apart from site.js because
// none of these had a dedicated block there yet.

export const CARD = {
  registerInterest: "Register interest",
  preview: "Preview listing, not bookable yet.",
  rentalOnly: "Rent only. You choose the insurance.",
  insuranceIncluded: "Insurance included by the operator.",
};

export const SEARCH = {
  seo: {
    title: "Browse private hire cars to rent, checked operators · Kharo",
    description:
      "Filter private hire and PCO cars by city, area, fuel and weekly budget. The rental price is shown first, and insurance is chosen when you apply.",
  },
  filters: {
    cityLabel: "City",
    cityPlaceholder: "Pick a city",
    areaLabel: "Area",
    areaPlaceholder: "All areas",
    fuelLabel: "Fuel",
    budgetLabel: "Weekly rent",
    makeLabel: "Make",
    modelLabel: "Model",
    makeModelLabel: "Make and model",
    anyMake: "Any make",
    anyModel: "Any model",
    pickMakeFirst: "Pick a make first",
    bodyLabel: "Body type",
    anyBody: "Any body type",
    colourLabel: "Colour",
    anyColour: "Any colour",
    rentFrom: "From",
    rentTo: "To",
    transmissionLabel: "Transmission",
    seatsLabel: "Seats",
    seatsValue: (n) => `${n} seats`,
    ageLabel: "Vehicle age",
    ageTo: "to",
    ageRange: (from, to) => `${from} to ${to}`,
    mileageLabel: "Mileage allowance",
    mileageAny: "Any allowance",
    mileageUnlimited: "Unlimited only",
    mileageAtLeast: (n) => `At least ${n.toLocaleString()} miles a year`,
    councilLabel: "Licensing council",
    councilNote:
      "Wolverhampton plates are widely used for cross-border work, so cars licensed by the City of Wolverhampton Council can be driven across England and Wales.",
    moreFilters: "More filters",
    filtersButton: "Filters",
    clearAll: "Clear all",
    showResults: "Show results",
    showCars: (n) => `Show ${n} car${n === 1 ? "" : "s"}`,
  },
  sort: {
    label: "Sort",
    options: [
      { value: "recommended", label: "Recommended" },
      { value: "price_asc", label: "Price, low to high" },
      { value: "price_desc", label: "Price, high to low" },
      { value: "newest", label: "Newest listings" },
      { value: "oldest", label: "Oldest listings" },
    ],
  },
  resultsCount: (n) => `${n} car${n === 1 ? "" : "s"} to rent`,
  map: { show: "Show map", hide: "Hide map", backToList: "Back to list" },
  emptyFilters: {
    heading: "No cars match",
    sub: "Try a bigger budget, or take one filter off.",
    cta: "Clear all filters",
  },
  emptyCity: {
    heading: (city) => `No cars in ${city} just yet`,
    sub: (city) =>
      `Kharo is built for the whole UK and we are bringing operators to every city. Join the waitlist and we will email you the moment ${city} has cars.`,
  },
};

export const COMPARE = {
  seo: { title: "Compare cars · Kharo" },
  heading: "Compare cars",
  count: (n) => `${n} car${n === 1 ? "" : "s"} side by side`,
  clearAll: "Clear all",
  lowestRent: "Lowest rent",
  rows: {
    rent: "Rent per week",
    deposit: "Deposit, refundable",
    insurance: "Insurance",
    insuranceValue: "Chosen when you apply",
    fuel: "Fuel",
    transmission: "Transmission",
    seats: "Seats",
    mileage: "Mileage allowance",
    area: "Area",
  },
  applyCta: "Register interest",
  empty: {
    heading: "Nothing to compare yet",
    body: "Add cars to compare while you browse, then see them here side by side.",
    cta: "Browse cars",
  },
};

export const SAVED = {
  seo: { title: "Saved cars · Kharo" },
  heading: "Saved cars",
  count: (n) => `${n} car${n === 1 ? "" : "s"} saved`,
  compareCta: (n) => `Compare ${n} cars`,
  backToGrid: "Back to grid",
  empty: {
    heading: "No saved cars yet",
    body: "Tap the heart on any car to save it here, then compare the weekly rent side by side.",
    cta: "Browse cars",
  },
};

export const DETAIL = {
  back: "Back to results",
  save: "Save",
  saved: "Saved",
  share: "Share",
  shareCopied: "Copied",
  breadcrumbHome: "Home",
  breadcrumbSearch: "Search",
  whatCoversHeading: "What your weekly rent covers",
  covers: {
    compliance: "MOT, road tax and PHV compliance, handled by the operator",
    breakdownIncluded: "24/7 breakdown cover included",
    breakdownAvailable: "Breakdown cover available to add, £8 a week",
    servicingAt: (garage) => `Servicing booked at ${garage}`,
  },
  insuranceHeading: "Insurance",
  insuranceChosen: "Chosen when you apply",
  coverHeading: "Compare insurance for this car",
  coverSub: "Insurance is separate from the rent. Pick a level and how often you pay. You can change it when you apply.",
  coverNote: "These prices are a guide, for a driver with a clean licence and two years of experience. You get real prices from the insurers when you apply.",
  coverPaidTo: "Paid to the insurer, not the operator.",
  insuranceHelper:
    "Comprehensive, third party fire and theft, or third party, paid monthly, six-monthly or yearly.",
  pricingHeading: "The longer you rent, the less you pay",
  save3: "Save 3%",
  save6: "Save 6%",
  moreAnglesHeading: "More angles",
  vehicleDetailsHeading: "Vehicle details",
  collectionAreaHeading: "Collection area",
  collectionNote: (borough, postcode) =>
    `Approximate area: ${borough}, ${postcode}. Exact address shared once your details are confirmed.`,
  reviewsHeading: "Operator reviews",
  noReviews: "No reviews yet",
  reviewsBody:
    "This operator is new to Kharo. Background and licence checks are complete. Driver reviews will appear here after the first rentals.",
  experienceOpen: "Open to new drivers",
  specs: {
    fuel: "Fuel type",
    seats: "Seats",
    economy: "Economy",
    mileage: "Mileage allowance",
    experience: "Experience required",
    deposit: "Deposit",
    servicing: "Servicing",
    restrictions: "Restrictions",
    none: "None",
  },
  applyCta: "Register interest",
  mobileRentPrefix: "Rent from",
  mobileRentSuffix: "a week",
  trustFooter: "Operator checked against the licensing register. No payment taken at this stage.",
};
