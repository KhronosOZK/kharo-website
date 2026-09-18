<!-- impeccable:product-schema 1 -->
# Kharo

## Platform
web

## Stack
Existing codebase: Create React App (react-scripts 5 via craco), React 19, React Router 7, Tailwind CSS 3.4, Radix/shadcn primitives, framer-motion 11, lucide-react, sonner, react-leaflet. Fonts: Cabinet Grotesk (display) and Satoshi (body) via Fontshare. Backend is a separate FastAPI service (`/backend`); the marketing site runs on mock inventory pre-launch.

## Users
1. **Private-hire drivers** (Uber, Bolt and local firms) in London, Birmingham, Manchester, Leeds and Sheffield who need a PCO/PHV-licensed car to earn. Mostly on a phone, often between jobs, price-sensitive, wary of hidden fees and of being tracked. They want a car fast, a price they can trust, and someone who picks up the phone when something goes wrong.
2. **Fleet operators / rental companies** with idle licensed vehicles. Desktop and phone. They want cars filled with drivers who will actually pay, rent that arrives on time, and paperwork (MOT, PCO plate, insurance, tax, service) they do not have to chase.

## Product Purpose
Kharo is a UK marketplace and management layer for private-hire vehicle rentals. Drivers browse checked operators' cars with the weekly rental price shown up front, register interest, get vetted once, and are matched to a car. Operators list idle fleet, receive pre-vetted applications, and manage the whole rental (payments, documents, maintenance, claims) from one dashboard. Pre-launch: inventory is representative and captured as interest, not bookings. Success is a driver on the road with a car they can afford, and an operator with a paying driver in every seat.

## Positioning
Kharo does the work around the car, not just the listing. For drivers: by the time they collect the keys Kharo has put them live on Uber and Bolt (and any other platform they drive for), so they can start earning the same day, and every payment, invoice, hire agreement, insurance and vehicle document lives in one account (and soon an app). For operators: Kharo manages the fleet end to end, with every vehicle's rental history, driver approvals, documents, and alerts for expiring MOT, PCO plate, insurance and service, plus a dedicated insurance team for accidents and claims. If a driver has an accident, Kharo gets them into a replacement car and back on the road; the operator's claim is handled by Kharo's insurance team.

## Operating Context
- TfL (London) and local-council PHV licensing; DVLA licence checks; Companies House operator checks; Open Banking affordability; liveness identity checks; Thatcham S5 trackers; Variable Recurring Payments.
- Driver dashboard (`/driver-portal`) and operator dashboard (`/operator-dashboard`) exist as authenticated routes; marketing pages should show a faithful, interactive snapshot of them.
- Drivers arrive from search, ads and WhatsApp on phones; operators arrive from outreach and the operator guide.

## Capabilities and Constraints
- Confirmed: browse and filter mock listings by city, area, make, fuel, budget; register interest against a listing; driver and operator interest forms (POST /interest, /leads); saved vehicles; city landing pages with FAQ JSON-LD; help, legal, cookie consent; login/register/password reset; analytics events via `trackEvent`.
- Constraint: keep every route slug, `data-testid`, form field name and API call intact. Keep British English, plain words, short sentences, and never state a figure that cannot be stood behind.
- **Undecided (codebase contradicts itself; owner to confirm):** whether insurance is included in the weekly figure or quoted separately; whether payments run through Kharo or directly to operators; whether vetting is described as three or four layers; the live city count (four vs five); whether Kharo takes a 10% operator fee or "no commission"; minimum driver age (21 vs 25); typical response times (24h vs 1 working day vs 48h).

## Brand Commitments
Name: Kharo, lowercase wordmark "kharo." with a green full stop. Brand green #0B6B4F, mint #5FD3A6, gold #C08A2D for operator/earnings accents. Cabinet Grotesk display, Satoshi body. Voice: direct, British, unhyped, "a person on the phone, not a form". The owner wants a premium, intentional look with glassmorphic surfaces where they carry meaning, and no trace of template or AI-generated design.

## Evidence on Hand
- Real listing photography in `frontend/public/images/listings/` (toyota-prius.jpg, vw-passat-gte.jpg and others) plus Pexels/Unsplash URLs in `frontend/src/lib/images.js`.
- Dashboard concept screens in `scratch_dashboard_previews.html` (illustrative data, real design tokens).
- Brochure and social copy drafts in `scratch_brochures.html`, `scratch_social_posts.html`.
- Absent, must not be fabricated: customer testimonials, named operators, live vehicle counts, review scores, press.

## Product Principles
1. Show the number, then explain it. Price, fees and timelines are visible before any commitment.
2. Prove the mechanism. Show the dashboard doing the work rather than describing it.
3. Two audiences, one brand. Driver and operator paths share a visual world and never contradict each other's facts.
4. Phone first for drivers, without cutting anything for desktop operators.
5. Every claim is one the company can stand behind today.

## Accessibility & Inclusion
Many drivers read English as a second language: plain words, generous type, high contrast. Honour `prefers-reduced-motion`. Touch targets at least 44px. Inputs never trigger iOS zoom.
