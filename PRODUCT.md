# PRODUCT.md

<!-- impeccable:product-schema 1 -->
# Kharo

## Platform
web

## Stack
Create React App (react-scripts 5 via craco), React 19, React Router 7, Tailwind CSS 3.4, Radix/shadcn primitives, framer-motion 11, lucide-react, sonner, react-leaflet. Cabinet Grotesk (display) and Satoshi (body) via Fontshare. Separate FastAPI + Motor (MongoDB) backend in `/backend` (Render) with Resend email. Pre-launch: the marketing site runs on a mock inventory of 218 listings across seven cities and captures interest, not bookings.

## Users
1. **Private hire drivers** (Uber, Bolt, local firms) in London, Birmingham, Manchester, Leeds, Sheffield, Wolverhampton and Liverpool. Mostly on a phone, often between jobs. Many are immigrants with English as a second language. Cash-sensitive: the weekly figure is the decision. Two fears dominate: being road-legal (the right licensing authority and plate for where they drive) and being scammed by an operator who quotes one price and charges another, or supplies a bad car and disappears when it breaks.
2. **Fleet operators and owners** with licensed vehicles standing idle. Time-poor, sceptical of platforms taking a cut, tired of chasing rent and managing drivers. Want cars earning, vetted drivers, rent that arrives, and the paperwork (MOT, plate, insurance, service) off their desk so they can grow the business.
3. **Kharo Ops (admin)** who needs every lead, registration and event visible and exportable, because the site's job before launch is to prove demand to investors.

## Product Purpose
Kharo is the UK marketplace and management layer between private hire drivers and the operators who rent them cars. Kharo owns no cars. The driver's agreement is with the operator; every dealing around it runs through Kharo.

The driver journey, in order: find a car (filter by licensing area, type, weekly budget, seats, mileage) -> see the rental price on its own -> choose hire and reward insurance from a comparison panel (comprehensive, third party fire and theft, third party; monthly, six-monthly or annual) -> apply once (PCO badge, driving licence, where they drive; Kharo checks the badge against the licensing register and the licence with the DVLA, plus identity and a read-only affordability check) -> the operator accepts, accepts with a higher deposit, or declines with a reason -> pay deposit and first week through Kharo, never to a yard -> book a collection slot -> joint inspection at handover (photographs, mileage, damage noted, both keep a copy) -> drive, with Kharo as the single point of contact for aftercare, repairs and accidents (replacement car arranged so they keep earning) -> return inspection, deposit settled against the recorded condition.

The operator journey: register interest -> a consultant calls within one working day -> Kharo verifies the operator licence against the licensing authority and the Companies House record -> the consultant collects vehicle details, photographs, rates, deposits and documents and builds the listings -> vehicles go live when the city opens -> vetted applications arrive with checks and the insurance choice attached -> rent is collected from the driver through Kharo and paid to the operator on schedule -> Kharo tracks documents and expiries, coordinates maintenance, runs claims through a dedicated insurance team, and provides a live vehicle tracking view on the operator console. Non-payment is enforced: Kharo escalates to Uber and Bolt to freeze the driver's account, which is why operators can expect near-complete rent collection.

Success before launch: registrations from both sides, by city. Success after launch: a driver on the road in a car they can afford, an operator with a paying driver in every seat.

## Positioning
"Private hire car rental, done properly." Kharo is the trusted middleman that the market has never had: transparent pricing (the rent shown on its own, priced below Splend and Otto Car for the same car, insurance compared separately so nothing is hidden inside a bigger number), checked operators, a person who answers when something goes wrong, and a payment record that follows the driver from one operator to the next. For operators: cars filled with vetted drivers, rent that actually arrives, and the admin done for them.

Never describe Kharo as a "Managed Marketplace". Use "The Private Hire Marketplace" or "Direct Operator PCO Rentals".

## Operating Context
- Licensing is local. Transport for London licenses PHVs in London (PCO badge). Elsewhere it is the local council: Birmingham, Manchester, Leeds, Sheffield, Liverpool. City of Wolverhampton Council plates are widely used for cross-border work across England and Wales. Every listing carries its licensing authority and drivers filter by it.
- Insurance is hire and reward. There is no public quote API (Quotezone and Compare the Market are comparison sites). Typical private hire premiums run roughly £1,200 to £3,000 a year; paying monthly costs 10 to 15 percent more than annually. Uber publishes the insurers it accepts (including Zego, Inshur, Acorn/Haven, Clegg Gifford, Freeway, Connect, DCL/Nelson/Headway, Walsingham). Kharo's comparison panel is built to connect to broker quotes and is labelled indicative until it does.
- Checks that are real and can be claimed: DVLA licence check, licensing-register check, Companies House check, identity with liveness, read-only Open Banking affordability. Trackers on vehicles.
- Drivers arrive from search, ads, WhatsApp groups and word of mouth, on phones. Operators arrive from outreach and the operator guide.

## Capabilities and Constraints
- Confirmed and live: browse and filter the mock inventory (city, area, licensing authority, make, model, fuel, transmission, body, seats, year, mileage allowance, weekly rent range with a price distribution); vehicle detail with gallery and cost panel; register interest against a listing (`/apply/:id`); driver waitlist (`/register`) and operator interest (`/list-your-fleet`) forms posting to `/driver-interest` and `/interest`; city landing pages with FAQ JSON-LD; compare and saved; help, legal, cookie consent; admin dashboard with funnel; thank-you emails via Resend; analytics via `trackEvent`.
- Not yet built (design the UI ready to connect, never pretend it works): live insurance quotes, payments (Stripe Connect planned), collection-slot booking, inspection screens, live tracking, driver and operator accounts. Accounts were deliberately removed; the site is waitlist-only until launch.
- Resolved decisions: insurance is separate and compared, not bundled (the old "£225 all-in floor" is retired); payments run through Kharo; vetting is described as three checks (DVLA, identity, affordability) plus the licensing-register check; seven cities; Kharo earns a fee from the operator when a rental completes, listing is free, drivers never pay Kharo; response time is one working day.
- Keep every route slug, `data-testid`, form field name and API call intact. Keep British English, plain words, short sentences. Never state a figure that cannot be stood behind. No em dashes anywhere.

## Brand Commitments
Name: Kharo, lowercase wordmark "kharo." with a green full stop. Green #0E3B2C (deep, near-black at a glance; hover #0A2C20), mint #7FD8B0 only on dark surfaces, ink #111312, ground #F3F3F0, white surfaces. Cabinet Grotesk display, Satoshi body. Voice: direct, British, unhyped, "a person on the phone, not a form"; written so a second-language reader gets it first time. Visual register: functional clarity in the manner of Auto Trader and Rightmove, not a brochure. Light theme. Tight radii (4 to 6px controls, 10px cards). No glassmorphism, no glow, no decorative blobs, no floating cards, no badges or pills or icon-in-a-circle (move the information to plain text; numbered step markers are the one exception), no eyebrow labels above headings, no uppercase tracked labels, no stock business imagery.

## Evidence on Hand
- Matched vehicle photography: a catalogue of 36 make/model/colour entries, each with a front, rear and segment interior, generated to match and hosted live on a CDN. Map at `scratchpad/matched_photos.json` (24 models). Five verified real photographs in `frontend/public/images/listings/`. Verified London photography (Regent Street, City skyline) in `frontend/src/lib/images.js`.
- Brochure copy in `scratch_brochures.html` and the campaign pack in `Downloads/ss - kharo/KHARO_Market_Validation_Campaign_Pack` carry the approved voice and the TfL figures (105,607 licensed drivers, 92,895 licensed vehicles, week ending 3 May 2026).
- Absent, must not be fabricated: testimonials, named operators, live counts beyond the mock inventory, review scores, press, partnerships.

## Product Principles
1. Show the number, then explain it. Price, fees and timelines are visible before any commitment.
2. Prove the mechanism. Show the console doing the work rather than describing it.
3. Two audiences, one brand. Driver and operator paths share a visual world and never contradict each other's facts.
4. Phone first for drivers, without cutting anything for desktop operators.
5. Every claim is one the company can stand behind today.

## Accessibility & Inclusion
Many drivers read English as a second language: plain words, generous type, high contrast. Honour `prefers-reduced-motion`. Touch targets at least 44px. Inputs never trigger iOS zoom.
