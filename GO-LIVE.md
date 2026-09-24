# Taking Kharo live, step by step

Written 20 September 2026 so the launch can be finished without a Claude session. Each step says what to do, where, and how to check it worked. Do them in order; the first three are the ones that break a launch morning.

Where things run:

| Piece | Where | How it deploys |
|---|---|---|
| Website (React) | Vercel, project `kharo`, team `kharo DT` | Every push to `main` on `github.com/KhronosOZK/kharo-website` builds and goes live at kharo.co.uk in about two minutes |
| API (FastAPI) | Render, `kharo-backend.onrender.com` (the address the website's security policy allows) | Push to `main`, or the Render dashboard's "Manual deploy" |
| Database (MongoDB) | Today: a local Mongo on your Mac with no password. Must move to MongoDB Atlas | See step 2 |
| Email (Resend) | Not yet connected | See step 1 |

---

## 1. Make the emails send (30 minutes)

Every form on the site emails you an alert and the person a thank-you. Nothing sends until Resend has a key.

1. Sign in at resend.com. Add the domain `kharo.co.uk`. Resend shows you three DNS records (two TXT for DKIM/SPF, one MX for returns).
2. Add those records wherever kharo.co.uk's DNS lives (the same place Vercel told you to point the domain). Wait until Resend shows the domain as **Verified** (usually under an hour).
3. In Resend, create an API key with "Sending access". Copy it once; it is not shown again.
4. In Render, open the backend service, then **Environment**, and set:
   - `RESEND_API_KEY` = the key
   - `ALERT_EMAIL` = the inbox that should get a message for every registration
   - `EMAIL_FROM_ADDRESS` = `hello@kharo.co.uk` (must be on the verified domain)
5. Save. Render redeploys on its own.
6. Check: go to kharo.co.uk/register, register with your own email, and confirm two emails arrive: the thank-you to you and the alert to `ALERT_EMAIL`. If nothing arrives, Render's **Logs** tab shows the Resend error verbatim.

## 2. Move the database to MongoDB Atlas (45 minutes)

1. Create a free account at mongodb.com/atlas. Create a project "Kharo", then a free **M0** cluster in the London (eu-west-2) region.
2. **Database Access**: add a user, for example `kharo_app`, with a long generated password. Role: "Read and write to any database".
3. **Network Access**: add Render's outbound IP addresses (Render lists them under the service's **Connect** tab). If you cannot find them, temporarily allow `0.0.0.0/0` and tighten it later.
4. **Connect**, choose "Drivers", copy the connection string. It looks like `mongodb+srv://kharo_app:<password>@cluster0.xxxxx.mongodb.net/`.
5. In Render, set `MONGO_URL` to that string (with the real password) and `DB_NAME` = `kharo`.
6. Save. When the service restarts it creates the collections and seeds the admin account and the listings on its own.
7. Check: kharo.co.uk/search should show cars and kharo.co.uk/admin should let you sign in (step 4).

The local Mongo on your Mac keeps the test data you have now; nothing from it needs to move.

## 3. Secrets and origins (10 minutes)

In Render's **Environment**, make sure these exist and are not placeholders:

- `JWT_SECRET`: 64 random characters. On a Mac: `openssl rand -hex 32` in Terminal.
- `ADMIN_PASSWORD`: a long password you store in a password manager. The backend resets the admin user's password to this on every start, so changing it here is how you rotate it.
- `CORS_ORIGINS` = `https://kharo.co.uk,https://www.kharo.co.uk`. The API refuses browsers from any other address, so a typo here shows as "Couldn't send that" on every form.
- `PUBLIC_BASE_URL` = `https://kharo.co.uk` (used in email links).

The repository was public with old secrets in its history. Once the site is live, make the GitHub repository private (Settings, Danger Zone, Change visibility). Everything above has already been rotated.

## 4. Admin access (5 minutes)

The admin dashboard is at **kharo.co.uk/admin**. It uses the same sign-in as drivers; the account with `ADMIN_EMAIL` gets the admin role automatically and its password is reset to `ADMIN_PASSWORD` on every start.

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Render (step 3). Redeploy.
2. Go to kharo.co.uk/login, sign in with them. Then open kharo.co.uk/admin.
3. What you will see, top to bottom: headline counts; the funnel (page views → waitlist started → completed → per-car interest → operators); the 14-day trend; demand by city and by car; lead sources; **What drivers search for** (budgets, cities, councils, makes, fuel, and the cars people registered for) with a CSV export; then tables for leads, applications, operator interests, city requests, users and raw events, each with **Export CSV**.
4. For investors, the numbers that matter are on that page: registered drivers, operators interested, median budget, top councils and cities, and the trend line. Export the CSVs before a meeting; nothing needs Mongo access.

Locally, the same dashboard runs at localhost:3000/admin with the values in `backend/.env` (`ADMIN_EMAIL` and `ADMIN_PASSWORD` in that file). Start the API with:

```bash
cd backend && venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001
```

and the site with `cd frontend && npm start`. The API has to be restarted after any change to `server.py`; it does not reload on its own.

## 5. Copy you must change before anyone reads it

All in `frontend/src/content/site.js`:

- `FACTS.launch`: the opening month for each city. These drive the black banner at the top of every page, the city pages and the message after someone registers. They are placeholders today.
- `BRAND.whatsapp`: the number behind every "Ask on WhatsApp" button. Someone has to answer it.
- `BRAND.social`: paste real profile links; the footer icons appear when they are not empty.
- `OPERATOR_GUIDE.fee.example.feeRate`: currently 10%. Make it your real fee.

Push to `main` and Vercel deploys it. `EDITING-GUIDE.md` explains every other text block and where it lives.

## 6. Legal (needs a solicitor)

- The Legal page is a plain-English summary, not a policy. You need a privacy policy naming the data controller, retention periods and lawful basis, and terms of service. Paste them into `LEGAL` in `site.js` or link to PDFs.
- Register with the ICO (ico.org.uk, "register as a data controller"). You collect driving-licence and badge numbers; this is not optional.
- Deletion requests: `POST /api/privacy/delete-request` logs them to the `deletion_requests` collection and emails `ALERT_EMAIL`. You have one month to act on each. Signed-in drivers can delete themselves from the console ("Delete my account").

## 7. Photos

The catalogue in `frontend/scripts/matched_photos.json` covers 36 make, model and colour combinations. Any listing outside it shows a same-model photo with a "Photo shows the same model" note. Two ways forward:

- Ask each launch operator for three photos per car (front three-quarter, rear three-quarter, interior). Put them in `frontend/public/images/listings/` and reference them from the listing.
- Or extend the catalogue and re-run `cd frontend && python3 scripts/build-listings.py`.

Never use a competitor's photos; the site's own images are either matched catalogue shots or operator-supplied.

## 8. Translations

The site is written in plain English for readers with limited English (one idea per sentence, everyday words). Machine translation of insurance or legal wording is a liability, so the plan is:

1. Pick the first two languages from the councils you launch in (for London that is usually Urdu/Punjabi and Romanian; check with the operators).
2. Hand a translator `frontend/src/content/site.js` and `frontend/src/content/pages/*.js`. Every sentence a visitor reads lives there.
3. A language switch needs an engineer for about a day (react-i18next, one JSON per language, the switch in the header). Do not start it until the translations exist.

## 9. Before the first real operator

- Replace the preview inventory with their real cars: `frontend/src/data/mockListings.js` is generated; real listings should come from the API (`/api/listings`, seeded from `backend/seed_data.py`) so the operator console can manage them. This is the first real engineering job after launch.
- Remove the demo account `demo.driver@kharodemo.co.uk` and the test leads from the database (Atlas, Browse Collections, delete the documents).
- Turn on Vercel Analytics (free) in the Vercel project for real page-view numbers alongside the site's own events.

## 10. Monitoring (10 minutes)

Both are already wired into the code; each needs one switch from you.

- **Vercel Web Analytics.** In the Vercel dashboard open the `kharo` project, then the **Analytics** tab, and click **Enable**. Page views start counting from the next deploy. Nothing else to do.
- **Sentry.** Create a free account at sentry.io, add a React project, copy the DSN it shows you. In Vercel, project **Settings → Environment Variables**, add `REACT_APP_SENTRY_DSN` with that value and redeploy. From then on every crash on a visitor's screen appears in Sentry. Until the variable exists the code does nothing.
- Render sends deploy-failure emails on its own; make sure they go to an inbox someone reads.

## 10a. Make the repository private (2 minutes)

The code is still public on GitHub. Go to github.com/KhronosOZK/kharo-website → **Settings** → scroll to **Danger Zone** → **Change repository visibility** → **Make private**, and type the repository name to confirm. Vercel keeps deploying from a private repository without any change.

## 11. Growth loop already in the site

- After anyone registers (a car, the waitlist, a fleet) they see a green **"Send this to a driver you know"** button that opens WhatsApp with the car, the price and the link already written. Watch `lead_sources` and the trend line in admin to see it work.
- Every filtered search is recorded, so the "What drivers search for" panel fills as soon as people browse. That is the demand evidence for investors.

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| Every form says "Couldn't send that" | `CORS_ORIGINS` wrong, or API down | Check Render logs; set `CORS_ORIGINS` exactly as in step 3 |
| Forms work but no emails | `RESEND_API_KEY` missing or domain not verified | Step 1 |
| Site shows old design | Browser cache | Hard refresh, or private window |
| Page goes blank after a deploy | Old page holding old file names | Reload; the site retries once on its own |
| Admin login says wrong password | `ADMIN_PASSWORD` changed in Render but service not restarted | Manual deploy in Render |
| `/admin` shows "Nothing yet" everywhere | No visitors have used the site since the database moved | Expected; browse and register once to see rows appear |
