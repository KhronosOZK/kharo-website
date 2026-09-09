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

from emailer import send_welcome, send_reset, send_alert, fire

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
        ip = (request.headers.get("x-forwarded-for", "").split(",")[0].strip()
              or (request.client.host if request.client else "unknown"))
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
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: str = "driver"
    dob: Optional[str] = None
    dvla_licence: Optional[str] = None
    pco_licence: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class QuoteIn(BaseModel):
    listing_id: Optional[str] = None
    age: Optional[int] = 35
    years_experience: Optional[int] = 3
    ncb_years: Optional[int] = 2
    convictions: Optional[bool] = False
    cover_level: str = "comprehensive"
    policy_length: str = "annual"

class ApplicationIn(BaseModel):
    listing_id: str
    full_name: str
    email: EmailStr
    phone: str
    dob: Optional[str] = None
    dvla_licence: Optional[str] = None
    pco_licence: Optional[str] = None
    years_experience: Optional[int] = None
    previous_incidents: Optional[str] = None
    duration_weeks: Optional[int] = None
    insurance_details: Optional[dict] = None
    estimated_weekly_cost: Optional[float] = None

class InterestIn(BaseModel):
    company_name: str
    companies_house: Optional[str] = None
    tfl_operator_licence: Optional[str] = None
    fleet_size: str
    areas: str
    contact_name: str
    role: Optional[str] = None
    email: EmailStr
    phone: str
    heard_from: Optional[str] = None
    vehicle_types: Optional[str] = None

class DriverInterestIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    dob: Optional[str] = None
    dvla_licence: Optional[str] = None
    pco_licence: Optional[str] = None
    years_experience: Optional[str] = None
    city: Optional[str] = None
    car_type: Optional[str] = None
    availability: Optional[str] = None
    notes: Optional[str] = None
    heard_from: Optional[str] = None

class EventIn(BaseModel):
    type: str
    data: Optional[dict] = None

class CityInterestIn(BaseModel):
    city: str
    name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    vehicle_type: Optional[str] = None
    budget: Optional[str] = None
    note: Optional[str] = None

class LeadIn(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    source: str = "unknown"
    data: Optional[dict] = None

class MarketplaceInterestIn(BaseModel):
    """Demand capture for the vehicle sales marketplace.

    intent is 'sell', 'buy' or 'both'. Sellers describe the vehicle they want
    to move; buyers describe what they are hunting for. Both sides land in the
    same collection so the split can be read off directly.
    """
    intent: str = "buy"
    name: str
    email: EmailStr
    phone: str
    city: Optional[str] = None
    # seller side
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[str] = None
    mileage: Optional[str] = None
    fuel: Optional[str] = None
    pco_expiry: Optional[str] = None
    asking_price: Optional[str] = None
    condition: Optional[str] = None
    timeframe: Optional[str] = None
    vehicle_count: Optional[str] = None
    # buyer side
    looking_for: Optional[str] = None
    budget: Optional[str] = None
    min_pco_months: Optional[str] = None
    finance_interest: Optional[str] = None
    # shared
    seller_type: Optional[str] = None
    listing_id: Optional[str] = None
    notes: Optional[str] = None
    heard_from: Optional[str] = None

# ---------------------------------------------------------------- Auth routes
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
    return {"id": uid, "name": user["name"], "email": email, "phone": user.get("phone"), "role": user["role"], "token": token}

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

class ForgotIn(BaseModel):
    email: EmailStr

class ResetIn(BaseModel):
    token: str
    password: str

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
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
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

@api.get("/marketplace")
async def list_sale_listings(city: Optional[str] = None, vehicle_type: Optional[str] = None,
                             fuel: Optional[str] = None, seller_type: Optional[str] = None,
                             max_price: Optional[int] = None, min_price: Optional[int] = None,
                             min_pco_months: Optional[int] = None, sort: Optional[str] = None,
                             q: Optional[str] = None, ids: Optional[str] = None):
    text = (q or "").strip()
    q = {}
    if ids:
        q["id"] = {"$in": [i for i in ids.split(",") if i]}
    if text:
        # Match make, model or registration so a driver can search "prius" directly.
        safe = re.escape(text)
        q["$or"] = [
            {"make": {"$regex": safe, "$options": "i"}},
            {"model": {"$regex": safe, "$options": "i"}},
            {"plate": {"$regex": safe, "$options": "i"}},
        ]
    if city and city != "all":
        q["city"] = city
    if vehicle_type and vehicle_type != "any":
        q["vehicle_type"] = vehicle_type
    if fuel and fuel != "any":
        q["fuel"] = fuel
    if seller_type and seller_type != "any":
        q["seller_type"] = seller_type
    price_q = {}
    if min_price:
        price_q["$gte"] = min_price
    if max_price:
        price_q["$lte"] = max_price
    if price_q:
        q["price"] = price_q

    docs = await db.sale_listings.find(q, {"_id": 0}).to_list(300)
    docs = [_decorate_sale(d) for d in docs]

    if min_pco_months:
        docs = [d for d in docs if (d.get("pco_months_left") or 0) >= min_pco_months]

    if sort == "price_asc":
        docs.sort(key=lambda d: d["price"])
    elif sort == "price_desc":
        docs.sort(key=lambda d: -d["price"])
    elif sort == "mileage":
        docs.sort(key=lambda d: d["mileage"])
    elif sort == "pco":
        docs.sort(key=lambda d: -(d.get("pco_months_left") or 0))
    elif sort == "newest":
        docs.sort(key=lambda d: d.get("listed_on", ""), reverse=True)
    else:
        # Default order rewards a long licence and a fresh listing, because
        # those are the two things a working driver actually shops on.
        docs.sort(key=lambda d: ((d.get("pco_months_left") or 0), d.get("listed_on", "")), reverse=True)
    return docs

@api.get("/marketplace/{listing_id}")
async def get_sale_listing(listing_id: str):
    doc = await db.sale_listings.find_one({"id": listing_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Listing not found")
    await db.events.insert_one({"type": "sale_listing_view", "data": {"listing_id": listing_id},
                                "created_at": now_iso()})
    doc = _decorate_sale(doc)

    # Price context, so a buyer can tell whether this is keenly priced.
    peers = await db.sale_listings.find(
        {"vehicle_type": doc["vehicle_type"], "fuel": doc["fuel"], "id": {"$ne": listing_id}},
        {"_id": 0, "price": 1},
    ).to_list(200)
    prices = sorted(p["price"] for p in peers)
    if len(prices) >= 4:
        median = prices[len(prices) // 2]
        cheaper_than = sum(1 for p in prices if p > doc["price"])
        doc["price_context"] = {
            "median": median,
            "sample": len(prices),
            "difference": doc["price"] - median,
            "percentile": round(cheaper_than / len(prices) * 100),
        }

    # What the equivalent car costs to rent, which is the real alternative.
    rentals = await db.listings.find(
        {"vehicle_type": doc["vehicle_type"], "city": doc["city"]}, {"_id": 0, "weekly_rent": 1},
    ).to_list(200)
    rents = sorted(r["weekly_rent"] for r in rentals)
    if rents:
        doc["typical_weekly_rent"] = rents[len(rents) // 2]

    # Similar vehicles, ranked by how close the price is.
    pool = await db.sale_listings.find(
        {"id": {"$ne": listing_id}, "vehicle_type": doc["vehicle_type"], "status": "available"},
        {"_id": 0},
    ).to_list(200)
    if len(pool) < 3:
        pool += await db.sale_listings.find(
            {"id": {"$ne": listing_id}, "city": doc["city"], "status": "available"}, {"_id": 0},
        ).to_list(200)
    seen, similar = set(), []
    for p in sorted(pool, key=lambda x: abs(x["price"] - doc["price"])):
        if p["id"] in seen:
            continue
        seen.add(p["id"])
        similar.append(_decorate_sale(p))
        if len(similar) == 3:
            break
    doc["similar"] = similar
    return doc

@api.post("/marketplace-interest", dependencies=[Depends(rate_limit("marketplace_interest", 10))])
async def create_marketplace_interest(body: MarketplaceInterestIn):
    intent = body.intent if body.intent in ("sell", "buy", "both") else "buy"
    doc = body.model_dump()
    doc["intent"] = intent
    doc["email"] = doc["email"].lower()
    doc["created_at"] = now_iso()
    await db.marketplace_interests.insert_one(doc)
    await db.leads.insert_one({
        "name": body.name, "email": body.email.lower(), "phone": body.phone,
        "source": f"marketplace_{intent}", "created_at": now_iso(),
        "data": {"city": body.city, "looking_for": body.looking_for,
                 "make": body.make, "model": body.model, "budget": body.budget,
                 "asking_price": body.asking_price, "listing_id": body.listing_id},
    })
    label = {"sell": "wants to sell", "buy": "wants to buy", "both": "wants to buy and sell"}[intent]
    fire(send_alert(f"Marketplace, {label}", {
        "Name": body.name, "Email": body.email.lower(), "Phone": body.phone,
        "City": body.city, "Vehicle": f"{body.make or ''} {body.model or ''}".strip() or body.looking_for,
        "Price": body.asking_price or body.budget, "Timeframe": body.timeframe,
    }))
    return {"ok": True, "intent": intent}

@api.get("/marketplace-demand")
async def marketplace_demand():
    """Public counts so both sides can see the market filling up."""
    async def n(intent):
        return await db.marketplace_interests.count_documents({"intent": intent})
    sellers = await n("sell")
    buyers = await n("buy")
    both = await n("both")
    listings = await db.sale_listings.count_documents({})
    return {
        "sellers": sellers + both,
        "buyers": buyers + both,
        "total": sellers + buyers + both,
        "listings": listings,
    }

# ---------------------------------------------------------------- Quote engine
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
        "name": body.full_name, "email": body.email.lower(), "phone": body.phone,
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
        "name": body.contact_name, "email": body.email.lower(), "phone": body.phone,
        "source": "operator_interest", "created_at": now_iso(),
        "data": {"company_name": body.company_name, "fleet_size": body.fleet_size, "areas": body.areas},
    })
    fire(send_alert("Operator fleet interest", {"Company": body.company_name, "Contact": body.contact_name,
                                                "Email": body.email.lower(), "Phone": body.phone, "Fleet size": body.fleet_size, "Areas": body.areas}))
    return {"ok": True}

@api.post("/driver-interest", dependencies=[Depends(rate_limit("driver_interest", 10))])
async def create_driver_interest(body: DriverInterestIn):
    doc = body.model_dump()
    doc["email"] = doc["email"].lower()
    doc["created_at"] = now_iso()
    await db.driver_interests.insert_one(doc)
    await db.leads.insert_one({
        "name": body.name, "email": body.email.lower(), "phone": body.phone,
        "source": "driver_interest", "created_at": now_iso(),
        "data": {"city": body.city, "car_type": body.car_type, "years_experience": body.years_experience,
                 "dvla_licence": body.dvla_licence, "pco_licence": body.pco_licence, "availability": body.availability},
    })
    fire(send_alert("New driver interest", {"Name": body.name, "Email": body.email.lower(), "Phone": body.phone,
                                            "City": body.city, "Wants": body.car_type, "Experience": body.years_experience}))
    return {"ok": True}

@api.post("/leads", dependencies=[Depends(rate_limit("leads", 15))])
async def create_lead(body: LeadIn):
    doc = body.model_dump()
    if doc.get("email"):
        doc["email"] = doc["email"].lower()
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
    doc["email"] = doc["email"].lower()
    doc["created_at"] = now_iso()
    await db.city_requests.insert_one(doc)
    await db.leads.insert_one({
        "name": body.name, "email": body.email.lower(), "phone": body.phone,
        "source": "city_request", "created_at": now_iso(),
        "data": {"city": body.city, "vehicle_type": body.vehicle_type},
    })
    fire(send_alert("Car / city request", {"City": body.city, "Wants": body.vehicle_type, "Budget": body.budget,
                                           "Note": body.note, "Email": body.email.lower(), "Phone": body.phone}))
    return {"ok": True}

@api.get("/city-demand")
async def city_demand():
    pipeline = [{"$group": {"_id": "$city", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    rows = await db.city_requests.aggregate(pipeline).to_list(100)
    return [{"city": r["_id"], "requests": r["count"]} for r in rows]

@api.get("/stats")
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
        "marketplace_sellers": await db.marketplace_interests.count_documents({"intent": {"$in": ["sell", "both"]}}),
        "marketplace_buyers": await db.marketplace_interests.count_documents({"intent": {"$in": ["buy", "both"]}}),
        "marketplace_interests": await db.marketplace_interests.count_documents({}),
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
    }

    marketplace = {
        "sellers": await db.marketplace_interests.count_documents({"intent": {"$in": ["sell", "both"]}}),
        "buyers": await db.marketplace_interests.count_documents({"intent": {"$in": ["buy", "both"]}}),
        "listings": await db.sale_listings.count_documents({}),
        "views": await db.events.count_documents({"type": "sale_listing_view"}),
        "by_city": await agg_city("marketplace_interests", "city"),
    }

    return {
        "funnel": funnel,
        "marketplace": marketplace,
        "trend": trend,
        "lead_sources": [{"label": r["_id"], "count": r["n"]} for r in lead_sources if r["_id"]],
        "city_demand": await agg_city("city_requests", "city"),
        "total_leads": await db.leads.count_documents({}),
    }

@api.get("/admin/{collection}")
async def admin_list(collection: str, _: dict = Depends(require_admin)):
    allowed = {"leads", "applications", "interests", "events", "users", "city_requests", "marketplace_interests"}
    if collection not in allowed:
        raise HTTPException(status_code=404, detail="Unknown collection")
    proj = {"_id": 0, "password_hash": 0} if collection == "users" else {"_id": 0}
    docs = await db[collection].find({}, proj).sort("created_at", -1).to_list(1000)
    return docs

@api.get("/admin/export/{collection}")
async def admin_export(collection: str, _: dict = Depends(require_admin)):
    allowed = {"leads", "applications", "interests", "events", "users", "city_requests", "marketplace_interests"}
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

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    # Fail closed. A wildcard origin combined with credentials is rejected by
    # browsers anyway, and leaving it as the default means an unset env var
    # silently opens the API to any site. Set CORS_ORIGINS in production.
    allow_origins=[o.strip() for o in os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',') if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
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

async def seed_sale_listings():
    """Refresh the demo sale inventory so licensing dates never go stale."""
    from marketplace_data import build_sale_listings
    for x in build_sale_listings():
        await db.sale_listings.update_one({"id": x["id"]}, {"$set": dict(x)}, upsert=True)

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.listings.create_index("id")
    await db.sale_listings.create_index("id")
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await seed_admin()
    await seed_listings()
    await seed_sale_listings()
    await db.listings.update_many({"city": {"$exists": False}}, {"$set": {"city": "London"}})

@app.on_event("shutdown")
async def shutdown():
    client.close()
