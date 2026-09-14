// ---------------------------------------------------------------------------
// KHARO SITE COPY
//
// Every word of marketing text on the public pages lives in this one file.
// Edit the text here and it updates wherever it appears. You do not need to
// touch any page component to change wording.
//
// House style:
//   British English. Plain words. Short sentences. Address the reader as "you".
//   Lead with what the reader gets, not with what other companies do badly.
//   Never state a figure we cannot stand behind.
//
// See EDITING-GUIDE.md in the project root for a full walkthrough.
// ---------------------------------------------------------------------------

import { IMG } from "@/lib/images";

// ---------------------------------------------------------------------------
// GLOBAL, used by the header, footer and page titles
// ---------------------------------------------------------------------------
export const BRAND = {
  name: "Kharo",
  tagline: "Private hire car rental, made clear.",
  footerBlurb:
    "Rent or buy a licensed private hire vehicle from operators checked against Companies House and the licensing register. One clear weekly price, cover included.",
  supportEmail: "hello@kharo.uk",
  privacyEmail: "privacy@kharo.uk",
  copyright: "© 2026 Kharo. Serving drivers in London, Birmingham, Manchester, Leeds and Sheffield.",
  // Add your real profile URLs to switch these on. Icons stay hidden while the
  // values are empty, because a link that leaves the site and lands on a
  // generic homepage costs a visitor and returns nothing.
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
};

export const NAV = {
  primary: [
    { to: "/", label: "Rent a car" },
    { to: "/why-caro", label: "Why Kharo" },
    { to: "/driver-guide", label: "How it works" },
    { to: "/operator-guide", label: "For operators" },
  ],
  accountMenu: [
    { to: "/register", title: "Drivers", sub: "Join the list for launch in your city" },
    { to: "/list-your-fleet", title: "Rental operators", sub: "Register your fleet for launch" },
  ],
  mobileCtas: [
    { to: "/register", label: "Drivers, register your interest" },
    { to: "/list-your-fleet", label: "Operators, list your fleet" },
  ],
  newsletter: {
    heading: "Get launch updates",
    sub: "Be first to hear when we open in your area.",
    placeholder: "you@email.com",
    success: "You are on the list. We will be in touch before we go live in your area.",
  },
  footerColumns: [
    {
      heading: "Drivers",
      links: [
        ["Rent a car", "/"],
        ["How renting works", "/driver-guide"],
        ["Register your interest", "/register"],
      ],
    },
    {
      heading: "Operators",
      links: [
        ["List your fleet", "/list-your-fleet"],
        ["Operator guide", "/operator-guide"],
      ],
    },
    {
      heading: "Company",
      links: [
        ["Why choose Kharo", "/why-caro"],
        ["Get help", "/help"],
        ["Trust and safety", "/why-caro"],
        ["Legal and privacy", "/legal"],
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// PRE-LAUNCH LABELLING
//
// The rental inventory is representative, not bookable. This wording appears
// wherever a visitor could otherwise assume a car is available today. Change it
// here and it changes everywhere. When real operator stock goes live, remove
// <PreviewNotice /> from the pages listed in EDITING-GUIDE.md section 9.
// ---------------------------------------------------------------------------
export const PREVIEW = {
  label: "Preview inventory.",
  banner: "These cars show the kind of vehicle, price and area our launch operators rent out. They are not bookable yet. Tell us which one suits you and we will match you to a real car when we go live in your city.",
  inline: "This car is not bookable yet. Registering tells us the vehicle, price and area you want, and we will come back to you with a real match at launch.",
  ctaPrimary: "This is the car I want",
  ctaSecondary: "Tell us this suits you",
  formHeading: "Tell us this is the car for you",
  formSub: "The more specific you are, the better the match when we open in your city.",
  successHeading: "Noted, and thank you.",
  successBody: "We have logged the car, the price and the area you are after. You will hear from us before we go live in your city.",
};

// ---------------------------------------------------------------------------
// HOME PAGE
// ---------------------------------------------------------------------------
export const HOME = {
  hero: {
    eyebrow: "Private hire vehicles, rent or buy",
    heading: "Renting with Kharo",
    sub: "See the cars, the areas and the real weekly cost including insurance. Tell us which one suits you and we will match you when we open in your city.",
    searchCta: "Show me the cars",
    filters: {
      city: "Where you drive",
      type: "Type of car",
      fuel: "Fuel",
      budget: "Weekly budget",
    },
  },
  // The first stat count comes from live inventory. Keep the rest factual.
  stats: [
    { fallback: "60", label: "cars in the launch preview" },
    { value: "5 cities", label: "London, Birmingham, Manchester, Leeds and Sheffield" },
    { value: "Free", label: "to register, with nothing to pay" },
    { value: "One price", label: "rent, insurance and cover in a single weekly figure" },
  ],
  spotlight: {
    eyebrow: "Worth a look",
    heading: "Popular cars this week",
    featuredCta: "See the full weekly cost",
    allCta: "See all cars",
  },
  collections: {
    heading: "Find the right kind of work",
    items: [
      { key: "electric", label: "Electric and ULEZ exempt", desc: "The lowest running costs in London", icon: "Zap", img: IMG.ev, q: "fuel=electric" },
      { key: "executive", label: "Executive and premium", desc: "Higher fares and longer journeys", icon: "Sparkles", img: IMG.executive, q: "type=executive" },
      { key: "value", label: "Under £250 a week", desc: "A comfortable place to start out", icon: "Coins", img: IMG.hybrid, q: "max=250" },
      { key: "wav", label: "Wheelchair accessible", desc: "Steady work and strong demand", icon: "Accessibility", img: IMG.interior, q: "type=wav" },
    ],
  },
  cities: {
    eyebrow: "Where we operate",
    heading: "Browse cars by city",
  },
  howItWorks: {
    eyebrow: "How it works",
    heading: "How renting works",
    sub: "The numbers are in front of you from the first click, and nothing is charged until an operator has said yes.",
    steps: [
      { n: "1", t: "Look around", d: "Filter by area, fuel and budget. The price you see is the price you pay, with cover included." },
      { n: "2", t: "Tell us once", d: "Your licence and insurance details are saved and reused, so you fill the form a single time." },
      { n: "3", t: "Agree and drive", d: "Settle the terms with the operator, take your handover photos and collect the keys." },
    ],
    cta: "Read the full walkthrough",
  },
  operatorCta: {
    eyebrow: "For rental companies",
    heading: "For rental companies",
    sub: "List your fleet, get matched with drivers we have vetted, and receive your payout every fortnight. If a driver stops paying, we cover the rent for up to two weeks while you arrange a replacement.",
    primaryCta: "List your fleet",
    secondaryCta: "See how it works",
    card: {
      label: "Typical earnings per car",
      note: "before our 10% fee, at typical utilisation",
      rows: [
        ["Run 10 cars", null],
        ["Paid to you", "Every fortnight"],
        ["If a driver defaults", "Rent covered 2 wks"],
      ],
      cta: "See your earning potential",
    },
  },
};

// ---------------------------------------------------------------------------
// WHY KHARO
// ---------------------------------------------------------------------------
export const WHY = {
  hero: {
    eyebrow: "Why Kharo",
    heading: "Private hire rental done properly.",
    sub: "Drivers get an honest price and a process that is explained before they need it. Operators get vetted drivers and rent that arrives on schedule.",
    img: IMG.driverSuit,
  },
  stat: {
    number: "12,712",
    label: "more PHV licences than licensed vehicles in London right now",
    source: "TfL, May 2026",
    context: "That gap is why idle fleet costs operators money and why drivers who qualify should never struggle to find a car.",
  },
  drivers: {
    eyebrow: "For drivers",
    heading: "No surprises.",
    img: IMG.happyDriver,
    cta: "Browse cars",
    points: [
      { t: "The full weekly cost, on every card", d: "Rent, hire and reward insurance, and breakdown cover are added together before you see the number. What is shown is what leaves your account." },
      { t: "Your rate set against your real earnings", d: "With your consent, we check twelve months of actual bank deposits, not a number you typed in. Your weekly rate is modelled against your quietest weeks, not your best ones." },
      { t: "The tracking explained before you get in", d: "The car has a tracker. Your operator does not see your live location. We do, but only in three specific circumstances, all published in advance. Nothing is left for you to wonder about." },
      { t: "A person on the phone, not a form", d: "A bump, a warning light or a payment question. One contact gets you to the right person the same day." },
    ],
  },
  operators: {
    eyebrow: "For operators",
    heading: "Drivers worth having.",
    img: IMG.fleetLot,
    cta: "List your fleet",
    points: [
      { t: "12,712 drivers looking for a car right now", d: "London has more licensed drivers than licensed vehicles. We connect you to qualified, vetted drivers who are ready and legal to work today." },
      { t: "Four layers of checks before they reach your queue", d: "Eligibility against the TfL register, identity with a liveness check, affordability via Open Banking, and trade record against Kharo's driver network. The application that reaches you is one you can act on." },
      { t: "Rent that arrives in seconds, not days", d: "Variable Recurring Payments settle instantly and cannot be reversed. If a payment fails, you know before the next working day." },
      { t: "Full visibility, within published limits", d: "You see mileage, vehicle status and service alerts. Live location stays with Kharo and is accessed only under a logged procedure in genuine theft or serious arrears situations." },
    ],
  },
  closing: {
    heading: "Ready to find your car?",
    sub: "Browse vehicles from checked operators with insurance and cover already in the price.",
    cta: "Browse cars",
  },
};

// ---------------------------------------------------------------------------
// FOR DRIVERS
// ---------------------------------------------------------------------------
export const FOR_DRIVERS = {
  hero: {
    eyebrow: "For drivers",
    heading: "Renting with Kharo",
    sub: "Rent from checked operators across five cities. One weekly figure covers everything, and you pay nothing until you are approved.",
    img: IMG.happyDriver,
    primaryCta: "Browse cars",
    secondaryCta: "Register your interest",
  },
  trustStrip: [
    ["Free", "to browse and apply"],
    ["Under 24h", "typical response after you apply"],
    ["One price", "rent, insurance and cover"],
    ["5 cities", "and growing"],
  ],
  benefits: {
    eyebrow: "Why drivers choose Kharo",
    heading: "Why drivers choose us",
    items: [
      { icon: "Wallet", t: "One honest weekly figure", d: "Rent, insurance and breakdown cover are added together on every car, so you can compare like for like and budget your week before you commit." },
      { icon: "ShieldCheck", t: "Hire and reward cover, arranged once", d: "A personal motor policy will not cover private hire work. We put your details in front of specialist private hire insurers, then keep them on file so you never retype them." },
      { icon: "BadgeCheck", t: "Companies House and the licensing register", d: "Those are the two places we check every rental company against before a single one of its cars goes live on Kharo." },
      { icon: "Navigation", t: "Every rental is GPS tracked", d: "Vehicle location is tracked for the length of the rental, which protects you as much as the operator if anything is ever queried." },
      { icon: "Wrench", t: "Cover built in", d: "Breakdown cover and servicing are handled on most cars, so a flat battery or a warning light does not cost you a day of earnings." },
      { icon: "MapPin", t: "Cars across five cities", d: "Browse vehicles in London, Birmingham, Manchester, Leeds and Sheffield, with more cities opening as we grow." },
    ],
  },
  earnings: {
    eyebrow: "See what a week could pay",
    heading: "Pick a car and watch the numbers add up.",
    sub: "Our estimator sets typical weekly fares against the all in car cost and fuel, so you can see what a full week could put in your pocket before you sign anything.",
    cta: "Estimate my take home",
    img: IMG.driverNight,
  },
  steps: {
    eyebrow: "What renting with us involves",
    heading: "How renting works",
    linkCta: "Read the step by step guide",
    items: [
      { n: "01", t: "A price you can compare", d: "Filter by city, car type, fuel and weekly budget. Insurance and breakdown are already inside every figure, so one car really is comparable to the next." },
      { n: "02", t: "One insurance form, not ten", d: "Your licence and driving history go in once. We pass them to specialist private hire insurers and reuse them on every car you look at afterwards." },
      { n: "03", t: "A decision inside a day", d: "Your saved profile fills the application. Most operators come back within 24 hours, and you pay nothing until one says yes." },
      { n: "04", t: "Keys, and a record of the condition", d: "You and the operator photograph the car together before you drive off. That record is what settles any question about the deposit later." },
    ],
  },
  requirements: {
    eyebrow: "What you will need",
    heading: "What you need",
    sub: "You can browse and register without any of this to hand. You only need these to complete a rental.",
    img: IMG.keysWoman,
    items: [
      "A valid TfL or council private hire driver licence, or one in progress",
      "A full UK or exchangeable driving licence held for 12 months or more",
      "You are 21 or over, which most operators require for insurance",
      "The right to work and drive for private hire in the UK",
    ],
    notes: [
      { icon: "Clock", t: "Most drivers are approved within a day" },
      { icon: "FileCheck", t: "Your details are reused across every application" },
    ],
  },
  closing: {
    heading: "Ready when you are",
    sub: "Checked cars in five UK cities, with insurance and cover already in the price.",
    primaryCta: "Browse cars",
    secondaryCta: "Create account",
  },
};

// ---------------------------------------------------------------------------
// DRIVER GUIDE
// ---------------------------------------------------------------------------
export const DRIVER_GUIDE = {
  hero: {
    eyebrow: "For drivers",
    heading: "How renting works.",
    sub: "The full process, before you sign anything. No vague promises, no buried terms.",
    img: IMG.taxiDriver,
    cta: "Browse cars",
  },
  steps: [
    {
      n: "01", t: "Check you qualify",
      d: "You need a valid TfL or council private hire driver licence, a DVLA record that meets insurer thresholds, no more than one fault accident in three years, and the right to work in the UK for private hire. Takes a minute to check; we tell you immediately if anything needs attention.",
      img: IMG.phoneInCar,
    },
    {
      n: "02", t: "Connect Open Banking",
      d: "With your consent, we pull twelve months of real transaction data directly from your bank. We look at what actually landed from Uber or Bolt each week, not a number you estimated, and we model your proposed rent against your worst weeks, not your best ones. No shocks later.",
      img: IMG.signingCouple,
    },
    {
      n: "03", t: "Verify your identity",
      d: "Document scan, liveness check and an address verification. We also check for duplicate applications across the driver base at this point. It takes roughly five minutes and protects you as much as us. Your badge can only appear in one active rental at a time.",
      img: IMG.signingLaptop,
    },
    {
      n: "04", t: "Choose your vehicle",
      d: "Browse available cars by type, weekly rate and area. Hybrid saloons from £235 a week, executive vehicles from £330, with wheelchair-accessible and electric options also listed. Every price is all-in: insurance, breakdown and servicing are already inside the figure.",
      img: IMG.driverMirror,
    },
    {
      n: "05", t: "Check the car in together",
      d: "You and the operator complete a joint condition record using the app. Photographs are timestamped and kept on file. This protects you as much as the operator. There is no argument later about whether a mark was already there when you collected the car.",
      img: IMG.keysWoman,
    },
    {
      n: "06", t: "Earn, and hand back cleanly",
      d: "Your weekly payment leaves your account on the agreed day, automatically, through Variable Recurring Payments. When you are ready to return, a final condition check closes the record and your deposit comes back within five working days.",
      img: IMG.vintageDriver,
    },
  ],
  tracking: {
    eyebrow: "Before you drive",
    heading: "The tracker in your car. Everything it does.",
    body: "The car has a Thatcham S5-certified tracking device. Here is what that means for you. Kharo receives mileage, whether the vehicle is in use, and an alert if the car registers an impact or leaves the licensing area. Your operator does not see your live location. That data stays with Kharo and is accessed only under a logged, named-manager procedure: in the event of theft, serious unpaid arrears, or at your own request. We think you should know this before you get in the car, not afterwards.",
    kharo: {
      label: "Kharo sees",
      items: [
        "Live location: only if the vehicle is reported stolen, rental is in serious arrears, or you ask us to locate it",
        "Ignition state and mileage: for service intervals and your mileage cap",
        "Impact alerts: so we call you after a collision, rather than waiting to be told",
      ],
    },
    operator: {
      label: "Your operator sees",
      items: [
        "Mileage and whether the car is in use",
        "Service and MOT reminders",
        "Not your live location, ever",
      ],
    },
  },
  damage: {
    eyebrow: "If something happens",
    heading: "A driver off the road loses around £150 a day. We build the whole damage process around that number.",
    steps: [
      { when: "Immediately", d: "If anyone is injured, call 999 first. Then one button in the app, and guided photographs." },
      { when: "Within 30 minutes", d: "A person (not a form) calls you. We establish whether the car is drivable and agree what happens next on that call." },
      { when: "Same day", d: "If the vehicle cannot be driven, recovery is arranged. A replacement option is discussed on the same call." },
      { when: "We handle the rest", d: "Garage coordination and operator authorisation are handled by us. You never have to phone a repair shop yourself." },
    ],
    liability: [
      ["Fair wear and tear", "Your operator"],
      ["Damage below your excess", "You, from your deposit"],
      ["Damage above the excess", "The insurer; we handle the claim"],
      ["A third party at fault", "Their insurer; we handle the recovery"],
      ["Mechanical failure", "Your operator"],
      ["Parking, congestion, ULEZ charges", "You"],
    ],
    note: "Fair wear and tear is not a matter of opinion. We publish the standard with photographs before you collect the car, so you know what is acceptable and what is chargeable.",
  },
  closing: {
    heading: "Ready when you are.",
    sub: "Nothing to pay until you are approved. Register in about a minute, then browse with your details already in place.",
    primaryCta: "Register your interest",
    secondaryCta: "Browse cars first",
    img: IMG.happyDriver,
  },
};

// ---------------------------------------------------------------------------
// OPERATOR GUIDE
// ---------------------------------------------------------------------------
export const OPERATOR_GUIDE = {
  hero: {
    eyebrow: "For rental companies",
    heading: "Listing with Kharo.",
    sub: "Your fleet matched with drivers we have already vetted, payments that cannot be reversed, and every document tracked in one place.",
    img: IMG.rowCars,
    cta: "Register your interest",
  },
  perks: [
    { t: "10% flat", d: "Taken before your payout. No listing fees, no setup costs, nothing per driver." },
    { t: "Two weeks covered", d: "If a driver stops paying, we cover the rent for up to a fortnight while you arrange a replacement." },
    { t: "Checks done first", d: "Four-layer vetting is complete before an application reaches your queue." },
  ],
  vetting: {
    eyebrow: "Before any application reaches you",
    heading: "Four layers of checks. Every driver.",
    intro: "Most operator problems start with drivers who should never have been handed keys. We run four checks before an application reaches your queue, and the combination is what makes the difference.",
    layers: [
      {
        n: "1",
        t: "Eligibility",
        d: "PHV badge verified against the TfL licensing register. Driving licence pulled directly from the DVLA using the driver's consent code, not a photo of a card, but the live record. Age and licence tenure checked against insurer thresholds. Minimum: 25 years old, at least one year of PHV experience, licence held two years, no more than one fault accident in three years.",
      },
      {
        n: "2",
        t: "Identity",
        d: "Document scan with a real-time liveness check, address verification, and duplicate detection across the whole Kharo driver base. The most common fraud in this trade is a driver operating on someone else's badge. This is where we catch it.",
      },
      {
        n: "3",
        t: "Affordability",
        d: "With the driver's consent, Open Banking gives us twelve months of real transaction history in seconds. We look at what actually landed from Uber or Bolt each week. We model the proposed rent against the driver's worst weeks (the tenth percentile), not their average. A driver who earns well most weeks but has bad weeks they cannot cover is a driver who will default.",
      },
      {
        n: "4",
        t: "Trade record",
        d: "Platform tenure, previous operator references, and payment history from across Kharo's driver network. A driver who has rented well for two years carries a record you can see. A driver with an arrears history elsewhere cannot hide it.",
      },
    ],
    note: "High-risk drivers are offered a higher deposit or twice-weekly billing (shorter exposure cycles), rather than a binary yes or no. You decide whether to accept those terms.",
  },
  steps: [
    {
      n: "01", t: "Register and describe your fleet",
      d: "Tell us how many vehicles you have, what types they are, and where they are based. Our team contacts you within one working day to talk through terms and access to the operator dashboard.",
      img: IMG.handshake,
    },
    {
      n: "02", t: "Get verified",
      d: "We check your Companies House record and your operator licence against the public register before anything goes live. It takes a day and it is the badge of trust your drivers will look for.",
      img: IMG.signingLaptop,
    },
    {
      n: "03", t: "Fit the hardware",
      d: "Every vehicle on the platform carries a Thatcham S5-certified tracker. We recommend Meta Trak S5 with Deadlock where you want an immobiliser, or ScorpionTrack S5 for tracking only. Hardware and fitting typically runs £300 to £450; monitoring is £15 to £20 a month. Note: some installers will not fit an immobiliser to hybrid or electric vehicles. Confirm per vehicle before listing.",
      img: IMG.showroom,
    },
    {
      n: "04", t: "Publish your listings",
      d: "Set the weekly rate, the deposit and which vehicle. We publish the listing and you receive vetted applications through the dashboard. Approve or decline from a single queue.",
      img: IMG.driverMirror,
    },
    {
      n: "05", t: "Hand over with a record",
      d: "You and the driver complete a joint condition check using the app at pickup and at return. Photographs are timestamped and kept on file by both sides. That record settles every deposit question.",
      img: IMG.keysWoman,
    },
    {
      n: "06", t: "Payments arrive on schedule",
      d: "Variable Recurring Payments settle in seconds and cannot be reversed. If a payment fails, you hear from us before the next working day. We tell you exactly where a payment stands at every step.",
      img: IMG.executive,
    },
    {
      n: "07", t: "Fleet paperwork, tracked",
      d: "MOT, tax, insurance and PHV licence dates for every vehicle in one view, with a reminder before anything runs out. Mileage and service alerts from the tracker feed directly into the same dashboard.",
      img: IMG.interior,
    },
  ],
  arrears: {
    eyebrow: "If a driver falls behind",
    heading: "The full ladder, published.",
    intro: "Almost nobody who falls behind is avoiding payment. They have had a bad week. The sequence starts with a conversation, every step is timed, and all of it is published so nothing catches a driver off guard, which means you are more likely to recover the income and keep the driver than you would be with a less transparent process.",
    ladder: [
      { day: "Day 0", action: "Payment fails. Driver notified immediately. Automatic retry in 24 hours. No fee to the driver." },
      { day: "Day 1", action: "A Kharo team member calls the driver. Payment plan offered on that call. You are notified of the failure." },
      { day: "Day 3", action: "Written notice to the driver. Payment plan still available. A late fee applies. You receive a written update." },
      { day: "Day 7", action: "Formal notice to the driver that immobilisation may follow. Final chance for an arrangement. Replacement driver search begins." },
      { day: "Day 10", action: "Vehicle immobilised: it will not restart. Authorised by a named Kharo manager, never automatic. You are notified." },
      { day: "Day 14", action: "Recovery instructed. You and your insurer are notified. Deposit applied against arrears." },
    ],
    immobilisation: "The immobiliser prevents the engine restarting. It never stops a moving vehicle and is never used while a passenger is aboard. It applies at day ten specifically because it is most effective as a credible threat that makes the day-one conversation work. Operators who immobilise quickly recover the car and lose the driver. Operators who resolve arrears keep both.",
  },
  tracking: {
    eyebrow: "What the tracker does",
    heading: "Your visibility. The driver's privacy.",
    intro: "You see what you need to manage the fleet. Drivers' live location is held by Kharo, not shared with you, and accessed only under a logged procedure. This is not a restriction; it is the reason drivers will accept a tracked vehicle and the terms that come with it.",
    operatorSees: [
      "Mileage and whether the vehicle is in use",
      "Service and MOT reminders triggered by mileage",
      "Impact alerts if the tracker registers a collision",
      "Alerts if the vehicle leaves the licensed operating area",
    ],
    kharoHolds: [
      "Live location: accessed only in logged procedures for theft, serious arrears or driver request",
      "Location history: retained for 90 days, then deleted",
    ],
  },
};

// ---------------------------------------------------------------------------
// HELP AND LEGAL
// ---------------------------------------------------------------------------
export const HELP = {
  heading: "Help",
  sub: "Answers to the questions drivers, sellers and operators ask most.",
  searchPlaceholder: "Search help articles…",
  contact: {
    heading: "Still need a hand?",
    sub: "We reply within one working day.",
  },
  faqs: [
    { q: "How much does it cost to use Kharo?", a: "Browsing and applying is free for drivers. You pay the weekly rent, insurance and any add ons shown on the listing. Kharo takes a 10% handling fee from the rental company, never from you." },
    { q: "Why are the rental company names hidden?", a: "Operator names and contact details are shared once your application is approved. Keeping early enquiries inside Kharo protects both sides while the match is being made." },
    { q: "Is the insurance proper hire and reward cover?", a: "Yes. Standard personal motor policies exclude private hire work. Every quote we show is hire and reward cover suited to the way you earn." },
    { q: "When do I pay, and how?", a: "Nothing is charged until you are approved and your digital rental agreement is signed. All payments run through Kharo, so you never send money directly to an operator." },
    { q: "What happens if the car breaks down?", a: "Where the listing includes breakdown cover, roadside assistance runs around the clock. Where it does not, you can add cover for £8 a week at checkout or arrange recovery to the designated garage." },
    { q: "What is the deposit and when do I get it back?", a: "Your deposit is held securely and released after return, once both sets of timestamped handover photos are compared and agreed. This usually takes a few working days, less any deductions you have agreed to." },
    { q: "How quickly will I hear back after applying?", a: "Most drivers get a first response within 24 hours. We notify you in the app and by email as soon as the operator reviews your application." },
    { q: "I am a rental company, how do I list my fleet?", a: "Kharo is onboarding its first operators now. Register your interest and we will contact you before we go live in your area to get you verified and listed." },
  ],
};

export const LEGAL = {
  heading: "Legal and privacy",
  updated: "Last updated 17 June 2026. This is a plain English summary for our pre launch platform and is not a substitute for the full terms published at go live.",
  sections: [
    { t: "About Kharo", b: "Kharo connects private hire drivers with rental companies we have checked. Kharo operates the platform, the matching process and the payment flow, and works with specialist partners for insurance, claims and support. Kharo is not an insurer and does not provide credit." },
    { t: "How your data is used", b: "We collect the details you provide, including your name, contact details, licence and driving information, to verify your eligibility, generate insurance quotes and match you to vehicles. Your data is used to operate the service and, where you have agreed, to keep you informed about launch and relevant offers. We never sell your personal data." },
    { t: "Insurance", b: "Insurance quotes are provided for comparison through our specialist insurance partners. Standard personal motor policies exclude hire and reward, so any policy you take must properly cover private hire use. Kharo facilitates quotes and payment, and the insurance contract is between you and the insurer." },
    { t: "Payments and deposits", b: "All rental payments are processed through Kharo. Deposits are held securely and released after return, subject to the agreed handover condition record. Paying an operator directly outside the platform may void your cover and the protections we offer." },
    { t: "Operator verification", b: "Rental companies are checked against the relevant licensing register and Companies House before listing. Operator identity is disclosed to a driver once their application is approved." },
    { t: "Your rights under UK GDPR", b: "You can request access to, correction of, or deletion of your personal data at any time by contacting privacy@kharo.uk. Where processing is based on consent, you can withdraw it at any time in your account settings." },
    { t: "Cookies", b: "We use essential cookies to keep you signed in and remember your preferences, plus limited analytics to understand how the site is used. You can control non essential cookies in your browser." },
  ],
};


// ---------------------------------------------------------------------------
// CITY LANDING PAGES
//
// Each city has its own intro paragraph and FAQ, which is what search engines
// index. Add a new city by adding a key here and to LIVE_CITIES in lib/cities.js.
// ---------------------------------------------------------------------------
export const CITY_PAGE = {
  eyebrow: "Private hire cars in",
  heroSubTemplate: "{count} checked rental cars in {city} from {operators} operators we have verified ourselves. Rent, insurance and cover are shown together as one weekly figure.",
  seeAllCta: "See all {count} cars",
  accountCta: "Create a driver account",
  listingsHeading: "Cars in {city} right now",
  greenNote: "{green} of them are hybrid or fully electric, which keeps your running costs down.",
  emptyNote: "No cars listed in {city} yet. Register your interest and we will let you know the moment one arrives.",
  faqHeading: "Renting a car in {city}",
  otherCitiesHeading: "Other cities we cover",
  stats: {
    cars: "cars ready to rent",
    operators: "checked operators",
    areas: "areas covered",
    from: "from, per week",
  },
  cities: {
    London: {
      intro: "London is where Kharo started. Whether you drive for Uber, Bolt or a local firm, you will find PCO ready hybrids, electric cars and executive saloons in every borough, almost all of them ULEZ friendly. Rent from operators we have checked, with rent, insurance and cover shown as a single weekly figure.",
      faq: [
        { q: "Do I need a PCO licence to rent a car in London?", a: "Yes. Every private hire vehicle in London needs a TfL licence, and so do you. Have your badge ready and you can get started." },
        { q: "Are the cars ULEZ compliant?", a: "Almost all of them. Our hybrids and electric cars are ULEZ exempt or compliant, so the daily charge does not apply." },
        { q: "How much does a PCO car cost in London?", a: "Prices start from around £225 a week, all-in. Insurance and breakdown cover are already included in that figure, so there's nothing added on top." },
      ],
    },
    Birmingham: {
      intro: "Birmingham is one of the busiest private hire markets outside London. Kharo brings you checked local operators right across the city, from the centre out to Sparkhill, Handsworth and Small Heath, with fuel efficient cars ready to earn.",
      faq: [
        { q: "What licence do I need to drive private hire in Birmingham?", a: "A private hire driver licence from Birmingham City Council, plus a licensed vehicle. Kharo cars are ready for council plating." },
        { q: "Which cars work best here?", a: "Hybrids like the Prius and Corolla are popular for their low running costs, and we list plenty of them in Birmingham." },
        { q: "How soon can I start?", a: "Register your interest and we will match you with a local car and operator as soon as we go live in Birmingham." },
      ],
    },
    Manchester: {
      intro: "Manchester's private hire market is growing quickly. Kharo lists checked operators from the city centre out to Cheetham Hill, Rusholme and Longsight, so you can find a reliable car close to where you drive.",
      faq: [
        { q: "Do I need a Manchester council licence?", a: "Yes. You need a private hire driver and vehicle licence from your local council, and our operators can help you get plated." },
        { q: "Are electric cars a good choice in Manchester?", a: "They can be. Charging points are widespread across the city and running costs are very low. We list electric and hybrid options here." },
        { q: "What will it cost me each week?", a: "Prices start from around £225 a week, with insurance and breakdown cover already included in that figure." },
      ],
    },
    Leeds: {
      intro: "Leeds drivers get the same straightforward deal from Kharo. Checked operators, clear weekly pricing and cars ready for private hire work across the city, from the centre to Harehills, Beeston and Hyde Park.",
      faq: [
        { q: "What do I need to drive private hire in Leeds?", a: "A private hire driver and vehicle licence from Leeds City Council. Kharo cars are ready for council plating." },
        { q: "Which cars are available in Leeds?", a: "Mostly hybrids and electric cars with low running costs, plus a number of MPVs and executive options." },
        { q: "Is there anything to pay to register?", a: "No. Registering your interest is free. You pay once you have been approved and you are renting a car." },
      ],
    },
    Sheffield: {
      intro: "Sheffield is one of our newest cities. Kharo connects you with checked local operators across the city, from the centre to Burngreave, Attercliffe and Firth Park, with efficient cars suited to the hills and the daily miles.",
      faq: [
        { q: "What licence do I need in Sheffield?", a: "A private hire driver and vehicle licence from Sheffield City Council. Our operators can guide you through plating." },
        { q: "Which cars suit Sheffield best?", a: "Hybrids handle the hills well and keep fuel costs down. We list plenty of Priuses and Corollas here." },
        { q: "When can I rent a car in Sheffield?", a: "Register your interest now and we will email you the moment cars are ready to rent in Sheffield." },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// TRUST AND SAFETY
//
// Tracking, damage, arrears and theft. Mirrors the brochures exactly, so the
// site and the PDFs never drift apart. See WEBSITE-COPY.md for the gating
// notes on which blocks may be published when.
// ---------------------------------------------------------------------------
export const TRUST = {
  hero: {
    eyebrow: "Trust and safety",
    heading: "Trust and safety",
    sub: "Tracking, data, damage and what happens if you fall behind. All of it, in plain English, before you need any of it.",
  },
  tracking: {
    heading: "The tracker in your car",
    sub: "We would rather set this out plainly than leave you to wonder. It is fitted for theft recovery and to protect the vehicle. It is not a device for watching you work.",
    kharo: {
      label: "Kharo can see",
      items: [
        "Live location, but only in three circumstances: the vehicle is reported stolen, the rental is in serious arrears, or you have asked us to help find it",
        "Ignition and mileage, for servicing intervals and the mileage cap",
        "Impact detection, so that if you are in a collision we can call you rather than wait to be told",
      ],
    },
    operator: {
      label: "Your operator sees",
      items: [
        { t: "Mileage and whether the car is in use", d: "Enough to manage servicing and know the vehicle is working." },
        { t: "Not your live location", d: "They do not get to watch where you are, where you stop or where you sleep. This is deliberate and it is not negotiable." },
        { t: "Kept for ninety days", d: "Location history is deleted after that." },
        { t: "Never sold, never shared", d: "Not to insurers, not to ride hailing platforms, not to anybody. Should that ever change, we would ask you first." },
      ],
    },
    alerts: {
      heading: "What we will call you about",
      body: "The tracker alerts us before it alerts anybody else. If the vehicle moves without your driver tag present, if it leaves the licensing area unexpectedly, if it registers an impact, or if a service or MOT is falling due, you hear from us. In a trade where drivers are used to being monitored and rarely informed, we would rather the device worked for you as well as for the operator.",
    },
  },
  damage: {
    heading: "If something goes wrong",
    sub: "You are losing money every hour the car is off the road, so this is built around one thing: getting you earning again.",
    steps: [
      { when: "Immediately", d: "If anyone is injured, call 999 first. Always. Then one button in the app, and the guided photographs it asks for." },
      { when: "Within 30 minutes", d: "A person calls you. Not an email, not a form. We work out whether the car is drivable and settle what happens next on that call." },
      { when: "Same day", d: "If the vehicle cannot be driven we arrange recovery and set out your options for getting back on the road." },
      { when: "Thereafter", d: "We deal with the garage and get the operator's authorisation. You chase nobody. Progress reaches you in the app." },
    ],
    liability: [
      ["Fair wear and tear", "The rental company"],
      ["Damage below the insurance excess", "You, from your deposit"],
      ["Damage above the excess", "The insurer. We handle the claim"],
      ["Someone else at fault", "Their insurer. We handle the recovery"],
      ["Mechanical failure", "The rental company"],
      ["Tickets, congestion, ULEZ", "You"],
    ],
    note: "Fair wear and tear is not a matter of opinion. We publish the standard with photographs, so you can see what is acceptable and what is chargeable before you ever collect a car.",
  },
  theft: {
    heading: "If the vehicle is stolen",
    items: [
      "Call us, then the police. You will need a crime reference number",
      "Recovery starts at once. The trackers we fit are monitored around the clock",
      "Every set of keys comes with a signal blocking pouch. Most private hire cars are taken by relay attack, where the key signal is amplified from outside your house. The pouch defeats it. Please use it",
    ],
  },
  arrears: {
    heading: "If you fall behind",
    sub: "Almost nobody who falls behind is avoiding payment. They have had a bad fortnight. So the sequence below starts with a conversation, and all of it is published so nothing comes as a surprise.",
    ladder: [
      ["Day 0", "The payment fails and you are told at once. We try again in 24 hours. No fee"],
      ["Day 1", "A person calls you. If you need to spread the payment, ask on that call. We would far rather arrange something than chase you"],
      ["Day 3", "Written notice. The payment plan is still available. A late fee applies"],
      ["Day 7", "Formal notice that the vehicle may be immobilised, with a final chance to make an arrangement"],
      ["Day 10", "If we still have not heard from you, the vehicle is immobilised so it will not restart. You are told exactly what clears it"],
      ["Day 14", "Recovery is arranged. Your operator and the insurer are notified"],
    ],
    immobilisation: {
      heading: "On immobilisation, so you know where you stand",
      body: "The tracker can prevent the engine restarting. It can never stop a vehicle that is moving, and it is never used while you have a passenger aboard. It applies at day ten, after repeated attempts to reach you, and it is authorised by a named manager rather than triggered automatically. Every use is logged. Talk to us and it does not happen.",
    },
  },
  data: {
    heading: "Your data",
    items: [
      { t: "Your bank data is read only", d: "Used to assess affordability. It cannot move money or make payments, and you can withdraw permission whenever you like." },
      { t: "Your licence comes from DVLA", d: "Checked against the record with your consent code, so it is accurate rather than a photo of a card." },
      { t: "You can ask for a copy", d: "Of everything we hold, ask us to correct it, or ask us to delete it." },
      { t: "We do not sell your data", d: "Not to insurers, not to anyone." },
    ],
  },
  brochures: {
    heading: "The full guides",
    sub: "Everything on this page, and more, set out properly. We email these when you register.",
    driver: "Kharo for drivers",
    operator: "Kharo for operators",
  },
};

// ---------------------------------------------------------------------------
// REGISTERING INTEREST IN A CAR
//
// This replaced the old booking-style application. Pre-launch we are capturing
// intent against a specific vehicle, price and area, not taking a booking.
// Nothing here promises a car is available.
// ---------------------------------------------------------------------------
export const APPLY = {
  timeframes: ["As soon as possible", "Within a month", "Within three months", "Just looking"],
  step1: {
    heading: "About you",
    sub: "So we know who to come back to, and where you drive.",
  },
  step2: {
    heading: "Your licence",
    sub: "Your PCO badge is the thing that lets us match you to a real car quickly at launch, so it is worth adding now.",
    privacy: "We use these to check your badge against the licensing register and your driving licence with the DVLA. We do not share them with the rental company until you have agreed to go ahead.",
  },
  step3: {
    heading: "Check it over",
    sub: "Nothing is charged and nothing is committed. This tells us which car you want and where.",
    cta: "Register my interest",
  },
  sidebarNote: "This car shows the kind of vehicle, price and area our launch operators rent out. It is not bookable yet. Registering tells us exactly what you are after so we can match you to a real car when we open in your city.",
  reassure: {
    heading: "What happens to your details",
    items: [
      "Nothing is charged, now or later, for registering",
      "Your details are never passed to an operator without your say so",
      "We reuse them on every car you look at, so you fill this in once",
      "You can ask us to delete everything at any time",
    ],
  },
  success: {
    heading: "Noted, and thank you",
    body: "We have logged the car, the price and the area you are after. That is exactly the information we need to match you properly when we open in your city.",
    nextHeading: "What happens next",
    next: [
      "We will email you before we go live in your area",
      "When we do, we match you to a real car on those terms and put you in front of the operator",
      "Your licence details are saved, so you will not have to enter any of this again",
      "If anything changes, or you want to be taken off the list, just reply to that email",
    ],
  },
};

export const SELL = {
  hero: {
    eyebrow: "PCO Vehicle Marketplace",
    heading: "Sell your PCO-licensed vehicle",
    sub: "List your TfL-licensed vehicle and connect directly with verified buyers. No agency fees, no middlemen.",
  },
  points: [
    { icon: "Users", t: "Direct to verified buyers", d: "Every buyer on Kharo is identity-checked and TfL-licensed. No tyre-kickers." },
    { icon: "Tag", t: "Set your own price", d: "List at the price you want. We never take a cut of your sale." },
    { icon: "ShieldCheck", t: "Active PCO licence included", d: "Buyers know exactly when the licence expires. No grey-area transfers." },
    { icon: "Layers", t: "One vehicle or a whole fleet", d: "Individual drivers and multi-car operators are both welcome." },
  ],
  form: {
    heading: "List your vehicle",
    sub: "Takes under two minutes. We will match you when the marketplace opens.",
    note: "Your details are only shared with buyers who match your vehicle. We never sell your information.",
    successHeading: "You're on the list",
    successBody: "We'll reach out as soon as we have a match for your vehicle.",
  },
  buyer: {
    successHeading: "Alert set",
    successBody: "We'll contact you the moment a matching vehicle is listed.",
  },
  buyerToggle: {
    question: "Which side are you on?",
    sell: "I want to sell",
    buy: "I want to buy",
    both: "Both",
  },
};

export const MARKETPLACE = {
  hero: {
    eyebrow: "Kharo Marketplace",
    heading: "Buy or sell a PCO-ready private hire vehicle",
    sub: "Browse TfL-eligible cars for sale from verified sellers, with the PCO licence and its expiry shown on every listing. No dealer fees, no middleman.",
    img: "https://images.pexels.com/photos/29566898/pexels-photo-29566898/free-photo-of-aerial-view-of-car-lot-with-parked-vehicles.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1000",
    primaryCta: "Browse vehicles for sale",
    secondaryCta: "Sell your car",
  },
  valueProps: [
    {
      icon: "CalendarCheck",
      t: "PCO licence status on every listing",
      d: "See the exact PCO licence expiry date before you enquire, so there are no surprises after you have paid.",
    },
    {
      icon: "ShieldCheck",
      t: "Checked before it is listed",
      d: "Every vehicle is reviewed for TfL eligibility and mileage history before it appears on the marketplace.",
    },
    {
      icon: "Gauge",
      t: "Real mileage, real condition",
      d: "Sellers disclose mileage, service history and any outstanding finance upfront.",
    },
    {
      icon: "Handshake",
      t: "Deal directly, no middleman fee",
      d: "Kharo connects buyers and sellers. You agree the price and complete the sale between yourselves.",
    },
  ],
  filters: {
    heading: "Refine your search",
    city: "City",
    type: "Body type",
    fuel: "Fuel type",
    seller: "Seller type",
    pco: "PCO licence remaining",
    price: "Budget",
    apply: "Search vehicles",
    sort: {
      default: "Recommended",
      price_asc: "Price: low to high",
      price_desc: "Price: high to low",
      newest: "Newest listed",
    },
  },
  empty: {
    heading: "No vehicles match your search",
    sub: "Try widening your filters, or register your interest below and we will email you the moment a matching car is listed.",
    cta: "Get notified",
  },
  pcoNote: {
    heading: "Every vehicle comes with an active PCO licence",
    body: "TfL requires a valid PCO licence on the vehicle, not just the driver. On Kharo every listing shows the exact expiry date so buyers know exactly what they are getting.",
  },
  sellerCta: {
    eyebrow: "Selling a PCO vehicle?",
    heading: "List your car for free",
    sub: "No listing fee. Add your PCO licence details, photos and price, and reach buyers actively looking for a TfL-eligible car.",
    cta: "List your car",
  },
  buyerCta: {
    heading: "Can't find the right car?",
    sub: "Tell us what you are looking for and we will email you as soon as a matching vehicle is listed.",
  },
};
