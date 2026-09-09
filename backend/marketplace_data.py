# ---------------------------------------------------------------------------
# Kharo PHV Marketplace seed inventory
#
# Vehicles listed for SALE (not rental). Every entry reuses the photography
# already matched to that exact make / model / colour in seed_data.py, so a
# silver Prius listing shows a silver Prius.
#
# Licensing dates (PCO / PHV vehicle licence, MOT) are generated relative to
# the day the server starts, so the demo inventory never looks stale. Months
# remaining are recalculated on read, not stored.
# ---------------------------------------------------------------------------

from datetime import date, timedelta

from seed_data import _CATALOGUE, _variant

# ---------------------------------------------------------------------------
# Licensing authorities by city
# ---------------------------------------------------------------------------
AUTHORITIES = {
    "London": "Transport for London",
    "Birmingham": "Birmingham City Council",
    "Manchester": "Manchester City Council",
    "Leeds": "Leeds City Council",
    "Sheffield": "Sheffield City Council",
}

# city -> [(area, postcode)]
_AREAS = {
    "London": [
        ("Newham", "E13"), ("Croydon", "CR0"), ("Redbridge", "IG1"), ("Harrow", "HA1"),
        ("Barking & Dagenham", "IG11"), ("Hounslow", "TW3"), ("Ealing", "W5"),
        ("Tower Hamlets", "E14"), ("Brent", "NW10"), ("Waltham Forest", "E17"),
        ("Enfield", "EN1"), ("Wembley", "HA9"), ("Romford", "RM1"), ("Lewisham", "SE13"),
    ],
    "Birmingham": [
        ("Sparkhill", "B11"), ("Small Heath", "B10"), ("Alum Rock", "B8"),
        ("Handsworth", "B21"), ("Bordesley Green", "B9"), ("Erdington", "B23"),
    ],
    "Manchester": [
        ("Cheetham Hill", "M8"), ("Rusholme", "M14"), ("Longsight", "M13"),
        ("Levenshulme", "M19"), ("Moss Side", "M16"), ("Old Trafford", "M16"),
    ],
    "Leeds": [
        ("Harehills", "LS8"), ("Beeston", "LS11"), ("Chapeltown", "LS7"),
        ("Armley", "LS12"), ("Holbeck", "LS11"), ("City Centre", "LS1"),
    ],
    "Sheffield": [
        ("Burngreave", "S4"), ("Darnall", "S9"), ("Firth Park", "S5"),
        ("Attercliffe", "S9"), ("Sharrow", "S11"), ("Hillsborough", "S6"),
    ],
}

_SELLERS = [
    ("driver", "Private driver"),
    ("driver", "Private driver"),
    ("operator", "Fleet operator"),
    ("driver", "Private driver"),
    ("operator", "Fleet operator"),
]

_HISTORY = [
    "Full main dealer history",
    "Full service history",
    "Full service history",
    "Part service history",
]

_REASONS = [
    "Owner is upgrading to a newer hybrid",
    "Owner is moving to an electric vehicle",
    "Fleet renewal, vehicle surplus to requirements",
    "Owner is leaving the trade",
    "Second car no longer needed",
    "Fleet downsizing after a contract change",
]

_LETTERS = "ABCDEFGHJKLMNOPRSTUVWXYZ"


def _plate(city_code, year, idx):
    yy = year % 100
    a = _LETTERS[idx % len(_LETTERS)]
    b = _LETTERS[(idx * 3 + 5) % len(_LETTERS)]
    c = _LETTERS[(idx * 7 + 13) % len(_LETTERS)]
    tag = (city_code + "X")[:2].upper()
    return f"{tag}{yy:02d} {a}{b}{c}"


def _iso(d):
    return d.isoformat()


def months_between(today, target):
    """Whole months from today until target, floored at zero."""
    if target <= today:
        return 0
    months = (target.year - today.year) * 12 + (target.month - today.month)
    if target.day < today.day:
        months -= 1
    return max(months, 0)


# ---------------------------------------------------------------------------
# Sale price model
#
# Starts from a typical UK trade guide value for the model year, then adjusts
# for mileage and remaining PCO licence. A car with ten months of licence left
# is worth more to a working driver than the same car with one month left, so
# the model reflects that rather than pricing every vehicle the same.
# ---------------------------------------------------------------------------
_BASE_VALUE = {
    "saloon": 11500,
    "estate": 12500,
    "executive": 19500,
    "mpv": 16500,
    "wav": 21500,
}

_FUEL_UPLIFT = {"hybrid": 1400, "electric": 900, "petrol": 0, "diesel": -600}

# Marque multiplier. A Prius and a Model 3 are both worth working from, but
# they do not sell for the same money, and a flat body-type base would price
# them identically. Values reflect typical UK used trade positioning.
_MARQUE = {
    "Tesla": 1.18, "Polestar": 1.12, "Mercedes-Benz": 1.10, "BMW": 1.08, "Audi": 1.06,
    "Toyota": 1.00, "Lexus": 1.14, "Honda": 0.96, "Hyundai": 0.94, "Kia": 0.94,
    "Nissan": 0.90, "Volkswagen": 0.95, "Skoda": 0.92, "Ford": 0.88, "Vauxhall": 0.85,
    "SEAT": 0.90, "Peugeot": 0.86, "Citroen": 0.84, "Renault": 0.86, "MG": 0.88,
}


def _price(make, vtype, fuel, year, mileage, pco_months):
    base = _BASE_VALUE.get(vtype, 11500) + _FUEL_UPLIFT.get(fuel, 0)
    base += (year - 2020) * 1450
    base *= _MARQUE.get(make, 1.0)
    # PHV cars cover serious mileage, so the penalty compounds past 40k.
    base -= max(mileage - 40000, 0) // 1000 * 68
    # A long licence is worth real money to a working driver.
    base += pco_months * 45
    return max(int(round(base / 50.0) * 50), 3500)


_CITY_PLAN = [
    ("London", "L", 26, 1),
    ("Birmingham", "B", 6, 101),
    ("Manchester", "M", 6, 121),
    ("Leeds", "LS", 5, 141),
    ("Sheffield", "S", 5, 161),
]


def build_sale_listings(today=None):
    """Return the full demo sale inventory, dated relative to `today`."""
    today = today or date.today()
    out = []

    for city, code, count, id_start in _CITY_PLAN:
        areas = _AREAS[city]
        authority = AUTHORITIES[city]

        for i in range(count):
            # 7 is coprime with the catalogue length, so consecutive listings
            # walk the whole catalogue instead of looping over a third of it.
            row = _CATALOGUE[(id_start * 5 + i * 7 + 3) % len(_CATALOGUE)]
            v = _variant(row, i)
            area, postcode = areas[i % len(areas)]
            seller_key, seller_label = _SELLERS[i % len(_SELLERS)]

            year = [2019, 2020, 2021, 2022, 2023][(i + 1) % 5]
            mileage = 42000 + (2023 - year) * 21000 + (i * 1471) % 14000

            # PCO licence expiry spread from 1 to 11 months out, MOT from 2 to 12
            pco_days = 28 + ((i * 47) % 300)
            mot_days = 55 + ((i * 61) % 300)
            pco_expiry = today + timedelta(days=pco_days)
            mot_expiry = today + timedelta(days=mot_days)
            pco_months = months_between(today, pco_expiry)

            price = _price(v["make"], v["vtype"], v["fuel"], year, mileage, pco_months)
            open_to_offers = i % 3 != 1
            ulez = "Exempt" if v["fuel"] == "electric" else "Compliant"

            idn = id_start + i
            where = area if city == "London" else f"{area}, {city}"

            out.append({
                "id": f"sl-{idn:03d}",
                "make": v["make"],
                "model": v["model"],
                "year": year,
                "colour": v["colour"],
                "plate": _plate(code, year, i),
                "vehicle_type": v["vtype"],
                "fuel": v["fuel"],
                "transmission": "Automatic",
                "mpg": v["mpg"],
                "seats": v["seats"],
                "mileage": mileage,
                "price": price,
                "open_to_offers": open_to_offers,
                "part_exchange": i % 4 == 0,
                "city": city,
                "borough": area,
                "postcode": postcode,
                "licensing_authority": authority,
                "pco_expiry": _iso(pco_expiry),
                "mot_expiry": _iso(mot_expiry),
                "ulez": ulez,
                "owners": 1 + (i % 3),
                "service_history": _HISTORY[i % len(_HISTORY)],
                "v5c_present": True,
                "seller_type": seller_key,
                "seller_label": seller_label,
                "seller_area": where,
                "reason_for_sale": _REASONS[i % len(_REASONS)],
                "features": v["feats"],
                "status": "under_offer" if i % 11 == 7 else "available",
                "listed_on": _iso(today - timedelta(days=(i * 5) % 26)),
                "description": (
                    f"{v['colour']} {year} {v['make']} {v['model']}, licensed for private hire "
                    f"in {where} and ready to work. {v['seats']} seats, automatic, "
                    f"{'ULEZ exempt' if ulez == 'Exempt' else 'ULEZ compliant'}, "
                    f"{_HISTORY[i % len(_HISTORY)].lower()} and {1 + (i % 3)} former "
                    f"{'keeper' if (1 + (i % 3)) == 1 else 'keepers'}. "
                    f"{_REASONS[i % len(_REASONS)]}."
                ),
                "photos": v["photos"],
            })

    return out


SALE_LISTINGS = build_sale_listings()
