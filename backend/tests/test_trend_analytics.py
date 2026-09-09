"""Tests for /api/admin/analytics 'trend' field added this session."""
import os
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


def _env(k):
    with open("/app/backend/.env") as fh:
        for line in fh:
            if line.startswith(k + "="):
                return line.split("=", 1)[1].strip().strip('"')
    return None


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": _env("ADMIN_EMAIL"), "password": _env("ADMIN_PASSWORD")})
    assert r.status_code == 200, r.text
    return r.json()["token"]


def test_analytics_has_trend_with_14_entries(admin_token):
    r = requests.get(f"{API}/admin/analytics", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    data = r.json()
    assert "trend" in data
    trend = data["trend"]
    assert isinstance(trend, list)
    assert len(trend) == 14, f"expected 14 entries got {len(trend)}"
    for item in trend:
        for k in ("date", "label", "leads", "views", "signups", "interests"):
            assert k in item, f"missing {k}"
        assert isinstance(item["leads"], int)
        assert isinstance(item["views"], int)
        assert isinstance(item["signups"], int)
        assert isinstance(item["interests"], int)


def test_analytics_still_has_funnel_and_sources(admin_token):
    r = requests.get(f"{API}/admin/analytics", headers={"Authorization": f"Bearer {admin_token}"})
    d = r.json()
    for k in ("funnel", "lead_sources", "city_demand", "total_leads"):
        assert k in d
    for k in ("page_views", "searches", "listing_views", "card_clicks", "applications", "driver_signups"):
        assert k in d["funnel"]


def test_operator_interest_creates_lead_source(admin_token):
    import uuid
    payload = {
        "company_name": f"TEST_Op_{uuid.uuid4().hex[:6]}",
        "fleet_size": "10-50", "areas": "East London",
        "contact_name": "TestOp", "email": f"testop+{uuid.uuid4().hex[:6]}@example.com",
        "phone": "07000000099"
    }
    r = requests.post(f"{API}/interest", json=payload)
    assert r.status_code == 200
    # Verify lead created with source
    leads = requests.get(f"{API}/admin/leads", headers={"Authorization": f"Bearer {admin_token}"}).json()
    assert any(l.get("source") == "operator_interest" for l in leads), "expected operator_interest lead"


def test_driver_register_creates_lead_source(admin_token):
    import uuid
    email = f"testdrv+{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(f"{API}/auth/register", json={
        "name": "TestDrv", "email": email, "phone": "07000000098",
        "password": "Test1234!", "role": "driver"
    })
    assert r.status_code == 200
    leads = requests.get(f"{API}/admin/leads", headers={"Authorization": f"Bearer {admin_token}"}).json()
    assert any(l.get("source") == "driver_signup" for l in leads), "expected driver_signup lead"
