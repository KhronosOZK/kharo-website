"""
Tests for the PHV sales marketplace.

Run from the backend directory:
    pytest tests/test_marketplace.py -v

BASE_URL defaults to the local dev server. Point it elsewhere with the env var
of the same name to test a deployed environment.
"""

import os
import uuid
from datetime import date, timedelta

import pytest
import requests

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8001")
API = f"{BASE_URL}/api"


def _unique_email(tag):
    return f"mp-{tag}-{uuid.uuid4().hex[:8]}@example.com"


# ---------------------------------------------------------------- seed data
def test_sale_listings_are_seeded():
    r = requests.get(f"{API}/marketplace", params={"city": "London"}, timeout=20)
    assert r.status_code == 200
    rows = r.json()
    assert len(rows) > 0, "London should have demo sale inventory"


def test_every_listing_carries_licensing_fields():
    rows = requests.get(f"{API}/marketplace", timeout=20).json()
    required = ("pco_expiry", "mot_expiry", "ulez", "licensing_authority",
                "price", "mileage", "seller_type", "photos")
    for row in rows[:10]:
        for field in required:
            assert row.get(field) is not None, f"{row['id']} is missing {field}"
        assert len(row["photos"]) >= 2


def test_pco_months_left_is_calculated_on_read():
    rows = requests.get(f"{API}/marketplace", timeout=20).json()
    for row in rows[:10]:
        months = row.get("pco_months_left")
        assert months is not None
        assert 0 <= months <= 24


def test_pco_expiry_dates_are_in_the_future():
    rows = requests.get(f"{API}/marketplace", timeout=20).json()
    today = date.today()
    for row in rows[:10]:
        expiry = date.fromisoformat(row["pco_expiry"])
        assert expiry > today - timedelta(days=1), f"{row['id']} has a stale PCO date"


# ---------------------------------------------------------------- filtering
def test_filter_by_fuel():
    rows = requests.get(f"{API}/marketplace", params={"fuel": "electric"}, timeout=20).json()
    assert all(r["fuel"] == "electric" for r in rows)


def test_filter_by_seller_type():
    rows = requests.get(f"{API}/marketplace", params={"seller_type": "operator"}, timeout=20).json()
    assert all(r["seller_type"] == "operator" for r in rows)


def test_filter_by_minimum_pco_months():
    rows = requests.get(f"{API}/marketplace", params={"min_pco_months": 6}, timeout=20).json()
    assert all(r["pco_months_left"] >= 6 for r in rows)


def test_filter_by_price_ceiling():
    rows = requests.get(f"{API}/marketplace", params={"max_price": 12000}, timeout=20).json()
    assert all(r["price"] <= 12000 for r in rows)


def test_sort_price_ascending():
    rows = requests.get(f"{API}/marketplace", params={"sort": "price_asc"}, timeout=20).json()
    prices = [r["price"] for r in rows]
    assert prices == sorted(prices)


def test_sort_longest_pco_first():
    rows = requests.get(f"{API}/marketplace", params={"sort": "pco"}, timeout=20).json()
    months = [r["pco_months_left"] for r in rows]
    assert months == sorted(months, reverse=True)


# ---------------------------------------------------------------- detail
def test_listing_detail_returns_the_same_vehicle():
    rows = requests.get(f"{API}/marketplace", timeout=20).json()
    target = rows[0]
    r = requests.get(f"{API}/marketplace/{target['id']}", timeout=20)
    assert r.status_code == 200
    assert r.json()["id"] == target["id"]


def test_unknown_listing_returns_404():
    r = requests.get(f"{API}/marketplace/sl-does-not-exist", timeout=20)
    assert r.status_code == 404


# ---------------------------------------------------------------- demand capture
def test_seller_interest_is_recorded():
    payload = {
        "intent": "sell", "name": "Test Seller", "email": _unique_email("sell"),
        "phone": "07700900000", "city": "London", "make": "Toyota", "model": "Prius",
        "year": "2021", "mileage": "88000", "pco_expiry": "2027-03-01",
        "asking_price": "£11,000", "condition": "Good", "timeframe": "Within a month",
    }
    r = requests.post(f"{API}/marketplace-interest", json=payload, timeout=20)
    assert r.status_code == 200
    assert r.json()["intent"] == "sell"


def test_buyer_interest_is_recorded():
    payload = {
        "intent": "buy", "name": "Test Buyer", "email": _unique_email("buy"),
        "phone": "07700900001", "city": "Birmingham",
        "looking_for": "Hybrid saloon", "budget": "Up to £13,000",
        "min_pco_months": "6 months or more",
    }
    r = requests.post(f"{API}/marketplace-interest", json=payload, timeout=20)
    assert r.status_code == 200
    assert r.json()["intent"] == "buy"


def test_both_intent_counts_on_each_side():
    before = requests.get(f"{API}/marketplace-demand", timeout=20).json()
    payload = {
        "intent": "both", "name": "Test Both", "email": _unique_email("both"),
        "phone": "07700900002", "city": "Leeds",
    }
    assert requests.post(f"{API}/marketplace-interest", json=payload, timeout=20).status_code == 200
    after = requests.get(f"{API}/marketplace-demand", timeout=20).json()
    assert after["buyers"] == before["buyers"] + 1
    assert after["sellers"] == before["sellers"] + 1


def test_unknown_intent_falls_back_to_buy():
    payload = {
        "intent": "nonsense", "name": "Test Fallback", "email": _unique_email("fb"),
        "phone": "07700900003",
    }
    r = requests.post(f"{API}/marketplace-interest", json=payload, timeout=20)
    assert r.json()["intent"] == "buy"


def test_interest_requires_a_valid_email():
    payload = {"intent": "buy", "name": "No Email", "email": "not-an-email", "phone": "07700900004"}
    r = requests.post(f"{API}/marketplace-interest", json=payload, timeout=20)
    assert r.status_code == 422


def test_demand_endpoint_shape():
    r = requests.get(f"{API}/marketplace-demand", timeout=20)
    assert r.status_code == 200
    body = r.json()
    for key in ("sellers", "buyers", "total", "listings"):
        assert key in body
        assert isinstance(body[key], int)


# ---------------------------------------------------------------- admin
@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")
    if not email or not password:
        pytest.skip("ADMIN_EMAIL and ADMIN_PASSWORD are not set")
    r = s.post(f"{API}/auth/login", json={"email": email, "password": password}, timeout=20)
    if r.status_code != 200:
        pytest.skip("Admin login failed")
    s.headers["Authorization"] = f"Bearer {r.json()['token']}"
    return s


def test_admin_can_list_marketplace_interests(admin_session):
    r = admin_session.get(f"{API}/admin/marketplace_interests", timeout=20)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_analytics_include_marketplace(admin_session):
    body = admin_session.get(f"{API}/admin/analytics", timeout=20).json()
    assert "marketplace" in body
    for key in ("sellers", "buyers", "listings", "views"):
        assert key in body["marketplace"]


def test_admin_can_export_marketplace_interests(admin_session):
    r = admin_session.get(f"{API}/admin/export/marketplace_interests", timeout=20)
    assert r.status_code == 200
    assert "text/csv" in r.headers.get("content-type", "")


# ---------------------------------------------------------------- search and enrichment
def test_free_text_search_matches_model():
    rows = requests.get(f"{API}/marketplace", params={"q": "prius"}, timeout=20).json()
    assert len(rows) > 0
    assert all("prius" in f"{r['make']} {r['model']}".lower() for r in rows)


def test_free_text_search_matches_registration():
    first = requests.get(f"{API}/marketplace", timeout=20).json()[0]
    rows = requests.get(f"{API}/marketplace", params={"q": first["plate"][:4]}, timeout=20).json()
    assert any(r["id"] == first["id"] for r in rows)


def test_search_with_no_matches_returns_empty_list():
    rows = requests.get(f"{API}/marketplace", params={"q": "lamborghini"}, timeout=20).json()
    assert rows == []


def test_ids_filter_returns_only_those_listings():
    rows = requests.get(f"{API}/marketplace", params={"ids": "sl-001,sl-005"}, timeout=20).json()
    assert sorted(r["id"] for r in rows) == ["sl-001", "sl-005"]


def test_detail_includes_price_context():
    body = requests.get(f"{API}/marketplace/sl-001", timeout=20).json()
    ctx = body.get("price_context")
    assert ctx is not None
    assert ctx["sample"] >= 4
    assert 0 <= ctx["percentile"] <= 100


def test_detail_includes_a_rent_comparison():
    body = requests.get(f"{API}/marketplace/sl-001", timeout=20).json()
    assert isinstance(body.get("typical_weekly_rent"), int)


def test_detail_includes_three_similar_vehicles():
    body = requests.get(f"{API}/marketplace/sl-001", timeout=20).json()
    similar = body["similar"]
    assert len(similar) == 3
    assert all(s["id"] != "sl-001" for s in similar)
    assert all(s["status"] == "available" for s in similar)
    assert all("pco_months_left" in s for s in similar)


def test_every_listing_renders_a_complete_detail_page():
    """Guards against a seed change leaving a listing with a missing field."""
    required = ("photos", "description", "features", "seller_label",
                "reason_for_sale", "pco_months_left", "mot_months_left", "similar")
    for row in requests.get(f"{API}/marketplace", timeout=20).json():
        body = requests.get(f"{API}/marketplace/{row['id']}", timeout=20).json()
        for field in required:
            assert body.get(field) is not None, f"{row['id']} is missing {field}"


# ---------------------------------------------------------------- seed inventory quality
def test_inventory_covers_a_realistic_spread_of_models():
    rows = requests.get(f"{API}/marketplace", timeout=20).json()
    models = {f"{r['make']} {r['model']}" for r in rows}
    assert len(models) >= 15, "inventory looks too repetitive to demo credibly"
    assert any("Prius" in m for m in models), "a PHV marketplace without a Prius is not credible"


def test_prices_sit_in_a_believable_range():
    rows = requests.get(f"{API}/marketplace", timeout=20).json()
    prices = [r["price"] for r in rows]
    assert min(prices) > 2000
    assert max(prices) < 60000


def test_no_listing_is_priced_above_a_lower_mileage_twin():
    """Same make, model and year should not get dearer as mileage climbs."""
    rows = requests.get(f"{API}/marketplace", timeout=20).json()
    groups = {}
    for r in rows:
        groups.setdefault((r["make"], r["model"], r["year"]), []).append(r)
    for key, group in groups.items():
        ordered = sorted(group, key=lambda r: r["mileage"])
        for a, b in zip(ordered, ordered[1:]):
            # A longer remaining licence can justify a small premium.
            assert b["price"] <= a["price"] + 500, f"{key} prices rise with mileage"
