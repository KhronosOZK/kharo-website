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
  tagline: "The UK marketplace for private hire vehicles.",
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
    { to: "/marketplace", label: "Buy a car" },
    { to: "/why-caro", label: "Why Kharo" },
    { to: "/driver-guide", label: "How it works" },
    { to: "/operator-guide", label: "For operators" },
  ],
  accountMenu: [
    { to: "/register", title: "Drivers", sub: "Join the list for launch in your city" },
    { to: "/list-your-fleet", title: "Rental operators", sub: "Register your fleet for launch" },
    { to: "/sell-your-car", title: "Sellers", sub: "List a private hire vehicle for sale" },
  ],
  mobileCtas: [
    { to: "/register", label: "Drivers, register your interest" },
    { to: "/list-your-fleet", label: "Operators, list your fleet" },
    { to: "/sell-your-car", label: "Sell your private hire vehicle" },
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
        ["Buy a car", "/marketplace"],
        ["How renting works", "/driver-guide"],
        ["Register your interest", "/register"],
      ],
    },
    {
      heading: "Selling",
      links: [
        ["Sell your vehicle", "/sell-your-car"],
        ["Browse the marketplace", "/marketplace"],
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
    heading: "The right car, the full price, up front.",
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
  // Cross sell block that sends renters to the sales marketplace
  marketplaceTeaser: {
    eyebrow: "New on Kharo",
    heading: "Or own the car you drive.",
    sub: "Buy a licensed private hire vehicle outright, with the PCO licence expiry, MOT date and full history shown on every listing. Or sell yours to drivers who are already looking.",
    primaryCta: "Browse cars for sale",
    secondaryCta: "Sell your vehicle",
    points: [
      "PCO and MOT expiry dates on every listing",
      "ULEZ status confirmed before a car goes live",
      "Seller identity and ownership confirmed before listing",
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    heading: "Find a car, know the cost, get on the road.",
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
    heading: "Keep your cars earning.",
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
    heading: "Renting should feel as sound as buying.",
    sub: "Drivers get the real number before they commit. Operators get reliable payment and drivers worth having. Both sides get a written record.",
    img: IMG.driverSuit,
  },
  drivers: {
    eyebrow: "If you are a driver",
    heading: "Get on the road with the full picture.",
    img: IMG.happyDriver,
    cta: "Browse cars",
    points: [
      { t: "You know the number before you commit", d: "Rent, insurance and breakdown are added together on every car, so the figure on the card is the figure that leaves your account each week." },
      { t: "Insured for the work you actually do", d: "A standard policy will not cover private hire. Every quote we show is hire and reward cover, written for the way you earn." },
      { t: "Your money stays protected", d: "You pay Kharo, and your deposit is held securely until the return photos are agreed. It then comes straight back to you." },
      { t: "One number to call", d: "A breakdown, a bump or a parking ticket. Tell us once and we put you in front of the right person the same day." },
    ],
  },
  operators: {
    eyebrow: "If you run a fleet",
    heading: "More cars earning, less time chasing.",
    img: IMG.fleetLot,
    cta: "List your fleet",
    points: [
      { t: "Applications you can act on", d: "Background and licence checks are done before an application reaches you, so your queue is people you could hand keys to today." },
      { t: "Rent that arrives on time", d: "Payments run through us and land in your account every fortnight. If a driver defaults, we cover the rent for up to two weeks." },
      { t: "Your paperwork in one place", d: "MOT, tax, insurance and PHV licence dates for the whole fleet, with a reminder before anything runs out." },
      { t: "Evidence, not arguments", d: "Timestamped handover photos at pickup and return mean every deposit decision is backed by a record both sides can see." },
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
    heading: "The right car for the week, priced honestly.",
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
    heading: "Everything you need to rent with confidence.",
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
    heading: "Four things, and none of them take long.",
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
    heading: "The checklist, before you apply.",
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
    heading: "Your next car is a few filters away.",
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
    heading: "From first look to keys in your hand.",
    sub: "The whole process, start to finish, in plain English.",
    img: IMG.taxiDriver,
    cta: "Browse cars",
  },
  steps: [
    { n: "01", t: "Look properly, and compare fairly", d: "Filter by area, type of car, fuel and what you can comfortably afford each week. The price on every card already includes insurance and breakdown, so you are comparing like for like from the start.", img: IMG.phoneInCar },
    { n: "02", t: "Sort your insurance once", d: "You give us your licence and driving history a single time. We arrange specialist hire and reward cover on your behalf, then reuse your details on every car afterwards.", img: IMG.signingCouple },
    { n: "03", t: "Apply and get the nod", d: "The application is short and your saved details fill it in. The rental company reviews it alongside a background check, and most drivers hear back inside a day.", img: IMG.signingLaptop },
    { n: "04", t: "Check the car over together", d: "You and the operator photograph the car from every angle before you drive away. Both sides keep a timestamped record, so anything raised later is settled by evidence.", img: IMG.keysWoman },
    { n: "05", t: "Get out there and earn", d: "A warning light, a bump or a parking ticket goes through us and we put you in front of the right person. Breakdown cover and servicing are already handled.", img: IMG.driverNight },
    { n: "06", t: "Hand back or carry on", d: "Book a return slot and repeat the photo check. Your deposit is released once both sets match. If you want to keep going, compare fresh quotes and extend with your details already saved.", img: IMG.vintageDriver },
  ],
  closing: {
    heading: "Start whenever suits you.",
    sub: "Set up your account in about a minute, then browse and apply with your details already in place. Nothing to pay until you are approved.",
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
    heading: "Fill your fleet with drivers worth having.",
    sub: "List your vehicles once, get matched with drivers we have already vetted, and receive your payout on a fixed fortnightly schedule.",
    img: IMG.rowCars,
    cta: "Register your interest",
  },
  perks: [
    { t: "10% flat", d: "Taken from the rental side before your fortnightly payout. No listing fees and no setup costs." },
    { t: "Two weeks covered", d: "If a driver stops paying, we cover the rent for up to a fortnight while you arrange a replacement." },
    { t: "Checks done first", d: "Background and licence checks are complete before an application reaches your queue." },
  ],
  steps: [
    { n: "01", t: "Register your interest", d: "Tell us about your fleet and leave a contact. We will reach out as onboarding opens in your area.", img: IMG.handshake },
    { n: "02", t: "Get verified", d: "We check your Companies House record and operator licence against the public register before anything goes live. It is the same badge of trust your drivers will see.", img: IMG.signingLaptop },
    { n: "03", t: "List your cars", d: "Add each vehicle with photos, weekly rent, what is included and any conditions. Pause or edit a listing at any time from your dashboard.", img: IMG.showroom },
    { n: "04", t: "Pick your drivers", d: "Vetted drivers apply to your listings. You see experience and check status up front, then approve or decline from a single queue.", img: IMG.driverMirror },
    { n: "05", t: "Hand over with proof", d: "A quick photo handover at pickup and return gives you a timestamped record, so every deposit decision is backed by evidence.", img: IMG.keysWoman },
    { n: "06", t: "Get paid on time", d: "Payouts run every fortnight after the 10% fee. The rent guarantee protects your income if a driver defaults.", img: IMG.executive },
    { n: "07", t: "Stay on top of the paperwork", d: "MOT, tax, insurance and PHV licence dates for the whole fleet in one view, with a reminder before anything lapses.", img: IMG.interior },
  ],
};

// ---------------------------------------------------------------------------
// HELP AND LEGAL
// ---------------------------------------------------------------------------
export const HELP = {
  heading: "How can we help?",
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
    { q: "How does the marketplace for buying and selling work?", a: "Sellers list a licensed private hire vehicle with its PCO expiry, MOT date, mileage and history. Buyers browse and register interest, and we introduce the two sides once both are verified. Listing a vehicle is free during our launch phase." },
    { q: "Does the PCO licence transfer when I buy a car?", a: "The vehicle licence stays with the current licensee, so as the new owner you apply for a licence in your own name. We show the current expiry date on every listing so you can plan the cost and timing of that application." },
    { q: "I am a rental company, how do I list my fleet?", a: "Kharo is onboarding its first operators now. Register your interest and we will contact you before we go live in your area to get you verified and listed." },
  ],
};

export const LEGAL = {
  heading: "Legal and privacy",
  updated: "Last updated 17 June 2026. This is a plain English summary for our pre launch platform and is not a substitute for the full terms published at go live.",
  sections: [
    { t: "About Kharo", b: "Kharo is a marketplace connecting private hire vehicle drivers with checked rental companies and vehicle sellers. Kharo operates the marketplace, the matching process and the payment flow, and works with specialist partners for insurance, claims and support. Kharo is not an insurer and does not provide credit." },
    { t: "How your data is used", b: "We collect the details you provide, including your name, contact details, licence and driving information, to verify your eligibility, generate insurance quotes and match you to vehicles. Your data is used to operate the service and, where you have agreed, to keep you informed about launch and relevant offers. We never sell your personal data." },
    { t: "Insurance", b: "Insurance quotes are provided for comparison through our specialist insurance partners. Standard personal motor policies exclude hire and reward, so any policy you take must properly cover private hire use. Kharo facilitates quotes and payment, and the insurance contract is between you and the insurer." },
    { t: "Buying and selling vehicles", b: "Kharo introduces buyers and sellers. Licensing details shown on a sale listing, including PCO and MOT expiry, are supplied by the seller and confirmed against the relevant public register where one is available. A private hire vehicle licence remains with the current licensee, so a buyer applies for a licence in their own name. Buyers should carry out their own inspection and history check before any purchase." },
    { t: "Payments and deposits", b: "All rental payments are processed through Kharo. Deposits are held securely and released after return, subject to the agreed handover condition record. Paying an operator directly outside the platform may void your cover and the protections we offer." },
    { t: "Operator verification", b: "Rental companies are checked against the relevant licensing register and Companies House before listing. Operator identity is disclosed to a driver once their application is approved." },
    { t: "Your rights under UK GDPR", b: "You can request access to, correction of, or deletion of your personal data at any time by contacting privacy@kharo.uk. Where processing is based on consent, you can withdraw it at any time in your account settings." },
    { t: "Cookies", b: "We use essential cookies to keep you signed in and remember your preferences, plus limited analytics to understand how the marketplace is used. You can control non essential cookies in your browser." },
  ],
};

// ---------------------------------------------------------------------------
// MARKETPLACE, buying a private hire vehicle
// ---------------------------------------------------------------------------
export const MARKETPLACE = {
  hero: {
    eyebrow: "Kharo Marketplace",
    heading: "Buy a private hire vehicle that is ready to work.",
    sub: "Every listing shows the PCO licence expiry, MOT date, mileage and service history up front, so you know exactly what you are buying and what it will cost to keep on the road.",
    img: IMG.showroom,
    primaryCta: "Browse vehicles",
    secondaryCta: "Sell your vehicle",
  },
  valueProps: [
    { icon: "CalendarCheck", t: "Licensing dates shown up front", d: "PCO and MOT expiry appear on every card, with the months remaining worked out for you. No guessing what a car will cost to relicense." },
    { icon: "ShieldCheck", t: "Sellers are verified", d: "Whether the seller is a working driver or a fleet, we confirm identity and ownership before a vehicle goes live." },
    { icon: "Gauge", t: "The details that matter to PHV", d: "ULEZ status, mileage, keeper count, service history and transmission. The things that decide whether a car earns for you." },
    { icon: "Handshake", t: "A direct introduction", d: "Register interest and we introduce you to the seller directly once both sides are verified. No listing fee while we launch." },
  ],
  pcoNote: {
    heading: "About the PCO licence on a car you buy",
    body: "A private hire vehicle licence stays with the current licensee, so as the new owner you apply for a licence in your own name. We show the current expiry on every listing because it tells you how the car has been kept and how soon the next inspection and fee is due. A vehicle with a long licence and a fresh MOT usually means fewer surprises in your first month.",
  },
  filters: {
    heading: "Filter the marketplace",
    city: "City",
    type: "Body type",
    fuel: "Fuel",
    seller: "Seller",
    price: "Budget",
    pco: "Minimum PCO remaining",
    apply: "Update results",
    sort: {
      default: "Best match",
      price_asc: "Price, low to high",
      price_desc: "Price, high to low",
      mileage: "Lowest mileage",
      pco: "Longest PCO remaining",
      newest: "Recently listed",
    },
  },
  empty: {
    heading: "Nothing matches those filters yet",
    sub: "Widen your budget or try another city. You can also tell us what you are after and we will alert you when a match is listed.",
    cta: "Tell us what you are looking for",
  },
  buyerCta: {
    heading: "Not found it yet?",
    sub: "Tell us the make, budget and how much PCO you need. We will alert you the moment something matching is listed.",
    cta: "Set up a buyer alert",
  },
  sellerCta: {
    eyebrow: "Selling a vehicle",
    heading: "Reach drivers who are already looking.",
    sub: "Drivers come to Kharo knowing what a private hire vehicle needs. Tell us about yours and we will list it for you, free while we launch.",
    cta: "Sell your vehicle",
  },
  detail: {
    licensingHeading: "Licensing and compliance",
    vehicleHeading: "Vehicle details",
    sellerHeading: "About the seller",
    descriptionHeading: "Seller's description",
    featuresHeading: "Equipment",
    interestCta: "Register your interest",
    interestNote: "We pass your details to the seller and introduce you both once verification is complete. Nothing is charged to you.",
    checklistHeading: "Before you buy, check these",
    checklist: [
      "Confirm the V5C is in the seller's name and the details match the vehicle",
      "Run an MOT and mileage history check against the registration",
      "Book an independent inspection, particularly on a high mileage hybrid battery",
      "Confirm the licensing cost and inspection date for a licence in your own name",
      "Arrange hire and reward insurance before you drive the vehicle for work",
    ],
  },
};

// ---------------------------------------------------------------------------
// SELL YOUR VEHICLE
// ---------------------------------------------------------------------------
export const SELL = {
  hero: {
    eyebrow: "Sell your private hire vehicle",
    heading: "List it where the buyers already are.",
    sub: "Kharo brings together drivers looking for a licensed vehicle they can work from day one. Tell us about yours and we will put it in front of them.",
  },
  points: [
    { icon: "Users", t: "Buyers who already know the trade", d: "Everyone here is shopping for a vehicle to work from, so you spend no time explaining what a PCO licence is or why the expiry matters." },
    { icon: "Tag", t: "Free while we launch", d: "No listing fee and no commission during our launch phase. We are building the market first." },
    { icon: "ShieldCheck", t: "Verified on both sides", d: "We confirm buyer identity before we make an introduction, so your time goes on serious enquiries." },
    { icon: "Layers", t: "Fleets welcome", d: "Selling several vehicles at once? Tell us how many and we will handle them as a batch." },
  ],
  form: {
    heading: "Tell us about your vehicle",
    sub: "Two minutes and you are on the list.",
    note: "Once you register, we will confirm the details, agree a price with you and prepare your listing for the marketplace launch.",
    successHeading: "Thank you, your vehicle is registered.",
    successBody: "We have your details and we will be in touch to confirm the vehicle, agree a price and get your listing ready.",
  },
  buyerToggle: {
    question: "Are you buying or selling?",
    sell: "Selling",
    buy: "Buying",
    both: "Both",
  },
  buyer: {
    heading: "Tell us what you are looking for",
    sub: "We will alert you the moment a matching vehicle is listed.",
    successHeading: "Your buyer alert is set up.",
    successBody: "We will be in touch as soon as a vehicle matching your description is listed on the marketplace.",
  },
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
  marketplaceHeading: "Looking to buy rather than rent in {city}?",
  marketplaceSub: "Browse licensed private hire vehicles for sale, with PCO and MOT expiry shown on every listing.",
  marketplaceCta: "Browse vehicles for sale",
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
        { q: "How much does a PCO car cost in London?", a: "Rent only prices start from around £130 a week. Insurance and breakdown cover are shown on top, so the full weekly figure is clear from the start." },
        { q: "Can I buy a private hire vehicle instead of renting?", a: "Yes. Our marketplace lists licensed vehicles for sale across London, with the PCO expiry, MOT date and full history on every listing." },
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
        { q: "What will it cost me each week?", a: "Rent starts from around £130 a week, with insurance and cover shown clearly on top." },
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
