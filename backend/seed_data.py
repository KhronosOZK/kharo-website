# ---------------------------------------------------------------------------
# Kharo seed inventory
# Every listing uses AI-generated photography that MATCHES its exact
# make / model / colour (front + rear + segment-correct interior), with
# market-accurate rent-only (pre-insurance) weekly pricing benchmarked to
# Splend / Otto / G&M for London PCO private-hire vehicles.
# ---------------------------------------------------------------------------

_BASE = "https://static.prod-images.emergentagent.com/jobs/919a8071-6528-4edd-abac-afdfaa8c910c/images/"


def _u(h):
    return f"{_BASE}{h}.jpeg"


# Segment-correct interior shots (reused by vehicle segment)
INTERIORS = {
    "hybrid": _u("ab609cd6efa56a0b3359fc47ec9c235877489c11a49a2b699ab5014a6601793e"),
    "budget": _u("c10906c03ef973d1918d1b0682934e46c9b9a8b44bfbfbc5b178db6b6ce6b845"),
    "mpv": _u("b0490754d78c18ba852b6ca97d0919a5eb7c652c77d8dadd57a4bac91b2c3030"),
    "ev": _u("fd677a29c2d161fbd5809e3e1294115d9137150e50a082313ed26837911ec9ef"),
    "executive": _u("e7dd23af6dd6a67b3abea34feae5690afae44d12673c83d786dd26cb4cd87f62"),
}

# ---------------------------------------------------------------------------
# Vehicle catalogue — one entry per real make/model/colour, each with a
# matched front photo, rear photo and the interior segment to use.
# (make, model, vtype, fuel, mpg, seats, base_rent, deposit, min_exp, colour,
#  interior, weight, front_hash, rear_hash, features)
# ---------------------------------------------------------------------------
_CATALOGUE = [
    ("Toyota", "Prius", "saloon", "hybrid", 65, 5, 185, 400, 1, "Silver", "hybrid", 4,
     "297e2b354ed308a543b9a2600ba89a4407f71117bce5c55e04f56694a69356d3",
     "841258c1c8f5e3f6d70aed1803e773cbcc8bfbd3de2434c6ade50fcebe488de7",
     ["Dash cam", "ULEZ compliant", "Apple CarPlay", "Rear camera"]),
    ("Toyota", "Prius", "saloon", "hybrid", 65, 5, 185, 400, 1, "White", "hybrid", 4,
     "d60570def435f2400fae8a7f139a91dc2a9d86b4f7c8fecea49fb2f3578dbee8",
     "e2b323019e645286fcad65b86a50b8b453c58ac16664f277f9d54ca3faf603cf",
     ["Dash cam", "ULEZ compliant", "Apple CarPlay", "Rear camera"]),
    ("Toyota", "Corolla", "saloon", "hybrid", 62, 5, 175, 400, 0, "Grey", "hybrid", 4,
     "bab48abc0acae7da94a0e5ffdda8db0beb84d02676a15bb1ec6be6f05bc282c2",
     "bcda2c8ee50b59da120cc3d96afa6b35e4bf1be8410a545bf07ca19598396d80",
     ["ULEZ compliant", "Reversing camera", "Low running costs", "Apple CarPlay"]),
    ("Toyota", "Corolla", "saloon", "hybrid", 62, 5, 175, 400, 0, "Silver", "hybrid", 4,
     "986cdf72f113695f994967d09c107ad6c22e8c63f2e32bc102fc2575b394ec99",
     "1935d0c544e011beeecd04af0681d0a23f84285296fa6a84d6433bb20422e1c6",
     ["ULEZ compliant", "Reversing camera", "Low running costs", "Apple CarPlay"]),
    ("Toyota", "Corolla Touring", "estate", "hybrid", 60, 5, 185, 450, 1, "Silver", "hybrid", 1,
     "430d35f21fe33d5e5d576c60b4469a656d31c87d61809a2cb76456d502b48e4c",
     "23cec9eddc05d8299f178865a83f1b3b8c61a24e05377b066de7bebc5b7d33ee",
     ["Large boot", "ULEZ compliant", "Reversing camera"]),
    ("Toyota", "Camry", "saloon", "hybrid", 57, 5, 205, 450, 1, "Black", "executive", 2,
     "849cbe488ca4f711674e2063b5a978c1e8b10dc91038e26e70b3ba0f1d4e881f",
     "54d13515cdc5871fe5fb7bd288624c20c5740fa2ffd208eba73a592cc85c1c9a",
     ["Leather seats", "ULEZ compliant", "Dash cam", "Comfort ride"]),
    ("Toyota", "Camry", "saloon", "hybrid", 57, 5, 200, 450, 1, "Silver", "hybrid", 2,
     "c7f1984d67c9247f94bcd718760fba30f5f69ae3a4d4c4999143de70aefd8767",
     "477571f3c1424fb7d90945610f0c6551de6dc8543732ff64b191eb0d57c40411",
     ["ULEZ compliant", "Dash cam", "Comfort ride", "Adaptive cruise"]),
    ("Honda", "Insight", "saloon", "hybrid", 60, 5, 175, 400, 1, "White", "hybrid", 2,
     "08732ce927d28b13f04e2f85ade9f5528ef66baa9bc3a637c0e58a4dd040aea4",
     "cd2d1807c55705698d6fedfc160a3a169da8fc1f2c15f8d05e291aff7d4ae767",
     ["ULEZ compliant", "Adaptive cruise", "Apple CarPlay"]),
    ("Hyundai", "Ioniq", "saloon", "hybrid", 62, 5, 175, 400, 0, "Silver", "hybrid", 2,
     "2491900617546f0fe9cb74b322aac073fc372f75c8a4cb2fd481befd7522b625",
     "ec3e85b046cacf7f2f589c4706c8e80207cfd4616cd219cc6a171670c07adb99",
     ["ULEZ compliant", "Lane assist", "Economical", "Apple CarPlay"]),
    ("Nissan", "Leaf", "saloon", "electric", 0, 5, 180, 450, 1, "Blue", "ev", 2,
     "fa41952b9e43d53c317ba06b5ea6d56bb416f95d43cc48b8071600ce37746e3c",
     "ccb3f9072137e6dd2977ca2c72c951d001d5a7b9f1f732b7d0044a9adfadd38e",
     ["ULEZ exempt", "168 mile range", "Fast charge", "Low running costs"]),
    ("Nissan", "Leaf", "saloon", "electric", 0, 5, 180, 450, 1, "White", "ev", 2,
     "6b2d94da94805ee79605b074eac1f6d2770ed9fc8df2dbe0f82fb640538a8329",
     "aa509e32e605af89d5c4c14f3e9b157ba5b3dcf4b2d41d06e48c965b93b9d80c",
     ["ULEZ exempt", "168 mile range", "Fast charge", "Low running costs"]),
    ("Hyundai", "Kona Electric", "saloon", "electric", 0, 5, 189, 450, 1, "White", "ev", 1,
     "5faa9eca69c581864a954e80c3c0c59b6708e2dad6bd2ac9562bb610056f2214",
     "f0acc6bad41376e8aba1025347a4c4b690850b5ba93e4823da28a127b336ad5f",
     ["ULEZ exempt", "300 mile range", "Reversing camera"]),
    ("Kia", "Niro", "estate", "hybrid", 60, 5, 185, 450, 1, "Grey", "hybrid", 2,
     "ce7c8132a1708d4648ed6025ba9158a1e657f69cb59b013c82d6182a188cdef9",
     "34c89fa3084dfa80070e90e5ed8420bb749b9a7fce3c7727248f21d22226d6da",
     ["ULEZ compliant", "Roomy boot", "Reversing camera", "Economical"]),
    ("Kia", "e-Niro", "estate", "electric", 0, 5, 199, 500, 1, "White", "ev", 1,
     "0a50d6c30b6c456328bd9895783aa8526a97aefda8cb0ed728b882547e8f5a82",
     "8c2a00db63c889f377900b13cf55cc9e2041801e62805ed581ba964a7e638575",
     ["ULEZ exempt", "Roomy boot", "Fast charge", "285 mile range"]),
    ("Tesla", "Model 3", "executive", "electric", 0, 5, 255, 600, 2, "White", "ev", 2,
     "8ec1e6d1f20533fbcc919b2e04f1cc782cc296434be2437b737b81cd5302ada6",
     "60938bb96473a6755db283eacfc434f8091f86f58e2dccc00b9dc375772c2d1c",
     ["330 mile range", "Autopilot", "Premium interior", "Fast charging"]),
    ("Tesla", "Model 3", "executive", "electric", 0, 5, 255, 600, 2, "Blue", "ev", 2,
     "363b259ab874df0f3d58fff516f12a2211dac8af4bc13fdf5f44a1dd9cac0107",
     "e10697845f34edf982f663eb1dc316d06a5526d1a584ecffd03d4c0bd2eef3d5",
     ["330 mile range", "Autopilot", "Premium interior", "Fast charging"]),
    ("Tesla", "Model Y", "executive", "electric", 0, 5, 275, 650, 2, "White", "ev", 1,
     "029811e91d3ced795dc1f09d7ef559d6f253ac1a89d36309b1af1512c966803a",
     "b307ea877030add9d57f7cf4961d20e598c9b6cf9ac347b9ed6028a92bc53cc0",
     ["Long range", "Spacious", "Autopilot", "Fast charging"]),
    ("Polestar", "2", "executive", "electric", 0, 5, 265, 650, 2, "Grey", "ev", 1,
     "91e78797a4a5a71892c03c978a4df153ccf345095df7c1af53a0569c8228a621",
     "faaddd4f67a2947fd79a874f44e5efe68c942f06233e520789bf48b34623e329",
     ["Premium interior", "Long range", "Fast charging"]),
    ("Mercedes-Benz", "E-Class", "executive", "diesel", 52, 5, 285, 700, 3, "Black", "executive", 1,
     "ac1917c9928a6b51e37133b9ac7313cd4b73f85666437b1d3113f397d11824f3",
     "4d6eb309ecdd8c583c964f6ae94fc84bb697cc2b5924078800f393726d4de81d",
     ["Executive interior", "Leather", "Sat nav", "Premium sound"]),
    ("Mercedes-Benz", "C-Class", "executive", "hybrid", 55, 5, 265, 650, 2, "Black", "executive", 1,
     "31fcb57387d99ee8e81919339bd15464b6365b7106e2a3033198db5f5ac43f6c",
     "6033165e672cb2ad101ecb412654c736f722af86af6a691025d61aee78431439",
     ["ULEZ compliant", "Leather", "Sat nav", "Premium sound"]),
    ("BMW", "3 Series", "executive", "petrol", 44, 5, 245, 600, 2, "White", "executive", 1,
     "d2a14146b2515ae4f75d9607441c38879a5574d70d08bd173609156390c1960a",
     "e12316f8886cdcc0a459e42354fc440a0a759d4801eee8c5a3ec32344334949f",
     ["Sport interior", "Alloy wheels", "Sat nav"]),
    ("BMW", "3 Series", "executive", "petrol", 44, 5, 245, 600, 2, "Black", "executive", 1,
     "ac0d9519c7de5a3d40193be5316bb9ce2aab08bcac759e57ef422bbab9de514b",
     "bddb1f23f7c7737da66c69627c8db2e017a99c4e6992ad99a7c0e24e9345331b",
     ["Sport interior", "Alloy wheels", "Sat nav"]),
    ("Audi", "A4", "executive", "diesel", 50, 5, 245, 600, 2, "Grey", "executive", 1,
     "ec17905062f4edb4f06800b0c0683412e47a46fd51f272ee9fe00208690d5e7d",
     "1a8a22388f88c8bd0cc97a2ea71ee2d9e1144555c9f87a4412663d57125abc3a",
     ["Virtual cockpit", "Leather", "Sat nav"]),
    ("Volkswagen", "Passat", "estate", "diesel", 54, 5, 170, 400, 1, "Silver", "budget", 1,
     "53f82b4c105f9813d3ab8fa4fa4f42206955df604b19f399cfa443d1403e97db",
     "5351e0015c1c0a7d65a911d62fcc24759293f1a89f6428345b1b428fde2634a6",
     ["Spacious", "Sat nav", "Cruise control", "Large boot"]),
    ("Skoda", "Octavia", "estate", "diesel", 58, 5, 155, 350, 0, "Blue", "budget", 1,
     "deae23e2c4b127fe0d984ae3907f24b1f4b06a2ecbbc623d441a70fb0a9234ff",
     "63859033f65a1604232f907d8acc80035fe5ddaaa2689e174d5bd2902b742593",
     ["Large boot", "Economical", "Cruise control"]),
    ("Vauxhall", "Insignia", "saloon", "diesel", 50, 5, 135, 300, 0, "Silver", "budget", 1,
     "3d92476ff9f2fbe44eebad08fd95bbfb3762d1c8a0b1957325b3b8415c5e60a0",
     "89c092ac9a12dc176f5e5b0d52e5a0205ef965d4250e46b851a69adb41f5aff5",
     ["Budget friendly", "Spacious", "Cruise control"]),
    ("Ford", "Galaxy", "mpv", "diesel", 48, 7, 195, 450, 2, "Grey", "mpv", 1,
     "db5bec814d52dc5cedb8a0a8512c33bc330949ffd50cc801757f61e8b120a0eb",
     "ffcd51e942717f457dbdbd9abed65a176351ddd366dd47dac3c14c2d26b7f224",
     ["7 seats", "ULEZ compliant", "Parking sensors"]),
    ("Volkswagen", "Sharan", "mpv", "diesel", 46, 7, 195, 450, 2, "Silver", "mpv", 1,
     "5f477e878a224e2c97756eaa4f93c1d0f9d37c207b8d395ab8f3d556b2eefd8b",
     "4b9146578a4bda1ad1753d1dfbd0815359b7e87fc2bbfa515cb49f73faeb67fa",
     ["7 seats", "Sliding doors", "ULEZ compliant"]),
    ("Ford", "Tourneo", "mpv", "diesel", 44, 8, 215, 500, 2, "White", "mpv", 1,
     "bc5e070a58166152eff2599d3d5a78ef7aeccacc72ce24f903aed368613f8c22",
     "af6d5a63c1bf3ad7bcad76870bd2170c532f71bba741bf370367b3446eae86fd",
     ["8 seats", "Ideal for airport work", "Parking sensors"]),
    ("Volkswagen", "Caddy WAV", "wav", "diesel", 45, 5, 195, 500, 2, "White", "mpv", 1,
     "38fe4f874848bb6ed6f84587efd3583e2a6698bfe6de61a18ec8ceb8d968b965",
     "ca9f743d447048bc6d2a9032de1ef2f37f6090a7fe75146c9169963ae7f8361b",
     ["Wheelchair accessible", "Rear ramp", "ULEZ compliant"]),
    ("Toyota", "Prius", "saloon", "hybrid", 65, 5, 185, 400, 1, "Red", "hybrid", 2,
     "fcc2b6306788f6ee508dba816e437b1848798e4ea18f75dce7992b8d5c387098",
     "a57a5f9599b98c852de4117e3092d855f945a8d651fbb0213563624ccd73d4ef",
     ["Dash cam", "ULEZ compliant", "Apple CarPlay", "Rear camera"]),
    ("Toyota", "Corolla", "saloon", "hybrid", 62, 5, 175, 400, 0, "Red", "hybrid", 2,
     "750e52a45e24319238f9e2c62c6f60e16bfd52ac4556a22949aee9455a45cb6b",
     "b906e8752523173e72e667ed2d57fc298a977912aa43baa881e43b36f1bb399d",
     ["ULEZ compliant", "Reversing camera", "Low running costs", "Apple CarPlay"]),
    ("Toyota", "Corolla", "saloon", "hybrid", 62, 5, 175, 400, 0, "Green", "hybrid", 1,
     "b8ee610ef6c6a3220a5153dfd3442ff61d0ec28424583c9202b4fdaaa34ff98a",
     "c769b1fbd5dd29c85607915bc5e2d8158116dcccd1f1c9e6616fcb817c20010c",
     ["ULEZ compliant", "Reversing camera", "Low running costs", "Apple CarPlay"]),
    ("Tesla", "Model 3", "executive", "electric", 0, 5, 255, 600, 2, "Red", "ev", 1,
     "eb3d48b057c6143fadbebe986ec17d361b276448d453f5116f7dd60511ce53ca",
     "782e6b49ec59fd572923ffdc35d41cc83b90f61724a2a1ca67fac65150d0a7a4",
     ["330 mile range", "Autopilot", "Premium interior", "Fast charging"]),
    ("Kia", "Niro", "estate", "hybrid", 60, 5, 185, 450, 1, "Green", "hybrid", 1,
     "273eacadb9f248d051896c440c6740753e5c037ff0f4b7c4bbae557202ac6cf2",
     "cd6d27ffa073c2520bd59b53aaf77c4c8c9864acd7dd3a01c289444395136d2f",
     ["ULEZ compliant", "Roomy boot", "Reversing camera", "Economical"]),
    ("Hyundai", "Ioniq", "saloon", "hybrid", 62, 5, 175, 400, 0, "Red", "hybrid", 1,
     "72381bdc11bc2cc0ed749cc69a439056a756f82f5cfaaa29b2908695cde7832f",
     "9ce354186e114f3bfea4ae4670b29defd25409fa4e3e5847b6e81c8a0d652308",
     ["ULEZ compliant", "Lane assist", "Economical", "Apple CarPlay"]),
]


def _variant(row, idx):
    (make, model, vtype, fuel, mpg, seats, base, deposit, min_exp, colour,
     interior, _w, front, rear, feats) = row
    return {
        "make": make, "model": model, "vtype": vtype, "fuel": fuel, "mpg": mpg,
        "seats": seats, "base": base, "deposit": deposit, "min_exp": min_exp,
        "colour": colour, "interior": interior, "feats": feats,
        "photos": [_u(front), _u(rear), INTERIORS[interior]],
    }


# Weighted pool so common PCO cars (Prius / Corolla / hybrids / EVs) dominate,
# interleaved round-robin so adjacent listings vary instead of clustering.
_POOL = []
_max_w = max(r[11] for r in _CATALOGUE)
for _r in range(_max_w):
    for _row in _CATALOGUE:
        if _r < _row[11]:
            _POOL.append(_row)


# ---------------------------------------------------------------------------
# Locations
# ---------------------------------------------------------------------------
_LONDON = [
    ("Newham", "E13"), ("Croydon", "CR0"), ("Redbridge", "IG1"), ("Harrow", "HA1"),
    ("Barking & Dagenham", "IG11"), ("Westminster", "SW1"), ("Camden", "NW1"), ("Hounslow", "TW3"),
    ("Lewisham", "SE13"), ("Ealing", "W5"), ("Bromley", "BR1"), ("Enfield", "EN1"),
    ("Brent", "NW10"), ("Hackney", "E8"), ("Haringey", "N17"), ("Waltham Forest", "E17"),
    ("Greenwich", "SE10"), ("Southwark", "SE1"), ("Tower Hamlets", "E14"), ("Wandsworth", "SW18"),
    ("Merton", "SW19"), ("Sutton", "SM1"), ("Hillingdon", "UB8"), ("Bexley", "DA5"),
    ("Ilford", "IG2"), ("Wembley", "HA9"), ("Barnet", "EN5"), ("Romford", "RM1"),
    ("Hammersmith & Fulham", "W6"), ("Kingston", "KT1"),
]

# city -> (areas [(name, postcode)], plate_code, operators [(code, name, rating, rentals, since, response)])
_CITIES = {
    "London": (_LONDON, "L", [
        ("NE-2291", "Stratford Motors", 4.8, 63, 2021, "under 2 hours"),
        ("CR-1187", "Croydon Fleet Services", 4.6, 41, 2020, "under 4 hours"),
        ("IG-3350", "Ilford EV Centre", 4.9, 88, 2019, "under 1 hour"),
        ("HA-0824", "Harrow Auto Care", 4.5, 29, 2021, "same day"),
        ("WM-5567", "Victoria Prestige", 4.9, 102, 2018, "under 1 hour"),
        ("CM-2204", "Camden Motorworks", 4.6, 47, 2020, "under 5 hours"),
        ("HO-3391", "Hounslow Hybrid Hub", 4.7, 55, 2021, "under 3 hours"),
        ("LW-7712", "Lewisham EV Works", 4.4, 24, 2022, "same day"),
        ("EA-8830", "Ealing Motor Group", 4.3, 31, 2021, "same day"),
        ("BR-4419", "Bromley Service Centre", 4.6, 38, 2021, "under 4 hours"),
        ("BN-6642", "Brent Cars Ltd", 4.7, 49, 2019, "under 2 hours"),
        ("TH-3376", "Docklands Rentals", 4.8, 71, 2019, "under 2 hours"),
        ("WD-5510", "Wandsworth Autos", 4.6, 44, 2020, "under 4 hours"),
        ("HK-2098", "Hackney Hire", 4.5, 27, 2022, "same day"),
    ]),
    "Birmingham": ([
        ("City Centre", "B1"), ("Sparkhill", "B11"), ("Handsworth", "B21"), ("Small Heath", "B10"),
        ("Alum Rock", "B8"), ("Bordesley Green", "B9"), ("Selly Oak", "B29"), ("Erdington", "B23"),
    ], "B", [
        ("BM-1004", "Midlands Motor Hire", 4.6, 46, 2020, "under 3 hours"),
        ("BM-2087", "Brum Fleet Services", 4.7, 52, 2019, "under 2 hours"),
        ("BM-3312", "Second City Rentals", 4.5, 33, 2021, "same day"),
    ]),
    "Manchester": ([
        ("City Centre", "M1"), ("Cheetham Hill", "M8"), ("Rusholme", "M14"), ("Longsight", "M13"),
        ("Moss Side", "M16"), ("Old Trafford", "M16"), ("Levenshulme", "M19"), ("Fallowfield", "M14"),
    ], "M", [
        ("MN-2207", "Northern Fleet Co", 4.7, 58, 2019, "under 2 hours"),
        ("MN-3391", "Mancunian Hire", 4.5, 37, 2021, "same day"),
        ("MN-4420", "Piccadilly Cars", 4.6, 44, 2020, "under 3 hours"),
    ]),
    "Leeds": ([
        ("City Centre", "LS1"), ("Harehills", "LS8"), ("Beeston", "LS11"), ("Hyde Park", "LS6"),
        ("Chapeltown", "LS7"), ("Armley", "LS12"), ("Headingley", "LS6"), ("Holbeck", "LS11"),
    ], "LS", [
        ("LS-3309", "Leeds City Rentals", 4.6, 41, 2020, "under 3 hours"),
        ("LS-4418", "Yorkshire Auto Group", 4.7, 49, 2019, "under 2 hours"),
        ("LS-5527", "White Rose Hire", 4.5, 30, 2021, "same day"),
    ]),
    "Sheffield": ([
        ("City Centre", "S1"), ("Burngreave", "S4"), ("Attercliffe", "S9"), ("Darnall", "S9"),
        ("Firth Park", "S5"), ("Broomhall", "S10"), ("Sharrow", "S11"), ("Hillsborough", "S6"),
    ], "S", [
        ("SH-2201", "Steel City Rentals", 4.6, 39, 2020, "under 3 hours"),
        ("SH-3318", "Sheffield Fleet Co", 4.7, 47, 2019, "under 2 hours"),
        ("SH-4426", "Peak Motor Hire", 4.5, 28, 2021, "same day"),
    ]),
}

_YEARS = [2020, 2021, 2022, 2023]
_RENT_JITTER = [0, 5, -5, 10, -5, 5]
_LETTERS = "ABCDEFGHJKLMNOPRSTUVWXYZ"


def _plate(code, year, idx):
    yy = year % 100
    a = _LETTERS[idx % len(_LETTERS)]
    b = _LETTERS[(idx * 3 + 7) % len(_LETTERS)]
    c = _LETTERS[(idx * 5 + 11) % len(_LETTERS)]
    tag = (code + "X")[:2].upper()
    return f"{tag}{yy:02d} {a}{b}{c}"


def _build(city, count, id_start):
    areas, plate_code, ops = _CITIES[city]
    out = []
    for i in range(count):
        v = _variant(_POOL[i % len(_POOL)], i)
        area, postcode = areas[i % len(areas)]
        op_code, op_name, op_rating, op_rentals, op_since, op_resp = ops[i % len(ops)]
        year = _YEARS[(i + (0 if city == "London" else 1)) % len(_YEARS)]
        rent = v["base"] + (year - 2021) * 5 + _RENT_JITTER[i % len(_RENT_JITTER)]
        breakdown = i % 3 != 0
        mileage = 16000 + (2023 - year) * 15000 + (i * 137) % 9000
        min_exp = v["min_exp"]
        where = area if city == "London" else f"{area}, {city}"
        idn = id_start + i
        out.append({
            "id": f"ve-{idn:03d}",
            "make": v["make"], "model": v["model"], "year": year, "colour": v["colour"],
            "plate": _plate(plate_code, year, i),
            "vehicle_type": v["vtype"], "fuel": v["fuel"], "mpg": v["mpg"], "seats": v["seats"],
            "weekly_rent": rent, "deposit": v["deposit"],
            "mileage_allowance": 1000 + (200 if v["seats"] >= 7 else 0),
            "min_experience": min_exp, "city": city, "borough": area, "postcode": postcode,
            "breakdown_included": breakdown,
            "designated_garage": op_name,
            "wear_tear": "Enhanced" if v["vtype"] == "executive" else "Standard",
            "restrictions": "3+ years experience" if min_exp >= 3 else "None",
            "operator_code": op_code, "operator_rating": op_rating, "operator_rentals": op_rentals,
            "operator_since": op_since, "operator_response": op_resp, "mileage": mileage,
            "features": v["feats"],
            "description": (
                f"{v['colour']} {year} {v['make']} {v['model']} available for private hire in {where}. "
                f"{'ULEZ compliant and ' if v['fuel'] in ('hybrid', 'electric') else ''}"
                f"{'breakdown cover and servicing included' if breakdown else 'breakdown cover available as an add-on'}. "
                f"Full service history, well maintained and ready for immediate handover."
            ),
            "photos": v["photos"],
        })
    return out


LISTINGS = []
LISTINGS += _build("London", 100, 1)
LISTINGS += _build("Birmingham", 20, 101)
LISTINGS += _build("Manchester", 20, 121)
LISTINGS += _build("Leeds", 20, 141)
LISTINGS += _build("Sheffield", 20, 161)
