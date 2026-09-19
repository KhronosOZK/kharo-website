import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, LocateFixed, Loader2 } from "lucide-react";
import { MOCK_LISTINGS, AREAS_BY_CITY, MOCK_MAKES } from "@/data/mockListings";
import { ALL_CITIES, LIVE_CITIES } from "@/lib/cities";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { EASE } from "@/lib/motion";
import { HERO_SEARCH } from "@/content/pages/heroSearch";

const FUELS = ["Electric", "Hybrid", "Plug-in Hybrid", "Petrol", "Diesel"];

// Rough city centres, used only to name the closest city when someone asks for
// "near me". Nothing is stored and nothing leaves the browser.
const CITY_POINTS = {
  London: [51.5074, -0.1278],
  Birmingham: [52.4862, -1.8904],
  Manchester: [53.4808, -2.2426],
  Leeds: [53.8008, -1.5491],
  Sheffield: [53.3811, -1.4701],
};

function Segment({ label, value, onClick, open, testId, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      data-testid={testId}
      className={`control-seg pressable flex-1 min-w-0 ${className}`}
    >
      <span className="control-seg-label">{label}</span>
      <span className="control-seg-value flex items-center gap-1">
        {value}
        <ChevronDown size={13} strokeWidth={2} className={`shrink-0 text-ink-3 transition-transform duration-ui ease-out ${open ? "rotate-180" : ""}`} />
      </span>
    </button>
  );
}

/**
 * The homepage search. Built as one instrument rather than a row of loose
 * controls: a driver can set city, area, weekly rent, fuel and make without
 * leaving it, see how many cars each choice leaves, and hand the whole query
 * to the results page.
 */
export default function HeroSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null); // which popover is showing
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [make, setMake] = useState("");
  const [fuel, setFuel] = useState("");
  const [locating, setLocating] = useState(false);
  const [nearNote, setNearNote] = useState("");
  const wrapRef = useRef(null);

  const rents = useMemo(() => MOCK_LISTINGS.map((v) => v.weekly_rent), []);
  const bounds = useMemo(() => [Math.min(...rents), Math.max(...rents)], [rents]);
  const [range, setRange] = useState(bounds);

  // Cars still matching everything except price, so the histogram reflects the
  // rest of the query rather than the whole country.
  const scoped = useMemo(() => MOCK_LISTINGS.filter((v) =>
    (!city || v.city === city)
    && (!area || v.borough === area)
    && (!make || v.make === make)
    && (!fuel || v.fuel === fuel)
  ), [city, area, make, fuel]);

  const areaOptions = (AREAS_BY_CITY[city] || []).slice(1);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(null); };
    const esc = (e) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const useMyLocation = () => {
    if (!navigator.geolocation) { setNearNote(HERO_SEARCH.near.unsupported); return; }
    setLocating(true);
    setNearNote("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        let best = null;
        for (const [name, [la, lo]] of Object.entries(CITY_POINTS)) {
          const d = Math.hypot(coords.latitude - la, coords.longitude - lo);
          if (!best || d < best.d) best = { name, d };
        }
        setCity(best.name);
        setArea("");
        setNearNote(HERO_SEARCH.near.found(best.name));
        setLocating(false);
      },
      () => { setNearNote(HERO_SEARCH.near.denied); setLocating(false); },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  const submit = () => {
    const p = new URLSearchParams();
    if (city) p.set("city", city);
    if (area) p.set("borough", area);
    if (make) p.set("make", make);
    if (fuel) p.set("engine", fuel);
    if (range[0] > bounds[0]) p.set("minBudget", String(range[0]));
    if (range[1] < bounds[1]) p.set("budget", String(range[1]));
    navigate(`/search?${p.toString()}`);
  };

  const pop = {
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.16, ease: EASE.out } },
    exit: { opacity: 0, y: -4, transition: { duration: 0.12, ease: EASE.out } },
  };


  return (
    <div ref={wrapRef} className="relative w-full max-w-4xl" data-testid="hero-search">
      <div className="control-bar shadow-2 flex-col sm:flex-row">
        <Segment label={HERO_SEARCH.city} value={city || HERO_SEARCH.anyCity} testId="hero-city"
          open={open === "city"} onClick={() => setOpen(open === "city" ? null : "city")} />
        <Segment label={HERO_SEARCH.area} value={area || HERO_SEARCH.anyArea} testId="hero-area"
          open={open === "area"} onClick={() => setOpen(open === "area" ? null : "area")}
          className={city ? "" : "opacity-55"} />
        <div className="control-seg flex-[1.6] min-w-0" data-testid="hero-price">
          <span className="control-seg-label">{HERO_SEARCH.price}</span>
          <PriceRangeFilter
            values={scoped.map((v) => v.weekly_rent)}
            min={bounds[0]}
            max={bounds[1]}
            value={range}
            onChange={setRange}
            id="hero-price-range"
            compact
          />
        </div>
        <Segment label={HERO_SEARCH.fuel} value={fuel || HERO_SEARCH.anyFuel} testId="hero-fuel"
          open={open === "fuel"} onClick={() => setOpen(open === "fuel" ? null : "fuel")} />

        <button type="button" onClick={submit} data-testid="hero-search-btn"
          className="pressable shrink-0 bg-green hover:bg-green-hover text-white font-semibold text-[14px] px-6 py-3.5 sm:py-0 inline-flex items-center justify-center gap-2">
          <Search size={16} strokeWidth={2.25} />
          <span>{HERO_SEARCH.submit}</span>
        </button>
      </div>

      {/* Secondary row: location and the live count */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <button type="button" onClick={useMyLocation} disabled={locating} data-testid="hero-near-me"
          className="pressable inline-flex items-center gap-1.5 text-[13px] font-medium text-white/90 hover:text-white disabled:opacity-60">
          {locating ? <Loader2 size={14} className="animate-spin" strokeWidth={2} /> : <LocateFixed size={14} strokeWidth={2} />}
          {HERO_SEARCH.near.label}
        </button>
        {nearNote && <span className="text-[12.5px] text-white/70">{nearNote}</span>}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div {...pop}
            className="absolute z-30 left-0 right-0 sm:right-auto sm:min-w-[24rem] mt-2 surface-raised shadow-2 p-4 text-ink">
            {open === "city" && (
              <div className="grid grid-cols-2 gap-1" role="group" aria-label={HERO_SEARCH.city}>
                <button type="button" onClick={() => { setCity(""); setArea(""); setOpen(null); }}
                  className={`pressable text-left rounded-md px-3 h-10 text-[13.5px] ${!city ? "bg-ink text-white" : "hover:bg-surface-2"}`}>
                  {HERO_SEARCH.anyCity}
                </button>
                {ALL_CITIES.map((c) => {
                  const n = MOCK_LISTINGS.filter((v) => v.city === c).length;
                  return (
                    <button key={c} type="button" onClick={() => { setCity(c); setArea(""); setOpen(null); }}
                      className={`pressable flex items-center justify-between gap-2 rounded-md px-3 h-10 text-[13.5px] ${city === c ? "bg-ink text-white" : "hover:bg-surface-2"}`}>
                      <span className="truncate">{c}</span>
                      <span className={`tabular text-[11.5px] ${city === c ? "text-white/60" : "text-ink-3"}`}>
                        {n || (LIVE_CITIES.includes(c) ? 0 : "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {open === "area" && (
              city ? (
                <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
                  <button type="button" onClick={() => { setArea(""); setOpen(null); }}
                    className={`pressable text-left rounded-md px-3 h-10 text-[13.5px] ${!area ? "bg-ink text-white" : "hover:bg-surface-2"}`}>
                    {HERO_SEARCH.anyArea}
                  </button>
                  {areaOptions.map((a) => (
                    <button key={a} type="button" onClick={() => { setArea(a); setOpen(null); }}
                      className={`pressable text-left truncate rounded-md px-3 h-10 text-[13.5px] ${area === a ? "bg-ink text-white" : "hover:bg-surface-2"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              ) : <p className="text-[13.5px] text-ink-3">{HERO_SEARCH.pickCityFirst}</p>
            )}

            {open === "fuel" && (
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => { setFuel(""); setOpen(null); }}
                  className={`pressable rounded-md px-3 h-9 text-[13px] border ${!fuel ? "bg-ink text-white border-ink" : "border-line-strong hover:bg-surface-2"}`}>
                  {HERO_SEARCH.anyFuel}
                </button>
                {FUELS.map((f) => (
                  <button key={f} type="button" onClick={() => { setFuel(f); setOpen(null); }}
                    className={`pressable rounded-md px-3 h-9 text-[13px] border ${fuel === f ? "bg-ink text-white border-ink" : "border-line-strong hover:bg-surface-2"}`}>
                    {f}
                  </button>
                ))}
                <div className="w-full mt-2 pt-2 border-t border-line">
                  <p className="text-[11px] font-semibold text-ink-3 mb-1.5">{HERO_SEARCH.make}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_MAKES.slice(1, 8).map((m) => (
                      <button key={m} type="button" onClick={() => { setMake(make === m ? "" : m); setOpen(null); }}
                        className={`pressable rounded-md px-3 h-9 text-[13px] border ${make === m ? "bg-ink text-white border-ink" : "border-line-strong hover:bg-surface-2"}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
