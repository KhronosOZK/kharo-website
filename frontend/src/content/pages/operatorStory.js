// Copy for the narrative sections added to the operator guide page
// (/operator-guide): what Kharo is to an operator and how the arrangement
// works, plus the line that introduces the console. Not part of the shared
// OPERATOR_GUIDE block in site.js.
import { FACTS } from "@/content/site";

export const OPERATOR_STORY = {
  intro: {
    heading: "What Kharo is, for you.",
    points: [
      {
        t: "A marketplace, not a booking form.",
        d: "Kharo is the first platform of its kind in the UK, built to bring vetted private hire drivers to cars that are standing idle. You list a vehicle, and we bring you a driver who is ready to take it.",
      },
      {
        t: "The car, the rate and the final yes stay yours.",
        d: "You choose which vehicles go up and you set the weekly rate. Every application that reaches you arrives with the checks already done, and you decide who drives your car.",
      },
      {
        // This section says what Kharo IS. How the listing gets built, who
        // calls you and what happens afterwards are the "How listing works"
        // steps further down the same page, so they are not repeated here.
        t: "Nothing to pay to find out.",
        d: FACTS.fee,
      },
    ],
  },
  consoleLine: "This is what you see once your vehicles are live.",
};
