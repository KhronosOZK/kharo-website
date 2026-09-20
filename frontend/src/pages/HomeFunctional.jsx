import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ClipboardCheck, Scale, Search, ShieldCheck, Wrench } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { LIVE_CITIES } from "@/lib/cities";
import { IMG } from "@/lib/images";
import { useMotionPrefs } from "@/lib/motion";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import VehicleCard from "@/components/VehicleCard";
import CityInterestForm from "@/components/CityInterestForm";
import Faq from "@/components/Faq";
import { HOME, FACTS, WHY } from "@/content/site";
import { useSeo } from "@/lib/seo";

/**
 * Homepage, in the dealership-site pattern the owner picked as the model:
 * a full-bleed photograph with the featured car named on it and the search
 * held in a white card beside it, then browse-by-type tiles, the makes, a
 * tabbed set of featured cars, what Kharo does, two calls to action, the
 * newest cars, a contact strip and the questions people ask.
 *
 * Nothing invented: every count is computed from the inventory and there
 * are no ratings, reviews or testimonials until real ones exist.
 */

const uniq = (a) => Array.from(new Set(a));
const FUELS = uniq(MOCK_LISTINGS.map((v) => v.fuel)).sort();
const RENTS = MOCK_LISTINGS.map((v) => v.weekly_rent);
const BOUNDS = [Math.min(...RENTS), Math.max(...RENTS)];
// A listing is "verified" when its first photograph genuinely shows that
// car: the matched CDN catalogue or one of the five local photographs.
const verified = (v) => {
  const p = v.photos?.[0];
  return typeof p === "string" && (p.startsWith("/images/listings/") || p.includes("prod-images.emergentagent.com"));
};
const VERIFIED = MOCK_LISTINGS.filter(verified);

// Four cars for the hero, one per make, cheapest of each.
const FEATURED = (() => {
  const seen = new Set(); const out = [];
  for (const v of VERIFIED.slice().sort((a, b) => a.weekly_rent - b.weekly_rent)) {
    if (seen.has(v.make)) continue;
    seen.add(v.make); out.push(v);
    if (out.length === 4) break;
  }
  return out;
})();

const firstPhotoWhere = (pred) => (VERIFIED.find(pred) || MOCK_LISTINGS.find(pred))?.photos?.[0];
const count = (pred) => MOCK_LISTINGS.filter(pred).length;
const TYPES = [
  { label: "Hybrid", to: "/search?engine=Hybrid", pred: (v) => v.fuel === "Hybrid" },
  { label: "Electric", to: "/search?engine=Electric", pred: (v) => v.fuel === "Electric" },
  { label: "Saloon", to: "/search?bodyType=Saloon", pred: (v) => v.body_type === "Saloon" },
  { label: "SUV", to: "/search?bodyType=SUV", pred: (v) => v.body_type === "SUV" },
  { label: "7 seats", to: "/search?seats=7", pred: (v) => v.seats === 7 },
  { label: "Estate", to: "/search?bodyType=Estate", pred: (v) => v.body_type === "Estate" },
].map((t) => ({ ...t, n: count(t.pred), img: firstPhotoWhere(t.pred) }));

const MAKES = Object.entries(MOCK_LISTINGS.reduce((acc, v) => { acc[v.make] = (acc[v.make] || 0) + 1; return acc; }, {}))
  .sort((a, b) => b[1] - a[1]);

const FEATURED_TABS = [
  { id: "cheapest", label: "Cheapest", pick: (l) => l.slice().sort((a, b) => a.weekly_rent - b.weekly_rent) },
  { id: "electric", label: "Electric", pick: (l) => l.filter((v) => v.fuel === "Electric") },
  { id: "seven", label: "7 seats", pick: (l) => l.filter((v) => v.seats === 7) },
  { id: "newest", label: "Newest", pick: (l) => l.slice().sort((a, b) => b.year - a.year) },
];

const WHAT = [
  { icon: ShieldCheck, t: "Operators checked before they list", d: "Every operator is checked against Companies House and the licensing register, and every car carries a valid private hire plate." },
  { icon: Scale, t: "Insurance compared, never bundled", d: "Comprehensive, third party fire and theft, or third party, monthly, six-monthly or yearly. You see the prices on the car before you apply." },
  { icon: Wrench, t: "Aftercare while you drive", d: "Report a fault once. Kharo books the garage, chases the operator, and arranges a replacement car if yours is off the road." },
  { icon: ClipboardCheck, t: "Inspection at collection and return", d: "Photographs and mileage recorded with the operator at handover, and again when you hand back, so the deposit is settled on evidence." },
];

const FIELD = "block w-full rounded-md border border-line-strong bg-surface px-3 h-11 text-[15px] font-medium text-ink outline-none focus:border-ink";
const LABEL = "block text-[12.5px] font-medium text-ink-2 mb-1.5";
const SECTION_LINK = "pressable inline-flex shrink-0 items-center gap-1 text-[14px] font-semibold text-ink hover:text-green";

function SectionHead({ title, sub, to, label = "View all" }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-h2 font-extrabold tracking-[-0.01em] text-ink">{title}</h2>
        {sub && <p className="mt-1 text-[15px] text-ink-2">{sub}</p>}
      </div>
      {to && <Link to={to} className={SECTION_LINK}>{label} <ArrowUpRight size={15} strokeWidth={2.25} /></Link>}
    </div>
  );
}

export default function HomeFunctional() {
  const navigate = useNavigate();
  const { reduce } = useMotionPrefs();
  useSeo({ title: HOME.seo.title, description: HOME.seo.description });

  // Hero
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduce || paused) return undefined;
    const t = setInterval(() => setSlide((s) => (s + 1) % FEATURED.length), 6000);
    return () => clearInterval(t);
  }, [reduce, paused]);
  const hero = FEATURED[slide];

  // Search card
  const [mode, setMode] = useState("rent");
  const [city, setCity] = useState("");
  const [fuel, setFuel] = useState("");
  const [range, setRange] = useState(BOUNDS);
  const [fleet, setFleet] = useState("1-5");

  const scoped = useMemo(() => MOCK_LISTINGS.filter((v) => (!city || v.city === city) && (!fuel || v.fuel === fuel)), [city, fuel]);
  const matches = useMemo(() => scoped.filter((v) => v.weekly_rent >= range[0] && v.weekly_rent <= range[1]), [scoped, range]);

  const search = () => {
    const p = new URLSearchParams();
    if (city) p.set("city", city);
    if (fuel) p.set("engine", fuel);
    if (range[0] > BOUNDS[0]) p.set("minBudget", String(range[0]));
    if (range[1] < BOUNDS[1]) p.set("budget", String(range[1]));
    navigate(`/search?${p.toString()}`);
  };
  const listFleet = () => {
    const p = new URLSearchParams();
    if (city) p.set("city", city);
    p.set("fleet", fleet);
    navigate(`/list-your-fleet?${p.toString()}`);
  };

  // Featured
  const [tab, setTab] = useState("cheapest");
  const featured = useMemo(() => FEATURED_TABS.find((t) => t.id === tab).pick(VERIFIED).slice(0, 4), [tab]);
  const recent = useMemo(() => VERIFIED.slice().sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4), []);

  return (
    <div className="bg-bone">
      {/* ── HERO: the featured car on a photograph, the search beside it ── */}
      <section className="relative isolate overflow-hidden bg-night" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="absolute inset-0">
          {/* One photograph at a time. A new key remounts the image, which
              fades in over the dark ground rather than stacking hidden
              frames behind the visible one. */}
          <img key={hero.id} src={hero.photos[0]} alt="" aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-700"
            fetchPriority="high" decoding="async" />
          {FEATURED.slice(1).map((v) => <link key={v.id} rel="prefetch" as="image" href={v.photos[0]} />)}
          <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/50 to-night/20" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/75 to-transparent" />
        </div>

        <div className="wrap relative grid gap-8 pt-[calc(var(--header-h)+2.5rem)] pb-10 lg:min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-center lg:pb-14">
          <div className="text-white">
            <p className="text-[13px] font-medium text-white/70">Featured this week · {hero.borough}, {hero.city}</p>
            <p className="mt-3 font-heading text-[clamp(2rem,1.4rem+2.6vw,3.25rem)] font-extrabold leading-none tabular tracking-[-0.02em]" data-testid="hero-price">
              £{hero.weekly_rent} <span className="text-[0.45em] font-semibold text-white/75">a week, rent only</span>
            </p>
            <h1 className="mt-2 font-heading text-h1 font-extrabold leading-[1.05] tracking-[-0.02em]">
              {hero.make} {hero.model} {hero.year}
            </h1>
            <p className="mt-4 text-[15px] text-white/85">{hero.fuel} · {hero.transmission} · {hero.seats} seats · {hero.mileage_allowance.toLocaleString()} miles a month</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link to={`/vehicle/${hero.id}`} className="pressable inline-flex h-11 items-center gap-2 rounded-md bg-surface px-5 text-[14.5px] font-semibold text-ink hover:bg-bone" data-testid="hero-see-car">
                See this car <ArrowUpRight size={16} strokeWidth={2.25} />
              </Link>
              <Link to="/search" className="pressable inline-flex h-11 items-center gap-2 text-[14.5px] font-semibold text-white/90 hover:text-white">
                All {MOCK_LISTINGS.length} cars <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
            <div className="mt-10 flex gap-2" role="tablist" aria-label="Featured cars">
              {FEATURED.map((v, i) => (
                <button key={v.id} type="button" role="tab" aria-selected={i === slide} aria-label={`${v.make} ${v.model}`}
                  onClick={() => setSlide(i)}
                  className={`pressable h-1 w-9 rounded-full transition-colors duration-ui ${i === slide ? "bg-white" : "bg-white/35 hover:bg-white/60"}`} />
              ))}
            </div>
          </div>

          {/* The search card */}
          <form
            onSubmit={(e) => { e.preventDefault(); if (mode === "rent") search(); else listFleet(); }}
            className="rounded-lg border border-line bg-surface p-5 text-ink shadow-2 sm:p-6"
            data-testid="home-search"
          >
            <p className="font-heading text-[18px] font-bold text-ink">Find your car</p>
            <div className="segmented mt-3 grid w-full grid-cols-2" role="tablist" aria-label="I want to">
              {[["rent", "Rent a car"], ["list", "List a car"]].map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={mode === id} data-active={mode === id}
                  onClick={() => setMode(id)} className="h-10 text-center" data-testid={`home-mode-${id}`}>{label}</button>
              ))}
            </div>

            {mode === "rent" ? (
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="hf-city" className={LABEL}>City</label>
                  <select id="hf-city" value={city} onChange={(e) => setCity(e.target.value)} className={FIELD}>
                    <option value="">Anywhere</option>
                    {LIVE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="hf-fuel" className={LABEL}>Vehicle type</label>
                  <select id="hf-fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className={FIELD}>
                    <option value="">Any type</option>
                    {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <span className={LABEL}>Weekly budget</span>
                  <PriceRangeFilter values={scoped.map((v) => v.weekly_rent)} min={BOUNDS[0]} max={BOUNDS[1]} value={range} onChange={setRange} id="hf-price" />
                </div>
                <button type="submit" data-testid="home-search-btn"
                  className="pressable inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink text-[15px] font-semibold text-white hover:bg-green">
                  <Search size={16} strokeWidth={2.25} />
                  Search {matches.length} {matches.length === 1 ? "car" : "cars"}
                </button>
                <p className="text-[12px] leading-relaxed text-ink-3" data-testid="home-preview-badge">Pre-launch preview. Cars are not bookable yet; register interest and we come back to you at launch.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="hf-opcity" className={LABEL}>Where are your cars?</label>
                  <select id="hf-opcity" value={city} onChange={(e) => setCity(e.target.value)} className={FIELD}>
                    <option value="">Pick a city</option>
                    {LIVE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="hf-fleet" className={LABEL}>How many could you list?</label>
                  <select id="hf-fleet" value={fleet} onChange={(e) => setFleet(e.target.value)} className={FIELD}>
                    <option value="1-5">1 to 5 cars</option>
                    <option value="6-20">6 to 20 cars</option>
                    <option value="21+">More than 20</option>
                  </select>
                </div>
                <button type="submit" data-testid="home-list-btn"
                  className="pressable inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-green text-[15px] font-semibold text-white hover:bg-green-hover">
                  Talk to a consultant <ArrowRight size={16} strokeWidth={2.25} />
                </button>
                <p className="text-[12px] leading-relaxed text-ink-3">Listing is free. A consultant calls within one working day and builds the listings with you.</p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ── BROWSE BY TYPE ───────────────────────────────────────────────── */}
      <section className="wrap pt-12 sm:pt-16">
        <SectionHead title="Browse by type" to="/search" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {TYPES.map((t) => (
            <Link key={t.label} to={t.to} className="group pressable-card relative block overflow-hidden rounded-lg border border-line bg-surface" data-testid={`home-type-${t.label}`}>
              <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                {t.img && <img src={t.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />}
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-[14px] font-semibold text-ink">{t.label}</span>
                <span className="tabular text-[12.5px] text-ink-3">{t.n}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MAKES ────────────────────────────────────────────────────────── */}
      <section className="wrap pt-12 sm:pt-16">
        <SectionHead title="Browse by make" sub={`${MAKES.length} makes across ${FACTS.cities.length} cities`} to="/search" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {MAKES.map(([make, n]) => (
            <Link key={make} to={`/search?make=${encodeURIComponent(make)}`}
              className="pressable-card flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-4 hover:border-line-strong">
              <span className="font-heading text-[15px] font-bold text-ink">{make}</span>
              <span className="tabular text-[12.5px] text-ink-3">{n} {n === 1 ? "car" : "cars"}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────────────── */}
      <section className="wrap pt-12 sm:pt-16">
        <div>
          <SectionHead title="Featured cars" to="/search" />
          <div className="mt-4 flex gap-6 border-b border-line" role="tablist" aria-label="Featured cars">
            {FEATURED_TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} data-testid={`home-featured-${t.id}`}
                className={`pressable -mb-px border-b-2 pb-2.5 pt-1 text-[14px] font-semibold transition-colors duration-ui ${tab === t.id ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((v) => <VehicleCard key={v.id} vehicle={v} compact />)}
          </div>
        </div>
      </section>

      {/* ── WHAT KHARO DOES ──────────────────────────────────────────────── */}
      <section className="wrap grid gap-10 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h2 className="font-heading text-h2 font-extrabold tracking-[-0.01em] text-ink">This is what Kharo does, and does properly.</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">Drivers rent licensed cars from operators we have checked. Kharo sits in the middle: it holds the deposit, collects the rent, compares the insurance and looks after the car while it is out.</p>
          <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
            <img src={IMG.priusLondon} alt="A private hire car on a London street" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
          </div>
        </div>
        <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:col-span-7">
          {WHAT.map(({ icon: Icon, t, d }) => (
            <div key={t}>
              <Icon size={22} strokeWidth={1.75} className="text-green" />
              <dt className="mt-3 font-heading text-[16.5px] font-bold text-ink">{t}</dt>
              <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── TWO SIDES ────────────────────────────────────────────────────── */}
      <section className="wrap grid gap-4 pt-12 sm:pt-16 md:grid-cols-2">
        {[
          { img: IMG.driverNight, pos: "50% 40%", t: "Looking for a car to drive?", d: "Rent only, insurance compared on the car, Uber and Bolt set up before you collect.", to: "/search", cta: "Find a car", id: "drivers" },
          { img: IMG.fleetLot, pos: "50% 60%", t: "Own cars standing idle?", d: "List for free. Checked drivers, rent collected weekly, one console for the whole fleet.", to: "/list-your-fleet", cta: "List your fleet", id: "operators" },
        ].map((b) => (
          <div key={b.id} className="relative isolate min-h-[17rem] overflow-hidden rounded-lg bg-night" data-testid={`home-banner-${b.id}`}>
            <img src={b.img} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: b.pos }} />
            <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/55 to-night/20" />
            <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
              <h2 className="font-heading text-[24px] font-extrabold leading-tight">{b.t}</h2>
              <p className="mt-2 max-w-[38ch] text-[14.5px] text-white/85">{b.d}</p>
              <Link to={b.to} className="pressable mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-md bg-surface px-5 text-[14px] font-semibold text-ink hover:bg-bone">
                {b.cta} <ArrowUpRight size={15} strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── RECENTLY ADDED ───────────────────────────────────────────────── */}
      <section className="wrap pt-12 sm:pt-16">
        <SectionHead title="Recently added" sub="The newest cars on the platform." to="/search" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((v) => <VehicleCard key={v.id} vehicle={v} compact />)}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section className="wrap pt-12 sm:pt-16">
        <div className="relative isolate overflow-hidden rounded-lg bg-night">
          <img src={IMG.phoneInCar} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/60 to-night/30" />
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div className="text-white">
              <h2 className="font-heading text-h2 font-extrabold leading-tight tracking-[-0.01em]">Can't see the car you want?</h2>
              <p className="mt-3 max-w-[42ch] text-[15.5px] text-white/85">Tell us what you are after and where. We match you the moment it comes up, and your request tells operators what drivers in your city actually want.</p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-5 sm:p-6" data-testid="home-contact">
              <p className="font-heading text-[17px] font-bold text-ink">Tell us what you need</p>
              <p className="mt-1 text-[13px] text-ink-3">A person replies within one working day.</p>
              <CityInterestForm compact mode="request" className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE GAP + FAQ ────────────────────────────────────────────────── */}
      <section className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <p className="font-heading text-[clamp(2.75rem,2rem+3vw,4rem)] font-extrabold leading-none tabular tracking-[-0.02em] text-green">{WHY.gap.number}</p>
          <p className="mt-3 max-w-[30ch] text-[16px] leading-snug text-ink">{WHY.gap.label}</p>
          <p className="mt-2 text-[12.5px] text-ink-3">{WHY.gap.source}</p>
          <p className="mt-5 max-w-[40ch] text-[14.5px] leading-relaxed text-ink-2">{WHY.gap.body}</p>
          <Link to="/why-kharo" className={`${SECTION_LINK} mt-5`}>Why Kharo <ArrowUpRight size={15} strokeWidth={2.25} /></Link>
        </div>
        <div className="lg:col-span-8">
          <h2 className="font-heading text-h2 font-extrabold tracking-[-0.01em] text-ink">{HOME.faq.heading}</h2>
          <div className="mt-4 rounded-lg border border-line bg-surface px-5"><Faq items={HOME.faq.items} testId="home-faq" /></div>
        </div>
      </section>
    </div>
  );
}
