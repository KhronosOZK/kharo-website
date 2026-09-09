"""Kharo iteration-12 backend tests: driver-interest / interest capture, listings counts, quote."""
import os
import time

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

ADMIN = {"email": "admin@caro.co.uk", "password": "CaroAdmin2026!"}


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{BASE_URL}/api/auth/login", json=ADMIN, timeout=30)
    if r.status_code != 200:
        pytest.fail(f"admin login failed {r.status_code}: {r.text[:300]}")
    s.headers.update({"Authorization": f"Bearer {r.json()['token']}"})
    return s


STAMP = str(int(time.time()))


# ---------------- Listings
class TestListings:
    def test_listings_total_180(self, client):
        r = client.get(f"{BASE_URL}/api/listings", timeout=60)
        assert r.status_code == 200
        docs = r.json()
        assert len(docs) == 180, f"expected 180 listings, got {len(docs)}"
        assert all("_id" not in d for d in docs)

    @pytest.mark.parametrize("city,count", [("London", 100), ("Birmingham", 20), ("Manchester", 20),
                                            ("Leeds", 20), ("Sheffield", 20)])
    def test_listings_per_city(self, client, city, count):
        r = client.get(f"{BASE_URL}/api/listings", params={"city": city}, timeout=60)
        assert r.status_code == 200
        docs = r.json()
        assert len(docs) == count, f"{city}: expected {count}, got {len(docs)}"
        assert all(d["city"] == city for d in docs)

    def test_colour_variants_present(self, client):
        r = client.get(f"{BASE_URL}/api/listings", timeout=60)
        colours = {(d.get("colour") or d.get("color") or "").lower() for d in r.json()}
        assert "red" in colours, f"no red variant; colours={sorted(colours)}"
        assert "green" in colours, f"no green variant; colours={sorted(colours)}"

    def test_get_single_listing(self, client):
        r = client.get(f"{BASE_URL}/api/listings/ve-001", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == "ve-001"
        assert isinstance(d["weekly_rent"], (int, float))
        assert "_id" not in d

    def test_get_missing_listing_404(self, client):
        r = client.get(f"{BASE_URL}/api/listings/ve-99999", timeout=30)
        assert r.status_code == 404


# ---------------- Driver interest capture
class TestDriverInterest:
    def test_driver_interest_ok_and_persisted(self, client, admin_client):
        payload = {
            "name": f"TEST_Driver {STAMP}",
            "email": f"test_driver_{STAMP}@example.com",
            "phone": "07700900111",
            "city": "London",
            "car_type": "saloon",
            "years_experience": "3-5",
            "dvla_licence": "yes",
            "availability": "asap",
            "notes": "TEST lead",
        }
        r = client.post(f"{BASE_URL}/api/driver-interest", json=payload, timeout=30)
        assert r.status_code == 200, r.text[:300]
        assert r.json() == {"ok": True}

        leads = admin_client.get(f"{BASE_URL}/api/admin/leads", timeout=60).json()
        mine = [l for l in leads if l.get("email") == payload["email"]]
        assert mine, "driver-interest lead not stored in leads"
        assert mine[0]["source"] == "driver_interest"
        assert mine[0]["data"]["city"] == "London"

    def test_driver_interest_invalid_email_422(self, client):
        r = client.post(f"{BASE_URL}/api/driver-interest",
                        json={"name": "x", "email": "not-an-email", "phone": "1"}, timeout=30)
        assert r.status_code == 422

    def test_driver_interest_missing_fields_422(self, client):
        r = client.post(f"{BASE_URL}/api/driver-interest", json={"name": "x"}, timeout=30)
        assert r.status_code == 422


# ---------------- Operator interest capture
class TestOperatorInterest:
    def test_interest_with_vehicle_types(self, client, admin_client):
        payload = {
            "company_name": f"TEST_Fleet {STAMP}",
            "fleet_size": "6-20",
            "areas": "London",
            "contact_name": "TEST Contact",
            "email": f"test_op_{STAMP}@example.com",
            "phone": "07700900222",
            "vehicle_types": "saloon,mpv",
            "tfl_operator_licence": "yes",
            "heard_from": "google",
        }
        r = client.post(f"{BASE_URL}/api/interest", json=payload, timeout=30)
        assert r.status_code == 200, r.text[:300]
        assert r.json() == {"ok": True}

        interests = admin_client.get(f"{BASE_URL}/api/admin/interests", timeout=60).json()
        mine = [i for i in interests if i.get("email") == payload["email"]]
        assert mine, "operator interest not stored"
        assert mine[0]["vehicle_types"] == "saloon,mpv"

    def test_interest_no_account_created(self, client):
        """Operator interest must NOT create a login account."""
        email = f"test_op_{STAMP}@example.com"
        r = client.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": "anything"}, timeout=30)
        assert r.status_code == 401

    def test_interest_missing_required_422(self, client):
        r = client.post(f"{BASE_URL}/api/interest", json={"company_name": "x"}, timeout=30)
        assert r.status_code == 422


# ---------------- Quote engine (used by compare table / cost panel)
class TestQuote:
    def test_quote_for_listing(self, client):
        r = client.post(f"{BASE_URL}/api/quote", json={"listing_id": "ve-001"}, timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["cheapest_weekly"] > 0
        assert len(d["quotes"]) == 3
        assert any(q["cheapest"] for q in d["quotes"])

    def test_quote_no_listing(self, client):
        r = client.post(f"{BASE_URL}/api/quote", json={}, timeout=30)
        assert r.status_code == 200
        assert r.json()["cheapest_weekly"] >= 34.0


# ---------------- Events / misc public endpoints
class TestPublic:
    def test_events(self, client):
        r = client.post(f"{BASE_URL}/api/events", json={"type": "page_view", "data": {"path": "/TEST"}}, timeout=30)
        assert r.status_code == 200 and r.json() == {"ok": True}

    def test_stats(self, client):
        r = client.get(f"{BASE_URL}/api/stats", timeout=60)
        assert r.status_code == 200
        d = r.json()
        assert d["listings"] == 180
        for k in ("drivers", "operators", "combined", "applications"):
            assert isinstance(d[k], int)

    def test_admin_requires_auth(self, client):
        r = client.get(f"{BASE_URL}/api/admin/summary", timeout=30)
        assert r.status_code == 401
