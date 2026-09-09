# Caro — PRD & Build Log

## Original problem statement
Private hire minicab (PHV) rental marketplace for London Uber drivers. Caro is the trusted middleman between drivers (who find & rent vehicles) and rental companies (who list vehicles). Phase-0 validation goal: a professional, trustworthy functional website with fake vehicle listings for market validation, driver registration + applications, operator interest capture for launch, driver & operator guide pages, a mock insurance "quote zone", anonymous operator identities (only shown after approval), and MAXIMUM user-data capture (emails, phones, contact details) for post-launch outreach.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). JWT auth (httpOnly cookie `access_token` + Bearer fallback), roles: driver / operator / admin.
- **Frontend**: React 19 + Tailwind + shadcn/ui + framer-motion + sonner. React Router.
- **Design**: "caro." warm off-white/emerald premium aesthetic (Cabinet Grotesk + Satoshi), mobile-first, AutoTrader/Airbnb trust feel.

## User personas
1. **Driver (London Uber/PHV driver)** — needs to find, compare and apply for a rental car with transparent all-in weekly cost.
2. **Rental company / operator** — wants vetted drivers & operational tooling; registers interest pre-launch.
3. **Caro Ops (admin)** — needs to see & export every captured lead for outreach.

## Implemented (2026-06 / iteration 14 — humanised design pass)
- Removed the "Get a real quote via Quotezone" box and the "A trusted operator in {borough}" panel from the car listing; folded the operator reply-time into the trust row and kept a plain "Insurance sorted before you drive away" line.
- Made the site feel less AI-templated: de-capitalised the repeated uppercase letter-spaced eyebrow labels across all public pages (Home, City, ForDrivers, DriverGuide, OperatorGuide, WhyKaro, Register, Operator, RequestCar) so kickers read in sentence case, and softened the heavy flat dark-green hero overlays into lighter photographic gradients + a subtle bottom vignette.
- Self-verified: clean compile, Quotezone link removed (data-testid gone), listing and home render correctly.

## Implemented (2026-06 / iteration 13 — interest-only pivot, compare-from-search, price parity, copy cleanup)
- **Removed all driver/operator login & dashboards.** "Register" (drivers) and "List your fleet" (operators) are now interest-capture wizards that persist to MongoDB (`driver_interests`, `interests`, `leads`) and end on a "you're on the launch list" thank-you. New endpoint `POST /api/driver-interest`; `POST /api/interest` now also captures `vehicle_types` and no longer creates an account. Routes `/login`, `/operator-login`, `/portal`, `/operator-dashboard`, `/forgot-password`, `/reset-password` removed (catch-all redirects home). Header/Footer show interest CTAs only.
- **Compare from search**: Compare checkbox on every card, a floating compare bar on search, and a `/compare` page (shared `CompareTable`) showing all-in weekly cost side by side with the cheapest highlighted.
- **Price parity**: vehicle detail defaults to the base weekly rent, so search, compare and the car page all show the same headline figure. Seed rents nudged ~5% below market to stay attractive.
- **Copy + layout**: trimmed hero text across Home/ForDrivers/WhyKaro/DriverGuide/Register/Operator, removed every em dash, lifted the Home search card above the fold, and gave the interest forms a cleaner segmented progress + softer inputs.
- **City SEO**: each city page has a unique intro paragraph + 3-question FAQ.
- Verified by testing agent (iteration 12): backend 100% (20/20), frontend 100%, no functional defects; console-noise and cosmetic nits then fixed.

## Implemented (2026-06 / iteration 12 — colour variants, city pages, save & compare, tracking badge)
- **More colours**: added Red & Green variants for popular models (Prius, Corolla, Tesla Model 3, Kia Niro, Hyundai Ioniq) with matched front+rear AI photos; London colour spread now White/Silver/Grey/Black/Red/Blue/Green. Still 180 listings.
- **City landing pages** (`CityPage.jsx`, route `/city/:name`): per-city hero with a real AI skyline, live stats (car count, vetted operators, areas, from-price), a 9-car preview grid and cross-links. Unknown cities redirect home. Added a "Browse by city" tile section on Home. Sheffield now a live city.
- **Save & Compare** (`Saved.jsx`): shortlist via hearts, then a side-by-side compare table (rent, indicative insurance via /api/quote, breakdown, all-in/week, deposit, fuel, seats, mileage, area, rating) with the cheapest all-in highlighted, plus per-car Apply/remove.
- **Operator dashboard**: added a clear amber badge on the live map — "Preview · live GPS tracking goes live at launch".
- Verified via testing agent (iteration 11): 100% of the 5 flows pass, no critical issues; applied review fixes (unknown-city redirect, no "0 cars" flash, hardened compare quote effect).

## Implemented (2026-06 / iteration 11 — inventory rebuild with matched photography)
- Rebuilt the entire seed inventory (backend/seed_data.py) to **180 listings**: 100 London + 20 each in Birmingham, Manchester, Leeds and **Sheffield** (new live city). LIVE_CITIES/POPULAR_CITIES updated (Sheffield swapped in for Glasgow); "4 cities" copy → "5 cities" on Home + ForDrivers.
- Every listing now uses **AI-generated photography that matches its exact make/model/colour** — a front shot, a rear shot and a segment-correct interior (3 photos each). Fixes the long-standing complaint that photos didn't match the car or its price. 30 model/colour exteriors + 30 rear angles + 5 interiors generated (Gemini Nano Banana), hosted on Emergent static CDN.
- Realistic London PCO model mix, weighted so Prius/Corolla/hybrids/EVs dominate, interleaved so adjacent cards vary. Rent-only (pre-insurance) weekly pricing kept market-accurate (£130–£290) with per-year + jitter variance. UK-format plates, realistic mileage by year.
- Verified via API (per-city counts, photo URL mapping per model/colour/type) and screenshots (London search grid, Prius detail gallery front/rear/interior).

## Implemented (2026-08 / iteration 10 — For Drivers page, nav, slider, consistency)
- Fixed the homepage/search budget slider so BOTH range thumbs render (shadcn slider.jsx now maps a Thumb per value; previously only one showed).
- Top nav: "For operators" now opens the Operator Guide (/operator-guide); added a new "For drivers" link. Nav testids made unique (nav-for-drivers, nav-for-operators).
- Built a new **For Drivers page** (/for-drivers, ForDrivers.jsx) using PRD + market research: hero, trust strip, 6 benefit cards (one honest weekly figure, hire-and-reward insurance via Quotezone, vetted operators, GPS-tracked rentals, cover built in, 4 cities), take-home teaser, 4-step how-it-works linking to the full guide, a "what you'll need" requirements checklist, and CTAs. Matches the site's light design system.
- Live-location tracking is now explicitly surfaced as a feature ("Every rental is GPS-tracked" on For Drivers; retained on operator pages) per user request.
- Listings remain 60 realistic demo cars with rent-only (pre-insurance) pricing benchmarked to Splend/Otto/Gumtree/Facebook Marketplace (£120–£280/wk).
- Consistency pass: standardised the stray body-text grey #4A5D54 → #4A564F across DriverPortal, OperatorDashboard, ForgotPassword, ResetPassword.


## Implemented (2026-08 / iteration 9 — rebrand to "Kharo" + full design/copy review)
- Renamed the platform Caro → **Kharo** everywhere in user-facing text and the wordmark ("kharo."), plus backend email sender name and API title. Kept internal identifiers (WhyCaro component/route, CSS vars, shadcn Carousel) to avoid breakage.
- Actioned the full 24-item aesthetics/design/copy review:
  - Removed fabricated stats ("1,240+ drivers", "4.7 rating") → honest metrics (real car count, 4 cities, product claims). Removed the "+37" operator-count inflation; purged demo interest rows and added a durable /api/stats filter that excludes test/abc/abv/demo rows so test pollution never leaks into user-visible copy (operators now honestly reads 0 pre-launch → "Be one of the first operators to join Kharo").
  - Corrected copy that overpromised unbuilt features: digital signing → "agree the rental terms"; photo handover framed "at launch"; DriverGuide insurance step reworded to the Quotezone-referral reality; "report from your account" softened.
  - Removed internal fields from public views: number plate off VehicleDetail; operator_code off Apply review/success.
  - Standardised brand green to #0B6B4F sitewide (replaced #10B981/#047857). Footer social links are now real icon anchors (Instagram/Facebook/LinkedIn) with testids, not plain text. Footer nav "Search cars" (matches header). Newsletter success adds expectation copy.
  - "360" section renamed "More angles"; reviews now show an honest empty-state instead of fake reviews; insurance labelled "(indicative)" with the Quotezone referral link.
  - Domain standardised to kharo.uk (hello@kharo.uk, privacy@kharo.uk; backend CONTACT/ALERT emails). Help copy "one working day", operator button "List your fleet". Removed the operator-dashboard "Preview" button (was showing mock data). Earnings fleet rows labelled "hybrid saloons". Register password sub + "Nothing to pay before you're approved". iOS safe-area padding on the mobile sticky bar. Single primary CTA on DriverGuide.
- Verified via testing agent (iteration 9): 100% frontend pass across rebrand, honest stats, budget-from-£0, per-city listings, vehicle detail, apply flow, footer, help/legal, Quotezone links, brand green.
- Admin credentials unchanged (internal ops account): admin@caro.co.uk / CaroAdmin2026!.


## Implemented (2026-06 / iteration 9 — expanded inventory + Quotezone referral)
- Expanded seed inventory to 60 listings: 48 in London (across 24 boroughs) + 12 across Birmingham, Manchester and Leeds. Data generated in seed_data.py from realistic model/borough/operator templates; each gets royalty-free Unsplash/Pexels photos (commercially safe) grouped by vehicle look.
- Re-benchmarked weekly rents DOWN to rent-only market levels (Prius £175, Corolla £165, budget Insignia £120, EVs £175–£265, executive £225–£265) after research (Splend/Otto/G&M; insurance is a separate line in Caro). Updated the original 12 flagship listings too.
- Seeding now UPSERTS by id on startup (was insert-only-if-empty), so inventory/price changes apply on restart.
- Budget slider now starts at £0 (was £180) on both Home and Search.
- Multi-city search live: Birmingham/Manchester/Leeds added to LIVE_CITIES so they show inventory instead of the "request your city" form.
- Quotezone: NO public API exists (Seopa is comparison/affiliate only). Implemented BOTH per user choice — kept the in-app indicative estimate (now labelled "indicative") AND added a "Get a real quote via Quotezone" referral link on VehicleDetail + Apply. URL is env-configurable via backend QUOTEZONE_URL (default https://www.quotezone.co.uk/taxi-insurance) so an affiliate/partner link can be dropped in later.
- Verified via curl (60 listings, per-city counts, quote returns indicative+quotezone_url) and screenshots (Birmingham search, vehicle detail Quotezone link, £0 budget).


## Implemented (2026-06 / iteration 8 — Uber-style registration wizards + light auth theme)
- Rebuilt driver (/register, 6 steps) and operator (/list-your-fleet, 9 steps) registration into an Uber-style one-question-per-screen wizard: single logical field group per step, progress bar + "Step X of Y" label, Back arrow, Continue/submit, framer-motion slide transitions, per-step validation (canNext). All original data-testids preserved.
- Restyled all four auth pages (Login, Register, OperatorLogin, OperatorInterest) from the dark "cinematic" theme to the app's LIGHT aesthetic (off-white #F9F8F6 bg, ink #1A2E25 headings, emerald #0B6B4F accents, white cards ring-1 ring-slate-200/70) to match Search/Why Caro/How it works. Estimators (driver take-home, operator earnings) restyled to light and still reactive.
- Fixed Admin.jsx compile error (triplicated columns/filtered declarations left from prior fork) and duplicate React key warnings (row keys now include tab+index). Driver Login now redirects role==='admin' to /admin.
- Verified via testing agent (iteration 8): both wizards advance/submit end-to-end (100%), all auth pages confirmed light-themed, login flows work.


## Implemented (2026-06 / iteration 7 — tablet responsiveness + legibility)
- Fixed tablet layouts: driver/operator LOGIN left panels now visible + centered (were hidden/awkward); driver/operator REGISTRATION interactive widgets (take-home / earnings estimator) centered on tablet.
- Driver dashboard tablet grid fixed: was cramped 4-column (md:grid-cols-4), now stacks full-width below lg.
- Text-over-image legibility: added text-shadow to /driver-guide and /portal hero headings; vehicle-card borough labels already glass-pilled.
- Removed the rental cost calculator page + all links (header, footer, why-caro, driver portal); added catch-all route redirecting unknown URLs to home.
- Vehicle gallery rebuilt: functional main image + prev/next + thumbnail filmstrip (previously the main image never changed and the mosaic was irregular).
- "How it works" (/driver-guide) now alternates dark-green (#0E1A14) and light bands.
- Verified via testing agent (iteration 7): all tablet fixes pass, no issues.

## Implemented (2026-06 / iteration 6 — go-live plumbing: auth recovery, email scaffold, demand capture)
- Rebuilt driver & operator LOGIN pages on the cinematic canvas to match registration; added "Forgot password?" links.
- Password reset flow: POST /auth/forgot-password (no user enumeration) + /auth/reset-password (1h single-use token, TTL-indexed, bcrypt). Frontend /forgot-password + /reset-password pages. Verified e2e + 7 pytest cases.
- Email scaffold (backend/emailer.py, Emergent Resend): welcome email per role on signup (editable per-role document links), founder alert on every signup/interest/car-request. DEFENSIVE: no-ops silently until EMERGENT_EMAIL_KEY is provisioned; all copy/links/sender/reply-to/alert address are .env-editable (EMAIL_FROM_NAME, CONTACT_EMAIL, ALERT_EMAIL, DRIVER_DOC_URL, OPERATOR_DOC_URL, PUBLIC_BASE_URL).
- Demand capture: moved "request a car" off the search page into its own /request-a-car page (behind a button) — captures type/budget/notes, tracked as city_requests + leads for sharing with rental companies. Added budget field to CityInterestIn.
- Footer: removed "Dashboard preview"; earlier added driver/operator logins + launch-updates email capture.
- Tests: 54/54 backend, full frontend E2E green.

### Admin analytics access
URL /admin — admin@caro.co.uk / CaroAdmin2026! (see test_credentials.md).

### TODO before emails go live (needs user)
- Provision EMERGENT_EMAIL_KEY (platform) — until then emails are skipped by design.
- Register caro.uk domain, then set real CONTACT_EMAIL, ALERT_EMAIL, DRIVER_DOC_URL, OPERATOR_DOC_URL in backend/.env.
- Prepare the two welcome documents (driver + operator) and drop their URLs into the *_DOC_URL vars.

## Implemented (2026-06 / iteration 5 — cinematic registration rebuild + dashboards)
- Rebuilt driver & operator registration on a cinematic dark-emerald "canvas": layered ambient glow + grain, oversized editorial headlines, glass estimator modules, floating form cards, micro-interactions.
- Driver take-home widget: full-time only, higher realistic London minicab figures (e.g. hybrid £750/wk take-home from £1,220 fares); car-type selector drives an animated figure.
- Operator registration now CREATES AN ACCOUNT (password added) so operators can log in — verified /operator-login works with credentials created at signup. Added an email-follow-up promise (earnings/onboarding/verification) and a live vehicle-tracking mention.
- Rebuilt DRIVER dashboard as a bento grid with a strong empty state (real applications/documents/saved data). Rebuilt OPERATOR dashboard as a Fleet Command Center led by a LIVE VEHICLE-LOCATION TRACKING map (pins + live list) plus overview/fleet/applications/financials/compliance.
- Fixed text-over-image legibility: vehicle-card borough label is now a glass pill; strengthened operator-login quote scrim.
- Applied code-review fixes: removed hardcoded secrets in tests (read ADMIN_* from backend/.env), fixed array-index React keys, silenced hook-dep warnings, `is`→`==` in tests. AnimatedNumber now forwards data-testid.
- Backend: /api/admin/analytics returns a 14-day `trend`; new investor-ready Admin dashboard with a recharts growth chart. Tests: 47/47 pass.

## Implemented (2026-06 / iteration 4 — conversion polish + go-live pass)
- Removed the "Verified against TfL & Companies House" footer badge (per user request).
- Redesigned driver Register and operator Interest left rails: enticing headlines, 5-star testimonial (driver), per-car earnings teaser (operator), trust bullets, social proof counts.
- Rewrote CTA/hero copy across guides with conversion-led language ("Turn idle cars into steady, vetted income", "Your next car is minutes away").
- Operator earnings brochure (OperatorGuide) reworked into a two-column brochure with a lead "up to £14,586/yr" figure.
- DriverGuide "Ready when you are" CTA now uses a thematic driver photo.
- Mobile fixes: global overflow-x hidden; Home how-it-works image collage stagger only on sm+.
- Cleared the SearchResults useEffect eslint warning.
- Verified end-to-end data capture live: driver signup, operator interest, city-interest, analytics (page views/searches) all writing to DB and reflected in /api/admin/summary (leads 47, drivers 21, interests 10, city_requests 4, page_views 86).

## Implemented (2026-06 / iteration 2 — professional redesign pass)
- Fixed transparent dropdowns (restored shadcn CSS tokens); homepage min–max budget range slider.
- Homepage: Spotlight featured car + Browse-by-collection tiles + immersive layout.
- Header: Turo-style account dropdown (sign up/login as driver, login/register as operator, Why Caro, Calculator, Help, Legal).
- Immersive scroll-storytelling DriverGuide & OperatorGuide (replaced accordions) with imagery + motion.
- Vehicle detail: Airbnb-style photo mosaic, real OpenStreetMap map per borough, 360°/tour badges, feature chips.
- Apply flow restyled with live order-summary sidebar.
- Driver + Operator dashboards upgraded with recharts charts.
- New pages: Why Caro, Help/FAQ, Legal, Cost Calculator, Saved cars.
- Tested: 100% backend (28/28, no regression) + 100% frontend flows.

## Implemented (2026-06 / iteration 1)
- Marketplace homepage: hero + search (borough/type/fuel/budget), filter chips, sort, 12 seeded listings, stats, how-it-works, operator CTA.
- Vehicle detail: photo gallery, full spec, anonymised operator (code only), live cost breakdown panel (rent + mock Quotezone insurance + breakdown = total), sticky mobile panel, reviews.
- Driver auth (register/login/logout/me) + driver portal (demo current rental + real applications list + payments + verification).
- Multi-step apply flow (Personal → Licence → Insurance → Review) → stores application + lead.
- Operator interest / waitlist form → stores interest + lead.
- Driver guide + Operator guide pages (accordion journeys).
- Operator dashboard demo (overview/fleet/applications/financials/compliance).
- Mock insurance quote engine (/api/quote).
- Admin dashboard (/admin): summary KPIs, per-collection tables (leads/applications/interests/users/events), CSV export.
- Data capture: every registration, application, interest, listing view, search & card click logged.
- Tested: 100% backend (28/28 pytest), 100% frontend e2e flows.

## Backlog
- **P1**: Resend confirmation emails on application/interest; saved-cars page; operator real listing-creation flow; vehicle handover photo screens.
- **P1**: Real Quotezone API + Stripe Connect payments (Phase 1 per PRD).
- **P2**: Brute-force lockout on login, forgot/reset password, admin pagination, split server.py into routers.
- **P2**: Reviews system, promoted listings, analytics charts, PCN management (Phase 2).

## Next tasks
- Gather user feedback on the live validation site; wire Resend emails; add saved-cars view.

## Credentials
See /app/memory/test_credentials.md (admin: admin@caro.co.uk / CaroAdmin2026!).
