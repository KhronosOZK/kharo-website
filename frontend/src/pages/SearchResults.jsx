import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Map as MapIcon, List as ListIcon, LocateFixed } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, AREAS_BY_CITY, ENGINE_OPTIONS } from "@/data/mockListings";
import { ALL_CITIES, LIVE_CITIES } from "@/lib/cities";
import { areaCoords } from "@/lib/geo";
import VehicleCard from "@/components/VehicleCard";
import SearchMap from "@/components/SearchMap";
import CityInterestForm from "@/components/CityInterestForm";
import PreviewNotice from "@/components/PreviewNotice";
import FiltersDialog, { applyFilters, YEAR_BOUNDS } from "@/components/FiltersDialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Close as PopoverClose } from "@radix-ui/react-popover";
import { useSeo } from "@/lib/seo";
import { SPRING } from "@/lib/motion";
import { SEARCH } from "@/content/pages/marketplace";

const FUEL_OPTIONS = ENGINE_OPTIONS.filter((o) => o.value);
// The true, filter-independent rent bounds across every listing, used to
// reset the slider on "Clear all" without racing the filtered pool's bounds.
const FULL_PRICE_BOUNDS = [
  Math.min(...MOCK_LISTINGS.map((v) => v.weekly_rent)),
  Math.max(...MOCK_LISTINGS.map((v) => v.weekly_rent)),
];
// Short labels for the sticky bar's inline segmented control, where space is
// tight; the dialog and filter chips use the full ENGINE_OPTIONS wording.
const BAR_FUEL_OPTIONS = FUEL_OPTIONS.map((o) => ({ value: o.value, label: o.value }));
const MAKE_OPTIONS = MOCK_MAKES.filter((m) => m !== "All Makes");

function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* ── Small, hoisted pieces. Kept out of the page function so their identity
   never changes between renders - a component redefined on every keystroke
   gets unmounted and remounted by React, which was silently resetting any
   local UI state (open sections, popover position) on every filter edit. ── */

function optionCls(active) {
  return `pressable w-full text-left rounded-md px-2.5 py-2 text-[13.5px] ${active ? "text-green font-semibold bg-green-soft" : "text-ink hover:bg-surface-2"}`;
}

function OptionList({ options, value, onChange }) {
  return (
    <div className="max-h-64 overflow-y-auto -m-1 p-1">
      {options.map((o) => (
        <PopoverClose asChild key={o.value}>
          <button type="button" className={optionCls(value === o.value)} onClick={() => onChange(o.value)}>{o.label}</button>
        </PopoverClose>
      ))}
    </div>
  );
}

function SegmentedControl({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          data-active={value === o.value}
          onClick={() => onChange(value === o.value ? "" : o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ControlSegment({ label, value, children, className = "" }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={`control-seg pressable ${className}`}>
          <span className="control-seg-label">{label}</span>
          <span className="control-seg-value">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start">{children}</PopoverContent>
    </Popover>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="pressable inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-line-strong bg-surface text-[12.5px] font-medium text-ink">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`} className="pressable text-ink-3 hover:text-ink">
        <X size={12} strokeWidth={2} />
      </button>
    </span>
  );
}

/** The weekly rent range, always visible and always live, never behind a
 * click. This is a compact companion to the full histogram slider used in
 * the filters dialog: same track and handle language, no bars, sized to sit
 * inside a control-bar segment. */
function InlineRentTrack({ id, min, max, value, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null); // "lo" | "hi" | null
  const span = Math.max(1, max - min);
  const [lo, hi] = value;
  const pct = useCallback((v) => ((v - min) / span) * 100, [min, span]);

  const valueFromClientX = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return lo;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    return Math.round(min + ratio * span);
  }, [lo, min, span]);

  useEffect(() => {
    if (!dragging) return undefined;
    const move = (e) => {
      const v = valueFromClientX(e.clientX);
      if (dragging === "lo") onChange([Math.min(v, hi - 5), hi]);
      else onChange([lo, Math.max(v, lo + 5)]);
    };
    const up = () => setDragging(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, hi, lo, onChange, valueFromClientX]);

  const onKey = (which) => (e) => {
    const step = e.shiftKey ? 25 : 5;
    let next = which === "lo" ? lo : hi;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next += step;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else return;
    e.preventDefault();
    next = Math.min(max, Math.max(min, next));
    if (which === "lo") onChange([Math.min(next, hi - 5), hi]);
    else onChange([lo, Math.max(next, lo + 5)]);
  };

  const handle = (which, v) => (
    <button
      type="button"
      role="slider"
      aria-label={which === "lo" ? "Minimum weekly rent" : "Maximum weekly rent"}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={v}
      aria-valuetext={`£${v} a week`}
      data-testid={`${id}-${which}`}
      onPointerDown={(e) => { e.preventDefault(); setDragging(which); }}
      onKeyDown={onKey(which)}
      style={{ left: `${pct(v)}%` }}
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-surface border-2 border-ink shadow-1 cursor-grab active:cursor-grabbing touch-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/30 after:absolute after:-inset-3 after:content-['']"
    />
  );

  return (
    <div ref={trackRef} className="relative h-5 w-full select-none" data-testid={id}>
      <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-surface-2" />
      <span className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-ink" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      {handle("lo", lo)}
      {handle("hi", hi)}
    </div>
  );
}

const listParam = (v) => (v && v.length ? v.join(",") : "");
const parseListParam = (v) => (v ? v.split(",").filter(Boolean) : []);

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  useSeo({
    title: SEARCH.seo.title,
    description: SEARCH.seo.description,
    canonical: "https://kharo.co.uk/search",
  });

  const [city, setCityRaw] = useState(searchParams.get("city") || "");
  const [borough, setBorough] = useState(searchParams.get("borough") || "");
  const [make, setMakeRaw] = useState(searchParams.get("make") || "");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [fuelFilter, setFuelFilter] = useState(searchParams.get("engine") || "");
  const [bodyFilters, setBodyFilters] = useState(parseListParam(searchParams.get("bodyType")));
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [seatsFilters, setSeatsFilters] = useState(parseListParam(searchParams.get("seats")).map(Number));
  const [councils, setCouncils] = useState(parseListParam(searchParams.get("council")));
  const [yearRange, setYearRange] = useState([
    searchParams.get("yearMin") ? Math.max(YEAR_BOUNDS[0], parseInt(searchParams.get("yearMin"), 10) || YEAR_BOUNDS[0]) : YEAR_BOUNDS[0],
    searchParams.get("yearMax") ? Math.min(YEAR_BOUNDS[1], parseInt(searchParams.get("yearMax"), 10) || YEAR_BOUNDS[1]) : YEAR_BOUNDS[1],
  ]);
  const [mileageMin, setMileageMin] = useState(parseInt(searchParams.get("minMileage"), 10) || 0);
  const [sortBy, setSortBy] = useState("price_asc");
  const [showMap, setShowMap] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [nearMe, setNearMe] = useState(null); // { lat, lon } | null
  const [nearMeStatus, setNearMeStatus] = useState("idle"); // idle | loading | denied | unsupported

  const areaOptions = city
    ? AREAS_BY_CITY[city] || ["All Areas"]
    : ["All Areas", ...Array.from(new Set(LIVE_CITIES.flatMap((c) => (AREAS_BY_CITY[c] || []).slice(1))))];

  const setCity = (next) => { setCityRaw(next); setBorough(""); };
  const setMake = (next) => { setMakeRaw(next); setModel(""); };

  const toggleBody = (bt) => setBodyFilters((prev) => (prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt]));
  const toggleSeat = (n) => setSeatsFilters((prev) => (prev.includes(n) ? prev.filter((s) => s !== n) : [...prev, n]));
  const toggleCouncil = (a) => setCouncils((prev) => (prev.includes(a) ? prev.filter((c) => c !== a) : [...prev, a]));

  // Everything except price, so the histogram and "in range" count stay
  // truthful to the other filters currently applied.
  const filtersExceptPrice = useMemo(() => ({
    city, borough, make, model, fuel: fuelFilter, transmission,
    bodyTypes: bodyFilters, seats: seatsFilters, councils, yearRange, mileageMin,
  }), [city, borough, make, model, fuelFilter, transmission, bodyFilters, seatsFilters, councils, yearRange, mileageMin]);

  const basePool = useMemo(() => applyFilters(MOCK_LISTINGS, filtersExceptPrice, ["price"]), [filtersExceptPrice]);

  const priceValues = useMemo(() => basePool.map((v) => v.weekly_rent), [basePool]);
  const priceMin = priceValues.length ? Math.min(...priceValues) : 0;
  const priceMax = priceValues.length ? Math.max(...priceValues) : 0;

  const [initialBudget] = useState(() => searchParams.get("budget") || "");
  const [initialMinBudget] = useState(() => searchParams.get("minBudget") || "");
  const [priceRange, setPriceRange] = useState(null);
  const priceInitialised = useRef(false);

  useEffect(() => {
    if (priceInitialised.current || !priceValues.length) return;
    priceInitialised.current = true;
    const hi = initialBudget ? Math.min(priceMax, parseInt(initialBudget, 10) || priceMax) : priceMax;
    const lo = initialMinBudget ? Math.max(priceMin, parseInt(initialMinBudget, 10) || priceMin) : priceMin;
    setPriceRange([Math.min(lo, hi), Math.max(lo, hi)]);
  }, [priceValues.length, priceMin, priceMax, initialBudget, initialMinBudget]);

  // Bounds can shift as other filters narrow the pool; keep the selection
  // inside them without discarding a deliberate user choice.
  useEffect(() => {
    if (!priceInitialised.current) return;
    setPriceRange((prev) => {
      if (!prev) return prev;
      const [lo, hi] = prev;
      const nlo = Math.min(Math.max(lo, priceMin), priceMax);
      const nhi = Math.min(Math.max(hi, priceMin), priceMax);
      return nlo === lo && nhi === hi ? prev : [nlo, nhi];
    });
  }, [priceMin, priceMax]);

  const effectiveRange = useMemo(() => priceRange ?? [priceMin, priceMax], [priceRange, priceMin, priceMax]);

  // Keep every filter in the URL so a filtered view is shareable and the
  // back button works. Price is synced separately, debounced, since it
  // changes on every pointer-move while dragging.
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const setOrDelete = (k, v) => { if (v) next.set(k, v); else next.delete(k); };
      setOrDelete("city", city);
      setOrDelete("borough", borough);
      setOrDelete("make", make);
      setOrDelete("model", model);
      setOrDelete("engine", fuelFilter);
      setOrDelete("transmission", transmission);
      setOrDelete("bodyType", listParam(bodyFilters));
      setOrDelete("seats", listParam(seatsFilters.map(String)));
      setOrDelete("council", listParam(councils));
      if (yearRange[0] > YEAR_BOUNDS[0] || yearRange[1] < YEAR_BOUNDS[1]) {
        next.set("yearMin", String(yearRange[0]));
        next.set("yearMax", String(yearRange[1]));
      } else {
        next.delete("yearMin");
        next.delete("yearMax");
      }
      setOrDelete("minMileage", mileageMin ? String(mileageMin) : "");
      return next;
    }, { replace: true });
  }, [city, borough, make, model, fuelFilter, transmission, bodyFilters, seatsFilters, councils, yearRange, mileageMin, setSearchParams]);

  // Price bound sync, debounced against drag events.
  const budgetSyncTimer = useRef(null);
  useEffect(() => {
    if (!priceRange) return undefined;
    if (budgetSyncTimer.current) clearTimeout(budgetSyncTimer.current);
    budgetSyncTimer.current = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (priceRange[1] < priceMax) next.set("budget", String(Math.round(priceRange[1]))); else next.delete("budget");
        if (priceRange[0] > priceMin) next.set("minBudget", String(Math.round(priceRange[0]))); else next.delete("minBudget");
        return next;
      }, { replace: true });
    }, 200);
    return () => clearTimeout(budgetSyncTimer.current);
  }, [priceRange, priceMin, priceMax, setSearchParams]);

  const handleNearMe = () => {
    if (nearMe) { setNearMe(null); setNearMeStatus("idle"); return; }
    if (!navigator.geolocation) { setNearMeStatus("unsupported"); return; }
    setNearMeStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setNearMe({ lat: pos.coords.latitude, lon: pos.coords.longitude }); setNearMeStatus("on"); },
      () => { setNearMeStatus("denied"); setNearMe(null); },
      { timeout: 8000 }
    );
  };
  const nearMeLabel = { idle: "Off", loading: "Locating", on: "On", denied: "Unavailable", unsupported: "Unsupported" }[nearMeStatus];

  const results = useMemo(() => {
    const filters = { ...filtersExceptPrice, priceRange: effectiveRange };
    let data = applyFilters(MOCK_LISTINGS, filters, []);
    if (nearMe) {
      data = [...data].sort((a, b) => {
        const da = haversineKm([nearMe.lat, nearMe.lon], areaCoords(a.borough, a.city));
        const db = haversineKm([nearMe.lat, nearMe.lon], areaCoords(b.borough, b.city));
        return da - db;
      });
    } else if (sortBy === "price_desc") {
      data = [...data].sort((a, b) => b.weekly_rent - a.weekly_rent);
    } else {
      data = [...data].sort((a, b) => a.weekly_rent - b.weekly_rent);
    }
    return data;
  }, [filtersExceptPrice, effectiveRange, sortBy, nearMe]);

  const priceTouched = priceRange != null && (priceRange[0] > priceMin || priceRange[1] < priceMax);
  const yearTouched = yearRange[0] > YEAR_BOUNDS[0] || yearRange[1] < YEAR_BOUNDS[1];
  const hasFilters = Boolean(
    city || borough || make || model || fuelFilter || bodyFilters.length || transmission
    || seatsFilters.length || councils.length || yearTouched || mileageMin || priceTouched || nearMe
  );
  const extraActiveCount = [make, model].filter(Boolean).length + (transmission ? 1 : 0)
    + bodyFilters.length + seatsFilters.length + councils.length + (yearTouched ? 1 : 0) + (mileageMin ? 1 : 0);
  const mobileActiveCount = extraActiveCount + [borough, fuelFilter].filter(Boolean).length
    + (priceTouched ? 1 : 0) + (nearMe ? 1 : 0);

  const clearAll = () => {
    setCityRaw(""); setBorough(""); setMakeRaw(""); setModel(""); setFuelFilter("");
    setBodyFilters([]); setTransmission(""); setSeatsFilters([]); setCouncils([]);
    setYearRange([YEAR_BOUNDS[0], YEAR_BOUNDS[1]]); setMileageMin(0);
    // Not [priceMin, priceMax]: those are computed from the pool as filtered
    // *before* this click takes effect, so they would freeze the range at the
    // narrowed bounds instead of the true full range.
    setPriceRange(FULL_PRICE_BOUNDS);
    setNearMe(null); setNearMeStatus("idle");
  };

  const animateLayout = results.length <= 24;
  const cityHasNoCars = results.length === 0 && city && !LIVE_CITIES.includes(city);
  const priceValueLabel = priceValues.length ? `£${Math.round(effectiveRange[0])} to £${Math.round(effectiveRange[1])}` : "Any budget";
  const fuelValueLabel = fuelFilter ? (FUEL_OPTIONS.find((o) => o.value === fuelFilter)?.label ?? fuelFilter) : "Any fuel";
  const ageValueLabel = yearTouched ? SEARCH.filters.ageRange(yearRange[0], yearRange[1]) : SEARCH.filters.ageRange(YEAR_BOUNDS[0], YEAR_BOUNDS[1]);

  return (
    <div className="min-h-page bg-bone">
      <PreviewNotice />

      {/* Sticky filter bar: one cohesive instrument, not a row of floating
          pills. Weekly rent is always the live left-to-right slider here,
          never a control you must open first. */}
      <div className="sticky top-below-header z-30 bg-bone/95 border-b border-line shadow-1">
        <div className="wrap py-2.5">
          <div className="hidden lg:flex control-bar">
            <ControlSegment label={SEARCH.filters.cityLabel} value={city || "Any city"} className="flex-[0.75]">
              <OptionList
                options={[{ label: "Any city", value: "" }, ...ALL_CITIES.map((c) => ({ label: c, value: c }))]}
                value={city}
                onChange={setCity}
              />
            </ControlSegment>
            <ControlSegment label={SEARCH.filters.areaLabel} value={borough || "All areas"} className="flex-[0.75]">
              <OptionList
                options={[{ label: "All areas", value: "" }, ...areaOptions.slice(1).map((b) => ({ label: b, value: b }))]}
                value={borough}
                onChange={setBorough}
              />
            </ControlSegment>
            <div className="control-seg flex-[1.7] min-w-0" data-testid="fuel-bar">
              <span className="control-seg-label">{SEARCH.filters.fuelLabel}</span>
              {/* Guards against the segmented control ever silently clipping
                  a fuel option if the bar is narrower than expected: this
                  scrolls instead, since .segmented itself hides overflow. */}
              <div className="mt-1 overflow-x-auto -mx-0.5 px-0.5">
                <SegmentedControl label={SEARCH.filters.fuelLabel} options={BAR_FUEL_OPTIONS} value={fuelFilter} onChange={setFuelFilter} />
              </div>
            </div>
            <div className="control-seg flex-[1.8] min-w-0" data-testid="rent-slider-bar">
              <div className="flex items-baseline justify-between gap-2">
                <span className="control-seg-label">{SEARCH.filters.budgetLabel}</span>
                <span className="control-seg-value">{priceValueLabel}</span>
              </div>
              <div className="mt-1.5 px-0.5">
                <InlineRentTrack id="price-range-bar" min={priceMin} max={priceMax} value={effectiveRange} onChange={setPriceRange} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="control-seg pressable"
              data-testid="more-filters-btn"
            >
              <span className="control-seg-label">&nbsp;</span>
              <span className="control-seg-value inline-flex items-center gap-1.5">
                <SlidersHorizontal size={13} strokeWidth={1.75} /> {SEARCH.filters.moreFilters}
                {extraActiveCount > 0 && <span className="tabular h-4 min-w-4 px-1 rounded-full bg-green text-white text-[10px] font-semibold grid place-items-center">{extraActiveCount}</span>}
              </span>
            </button>
          </div>

          <div className="lg:hidden control-bar">
            <ControlSegment label={SEARCH.filters.cityLabel} value={city || "Any city"} className="flex-1">
              <OptionList
                options={[{ label: "Any city", value: "" }, ...ALL_CITIES.map((c) => ({ label: c, value: c }))]}
                value={city}
                onChange={setCity}
              />
            </ControlSegment>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="control-seg pressable"
              data-testid="mobile-filters-btn"
            >
              <span className="control-seg-label">&nbsp;</span>
              <span className="control-seg-value inline-flex items-center gap-1.5">
                <SlidersHorizontal size={13} strokeWidth={1.75} /> {SEARCH.filters.filtersButton}
                {mobileActiveCount > 0 && <span className="tabular h-4 min-w-4 px-1 rounded-full bg-green text-white text-[10px] font-semibold grid place-items-center">{mobileActiveCount}</span>}
              </span>
            </button>
          </div>

          {/* Weekly rent, always inline on mobile too: never a control you
              must open first, even in the collapsed bar. */}
          <div className="lg:hidden mt-2.5 control-bar">
            <div className="control-seg w-full" data-testid="rent-slider-bar-mobile">
              <div className="flex items-baseline justify-between gap-2">
                <span className="control-seg-label">{SEARCH.filters.budgetLabel}</span>
                <span className="control-seg-value">{priceValueLabel}</span>
              </div>
              <div className="mt-2 px-0.5">
                <InlineRentTrack id="price-range-bar-mobile" min={priceMin} max={priceMax} value={effectiveRange} onChange={setPriceRange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FiltersDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        resultCount={results.length}
        fuelOptions={FUEL_OPTIONS}
        city={city}
        borough={borough} setBorough={setBorough} areaOptions={areaOptions}
        fuel={fuelFilter} setFuel={setFuelFilter}
        transmission={transmission} setTransmission={setTransmission}
        bodyTypes={bodyFilters} toggleBodyType={toggleBody}
        seats={seatsFilters} toggleSeat={toggleSeat}
        councils={councils} toggleCouncil={toggleCouncil}
        make={make} setMake={setMake}
        model={model} setModel={setModel}
        yearRange={yearRange} setYearRange={setYearRange}
        mileageMin={mileageMin} setMileageMin={setMileageMin}
        priceValues={priceValues} priceMin={priceMin} priceMax={priceMax} priceRange={effectiveRange} setPriceRange={setPriceRange}
        makeOptions={MAKE_OPTIONS}
        hasFilters={hasFilters}
        onClear={clearAll}
      />

      <div className="wrap py-5 lg:py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-h3 font-heading font-extrabold text-ink" data-testid="results-count">
            {SEARCH.resultsCount(results.length)}
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNearMe}
              aria-pressed={!!nearMe}
              className={`pressable hidden sm:inline-flex items-center gap-1.5 h-10 px-3.5 rounded-md border border-line-strong bg-surface text-[13px] font-medium text-ink-2 ${nearMe ? "bg-green-soft" : ""}`}
              data-testid="near-me-toggle"
            >
              <LocateFixed size={14} strokeWidth={1.75} /> Near me
              <span className="tabular text-ink-3">{nearMeLabel}</span>
            </button>
            <label className="sr-only" htmlFor="search-sort">{SEARCH.sort.label}</label>
            <select
              id="search-sort"
              value={nearMe ? "distance" : sortBy}
              disabled={!!nearMe}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
            >
              {nearMe && <option value="distance">Nearest first</option>}
              {SEARCH.sort.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              type="button"
              onClick={() => setShowMap((s) => !s)}
              className="pressable inline-flex items-center gap-1.5 h-10 px-3.5 rounded-md border border-line-strong bg-surface text-[13px] font-medium text-ink-2"
              data-testid="map-toggle"
            >
              <MapIcon size={14} strokeWidth={1.75} /> {showMap ? SEARCH.map.hide : SEARCH.map.show}
            </button>
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {city && <FilterChip label={city} onRemove={() => setCity("")} />}
            {borough && <FilterChip label={borough} onRemove={() => setBorough("")} />}
            {make && <FilterChip label={make} onRemove={() => setMake("")} />}
            {model && <FilterChip label={model} onRemove={() => setModel("")} />}
            {fuelFilter && <FilterChip label={fuelValueLabel} onRemove={() => setFuelFilter("")} />}
            {transmission && <FilterChip label={transmission} onRemove={() => setTransmission("")} />}
            {bodyFilters.map((b) => <FilterChip key={b} label={b} onRemove={() => toggleBody(b)} />)}
            {seatsFilters.map((s) => <FilterChip key={s} label={SEARCH.filters.seatsValue(s)} onRemove={() => toggleSeat(s)} />)}
            {councils.map((c) => <FilterChip key={c} label={c} onRemove={() => toggleCouncil(c)} />)}
            {yearTouched && <FilterChip label={ageValueLabel} onRemove={() => setYearRange([YEAR_BOUNDS[0], YEAR_BOUNDS[1]])} />}
            {mileageMin > 0 && <FilterChip label={SEARCH.filters.mileageAtLeast(mileageMin)} onRemove={() => setMileageMin(0)} />}
            {priceTouched && <FilterChip label={`£${Math.round(effectiveRange[0])} to £${Math.round(effectiveRange[1])}/wk`} onRemove={() => setPriceRange([priceMin, priceMax])} />}
            {nearMe && <FilterChip label="Near me" onRemove={() => { setNearMe(null); setNearMeStatus("idle"); }} />}
            <button type="button" onClick={clearAll} className="pressable text-[13px] font-semibold text-green">
              {SEARCH.filters.clearAll}
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
          <div className={`flex-1 min-w-0 ${showMap ? "hidden lg:block" : ""}`}>
            {results.length === 0 && cityHasNoCars ? (
              <div className="py-14 max-w-lg" data-testid="empty-city-state">
                <h2 className="text-h3 font-heading font-bold text-ink">{SEARCH.emptyCity.heading(city)}</h2>
                <p className="mt-3 text-[15px] text-ink-2 leading-relaxed">{SEARCH.emptyCity.sub(city)}</p>
                <div className="mt-6">
                  <CityInterestForm city={city} compact />
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-14 max-w-md" data-testid="empty-filters-state">
                <h2 className="text-h3 font-heading font-bold text-ink">{SEARCH.emptyFilters.heading}</h2>
                <p className="mt-3 text-[15px] text-ink-2">{SEARCH.emptyFilters.sub}</p>
                <Button onClick={clearAll} className="mt-6">{SEARCH.emptyFilters.cta}</Button>
              </div>
            ) : animateLayout ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
                <AnimatePresence mode="popLayout">
                  {results.map((v) => (
                    <motion.div
                      key={v.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={SPRING.ui}
                    >
                      <VehicleCard vehicle={v} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
                {results.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>

          {showMap && (
            <div
              className="w-full lg:w-[min(28rem,40vw)] lg:shrink-0 fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 lg:static lg:z-auto lg:sticky lg:top-below-header lg:h-[calc(100dvh-8rem)]"
              data-testid="search-map-pane"
            >
              <div className="h-full rounded-none lg:rounded-lg overflow-hidden border-0 lg:border lg:border-line bg-surface-2">
                <SearchMap results={results} activeBorough={borough} onAreaClick={(b) => setBorough(b || "")} visibilityTrigger={showMap} />
              </div>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="pressable lg:hidden bottom-safe absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink text-white text-[13px] font-semibold shadow-2"
                data-testid="back-to-list"
              >
                <ListIcon size={16} strokeWidth={1.75} /> {SEARCH.map.backToList}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
