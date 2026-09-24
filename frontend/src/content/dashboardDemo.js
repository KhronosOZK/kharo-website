// ---------------------------------------------------------------------------
// DASHBOARD DEMO DATA
//
// Illustrative content for the interactive console shown on the driver and
// operator pages. Every figure here is sample data and the component says so.
// Icons are lucide names resolved in DashboardSnapshot.jsx.
// ---------------------------------------------------------------------------

export const DRIVER_DASHBOARD = {
  title: "Driver account",
  user: { initials: "AO", name: "Amara O.", sub: "Toyota Prius · LK22 CAR" },
  panels: [
    {
      id: "payments",
      label: "Payments",
      icon: "Wallet",
      headline: { label: "Next month's rent, due 17 Sep", value: 715, prefix: "£" },
      kpis: [
        { label: "Rent", value: "£165 a week, paid monthly" },
        { label: "Insurance", value: "£176 a month" },
      ],
      rows: [
        { t: "Rent for September", d: "17 Aug · paid on time", v: "£715", tone: "ok", status: "Paid" },
        { t: "Rent for August", d: "17 Jul · paid on time", v: "£715", tone: "ok", status: "Paid" },
        { t: "Deposit", d: "Two and a half weeks' rent · held by Kharo", v: "£415", tone: "muted", status: "Held" },
      ],
      foot: "Rent is collected through Kharo every month. You see every payment here.",
    },
    {
      id: "platforms",
      label: "Platforms",
      icon: "Radio",
      headline: { label: "Platforms live on this car", value: 2, suffix: " of 2" },
      kpis: [
        { label: "Uber", value: "Live" },
        { label: "Bolt", value: "Live" },
      ],
      rows: [
        { t: "Uber", d: "Vehicle added and approved before collection", v: "Live", tone: "ok", status: "Live" },
        { t: "Bolt", d: "Vehicle added and approved before collection", v: "Live", tone: "ok", status: "Live" },
        { t: "Another platform", d: "Tell us which one and we add the car for you", v: "Ask us", tone: "muted", status: "Optional" },
      ],
      foot: "We put the car on your platforms before you collect it, so you can start earning the day you pick up the keys.",
    },
    {
      id: "history",
      label: "Rental history",
      icon: "History",
      searchLabel: "Search your past rentals",
      headline: { label: "Weeks on the road with Kharo", value: 26 },
      kpis: [
        { label: "Current car", value: "Prius, 14 wks" },
        { label: "Previous", value: "Octavia, 12 wks" },
      ],
      rows: [
        { t: "Toyota Prius 2022", d: "Camden Motor Works · since 9 Jun", v: "Active", tone: "ok", status: "Active" },
        { t: "Skoda Octavia 2021", d: "Newham Garage · Mar to Jun", v: "Ended", tone: "muted", status: "Returned" },
      ],
      foot: "Every car you have rented, with its agreement, condition photos and payments kept together.",
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: "Receipt",
      searchLabel: "Search invoices",
      headline: { label: "Invoices this year", value: 26 },
      kpis: [
        { label: "Latest", value: "KH-0926" },
        { label: "Format", value: "PDF, any time" },
      ],
      rows: [
        { t: "KH-0926 · Rent and insurance", d: "12 Sep · £203", v: "Download", tone: "link", status: "PDF" },
        { t: "KH-0919 · Rent and insurance", d: "5 Sep · £203", v: "Download", tone: "link", status: "PDF" },
        { t: "KH-0912 · Rent and insurance", d: "29 Aug · £203", v: "Download", tone: "link", status: "PDF" },
      ],
      foot: "Download any invoice whenever you need it, for your records or your accountant.",
    },
    {
      id: "documents",
      label: "Documents",
      icon: "FileText",
      headline: { label: "Documents on file", value: 5 },
      searchLabel: "Search documents",
      kpis: [
        { label: "Insurance", value: "Renews 2 Dec" },
        { label: "Hire agreement", value: "Signed" },
      ],
      rows: [
        { t: "Insurance certificate", d: "Ryde Mutual · comprehensive · renews 2 Dec", v: "Valid", tone: "ok", status: "Valid" },
        { t: "Hire agreement", d: "Signed 9 Jun · 12-week rolling", v: "Signed", tone: "ok", status: "Signed" },
        { t: "V5C and PHV licence", d: "Held by the operator · copies here", v: "Valid", tone: "ok", status: "Valid" },
        { t: "Your PCO badge", d: "Verified · expires Mar 2027", v: "Valid", tone: "ok", status: "Valid" },
      ],
      foot: "Insurance, hire agreement and vehicle documents, live and always to hand.",
    },
    {
      id: "alerts",
      label: "Vehicle and alerts",
      icon: "Wrench",
      headline: { label: "Days until the next MOT", value: 34 },
      kpis: [
        { label: "Service", value: "Booked 18 Sep" },
        { label: "Mileage", value: "89,824 mi" },
      ],
      rows: [
        { t: "Service booked", d: "Thu 18 Sep · Camden Motor Works · courtesy car arranged", v: "Booked", tone: "ok", status: "Booked" },
        { t: "MOT due", d: "22 Oct · we book it and remind you", v: "34 days", tone: "warn", status: "Upcoming" },
        { t: "Warning light reported", d: "Reported 4 Sep · resolved at service", v: "Closed", tone: "muted", status: "Closed" },
      ],
      foot: "Report a fault from your phone. We handle the garage and the operator.",
    },
    {
      id: "claims",
      label: "Accidents and claims",
      icon: "LifeBuoy",
      headline: { label: "Open claims", value: 0 },
      kpis: [
        { label: "If it happens", value: "One call" },
        { label: "Replacement car", value: "Same day" },
      ],
      rows: [
        { t: "No open claims", d: "If you have an accident, tap here and a person calls you back", v: "Report", tone: "link", status: "Report" },
        { t: "Minor scrape · March", d: "Third party at fault · handled by Kharo · settled", v: "Settled", tone: "muted", status: "Settled" },
      ],
      foot: "After an accident we get you into a replacement car and back on the road while we handle the claim.",
    },
  ],
};

export const OPERATOR_DASHBOARD = {
  title: "Operator console",
  user: { initials: "CW", name: "Camden Motor Works", sub: "24 vehicles · 21 rented" },
  panels: [
    {
      id: "fleet",
      label: "Fleet",
      searchLabel: "Search by plate, model or driver",
      filters: ["All", "Rented", "Idle", "In service"],
      icon: "Car",
      headline: { label: "Vehicles earning this week", value: 21, suffix: " of 24" },
      kpis: [
        { label: "Idle", value: "2 cars" },
        { label: "In service", value: "1 car" },
      ],
      rows: [
        { t: "Toyota Prius · LK22 CAR", d: "Amara O. · Croydon · £165 a week", v: "Rented", tone: "ok", status: "Rented" },
        { t: "Kia Niro EV · KN23 EVE", d: "Daniel M. · Hackney · £190 a week", v: "Rented", tone: "ok", status: "Rented" },
        { t: "Skoda Octavia · SK20 OCT", d: "Unassigned · listed 4 days · 3 applications", v: "Idle", tone: "warn", status: "Idle" },
        { t: "Ford Galaxy · LG21 GXY", d: "In for service · back Thu 18 Sep", v: "Service", tone: "muted", status: "Service" },
      ],
      foot: "Every vehicle, its driver, its rate and its status, in one view.",
    },
    {
      id: "approvals",
      label: "Approvals",
      searchLabel: "Search applicants",
      icon: "UserCheck",
      headline: { label: "Applications waiting for you", value: 3 },
      kpis: [
        { label: "Vetted", value: "3 of 3" },
        { label: "Insurance chosen", value: "3 of 3" },
      ],
      rows: [
        { t: "Ravi K. · Skoda Octavia", d: "DVLA, identity and affordability passed · comprehensive cover selected", v: "Review", tone: "link", status: "Vetted" },
        { t: "Elif K. · Skoda Octavia", d: "Checked · comprehensive cover selected", v: "Review", tone: "link", status: "Vetted" },
        { t: "Tunde A. · Kia Niro EV", d: "Vetted · waiting on your decision since Tue", v: "Review", tone: "link", status: "Vetted" },
      ],
      foot: "Approve or decline from one queue, with the checks and the insurance choice already attached.",
    },
    {
      id: "history",
      label: "Rental history",
      icon: "History",
      searchLabel: "Search history by vehicle or plate",
      headline: { label: "Weeks rented across the fleet this year", value: 612 },
      kpis: [
        { label: "Utilisation", value: "89%" },
        { label: "Average term", value: "14 weeks" },
      ],
      rows: [
        { t: "Toyota Prius · LK22 CAR", d: "34 of 38 weeks rented · 2 drivers", v: "£5,610", tone: "muted", status: "YTD" },
        { t: "Kia Niro EV · KN23 EVE", d: "36 of 38 weeks rented · 1 driver", v: "£6,840", tone: "muted", status: "YTD" },
        { t: "Skoda Octavia · SK20 OCT", d: "29 of 38 weeks rented · 3 drivers", v: "£4,205", tone: "muted", status: "YTD" },
      ],
      foot: "The full rental record of every vehicle: drivers, terms, condition photos and payments.",
    },
    {
      id: "documents",
      label: "Documents",
      icon: "FileText",
      searchLabel: "Search documents by vehicle",
      headline: { label: "Documents needing attention", value: 2 },
      kpis: [
        { label: "In date", value: "94 of 96" },
        { label: "Fleet insurance", value: "On file" },
      ],
      rows: [
        { t: "V5C missing · Kia Niro EV KN23 EVE", d: "Upload the logbook to keep the listing live", v: "Upload", tone: "warn", status: "Missing" },
        { t: "Insurance certificate · Ford Galaxy LG21 GXY", d: "Expired copy on file, replacement needed", v: "Replace", tone: "warn", status: "Out of date" },
        { t: "Fleet insurance certificate", d: "Renews 14 Feb 2027 · shown on your listings", v: "In date", tone: "ok", status: "Valid" },
        { t: "Operator licence", d: "TfL · verified against the register", v: "In date", tone: "ok", status: "Valid" },
        { t: "Hire agreements", d: "21 signed and stored", v: "In date", tone: "ok", status: "Complete" },
      ],
      foot: "Everything in one place, with the two that need you at the top.",
    },
    {
      id: "alerts",
      label: "Expiries and issues",
      icon: "BellRing",
      searchLabel: "Search alerts by vehicle",
      headline: { label: "Items due in the next 30 days", value: 3 },
      kpis: [
        { label: "MOT due", value: "12 days" },
        { label: "Reported issues", value: "1 open" },
      ],
      rows: [
        { t: "MOT · Toyota Prius LK22 CAR", d: "Due 30 Sep · booking arranged", v: "12 days", tone: "warn", status: "Due soon" },
        { t: "PHV licence · Ford Galaxy LG21 GXY", d: "Renewal due 29 Oct", v: "41 days", tone: "muted", status: "Upcoming" },
        { t: "Driver-reported issue · Kia Niro EV", d: "Charging port cover loose · reported Mon by Daniel M.", v: "Open", tone: "warn", status: "Open" },
        { t: "Service · Skoda Octavia SK20 OCT", d: "Due at 92,000 mi · 2,100 mi to go", v: "Soon", tone: "muted", status: "Upcoming" },
      ],
      foot: "MOT, PHV plate, insurance and service dates, plus anything a driver reports, before it becomes a problem.",
    },
    {
      id: "claims",
      label: "Accidents and claims",
      icon: "LifeBuoy",
      headline: { label: "Open claims", value: 1 },
      kpis: [
        { label: "Handled by", value: "Kharo insurance team" },
        { label: "Vehicle off road", value: "0 days lost" },
      ],
      rows: [
        { t: "Tesla Model 3 · attempted theft", d: "Reported 11 Sep · insurer notified · repair booked · driver in a replacement car", v: "In progress", tone: "warn", status: "Open" },
        { t: "Ford Galaxy · windscreen", d: "Settled 2 Aug · no excess to you", v: "Settled", tone: "muted", status: "Settled" },
      ],
      foot: "A dedicated insurance team handles the claim, the repair and the driver's replacement car.",
    },
    {
      id: "payouts",
      label: "Payouts",
      icon: "Landmark",
      headline: { label: "Next payout, 1 Oct", value: 15015, prefix: "£" },
      kpis: [
        { label: "Collected this month", value: "21 of 21" },
        { label: "Account", value: "··3456" },
      ],
      rows: [
        { t: "September", d: "21 rentals collected", v: "£15,015", tone: "ok", status: "Paid" },
        { t: "August", d: "21 rentals collected", v: "£15,015", tone: "ok", status: "Paid" },
        { t: "July", d: "20 rentals collected · 1 late, recovered", v: "£14,300", tone: "ok", status: "Paid" },
      ],
      foot: "Rent is collected from drivers through Kharo and paid to you on schedule.",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "BellRing",
      filters: ["All", "Applications", "Payments", "Faults"],
      headline: { label: "Things that need you today", value: 3 },
      kpis: [
        { label: "Applications waiting", value: "3" },
        { label: "Faults open", value: "1" },
      ],
      rows: [
        { t: "New application for the Skoda Octavia", d: "Ravi K. · checks passed · reply within two days", v: "25 min", tone: "link", status: "Applications" },
        { t: "Rent collected from Amara O.", d: "£165 · paid on time · in Friday's payout", v: "06:00", tone: "ok", status: "Payments" },
        { t: "Warning light reported on SK20 OCT", d: "Garage booked for Thursday 8am · driver told", v: "Yesterday", tone: "warn", status: "Faults" },
        { t: "MOT due in 12 days, LK22 CAR", d: "Book it now so the car stays on the road", v: "2 days", tone: "muted", status: "Faults" },
      ],
      foot: "Applications, payments and faults reach you here first, then by email.",
    },
    {
      id: "chat",
      label: "Chat",
      icon: "MessageSquare",
      searchLabel: "Search conversations",
      headline: { label: "Open conversations", value: 3 },
      kpis: [
        { label: "Kharo desk", value: "Replies in minutes" },
        { label: "Drivers", value: "2 threads" },
      ],
      rows: [
        { t: "Kharo operator desk", d: "Ravi's application is with you. Want the checks in detail?", v: "09:15", tone: "link", status: "Kharo" },
        { t: "Amara O. · LK22 CAR", d: "Thank you, I will drop it at the garage Thursday morning.", v: "Yesterday", tone: "muted", status: "Driver" },
        { t: "Daniel M. · KN23 EVE", d: "Paid. Cheers.", v: "Mon", tone: "muted", status: "Driver" },
      ],
      foot: "One thread per driver and one with Kharo, so nothing lives in a phone you cannot find.",
    },
  ],
};
