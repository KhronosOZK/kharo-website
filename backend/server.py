from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import io
import csv
import re
import jwt
import bcrypt
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, BeforeValidator, EmailStr, ConfigDict
from bson import ObjectId

from emailer import send_welcome, send_reset, send_alert, send_interest_thanks, fire

# ---------------------------------------------------------------- DB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Kharo API")
api = APIRouter(prefix="/api")

# ---------------------------------------------------------------- Rate limiting
_RATE_BUCKETS: dict = {}

def rate_limit(bucket: str, limit: int, window_seconds: int = 3600):
    """Fixed-window limiter keyed by client IP.

    Public write endpoints are what matter here: the whole point of the
    pre-launch site is to measure genuine demand, and unthrottled forms let one
    script turn that number into noise. In-memory is deliberate; it resets on
    deploy and is not shared across workers, which is fine at this stage. Move
    to Redis before running more than one process.
    """
    async def _dep(request: Request):
        # request.client.host is the TCP peer address, which cannot be forged
        # by the caller. Trusting the leftmost X-Forwarded-For entry instead
        # (the previous behaviour) let anyone reset their own rate-limit
        # bucket on every request by sending a fresh, made-up XFF header, which
        # defeats the limiter entirely. If this API is ever placed behind a
        # proxy that does NOT already resolve request.client.host to the real
        # client (Render does), set TRUST_PROXY_HEADERS=1 and audit that the
        # proxy overwrites/strips any inbound XFF before appending its own hop.
        if os.environ.get("TRUST_PROXY_HEADERS") == "1":
            xff = request.headers.get("x-forwarded-for", "")
            ip = xff.split(",")[-1].strip() or (request.client.host if request.client else "unknown")
        else:
            ip = request.client.host if request.client else "unknown"
        now = datetime.now(timezone.utc).timestamp()
        key = (bucket, ip)
        hits = [t for t in _RATE_BUCKETS.get(key, []) if now - t < window_seconds]
        if len(hits) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests. Please try again shortly.")
        hits.append(now)
        _RATE_BUCKETS[key] = hits
        if len(_RATE_BUCKETS) > 5000:
            stale = [k for k, v in _RATE_BUCKETS.items() if not any(now - t < window_seconds for t in v)]
            for k in stale:
                _RATE_BUCKETS.pop(k, None)
    return _dep


JWT_ALGORITHM = "HS256"

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {"sub": user_id, "email": email, "role": role,
               "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "access"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ---------------------------------------------------------------- Models
#
# Every free-text field below is capped with max_length. Without a bound, a
# client can submit a multi-megabyte string in any of these (a Pydantic
# `str` field with no constraint accepts arbitrary length), which lands in
# Mongo, gets echoed back through /admin/* and /admin/export/*, and costs
# nothing to send but real memory/CPU/storage to store and serialize. Caps
# below are generous relative to real-world values for each field.
NAME_LEN = 120
SHORT_LEN = 60      # phone, licence numbers, single-word-ish fields
MED_LEN = 200        # areas, company names, free single-line fields
LONG_LEN = 2000      # notes / previous_incidents free text

class RegisterIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=NAME_LEN)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=SHORT_LEN)
    # No minimum previously: an empty or single-character password was
    # accepted at registration even though /auth/reset-password enforces a
    # 6-character minimum, so the two entry points disagreed. 8 is the
    # floor both now share (see reset_password below).
    password: str = Field(..., min_length=8, max_length=128)
    role: str = "driver"
    dob: Optional[str] = Field(None, max_length=20)
    dvla_licence: Optional[str] = Field(None, max_length=SHORT_LEN)
    pco_licence: Optional[str] = Field(None, max_length=SHORT_LEN)

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)

class QuoteIn(BaseModel):
    listing_id: Optional[str] = Field(None, max_length=SHORT_LEN)
    age: Optional[int] = Field(35, ge=16, le=100)
    years_experience: Optional[int] = Field(3, ge=0, le=80)
    ncb_years: Optional[int] = Field(2, ge=0, le=80)
    convictions: Optional[bool] = False
    cover_level: str = Field("comprehensive", max_length=SHORT_LEN)
    policy_length: str = Field("annual", max_length=SHORT_LEN)

class ApplicationIn(BaseModel):
    listing_id: str = Field(..., max_length=SHORT_LEN)
    full_name: str = Field(..., min_length=1, max_length=NAME_LEN)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=SHORT_LEN)
    dob: Optional[str] = Field(None, max_length=20)
    dvla_licence: Optional[str] = Field(None, max_length=SHORT_LEN)
    pco_licence: Optional[str] = Field(None, max_length=SHORT_LEN)
    years_experience: Optional[int] = Field(None, ge=0, le=80)
    previous_incidents: Optional[str] = Field(None, max_length=LONG_LEN)
    duration_weeks: Optional[int] = Field(None, ge=0, le=520)
    insurance_details: Optional[dict] = None
    estimated_weekly_cost: Optional[float] = Field(None, ge=0, le=100000)

class InterestIn(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=MED_LEN)
    companies_house: Optional[str] = Field(None, max_length=SHORT_LEN)
    tfl_operator_licence: Optional[str] = Field(None, max_length=SHORT_LEN)
    fleet_size: str = Field(..., max_length=SHORT_LEN)
    areas: str = Field(..., max_length=MED_LEN)
    contact_name: str = Field(..., min_length=1, max_length=NAME_LEN)
    role: Optional[str] = Field(None, max_length=SHORT_LEN)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=1, max_length=SHORT_LEN)
    heard_from: Optional[str] = Field(None, max_length=MED_LEN)
    vehicle_types: Optional[str] = Field(None, max_length=MED_LEN)

class DriverInterestIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=NAME_LEN)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=1, max_length=SHORT_LEN)
    dob: Optional[str] = Field(None, max_length=20)
    dvla_licence: Optional[str] = Field(None, max_length=SHORT_LEN)
    pco_licence: Optional[str] = Field(None, max_length=SHORT_LEN)
    years_experience: Optional[str] = Field(None, max_length=SHORT_LEN)
    city: Optional[str] = Field(None, max_length=MED_LEN)
    car_type: Optional[str] = Field(None, max_length=MED_LEN)
    availability: Optional[str] = Field(None, max_length=MED_LEN)
    notes: Optional[str] = Field(None, max_length=LONG_LEN)
    heard_from: Optional[str] = Field(None, max_length=MED_LEN)

class EventIn(BaseModel):
    type: str = Field(..., min_length=1, max_length=SHORT_LEN)
    data: Optional[dict] = None

class CityInterestIn(BaseModel):
    city: str = Field(..., min_length=1, max_length=MED_LEN)
    name: Optional[str] = Field(None, max_length=NAME_LEN)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=SHORT_LEN)
    vehicle_type: Optional[str] = Field(None, max_length=MED_LEN)
    budget: Optional[str] = Field(None, max_length=SHORT_LEN)
    note: Optional[str] = Field(None, max_length=LONG_LEN)

class LeadIn(BaseModel):
    name: Optional[str] = Field(None, max_length=NAME_LEN)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=SHORT_LEN)
    source: str = Field("unknown", max_length=SHORT_LEN)
    data: Optional[dict] = None


class ForgotIn(BaseModel):
    email: EmailStr

class ResetIn(BaseModel):
    token: str = Field(..., min_length=1, max_length=256)
    password: str = Field(..., min_length=8, max_length=128)

async def _issue(resp: Response, user_id: str, email: str, role: str):
    token = create_access_token(user_id, email, role)
    resp.set_cookie("access_token", token, httponly=True, secure=True,
                    samesite="none", max_age=604800, path="/")
    return token

@api.post("/auth/register", dependencies=[Depends(rate_limit("register", 10))])
async def register(body: RegisterIn, response: Response):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    role = body.role if body.role in ("driver", "operator") else "driver"
    doc = {
        "name": body.name, "email": email, "phone": body.phone,
        "password_hash": hash_password(body.password), "role": role,
        "dob": body.dob, "dvla_licence": body.dvla_licence, "pco_licence": body.pco_licence,
        "created_at": now_iso(),
    }
    res = await db.users.insert_one(doc)
    uid = str(res.inserted_id)
    await db.leads.insert_one({
        "name": body.name, "email": email, "phone": body.phone,
        "source": f"{role}_signup", "user_id": uid, "created_at": now_iso(),
        "data": {"dvla_licence": body.dvla_licence, "pco_licence": body.pco_licence, "dob": body.dob},
    })
    token = await _issue(response, uid, email, role)
    fire(send_welcome(role, email, body.name))
    fire(send_alert(f"New {role} signup", {"Name": body.name, "Email": email, "Phone": body.phone}))
    return {"id": uid, "name": body.name, "email": email, "phone": body.phone, "role": role, "token": token}

@api.post("/auth/login", dependencies=[Depends(rate_limit("login", 20))])
async def login(body: LoginIn, response: Response):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Wrong email or password")
    uid = str(user["_id"])
    token = await _issue(response, uid, email, user["role"])
    return {"id": uid, "name": user.get("name", ""), "email": email, "phone": user.get("phone"), "role": user["role"], "token": token}

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

@api.post("/auth/forgot-password", dependencies=[Depends(rate_limit("forgot", 5))])
async def forgot_password(body: ForgotIn):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if user:
        token = secrets.token_urlsafe(32)
        await db.password_reset_tokens.insert_one({
            "token": token, "user_id": str(user["_id"]), "email": email,
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=1),
            "used": False, "created_at": now_iso(),
        })
        base = os.environ.get("PUBLIC_BASE_URL", "").rstrip("/")
        fire(send_reset(email, f"{base}/reset-password?token={token}"))
    # Never reveal whether the email exists
    return {"ok": True}

@api.post("/auth/reset-password", dependencies=[Depends(rate_limit("reset", 10))])
async def reset_password(body: ResetIn):
    # ResetIn.password already enforces an 8-character minimum (matching
    # RegisterIn), so this is now a defence-in-depth check, not the only gate.
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    doc = await db.password_reset_tokens.find_one({"token": body.token})
    if not doc or doc.get("used"):
        raise HTTPException(status_code=400, detail="This reset link is invalid or has already been used")
    expires = doc["expires_at"]
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This reset link has expired")
    await db.users.update_one({"_id": ObjectId(doc["user_id"])}, {"$set": {"password_hash": hash_password(body.password)}})
    await db.password_reset_tokens.update_one({"token": body.token}, {"$set": {"used": True}})
    return {"ok": True}

@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

# ---------------------------------------------------------------- Listings
class DeleteRequestIn(BaseModel):
    email: EmailStr
    reason: Optional[str] = Field(None, max_length=LONG_LEN)

@api.post("/privacy/delete-request", dependencies=[Depends(rate_limit("delete_request", 5))])
async def privacy_delete_request(body: DeleteRequestIn):
    """The UK GDPR right to erasure, for people without an account: logged
    for a human to action within a month, and the admin alerted."""
    email = body.email.lower()
    await db.deletion_requests.insert_one({"email": email, "reason": body.reason, "status": "open", "created_at": now_iso()})
    fire(send_alert("Data deletion request", {"Email": email, "Reason": body.reason}))
    return {"ok": True}

@api.delete("/auth/me")
async def delete_me(user: dict = Depends(get_current_user)):
    """Erase a signed-in user and everything they submitted."""
    email = user["email"].lower()
    for coll in ("applications", "city_requests", "driver_interests", "leads", "interests", "password_reset_tokens"):
        await db[coll].delete_many({"email": email})
    await db.applications.delete_many({"user_id": user["id"]})
    await db.users.delete_one({"_id": ObjectId(user["id"])})
    return {"ok": True}

@api.get("/listings")
async def list_listings(city: Optional[str] = None, borough: Optional[str] = None, vehicle_type: Optional[str] = None,
                        fuel: Optional[str] = None, max_budget: Optional[int] = None,
                        breakdown: Optional[bool] = None, sort: Optional[str] = None):
    q = {}
    if city and city != "all":
        q["city"] = city
    if borough and borough != "all":
        q["borough"] = borough
    if vehicle_type and vehicle_type != "any":
        q["vehicle_type"] = vehicle_type
    if fuel and fuel != "any":
        q["fuel"] = fuel
    if max_budget:
        q["weekly_rent"] = {"$lte": max_budget}
    if breakdown:
        q["breakdown_included"] = True
    cursor = db.listings.find(q, {"_id": 0})
    docs = await cursor.to_list(200)
    if sort == "price_asc":
        docs.sort(key=lambda d: d["weekly_rent"])
    elif sort == "price_desc":
        docs.sort(key=lambda d: -d["weekly_rent"])
    elif sort == "rating":
        # No rating data exists pre-launch, so value leads instead.
        docs.sort(key=lambda d: d["weekly_rent"])
    return docs

@api.get("/listings/{listing_id}")
async def get_listing(listing_id: str):
    doc = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Listing not found")
    await db.events.insert_one({"type": "listing_view", "data": {"listing_id": listing_id},
                                "created_at": now_iso()})
    return doc

# ---------------------------------------------------------------- Marketplace (vehicles for sale)
def _months_left(iso_date: Optional[str]) -> Optional[int]:
    if not iso_date:
        return None
    try:
        target = datetime.fromisoformat(iso_date).date()
    except ValueError:
        return None
    today = datetime.now(timezone.utc).date()
    if target <= today:
        return 0
    months = (target.year - today.year) * 12 + (target.month - today.month)
    if target.day < today.day:
        months -= 1
    return max(months, 0)

def _decorate_sale(doc: dict) -> dict:
    doc["pco_months_left"] = _months_left(doc.get("pco_expiry"))
    doc["mot_months_left"] = _months_left(doc.get("mot_expiry"))
    return doc





@api.post("/quote", dependencies=[Depends(rate_limit("quote", 30))])
async def quote(body: QuoteIn):
    listing = None
    if body.listing_id:
        listing = await db.listings.find_one({"id": body.listing_id}, {"_id": 0})
    base = 52.0
    if listing:
        vt = listing.get("vehicle_type", "saloon")
        base += {"executive": 22, "mpv": 14, "wav": 10, "estate": 6, "saloon": 0}.get(vt, 0)
        if listing.get("fuel") == "electric":
            base += 8
    age = body.age or 35
    if age < 25:
        base *= 1.45
    elif age < 30:
        base *= 1.18
    base -= min((body.years_experience or 0), 8) * 1.4
    base -= min((body.ncb_years or 0), 9) * 1.9
    if body.convictions:
        base += 15
    base = max(base, 34.0)
    cheapest = round(base, 2)
    quotes = [
        {"insurer": "Northbridge Cover", "level": "Comprehensive", "weekly": cheapest,
         "note": "Includes breakdown & courtesy car", "cheapest": True},
        {"insurer": "Thameside Insurance", "level": "Comprehensive", "weekly": round(cheapest * 1.06, 2),
         "note": "Standard cover", "cheapest": False},
        {"insurer": "Mercer Cover", "level": "Third party, fire & theft", "weekly": round(cheapest * 0.82, 2),
         "note": "Lower cover, lower price", "cheapest": False},
    ]
    return {
        "cheapest_weekly": cheapest,
        "quotes": quotes,
        "indicative": True,
    }

# ---------------------------------------------------------------- Data capture
@api.post("/applications", dependencies=[Depends(rate_limit("applications", 10))])
async def create_application(body: ApplicationIn, request: Request):
    listing = await db.listings.find_one({"id": body.listing_id}, {"_id": 0})
    user_id = None
    try:
        u = await get_current_user(request)
        user_id = u["id"]
    except HTTPException:
        pass
    doc = body.model_dump()
    doc.update({
        "user_id": user_id, "status": "under_review", "created_at": now_iso(),
        "operator_code": listing.get("operator_code") if listing else None,
        "vehicle": f"{listing['make']} {listing['model']} {listing['year']}" if listing else None,
    })
    res = await db.applications.insert_one(doc)
    if user_id:
        profile = {k: v for k, v in {
            "phone": body.phone, "dob": body.dob, "dvla_licence": body.dvla_licence,
            "pco_licence": body.pco_licence, "years_experience": body.years_experience,
        }.items() if v not in (None, "")}
        if profile:
            await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": profile})
    await db.leads.insert_one({
        "name": body.full_name, "email": (body.email or "").lower(), "phone": body.phone,
        "source": "vehicle_application", "user_id": user_id, "created_at": now_iso(),
        "data": {"listing_id": body.listing_id, "vehicle": doc["vehicle"]},
    })
    return {"id": str(res.inserted_id), "status": "under_review"}

@api.get("/applications/me")
async def my_applications(user: dict = Depends(get_current_user)):
    docs = await db.applications.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return docs

@api.post("/interest", dependencies=[Depends(rate_limit("interest", 10))])
async def create_interest(body: InterestIn):
    doc = body.model_dump()
    doc["created_at"] = now_iso()
    await db.interests.insert_one(doc)
    await db.leads.insert_one({
        "name": body.contact_name, "email": (body.email or "").lower(), "phone": body.phone,
        "source": "operator_interest", "created_at": now_iso(),
        "data": {"company_name": body.company_name, "fleet_size": body.fleet_size, "areas": body.areas},
    })
    fire(send_alert("Operator fleet interest", {"Company": body.company_name, "Contact": body.contact_name,
                                                "Email": (body.email or "").lower(), "Phone": body.phone, "Fleet size": body.fleet_size, "Areas": body.areas}))
    if body.email: fire(send_interest_thanks("operator", (body.email or "").lower(), body.contact_name or body.company_name, body.areas or ""))
    return {"ok": True}

@api.post("/driver-interest", dependencies=[Depends(rate_limit("driver_interest", 10))])
async def create_driver_interest(body: DriverInterestIn):
    doc = body.model_dump()
    doc["email"] = (doc.get("email") or "").lower() or None
    doc["created_at"] = now_iso()
    await db.driver_interests.insert_one(doc)
    await db.leads.insert_one({
        "name": body.name, "email": (body.email or "").lower(), "phone": body.phone,
        "source": "driver_interest", "created_at": now_iso(),
        "data": {"city": body.city, "car_type": body.car_type, "years_experience": body.years_experience,
                 "dvla_licence": body.dvla_licence, "pco_licence": body.pco_licence, "availability": body.availability},
    })
    fire(send_alert("New driver interest", {"Name": body.name, "Email": (body.email or "").lower(), "Phone": body.phone,
                                            "City": body.city, "Wants": body.car_type, "Experience": body.years_experience}))
    if body.email: fire(send_interest_thanks("driver", (body.email or "").lower(), body.name, body.city or ""))
    return {"ok": True}

@api.post("/leads", dependencies=[Depends(rate_limit("leads", 15))])
async def create_lead(body: LeadIn):
    doc = body.model_dump()
    if doc.get("email"):
        doc["email"] = (doc.get("email") or "").lower() or None
    doc["created_at"] = now_iso()
    await db.leads.insert_one(doc)
    return {"ok": True}

@api.post("/events", dependencies=[Depends(rate_limit("events", 400))])
async def create_event(body: EventIn):
    await db.events.insert_one({"type": body.type, "data": body.data or {}, "created_at": now_iso()})
    return {"ok": True}

@api.post("/city-interest", dependencies=[Depends(rate_limit("city_interest", 10))])
async def city_interest(body: CityInterestIn):
    doc = body.model_dump()
    doc["email"] = (doc.get("email") or "").lower() or None
    doc["created_at"] = now_iso()
    await db.city_requests.insert_one(doc)
    await db.leads.insert_one({
        "name": body.name, "email": (body.email or "").lower(), "phone": body.phone,
        "source": "city_request", "created_at": now_iso(),
        "data": {"city": body.city, "vehicle_type": body.vehicle_type},
    })
    fire(send_alert("Car / city request", {"City": body.city, "Wants": body.vehicle_type, "Budget": body.budget,
                                           "Note": body.note, "Email": (body.email or "").lower(), "Phone": body.phone}))
    if body.email: fire(send_interest_thanks("driver", (body.email or "").lower(), body.name, body.city or ""))
    return {"ok": True}

@api.get("/city-demand", dependencies=[Depends(rate_limit("city_demand", 120))])
async def city_demand():
    pipeline = [{"$group": {"_id": "$city", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    rows = await db.city_requests.aggregate(pipeline).to_list(100)
    return [{"city": r["_id"], "requests": r["count"]} for r in rows]

@api.get("/stats", dependencies=[Depends(rate_limit("stats", 120))])
async def stats():
    real = {"company_name": {"$not": {"$regex": "(test|abc|abv|^demo)", "$options": "i"}}}
    drivers = await db.users.count_documents({"role": "driver", "email": {"$not": {"$regex": "^test", "$options": "i"}}})
    operators = await db.interests.count_documents(real)
    listings = await db.listings.count_documents({})
    apps = await db.applications.count_documents({})
    recent = await db.interests.find(real, {"_id": 0, "company_name": 1, "fleet_size": 1, "areas": 1, "created_at": 1}).sort("created_at", -1).to_list(6)
    return {"drivers": drivers, "operators": operators, "combined": drivers + operators,
            "listings": listings, "applications": apps, "recent_operators": recent}

# ---------------------------------------------------------------- Admin
@api.get("/admin/summary")
async def admin_summary(_: dict = Depends(require_admin)):
    return {
        "leads": await db.leads.count_documents({}),
        "drivers": await db.users.count_documents({"role": "driver"}),
        "applications": await db.applications.count_documents({}),
        "interests": await db.interests.count_documents({}),
        "events": await db.events.count_documents({}),
        "listing_views": await db.events.count_documents({"type": "listing_view"}),
        "searches": await db.events.count_documents({"type": "search"}),
        "city_requests": await db.city_requests.count_documents({}),
        "page_views": await db.events.count_documents({"type": "page_view"}),
    }

@api.get("/admin/analytics")
async def admin_analytics(_: dict = Depends(require_admin)):
    async def agg_city(coll, field):
        rows = await db[coll].aggregate([{"$group": {"_id": f"${field}", "n": {"$sum": 1}}}, {"$sort": {"n": -1}}, {"$limit": 12}]).to_list(12)
        return [{"label": r["_id"], "count": r["n"]} for r in rows if r["_id"]]
    lead_sources = await db.leads.aggregate([{"$group": {"_id": "$source", "n": {"$sum": 1}}}, {"$sort": {"n": -1}}]).to_list(20)

    async def daily(coll, match=None):
        rows = await db[coll].aggregate([
            {"$match": match or {}},
            {"$group": {"_id": {"$substr": ["$created_at", 0, 10]}, "n": {"$sum": 1}}},
        ]).to_list(2000)
        return {r["_id"]: r["n"] for r in rows if r["_id"]}

    leads_daily = await daily("leads")
    views_daily = await daily("events", {"type": "page_view"})
    signups_daily = await daily("users", {"role": "driver"})
    interests_daily = await daily("interests")
    today = datetime.now(timezone.utc).date()
    trend = []
    for i in range(13, -1, -1):
        d = (today - timedelta(days=i)).isoformat()
        trend.append({
            "date": d, "label": d[5:],
            "leads": leads_daily.get(d, 0), "views": views_daily.get(d, 0),
            "signups": signups_daily.get(d, 0), "interests": interests_daily.get(d, 0),
        })

    funnel = {
        "page_views": await db.events.count_documents({"type": "page_view"}),
        "searches": await db.events.count_documents({"type": "search"}),
        "listing_views": await db.events.count_documents({"type": "listing_view"}),
        "card_clicks": await db.events.count_documents({"type": "card_click"}),
        "applications": await db.applications.count_documents({}),
        "driver_signups": await db.users.count_documents({"role": "driver"}),
        "sale_listing_views": await db.events.count_documents({"type": "sale_listing_view"}),
        # Conversion counts are aggregated here rather than derived in the
        # browser from /admin/{collection}, which returns only the newest 1000
        # rows. Page views dominate that window, so once the site passes 1000
        # events a client-side count would drop waitlist conversions while page
        # views kept climbing, and the funnel would read as a collapse.
        "waitlist_start": await db.events.count_documents({"type": "waitlist_start"}),
        "waitlist_complete": await db.events.count_documents({"type": "waitlist_complete"}),
        "apply_start": await db.events.count_documents({"type": "apply_start"}),
        "apply_complete": await db.events.count_documents({"type": "apply_complete"}),
        "driver_interests": await db.driver_interests.count_documents({}),
        "operator_interests": await db.interests.count_documents({}),
        "city_requests": await db.city_requests.count_documents({}),
    }


    # What people searched for before they registered: the demand data for
    # investors. One search_filters event per settled filter change.
    async def top(field, limit=8, unwind=False):
        pipeline = [{"$match": {"type": "search_filters", f"data.{field}": {"$nin": [None, "", 0, []]}}}]
        if unwind:
            pipeline.append({"$unwind": f"$data.{field}"})
        pipeline += [{"$group": {"_id": f"$data.{field}", "n": {"$sum": 1}}}, {"$sort": {"n": -1}}, {"$limit": limit}]
        rows = await db.events.aggregate(pipeline).to_list(limit)
        return [{"label": str(r["_id"]), "count": r["n"]} for r in rows if r["_id"] not in (None, "")]

    budget_rows = await db.events.aggregate([
        {"$match": {"type": "search_filters", "data.budget_max": {"$type": "number"}}},
        {"$bucket": {"groupBy": "$data.budget_max", "boundaries": [0, 100, 150, 200, 250, 300, 400, 501, 100000],
                     "default": "other", "output": {"n": {"$sum": 1}}}},
    ]).to_list(20)
    band_label = {0: "Under £100", 100: "£100 to £149", 150: "£150 to £199", 200: "£200 to £249", 250: "£250 to £299", 300: "£300 to £399", 400: "£400 to £500", 501: "Over £500"}
    demand = {
        "searches": await db.events.count_documents({"type": "search_filters"}),
        "call_backs": await db.leads.count_documents({"source": "call_back"}),
        "budgets": [{"label": band_label.get(r["_id"], str(r["_id"])), "count": r["n"]} for r in budget_rows if r["_id"] != "other"],
        "cities": await top("city"),
        "councils": await top("councils", unwind=True),
        "makes": await top("make"),
        "fuel": await top("fuel"),
        "sort": await top("sort", limit=5),
        "cars_requested": await agg_city("city_requests", "vehicle_type"),
    }

    return {
        "funnel": funnel,
        "trend": trend,
        "lead_sources": [{"label": r["_id"], "count": r["n"]} for r in lead_sources if r["_id"]],
        "city_demand": await agg_city("city_requests", "city"),
        "total_leads": await db.leads.count_documents({}),
        "demand": demand,
    }

@api.get("/admin/{collection}")
async def admin_list(collection: str, _: dict = Depends(require_admin)):
    allowed = {"leads", "applications", "interests", "driver_interests", "events", "users", "city_requests"}
    if collection not in allowed:
        raise HTTPException(status_code=404, detail="Unknown collection")
    proj = {"_id": 0, "password_hash": 0} if collection == "users" else {"_id": 0}
    docs = await db[collection].find({}, proj).sort("created_at", -1).to_list(1000)
    return docs

@api.get("/admin/export/{collection}")
async def admin_export(collection: str, _: dict = Depends(require_admin)):
    allowed = {"leads", "applications", "interests", "driver_interests", "events", "users", "city_requests"}
    if collection not in allowed:
        raise HTTPException(status_code=404, detail="Unknown collection")
    proj = {"_id": 0, "password_hash": 0} if collection == "users" else {"_id": 0}
    docs = await db[collection].find({}, proj).to_list(5000)
    fields = []
    for d in docs:
        for k in d.keys():
            if k not in fields:
                fields.append(k)
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=fields or ["empty"])
    writer.writeheader()
    for d in docs:
        writer.writerow({k: (str(v) if isinstance(v, (dict, list)) else v) for k, v in d.items()})
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": f"attachment; filename=kharo_{collection}.csv"})

app.include_router(api)

# ---------------------------------------------------------------- Request size guard
# Starlette/FastAPI do not cap request body size by default, so any POST
# endpoint would otherwise accept an arbitrarily large body even with tight
# Pydantic field constraints on top (the oversized body is still fully read
# and parsed as JSON before validation can reject it). Reject early based on
# Content-Length; nothing this app accepts legitimately is over ~200KB.
MAX_BODY_BYTES = 300_000

@app.middleware("http")
async def limit_body_size(request: Request, call_next):
    cl = request.headers.get("content-length")
    if cl is not None:
        try:
            if int(cl) > MAX_BODY_BYTES:
                return Response(status_code=413, content="Request body too large")
        except ValueError:
            pass
    return await call_next(request)

# ---------------------------------------------------------------- Security headers
# Baseline hardening headers for every response. CSP is intentionally left to
# the frontend's own hosting config (see frontend/vercel.json) since this API
# serves JSON/CSV, not HTML, so there is nothing here for a CSP to protect
# beyond what these headers already cover.
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), "
        "interest-cohort=()"
    )
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    # Fail closed. A wildcard origin combined with credentials is rejected by
    # browsers anyway, and leaving it as the default means an unset env var
    # silently opens the API to any site. Set CORS_ORIGINS in production.
    allow_origins=[o.strip() for o in os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',') if o.strip()],
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ---------------------------------------------------------------- Seed
async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].lower()
    pwd = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one({"name": "Kharo Ops", "email": email, "phone": "",
                                   "password_hash": hash_password(pwd), "role": "admin",
                                   "created_at": now_iso()})
    elif not verify_password(pwd, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(pwd)}})

async def seed_listings():
    from seed_data import LISTINGS
    for x in LISTINGS:
        await db.listings.update_one({"id": x["id"]}, {"$set": dict(x)}, upsert=True)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.listings.create_index("id")
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await seed_admin()
    await seed_listings()
    await db.listings.update_many({"city": {"$exists": False}}, {"$set": {"city": "London"}})

@app.on_event("shutdown")
async def shutdown():
    client.close()
