"""
Caro backend tests for iteration 3: city filter, city-interest, city-demand, admin analytics.
"""
import os
import io
import csv
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
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


@pytest.fixture(scope="module")
def admin_sess():
    sess = requests.Session()
    r = sess.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    sess.headers.update({"Authorization": f"Bearer {r.json()['token']}"})
    return sess


@pytest.fixture(scope="module")
def driver_sess():
    sess = requests.Session()
    email = f"cd+{uuid.uuid4().hex[:8]}@example.com"
    r = sess.post(f"{API}/auth/register", json={
        "name": "City Driver", "email": email, "phone": "07000000099",
        "password": "Test1234!", "role": "driver"
    })
    assert r.status_code == 200, r.text
    sess.headers.update({"Authorization": f"Bearer {r.json()['token']}"})
    return sess


# ---------- City filter on listings ----------
class TestCityFilter:
    def test_london_returns_12_and_city_field(self):
        r = requests.get(f"{API}/listings", params={"city": "London"})
        assert r.status_code == 200
        docs = r.json()
        assert len(docs) >= 12, f"expected >=12 London listings, got {len(docs)}"
        for d in docs:
            assert d.get("city") == "London", f"non-London listing leaked: {d}"

    def test_manchester_returns_zero(self):
        r = requests.get(f"{API}/listings", params={"city": "Manchester"})
        assert r.status_code == 200
        assert r.json() == []

    def test_london_electric_filter(self):
        r = requests.get(f"{API}/listings", params={"city": "London", "fuel": "electric"})
        assert r.status_code == 200
        docs = r.json()
        assert len(docs) >= 1
        for d in docs:
            assert d["city"] == "London"
            assert d["fuel"] == "electric"


# ---------- City interest ----------
class TestCityInterest:
    def test_city_interest_creates_request_and_lead(self, admin_sess):
        email = f"mci+{uuid.uuid4().hex[:6]}@example.com"
        payload = {
            "city": "Manchester", "name": "MCR Fan", "email": email,
            "phone": "07000111333", "vehicle_type": "saloon",
        }
        r = requests.post(f"{API}/city-interest", json=payload)
        assert r.status_code == 200
        assert r.json().get("ok")

        # Verify present in city_requests via admin
        rows = admin_sess.get(f"{API}/admin/city_requests").json()
        assert any(x.get("email") == email and x.get("city") == "Manchester" for x in rows), \
            f"city_request not stored for {email}"

        # Verify lead with source city_request
        leads = admin_sess.get(f"{API}/admin/leads").json()
        assert any(l.get("email") == email and l.get("source") == "city_request" for l in leads), \
            f"lead not stored with source city_request for {email}"

    def test_city_demand_aggregates_manchester(self):
        # Ensure a Manchester request exists
        requests.post(f"{API}/city-interest", json={
            "city": "Manchester", "email": f"mci2+{uuid.uuid4().hex[:6]}@example.com"
        })
        r = requests.get(f"{API}/city-demand")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        cities = {row["city"]: row["requests"] for row in data}
        assert "Manchester" in cities
        assert cities["Manchester"] >= 1


# ---------- Admin analytics ----------
class TestAdminAnalytics:
    def test_analytics_shape(self, admin_sess):
        r = admin_sess.get(f"{API}/admin/analytics")
        assert r.status_code == 200
        d = r.json()
        assert "funnel" in d and isinstance(d["funnel"], dict)
        for k in ("page_views", "searches", "listing_views", "card_clicks", "applications", "driver_signups"):
            assert k in d["funnel"], f"missing funnel key {k}"
        assert "lead_sources" in d and isinstance(d["lead_sources"], list)
        assert "city_demand" in d and isinstance(d["city_demand"], list)
        assert "total_leads" in d and isinstance(d["total_leads"], int)

    def test_analytics_requires_auth(self):
        r = requests.get(f"{API}/admin/analytics")
        assert r.status_code == 401

    def test_analytics_non_admin_forbidden(self, driver_sess):
        r = driver_sess.get(f"{API}/admin/analytics")
        assert r.status_code == 403

    def test_admin_city_requests_list(self, admin_sess):
        r = admin_sess.get(f"{API}/admin/city_requests")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_export_city_requests_csv(self, admin_sess):
        r = admin_sess.get(f"{API}/admin/export/city_requests")
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        rows = list(csv.reader(io.StringIO(r.text)))
        assert len(rows) >= 1
