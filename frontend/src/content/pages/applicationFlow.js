// Copy and illustrative data for the ApplicationFlow demo on the driver pages.
// Prices and insurer names are sample data; the component labels them as such.
export const APPLICATION_FLOW = {
  steps: ["Pick a car", "Choose cover", "Send it", "Sent"],
  labels: {
    car: "Pick the car you want",
    insurance: "Choose your hire and reward cover",
    quoteNote: "Quotes are gathered from specialist private hire insurers when you apply.",
    review: "Check it over",
    rowCar: "Car",
    rowCover: "Cover",
    rowChecks: "Checks",
    checksValue: "DVLA, identity and affordability",
    submit: "Send application",
    sending: "Sending",
    replay: "Play it again",
    footnote: "A walkthrough of the application. Cars, insurers and prices are illustrative.",
  },
  terms: [
    { id: "monthly", label: "Monthly", suffix: "a month" },
    { id: "sixMonthly", label: "6 months", suffix: "every 6 months" },
    { id: "annual", label: "Yearly", suffix: "a year" },
  ],
  cars: [
    { id: "prius", name: "Toyota Prius 2022", meta: "Hybrid · automatic · Camden", rent: 165, img: "/images/listings/toyota-prius.jpg" },
    { id: "niro", name: "Kia Niro EV 2023", meta: "Electric · automatic · Hackney", rent: 190, img: "/images/listings/skoda-octavia.jpg" },
    { id: "passat", name: "VW Passat GTE 2021", meta: "Plug-in hybrid · automatic · Leeds", rent: 180, img: "/images/listings/vw-passat-gte.jpg" },
  ],
  quotes: [
    { id: "tp", cover: "Third party", insurer: "Coverline PHV", excess: "£750 excess", price: { monthly: 148, sixMonthly: 840, annual: 1595 } },
    { id: "comp", cover: "Comprehensive", insurer: "Ryde Mutual", excess: "£500 excess", price: { monthly: 176, sixMonthly: 995, annual: 1880 } },
    { id: "tpft", cover: "Third party, fire and theft", insurer: "Hackney and Shaw", excess: "£650 excess", price: { monthly: 161, sixMonthly: 915, annual: 1730 } },
  ],
  sent: {
    heading: "Application sent",
    body: "The operator has your application, your checks and the cover you picked, all in one place.",
    next: [
      "The operator reviews it and replies with a decision",
      "We set the car up on Uber and Bolt before you collect",
      "Your cover, agreement and payments land in your account",
    ],
  },
};
