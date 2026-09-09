"""
Caro backend end-to-end API tests.
Covers: listings, quote, auth (register/login/me/logout), applications, interest, stats, admin.
"""
import os
import io
import csv
import uuid
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to reading from frontend env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


def _backend_env(key, path="/app/backend/.env"):
    val = os.environ.get(key)
    if val:
        return val
    try:
        with open(path) as fh:
            for line in fh:
                if line.startswith(f"{key}="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return None


ADMIN_EMAIL = _backend_env("ADMIN_EMAIL")
ADMIN_PASSWORD = _backend_env("ADMIN_PASSWORD")


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def driver_session():
    sess = requests.Session()
    email = f"testdriver+{uuid.uuid4().hex[:8]}@example.com"
    r = sess.post(f"{API}/auth/register", json={
        "name": "Test Driver", "email": email, "phone": "07000000000",
        "password": "Test1234!", "role": "driver"
    })
    assert r.status_code == 200, r.text
    data = r.json()
    # Bearer fallback in case cookies aren't returned across origins
    sess.headers.update({"Authorization": f"Bearer {data['token']}"})
    sess.email = email
    sess.token = data["token"]
    sess.user_id = data["id"]
    return sess


@pytest.fixture(scope="session")
def admin_session():
    sess = requests.Session()
    r = sess.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    sess.headers.update({"Authorization": f"Bearer {r.json()['token']}"})
    return sess


# ---------------- Listings ----------------
class TestListings:
    def test_list_all_seeded(self, s):
        r = s.get(f"{API}/listings")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 12, f"expected >=12 seeded, got {len(data)}"
        first = data[0]
        for k in ("id", "make", "model", "year", "weekly_rent", "borough", "fuel", "vehicle_type", "operator_code"):
            assert k in first, f"missing {k}"

    def test_filter_borough(self, s):
        r = s.get(f"{API}/listings", params={"borough": "Newham"})
        assert r.status_code == 200
        for d in r.json():
            assert d["borough"] == "Newham"

    def test_filter_vehicle_type(self, s):
        r = s.get(f"{API}/listings", params={"vehicle_type": "executive"})
        assert r.status_code == 200
        for d in r.json():
            assert d["vehicle_type"] == "executive"

    def test_filter_fuel(self, s):
        r = s.get(f"{API}/listings", params={"fuel": "electric"})
        assert r.status_code == 200
        for d in r.json():
            assert d["fuel"] == "electric"

    def test_filter_max_budget(self, s):
        r = s.get(f"{API}/listings", params={"max_budget": 300})
        assert r.status_code == 200
        for d in r.json():
            assert d["weekly_rent"] <= 300

    def test_filter_breakdown(self, s):
        r = s.get(f"{API}/listings", params={"breakdown": "true"})
        assert r.status_code == 200
        for d in r.json():
            assert d.get("breakdown_included")

    def test_sort_price_asc(self, s):
        r = s.get(f"{API}/listings", params={"sort": "price_asc"})
        data = r.json()
        rents = [d["weekly_rent"] for d in data]
        assert rents == sorted(rents)

    def test_sort_price_desc(self, s):
        r = s.get(f"{API}/listings", params={"sort": "price_desc"})
        data = r.json()
        rents = [d["weekly_rent"] for d in data]
        assert rents == sorted(rents, reverse=True)

    def test_sort_rating(self, s):
        r = s.get(f"{API}/listings", params={"sort": "rating"})
        data = r.json()
        ratings = [d["operator_rating"] for d in data]
        assert ratings == sorted(ratings, reverse=True)

    def test_get_listing_by_id_and_records_view(self, s, admin_session):
        r0 = s.get(f"{API}/listings")
        lid = r0.json()[0]["id"]
        before = admin_session.get(f"{API}/admin/summary").json()["listing_views"]
        r = s.get(f"{API}/listings/{lid}")
        assert r.status_code == 200
        assert r.json()["id"] == lid
        time.sleep(0.4)
        after = admin_session.get(f"{API}/admin/summary").json()["listing_views"]
        assert after >= before + 1

    def test_get_listing_404(self, s):
        r = s.get(f"{API}/listings/does-not-exist-xyz")
        assert r.status_code == 404


# ---------------- Quote ----------------
class TestQuote:
    def test_quote_returns_three(self, s):
        r = s.post(f"{API}/quote", json={"age": 40, "years_experience": 5, "ncb_years": 3})
        assert r.status_code == 200
        d = r.json()
        assert "cheapest_weekly" in d
        assert isinstance(d["cheapest_weekly"], (int, float))
        assert len(d["quotes"]) == 3
        assert any(q["cheapest"] for q in d["quotes"])

    def test_quote_with_listing(self, s):
        lid = s.get(f"{API}/listings").json()[0]["id"]
        r = s.post(f"{API}/quote", json={"listing_id": lid})
        assert r.status_code == 200
        assert r.json()["cheapest_weekly"] >= 34.0


# ---------------- Auth ----------------
class TestAuth:
    def test_register_login_me_logout(self, s):
        sess = requests.Session()
        email = f"testauth+{uuid.uuid4().hex[:8]}@example.com"
        r = sess.post(f"{API}/auth/register", json={
            "name": "Auth Test", "email": email, "phone": "07000000001",
            "password": "Test1234!", "role": "driver"
        })
        assert r.status_code == 200
        tok = r.json()["token"]
        # duplicate rejected
        r2 = sess.post(f"{API}/auth/register", json={
            "name": "x", "email": email, "phone": "1", "password": "Test1234!"
        })
        assert r2.status_code == 400

        # login
        r3 = sess.post(f"{API}/auth/login", json={"email": email, "password": "Test1234!"})
        assert r3.status_code == 200
        tok = r3.json()["token"]

        # me via bearer
        r4 = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {tok}"})
        assert r4.status_code == 200
        assert r4.json()["email"] == email

        # me via cookie (if set)
        r5 = sess.get(f"{API}/auth/me")
        # Accept either 200 (cookie worked) or 401 (cookies not persisted across origin)
        assert r5.status_code in (200, 401)

        # logout
        r6 = requests.post(f"{API}/auth/logout")
        assert r6.status_code == 200

        # bad login
        r7 = requests.post(f"{API}/auth/login", json={"email": email, "password": "wrong"})
        assert r7.status_code == 401

    def test_me_unauth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ---------------- Applications ----------------
class TestApplications:
    def test_create_application_and_list_mine(self, driver_session, s):
        lid = s.get(f"{API}/listings").json()[0]["id"]
        payload = {
            "listing_id": lid, "full_name": "Test Driver",
            "email": driver_session.email, "phone": "07000000000",
            "dvla_licence": "TEST123456AB9CD", "pco_licence": "PCO123456",
            "years_experience": 4, "estimated_weekly_cost": 320.0,
            "insurance_details": {"cover": "comprehensive"}
        }
        r = driver_session.post(f"{API}/applications", json=payload)
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "under_review"

        r2 = driver_session.get(f"{API}/applications/me")
        assert r2.status_code == 200
        apps = r2.json()
        assert any(a["listing_id"] == lid for a in apps)

    def test_profile_reuse_and_duration_weeks(self, s):
        """New driver -> apply with duration_weeks and profile fields -> /auth/me reflects them; app stored duration."""
        sess = requests.Session()
        email = f"neo+{uuid.uuid4().hex[:8]}@example.com"
        r = sess.post(f"{API}/auth/register", json={
            "name": "Neo", "email": email, "phone": "07000000010",
            "password": "Test1234!", "role": "driver"
        })
        assert r.status_code == 200
        tok = r.json()["token"]
        sess.headers.update({"Authorization": f"Bearer {tok}"})

        payload = {
            "listing_id": "ve-001", "full_name": "Neo",
            "email": email, "phone": "07999888777",
            "dob": "1990-01-15", "dvla_licence": "NEO123456AB9CD",
            "pco_licence": "PCONEO12345", "years_experience": 7,
            "duration_weeks": 8, "estimated_weekly_cost": 300.0,
        }
        r2 = sess.post(f"{API}/applications", json=payload)
        assert r2.status_code == 200, r2.text
        assert r2.json()["status"] == "under_review"

        me = sess.get(f"{API}/auth/me").json()
        assert me["dvla_licence"] == "NEO123456AB9CD"
        assert me["pco_licence"] == "PCONEO12345"
        assert me["dob"] == "1990-01-15"
        assert me["phone"] == "07999888777"
        assert me["years_experience"] == 7

        apps = sess.get(f"{API}/applications/me").json()
        assert any(a.get("duration_weeks") == 8 and a["listing_id"] == "ve-001" for a in apps)

    def test_anonymous_application_ok(self, s):
        payload = {
            "listing_id": "ve-001", "full_name": "Anon User",
            "email": f"anon+{uuid.uuid4().hex[:6]}@example.com", "phone": "07000111222",
            "duration_weeks": 4,
        }
        r = requests.post(f"{API}/applications", json=payload)
        assert r.status_code == 200
        assert r.json()["status"] == "under_review"


# ---------------- Interest & Stats ----------------
class TestInterestStats:
    def test_interest(self, s):
        payload = {
            "company_name": f"TEST_Fleet_{uuid.uuid4().hex[:6]}",
            "fleet_size": "10-50", "areas": "East London",
            "contact_name": "Op Manager", "email": f"op+{uuid.uuid4().hex[:6]}@example.com",
            "phone": "07000000002"
        }
        r = s.post(f"{API}/interest", json=payload)
        assert r.status_code == 200
        assert r.json()["ok"]

    def test_stats(self, s):
        r = s.get(f"{API}/stats")
        assert r.status_code == 200
        d = r.json()
        for k in ("drivers", "operators", "combined", "listings", "applications", "recent_operators"):
            assert k in d
        assert d["listings"] >= 12


# ---------------- Admin ----------------
class TestAdmin:
    def test_summary(self, admin_session):
        r = admin_session.get(f"{API}/admin/summary")
        assert r.status_code == 200
        for k in ("leads", "drivers", "applications", "interests", "events"):
            assert k in r.json()

    @pytest.mark.parametrize("coll", ["leads", "applications", "interests", "users", "events"])
    def test_admin_lists(self, admin_session, coll):
        r = admin_session.get(f"{API}/admin/{coll}")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_non_admin_forbidden(self, driver_session):
        r = driver_session.get(f"{API}/admin/summary")
        assert r.status_code == 403

    def test_admin_unauth(self):
        r = requests.get(f"{API}/admin/summary")
        assert r.status_code == 401

    def test_export_csv(self, admin_session):
        r = admin_session.get(f"{API}/admin/export/leads")
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        # parseable
        rows = list(csv.reader(io.StringIO(r.text)))
        assert len(rows) >= 1  # header at least

    def test_export_bad_collection(self, admin_session):
        r = admin_session.get(f"{API}/admin/export/foobar")
        assert r.status_code == 404
