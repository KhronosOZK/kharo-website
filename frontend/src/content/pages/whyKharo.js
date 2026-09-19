// Copy that belongs only to the Why Kharo page (/why-kharo) and is not part
// of the shared WHY block in site.js. Kharo is pre-launch: this is the page
// that argues the whole product, so it leans on FACTS for anything that must
// match the rest of the site word for word.
import { FACTS } from "@/content/site";

export const ONE_PLATFORM = {
  heading: "One platform, not five.",
  body:
    "Today a driver puts a rental car, an insurance broker, a platform's own onboarding, a local garage and a separate claims line together themselves, one phone call at a time. Kharo is the first marketplace of its kind in the UK to put every one of those in a single place.",
  without: {
    heading: "Without Kharo",
    items: [
      "A rental firm for the car",
      "A broker for the insurance",
      "Each platform's own onboarding",
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
