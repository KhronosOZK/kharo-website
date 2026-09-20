import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Map as MapIcon, List as ListIcon, ArrowUp } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, AREAS_BY_CITY, ENGINE_OPTIONS } from "@/data/mockListings";
import { trackEvent } from "@/lib/api";
import { ALL_CITIES, LIVE_CITIES } from "@/lib/cities";
import { areaCoords } from "@/lib/geo";
import VehicleCard from "@/components/VehicleCard";
import SearchMap from "@/components/SearchMap";
import CityInterestForm from "@/components/CityInterestForm";
import FiltersDialog, { FilterPanel, applyFilters, YEAR_BOUNDS } from "@/components/FiltersDialog";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { SPRING } from "@/lib/motion";
import { SEARCH } from "@/content/pages/marketplace";

const FUEL_OPTIONS = ENGINE_OPTIONS.filter((o) => o.value);
// The true, filter-independent rent bounds across every listing, used to
// reset the slider on "Clear all" without racing the filtered pool's bounds.
const FULL_PRICE_BOUNDS = [0, Math.max(500, ...MOCK_LISTINGS.map((v) => v.weekly_rent))];
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

function FilterChip({ label, onRemove }) {
  return (
    <span className="pressable inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-line-strong bg-surface text-[12.5px] font-medium text-ink">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`} className="pressable text-ink-3 hover:text-ink">
        <X size={12} strokeWidth={2} />
      </button>
    </span>
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
  const [colour, setColour] = useState(searchParams.get("colour") || "");
  const [seatsFilters, setSeatsFilters] = useState(parseListParam(searchParams.get("seats")).map(Number));
  const [councils, setCouncils] = useState(parseListParam(searchParams.get("council")));
  const [yearRange, setYearRange] = useState([
    searchParams.get("yearMin") ? Math.max(YEAR_BOUNDS[0], parseInt(searchParams.get("yearMin"), 10) || YEAR_BOUNDS[0]) : YEAR_BOUNDS[0],
    searchParams.get("yearMax") ? Math.min(YEAR_BOUNDS[1], parseInt(searchParams.get("yearMax"), 10) || YEAR_BOUNDS[1]) : YEAR_BOUNDS[1],
  ]);
  const [mileageMin, setMileageMin] = useState(parseInt(searchParams.get("minMileage"), 10) || 0);
  const [breakdownOnly, setBreakdownOnly] = useState(searchParams.get("breakdown") === "1");
  const [sortBy, setSortBy] = useState("recommended");
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [showMap, setShowMap] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [nearMe, setNearMe] = useState(null); // { lat, lon } | null
  const [nearMeStatus, setNearMeStatus] = useState("idle"); // idle | loading | denied | unsupported

  const areaOptions = city
    ? AREAS_BY_CITY[city] || ["All Areas"]
    : ["All Areas", ...Array.from(new Set(LIVE_CITIES.flatMap((c) => (AREAS_BY_CITY[c] || []).slice(1))))];

  const setCity = (next) => { setCityRaw(next); setBorough(""); };
  const setMake = (next) => { setMakeRaw(next); setModel(""); };

  const toggleSeat = (n) => setSeatsFilters((prev) => (prev.includes(n) ? prev.filter((s) => s !== n) : [...prev, n]));
  const toggleCouncil = (a) => setCouncils((prev) => (prev.includes(a) ? prev.filter((c) => c !== a) : [...prev, a]));

  // Everything except price, so the histogram and "in range" count stay
  // truthful to the other filters currently applied.
  const filtersExceptPrice = useMemo(() => ({
    city, borough, make, model, fuel: fuelFilter, transmission,
    bodyTypes: bodyFilters, colour, seats: seatsFilters, councils, yearRange, mileageMin, breakdownOnly,
  }), [city, borough, make, model, fuelFilter, transmission, colour, bodyFilters, seatsFilters, councils, yearRange, mileageMin, breakdownOnly]);

  const basePool = useMemo(() => applyFilters(MOCK_LISTINGS, filtersExceptPrice, ["price"]), [filtersExceptPrice]);

  const priceValues = useMemo(() => basePool.map((v) => v.weekly_rent), [basePool]);
  // A fixed £0 to £500 scale, so the slider means the same thing on every
  // visit and a driver can type a budget below the cheapest car.
  const priceMin = FULL_PRICE_BOUNDS[0];
  const priceMax = FULL_PRICE_BOUNDS[1];

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
      setOrDelete("colour", colour);
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
      setOrDelete("breakdown", breakdownOnly ? "1" : "");
      return next;
    }, { replace: true });
  }, [city, borough, make, model, fuelFilter, transmission, colour, bodyFilters, seatsFilters, councils, yearRange, mileageMin, breakdownOnly, setSearchParams]);

  // What people filter on is the demand signal investors ask for: which
  // councils, which budgets, hybrid or electric. Logged once per settled
  // change, never per keystroke.
  const filterLogTimer = useRef(null);
  useEffect(() => {
    if (!priceRange) return undefined;
    if (filterLogTimer.current) clearTimeout(filterLogTimer.current);
    filterLogTimer.current = setTimeout(() => {
      trackEvent("search_filters", {
        city, borough, make, model, fuel: fuelFilter, transmission, body: bodyFilters, colour, seats: seatsFilters,
        councils, year_min: yearRange[0], year_max: yearRange[1], mileage_min: mileageMin, breakdown: breakdownOnly,
        budget_min: Math.round(priceRange[0]), budget_max: Math.round(priceRange[1]), sort: sortBy,
      });
    }, 1200);
    return () => clearTimeout(filterLogTimer.current);
  }, [city, borough, make, model, fuelFilter, transmission, bodyFilters, colour, seatsFilters, councils, yearRange, mileageMin, breakdownOnly, priceRange, sortBy]);

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
    } else if (sortBy === "price_asc") {
      data = [...data].sort((a, b) => a.weekly_rent - b.weekly_rent);
    } else if (sortBy === "newest") {
      data = [...data].sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === "oldest") {
      data = [...data].sort((a, b) => a.id.localeCompare(b.id));
    } else {
      // Recommended: cars with their own photographs first, cheapest within that.
      const shown = (v) => (typeof v.photos?.[0] === "string" && (v.photos[0].startsWith("/images/listings/") || v.photos[0].includes("prod-images.emergentagent.com")) ? 1 : 0);
      data = [...data].sort((a, b) => (shown(b) - shown(a)) || (a.weekly_rent - b.weekly_rent));
    }
    return data;
  }, [filtersExceptPrice, effectiveRange, sortBy, nearMe]);

  const priceTouched = priceRange != null && (priceRange[0] > priceMin || priceRange[1] < priceMax);
  const yearTouched = yearRange[0] > YEAR_BOUNDS[0] || yearRange[1] < YEAR_BOUNDS[1];
  const hasFilters = Boolean(
    city || borough || make || model || fuelFilter || bodyFilters.length || transmission || colour
    || seatsFilters.length || councils.length || yearTouched || mileageMin || breakdownOnly || priceTouched || nearMe
  );
  const extraActiveCount = [make, model, colour].filter(Boolean).length + (transmission ? 1 : 0)
    + bodyFilters.length + seatsFilters.length + councils.length + (yearTouched ? 1 : 0) + (mileageMin ? 1 : 0) + (breakdownOnly ? 1 : 0);
  const mobileActiveCount = extraActiveCount + [borough, fuelFilter].filter(Boolean).length
    + (priceTouched ? 1 : 0) + (nearMe ? 1 : 0);

  const clearAll = () => {
    setCityRaw(""); setBorough(""); setMakeRaw(""); setModel(""); setFuelFilter("");
    setBodyFilters([]); setTransmission(""); setColour(""); setSeatsFilters([]); setCouncils([]);
    setYearRange([YEAR_BOUNDS[0], YEAR_BOUNDS[1]]); setMileageMin(0); setBreakdownOnly(false);
    // Not [priceMin, priceMax]: those are computed from the pool as filtered
    // *before* this click takes effect, so they would freeze the range at the
    // narrowed bounds instead of the true full range.
    setPriceRange(FULL_PRICE_BOUNDS);
    setNearMe(null); setNearMeStatus("idle");
  };

  const animateLayout = results.length <= 24;
  const cityHasNoCars = results.length === 0 && city && !LIVE_CITIES.includes(city);
  const fuelValueLabel = fuelFilter ? (FUEL_OPTIONS.find((o) => o.value === fuelFilter)?.label ?? fuelFilter) : "Any fuel";
  const ageValueLabel = yearTouched ? SEARCH.filters.ageRange(yearRange[0], yearRange[1]) : SEARCH.filters.ageRange(YEAR_BOUNDS[0], YEAR_BOUNDS[1]);

  return (
    <div className="min-h-page bg-bone">

      {/* Phone: a shortcut back to the top of the listings once you are deep in them. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to the top of the listings"
        data-testid="back-to-top"
        className={`pressable fixed bottom-5 right-4 z-40 grid h-11 w-11 place-items-center rounded-md bg-ink text-white shadow-2 transition-[opacity,transform] duration-ui ease-out lg:hidden ${showTop ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"}`}
      >
        <ArrowUp size={18} strokeWidth={2} />
      </button>

      <FiltersDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        resultCount={results.length}
        fuelOptions={FUEL_OPTIONS}
        nearMe={!!nearMe} nearMeStatus={nearMeStatus} onNearMe={handleNearMe}
        city={city} setCity={setCity} cityOptions={ALL_CITIES}
        breakdownOnly={breakdownOnly} setBreakdownOnly={setBreakdownOnly}
        borough={borough} setBorough={setBorough} areaOptions={areaOptions}
        fuel={fuelFilter} setFuel={setFuelFilter}
        transmission={transmission} setTransmission={setTransmission}
        bodyTypes={bodyFilters} setBodyTypes={setBodyFilters}
        colour={colour} setColour={setColour}
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

      <div className="wrap py-5 lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-8 lg:py-8">
        {/* The filter sidebar, wide screens only. It scrolls with the page
            rather than inside its own box, so nothing is ever clipped. */}
        <aside className="hidden lg:block lg:self-start rounded-lg border border-line bg-surface p-5" data-testid="filter-sidebar">
          <FilterPanel
            fuelOptions={FUEL_OPTIONS}
            nearMe={!!nearMe} nearMeStatus={nearMeStatus} onNearMe={handleNearMe}
            city={city} setCity={setCity} cityOptions={ALL_CITIES}
            borough={borough} setBorough={setBorough} areaOptions={areaOptions}
            fuel={fuelFilter} setFuel={setFuelFilter}
            transmission={transmission} setTransmission={setTransmission}
            bodyTypes={bodyFilters} setBodyTypes={setBodyFilters}
            colour={colour} setColour={setColour}
            seats={seatsFilters} toggleSeat={toggleSeat}
            councils={councils} toggleCouncil={toggleCouncil}
            make={make} setMake={setMake} makeOptions={MAKE_OPTIONS}
            model={model} setModel={setModel}
            yearRange={yearRange} setYearRange={setYearRange}
            mileageMin={mileageMin} setMileageMin={setMileageMin}
            breakdownOnly={breakdownOnly} setBreakdownOnly={setBreakdownOnly}
            priceValues={priceValues} priceMin={priceMin} priceMax={priceMax} priceRange={effectiveRange} setPriceRange={setPriceRange}
            hasFilters={hasFilters} onClear={clearAll}
          />
        </aside>

        <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-h3 font-heading font-extrabold text-ink" data-testid="results-count">
            {SEARCH.resultsCount(results.length)}
          </h1>
          <div className="flex items-center gap-2">
            {/* Phones: the filters live behind one button, beside the sort. */}
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="pressable inline-flex h-10 items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3.5 text-[13px] font-medium text-ink lg:hidden"
              data-testid="mobile-filters-btn"
            >
              <SlidersHorizontal size={14} strokeWidth={1.75} /> {SEARCH.filters.filtersButton}
              {mobileActiveCount > 0 && <span className="tabular text-ink-3">({mobileActiveCount})</span>}
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
              <MapIcon size={14} strokeWidth={1.75} /> <span className="hidden sm:inline">{showMap ? SEARCH.map.hide : SEARCH.map.show}</span><span className="sm:hidden">Map</span>
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
            {bodyFilters.map((b) => <FilterChip key={b} label={b} onRemove={() => setBodyFilters([])} />)}
            {colour && <FilterChip label={colour} onRemove={() => setColour("")} />}
            {seatsFilters.map((s) => <FilterChip key={s} label={SEARCH.filters.seatsValue(s)} onRemove={() => toggleSeat(s)} />)}
            {councils.map((c) => <FilterChip key={c} label={c} onRemove={() => toggleCouncil(c)} />)}
            {yearTouched && <FilterChip label={ageValueLabel} onRemove={() => setYearRange([YEAR_BOUNDS[0], YEAR_BOUNDS[1]])} />}
            {mileageMin > 0 && <FilterChip label={SEARCH.filters.mileageAtLeast(mileageMin)} onRemove={() => setMileageMin(0)} />}
            {mileageMin === -1 && <FilterChip label={SEARCH.filters.mileageUnlimited} onRemove={() => setMileageMin(0)} />}
            {breakdownOnly && <FilterChip label="Breakdown cover included" onRemove={() => setBreakdownOnly(false)} />}
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
                aria-label="Close the map"
                className="pressable lg:hidden absolute right-3 top-3 z-[500] grid h-10 w-10 place-items-center rounded-md bg-surface text-ink shadow-2"
                data-testid="close-map"
              >
                <X size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="pressable lg:hidden absolute bottom-6 left-1/2 z-[500] -translate-x-1/2 inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink text-white text-[13px] font-semibold shadow-2"
                data-testid="back-to-list"
              >
                <ListIcon size={16} strokeWidth={1.75} /> {SEARCH.map.backToList}
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
