import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, MapPin, Check } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, AREAS_BY_CITY, BUDGET_OPTIONS, ENGINE_OPTIONS } from "@/data/mockListings";
import { ALL_CITIES, LIVE_CITIES } from "@/lib/cities";
import VehicleCard from "@/components/VehicleCard";
import CityInterestForm from "@/components/CityInterestForm";
import PreviewNotice from "@/components/PreviewNotice";
import DashboardSnapshot from "@/components/DashboardSnapshot";
import Faq from "@/components/Faq";
import { RevealGroup, RevealItem, Enter } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSeo } from "@/lib/seo";
import { EASE } from "@/lib/motion";
import { HOME } from "@/content/site";

function FilterSelect({ options, value, onChange, label }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="select-field w-full field" aria-label={label}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </label>
  );
}

export default function Home() {
  const navigate = useNavigate();
  useSeo({ title: HOME.seo.title, description: HOME.seo.description, canonical: "https://kharo.co.uk/" });

  const [city, setCity] = useState("London");
  const [borough, setBorough] = useState("All Areas");
  const [make, setMake] = useState("");
  const [budget, setBudget] = useState("");
  const [engine, setEngine] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const fleetRef = useRef(null);

  const areaOptions = AREAS_BY_CITY[city] || ["All Areas"];
  const listings = useMemo(() => MOCK_LISTINGS.slice(0, 6), []);

  // One tile per model, at its lowest listed weekly rent, straight from the
  // inventory so the carousel never shows a price the data does not contain.
  const fleetTiles = useMemo(() => {
    const seen = new Map();
    for (const v of MOCK_LISTINGS) {
      const key = `${v.make} ${v.model}`;
      const photo = Array.isArray(v.photos) ? v.photos[0] : v.photos;
      if (!photo) continue;
      const cur = seen.get(key);
      if (!cur || v.weekly_rent < cur.rent) seen.set(key, { id: v.id, label: key, rent: v.weekly_rent, city: v.city, src: photo });
    }
    return [...seen.values()].slice(0, 8);
  }, []);

  const scrollFleet = (dir) => {
    const el = fleetRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  function handleCityChange(next) { setCity(next); setBorough("All Areas"); }

  function handleSearch() {
    // Kharo covers the whole UK but only has inventory in a few cities. A city
    // with no cars should capture the demand rather than dead-end on an empty grid.
    if (city && !LIVE_CITIES.includes(city)) { setShowCityModal(true); return; }
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (borough && borough !== "All Areas") params.set("borough", borough);
    if (make) params.set("make", make);
    if (budget) params.set("budget", budget);
    if (engine) params.set("engine", engine);
    if (bodyType) params.set("bodyType", bodyType);
    if (transmission) params.set("transmission", transmission);
    navigate(`/search?${params.toString()}`);
  }

  const { hero, work, fleet, featured, dashboard, paths, faq, closer } = HOME;

  return (
    <div className="bg-bone">
      {/* ── HERO: photography, glass search panel, one floating card ─────── */}
      <section className="relative isolate overflow-hidden text-white">
        <img src={hero.img} alt={hero.imgAlt} className="absolute inset-0 h-full w-full object-cover object-[60%_center]" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/25 to-night/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/45 via-night/10 to-transparent" />

        <div className="wrap relative flex flex-col justify-end min-h-[86svh] lg:min-h-[88svh] pt-[clamp(4rem,10vh,7rem)] pb-[clamp(1.5rem,5vh,3.5rem)]">
          <Enter as="h1" className="text-display font-heading font-extrabold max-w-[22ch] drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
            {hero.heading}
          </Enter>
          <Enter as="p" delay={0.06} className="mt-4 text-lead text-white/85 max-w-[46ch] drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
            {hero.sub}
          </Enter>

          {/* Compact platform strip on small screens; the full card floats on desktop */}
          <Enter delay={0.1} className="mt-5 flex flex-wrap items-center gap-2 lg:hidden">
            {hero.card.rows.map(([name]) => (
              <span key={name} className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-[13px] font-medium">
                <Check className="w-3.5 h-3.5 text-mint" strokeWidth={2.5} /> {name} live before you collect
              </span>
            ))}
          </Enter>

          <div className="mt-6 grid lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <Enter delay={0.14} className="lg:col-span-8 glass rounded-hero p-3 sm:p-4 text-ink" data-testid="hero-search">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <FilterSelect label="City" value={city} onChange={handleCityChange}
                    options={ALL_CITIES.map((c) => ({ label: LIVE_CITIES.includes(c) ? c : `${c} (coming soon)`, value: c }))} />
                  <div className="hidden sm:block">
                    <FilterSelect label="Area" value={borough} onChange={setBorough} options={areaOptions.map((b) => ({ label: b, value: b }))} />
                  </div>
                  <div className="hidden sm:block">
                    <FilterSelect label="Make" value={make} onChange={setMake} options={MOCK_MAKES.map((m) => ({ label: m, value: m === "All Makes" ? "" : m }))} />
                  </div>
                  <div className="hidden sm:block">
                    <FilterSelect label="Weekly budget" value={budget} onChange={setBudget} options={BUDGET_OPTIONS} />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {showMore && (
                    <motion.div
                      key="more"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE.out }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5">
                        <div className="sm:hidden"><FilterSelect label="Area" value={borough} onChange={setBorough} options={areaOptions.map((b) => ({ label: b, value: b }))} /></div>
                        <div className="sm:hidden"><FilterSelect label="Make" value={make} onChange={setMake} options={MOCK_MAKES.map((m) => ({ label: m, value: m === "All Makes" ? "" : m }))} /></div>
                        <div className="sm:hidden"><FilterSelect label="Weekly budget" value={budget} onChange={setBudget} options={BUDGET_OPTIONS} /></div>
                        <FilterSelect label="Fuel" value={engine} onChange={setEngine} options={ENGINE_OPTIONS} />
                        <FilterSelect label="Body type" value={bodyType} onChange={setBodyType} options={[
                          { label: "Any body type", value: "" }, { label: "Saloon", value: "Saloon" }, { label: "Estate", value: "Estate" },
                          { label: "SUV or crossover", value: "SUV" }, { label: "MPV", value: "MPV" },
                        ]} />
                        <FilterSelect label="Transmission" value={transmission} onChange={setTransmission} options={[
                          { label: "Any transmission", value: "" }, { label: "Automatic", value: "Automatic" }, { label: "Manual", value: "Manual" },
                        ]} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5">
                  <button type="button" onClick={() => setShowMore((s) => !s)} aria-expanded={showMore}
                    className="pressable inline-flex items-center gap-1.5 h-10 px-3 rounded-full text-[14px] font-medium text-ink-2 hover:bg-white/60">
                    <ChevronDown size={16} strokeWidth={1.75} className={`transition-transform duration-ui ease-out ${showMore ? "rotate-180" : ""}`} />
                    {showMore ? hero.fewerFilters : hero.moreFilters}
                  </button>
                  <Button onClick={handleSearch} size="lg" className="ml-auto w-full xs:w-auto" data-testid="hero-search-btn">
                    <Search size={16} strokeWidth={2} /> {hero.searchCta}
                  </Button>
                </div>
            </Enter>

            <Enter delay={0.2} className="hidden lg:block lg:col-span-4 justify-self-end w-full max-w-[19rem]">
              <div className="glass-dark rounded-2xl p-5" data-testid="hero-platform-card">
                <p className="font-heading font-bold text-[17px] leading-tight">{hero.card.heading}</p>
                <ul className="mt-3 divide-y divide-white/10">
                  {hero.card.rows.map(([name, status]) => (
                    <li key={name} className="flex items-center justify-between py-2.5 text-[14px]">
                      <span className="font-medium">{name}</span>
                      <span className="inline-flex items-center gap-1.5 text-mint font-semibold"><Check className="w-3.5 h-3.5" strokeWidth={2.5} />{status}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12.5px] text-white/70 leading-relaxed">{hero.card.note}</p>
              </div>
            </Enter>
          </div>
        </div>
      </section>

      {/* ── THE WORK AROUND THE CAR: statement + hairline list ─────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-5">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{work.heading}</h2>
            <p className="mt-4 text-lead text-ink-2 measure-narrow">{work.sub}</p>
          </RevealItem>
          <RevealItem as="ul" className="lg:col-span-7 divide-y divide-line border-y border-line">
            {work.items.map((it) => (
              <li key={it.t} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 sm:gap-8 py-6">
                <h3 className="text-h3 font-heading font-bold text-ink">{it.t}</h3>
                <p className="text-[15.5px] text-ink-2 leading-relaxed">{it.d}</p>
              </li>
            ))}
          </RevealItem>
        </div>
      </RevealGroup>

      {/* ── FLEET: photography-led horizontal track ───────────────────── */}
      <RevealGroup as="section" className="wrap pb-section">
        <RevealItem className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{fleet.heading}</h2>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scrollFleet(-1)} aria-label="Scroll left" className="pressable grid place-items-center w-11 h-11 rounded-full border border-line-strong bg-surface text-ink-2 hover:bg-surface-2"><ChevronLeft size={18} strokeWidth={1.75} /></button>
            <button onClick={() => scrollFleet(1)} aria-label="Scroll right" className="pressable grid place-items-center w-11 h-11 rounded-full border border-line-strong bg-surface text-ink-2 hover:bg-surface-2"><ChevronRight size={18} strokeWidth={1.75} /></button>
            <Button variant="outline" onClick={() => navigate("/search")} className="ml-2">{fleet.cta} <ArrowRight size={16} /></Button>
          </div>
        </RevealItem>
        <RevealItem>
          <div ref={fleetRef} className="track gap-3 pb-2">
            {fleetTiles.map((tile) => (
              <Link key={tile.id} to={`/search?make=${encodeURIComponent(tile.label.split(" ")[0])}`}
                className="pressable-card zoom-media relative block w-[clamp(13rem,68vw,17.5rem)] aspect-[4/5] rounded-2xl overflow-hidden bg-surface-2 group">
                <img src={tile.src} alt={tile.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="block font-heading font-bold text-[17px] leading-tight">{tile.label}</span>
                  <span className="block text-[13px] text-white/80 mt-1 tabular">From £{tile.rent} a week · {tile.city}</span>
                </div>
              </Link>
            ))}
          </div>
          <Button variant="outline" onClick={() => navigate("/search")} className="sm:hidden mt-4 w-full">{fleet.cta} <ArrowRight size={16} /></Button>
        </RevealItem>
      </RevealGroup>

      {/* ── FEATURED LISTINGS: honest preview, real cards ─────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
          <RevealItem className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{featured.heading}</h2>
            <Link to="/search" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-green hover:underline underline-offset-4">{featured.cta} <ArrowRight size={16} strokeWidth={1.75} /></Link>
          </RevealItem>
          <RevealItem>
            <PreviewNotice variant="inline" className="mb-6 max-w-3xl" />
            <div className="track gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-5 sm:gap-y-9 sm:mx-0 sm:px-0 sm:overflow-visible">
              {listings.map((vehicle) => (
                <div key={vehicle.id} className="w-[min(82vw,20rem)] sm:w-auto">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── THE ACCOUNT: the console, live ────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="max-w-2xl">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{dashboard.heading}</h2>
          <p className="mt-4 text-lead text-ink-2">{dashboard.sub}</p>
        </RevealItem>
        <RevealItem className="mt-8">
          <DashboardSnapshot variant="driver" />
        </RevealItem>
        <RevealItem className="mt-6">
          <Link to="/for-drivers" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-green hover:underline underline-offset-4">{dashboard.cta} <ArrowRight size={16} strokeWidth={1.75} /></Link>
        </RevealItem>
      </RevealGroup>

      {/* ── TWO PATHS: photography panels ─────────────────────────────── */}
      <RevealGroup as="section" className="wrap pb-section">
        <RevealItem><h2 className="text-h2 font-heading font-extrabold text-ink mb-6">{paths.heading}</h2></RevealItem>
        <RevealItem className="grid md:grid-cols-2 gap-4">
          {[paths.driver, paths.operator].map((p) => (
            <Link key={p.to} to={p.to} className="pressable-card zoom-media group relative block aspect-[4/5] xs:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4] rounded-2xl overflow-hidden bg-surface-2">
              <img src={p.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                <div className="glass rounded-2xl p-5 text-ink">
                  <p className="eyebrow">{p.kicker}</p>
                  <p className="mt-1.5 font-heading font-bold text-[19px] sm:text-[21px] leading-snug text-balance">{p.heading}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-green">
                    {p.cta} <ArrowRight size={16} strokeWidth={1.75} className="transition-transform duration-ui ease-out group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </RevealItem>
      </RevealGroup>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-4">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{faq.heading}</h2>
            <p className="mt-4 text-[15.5px] text-ink-2 measure-narrow">More answers on the <Link to="/help" className="text-green font-semibold hover:underline underline-offset-4">help page</Link>.</p>
          </RevealItem>
          <RevealItem className="lg:col-span-8">
            <Faq items={faq.items} testId="home-faq" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── CLOSER: operators, over photography ───────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <img src={closer.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-night/45" />
        <RevealGroup className="wrap relative py-section">
          <RevealItem className="glass-dark rounded-hero p-6 sm:p-9 max-w-xl">
            <h2 className="text-h2 font-heading font-extrabold">{closer.heading}</h2>
            <p className="mt-3 text-[15.5px] text-white/80 leading-relaxed">{closer.sub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="onDark" onClick={() => navigate("/list-your-fleet")}>{closer.cta} <ArrowRight size={16} /></Button>
              <Button variant="onDarkOutline" onClick={() => navigate("/operator-guide")}>{closer.secondary}</Button>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      <Dialog open={showCityModal} onOpenChange={setShowCityModal}>
        <DialogContent>
          <DialogHeader>
            <MapPin className="w-6 h-6 text-green mb-1" strokeWidth={1.75} />
            <DialogTitle className="font-heading text-h3 text-ink">No cars in {city} just yet</DialogTitle>
            <DialogDescription className="text-ink-2 text-[14.5px] leading-relaxed pt-1">
              Kharo is built for the whole UK and we are bringing operators to every city. Join the waitlist and we will email you the moment {city} has cars.
            </DialogDescription>
          </DialogHeader>
          <CityInterestForm city={city} compact />
        </DialogContent>
      </Dialog>
    </div>
  );
}
