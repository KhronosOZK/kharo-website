---
version: 1
slug: "frontend-src-pages-home-jsx"
primary_target: "frontend/src/pages/Home.jsx"
related_targets: ["frontend/src/pages/ForDrivers.jsx","frontend/src/pages/DriverGuide.jsx","frontend/src/pages/OperatorGuide.jsx","frontend/src/pages/OperatorInterest.jsx","frontend/src/pages/WhyKharo.jsx","frontend/src/pages/CityPage.jsx"]
---

# Kharo marketing site: surface brief

Scope: the public marketing surface (Home, For drivers, Driver guide, For operators/Operator guide, List your fleet, Why Kharo, City pages) plus the shared shell (Header, Footer, VehicleCard, CookieConsent). Mode: Persuade. Audience: UK private-hire drivers on phones; fleet operators on desktop and phone. Action: drivers register interest in a car; operators request a call back. Proof: the dashboard doing the work, the price breakdown, the insurance choice at Apply. Constraints: keep every route, data-testid, form field and API call; British English; no figure the company cannot stand behind; pre-launch honesty (PreviewNotice everywhere inventory shows).

## Direction contract

THESIS: Kharo does the work around the car. The pages show the product working (a live console, a real weekly price, a real insurance choice) instead of describing it. Refused: centred hero under an uppercase eyebrow, three equal cards, a green "Ready to..." band before a black footer.

OWN-WORLD: near-white ground with a faint warm cast, green-tinted near-black ink, one accent (#0B6B4F), mint only on dark surfaces. Photography carries every hero; frosted glass (white/72, blur, 1px inner highlight, tinted shadow) appears only where a control sits over a photo or over scrolling content. Consoles and cards are solid, in one 16px radius, hairline borders, no cards inside cards. Pills for controls, 12px inputs, 28px reserved for one hero object per viewport. Cabinet Grotesk display on a clamp() scale, Satoshi body, tabular numerals.

STORY: a driver sees a real car and a real weekly price, learns Kharo gets them live on Uber and Bolt before they collect the keys and keeps every payment, document and claim in one account, then registers interest. An operator sees idle cost, sees the console managing approvals, documents, expiries and claims, then asks for a call.

FIRST VIEWPORT (Home): full-bleed photograph of a private-hire car on a London street with a bottom vignette under 40%. Headline left, two lines max, no eyebrow. Glass search panel anchored bottom-left on desktop, full width on mobile. One floating glass card on the right: "Live on Uber and Bolt before you collect the keys." Primary action: Search.

SIGNATURE INTERACTION: the DashboardSnapshot console (driver and operator variants) with a sliding selection indicator, direction-aware panel swaps, numbers that morph rather than restart, and autoplay that stops the moment the visitor touches it.

CROSS-SURFACE REACH: every page keeps at most one audience tag ("For drivers", "For operators") and no other eyebrows; one closer per page that belongs to that page; motion from one token set with reduced-motion honoured; the same shape and shadow system on every surface.

HONEST RISK: photography quality is bounded by the assets already in the repo; glass legibility on busy photos; backdrop-filter cost on low-end phones (cap at two glass layers per viewport).
