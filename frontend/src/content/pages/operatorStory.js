// Copy for the narrative sections added to the operator guide page
// (/operator-guide): what Kharo is to an operator and how the arrangement
// works, the line that introduces the console, and the guide link near the
// close of the page. Not part of the shared OPERATOR_GUIDE block in site.js.
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
        t: "We take the admin off your desk.",
        d: "Finding and vetting drivers, the insurance choice attached to each application, tracking documents and expiries, coordinating maintenance and handling claims when something goes wrong all run through Kharo.",
      },
      {
        t: "Rent flows through Kharo, on schedule.",
        d: `The driver pays their rent to Kharo, and we pay it to you on schedule. ${FACTS.fee}`,
      },
    ],
  },
  consoleLine: "This is what you see once your vehicles are live.",
  guideLink: {
    kicker: "Ready to list",
    heading: "Tell us about your fleet.",
    sub: "Two minutes, no commitment. We call you within one working day to get you checked and listed.",
    cta: "List your fleet",
    contents: [
      "How many vehicles, and where",
      "Getting your operator licence checked",
      "Setting your weekly rate and deposit",
      "How driver approvals reach you",
      "How and when rent reaches your account",
    ],
  },
};
