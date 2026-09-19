import { FACTS } from "@/content/site";

/**
 * Copy for the marketplace hero.
 *
 * The hero answers three questions before a visitor scrolls: what Kharo is,
 * who it is for, and what they can do. Both audiences are shown at once —
 * an operator should never have to find a tab to discover the site is for
 * them too.
 */
export const HERO_MARKETPLACE = {
  watermark: "KHARO",
  eyebrow: "UK private hire vehicle marketplace",
  heading: "Find your next private hire vehicle. Or fill your vacant fleet.",
  sub: "Kharo connects licensed private hire drivers with operators who have vehicles sitting unused. Browse what is available, or list what you have.",

  paths: {
    driver: {
      audience: "For drivers",
      title: "Find a vehicle",
      body: "Browse licensed vehicles by area, type and weekly price.",
      cta: "Find a vehicle",
      to: "/search",
    },
    operator: {
      audience: "For operators",
      title: "List your vehicle",
      body: "Put an idle vehicle in front of drivers who are looking now.",
      cta: "List your vehicle",
      to: "/list-your-fleet",
    },
  },

  search: {
    heading: "Where do you need a vehicle?",
    council: "Licensing area",
    councilAny: "Any licensing area",
    vehicle: "Vehicle type",
    vehicleAny: "Any vehicle type",
    rate: "Weekly budget",
    rateAny: "Any weekly price",
    submit: "Find vehicles",
    matches: (n) => `${n} ${n === 1 ? "vehicle" : "vehicles"} match`,
  },

  featured: {
    label: "Available now",
    weekLabel: "a week",
    depositLabel: "deposit",
    cta: "View vehicle",
  },

  note: FACTS.prelaunch,
};
