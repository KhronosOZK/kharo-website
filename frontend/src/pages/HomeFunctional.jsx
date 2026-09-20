import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { siToyota, siKia, siHyundai, siSkoda, siVolkswagen, siBmw, siVauxhall, siHonda, siNissan, siFord, siTesla } from "simple-icons";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { LIVE_CITIES } from "@/lib/cities";
import { mileageLabel } from "@/lib/format";
import { EASE, useMotionPrefs } from "@/lib/motion";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import VehicleCard from "@/components/VehicleCard";
import CityInterestForm from "@/components/CityInterestForm";
import Faq from "@/components/Faq";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { HOME, FACTS, WHY } from "@/content/site";
import { useSeo } from "@/lib/seo";

/**
 * Homepage, in the dealership-site pattern the owner picked as the model:
 * a full-bleed photograph with the featured car named on it and the search
 * held in a white card beside it, then browse-by-type tiles, the makes, a
 * tabbed set of featured cars, what Kharo does, two calls to action, the
 * newest cars, a contact panel, the one figure that explains the business
 * and the questions people ask.
 *
 * Nothing invented: every count is computed from the inventory and there
 * are no ratings, reviews or testimonials until real ones exist.
 */

const uniq = (a) => Array.from(new Set(a));
const FUELS = uniq(MOCK_LISTINGS.map((v) => v.fuel)).sort();
const RENTS = MOCK_LISTINGS.map((v) => v.weekly_rent);
const BOUNDS = [Math.min(...RENTS), Math.max(...RENTS)];
const MEDIAN_RENT = RENTS.slice().sort((a, b) => a - b)[Math.floor(RENTS.length / 2)];
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

// Make marks from simple-icons, used the way Auto Trader uses them: to
// identify the make, never to imply endorsement. Mercedes-Benz has no icon
// in the set, so its tile falls back to an initial.
const MAKE_ICONS = {
  Toyota: siToyota, Kia: siKia, Hyundai: siHyundai, Skoda: siSkoda, Volkswagen: siVolkswagen,
  BMW: siBmw, Vauxhall: siVauxhall, Honda: siHonda, Nissan: siNissan, Ford: siFord, Tesla: siTesla,
};
const MAKES = Object.entries(MOCK_LISTINGS.reduce((acc, v) => { acc[v.make] = (acc[v.make] || 0) + 1; return acc; }, {}))
  .sort((a, b) => b[1] - a[1]);

const FEATURED_TABS = [
  { id: "cheapest", label: "Cheapest", pick: (l) => l.slice().sort((a, b) => a.weekly_rent - b.weekly_rent) },
  { id: "electric", label: "Electric", pick: (l) => l.filter((v) => v.fuel === "Electric") },
  { id: "seven", label: "7 seats", pick: (l) => l.filter((v) => v.seats === 7) },
  { id: "newest", label: "Newest", pick: (l) => l.slice().sort((a, b) => b.year - a.year) },
];

const WHAT = [
  { t: "Operators checked before they list", d: "Every operator is checked against Companies House and the licensing register, and every car carries a valid private hire plate." },
  { t: "Insurance compared, never bundled", d: "Comprehensive, third party fire and theft, or third party; monthly, six-monthly or yearly. The prices sit on the car before you apply." },
  { t: "Aftercare while you drive", d: "Report a fault once. Kharo books the garage, chases the operator and arranges a replacement car if yours is off the road." },
  { t: "Inspection at collection and return", d: "Photographs and mileage recorded with the operator at handover and again at return, so the deposit is settled on evidence." },
];

// The ticker in the drivers panel: the cheapest verified cars, doubled so
// the loop is seamless.
const TICKER = VERIFIED.slice().sort((a, b) => a.weekly_rent - b.weekly_rent).slice(0, 12);

// Each hero line settles up as it appears; the card follows a beat later.
const RISE = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.out } } };

const FIELD = "block w-full rounded-md border border-line-strong bg-surface px-3 h-11 text-[15px] font-medium text-ink outline-none focus:border-ink";
const LABEL = "block text-[12.5px] font-medium text-ink-2 mb-1.5";
const SECTION_LINK = "pressable inline-flex shrink-0 items-center gap-1 text-[14px] font-semibold text-ink hover:text-green-deep";

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

function IdleFigure({ reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const monthly = MEDIAN_RENT * 4;
  return (
    <p ref={ref} className="font-heading text-[clamp(2.5rem,1.8rem+2.6vw,3.75rem)] font-extrabold leading-none tabular tracking-[-0.02em] text-ink">
      <AnimatedNumber value={inView || reduce ? monthly : 0} from={0} prefix="£" />
      <span className="ml-2 text-[0.4em] font-medium text-ink/70">a month, per idle car</span>
    </p>
  );
}

export default function HomeFunctional() {
  const navigate = useNavigate();
  const { reduce } = useMotionPrefs();
  useSeo({ title: HOME.seo.title, description: HOME.seo.description });

  // Hero. Auto-advances every eight seconds until the visitor touches it,
  // then stays put, so a button never moves under a finger.
  const [slide, setSlide] = useState(0);
  const interacted = useRef(false);
  useEffect(() => {
    if (reduce) return undefined;
    const t = setInterval(() => { if (!interacted.current) setSlide((s) => (s + 1) % FEATURED.length); }, 8000);
    return () => clearInterval(t);
  }, [reduce]);
  const go = (i) => { interacted.current = true; setSlide((i + FEATURED.length) % FEATURED.length); };
  const hero = FEATURED[slide];

  // Search card
  const [mode, setMode] = useState("rent");
  const [city, setCity] = useState("");
  const [fuel, setFuel] = useState("");
  const [range, setRange] = useState(BOUNDS);
  const [fleet, setFleet] = useState("1-5");
  const scoped = useMemo(() => MOCK_LISTINGS.filter((v) => (!city || v.city === city) && (!fuel || v.fuel === fuel)), [city, fuel]);

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
      <section className="relative isolate -mt-[var(--header-h)] overflow-hidden bg-bone lg:bg-night" data-hero-photo="true" onPointerDown={() => { interacted.current = true; }}>
        {/* On a phone the photograph is a band behind the copy and the search
            card sits below it on the page; on wide screens it fills the hero. */}
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-night lg:inset-0 lg:h-auto">
          <img key={hero.id} src={hero.photos[0]} alt="" aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-700 motion-safe:[animation:hero-drift_16s_ease-out_forwards]"
            fetchPriority="high" decoding="async" />
          {FEATURED.slice(1).map((v) => <link key={v.id} rel="prefetch" as="image" href={v.photos[0]} />)}
          <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/50 to-night/20" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/75 to-transparent" />
        </div>

        <div className="wrap relative grid gap-5 pt-[calc(var(--header-h)+1.5rem)] pb-8 sm:gap-8 lg:min-h-[40rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:grid-rows-[1fr_auto] lg:items-center lg:pb-12 lg:pt-[calc(var(--header-h)+2.5rem)]">
          <motion.div className="text-white max-lg:min-h-[17rem]" initial={reduce ? false : "hidden"} animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}>
            <motion.p variants={RISE} className="text-[13px] font-medium text-white/70">Featured this week · {hero.borough}, {hero.city}</motion.p>
            <motion.p variants={RISE} className="mt-3 font-heading text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] font-extrabold leading-none tabular tracking-[-0.02em]" data-testid="hero-price">
              £{hero.weekly_rent} <span className="text-[0.45em] font-medium text-white/75">a week, rent only</span>
            </motion.p>
            <motion.h1 variants={RISE} className="mt-2 font-heading text-[clamp(1.9rem,1.2rem+3.2vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              {hero.make} {hero.model} {hero.year}
            </motion.h1>
            <motion.p variants={RISE} className="mt-3 text-[14.5px] text-white/85 sm:mt-4 sm:text-[15px]">{hero.fuel} · {hero.transmission} · {hero.seats} seats · {mileageLabel(hero.mileage_allowance)}</motion.p>
            <motion.div variants={RISE} className="mt-6 flex flex-wrap items-center gap-4 sm:mt-7">
              <Link to={`/vehicle/${hero.id}`} className="pressable inline-flex h-11 items-center gap-2 rounded-md bg-surface px-5 text-[14.5px] font-semibold text-ink hover:bg-bone" data-testid="hero-see-car">
                See this car <ArrowUpRight size={16} strokeWidth={2.25} />
              </Link>
              <Link to="/search" className="pressable inline-flex h-11 items-center gap-2 text-[14.5px] font-semibold text-white/90 hover:text-white">
                Browse all cars <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-3 lg:col-start-1 lg:row-start-2 lg:-mt-4" role="group" aria-label="Featured cars">
            <button type="button" onClick={() => go(slide - 1)} aria-label="Previous car" className="pressable grid h-9 w-9 place-items-center rounded-md border border-white/30 text-white hover:bg-white/10">
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <div className="flex gap-2" role="tablist">
              {FEATURED.map((v, i) => (
                <button key={v.id} type="button" role="tab" aria-selected={i === slide} aria-label={`${v.make} ${v.model}`}
                  onClick={() => go(i)}
                  className={`pressable h-1 w-8 rounded-full transition-colors duration-ui ${i === slide ? "bg-white" : "bg-white/35 hover:bg-white/60"}`} />
              ))}
            </div>
            <button type="button" onClick={() => go(slide + 1)} aria-label="Next car" className="pressable grid h-9 w-9 place-items-center rounded-md border border-white/30 text-white hover:bg-white/10">
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>

          {/* The search card */}
          <motion.form
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE.out, delay: 0.3 }}
            onSubmit={(e) => { e.preventDefault(); if (mode === "rent") search(); else listFleet(); }}
            className="rounded-lg border border-line bg-surface p-5 text-ink shadow-2 max-lg:mt-2 sm:p-6 lg:row-span-2"
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
                  className="pressable inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink text-[15px] font-semibold text-white hover:bg-[#2A2D2B]">
                  <Search size={16} strokeWidth={2.25} />
                  Search cars
                </button>
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
                  className="pressable inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink text-[15px] font-semibold text-white hover:bg-[#2A2D2B]">
                  Talk to a consultant <ArrowRight size={16} strokeWidth={2.25} />
                </button>
                <p className="text-[12px] leading-relaxed text-ink-3">Listing is free. A consultant calls within one working day and builds the listings with you.</p>
              </div>
            )}
          </motion.form>
        </div>
      </section>

      {/* ── BROWSE BY TYPE ───────────────────────────────────────────────── */}
      <section className="wrap pt-10 sm:pt-16">
        <SectionHead title="Browse by type" to="/search" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {TYPES.map((t) => (
            <Link key={t.label} to={t.to} className="group pressable-card relative block aspect-[4/5] overflow-hidden rounded-lg bg-surface-2" data-testid={`home-type-${t.label}`}>
              {t.img && <img src={t.img} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.05]" />}
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/60 to-transparent" />
              <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md bg-surface/95 px-3 py-1.5 text-[13px] font-semibold text-ink shadow-1">
                {t.label} <span className="tabular font-normal text-ink-3">{t.n}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MAKES ────────────────────────────────────────────────────────── */}
      <section className="wrap pt-10 sm:pt-16">
        <SectionHead title="Browse by make" sub={`${MAKES.length} makes across ${FACTS.cities.length} cities`} to="/search" />
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4">
          {MAKES.map(([make, n]) => {
            const icon = MAKE_ICONS[make];
            return (
              <Link key={make} to={`/search?make=${encodeURIComponent(make)}`}
                className="pressable-card flex flex-col items-center justify-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-5 transition-[border-color,box-shadow] duration-hover hover:border-line-strong hover:shadow-1 sm:py-6">
                {icon ? (
                  <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true" className="fill-ink"><path d={icon.path} /></svg>
                ) : (
                  <span className="grid h-[34px] place-items-center font-heading text-[22px] font-bold leading-none text-ink">{make.slice(0, 1)}</span>
                )}
                <span className="text-[13.5px] font-semibold text-ink">{make}</span>
                <span className="tabular -mt-1.5 text-[12px] text-ink-3">{n} {n === 1 ? "car" : "cars"}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────────────── */}
      <section className="wrap pt-10 sm:pt-16">
        <div className="-mx-[var(--gutter)] rounded-lg bg-surface-2/60 px-[var(--gutter)] py-6 sm:py-8">
          <SectionHead title="Featured cars" to="/search" />
          <div className="mt-4 flex gap-6 overflow-x-auto border-b border-line hide-scrollbar" role="tablist" aria-label="Featured cars">
            {FEATURED_TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} data-testid={`home-featured-${t.id}`}
                className={`pressable -mb-px shrink-0 border-b-2 pb-2.5 pt-1 text-[14px] font-semibold transition-colors duration-ui ${tab === t.id ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
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
      <section className="wrap grid gap-8 pt-10 sm:pt-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h2 className="font-heading text-h2 font-extrabold tracking-[-0.01em] text-ink">What Kharo does between you and the operator</h2>
          <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed text-ink-2">Drivers rent licensed cars from operators we have checked. Kharo holds the deposit, collects the rent, compares the insurance and looks after the car while it is out.</p>
          <Link to="/for-drivers" className={`${SECTION_LINK} mt-5`}>How renting works <ArrowUpRight size={15} strokeWidth={2.25} /></Link>
        </div>
        <dl className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
          {WHAT.map(({ t, d }) => (
            <div key={t} className="border-t border-line py-5">
              <dt className="font-heading text-[17px] font-bold text-ink">{t}</dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── TWO SIDES: no photographs, one moving element each ───────────── */}
      <section className="wrap grid gap-4 pt-10 sm:pt-16 md:grid-cols-2">
        <div className="group relative flex flex-col overflow-hidden rounded-lg bg-ink p-6 text-white sm:p-8" data-testid="home-banner-drivers">
          <h2 className="font-heading text-[26px] font-extrabold leading-tight tracking-[-0.01em]">Looking for a car to drive?</h2>
          <p className="mt-2 max-w-[38ch] text-[14.5px] text-white/80">Rent only, insurance compared on the car, Uber and Bolt set up before you collect.</p>
          <Link to="/search" className="pressable mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-md bg-green px-5 text-[14px] font-semibold text-ink hover:bg-green-hover">
            Find a car <ArrowUpRight size={15} strokeWidth={2.25} />
          </Link>
          <div className="relative -mx-6 mt-7 overflow-hidden border-t border-white/10 pt-4 sm:-mx-8" aria-hidden="true">
            <div className="flex w-max gap-2 pl-6 motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused] sm:pl-8">
              {[...TICKER, ...TICKER].map((v, i) => (
                <span key={`${v.id}-${i}`} className="shrink-0 rounded-md border border-white/15 px-3 py-1.5 text-[12.5px] text-white/85">
                  {v.make} {v.model} <span className="text-white/55">· </span><span className="tabular font-semibold text-white">£{v.weekly_rent}</span><span className="text-white/55"> a week</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-lg bg-green p-6 text-ink sm:p-8" data-testid="home-banner-operators">
          <h2 className="font-heading text-[26px] font-extrabold leading-tight tracking-[-0.01em]">Own cars standing idle?</h2>
          <p className="mt-2 max-w-[38ch] text-[14.5px] text-ink/75">List for free. Checked drivers, rent collected weekly, one console for the whole fleet.</p>
          <Link to="/list-your-fleet" className="pressable mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-md bg-ink px-5 text-[14px] font-semibold text-white hover:bg-[#2A2D2B]">
            List your fleet <ArrowUpRight size={15} strokeWidth={2.25} />
          </Link>
          <div className="mt-7 border-t border-ink/15 pt-5">
            <IdleFigure reduce={reduce} />
            <p className="mt-2 text-[12.5px] text-ink/65">The median rent on Kharo, times four weeks. Every week a car sits, that is what it does not earn.</p>
          </div>
        </div>
      </section>

      {/* ── RECENTLY ADDED ───────────────────────────────────────────────── */}
      <section className="wrap pt-10 sm:pt-16">
        <SectionHead title="Recently added" sub="The newest cars on the platform." to="/search" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((v) => <VehicleCard key={v.id} vehicle={v} compact />)}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section className="wrap pt-10 sm:pt-16">
        <div className="grid gap-6 rounded-lg border border-line bg-surface p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12" data-testid="home-contact">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-h2 font-extrabold leading-tight tracking-[-0.01em] text-ink">Can't see the car you want?</h2>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">Tell us what you are after and where. We match you the moment it comes up, and your request tells operators what drivers in your city actually want.</p>
          </div>
          <div className="lg:col-span-7">
            <CityInterestForm compact mode="request" />
            <p className="mt-3 text-[12.5px] text-ink-3">A person replies within one working day.</p>
          </div>
        </div>
      </section>

      {/* ── THE FIGURE ───────────────────────────────────────────────────── */}
      <section className="wrap pt-10 sm:pt-16">
        <div className="grid gap-8 rounded-lg border border-line bg-surface p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-5">
            <p className="font-heading text-[clamp(3rem,2.2rem+3.4vw,4.75rem)] font-extrabold leading-none tabular tracking-[-0.03em] text-ink">{WHY.gap.number}</p>
            <p className="mt-3 max-w-[30ch] text-[16px] leading-snug text-ink">{WHY.gap.label}</p>
            <p className="mt-2 text-[12.5px] text-ink-3">{WHY.gap.source}</p>
          </div>
          <div className="lg:col-span-7 lg:border-l lg:border-line lg:pl-14">
            <p className="text-lead leading-relaxed text-ink-2">{WHY.gap.body}</p>
            <Link to="/why-kharo" className={`${SECTION_LINK} mt-5`}>Why Kharo exists <ArrowUpRight size={15} strokeWidth={2.25} /></Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="wrap py-10 sm:py-16">
        <div className="max-w-3xl">
          <h2 className="font-heading text-h2 font-extrabold tracking-[-0.01em] text-ink">{HOME.faq.heading}</h2>
          <div className="mt-5 rounded-lg border border-line bg-surface px-5"><Faq items={HOME.faq.items} testId="home-faq" /></div>
        </div>
      </section>
    </div>
  );
}
