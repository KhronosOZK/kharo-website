#!/usr/bin/env python3
"""
Generates src/data/mockListings.js: the pre-launch preview inventory.

Every listing is representative, not a real vehicle, and the site labels it as
such. What IS accurate here and must stay accurate:

  * the licensing authority for each city (TfL licenses London, councils
    license everywhere else), and the wording of the licence itself
  * which vehicles are plausible private hire vehicles in the UK
  * weekly rent, which is RENT ONLY. Kharo quotes insurance separately, so
    these figures sit below the bundled weekly prices the incumbents quote.

Rerun with:  python3 scripts/build-listings.py
"""
import random
from collections import Counter

TOTAL = 218

# Licensing. London is TfL; everywhere else it is the local council.
# Wolverhampton licenses heavily for cross-border work: a driver, vehicle and
# operator all licensed there may legally work across England and Wales.
CITIES = {
    "London":        dict(n=88, authority="Transport for London (TfL)",
                          licence="TfL private hire vehicle licence (PCO)", cross_border=False),
    "Birmingham":    dict(n=32, authority="Birmingham City Council",
                          licence="Birmingham City Council PHV plate", cross_border=False),
    "Manchester":    dict(n=30, authority="Manchester City Council",
                          licence="Manchester City Council PHV plate", cross_border=False),
    "Leeds":         dict(n=22, authority="Leeds City Council",
                          licence="Leeds City Council PHV plate", cross_border=False),
    "Wolverhampton": dict(n=18, authority="City of Wolverhampton Council",
                          licence="City of Wolverhampton Council PHV plate", cross_border=True),
    "Sheffield":     dict(n=16, authority="Sheffield City Council",
                          licence="Sheffield City Council PHV plate", cross_border=False),
    "Liverpool":     dict(n=12, authority="Liverpool City Council",
                          licence="Liverpool City Council PHV plate", cross_border=False),
}

AREAS = {
    "London": ["Camden", "Croydon", "Hackney", "Hammersmith & Fulham", "Islington", "Lambeth",
               "Lewisham", "Newham", "Southwark", "Tower Hamlets", "Wandsworth", "Westminster",
               "Greenwich", "Barking & Dagenham", "Ealing", "Brent", "Enfield", "Redbridge"],
    "Birmingham": ["City Centre", "Edgbaston", "Sparkhill", "Aston", "Moseley", "Erdington",
                   "Selly Oak", "Handsworth", "Small Heath", "Bordesley Green"],
    "Manchester": ["City Centre", "Salford", "Trafford", "Didsbury", "Chorlton", "Ancoats",
                   "Cheetham Hill", "Rusholme", "Wythenshawe", "Longsight"],
    "Leeds": ["City Centre", "Headingley", "Chapel Allerton", "Roundhay", "Armley", "Bramley",
              "Harehills", "Beeston", "Hyde Park", "Horsforth"],
    "Wolverhampton": ["City Centre", "Bilston", "Wednesfield", "Penn", "Tettenhall",
                      "Whitmore Reans", "Bushbury", "Blakenhall"],
    "Sheffield": ["City Centre", "Burngreave", "Attercliffe", "Firth Park", "Darnall",
                  "Hillsborough", "Nether Edge", "Page Hall"],
    "Liverpool": ["City Centre", "Toxteth", "Wavertree", "Kensington", "Anfield", "Walton",
                  "Everton", "Old Swan"],
}

POSTCODE_PREFIX = {
    "London": ["E", "EC", "N", "NW", "SE", "SW", "W", "WC", "CR", "IG", "RM"],
    "Birmingham": ["B"], "Manchester": ["M"], "Leeds": ["LS"],
    "Wolverhampton": ["WV"], "Sheffield": ["S"], "Liverpool": ["L"],
}

# Photography. Every URL below was HTTP-verified. One exterior per model, so a
# Prius always shows the Prius: a fleet genuinely does look like this, and no
# two different models ever share a picture.
LOCAL = {
    "prius": "/images/listings/toyota-prius.jpg",
    "corolla": "/images/listings/toyota-corolla.jpg",
    "octavia": "/images/listings/skoda-octavia.jpg",
    "passat": "/images/listings/vw-passat-gte.jpg",
    "tucson": "/images/listings/hyundai-tucson.jpg",
}
# Matched catalogue: 36 make/model/colour entries, each with a front, rear and
# segment interior that genuinely show that car. Generated once, hosted on a
# CDN, HTTP-verified live. This is what ends the "a Hyundai labelled BMW"
# problem: a listing's photographs now come from its own model's entry, and
# the listing's colour is the colour in the picture.
import json, os
with open(os.path.join(os.path.dirname(__file__), "matched_photos.json")) as fh:
    _CAT = json.load(fh)
CATALOGUE = {}
for _e in _CAT:
    CATALOGUE.setdefault(f"{_e['make']} {_e['model']}", []).append(_e)
CDN_BASE = "https://static.prod-images.emergentagent.com/"
_FUEL = {"hybrid": "Hybrid", "ev": "Electric", "petrol": "Petrol", "diesel": "Diesel", "phev": "Plug-in Hybrid"}

INTERIOR = ["https://images.unsplash.com/photo-1625690180114-5530b1304127?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
            "https://images.unsplash.com/photo-1520046045453-547e1175391e?crop=entropy&cs=srgb&fm=jpg&q=80&w=900",
            "https://images.unsplash.com/photo-1529809857497-5a48e0ad5cbb?crop=entropy&cs=srgb&fm=jpg&q=80&w=900"]
CHARGING = "https://images.unsplash.com/photo-1615829386703-e2bb66a7cb7d?crop=entropy&cs=srgb&fm=jpg&q=80&w=900"
HANDOVER = "https://images.pexels.com/photos/7144207/pexels-photo-7144207.jpeg?auto=compress&cs=tinysrgb&w=900"

# Fleet. Real PHV-eligible vehicles with plausible spec and rent-only price.
# Bands sit under the bundled weekly figures the incumbents advertise, because
# Kharo's number excludes insurance, which the driver chooses at application.
FLEET = [
    # make, model, fuel, body, seats, mpg, years, rent, photos (catalogue key or local path)
    ("Toyota", "Prius", "Hybrid", "Hatchback", 5, 62, (2019, 2023), (135, 175), "Toyota Prius"),
    ("Toyota", "Corolla", "Hybrid", "Hatchback", 5, 58, (2020, 2024), (140, 180), "Toyota Corolla"),
    ("Toyota", "Corolla Touring", "Hybrid", "Estate", 5, 56, (2020, 2024), (150, 190), "Toyota Corolla Touring"),
    ("Toyota", "Camry", "Hybrid", "Saloon", 5, 53, (2019, 2023), (160, 200), "Toyota Camry"),
    ("Skoda", "Octavia", "Petrol", "Hatchback", 5, 45, (2019, 2023), (140, 175), "Skoda Octavia"),
    ("Volkswagen", "Passat", "Diesel", "Saloon", 5, 55, (2019, 2023), (165, 205), "Volkswagen Passat"),
    ("Volkswagen", "Sharan", "Diesel", "MPV", 7, 46, (2019, 2022), (195, 235), "Volkswagen Sharan"),
    ("Kia", "e-Niro", "Electric", "SUV", 5, None, (2021, 2024), (185, 230), "Kia e-Niro"),
    ("Kia", "Niro", "Hybrid", "SUV", 5, 58, (2020, 2023), (170, 210), "Kia Niro"),
    ("Hyundai", "Ioniq", "Hybrid", "Hatchback", 5, 60, (2019, 2022), (140, 180), "Hyundai Ioniq"),
    ("Hyundai", "Tucson", "Hybrid", "SUV", 5, 47, (2021, 2024), (190, 230), LOCAL["tucson"]),
    ("Honda", "Insight", "Hybrid", "Saloon", 5, 60, (2019, 2022), (150, 190), "Honda Insight"),
    ("Ford", "Galaxy", "Diesel", "MPV", 7, 45, (2019, 2022), (205, 245), "Ford Galaxy"),
    ("Mercedes-Benz", "E-Class", "Diesel", "Executive", 5, 50, (2019, 2023), (245, 300), "Mercedes-Benz E-Class"),
    ("Mercedes-Benz", "C-Class", "Hybrid", "Executive", 5, 52, (2020, 2023), (225, 275), "Mercedes-Benz C-Class"),
    ("Vauxhall", "Insignia", "Diesel", "Saloon", 5, 54, (2018, 2021), (125, 160), "Vauxhall Insignia"),
    ("BMW", "3 Series", "Diesel", "Saloon", 5, 54, (2019, 2022), (195, 240), "BMW 3 Series"),
    ("Tesla", "Model 3", "Electric", "Saloon", 5, None, (2021, 2024), (215, 265), "Tesla Model 3"),
    ("Nissan", "Leaf", "Electric", "Hatchback", 5, None, (2020, 2023), (165, 205), "Nissan Leaf"),
]

COLOURS = ["Pearl White", "Storm Grey", "Midnight Black", "Silver", "Deep Blue", "Graphite",
           "Metallic Grey", "Arctic White", "Gunmetal", "Onyx Black"]

GARAGE_WORDS = ["Motor Works", "Autocare", "Garage Services", "Vehicle Centre", "Motors",
                "Auto Services", "Fleet Garage", "Service Centre"]

RESTRICTIONS = [
    "No more than 6 penalty points.",
    "Minimum one year private hire experience preferred.",
    "Clean or near-clean licence preferred.",
    "No fault claims in the last two years.",
    "Drivers aged 25 and over for insurance purposes.",
    "",
]

CITY_ADJ = {"London": 1.0, "Birmingham": 0.92, "Manchester": 0.93, "Leeds": 0.90,
            "Wolverhampton": 0.88, "Sheffield": 0.88, "Liverpool": 0.90}


def pick_variant(key, fuel, rnd):
    """A catalogue entry for this model, preferring one whose fuel matches."""
    opts = CATALOGUE[key]
    same = [e for e in opts if _FUEL.get(e["fuel"]) == fuel]
    return rnd.choice(same or opts)


def pick_photos(key_or_path, fuel, rnd):
    """Front, rear and interior of the actual car, then one closing shot.
    Returns (photos, colour): the colour is whatever the photograph shows."""
    closing = CHARGING if fuel in ("Electric", "Plug-in Hybrid") else HANDOVER
    if key_or_path.startswith("/"):
        seg = next(e for e in _CAT if e["fuel"] == "hybrid")["interior"]
        return [key_or_path, seg, closing], None
    v = pick_variant(key_or_path, fuel, rnd)
    return [v["front"], v["rear"], v["interior"], closing], v["colour"]


def description(make, model, year, fuel, body, area, cfg, mileage, rnd):
    econ = {
        "Electric": "Zero emission, so no ULEZ or congestion charge and pennies a mile to run.",
        "Plug-in Hybrid": "Plug-in hybrid, so short local runs are electric and longer jobs still have the engine.",
        "Hybrid": "Self-charging hybrid, which keeps fuel costs down on stop-start city work.",
        "Petrol": "Petrol, serviced on schedule and running well.",
        "Diesel": "Diesel, which suits high-mileage motorway and airport work.",
    }[fuel]
    seats_line = ("Seven seats, so you can take the larger jobs other drivers have to turn down."
                  if body == "MPV" else "")
    lic = f"Licensed by {cfg['authority']} and plated for private hire work."
    if cfg["cross_border"]:
        lic += (" Wolverhampton plates are widely used for cross-border work, so this car can be "
                "driven across England and Wales provided your driver and operator licences match it.")
    opener = rnd.choice([
        f"{year} {make} {model} based in {area}, ready to go straight onto the road.",
        f"{make} {model} ({year}) kept in {area} and available now.",
        f"Well looked-after {year} {make} {model}, garaged in {area}.",
        f"{year} {make} {model} coming off a previous rental and back on the fleet in {area}.",
    ])
    care = rnd.choice([
        f"Full service history, {mileage:,} miles on the clock, MOT fresh.",
        f"{mileage:,} miles, serviced every 10,000 and valeted between drivers.",
        f"Main dealer serviced, {mileage:,} miles, tyres and brakes checked before handover.",
    ])
    parts = [opener, care, econ, seats_line, lic,
             "Weekly price is rent only; you choose your own hire and reward cover when you apply."]
    return " ".join(p for p in parts if p)


def js(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if v is None:
        return "null"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        return "[" + ", ".join(js(x) for x in v) + "]"
    return '"' + str(v).replace("\\", "\\\\").replace('"', '\\"') + '"'


def main():
    rnd = random.Random(20260919)
    rows, n = [], 0

    for city, cfg in CITIES.items():
        for _ in range(cfg["n"]):
            n += 1
            make, model, fuel, body, seats, mpg, yrs, rent, photo_key = rnd.choice(FLEET)
            photos, shot_colour = pick_photos(photo_key, fuel, rnd)
            year = rnd.randint(*yrs)
            # Kharo prices under the London incumbents: the catalogue's £120 to
            # £275 band is stretched onto £90 to £500 so the cheapest cars
            # genuinely undercut and the executive end still reads as premium.
            base = rnd.randint(*rent) * CITY_ADJ[city]
            weekly = int(round((90 + (base - 120) / (275 - 120) * 410) / 5.0) * 5)
            weekly = max(90, min(500, weekly))
            area = rnd.choice(AREAS[city])
            mileage = rnd.randrange(24000, 122000, 137)

            features = [cfg["licence"], "Uber and Bolt ready", "Maintenance included"]
            if rnd.random() < 0.8:
                features.append("Breakdown cover")
            if fuel in ("Electric", "Plug-in Hybrid"):
                features.append("ULEZ exempt")
            if body == "MPV":
                features.append("Seven seats")
            if rnd.random() < 0.45:
                features.append("Dashcam fitted")
            if cfg["cross_border"]:
                features.append("Cross-border plate")

            auto = fuel in ("Electric", "Hybrid", "Plug-in Hybrid") or rnd.random() < 0.8
            letters = "ABDEFGHJLNPQRSTUWXYZ"
            rows.append(dict(
                id=f"KH-{1000 + n}", make=make, model=model, year=year, fuel=fuel,
                transmission="Automatic" if auto else "Manual",
                seats=seats, colour=shot_colour or rnd.choice(COLOURS), borough=area, city=city,
                postcode=(f"{rnd.choice(POSTCODE_PREFIX[city])}{rnd.randint(1, 29)} "
                          f"{rnd.randint(1, 9)}{rnd.choice(letters)}{rnd.choice(letters)}"),
                weekly_rent=weekly,
                deposit=rnd.choice([300, 350, 400, 450, 500, 600]),
                # Yearly allowance. 0 means unlimited, which most operators
                # offer; the rest cap at 10, 15 or 20 thousand miles a year.
                mileage_allowance=rnd.choice([0, 0, 0, 0, 0, 0, 0, 10000, 15000, 20000]),
                mileage=mileage, mpg=mpg, body_type=body,
                breakdown_included="Breakdown cover" in features,
                licensing_authority=cfg["authority"],
                licence_type=cfg["licence"],
                cross_border=cfg["cross_border"],
                designated_garage=f"{area.split(' &')[0].split(' ')[0]} {rnd.choice(GARAGE_WORDS)}",
                min_experience=rnd.choice([0, 0, 6, 12, 12, 24]),
                restrictions=rnd.choice(RESTRICTIONS),
                description=description(make, model, year, fuel, body, area, cfg, mileage, rnd),
                features=features,
                photos=photos,
            ))

    assert len(rows) == TOTAL, f"expected {TOTAL}, built {len(rows)}"

    out = ["// GENERATED by scripts/build-listings.py. Do not edit by hand.",
           "//",
           "// Pre-launch preview inventory: representative of what launch operators rent",
           "// out, not bookable vehicles. Licensing authorities and licence wording are",
           "// accurate; weekly_rent is RENT ONLY, with insurance quoted separately.",
           "",
           "export const MOCK_LISTINGS = ["]
    for r in rows:
        out.append("  {")
        for k, v in r.items():
            out.append(f"    {k}: {js(v)},")
        out.append("  },")
    out += ["];", "",
            "export const getMockById = (id) => MOCK_LISTINGS.find((l) => l.id === id) || null;", "",
            "/** Preview inventory carries a KH- reference; anything else is a real",
            " * listing held server side, so callers know which source resolves an id. */",
            "export const isPreviewId = (id) => typeof id === \"string\" && id.startsWith(\"KH-\");", "",
            "export const MOCK_CITIES = " + js(list(CITIES.keys())) + ";", "",
            "export const LICENSING_AUTHORITIES = {"]
    for c, cfg in CITIES.items():
        out.append(f'  {js(c)}: {{ authority: {js(cfg["authority"])}, '
                   f'licence: {js(cfg["licence"])}, crossBorder: {js(cfg["cross_border"])} }},')
    out += ["};", "", "export const AREAS_BY_CITY = {"]
    for c, areas in AREAS.items():
        out.append(f'  {js(c)}: {js(["All Areas"] + areas)},')
    out += ["};", "", "export const MOCK_BOROUGHS = AREAS_BY_CITY.London;", "",
            "export const MOCK_MAKES = " + js(["All Makes"] + sorted({r["make"] for r in rows})) + ";",
            "",
            """export const BUDGET_OPTIONS = [
  { label: "Any Budget", value: "" },
  { label: "Up to £160 / week", value: "160" },
  { label: "Up to £200 / week", value: "200" },
  { label: "Up to £240 / week", value: "240" },
  { label: "Up to £300 / week", value: "300" },
];

export const ENGINE_OPTIONS = [
  { label: "Any Engine Type", value: "" },
  { label: "Electric (EV)", value: "Electric" },
  { label: "Plug-in Hybrid (PHEV)", value: "Plug-in Hybrid" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Petrol", value: "Petrol" },
  { label: "Diesel", value: "Diesel" },
];"""]

    with open("src/data/mockListings.js", "w") as f:
        f.write("\n".join(out) + "\n")

    print("listings:", len(rows))
    print("by city:", dict(Counter(r["city"] for r in rows)))
    print("rent: £%d to £%d" % (min(r["weekly_rent"] for r in rows),
                                max(r["weekly_rent"] for r in rows)))
    print("photos per listing:", sorted({len(r["photos"]) for r in rows}))


if __name__ == "__main__":
    main()
