// Copy for the driver waitlist page (src/pages/Register.jsx). Pre-launch,
// there is no driver account to create, only a waitlist to join: every
// heading here is written that way, on purpose.
export const REGISTER = {
  tag: "For drivers",
  heading: "Join the waitlist to drive with Kharo.",
  sub: "Tell us who you are and where you drive. We will email you the moment matching cars are ready in your city.",
  estimator: {
    label: "What drivers typically take home",
    perWeek: "/ week, full time",
    fares: "Typical weekly fares",
    rentInsurance: "Rent and insurance",
    fuel: "Fuel or charge",
    note: "A guide based on typical London minicab fares at full-time hours. Your figure moves with the hours you put in.",
    insuranceNote: "Insurance is a guide figure; you choose your own policy when you apply.",
  },
  steps: [
    {
      key: "name", q: "What's your name?", sub: "So we know who to keep in touch with.",
      fields: [{ label: "Full name", name: "name", placeholder: "Your full name", testid: "reg-name" }],
      required: ["name"],
    },
    {
      key: "email", q: "What's your email?", sub: "We'll email you the moment we go live in your area.",
      fields: [{ label: "Email", name: "email", type: "email", placeholder: "you@email.com", testid: "reg-email" }],
      required: ["email"],
    },
    {
      key: "phone", q: "Your mobile number", sub: "So we can reach you quickly when cars are ready.",
      fields: [{ label: "Mobile number", name: "phone", placeholder: "07700 900 000", testid: "reg-phone" }],
      required: ["phone"],
    },
    {
      key: "city", q: "Where do you drive?", sub: "Tell us your city so we match you to local cars first.",
      fields: [{ label: "City or area", name: "city", placeholder: "London, Croydon", testid: "reg-city" }],
      required: ["city"],
    },
    {
      key: "cartype", q: "What kind of car do you want?", sub: "A rough idea helps us line up the right options.",
      select: { name: "car_type", testid: "reg-cartype", options: ["Hybrid", "Electric", "Executive", "MPV or 7 seat", "Wheelchair accessible", "Not sure yet"] },
    },
    {
      key: "experience", q: "Your private hire experience", sub: "New drivers are welcome. This just helps us match you.",
      select: { name: "years_experience", testid: "reg-experience", options: ["New to private hire", "Under 1 year", "1 to 3 years", "3 years or more"] },
    },
    {
      key: "licence", q: "Your driving licences", sub: "Optional now. Adding them means we can move faster at launch.",
      fields: [
        { label: "DVLA licence number", name: "dvla_licence", placeholder: "SMITH901284JS9AB", testid: "reg-dvla" },
        { label: "PCO / TfL badge number", name: "pco_licence", placeholder: "123456", testid: "reg-pco" },
      ],
    },
    {
      key: "when", q: "When do you want to start?", sub: "Last one. This tells us how soon to reach out.",
      select: { name: "availability", testid: "reg-availability", options: ["As soon as possible", "Within a month", "Just exploring for now"] },
    },
  ],
  success: {
    heading: "You're on the waitlist.",
    browse: "Browse the cars",
    guide: "See how it works",
  },
};
