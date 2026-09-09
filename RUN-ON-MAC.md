# Running Kharo on your MacBook Air

Follow these in order. Every line starting with `$` is something you type into Terminal, without the `$`.

Open Terminal by pressing `Cmd + Space`, typing `terminal`, and hitting Enter.

---

## Step 1: Install Homebrew

Homebrew installs everything else. Check whether you already have it:

```
$ brew --version
```

If that prints a version number, skip to Step 2. If it says "command not found", install it:

```
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It will ask for your Mac password. Nothing appears as you type it, which is normal. Press Enter when done.

At the end it prints two or three lines starting with `eval` or `export`. **Copy and run those**, or Homebrew will not be on your path. On an Apple Silicon MacBook Air they are usually:

```
$ echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
$ eval "$(/opt/homebrew/bin/brew shellenv)"
```

Confirm it worked:

```
$ brew --version
```

---

## Step 2: Install Node, Python and MongoDB

```
$ brew install node python@3.12
$ brew tap mongodb/brew
$ brew install mongodb-community
```

Start MongoDB and set it to run in the background:

```
$ brew services start mongodb-community
```

Check it is running:

```
$ brew services list
```

You want `mongodb-community` showing as `started`.

---

## Step 3: Unzip the project

Unzip the file, then move into it. If it unzipped into your Downloads folder:

```
$ cd ~/Downloads/KHAROV1.2-main
```

Confirm you are in the right place. This should list `backend`, `frontend` and `EDITING-GUIDE.md`:

```
$ ls
```

---

## Step 4: Set up the backend

```
$ cd backend
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

Your prompt now starts with `(venv)`. That is correct.

Create the settings file:

```
$ nano .env
```

Paste this in, changing the password to something of your own:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=kharo
JWT_SECRET=change-this-to-any-long-random-string-abc123xyz789
ADMIN_EMAIL=you@youremail.com
ADMIN_PASSWORD=PickAStrongPasswordHere
CORS_ORIGINS=http://localhost:3000
```

Save and exit nano with `Ctrl + O`, then Enter, then `Ctrl + X`.

Start the backend:

```
$ uvicorn server:app --reload --port 8001
```

Leave this window open. It is now running. You should see `Uvicorn running on http://127.0.0.1:8001`.

**Test it.** Open a browser and go to `http://localhost:8001/api/marketplace`. You should see a wall of vehicle data. If you do, the backend and database are both working.

---

## Step 5: Set up the frontend

Open a **second** Terminal window with `Cmd + N`. The backend needs to keep running in the first one.

```
$ cd ~/Downloads/KHAROV1.2-main/frontend
$ npm install --legacy-peer-deps
```

This takes a few minutes.

**If it fails with a 403 error mentioning `assets.emergent.sh`**, that dependency is hosted on the Emergent platform and your network cannot reach it. Remove it and try again:

```
$ npm pkg delete dependencies.@emergentbase/visual-edits
$ npm install --legacy-peer-deps
```

The app handles that package being absent, so nothing breaks.

Create the frontend settings file:

```
$ nano .env
```

Paste this single line:

```
REACT_APP_BACKEND_URL=http://localhost:8001
```

Save with `Ctrl + O`, Enter, `Ctrl + X`.

Start it:

```
$ npm start
```

Your browser opens at `http://localhost:3000` on its own after a moment.

---

## Step 6: Look at it

Pages worth checking first, since these have never been viewed by anyone:

| Page | Address |
|---|---|
| Home | `http://localhost:3000/` |
| Marketplace | `http://localhost:3000/marketplace` |
| A vehicle for sale | click any card, or `/marketplace/sl-001` |
| Sell your vehicle | `http://localhost:3000/sell-your-car` |
| Login | `http://localhost:3000/login` |
| Forgot password | `http://localhost:3000/forgot-password` |
| Admin dashboard | `http://localhost:3000/admin` |

Sign in to the admin dashboard with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in Step 4.

**To check the phone layout**, right-click the page, choose Inspect, then click the small phone-and-tablet icon at the top-left of the panel that opens. Pick "iPhone SE" from the dropdown, which is the narrowest common screen and where problems show up first. Look especially at the buy-versus-rent calculator on a vehicle page.

---

## Stopping and restarting

To stop either server, click its Terminal window and press `Ctrl + C`.

To start again later:

```
# Window 1
$ cd ~/Downloads/KHAROV1.2-main/backend
$ source venv/bin/activate
$ uvicorn server:app --reload --port 8001

# Window 2
$ cd ~/Downloads/KHAROV1.2-main/frontend
$ npm start
```

MongoDB keeps running in the background on its own. To stop it entirely:

```
$ brew services stop mongodb-community
```

---

## If something goes wrong

**"command not found: brew"** — Step 1 did not finish. Run the two `eval` lines from that step again.

**"Address already in use"** — something is already on that port. Find and stop it:

```
$ lsof -ti:8001 | xargs kill -9
```

Use `3000` instead of `8001` for the frontend.

**Site loads but no cars appear** — the frontend cannot reach the backend. Check the backend Terminal window is still running, and that `frontend/.env` says exactly `REACT_APP_BACKEND_URL=http://localhost:8001`. If you changed that file after starting the frontend, stop it with `Ctrl + C` and run `npm start` again. React only reads `.env` at startup.

**"MongoNetworkError" or the backend crashes on start** — MongoDB is not running. Run `brew services start mongodb-community`.

**Admin login is refused** — the admin account is created when the backend first starts. If you edited `.env` afterwards, stop the backend with `Ctrl + C` and start it again.

**Changes to text do not appear** — edit `frontend/src/content/site.js` and save. The page reloads on its own. If it does not, hard refresh with `Cmd + Shift + R`.
