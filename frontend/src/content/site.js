// ---------------------------------------------------------------------------
// KHARO SITE COPY
//
// Every word of marketing text on the public pages lives in this one file and
// the pages read from it. Edit the text here and it updates wherever it
// appears.
//
// House style:
//   British English. Plain words. Short sentences. Address the reader as "you".
//   Lead with what the reader gets. Never state a figure we cannot stand
//   behind. Sentence case everywhere, including buttons.
//
// FACTS holds the statements that must be identical on every page. When a
// fact changes, change it here and nowhere else.
// ---------------------------------------------------------------------------

import { IMG } from "@/lib/images";

export const FACTS = {
  cities: ["London", "Birmingham", "Manchester", "Leeds", "Sheffield"],
  citiesSentence: "London, Birmingham, Manchester, Leeds and Sheffield",
  price: "The weekly price is the rental only, set by the operator and shown before you apply.",
  insurance:
    "When you apply, you choose hire and reward insurance from quotes we gather for you: comprehensive, third party fire and theft, or third party, paid monthly, every six months or yearly. Where an operator includes their own fleet cover, the listing says so.",
  payments: "Your weekly payment is collected through Kharo on the same day each week, and every payment, invoice and document sits in your account.",
  platforms: "Before you collect the car we add it to your Uber and Bolt accounts, and any other platform you drive for, so you can start earning the day you pick up the keys.",
  vetting: "Three checks before an operator sees your application: your DVLA record, your identity with a liveness check, and a read-only Open Banking affordability check.",
  fee: "Listing is free. Kharo earns a fee from the operator when a rental completes. Drivers never pay Kharo.",
  support: "If something goes wrong, a person calls you. After an accident we get you into a replacement car while we handle the claim.",
  prelaunch: "Kharo is pre-launch. The cars shown are the kind our launch operators rent out and are not bookable yet.",
};

// ---------------------------------------------------------------------------
// GLOBAL, used by the header, footer and page titles
// ---------------------------------------------------------------------------
export const BRAND = {
  name: "Kharo",
  tagline: "Rent the car. We handle everything around it.",
  footerBlurb:
    "Licensed private hire cars from operators we have checked, with insurance chosen when you apply and your platforms live before you collect the keys.",
  supportEmail: "hello@kharo.co.uk",
  privacyEmail: "privacy@kharo.co.uk",
  // Digits only, UK country code, no leading 0 or +: used to build wa.me links.
  whatsapp: "447392829759",
  copyright: `© 2026 Kharo. Launching in ${FACTS.citiesSentence}.`,
  // Social profiles. Correct these to the real handles if they differ; the
  // footer hides any icon whose value is empty.
  social: {
    instagram: "https://www.instagram.com/kharo.uk",
    facebook: "https://www.facebook.com/kharo.uk",
    linkedin: "https://www.linkedin.com/company/kharo",
  },
};

export const NAV = {
  primary: [
    { to: "/search", label: "Browse cars" },
    { to: "/for-drivers", label: "For drivers" },
    { to: "/operator-guide", label: "For operators" },
    { to: "/why-kharo", label: "Why Kharo" },
  ],
  headerCta: { to: "/register", label: "Join the waitlist" },
  accountMenu: [
    { to: "/register", title: "Drivers", sub: "Join the waitlist for launch in your city" },
    { to: "/list-your-fleet", title: "Rental operators", sub: "Register your fleet for launch" },
  ],
  mobileCtas: [
    { to: "/register", label: "Join the waitlist" },
    { to: "/list-your-fleet", label: "List your fleet" },
  ],
  newsletter: {
    heading: "Launch updates",
    placeholder: "you@email.com",
    success: "You are on the list. We will write before we go live in your area.",
  },
  footerColumns: [
    {
      heading: "Drivers",
      links: [
        ["Browse cars", "/search"],
        ["For drivers", "/for-drivers"],
        ["How renting works", "/driver-guide"],
        ["Join the waitlist", "/register"],
      ],
    },
    {
      heading: "Operators",
      links: [
        ["For operators", "/operator-guide"],
        ["List your fleet", "/list-your-fleet"],
      ],
    },
    {
      heading: "Company",
      links: [
        ["Why Kharo", "/why-kharo"],
        ["Help", "/help"],
        ["Legal and privacy", "/legal"],
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// PRE-LAUNCH LABELLING
// ---------------------------------------------------------------------------
export const PREVIEW = {
  label: "Launch preview.",
  short: "These cars show what our launch operators rent out. Register interest and we match you to a real one when we open in your city.",
  banner: "These cars show the kind of vehicle, price and area our launch operators rent out. They are not bookable yet. Tell us which one suits you and we will match you to a real car when we go live in your city.",
  inline: "This car is not bookable yet. Registering tells us the vehicle, price and area you want, and we will come back to you with a real match at launch.",
};

// ---------------------------------------------------------------------------
// HOME
// ---------------------------------------------------------------------------
export const HOME = {
  seo: {
    title: "Kharo · Private hire car rental with everything around the car handled",
    description: "Rent a licensed private hire car from a checked operator. Choose insurance when you apply, and have Uber and Bolt live before you collect the keys.",
  },
  hero: {
    heading: "Rent the car. We handle everything around it.",
    sub: "Checked operators, insurance chosen when you apply, and Uber and Bolt live before you pick up the keys.",
    img: IMG.londonBus,
    imgAlt: "Traffic on a London street at dusk",
    searchCta: "Search cars",
    moreFilters: "More filters",
    fewerFilters: "Fewer filters",
    cityPlaceholder: "Pick a city",
  },
  figures: [
    { v: "First", l: "marketplace of its kind in the UK" },
    { v: "5", l: "cities at launch" },
    { v: "1", l: "place for rent, insurance, documents and claims" },
    { v: "0", l: "fees for drivers, ever" },
  ],
  work: {
    heading: "The work around the car, done for you.",
    sub: "Most rental firms hand you the keys and stop there. Kharo carries on.",
    items: [
      { t: "Insurance chosen when you apply", d: "Quotes from specialist private hire insurers, side by side, with the cover level and payment term you want. Your choice goes to the operator with your application." },
      { t: "Uber and Bolt live before collection", d: FACTS.platforms },
      { t: "Everything in one account", d: "Payments, invoices, your hire agreement, insurance and vehicle documents, live, with an app to follow soon after launch." },
      { t: "A person when it matters", d: FACTS.support },
    ],
  },
  fleet: {
    heading: "Cars drivers actually rent",
    cta: "Browse all cars",
  },
  featured: {
    heading: "A few to start with",
    cta: "See all cars",
  },
  dashboard: {
    heading: "Your rental, in one place.",
    sub: "Payments, platforms, documents, alerts and claims. Click through the account drivers get at launch.",
    cta: "See what drivers get",
  },
  paths: {
    heading: "Two sides, one platform.",
    driver: {
      kicker: "Drivers",
      heading: "Find a car you can afford and start earning the day you collect it.",
      cta: "For drivers",
      to: "/for-drivers",
      img: IMG.happyDriver,
    },
    operator: {
      kicker: "Operators",
      heading: "Fill idle cars with vetted drivers and let us run the paperwork.",
      cta: "For operators",
      to: "/operator-guide",
      img: IMG.rowCars,
    },
  },
  faq: {
    heading: "Questions drivers ask first",
    items: [
      { q: "What is a private hire vehicle?", a: "A car licensed to carry passengers who book in advance, through Uber, Bolt or a local firm. In London the licence comes from TfL; elsewhere it comes from your council. It is different from a black cab." },
      { q: "Do I need a licence to rent a car on Kharo?", a: "Yes. You need a private hire driver licence for the city you drive in, a full driving licence held for at least a year, and the right to work in the UK. You can browse and register without any of this to hand." },
      { q: "Is insurance included in the weekly price?", a: `${FACTS.price} ${FACTS.insurance}` },
      { q: "How do payments work?", a: FACTS.payments },
      { q: "Will I be set up on Uber and Bolt?", a: FACTS.platforms },
      { q: "What happens if the car breaks down or I have an accident?", a: FACTS.support },
      { q: "What does it cost to list a car?", a: FACTS.fee },
      { q: "Can I rent a car today?", a: `${FACTS.prelaunch} Register your interest in a car and we will match you to a real one when we go live in your city.` },
    ],
  },
  closer: {
    heading: "Cars sitting idle cost you every week.",
    sub: "List your fleet, receive vetted applications with the insurance choice attached, and let us handle documents, expiries and claims.",
    cta: "List your fleet",
    secondary: "See how it works",
    img: IMG.fleetLot,
  },
};

// ---------------------------------------------------------------------------
// FOR DRIVERS
// ---------------------------------------------------------------------------
export const FOR_DRIVERS = {
  seo: {
    title: "For drivers · Rent a private hire car with Kharo",
    description: "Rent a licensed private hire car from a checked operator. Choose your insurance when you apply and have Uber and Bolt live before you collect.",
  },
  hero: {
    tag: "For drivers",
    heading: "By the time you collect the keys, you are ready to earn.",
    sub: "Insurance chosen, Uber and Bolt live, every document in your account. You drive.",
    img: IMG.taxiDriver,
    imgAlt: "A private hire driver beside his car",
    primaryCta: "Browse cars",
    secondaryCta: "Join the waitlist",
  },
  flow: {
    heading: "Applying takes one sitting.",
    sub: "Pick the car, pick the cover, send it. The operator gets your checks and your insurance choice together, so they can decide straight away.",
  },
  steps: {
    heading: "From application to the road",
    items: [
      { t: "Apply for the car", d: "Pick a car and register your interest. Your licence details are saved once and reused on every application." },
      { t: "Choose your insurance", d: "We gather quotes from private hire insurers. Pick the cover level and the payment term, monthly, six-monthly or yearly." },
      { t: "The operator decides", d: `${FACTS.vetting} The operator sees the checks and your insurance choice together, and says yes or no.` },
      { t: "We set up your platforms", d: "We add the car to Uber, Bolt and any other platform you drive for, so you are live before collection." },
      { t: "Collect and earn", d: "Take the handover photos together, sign the agreement in the app, and start the same day." },
    ],
  },
  dashboard: {
    heading: "One account for the whole rental.",
    sub: "Every payment, invoice, document and alert, live. Click the tabs to see what it holds. The same account arrives as an app soon after launch.",
  },
  support: {
    heading: "If something goes wrong, you are not on your own.",
    body: "A warning light, a bump or a payment question gets you a person on the phone, not a form. After an accident we arrange recovery, get you into a replacement car and handle the claim and the garage, so you lose as little earning time as possible.",
    points: [
      "Report a fault or an accident from your phone",
      "A person calls you back and agrees what happens next",
      "Replacement car arranged while yours is repaired",
      "We deal with the insurer, the garage and the operator",
    ],
    img: IMG.keysWoman,
    imgAlt: "Keys being handed to a driver",
  },
  requirements: {
    heading: "What you need",
    sub: "You can browse and register without any of this to hand. You only need it to complete a rental.",
    items: [
      "A private hire driver licence for your city, or one in progress",
      "A full UK or exchangeable driving licence held for at least a year",
      "The right to work in the UK",
      "A bank account for the read-only affordability check",
    ],
    note: "Operators may set their own extra conditions, such as minimum age or experience, and the listing shows them.",
  },
  closer: {
    heading: "Ready when you are.",
    sub: `${FACTS.prelaunch} Browse the cars, or join the waitlist and we will write before we open in your city.`,
    primaryCta: "Browse cars",
    secondaryCta: "Join the waitlist",
  },
};

// ---------------------------------------------------------------------------
// DRIVER GUIDE (long-form: how renting works, step by step)
// ---------------------------------------------------------------------------
export const DRIVER_GUIDE = {
  seo: {
    title: "How renting works · Kharo driver guide",
    description: "The full process for renting a private hire car through Kharo, from application and insurance to collection, payments and what happens if something goes wrong.",
  },
  hero: {
    tag: "For drivers",
    heading: "How renting works.",
    sub: "Every step, in order, before you sign anything.",
    img: IMG.phoneInCar,
    cta: "Browse cars",
  },
  steps: [
    { t: "Find a car", d: "Filter by city, area, make, fuel and weekly budget. The price shown is the rental only, set by the operator.", img: IMG.phoneInCar },
    { t: "Register your interest", d: "A short form: your name, contact details, licence and when you want to start. Your details are saved and reused.", img: IMG.signingLaptop },
    { t: "Choose your insurance", d: FACTS.insurance, img: IMG.signingCouple },
    { t: "Three checks", d: FACTS.vetting, img: IMG.driverSuit },
    { t: "The operator decides", d: "The operator sees your checks and your insurance choice together and accepts or declines the application in their console.", img: IMG.handshake },
    { t: "Platforms set up", d: FACTS.platforms, img: IMG.driverNight },
    { t: "Collect the car", d: "You and the operator photograph the car together in the app. Those timestamped photos settle any deposit question later.", img: IMG.keysWoman },
    { t: "Pay weekly, all in your account", d: FACTS.payments, img: IMG.happyDriver },
  ],
  money: {
    heading: "What you pay, and to whom",
    rows: [
      ["Weekly rent", "Set by the operator, shown on the listing, collected through Kharo"],
      ["Insurance", "Your chosen policy, paid monthly, six-monthly or yearly to the insurer"],
      ["Deposit", "Set by the operator, shown on the listing, returned after the handback check"],
      ["Kharo", "Nothing. Kharo earns from the operator when a rental completes"],
    ],
  },
  damage: {
    heading: "If something happens",
    steps: [
      { when: "Straight away", d: "If anyone is hurt, call 999 first. Then report it in the app with the guided photos." },
      { when: "Then", d: "A person calls you. We agree whether the car is drivable and what happens next." },
      { when: "Same day", d: "If the car cannot be driven we arrange recovery and a replacement car." },
      { when: "After that", d: "We handle the garage, the insurer and the operator. You do not chase anyone." },
    ],
    liability: [
      ["Fair wear and tear", "The operator"],
      ["Damage below your excess", "You, from your deposit"],
      ["Damage above the excess", "Your insurer, with Kharo handling the claim"],
      ["Someone else at fault", "Their insurer, with Kharo handling the recovery"],
      ["Mechanical failure", "The operator"],
      ["Parking, congestion and ULEZ charges", "You"],
    ],
  },
  faq: [
    { q: "How much is the deposit?", a: "Each operator sets their own and it is shown on the listing before you apply. It is held for the rental and returned after the handback photos are compared." },
    { q: "Can I choose any insurer?", a: "You choose from the quotes we gather from specialist private hire insurers. Comprehensive, third party fire and theft, and third party are shown side by side with monthly, six-monthly and yearly prices." },
    { q: "Who sets up Uber and Bolt?", a: "We do, before you collect the car. Tell us any other platform you drive for and we add that too." },
    { q: "What if I miss a payment?", a: "You are told at once and we try again the next day. If you need to spread a payment, a person calls you to arrange it before anything else happens." },
    { q: "Does my operator track the car?", a: "Vehicles carry a tracker for theft recovery and servicing. What the operator can see is set out in your hire agreement before you sign." },
  ],
  closer: {
    heading: "Browse the cars, or join the waitlist.",
    primaryCta: "Browse cars",
    secondaryCta: "Join the waitlist",
  },
};

// ---------------------------------------------------------------------------
// FOR OPERATORS (operator guide)
// ---------------------------------------------------------------------------
export const OPERATOR_GUIDE = {
  seo: {
    title: "For operators · List your private hire fleet with Kharo",
    description: "Fill idle private hire cars with vetted drivers and let Kharo manage approvals, documents, expiries, maintenance and claims from one console.",
  },
  hero: {
    tag: "For operators",
    heading: "We manage the fleet. You collect the rent.",
    sub: "Vetted applications with the insurance choice attached, and a console that watches every document, expiry and claim for you.",
    img: IMG.showroom,
    imgAlt: "Cars lined up in a dealership",
    primaryCta: "List your fleet",
    secondaryCta: "See the console",
  },
  manage: {
    heading: "Everything around the car, managed.",
    items: [
      { t: "Approvals", d: "Applications arrive with the DVLA, identity and affordability checks done and the driver's insurance choice attached. Approve or decline from one queue." },
      { t: "Documents", d: "V5C, MOT, PHV plate, insurance and hire agreements for every vehicle, stored and shown to you in one place." },
      { t: "Expiries", d: "We tell you before a service, MOT, PHV licence or insurance runs out, and book what you ask us to." },
      { t: "Issues", d: "Anything a driver reports about the car reaches you in the console, with photos, the same day." },
      { t: "Accidents and claims", d: "A dedicated insurance team handles the claim, the repair and the driver's replacement car." },
      { t: "Rent", d: FACTS.payments.replace("Your weekly payment is", "Weekly rent is").replace("your account", "your console") },
    ],
  },
  dashboard: {
    heading: "The operator console.",
    sub: "Fleet, approvals, history, documents, expiries, claims and payouts. Click through the console operators get at launch.",
  },
  steps: {
    heading: "How listing works",
    items: [
      { t: "Tell us about your fleet", d: "How many vehicles, what kind, and where they are based. We call you within one working day." },
      { t: "Get checked", d: "We verify your operator licence against the register and your Companies House record before anything goes live." },
      { t: "List your vehicles", d: "Set the weekly rate and deposit for each car. If you carry your own fleet insurance, add it once and the listing says so." },
      { t: "Approve drivers", d: "Vetted applications arrive with the insurance choice attached. You decide." },
      { t: "Hand over with a record", d: "You and the driver photograph the car together at collection and return. That record settles deposit questions." },
      { t: "Get paid", d: "Rent is collected from the driver through Kharo and paid to you on schedule." },
    ],
  },
  claims: {
    heading: "When a car is damaged, you have a team.",
    body: "Report it once. Our insurance team notifies the insurer, books the repair, arranges a replacement for the driver so the rental keeps earning, and keeps you informed until the claim is closed.",
    img: IMG.showroom,
    imgAlt: "A vehicle in a workshop bay",
  },
  fee: {
    heading: "What it costs",
    body: FACTS.fee,
  },
  faq: [
    { q: "Who insures the driver?", a: "By default the driver chooses their own hire and reward policy when they apply, and you see that choice with their application. If you carry fleet cover, add it to the listing and the price shows it as included." },
    { q: "What checks are done before I see an application?", a: FACTS.vetting },
    { q: "How does rent reach me?", a: "Rent is collected from the driver through Kharo each week and paid to you on schedule. Your console shows every collection and payout." },
    { q: "What if a driver stops paying?", a: "You are told the same day and a person from Kharo calls the driver to arrange payment. The steps that follow are set out in the operator agreement before you list." },
    { q: "What does Kharo charge?", a: FACTS.fee },
    { q: "Can I list now?", a: "Yes. We are onboarding launch operators now, and your vehicles go live with the platform." },
  ],
  closer: {
    heading: "See what idle cars cost you.",
    sub: "Two sliders, one number, and a call back within one working day if you want one.",
    cta: "List your fleet",
  },
};

// ---------------------------------------------------------------------------
// LIST YOUR FLEET (operator interest form page)
// ---------------------------------------------------------------------------
export const OPERATOR_INTEREST = {
  seo: {
    title: "List your fleet · Kharo",
    description: "Fill idle private hire cars with vetted drivers. Tell us about your fleet and we call you within one working day.",
  },
  tag: "For operators",
  heading: "Stop paying for cars that are not earning.",
  sub: "Tell us about your fleet. We call you within one working day.",
  loss: {
    label: "Idle cars cost you",
    idle: "Cars sitting idle",
    rate: "Weekly rate per car",
    perWeek: "Per week",
    perMonth: "Per month",
    perYear: "Per year",
    note: "An illustrative estimate based on your inputs, not a quote.",
  },
  trust: ["Vetted drivers only", "Free to list", "A call within one working day"],
  success: {
    heading: "We will be in touch.",
    body: "A Kharo fleet specialist will call you within one working day to talk through your fleet and the console.",
  },
};

// ---------------------------------------------------------------------------
// WHY KHARO
// ---------------------------------------------------------------------------
export const WHY = {
  seo: {
    title: "Why Kharo · Private hire rental done properly",
    description: "Kharo handles insurance, platforms, payments, documents and claims around every private hire rental, for drivers and for operators.",
  },
  hero: {
    heading: "Private hire rental, done properly.",
    sub: "The car is the easy part. Kharo does the rest.",
    img: IMG.londonBus,
  },
  gap: {
    number: "12,712",
    label: "more private hire driver licences than licensed vehicles in London",
    source: "TfL licensing statistics, May 2026",
    body: "Thousands of licensed drivers cannot find a car, while operators have cars standing idle. Kharo puts the two together and takes the paperwork off both.",
  },
  drivers: {
    heading: "For drivers",
    points: [
      { t: "One price, shown first", d: FACTS.price },
      { t: "Insurance you choose", d: "Quotes side by side, with the cover level and payment term you want." },
      { t: "Live on your platforms before collection", d: FACTS.platforms },
      { t: "Someone to call", d: FACTS.support },
    ],
    img: IMG.happyDriver,
    cta: "For drivers",
  },
  operators: {
    heading: "For operators",
    points: [
      { t: "Three checks before you see an application", d: FACTS.vetting },
      { t: "Insurance attached to the application", d: "You see the driver's chosen cover before you decide." },
      { t: "Documents and expiries watched", d: "MOT, PHV plate, insurance and service dates for every vehicle, with a reminder before anything runs out." },
      { t: "A claims team", d: "Accidents, repairs and replacement cars handled by Kharo's insurance team." },
    ],
    img: IMG.fleetLot,
    cta: "For operators",
  },
  honesty: {
    heading: "What we will not do",
    items: [
      "Show you a car that is not real. Preview inventory is labelled as such.",
      "Hide a fee inside a price. The rental is the rental; insurance is your choice.",
      "Publish a review we did not receive. Ratings appear only once real drivers leave them.",
      "Sell your data. Not to insurers, not to platforms, not to anyone.",
    ],
  },
  closer: {
    heading: "Two sides, one platform.",
    driverCta: "For drivers",
    operatorCta: "For operators",
  },
};

// ---------------------------------------------------------------------------
// HELP AND LEGAL
// ---------------------------------------------------------------------------
export const HELP = {
  heading: "Help",
  sub: "Answers to the questions drivers and operators ask most.",
  searchPlaceholder: "Search help",
  contact: {
    heading: "Still need a hand?",
    sub: "Email us or message us on WhatsApp. We reply within one working day.",
  },
  faqs: [
    { q: "How much does it cost to use Kharo?", a: `Browsing and applying is free for drivers. You pay the weekly rental shown on the listing and the insurance you choose. ${FACTS.fee}` },
    { q: "Is insurance included in the price?", a: `${FACTS.price} ${FACTS.insurance}` },
    { q: "Is the insurance proper hire and reward cover?", a: "Yes. Standard personal motor policies exclude private hire work. Every quote we show is hire and reward cover suited to the way you earn." },
    { q: "When do I pay, and how?", a: `Nothing is charged until you are approved and your hire agreement is signed. ${FACTS.payments}` },
    { q: "Will Kharo set me up on Uber and Bolt?", a: FACTS.platforms },
    { q: "What happens if the car breaks down or I have an accident?", a: FACTS.support },
    { q: "What is the deposit and when do I get it back?", a: "Each operator sets their own deposit and it is shown on the listing. It is held for the rental and returned after the handback photos are compared, less any deductions you have agreed to." },
    { q: "Why are operator names hidden on listings?", a: "Operator names and contact details are shared once your application is approved. Keeping early enquiries inside Kharo protects both sides while the match is being made." },
    { q: "I run a fleet. How do I list?", a: "Register your interest on the List your fleet page and we call you within one working day to get you checked and listed." },
    { q: "Can I rent a car today?", a: `${FACTS.prelaunch} Register your interest and we will match you to a real car when we go live in your city.` },
  ],
};

export const LEGAL = {
  heading: "Legal and privacy",
  updated: "Last updated 18 September 2026. This is a plain English summary for our pre-launch platform, governed by UK GDPR and the Data Protection Act 2018, and is not a substitute for the full terms published at go live.",
  sections: [
    { t: "About Kharo", b: "Kharo connects private hire drivers with rental operators we have checked. Kharo operates the platform, the matching process and the payment flow, and works with specialist partners for insurance, claims and support. Kharo is not an insurer and does not provide credit." },
    { t: "How your data is used", b: "We collect the details you provide, including your name, contact details, licence and driving information, to verify your eligibility, gather insurance quotes and match you to vehicles. Your data is used to operate the service and, where you have agreed, to keep you informed about launch and relevant offers. We never sell your personal data." },
    { t: "Identity and affordability checks", b: "Where we run a liveness identity check, that involves biometric data used to confirm you are who you say you are. We only run this check with your explicit consent, given at the point you apply, and you can withdraw that consent by not proceeding with the check. Where we review Open Banking transaction data for affordability, that review is read only, cannot move money, and a human always makes the final decision on your application." },
    { t: "Insurance", b: "The weekly price shown on a listing is the rental only. When you apply, we gather hire and reward insurance quotes from specialist partners and you choose the cover level and payment term. The insurance contract is between you and the insurer; Kharo arranges the quotes and passes your choice to the operator with your application. Where an operator includes their own fleet cover, the listing says so; that cover is declared by the operator and the operator is responsible for keeping it valid." },
    { t: "Payments and deposits", b: "Weekly rent is collected through Kharo and paid to the operator. Deposits are set by the operator, shown on the listing, and returned after the agreed handover condition record is compared. Paying an operator directly outside the platform removes the protections we offer." },
    { t: "Platform set-up", b: "With your consent, we add the rented vehicle to your Uber, Bolt and other ride-hailing accounts before collection. We use only the vehicle and licence details needed to do so and do not access your earnings or trip history." },
    { t: "Operator verification", b: "Rental operators are checked against the relevant licensing register and Companies House before listing. Operator identity is disclosed to a driver once their application is approved." },
    { t: "Who we share data with", b: "We share the minimum data needed with: our email provider, to send you account and welcome messages; our Open Banking partner, to run affordability checks with your consent; our identity verification partner, to run liveness checks with your consent; our insurance partners, to gather quotes you have asked for; ride-hailing platforms, to add your vehicle with your consent; and our hosting providers, to run the platform. Some of these providers process data outside the UK, in which case we rely on standard contractual safeguards recognised under UK GDPR. We never sell your data." },
    { t: "How long we keep your data", b: "Application and licence data is kept for as long as your account is active plus six years, to meet our legal and insurance record-keeping obligations. Location history from vehicle tracking is deleted after ninety days. If you ask us to delete your account before then, we remove what we are not legally required to retain and tell you what, if anything, we must keep and why." },
    { t: "Your rights under UK GDPR", b: "You can request access to, correction of, or deletion of your personal data at any time by contacting privacy@kharo.co.uk. We aim to respond within one month. Where processing is based on consent, you can withdraw it at any time. You can also complain to the Information Commissioner's Office (ico.org.uk)." },
    { t: "Cookies", b: "We use essential cookies to keep you signed in and remember your preferences; these do not require consent. Where we use analytics cookies, we ask for your consent first through the banner shown on your first visit, with an equal choice to accept or reject, and you can change your choice at any time from the link in the footer." },
    { t: "Terms of service, in brief", b: "Using Kharo to browse or register interest is free and creates no obligation on either side. A rental agreement is a contract between you and the rental operator; Kharo is the platform that introduces you and collects payment, not a party to that agreement. You agree to give accurate information, keep your account details to yourself, and not use the platform for anything unlawful. We can suspend an account that breaches these terms or that we reasonably believe is fraudulent. The full terms of service will be published at go live and will govern in the event of any conflict." },
    { t: "Liability", b: "Kharo is not liable for the acts or omissions of rental operators, insurers, or other third parties on the platform, including where an operator's declared fleet insurance turns out to be invalid or lapsed. We are liable for our own negligence and for the accuracy of the checks we say we carry out. Nothing in these terms limits liability for death, personal injury, or fraud." },
  ],
};

// ---------------------------------------------------------------------------
// CITY LANDING PAGES
// ---------------------------------------------------------------------------
export const CITY_PAGE = {
  tagTemplate: "Kharo in {city}",
  heroSubTemplate: "{count} cars in {city} from operators we have checked, with the rental price shown first and insurance chosen when you apply.",
  seeAllCta: "See all {count} cars",
  accountCta: "Join the waitlist",
  listingsHeading: "Cars in {city}",
  greenNote: "{green} of them are hybrid or fully electric, which keeps your running costs down.",
  emptyNote: "No cars listed in {city} yet. Join the waitlist and we will let you know the moment one arrives.",
  faqHeading: "Renting a car in {city}",
  otherCitiesHeading: "Other cities",
  comingSoon: {
    heading: "We are not live in {city} yet.",
    sub: "Kharo is built for the whole UK and we are bringing checked operators to every city. Join the waitlist and we will email you the moment {city} has cars.",
    liveHeading: "Already live",
  },
  stats: {
    cars: "cars in the preview",
    areas: "areas covered",
    from: "from, per week",
    green: "hybrid or electric",
  },
  cities: {
    London: {
      intro: "London is where Kharo started. Whether you drive for Uber, Bolt or a local firm, you will find PCO-ready hybrids, electric cars and executive saloons across the boroughs, almost all of them ULEZ friendly. Rent from operators we have checked, with the rental price shown first and insurance chosen when you apply.",
      faq: [
        { q: "Do I need a PCO licence to rent a car in London?", a: "Yes. Every private hire vehicle in London needs a TfL licence, and so do you. Have your badge ready and you can get started." },
        { q: "Are the cars ULEZ compliant?", a: "Almost all of them. Our hybrids and electric cars are ULEZ exempt or compliant, so the daily charge does not apply." },
        { q: "Is insurance included?", a: `${FACTS.price} ${FACTS.insurance}` },
      ],
    },
    Birmingham: {
      intro: "Birmingham is one of the busiest private hire markets outside London. Kharo brings you checked local operators right across the city, from the centre out to Sparkhill, Handsworth and Small Heath, with fuel-efficient cars ready to earn.",
      faq: [
        { q: "What licence do I need to drive private hire in Birmingham?", a: "A private hire driver licence from Birmingham City Council, plus a licensed vehicle. Kharo cars are ready for council plating." },
        { q: "Which cars work best here?", a: "Hybrids like the Prius and Corolla are popular for their low running costs, and we list plenty of them in Birmingham." },
        { q: "How soon can I start?", a: "Join the waitlist and we will match you with a local car and operator as soon as we go live in Birmingham." },
      ],
    },
    Manchester: {
      intro: "Manchester's private hire market is growing quickly. Kharo lists checked operators from the city centre out to Cheetham Hill, Rusholme and Longsight, so you can find a reliable car close to where you drive.",
      faq: [
        { q: "Do I need a Manchester council licence?", a: "Yes. You need a private hire driver and vehicle licence from your local council, and our operators can help you get plated." },
        { q: "Are electric cars a good choice in Manchester?", a: "They can be. Charging points are widespread across the city and running costs are very low. We list electric and hybrid options here." },
        { q: "Is insurance included?", a: `${FACTS.price} ${FACTS.insurance}` },
      ],
    },
    Leeds: {
      intro: "Leeds drivers get the same straightforward deal from Kharo. Checked operators, clear weekly pricing and cars ready for private hire work across the city, from the centre to Harehills, Beeston and Hyde Park.",
      faq: [
        { q: "What do I need to drive private hire in Leeds?", a: "A private hire driver and vehicle licence from Leeds City Council. Kharo cars are ready for council plating." },
        { q: "Which cars are available in Leeds?", a: "Mostly hybrids and electric cars with low running costs, plus a number of MPVs and executive options." },
        { q: "Is there anything to pay to register?", a: "No. Joining the waitlist is free. You pay once you have been approved and you are renting a car." },
      ],
    },
    Sheffield: {
      intro: "Sheffield is one of our newest cities. Kharo connects you with checked local operators across the city, from the centre to Burngreave, Attercliffe and Firth Park, with efficient cars suited to the hills and the daily miles.",
      faq: [
        { q: "What licence do I need in Sheffield?", a: "A private hire driver and vehicle licence from Sheffield City Council. Our operators can guide you through plating." },
        { q: "Which cars suit Sheffield best?", a: "Hybrids handle the hills well and keep fuel costs down. Expect plenty of Priuses and Corollas once we are live here." },
        { q: "When can I rent a car in Sheffield?", a: "Join the waitlist now and we will email you the moment cars are ready to rent in Sheffield." },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// REGISTERING INTEREST IN A CAR
// ---------------------------------------------------------------------------
export const APPLY = {
  timeframes: ["As soon as possible", "Within a month", "Within three months", "Just looking"],
  step1: { heading: "About you", sub: "So we know who to come back to, and where you drive." },
  step2: {
    heading: "Your licence",
    sub: "Your private hire badge is what lets us match you to a real car quickly at launch, so it is worth adding now.",
    privacy: "We use these to check your badge against the licensing register and your driving licence with the DVLA. We do not share them with the operator until you have agreed to go ahead.",
  },
  step3: { heading: "Check it over", sub: "Nothing is charged and nothing is committed. This tells us which car you want and where.", cta: "Register my interest" },
  sidebarNote: PREVIEW.inline,
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
      "We email you before we go live in your area",
      "When we do, we match you to a real car on those terms and gather your insurance quotes",
      "Your licence details are saved, so you will not have to enter any of this again",
      "If anything changes, or you want to be taken off the list, just reply to that email",
    ],
  },
};
