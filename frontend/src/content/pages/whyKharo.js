// Copy that belongs only to the Why Kharo page (/why-kharo) and is not part
// of the shared WHY block in site.js. Kharo is pre-launch: this is the page
// that argues the whole product, so it leans on FACTS for anything that must
// match the rest of the site word for word.
import { FACTS } from "@/content/site";

export const ONE_PLATFORM = {
  heading: "One platform, not five.",
  body:
    "Today a driver has to find a rental firm, an insurance broker, the Uber and Bolt sign-up, a garage and a claims line, one phone call at a time. Kharo puts all of them in one place.",
  without: {
    heading: "Without Kharo",
    items: [
      "A rental firm for the car",
      "A broker for the insurance",
      "The Uber and Bolt sign-up",
      "A garage for the MOT and servicing",
      "A separate claims line if something goes wrong",
    ],
  },
  with: {
    heading: "With Kharo",
    line: "The car, the insurance, the platform set-up, the garage and the claims line, in one place.",
    note: FACTS.support,
  },
};

export const CLOSER_PANELS = {
  driver: {
    heading: "For drivers",
    body: "Browse the cars, or read how renting works before you register your interest.",
    cta: "For drivers",
    to: "/for-drivers",
  },
  operator: {
    heading: "For operators",
    body: "See how listing your fleet works, or register your interest today.",
    cta: "For operators",
    to: "/operator-guide",
  },
};
