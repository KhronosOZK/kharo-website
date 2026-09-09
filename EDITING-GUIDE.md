# Editing Kharo

How to change text, colours and layout without breaking anything.

---

## 1. Changing any wording on the site

**Nearly all public copy now lives in one file.**

```
frontend/src/content/site.js
```

Open it, find the section, change the text between the quote marks, save. That is the whole job. The change shows up everywhere that string is used.

The file is split by page:

| Export | Controls |
|---|---|
| `BRAND` | Company name, footer blurb, support email, copyright line |
| `NAV` | Header links, account menu, mobile menu, footer columns, newsletter box |
| `HOME` | Homepage hero, stats, spotlight, collections, marketplace teaser, how it works, operator block |
| `WHY` | Why Kharo page |
| `FOR_DRIVERS` | For drivers page |
| `DRIVER_GUIDE` | Driver walkthrough page |
| `OPERATOR_GUIDE` | Operator walkthrough page |
| `HELP` | FAQ questions and answers |
| `LEGAL` | Legal and privacy sections |
| `MARKETPLACE` | Buy a car pages, including the PCO explainer and buyer checklist |
| `SELL` | Sell your vehicle page |

### Worked example

To change the homepage headline, find this near the top of `HOME`:

```js
hero: {
  eyebrow: "Private hire vehicles, rent or buy",
  heading: "The right car, the full price, up front.",
  sub: "Rent from operators we have checked or buy a licensed vehicle outright...",
  searchCta: "Show me the cars",
```

Change `heading` and save. Done.

### Adding or removing an FAQ

In `HELP.faqs`, add or delete an entry:

```js
{ q: "Your new question?", a: "Your new answer." },
```

The page counts and renders them automatically. Same pattern for `WHY.drivers.points`, `FOR_DRIVERS.benefits.items`, `MARKETPLACE.detail.checklist` and every other list.

### Rules to keep in mind

- Keep the **key names** (`heading`, `sub`, `t`, `d`) exactly as they are. Only change the text after the colon.
- Keep the quote marks and the trailing comma.
- If your text contains an apostrophe, that is fine inside double quotes: `"driver's licence"`.
- `icon:` and `img:` values are references, not text. Leave them unless you are deliberately swapping an image or icon.
- Anything set to `null` in `HOME.operatorCta.card.rows` is a calculated number, so leave it alone.

### The few things not in the content file

| What | Where |
|---|---|
| Search page labels and empty states | `frontend/src/pages/SearchResults.jsx` |
| Vehicle detail page (rentals) | `frontend/src/pages/VehicleDetail.jsx` |
| Registration and application forms | `frontend/src/pages/Register.jsx`, `Apply.jsx` |
| Operator sign-up questions | `frontend/src/pages/OperatorInterest.jsx` (the `STEPS` array at the top) |
| Marketplace form field labels | `frontend/src/components/MarketplaceInterestForm.jsx` |
| Toast and error messages | Inside each page, search for `toast.error` |
| Rental listing descriptions | `backend/seed_data.py` |
| Sale listing descriptions | `backend/marketplace_data.py` |

---

## 2. Changing colours, fonts and spacing

### Brand colours

The palette is written directly into the class names as hex values, for example `bg-[#0B6B4F]`.

| Hex | Used for |
|---|---|
| `#0A130F` / `#12211B` | Dark backgrounds and the footer |
| `#0B6B4F` | Primary green, buttons and links |
| `#095B43` | Green hover state |
| `#5FD3A6` | Mint accent, eyebrows on dark backgrounds |
| `#1A2E25` | Heading and body ink |
| `#4A564F` | Secondary body text |
| `#7A857F` | Muted labels |
| `#F9F8F6` / `#F1EFE9` | Page and panel backgrounds |
| `#C08A2D` | Gold, used for ratings and short-licence badges |

To change a colour site-wide, run a find and replace across `frontend/src`. For example, replacing every `#0B6B4F` with a new green updates all buttons and links at once.

There is also a token block in `frontend/src/index.css` under `:root`. Those tokens drive the shadcn UI primitives (inputs, dropdowns, dialogs). Change `--primary` there if you want the form controls to follow a new colour.

### Fonts

Set in `frontend/src/index.css`:

- Headings use **Cabinet Grotesk** via the `.font-heading` class
- Body uses **Satoshi**

Both load from the Fontshare import on line 1 of that file. To change either, update the `@import` URL and the two font-family rules below it.

### Sizes and spacing

Text sizes are Tailwind arbitrary values like `text-[17px]` or `text-4xl`. Section padding is usually `py-14` or `py-16 sm:py-20`. Card corners are `rounded-[24px]` or `rounded-[26px]`. Changing these in one page only affects that page.

---

## 3. The new marketplace

### What was added

**Pages**

| Route | File | Purpose |
|---|---|---|
| `/marketplace` | `frontend/src/pages/Marketplace.jsx` | Browse vehicles for sale, with filters |
| `/marketplace/:id` | `frontend/src/pages/MarketplaceDetail.jsx` | Full listing, licensing panel, enquiry form |
| `/sell-your-car` | `frontend/src/pages/SellYourCar.jsx` | Seller registration, plus a live demand counter |
| `/buy-a-car` | redirect | Convenience alias for `/marketplace` |

**Supporting files**

- `frontend/src/components/SaleCard.jsx` — the listing card with the PCO countdown badge
- `frontend/src/components/MarketplaceInterestForm.jsx` — captures both buyer and seller interest
- `frontend/src/components/OwnershipCalculator.jsx` — the buy versus rent model
- `frontend/src/lib/phv.js` — date, price and licence-badge helpers
- `frontend/src/lib/seo.js` — page titles, meta tags and structured data
- `backend/marketplace_data.py` — the demo sale inventory
- `backend/tests/test_marketplace.py` — 32 tests for the new endpoints

**API endpoints**

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/marketplace` | List vehicles for sale, filterable |
| `GET` | `/api/marketplace/{id}` | One vehicle, logs a view event |
| `POST` | `/api/marketplace-interest` | Records a buyer or seller registration |
| `GET` | `/api/marketplace-demand` | Public buyer and seller counts |

Filters accepted by `/api/marketplace`: `city`, `vehicle_type`, `fuel`, `seller_type`, `min_price`, `max_price`, `min_pco_months`, `sort`, `q` (free text over make, model and registration) and `ids` (comma separated, used by the saved list).

The detail endpoint also returns `price_context` (how this price compares to similar listings), `typical_weekly_rent` (what an equivalent car rents for in that city) and `similar` (three comparable vehicles).

Sort options: `price_asc`, `price_desc`, `mileage`, `pco`, `newest`. The default ordering puts the longest remaining PCO licence first, since that is what buyers actually shop on.

### How the licensing dates work

The demo inventory is regenerated on every server start, dated relative to today. That means PCO and MOT expiry dates never go stale while you demo the site. The months remaining shown on each card are calculated when the listing is read, not stored.

The badge on each card changes colour with the time left:

- 6 months or more, solid green
- 3 to 5 months, mint
- under 3 months, gold

### The buy versus rent calculator

This sits on every listing page and is the piece that makes the buy side worth visiting. It answers the question a driver with the cash actually asks: how many weeks of rent does this purchase price buy me?

It is deliberately modelled on **cash out**, not economic cost. If you compare depreciation plus running costs against rent, owning wins in the first week on almost any vehicle, which is technically true and useless to somebody deciding whether to hand over five figures. So the break-even only counts money actually spent, and the resale value is shown separately as what you get back at the end.

Every input is editable. The defaults for insurance, servicing, licensing and depreciation are starting points, not claims. Licensing fees differ by authority and change year to year, so the copy says exactly that and tells the reader to check against their own quotes. Fuel and charging are left out on purpose, since they cost the same either way and would only pad both sides.

To change the defaults, edit the `DEFAULTS` object at the top of `frontend/src/components/OwnershipCalculator.jsx`.

### Search engine visibility

`frontend/src/lib/seo.js` handles page titles, descriptions, Open Graph and Twitter tags, canonical URLs and JSON-LD structured data. Call `useSeo({ title, description, image, jsonLd })` from any page.

Three schema helpers are included:

- `vehicleJsonLd(vehicle, url)` — Schema.org `Car` with an `Offer`, used on every sale listing so vehicles can appear as rich results
- `faqJsonLd(items)` — used on the city pages and the marketplace
- `breadcrumbJsonLd(trail)` — used on the listing and city pages

Because this is a single page build, the tags are written on mount and cleaned up on unmount, so structured data from one vehicle never leaks onto the next.

### Measuring demand

This is the part that answers "how many people want to buy and how many want to sell".

Every registration is stored in the `marketplace_interests` collection with an `intent` of `sell`, `buy` or `both`. A `both` registration counts on each side.

You can see the split in three places:

1. **Admin dashboard** at `/admin`. A "Marketplace demand" panel shows buyers, sellers, live listings and listing views, plus a breakdown by city. There is also a `marketplace_interests` tab with the full table and a CSV export button.
2. **Sell your vehicle page**, where the counters are shown publicly to encourage sellers.
3. **Marketplace hero**, which shows the running total once anyone has registered.

Every registration also writes a row to `leads` with a source of `marketplace_buy` or `marketplace_sell`, so it appears in your existing lead source chart.

### Adding or changing demo listings

Open `backend/marketplace_data.py`. The `_CITY_PLAN` list at the bottom controls how many vehicles each city gets:

```python
_CITY_PLAN = [
    ("London", "L", 26, 1),
    ("Birmingham", "B", 6, 101),
    ...
]
```

The numbers are the vehicle count and the starting ID. Increase the count to add more. Photography, pricing and licensing dates are generated from there. Prices come from the `_price` function, which starts at a trade guide value for the body type and adjusts for year, mileage and remaining licence.

Restart the backend to reseed.

---

## 4. Running it locally

```bash
# backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# frontend, in a second terminal
cd frontend
yarn install
yarn start
```

Tests:

```bash
cd backend
pytest tests/test_marketplace.py -v
```

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your environment to include the admin tests, otherwise those three are skipped.

---

## 5. Copy style, for consistency

The rewritten copy follows a house style. Worth keeping to it as you edit.

- **British English.** Licence with a c for the noun. Vetted, not screened.
- **Short sentences.** One idea each.
- **Lead with the gain, not the grievance.** "Every cost shown up front" reads better than "no hidden costs". The reader gets the same information and finishes the sentence in a better mood.
- **Address the reader as "you".** Not "drivers" in the third person.
- **Never state a number you cannot stand behind.** No invented ratings, review counts or testimonials.
- **Respect the audience.** Drivers on this platform run their own businesses. Explain things clearly without talking down.
- **Say what happens next.** Every call to action should tell the reader what they get, not just what to click.

---

## 6. What changed in this pass

**New files**

```
backend/marketplace_data.py            demo sale inventory
backend/tests/test_marketplace.py      20 tests for the new endpoints
frontend/src/content/site.js           all public copy, one file
frontend/src/lib/phv.js                date, price and licence helpers
frontend/src/components/SaleCard.jsx
frontend/src/components/MarketplaceInterestForm.jsx
frontend/src/pages/Marketplace.jsx
frontend/src/pages/MarketplaceDetail.jsx
frontend/src/pages/SellYourCar.jsx
EDITING-GUIDE.md                       this file
```

**Edited**

```
backend/server.py        4 marketplace endpoints, admin analytics, startup seeding
frontend/src/App.js      routes for /marketplace, /marketplace/:id, /sell-your-car
Header.jsx, Footer.jsx   nav and footer now read from content/site.js
Home.jsx                 copy from content file, plus a marketplace teaser section
WhyCaro, ForDrivers, DriverGuide, OperatorGuide, Help, Legal, CityPage
                         all copy moved to content/site.js and rewritten
Admin.jsx                marketplace demand panel and marketplace_interests tab
```

Nothing was deleted from your existing rental flow. The marketplace sits alongside it.

## 7. Second pass, bringing the marketplace up to the rental side

The first version of the marketplace worked but sat below the standard of the rest of the site. This pass closed the gap.

**Parity with the rental side**

- Save to shortlist on every sale card and listing page, kept in its own store so it cannot corrupt the rental saved list
- The Saved page now has rent and buy tabs
- Share, with the native share sheet on mobile and clipboard fallback on desktop
- Photo gallery with arrows, a counter and left and right arrow key support
- Breadcrumbs, on the page and in structured data
- A sticky price and enquire bar on mobile, since the enquiry panel sits far down the page on a phone
- Keyboard focus and ARIA labels on cards, gallery controls and the saved counter

**New capability**

- Buy versus rent calculator on every listing
- Free text search over make, model and registration
- Clearable filter chips, so it is obvious why a result set is small
- Price context, showing how a listing compares to similar vehicles
- Three similar vehicles at the foot of each listing
- Full SEO and structured data

**Corrections made during this pass**

- The seed generator used a stride that shared a factor with the catalogue length, so it only ever reached a third of the models and produced no Prius at all. Fixed to a coprime stride, taking the inventory from 10 models to 24.
- Pricing used a flat body-type base, which valued a Model 3 and a Prius identically. A marque multiplier now positions them properly.
- The break-even calculation was first written against economic cost and returned week 1 on almost every vehicle. Rewritten to the cash model described above.
- The browse page fired two requests on mount. Guarded.

## 8. Third pass, critical design and copy review

This pass audited the whole site against the question "does this read as made, or as generated", then fixed what it found.

**Copy**

- ForDrivers and DriverGuide were telling the same story with the same words. Two step headings were identical (`Have a proper look`, `Sort your insurance once`) and so was the section heading. Anyone clicking "see the full guide" landed on what looked like the page they had just left. ForDrivers now frames the journey by what the driver gets at each stage; DriverGuide keeps the detailed walkthrough. No heading appears twice on the site any more.
- `checked`, `vetted` and `verified` appeared 20 times, and only one of those said what the check actually is. The specific fact, Companies House and the licensing register, now does the work in the prominent places and the vague repetitions are gone. Down to 11 uses.
- Four closing sections opened with the word "Ready". Now none do.
- `proper` was a writing tic, six times over. Down to three, all natural usage.
- Two benefit cards on different pages carried the same heading one word apart.

**Engineering**

- `duration-[600ms]` is ambiguous in Tailwind and the build warned on it. Now `duration-700`.
- `useSeo` had a complex expression in its dependency array. The serialised value is now computed once above the effect.
- The marketplace budget label was templated in two places. Extracted.
- Rental cards were not keyboard reachable while sale cards were, an inconsistency introduced when the marketplace was added. Both now have `role`, `tabIndex`, Enter and Space handling, a focus ring and an aria-label.

**Verified with a real production build.** Dependencies were installed and `craco build` run for the first time in this project's history here. It compiles, and the only remaining warning is a pre-existing one in `Admin.jsx` about a `useMemo` dependency, left alone deliberately.

**A false positive worth recording.** The compiled CSS selector for `lg:grid-cols-[1.55fr,1fr]` contains an escaped comma, which looks like invalid `grid-template-columns` output. Checking the actual declaration showed Tailwind converts it correctly to `1.55fr 1fr`. Comma and underscore separators both work here. Nothing needed fixing.

## 9. Preview inventory, and going live

### What changed and why

The rental listings are demo data. Presenting them as bookable would be a bad trade: PCO drivers in London are densely networked, word that Kharo advertises cars that do not exist would travel fast and stick, and trust is the product. It is also legally exposed. Advertising vehicles you do not have is a misleading action under the Consumer Protection from Unfair Trading Regulations 2008 and is close to textbook bait advertising under the CAP Code. Collecting licence and driving history for an application that was never going to complete is also hard to justify under UK GDPR, because the stated purpose is fictional. Get a solicitor to confirm before launch.

So the listings stay, and the framing changed instead.

- `PreviewNotice` appears on Home, Search, City pages, the vehicle detail page and the apply flow. Copy lives in `PREVIEW` in `content/site.js`.
- Calls to action changed from "Apply to rent" to "This is the car I want". You still capture intent against a specific listing ID, price and area, so the demand data is just as granular. You simply never claim the car is available.
- Fabricated operator ratings and rental counts are gone from the whole UI. They violated the no-invented-stats rule and were the most obviously fake thing on the site. Listing order now sorts by weekly rent, which is what a driver comparing options actually cares about.
- PCO badge number and expiry were already captured in both Register and Apply. That field is your best filter: a working driver has it in their pocket, a tyre-kicker will not bother. Measure completion rate on it, not raw registration count.

### Turning the preview off at launch

1. Remove `<PreviewNotice />` from Home, SearchResults, CityPage, VehicleDetail and Apply.
2. Change `PREVIEW.ctaPrimary` back to booking language in `content/site.js`.
3. Replace the seeded listings with real operator stock.

### Security fixes made in this pass

- **CORS failed open.** `CORS_ORIGINS` defaulted to `*` while `allow_credentials` was true. An unset env var silently exposed the API to any website. It now defaults to localhost only, so production must set the variable explicitly.
- **No rate limiting on public writes.** Every form was unthrottled, which meant one script could flood your demand data and destroy the only signal this launch exists to collect. Twelve public endpoints now have per-IP fixed-window limits (interest forms 10/hour, login 20/hour, password reset 5/hour, analytics 400/hour). In-memory by design, so it resets on deploy and is not shared across workers. **Move it to Redis before you run more than one process**, or the limit multiplies by worker count.

### Still to do before you go live

These are yours to action, not code changes.

- **Privacy policy and GDPR basis.** The Legal page is a plain English summary, not a policy. You need a real one naming your data controller, retention periods and lawful basis. You are collecting licence numbers, which is personal data.
- **ICO registration.** As a UK data controller processing personal data you almost certainly need to register with the ICO. It is inexpensive.
- **Cookie consent.** If you add analytics beyond the built-in event tracking, you need a consent banner.
- **A real email sender.** Check `emailer.py` is configured with a live provider and a verified sending domain, with SPF and DKIM set up, or your notifications will land in spam.
- **Secrets.** Generate a long random `JWT_SECRET` and a strong `ADMIN_PASSWORD`. Never commit either.

### Deploying

The app is a React static build plus a FastAPI service plus MongoDB.

**Database.** MongoDB Atlas has a free tier that is more than enough for a pre-launch site. Create a cluster, add a database user, allow access from your backend's IP, and take the connection string.

**Backend.** Render, Railway and Fly.io all work. Point them at the `backend` folder, use `uvicorn server:app --host 0.0.0.0 --port $PORT` as the start command, and set these environment variables:

```
MONGO_URL=<your Atlas connection string>
DB_NAME=kharo
JWT_SECRET=<long random string>
ADMIN_EMAIL=<your email>
ADMIN_PASSWORD=<strong password>
CORS_ORIGINS=https://yourdomain.com
```

**Frontend.** Vercel, Netlify or Cloudflare Pages. Build command `npx craco build`, output directory `build`, and one environment variable:

```
REACT_APP_BACKEND_URL=https://your-backend-url
```

Note the frontend depends on `@emergentbase/visual-edits`, hosted on the Emergent platform. If your deploy host cannot reach it, `craco.config.js` already handles the missing module gracefully, so you can remove it from `package.json` and the build still works.

**Order.** Database first, then backend, then set `CORS_ORIGINS` to your real frontend domain, then deploy the frontend. Check `/api/marketplace` returns data before wiring the frontend up.

## 10. Mobile pass

Audited every layout for phone behaviour and fixed what would have broken.

**Fixed**

- **The buy/sell toggle was unusable on a phone.** Three columns carrying labels like "I want to sell a vehicle" left about 94px per button on a 380px screen, so every label wrapped to four lines and the boxes came out uneven. It now asks "Are you buying or selling?" above three short answers: Selling, Buying, Both. Better copy as well as a better fit. This sits on the sell page and the marketplace buyer alert, both primary conversion surfaces.
- **Horizontal scroll on three pages.** ForgotPassword, RequestCar and ResetPassword each have a 560px decorative blur positioned past the left or right edge, inside a wrapper with no clipping. On any phone that pushed the page sideways. The wrappers now clip, and `html { overflow-x: clip }` in `index.css` is a global backstop. `clip` rather than `hidden` deliberately, because `hidden` creates a scroll container and silently breaks every `position: sticky` element on the site.
- **The calculator's four horizon buttons** across a phone left "6 months" about 70px. Now two by two on mobile, four across from `sm` up.
- **Comparison bar rows** put a long label and a price on one `justify-between` row with no wrap. They now wrap, and the figure stays on one line.
- **Tap targets.** The intent toggle, horizon buttons, filter chips, clear-all and calculator reset were all between 28px and 36px tall. Now 40px to 44px.
- **Oversized mobile headlines.** The marketplace and sell heroes opened at `text-4xl` on a phone while the homepage hero used `text-[30px]`. Aligned.

**Checked and already fine**

The compare table has an `overflow-x-auto` wrapper. The photo thumbnail strip scrolls horizontally by design. Every content grid outside the ones above collapses to a single column. The mobile sticky enquire bar has matching `pb-28` clearance on the page below it.

**Still unverified.** None of this has been seen rendered. It is reasoned from the compiled CSS and layout maths, which catches structural breakage but not how it actually looks.

## 11. Functional audit

Two automated checks were run across the whole app, then every flow was exercised end to end against a live in-memory database.

### The significant finding

**Six pages had been built and linked but never routed.** `Login`, `OperatorLogin`, `ForgotPassword`, `ResetPassword`, `DriverPortal` and `OperatorDashboard` all existed as components, and nine links across the app pointed at them, but none had a `<Route>` in `App.js`. Every one of those links fell through to the catch-all and silently redirected to the homepage.

The worst consequence was that **password reset was broken end to end**. The backend emails a link to `/reset-password?token=...`, that path resolved to nothing, and anyone clicking it landed on the homepage with no way to set a new password and no error explaining why. All six routes are now registered, and `ResetPassword` already reads the token from the query string, so the flow works as designed.

### Checks now in place

- **API contract check.** All 33 `api.*` calls in the frontend resolve to one of the 26 backend routes.
- **Navigation check.** All 62 in-app navigation targets resolve to one of the 28 declared routes.

Both are worth re-running after adding a page. They catch the exact class of bug above, which is invisible in review because nothing errors, it just quietly goes to the wrong place.

### Flows verified end to end

Register, login, duplicate registration rejected, wrong password rejected, `auth/me` with a valid token, `auth/me` rejecting a forged token, forgot-password for both known and unknown emails without leaking which is which. Listings, vehicle detail, vehicle 404, insurance quote, application submission. Driver, operator and city interest forms. Analytics events. Marketplace browse, detail, interest capture and demand counters. Admin login, summary, analytics including the marketplace block, the interests tab, CSV export, and rejection of an unknown collection name. Admin endpoints correctly refuse both anonymous requests and ordinary logged-in users.

Two apparent failures during this audit turned out to be wrong test payloads rather than bugs: `/applications` takes `full_name` not `name`, which is what the frontend already sends, and the admin account is seeded on startup rather than existing by default.

## 12. Keeping visitors on the platform

Every link that sent someone away from the site has been removed or gated.

**Quotezone is gone entirely.** It appeared in four places in the copy, in an outbound link inside the application flow, and as a `quotezone_url` field in the backend quote response. The insurance step still works exactly as before, it is simply described as something Kharo arranges rather than a third party the reader is invited to go and research. The worst instance was the outbound link, which sat directly beside the price summary at the point of highest intent and opened a competitor's comparison site in a new tab.

Copy now refers to "specialist private hire insurers" and "our specialist insurance partners". Change that wording in `content/site.js` if you sign a named partner and want to credit them.

**Footer social icons no longer leave the site for nothing.** They pointed at bare `instagram.com`, `facebook.com` and `linkedin.com`, which is worse than having no icons at all: a visitor clicks, lands on a generic homepage, and has left your site for no reason. They now read from `BRAND.social` in `content/site.js` and stay hidden while those values are empty. Fill in your real profile URLs and the icons appear.

The only remaining outbound links anywhere in the app are the two `mailto:` addresses on the Help and Legal pages, which are intentional.
