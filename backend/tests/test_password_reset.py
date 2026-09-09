"""
Tests for password reset flow (/api/auth/forgot-password, /api/auth/reset-password)
and city-interest (car request) endpoint.
"""
import os
import uuid
import pytest
import requests
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE_URL}/api"


def _env(key):
    with open("/app/backend/.env") as fh:
        for line in fh:
            if line.startswith(f"{key}="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


MONGO_URL = _env("MONGO_URL")
DB_NAME = _env("DB_NAME")


def _fetch_token(email):
    """Directly read password_reset_tokens from Mongo for the given email."""
    async def _q():
        client = AsyncIOMotorClient(MONGO_URL)
        try:
            docs = await client[DB_NAME].password_reset_tokens.find(
                {"email": email.lower()}
            ).sort("created_at", -1).to_list(5)
            return docs
        finally:
            client.close()
    return asyncio.get_event_loop().run_until_complete(_q())


def _register(email, password="OldPass1234!"):
    r = requests.post(f"{API}/auth/register", json={
        "name": "PR Test", "email": email, "phone": "07000000099",
        "password": password, "role": "driver"
    })
    assert r.status_code == 200, r.text
    return r.json()


class TestPasswordReset:
    def test_forgot_password_ok_for_registered(self):
        email = f"reset+{uuid.uuid4().hex[:8]}@example.com"
        _register(email)
        r = requests.post(f"{API}/auth/forgot-password", json={"email": email})
        assert r.status_code == 200
        assert r.json() == {"ok": True}
        toks = _fetch_token(email)
        assert len(toks) >= 1
        assert toks[0]["used"] is False

    def test_forgot_password_no_enumeration(self):
        r = requests.post(f"{API}/auth/forgot-password",
                          json={"email": f"nobody+{uuid.uuid4().hex[:8]}@example.com"})
        assert r.status_code == 200
        assert r.json() == {"ok": True}

    def test_reset_end_to_end(self):
        email = f"reset2+{uuid.uuid4().hex[:8]}@example.com"
        _register(email, password="OldPass1234!")
        r = requests.post(f"{API}/auth/forgot-password", json={"email": email})
        assert r.status_code == 200
        toks = _fetch_token(email)
        token = toks[0]["token"]

        new_pw = "NewPass5678!"
        r2 = requests.post(f"{API}/auth/reset-password", json={"token": token, "password": new_pw})
        assert r2.status_code == 200
        assert r2.json()["ok"]

        # login with new password
        r3 = requests.post(f"{API}/auth/login", json={"email": email, "password": new_pw})
        assert r3.status_code == 200

        # old password rejected
        r4 = requests.post(f"{API}/auth/login", json={"email": email, "password": "OldPass1234!"})
        assert r4.status_code == 401

        # reuse token
        r5 = requests.post(f"{API}/auth/reset-password", json={"token": token, "password": "AnotherPw123"})
        assert r5.status_code == 400

    def test_reset_invalid_token(self):
        r = requests.post(f"{API}/auth/reset-password",
                          json={"token": "definitely-not-a-real-token", "password": "SomePw123"})
        assert r.status_code == 400

    def test_reset_password_too_short(self):
        email = f"reset3+{uuid.uuid4().hex[:8]}@example.com"
        _register(email)
        requests.post(f"{API}/auth/forgot-password", json={"email": email})
        toks = _fetch_token(email)
        token = toks[0]["token"]
        r = requests.post(f"{API}/auth/reset-password", json={"token": token, "password": "abc"})
        assert r.status_code == 400

    def test_reset_expired_token(self):
        """Manually insert an expired token, ensure it's rejected."""
        email = f"reset4+{uuid.uuid4().hex[:8]}@example.com"
        data = _register(email)

        async def _insert():
            client = AsyncIOMotorClient(MONGO_URL)
            try:
                tok = f"expired-{uuid.uuid4().hex}"
                await client[DB_NAME].password_reset_tokens.insert_one({
                    "token": tok, "user_id": data["id"], "email": email,
                    "expires_at": datetime.now(timezone.utc) - timedelta(hours=1),
                    "used": False, "created_at": datetime.now(timezone.utc).isoformat(),
                })
                return tok
            finally:
                client.close()

        token = asyncio.get_event_loop().run_until_complete(_insert())
        r = requests.post(f"{API}/auth/reset-password", json={"token": token, "password": "GoodPw123"})
        assert r.status_code == 400


class TestCityInterest:
    def test_city_request_creates_records(self):
        payload = {
            "city": "London", "vehicle_type": "executive",
            "budget": "£300-£400", "note": "asap",
            "name": "Req Test",
            "email": f"cityreq+{uuid.uuid4().hex[:8]}@example.com",
            "phone": "07000000123",
        }
        r = requests.post(f"{API}/city-interest", json=payload)
        assert r.status_code == 200
        assert r.json()["ok"]

        # verify persistence via Mongo
        async def _check():
            client = AsyncIOMotorClient(MONGO_URL)
            try:
                cr = await client[DB_NAME].city_requests.find_one({"email": payload["email"]})
                lead = await client[DB_NAME].leads.find_one({"email": payload["email"], "source": "city_request"})
                return cr, lead
            finally:
                client.close()
        cr, lead = asyncio.get_event_loop().run_until_complete(_check())
        assert cr is not None
        assert cr["city"] == "London"
        assert cr["budget"] == "£300-£400"
        assert lead is not None
        assert lead["source"] == "city_request"
