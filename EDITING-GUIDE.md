# Editing Kharo

How to change text, colours, photos and layout without breaking anything. `PRODUCT.md` holds what Kharo is and the journeys it promises; `DESIGN.md` holds the visual register. This file is the practical one.

---

## 1. Changing any wording on the site

Nearly all public copy lives in one file:

```
frontend/src/content/site.js
```

Open it, find the section, change the text between the quote marks, save. The change shows up everywhere that string is used.

| Export | Controls |
|---|---|
| `FACTS` | Cities, counts and other figures quoted across the site. Change a number here and every page follows. |
| `BRAND` | Company name, footer blurb, support email, social profile links, copyright line |
| `NAV` | Header links, account menu, mobile menu, footer columns, newsletter box |
| `PREVIEW` | The pre-launch notice shown on listings and forms |
| `HOME` | Homepage sections below the search: driver and operator lists, "What it costs", FAQ, closer |
| `FOR_DRIVERS` | For drivers page |
| `DRIVER_GUIDE` | The driver walkthrough: the steps, money rows, damage section, FAQ |
| `OPERATOR_GUIDE` | The operator walkthrough: what you handle, what Kharo handles, tracking, enforcement, FAQ |
| `OPERATOR_INTEREST` | The list-your-fleet form |
| `WHY` | Why Kharo page |
| `HELP` | Help page questions and answers |
| `LEGAL` | Legal and privacy summary |
| `CITY_PAGE` | City landing pages, including the heading template |
| `APPLY` | Register-interest form: the four steps, including the insurance step (`stepCover`) |

Page-specific copy that did not fit there sits in `frontend/src/content/pages/`: `heroSearch.js` (the homepage search), `marketplace.js` (search results, vehicle cards, compare, saved and the vehicle detail page, exported as `DETAIL`), `applicationFlow.js` (the sample insurance quotes and the walkthrough demo), `operatorEarnings.js` (the idle-car calculator), plus one file per guide page.

### Worked example

To change the vehicle page's insurance heading, open `frontend/src/content/pages/marketplace.js` and find:

```js
coverHeading: "Compare insurance for this car",
```

Change the text, save. Done.

### Adding or removing a step or FAQ

In `DRIVER_GUIDE.steps`, `HELP.faqs` and every other list, add or delete an entry:

```js
{ q: "Your new question?", a: "Your new answer." },
```

The page counts and renders them automatically.

### Rules

- Keep the key names (`heading`, `sub`, `t`, `d`, `q`, `a`) exactly as they are. Only change the text after the colon.
- Keep the quote marks and the trailing comma.
- `img:` values are references, not text. Swap them only for another entry in `frontend/src/lib/images.js`.
- No em dashes, no "Ready to..." closers, no invented figures, no testimonials. The reasons are in `DESIGN.md` under bans.
- Write for a reader whose first language may not be English: short sentences, one idea each, British spelling, "you" not "drivers".

### The few things not in the content files

| What | Where |
|---|---|
| Sample insurance prices shown on the vehicle page and in the application | `APPLICATION_FLOW.quotes` in `frontend/src/content/pages/applicationFlow.js` |
| Rent discount for 4 and 12 week terms | `frontend/src/lib/pricing.js` |
| Operator sign-up questions | `frontend/src/pages/OperatorInterest.jsx` (the `STEPS` array at the top) |
| Toast and error messages | Inside each page, search for `toast.error` |
| Licensing authority names per city | `frontend/src/lib/cities.js` |

---

## 2. Photos and listings

The preview inventory (218 cars) is generated, never hand-edited:

```
cd frontend && python3 scripts/build-listings.py
```

That rewrites `frontend/src/data/mockListings.js` from two inputs:

- `frontend/scripts/matched_photos.json`: 36 make, model and colour entries, each with a matched front, rear and interior photo on the Kharo image CDN.
- The `FLEET` table at the top of `build-listings.py`: which models appear, how many, and the rent range.

To add a model, add a catalogue entry and a `FLEET` row, then rerun the script. Every listing shows the car it is labelled as; do not add stock photos of a different car.

Page-top photographs live in `frontend/src/lib/images.js`. The vehicle page hero is the listing's own photo.

---

## 3. Colours, type and shape

Tokens are in `frontend/src/index.css` under `:root` and mirrored in `frontend/tailwind.config.js`.

| Token | Value | Used for |
|---|---|---|
| `--green` | `#0E3B2C` | Buttons, links, the active state of controls |
| `--green-hover` | `#0A2C20` | Hover on green |
| `--green-soft` | `#EBF0ED` | Selected rows |
| `--ink` / `--ink-2` / `--ink-3` | `#111312` / `#454A47` / `#6A6F6C` | Headings, body, muted text |
| `--bone` / `--surface-2` | `#F3F3F0` / `#EAEAE5` | Page ground, quiet panels |
| `--line` / `--line-strong` | 14% / 28% ink | Hairlines and control borders |
| `--mint` | `#7FD8B0` | The one accent on the dark footer |
| `--night` | `#111312` | Footer ground |

Change a token once and everything follows. Do not write hex values into components.

**Shape.** Buttons, inputs, chips and tabs are 6px (`rounded-md`). Cards and photo frames are 10px (`rounded-lg`). `rounded-full` is only for things that are circles: radio dots, slider thumbs, the numbered step marker. No pills.

**Type.** Cabinet Grotesk for headings (`font-heading`), Satoshi for body, both from the Fontshare import at the top of `index.css`. Sizes come from the fluid scale (`text-h1`, `text-h2`, `text-h3`, `text-lead`).

**Motion.** One reveal per section, ease-out, under 300ms for anything a person triggers. `frontend/src/lib/motion.js` holds the curves and durations; reduced motion is respected everywhere.

---

## 4. Pages and routes

| Route | File | What it is |
|---|---|---|
| `/` | `pages/HomeFunctional.jsx` | Photo hero with the featured car and the search card, then browse by type, browse by make, featured cars, what Kharo does, two banners, recently added, the contact strip and the FAQ |
| `/search` | `pages/SearchResults.jsx` | Filter sidebar on the left (the same panel opens as a dialog on phones), results grid on the right. Filters live in `components/FiltersDialog.jsx` |
| `/vehicle/:id` | `pages/VehicleDetail.jsx` | Photos, specs, rent terms, the insurance comparison, collection area |
| `/apply/:id` | `pages/Apply.jsx` | Register interest: about you, licence, insurance, review |
| `/register` | `pages/Register.jsx` | General driver waitlist |
| `/list-your-fleet` | `pages/OperatorInterest.jsx` | Operator sign-up |
| `/driver-guide`, `/operator-guide` | `pages/DriverGuide.jsx`, `pages/OperatorGuide.jsx` | The two walkthroughs |
| `/for-drivers`, `/why-kharo`, `/help`, `/legal` | one file each in `pages/` | Marketing and support pages |
| `/city/:name` | `pages/CityPage.jsx` | City landing pages |
| `/saved`, `/compare`, `/request-a-car` | one file each | Shortlist, side-by-side, "can't find it" form |
| `/login`, `/driver-portal`, `/operator-login`, `/operator-dashboard`, `/admin` | one file each | Accounts and the admin dashboard. Both consoles share `components/ConsoleShell.jsx` (navigation rail, Notifications, Chat, and the operator's Tracking map); their demo notifications, chat threads and vehicles are the constants at the top of each page |

The page top on every page except the homepage is `components/PageHero.jsx`: one photograph across the width, the heading and one line in white on it, the page's buttons in the same column. Pass `img` from `lib/images.js`; leave it out (or set `size="band"`) on form pages to get the plain band.

There is no buy/sell marketplace any more. It was removed in full (pages, components, API routes and seed data) on 20 September 2026.

---

## 5. Running it locally

```bash
cd backend && pip install -r requirements.txt && uvicorn server:app --reload --port 8001
```

```bash
cd frontend && yarn install && yarn start
```

Design checks run from a Claude Code session with the impeccable skill installed (it lives in the Claude workspace, not in this repository): ask for `/impeccable audit` or `/impeccable critique` against a route on the running dev server. The one finding it always reports, `transition: height`, comes from the toast library's own stylesheet, not from Kharo code.

---

## 6. Before going live

These are yours to action.

- Put a live `RESEND_API_KEY` in the backend environment and set `ADMIN_EMAIL` to a real address; both are placeholders now.
- Move MongoDB to Atlas with a database user and IP allow-list. Local Mongo runs without authentication.
- Set `CORS_ORIGINS` to the real frontend domain. It fails closed, so an unset value blocks the site.
- Generate a long random `JWT_SECRET` and a strong `ADMIN_PASSWORD`. This repository was public with secrets in its history; rotate everything before launch, then take the old repository offline as planned.
- Add a data-deletion route and a real privacy policy naming the controller, retention and lawful basis. Register with the ICO.
- Fill in `BRAND.social` with real profile URLs; the footer icons stay hidden until you do.
- Replace the preview inventory with real operator stock and remove `PreviewNotice` from the listing pages.

## 7. Copy style

- British English. Licence with a c for the noun.
- Short sentences. One idea each.
- Say what the check is, not that something is "verified".
- Say what happens next after every button.
- Never state a number you cannot stand behind.
