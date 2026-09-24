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
  cities: ["London", "Birmingham", "Manchester", "Leeds", "Sheffield", "Wolverhampton", "Liverpool"],
  citiesSentence: "London, Birmingham, Manchester, Leeds, Sheffield, Wolverhampton and Liverpool",
  price: "The weekly price is the rent for the car. The operator sets it.",
  insurance:
    "We get comprehensive cover quotes from leading insurers and pass the best prices on to you. You pick how long for when you apply.",
  payments: "You pay rent monthly through Kharo. Each payment is taken two weeks before the next month is due.",
  platforms: "Once your collection is confirmed, we upload your documents to Uber and Bolt for you. When they approve them, you can start earning from day one.",
  vetting: "We run checks before an operator sees your application, to make sure you can afford the rent.",
  deposit: "The deposit is two and a half weeks' rent. You get it back after we compare the photos from collection and return.",
  fee: "Listing is free. Kharo takes a small fee from the operator when a rental completes. Drivers never pay Kharo.",
  support: "If something goes wrong, a real person calls you. After an accident, we give you another car while we deal with the claim.",
  prelaunch: "Kharo is pre-launch. The cars shown are the kind our launch operators rent out and are not bookable yet.",
  // Planned opening month per city. Shown in the top banner, on city pages
  // and after someone registers. Change these here and every page follows.
  launch: {
    London: "November 2026", Birmingham: "December 2026", Manchester: "December 2026",
    Leeds: "January 2027", Sheffield: "January 2027", Wolverhampton: "January 2027", Liverpool: "February 2027",
  },
  launchOrder: ["London", "Birmingham", "Manchester", "Leeds", "Sheffield", "Wolverhampton", "Liverpool"],
};

// ---------------------------------------------------------------------------
// GLOBAL, used by the header, footer and page titles
// ---------------------------------------------------------------------------
export const BRAND = {
  name: "Kharo",
  tagline: "Rent the car. We handle everything around it.",
  footerBlurb:
    "Licensed private hire cars from checked operators, with insurance quotes on every car.",
  supportEmail: "hello@kharo.co.uk",
  privacyEmail: "privacy@kharo.co.uk",
  // Digits only, UK country code, no leading 0 or +: used to build wa.me links.
  whatsapp: "447392829759",
  copyright: `© 2026 Kharo. Launching in ${FACTS.citiesSentence}.`,
  // Social profiles. Correct these to the real handles if they differ; the
  // footer hides any icon whose value is empty.
  // Left empty on purpose: the guessed handles pointed at pages that are not
  // Kharo's. The footer hides an icon whose value is empty. Fill these in
  // with the real profile links and the icons come back.
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
};

export const NAV = {
  primary: [
    { to: "/search", label: "Browse cars" },
    { to: "/for-drivers", label: "For drivers" },
    { to: "/operator-guide", label: "For operators" },
    { to: "/why-kharo", label: "Why Kharo" },
    { to: "/about", label: "About" },
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
        ["About us", "/about"],
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
    eyebrow: "UK private hire rental",
    heading: "Drive it off the forecourt earning.",
    sub: "Find a car, pick your cover, and we get you road ready before you collect the keys.",
    img: IMG.londonBus,
    imgAlt: "Traffic on a London street at dusk",
    searchCta: "Search cars",
    moreFilters: "More filters",
    fewerFilters: "Fewer filters",
    cityPlaceholder: "Pick a city",
    caption: FACTS.prelaunch,
  },
  work: {
    heading: "The work around the car, done for you.",
    sub: "Most rental firms hand you the keys and stop there. Kharo carries on.",
    items: [
      { t: "Insurance quotes on every car", d: "We get quotes from leading insurers and pass the best prices on to you. You pick one when you apply." },
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
    heading: "Questions drivers ask",
    items: [
      { q: "What is a private hire vehicle?", a: "A car with a licence to carry passengers who book a ride, on Uber, Bolt or with a local firm. In London the licence comes from TfL. In other cities it comes from the council." },
      { q: "Do I need a licence to rent a car on Kharo?", a: "Yes. You need a private hire driver licence for your city, a full driving licence you have held for one year, and the right to work in the UK. You can look at cars and register before you have these." },
      { q: "Is insurance included in the weekly price?", a: `${FACTS.price} ${FACTS.insurance}` },
      { q: "How do payments work?", a: FACTS.payments },
      { q: "Will I be set up on Uber and Bolt?", a: FACTS.platforms },
      { q: "What happens if the car breaks down or I have an accident?", a: FACTS.support },
      { q: "What does it cost to list a car?", a: FACTS.fee },
      { q: "Can I rent a car today?", a: "Not yet. Pick the car you want and register your interest. When we open in your city, we contact you first." },
    ],
  },
  closer: {
    heading: "Cars sitting idle cost you every week.",
    sub: "List your cars for free. Checked drivers apply, and we handle the paperwork.",
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
    description: "Everything a private hire driver gets with Kharo: the insurance choice, the three checks, platform set-up before collection, and one account for payments, documents and claims.",
  },
  hero: {
    tag: "For drivers",
    heading: "Rent a licensed car. Start earning this week.",
    sub: "Pick the right car for you. Pick your insurance. Start driving.",
    meta: [
      { label: "Price", value: "Rent, shown first" },
      { label: "Insurance", value: "Quotes on every car" },
      { label: "Uber and Bolt", value: "We upload your documents" },
    ],
    img: IMG.priusLondon,
    imgAlt: "A white Toyota Prius, the most common private hire car in London",
    primaryCta: "Browse cars",
    secondaryCta: "Join the waitlist",
  },
  flow: {
    heading: "Applying takes a few minutes.",
    sub: "Pick your car and your insurance. Send your application. We push the operator to reply quickly.",
  },
  steps: {
    heading: "From browsing to earning",
    items: [
      { t: "Find the right car for you", d: "Search by city, price, fuel and make." },
      { t: "Apply for it", d: "Fill in one short form. We save your details for next time." },
      { t: "Get the right insurance for you", d: "Compare comprehensive quotes from leading insurers. Pick how long for." },
      { t: "We check you", d: FACTS.vetting },
      { t: "The operator says yes", d: "The operator checks your application and replies. We push them to reply quickly. If yes, you pay the deposit and the first month's rent through Kharo. It is only taken when you collect the car." },
      { t: "We set up Uber and Bolt", d: FACTS.platforms },
      { t: "Collect the car", d: "You and the operator take photos of the car together. You sign in the app. From then on, everything is in your account." },
    ],
    guideCta: "Read the full driver guide",
  },
  dashboard: {
    heading: "One account for everything.",
    sub: "Your payments, documents and messages, in one place. Click the tabs to see it.",
  },
  support: {
    heading: "If something goes wrong, we help.",
    body: "A warning light, a small crash or a question about a payment: a real person calls you. After an accident we collect the car, give you another car, and deal with the garage and the insurer.",
    points: [
      "Report a problem from your phone",
      "A person calls you back",
      "You get another car while yours is fixed",
      "We deal with the insurer, the garage and the operator",
    ],
    img: IMG.keysWoman,
    imgAlt: "Keys being handed to a driver",
  },
  requirements: {
    heading: "What you need",
    sub: "You can look at cars and register without these. You need them to rent a car.",
    items: [
      "A private hire driver licence for your city",
      "A full driving licence you have held for one year",
      "The right to work in the UK",
      "A bank account, so we can check you can afford the rent",
    ],
    note: "Some operators ask for more, for example a minimum age. The car's page tells you.",
  },
  closer: {
    heading: "Start with the cars.",
    sub: "Look at the cars, or join the waitlist and we will email you before we open in your city.",
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
    heading: "How renting works, step by step.",
    sub: "From finding a car to giving it back. Read this before you sign anything.",
    meta: [
      { label: "Steps", value: "Nine, start to finish" },
      { label: "Time to apply", value: "About four minutes" },
      { label: "Cost to apply", value: "Nothing" },
    ],
    img: IMG.corollaLondon,
    imgAlt: "A Toyota Corolla hybrid on a London street",
    cta: "Browse cars",
  },
  steps: [
    { t: "Find the right car for you", d: "Search by city, price, fuel and make. The price you see is the rent. The operator sets it.", img: IMG.phoneInCar },
    { t: "Apply for it", d: "One short form: your name, your phone, your licence, and when you want to start. We save it for next time.", img: IMG.signingLaptop },
    { t: "Get the right insurance for you", d: FACTS.insurance, img: IMG.signingCouple },
    { t: "We check you", d: FACTS.vetting, img: IMG.driverSuit },
    { t: "The operator says yes or no", d: "The operator checks your application and replies. We push them to reply quickly. If yes, you pay the deposit and the first month's rent through Kharo. It is only taken when you collect the car. If the car is not as described, Kharo holds your money.", img: IMG.handshake },
    { t: "We set up Uber and Bolt", d: FACTS.platforms, img: IMG.driverNight },
    { t: "Collect the car", d: "You and the operator take photos of the car together in the app. The photos protect your deposit later.", img: IMG.keysHandover },
    { t: "Give the car back", d: "You and the operator take photos again and write down the mileage. We compare them with the first photos. You only pay for new damage." },
    { t: "Pay monthly", d: FACTS.payments, img: IMG.money },
  ],
  money: {
    heading: "What you pay, and who gets it",
    rows: [
      ["Rent", "The operator sets it. You see it on the car's page. You pay it monthly through Kharo."],
      ["Insurance", "You choose it from the quotes we show you. You pay the insurer."],
      ["Deposit", FACTS.deposit],
      ["Kharo", "Nothing. The operator pays Kharo a fee when a rental completes."],
    ],
  },
  damage: {
    heading: "If something happens",
    steps: [
      { when: "Straight away", d: "If anyone is hurt, call 999 first. Then report it in the app. The app shows you which photos to take." },
      { when: "Then", d: "A person calls you. Together you decide if the car can still be driven." },
      { when: "Same day", d: "If the car cannot be driven, we collect it and give you another car." },
      { when: "After that", d: "We deal with the garage, the insurer and the operator. You do not have to chase anyone." },
    ],
    liability: [
      ["Normal wear from driving", "The operator"],
      ["Damage below your excess", "You, from your deposit"],
      ["Damage above the excess", "Your insurer. Kharo handles the claim."],
      ["Another driver's fault", "Their insurer. Kharo handles it."],
      ["The car breaks down", "The operator"],
      ["Parking, congestion and ULEZ charges", "You"],
    ],
  },
  faq: [
    { q: "How much is the deposit?", a: `${FACTS.deposit} You see the exact amount on the car's page.` },
    { q: "Can I choose any insurer?", a: "You choose from the comprehensive quotes we show you. You pick how long for." },
    { q: "Who sets up Uber and Bolt?", a: "We do, before you collect the car. If you drive for another app, tell us and we add that too." },
    { q: "What if I miss a payment?", a: "We tell you straight away and try again the next day. If you need more time, a person calls you to arrange it. If you keep missing payments, Kharo asks Uber and Bolt to pause your account until it is sorted." },
    { q: "Does the operator track the car?", a: "Yes. Every car has a tracker, for theft and for servicing. Your hire agreement tells you what the operator can see." },
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
    heading: "Turn idle cars into rent.",
    sub: "Listing is free. We check the drivers, collect the rent and look after the car.",
    meta: [
      { label: "To list", value: "Free" },
      { label: "Drivers", value: "Checked before you see them" },
      { label: "Rent", value: "Collected monthly, paid on schedule" },
    ],
    img: IMG.showroom,
    imgAlt: "Cars lined up in a dealership",
    primaryCta: "List your fleet",
    secondaryCta: "See the console",
  },
  manage: {
    heading: "We do the work around the car.",
    sub: "These are the jobs you normally chase by phone. Kharo does them for you and tells you when you need to act.",
    items: [
      { t: "Applications", d: "Drivers come to you already checked: driving licence, identity, and that they can pay. Their insurance choice is attached. You say yes or no." },
      { t: "Documents", d: "V5C, MOT, plate, insurance and hire agreements for every car, kept in one place." },
      { t: "Dates", d: "We tell you before a service, MOT, plate or insurance runs out. If you want, we book it." },
      { t: "Problems", d: "If a driver reports a problem, you see it the same day, with photos. We book the garage and you see every job and every invoice." },
      { t: "Accidents", d: "Our insurance team deals with the claim, the repair, and another car for the driver." },
      { t: "Tracking", d: "Every car gets a tracker before handover. Your console shows where each car is, its mileage, and the photos from collection and return." },
      { t: "Rent", d: "We collect the rent from the driver every month and pay you on time. You see every payment in your console." },
    ],
  },
  dashboard: {
    heading: "The operator console.",
    sub: "Your fleet, your applications, your documents and your money. Click the tabs to see it.",
  },
  steps: {
    heading: "How listing works",
    items: [
      { t: "You fill in a short form", d: "Your company name, how many cars you have, and where you work. That is all." },
      { t: "We call you", d: "A person from Kharo calls you within one working day. The same person helps you from then on." },
      { t: "We check your licence", d: "We check your operator licence with the council and your company with Companies House." },
      { t: "We build your listings", d: "We take your car details, photos, prices and documents and build the listings. You do not type anything." },
      { t: "Your cars go live", d: "Your cars appear on Kharo when we open in your city." },
      { t: "Checked drivers apply", d: "Every driver is already checked. Their insurance is attached. You say yes or no." },
      { t: "We keep looking after the car", d: "We watch the MOT, plate and insurance dates, book repairs, and deal with accidents. We collect the rent and pay you on time." },
    ],
  },
  claims: {
    heading: "If a car is damaged, you have a team.",
    body: "Report it once. Our insurance team tells the insurer, books the repair, gives the driver another car so the rent keeps coming, and keeps you informed until it is done.",
    img: IMG.fleetAerial,
    imgAlt: "Fleet vehicles seen from above",
  },
  fee: {
    heading: "What it costs",
    body: FACTS.fee,
    // A worked month, so the fee is a number, not a word. Edit the inputs
    // and the totals follow. The fee rate is the one in the demo console.
    example: { cars: 5, rent: 180, weeks: 4, feeRate: 0.10, payoutDay: "Friday, every two weeks" },
  },
  paid: {
    heading: "How we make sure you get paid.",
    sub: "Your car is your money. Here is what protects it.",
    points: [
      { t: "The driver is checked first", d: "We check that the driver can afford the rent. You see the result before you say yes." },
      { t: "Kharo holds the deposit", d: "The driver pays the deposit and the first month to Kharo, never to you in cash. It is settled against the photos from collection and return." },
      { t: "Rent comes through Kharo", d: "We collect it from the driver every month and pay you on schedule. You see every payment in your console." },
    ],
  },
  enforcement: {
    heading: "If a driver stops paying",
    steps: [
      { day: "Day 1", d: "The payment fails. We tell you and we tell the driver. We try again the next day." },
      { day: "Day 3", d: "A person from Kharo calls the driver to arrange payment." },
      { day: "Day 7", d: "Still unpaid. We ask Uber and Bolt to pause the driver's account." },
      { day: "Day 14", d: "We arrange the return of the car and settle the deposit against what is owed." },
    ],
  },
  earnings: {
    heading: "What idle cars are costing you.",
    sub: "Move the sliders to match your fleet.",
    ctaHeading: "Turn that number into rent.",
    ctaBody: "Tell us about your fleet. A person calls you within one working day, checks your licence, takes your car details and builds the listings for you.",
    ctaPoints: [
      "One person looks after you from start to finish",
      "We build the listings for you",
      "Drivers come to you already checked, with insurance attached",
    ],
    cta: "List your fleet",
    ctaNote: "We call within one working day. Nothing goes live until you say yes.",
  },
  faq: [
    { q: "Who insures the driver?", a: "The driver chooses their own hire and reward insurance when they apply. You see their choice with the application. If you have fleet insurance, tell us and the car's page will say it is included." },
    { q: "What do you check before I see an application?", a: FACTS.vetting },
    { q: "How do I get the rent?", a: "We collect it from the driver every month and pay it to you on time. Your console shows every payment." },
    { q: "What if a driver stops paying?", a: "We tell you the same day. A person from Kharo calls the driver. If they still do not pay, we ask Uber and Bolt to pause the driver's account until it is sorted." },
    { q: "Can I list now?", a: "Yes. We are signing up operators now. Your cars go live when Kharo opens in your city." },
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
  sub: "Tell us about your fleet. A person calls you within one working day.",
  loss: {
    label: "Idle cars cost you",
    idle: "Cars sitting idle",
    rate: "Weekly rate per car",
    perWeek: "Per week",
    perMonth: "Per month",
    perYear: "Per year",
    note: "An illustrative estimate based on your inputs, not a quote.",
  },
  trust: ["Checked drivers only", "Free to list", "A call within one working day"],
  success: {
    heading: "Thank you. We will call you.",
    body: "A person from Kharo will call you within one working day to talk about your cars.",
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
    eyebrow: "Why Kharo",
    heading: "Thousands of licensed drivers. Not enough cars.",
    sub: "Drivers need cars. Operators have cars standing still. Kharo brings them together and does the work in between.",
    meta: [
      { label: "For drivers", value: "A car you can afford, with nothing hidden" },
      { label: "For operators", value: "Checked drivers and rent that arrives" },
      { label: "For both", value: "One place for documents, payments and repairs" },
    ],
    img: IMG.londonNight,
  },
  gap: {
    number: "12,712",
    label: "more private hire driver licences than licensed vehicles in London",
    source: "TfL licensing statistics, May 2026",
    body: "Thousands of licensed drivers cannot find a car. At the same time, operators have cars standing still. Kharo brings them together and does the paperwork for both.",
  },
  drivers: {
    heading: "For drivers",
    points: [
      { t: "One price, shown first", d: FACTS.price },
      { t: "Insurance you choose", d: "Comprehensive quotes from leading insurers, side by side. You pick one." },
      { t: "Uber and Bolt ready before you collect", d: FACTS.platforms },
      { t: "Someone to call", d: "When something goes wrong, a real person calls you. No forms, no waiting." },
    ],
    img: IMG.vintageDriver,
    cta: "For drivers",
  },
  operators: {
    heading: "For operators",
    points: [
      { t: "Drivers are checked before you see them", d: FACTS.vetting },
      { t: "Insurance comes with the application", d: "You see the driver's insurance before you decide." },
      { t: "We watch the dates", d: "MOT, plate, insurance and service dates for every car. We remind you before anything runs out." },
      { t: "A team for accidents", d: "Our insurance team deals with the claim, the repair and another car for the driver." },
    ],
    img: IMG.suvLot,
    cta: "For operators",
  },
  honesty: {
    heading: "What we will not do",
    items: [
      "Show you a car that is not real.",
      "Hide a fee inside a price. The rent is the rent. Insurance is your choice.",
      "Show reviews we did not get. Ratings appear only when real drivers leave them.",
      "Sell your data. Not to insurers, not to apps, not to anyone.",
    ],
  },
  closer: {
    heading: "Two sides, one platform.",
    driverCta: "For drivers",
    operatorCta: "For operators",
  },
};

// ---------------------------------------------------------------------------
// ABOUT US
// Photos: drop omed-khan.jpg and walid-kamal.jpg into
// frontend/public/images/team/ (square or 4:5, at least 800px wide). Until a
// file is there the card shows the person's initials. Bios are optional;
// leave "" to show only the name and role.
// ---------------------------------------------------------------------------
export const ABOUT = {
  seo: {
    title: "About us · Kharo",
    description: "Who is behind Kharo, what we stand for, and why we are building a fairer way for private hire drivers to rent a car.",
  },
  heading: "About us",
  sub: "Who we are, what we stand for, and why we are building this.",
  // Place and car photography only: the streets the cars work and the cars
  // themselves. No stock people.
  strip: [IMG.londonStreet, IMG.priusLondon, IMG.londonBus, IMG.showroom, IMG.corollaLondon, IMG.londonNight],
  story: {
    heading: "Why we started Kharo",
    body: [
      "Thousands of licensed drivers in London cannot find a car. At the same time, operators have cars standing still.",
      "The rental firms in between have a bad name. Deposits kept. Fees nobody mentioned. Rent due on a car that will not start.",
      "Kharo is the middle piece done properly. Drivers rent from operators we have checked. The money goes through Kharo. Both sides can see everything.",
    ],
    img: IMG.rowCars,
  },
  values: {
    heading: "What we stand for",
    items: [
      { t: "Nothing hidden", d: "The rent is the rent. The deposit is two and a half weeks of it. Every fee is on the page before you apply." },
      { t: "Checked, not promised", d: "Operators are checked against Companies House. Drivers are checked before an operator sees them." },
      { t: "A person answers", d: "A warning light, a crash, a question about money: someone calls you back. Not a form." },
      { t: "Built for both sides", d: "Drivers need cars. Operators need rent that arrives. Kharo only works if both are treated fairly." },
    ],
  },
  team: {
    heading: "Meet the founders",
    sub: "Two people you can call. Not a form.",
    photoToFollow: "Photo to follow",
    people: [
      { name: "Omed Khan", role: "Co-founder", img: "/images/team/omed-khan.jpg", bio: "" },
      { name: "Walid Kamal", role: "Co-founder", img: "/images/team/walid-kamal.jpg", bio: "" },
    ],
  },
  closer: {
    heading: "Talk to us.",
    sub: "Drivers and operators both start with a short form. A person replies.",
    driverCta: "Join the waitlist",
    operatorCta: "List your fleet",
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
    { q: "How much does Kharo cost?", a: `Looking and applying is free. You pay the weekly rent on the car's page, and the insurance you choose. ${FACTS.fee}` },
    { q: "Is insurance included in the price?", a: `${FACTS.price} ${FACTS.insurance}` },
    { q: "Is the insurance right for Uber and Bolt work?", a: "Yes. Normal car insurance does not cover private hire work. Every price we show is hire and reward insurance, which does." },
    { q: "When do I pay, and how?", a: `You pay nothing until the operator says yes and you sign the agreement. ${FACTS.payments}` },
    { q: "Will Kharo set me up on Uber and Bolt?", a: FACTS.platforms },
    { q: "What if the car breaks down or I have an accident?", a: FACTS.support },
    { q: "What is the deposit, and when do I get it back?", a: `${FACTS.deposit} You see the exact amount on the car's page.` },
    { q: "Why can I not see the operator's name?", a: "You see the operator's name and phone number once they say yes to your application. Until then, everything goes through Kharo, which protects you both." },
    { q: "I have cars to rent out. How do I list them?", a: "Go to List your fleet and fill in the short form. A person calls you within one working day." },
    { q: "Can I rent a car today?", a: "Not yet. Pick the car you want and register your interest. When we open in your city, we contact you first." },
  ],
};

export const LEGAL = {
  heading: "Legal and privacy",
  updated: "Last updated 18 September 2026. This is a plain English summary for our pre-launch platform, governed by UK GDPR and the Data Protection Act 2018, and is not a substitute for the full terms published at go live.",
  sections: [
    { t: "About Kharo", b: "Kharo connects private hire drivers with rental operators we have checked. Kharo operates the platform, the matching process and the payment flow, and works with specialist partners for insurance, claims and support. Kharo is not an insurer and does not provide credit." },
    { t: "How your data is used", b: "We collect the details you provide, including your name, contact details, licence and driving information, to verify your eligibility, gather insurance quotes and match you to vehicles. Your data is used to operate the service and, where you have agreed, to keep you informed about launch and relevant offers. We never sell your personal data." },
    { t: "Identity and affordability checks", b: "Where we run a liveness identity check, that involves biometric data used to confirm you are who you say you are. We only run this check with your explicit consent, given at the point you apply, and you can withdraw that consent by not proceeding with the check. Where we review Open Banking transaction data for affordability, that review is read only, cannot move money, and a human always makes the final decision on your application." },
    { t: "Insurance", b: "The weekly price shown on a listing is the rental only. When you apply, we gather hire and reward insurance quotes from specialist partners and you choose how long the comprehensive cover runs for. The insurance contract is between you and the insurer; Kharo arranges the quotes and passes your choice to the operator with your application. Where an operator includes their own fleet cover, the listing says so; that cover is declared by the operator and the operator is responsible for keeping it valid." },
    { t: "Payments and deposits", b: "Rent is collected monthly through Kharo and paid to the operator. The deposit is two and a half weeks' rent, shown on the listing, and returned after the agreed handover condition record is compared. Paying an operator directly outside the platform removes the protections we offer." },
    { t: "Platform set-up", b: "With your consent, we add the rented vehicle to your Uber, Bolt and other ride-hailing accounts before collection. We use only the vehicle and licence details needed to do so and do not access your earnings or trip history." },
    { t: "Operator verification", b: "Rental operators are checked against Companies House before listing. Operator identity is disclosed to a driver once their application is approved." },
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
  heroHeadingTemplate: "Private hire cars to rent in {city}.",
  heroSubTemplate: "{count} cars from operators we have checked. We plan to open in {city} in {launch}. Register now and we call you first.",
  seeAllCta: "See all {count} cars",
  accountCta: "Join the waitlist",
  listingsHeading: "Cars in {city}",
  greenNote: "{green} of them are hybrid or fully electric, which keeps your running costs down.",
  emptyNote: "No cars listed in {city} yet. Join the waitlist and we will let you know the moment one arrives.",
  faqHeading: "Renting a car in {city}",
  otherCitiesHeading: "Other cities",
  comingSoon: {
    heading: "We are not live in {city} yet.",
    sub: "Kharo is for the whole UK. We plan to open in {city} in {launch}. Join the waitlist and we email you the moment {city} has cars.",
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
    Wolverhampton: {
      intro: "Wolverhampton is a launch city for one reason: its plates travel. A car, driver and operator all licensed by the City of Wolverhampton Council can legally work across England and Wales, which makes these cars the flexible option if you cover more than one area. Kharo lists checked local operators from the City Centre out to Bilston, Tettenhall and Bushbury.",
      faq: [
        { q: "Can a Wolverhampton-plated car work outside Wolverhampton?", a: "Yes. City of Wolverhampton Council plates are widely used for cross-border private hire work across England and Wales. Your driver licence and your operator must be licensed by the same authority as the vehicle." },
        { q: "What licence do I need in Wolverhampton?", a: "A private hire driver licence from the City of Wolverhampton Council, plus a licensed vehicle. Our operators can guide you through plating." },
        { q: "Is insurance included?", a: `${FACTS.price} ${FACTS.insurance}` },
      ],
    },
    Liverpool: {
      intro: "Liverpool is one of our newest cities. Kharo connects you with checked local operators across the city, from the centre out to Toxteth, Wavertree and Old Swan, with hybrids and electric cars that keep running costs down over the daily miles.",
      faq: [
        { q: "What licence do I need to drive private hire in Liverpool?", a: "A private hire driver and vehicle licence from Liverpool City Council. Kharo cars are ready for council plating." },
        { q: "Which cars are available in Liverpool?", a: "Mostly hybrids and electric cars with low running costs, alongside saloons and estates, with more added as we bring local operators on." },
        { q: "When can I rent a car in Liverpool?", a: "Join the waitlist now and we will email you the moment cars are ready to rent in Liverpool." },
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
  stepCover: {
    heading: "Your insurance",
    sub: "Comprehensive cover from leading insurers. Pick how long for. Your choice goes to the operator with your application.",
    note: "These prices are a guide. You get exact quotes from insurers once you send your application.",
    // Comprehensive only, by decision of the owner (24 Sep 2026). The key
    // stays "comp" so saved links with ?cover=comp keep working.
    levels: {
      comp: "Comprehensive",
    },
    levelNotes: {
      comp: "Covers damage to your car and to other people. Every operator on Kharo asks for this.",
    },
  },
  timeframes: ["As soon as possible", "Within a month", "Within three months", "Just looking"],
  step1: { heading: "About you", sub: "So we know who you are and where you drive." },
  step2: {
    heading: "Your licence",
    sub: "Your private hire badge helps us match you to a car quickly. Add it now if you have it.",
    privacy: "We use these to check your badge with the council and your driving licence with the DVLA. We do not give them to the operator until you say yes.",
  },
  step3: { heading: "Check and send", sub: "You pay nothing now. This only tells us which car you want.", cta: "Register my interest" },
  sidebarNote: PREVIEW.inline,
  reassure: {
    heading: "What happens to your details",
    items: [
      "Registering is free, now and later",
      "We never give your details to an operator without asking you",
      "You fill this in once. We use it for every car you look at",
    ],
  },
  success: {
    heading: "Thank you. We have it.",
    body: "We know the car, the price and the area you want. When we open in your city, we contact you first.",
    nextHeading: "What happens next",
    next: [
      "We email you before we open in your area",
      "Then we match you to a car and get your insurance prices",
      "Your licence details are saved. You will not type them again",
      "If anything changes, or you want to leave the list, reply to that email",
    ],
  },
};
