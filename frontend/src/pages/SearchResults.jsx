import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Close as PopoverClose } from "@radix-ui/react-popover";
import { SlidersHorizontal, X, Map as MapIcon, List as ListIcon, LocateFixed } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, AREAS_BY_CITY, ENGINE_OPTIONS } from "@/data/mockListings";
import { ALL_CITIES, LIVE_CITIES } from "@/lib/cities";
import { areaCoords } from "@/lib/geo";
import VehicleCard from "@/components/VehicleCard";
import SearchMap from "@/components/SearchMap";
import CityInterestForm from "@/components/CityInterestForm";
import PreviewNotice from "@/components/PreviewNotice";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useSeo } from "@/lib/seo";
import { SPRING } from "@/lib/motion";
import { SEARCH } from "@/content/pages/marketplace";

const BODY_TYPES = ["Saloon", "Estate", "SUV", "Crossover", "MPV", "Hatchback"];
const FUEL_OPTIONS = ENGINE_OPTIONS.filter((o) => o.value);
const TRANSMISSIONS = ["Automatic", "Manual"];

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

/** The sheet holding every filter on mobile, and the overflow filters (make,
 * body type, transmission) on desktop where city/area/fuel/budget already
 * sit as segments in the control bar. */
function MoreFiltersSheet({
  open, onOpenChange, full, resultCount,
  city, setCity, borough, setBorough, areaOptions,
  fuelFilter, setFuelFilter,
  priceValues, priceMin, priceMax, priceRange, setPriceRange,
  make, setMake, bodyFilters, toggleBody, transmission, setTransmission,
  hasFilters, onClear,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85svh] overflow-y-auto rounded-t-lg pb-safe">
        <SheetTitle className="text-h3 font-heading font-bold text-ink">{SEARCH.filters.filtersButton}</SheetTitle>
        <SheetDescription className="sr-only">Narrow the cars shown by city, area, fuel, budget, make, body type and transmission.</SheetDescription>
        <div className="mt-5 flex flex-col gap-5">
          {full && (
            <>
              <label className="block">
                <span className="block text-[13px] font-medium text-ink-2 mb-1.5">{SEARCH.filters.cityLabel}</span>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="select-field w-full">
                  <option value="">{SEARCH.filters.cityPlaceholder}</option>
                  {ALL_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-[13px] font-medium text-ink-2 mb-1.5">{SEARCH.filters.areaLabel}</span>
                <select value={borough} onChange={(e) => setBorough(e.target.value)} className="select-field w-full">
                  <option value="">{SEARCH.filters.areaPlaceholder}</option>
                  {areaOptions.slice(1).map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>
              <div>
                <p className="text-[13px] font-medium text-ink-2 mb-2">{SEARCH.filters.fuelLabel}</p>
                <SegmentedControl label={SEARCH.filters.fuelLabel} options={FUEL_OPTIONS} value={fuelFilter} onChange={setFuelFilter} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-ink-2 mb-2">{SEARCH.filters.budgetLabel}</p>
                <PriceRangeFilter id="price-range-mobile" values={priceValues} min={priceMin} max={priceMax} value={priceRange} onChange={setPriceRange} />
              </div>
            </>
          )}
          <label className="block">
            <span className="block text-[13px] font-medium text-ink-2 mb-1.5">{SEARCH.filters.makeLabel}</span>
            <select value={make} onChange={(e) => setMake(e.target.value)} className="select-field w-full">
              {MOCK_MAKES.map((m) => <option key={m} value={m === "All Makes" ? "" : m}>{m}</option>)}
            </select>
          </label>
          <div>
            <p className="text-[13px] font-medium text-ink-2 mb-2">{SEARCH.filters.bodyLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {BODY_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => toggleBody(bt)}
                  className={`pressable h-8 px-3 rounded-md border text-[12.5px] font-medium ${bodyFilters.includes(bt) ? "bg-ink border-ink text-white" : "bg-surface border-line-strong text-ink-2"}`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] font-medium text-ink-2 mb-2">{SEARCH.filters.transmissionLabel}</p>
            <SegmentedControl label={SEARCH.filters.transmissionLabel} options={TRANSMISSIONS.map((t) => ({ label: t, value: t }))} value={transmission} onChange={setTransmission} />
          </div>
        </div>

        <div className="mt-7 flex gap-2.5">
          {hasFilters && (
            <Button variant="outline" onClick={onClear} className="flex-1">{SEARCH.filters.clearAll}</Button>
          )}
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            {SEARCH.resultsCount(resultCount)}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  useSeo({
    title: SEARCH.seo.title,
    description: SEARCH.seo.description,
    canonical: "https://kharo.co.uk/search",
  });

  const [city, setCityRaw] = useState(searchParams.get("city") || "");
  const [borough, setBorough] = useState(searchParams.get("borough") || "");
  const [make, setMake] = useState(searchParams.get("make") || "");
  const [fuelFilter, setFuelFilter] = useState(searchParams.get("engine") || "");
  const [bodyFilters, setBodyFilters] = useState(searchParams.get("bodyType") ? [searchParams.get("bodyType")] : []);
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [sortBy, setSortBy] = useState("price_asc");
  const [showMap, setShowMap] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFull, setSheetFull] = useState(true);
  const [nearMe, setNearMe] = useState(null); // { lat, lon } | null
  const [nearMeStatus, setNearMeStatus] = useState("idle"); // idle | loading | denied | unsupported

  const areaOptions = city
    ? AREAS_BY_CITY[city] || ["All Areas"]
    : ["All Areas", ...Array.from(new Set(LIVE_CITIES.flatMap((c) => (AREAS_BY_CITY[c] || []).slice(1))))];

  const setCity = (next) => { setCityRaw(next); setBorough(""); };

  const toggleBody = (bt) => setBodyFilters((prev) => (prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt]));

  // Everything except price, so the histogram and "in range" count stay
  // truthful to the other filters currently applied.
  const basePool = useMemo(() => {
    let data = [...MOCK_LISTINGS];
    if (city) data = data.filter((v) => v.city === city);
    if (borough) data = data.filter((v) => v.borough === borough);
    if (make) data = data.filter((v) => v.make === make);
    if (fuelFilter) data = data.filter((v) => v.fuel === fuelFilter);
    if (bodyFilters.length) data = data.filter((v) => bodyFilters.includes(v.body_type));
    if (transmission) data = data.filter((v) => v.transmission === transmission);
    return data;
  }, [city, borough, make, fuelFilter, bodyFilters, transmission]);

  const priceValues = useMemo(() => basePool.map((v) => v.weekly_rent), [basePool]);
  const priceMin = priceValues.length ? Math.min(...priceValues) : 0;
  const priceMax = priceValues.length ? Math.max(...priceValues) : 0;

  const [initialBudget] = useState(() => searchParams.get("budget") || "");
  const [priceRange, setPriceRange] = useState(null);
  const priceInitialised = useRef(false);

  useEffect(() => {
    if (priceInitialised.current || !priceValues.length) return;
    priceInitialised.current = true;
    const hi = initialBudget ? Math.min(priceMax, parseInt(initialBudget, 10) || priceMax) : priceMax;
    setPriceRange([priceMin, Math.max(priceMin, hi)]);
  }, [priceValues.length, priceMin, priceMax, initialBudget]);

  // Bounds can shift as other filters narrow the pool; keep the selection
  // inside them without discarding a deliberate user choice.
  useEffect(() => {
    if (!priceInitialised.current) return;
    setPriceRange(([lo, hi]) => {
      const nlo = Math.min(Math.max(lo, priceMin), priceMax);
      const nhi = Math.min(Math.max(hi, priceMin), priceMax);
      return nlo === lo && nhi === hi ? [lo, hi] : [nlo, nhi];
    });
  }, [priceMin, priceMax]);

  const effectiveRange = useMemo(() => priceRange ?? [priceMin, priceMax], [priceRange, priceMin, priceMax]);

  // Keep the upper bound in the URL so shared /search?budget= links still work.
  const budgetSyncTimer = useRef(null);
  useEffect(() => {
    if (!priceRange) return;
    if (budgetSyncTimer.current) clearTimeout(budgetSyncTimer.current);
    budgetSyncTimer.current = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (priceRange[1] < priceMax) next.set("budget", String(Math.round(priceRange[1])));
        else next.delete("budget");
        return next;
      }, { replace: true });
    }, 200);
    return () => clearTimeout(budgetSyncTimer.current);
  }, [priceRange, priceMax, setSearchParams]);

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
    const [lo, hi] = effectiveRange;
    let data = basePool.filter((v) => v.weekly_rent >= lo && v.weekly_rent <= hi);
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
  }, [basePool, effectiveRange, sortBy, nearMe]);

  const priceTouched = priceRange != null && (priceRange[0] > priceMin || priceRange[1] < priceMax);
  const hasFilters = Boolean(city || borough || make || fuelFilter || bodyFilters.length || transmission || priceTouched || nearMe);
  const extraActiveCount = [make, transmission].filter(Boolean).length + bodyFilters.length;
  const mobileActiveCount = [city, borough, make, fuelFilter, transmission].filter(Boolean).length + bodyFilters.length + (priceTouched ? 1 : 0) + (nearMe ? 1 : 0);

  const clearAll = () => {
    setCityRaw(""); setBorough(""); setMake(""); setFuelFilter("");
    setBodyFilters([]); setTransmission("");
    setPriceRange([priceMin, priceMax]);
    setNearMe(null); setNearMeStatus("idle");
  };

  const animateLayout = results.length <= 24;
  const cityHasNoCars = results.length === 0 && city && !LIVE_CITIES.includes(city);
  const priceValueLabel = priceValues.length ? `£${Math.round(effectiveRange[0])} to £${Math.round(effectiveRange[1])}` : "Any budget";
  const fuelValueLabel = fuelFilter ? (FUEL_OPTIONS.find((o) => o.value === fuelFilter)?.label ?? fuelFilter) : "Any fuel";

  return (
    <div className="min-h-page bg-bone">
      <PreviewNotice />

      {/* Sticky filter bar: one cohesive instrument, not a row of floating pills. */}
      <div className="sticky top-below-header z-30 bg-bone/95 border-b border-line shadow-1">
        <div className="wrap py-2.5">
          <div className="hidden lg:flex control-bar">
            <ControlSegment label={SEARCH.filters.cityLabel} value={city || "Any city"} className="flex-[1.1]">
              <OptionList
                options={[{ label: "Any city", value: "" }, ...ALL_CITIES.map((c) => ({ label: c, value: c }))]}
                value={city}
                onChange={setCity}
              />
            </ControlSegment>
            <ControlSegment label={SEARCH.filters.areaLabel} value={borough || "All areas"} className="flex-[1.1]">
              <OptionList
                options={[{ label: "All areas", value: "" }, ...areaOptions.slice(1).map((b) => ({ label: b, value: b }))]}
                value={borough}
                onChange={setBorough}
              />
            </ControlSegment>
            <ControlSegment label={SEARCH.filters.fuelLabel} value={fuelValueLabel} className="flex-1">
              <SegmentedControl label={SEARCH.filters.fuelLabel} options={FUEL_OPTIONS} value={fuelFilter} onChange={setFuelFilter} />
            </ControlSegment>
            <ControlSegment label={SEARCH.filters.budgetLabel} value={priceValueLabel} className="flex-[1.6]">
              <PriceRangeFilter id="price-range-desktop" values={priceValues} min={priceMin} max={priceMax} value={effectiveRange} onChange={setPriceRange} />
            </ControlSegment>
            <button
              type="button"
              onClick={handleNearMe}
              aria-pressed={!!nearMe}
              className={`control-seg pressable ${nearMe ? "bg-green-soft" : ""}`}
              data-testid="near-me-toggle"
            >
              <span className="control-seg-label inline-flex items-center gap-1"><LocateFixed size={11} strokeWidth={2} /> Near me</span>
              <span className="control-seg-value">{nearMeLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => { setSheetFull(false); setSheetOpen(true); }}
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
            <ControlSegment label={SEARCH.filters.budgetLabel} value={priceValueLabel} className="flex-1">
              <PriceRangeFilter id="price-range-mobile-quick" values={priceValues} min={priceMin} max={priceMax} value={effectiveRange} onChange={setPriceRange} />
            </ControlSegment>
            <button
              type="button"
              onClick={() => { setSheetFull(true); setSheetOpen(true); }}
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
        </div>
      </div>

      <MoreFiltersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        full={sheetFull}
        resultCount={results.length}
        city={city} setCity={setCity}
        borough={borough} setBorough={setBorough}
        areaOptions={areaOptions}
        fuelFilter={fuelFilter} setFuelFilter={setFuelFilter}
        priceValues={priceValues} priceMin={priceMin} priceMax={priceMax} priceRange={effectiveRange} setPriceRange={setPriceRange}
        make={make} setMake={setMake}
        bodyFilters={bodyFilters} toggleBody={toggleBody}
        transmission={transmission} setTransmission={setTransmission}
        hasFilters={hasFilters}
        onClear={clearAll}
      />

      <div className="wrap py-5 lg:py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-h3 font-heading font-extrabold text-ink" data-testid="results-count">
            {SEARCH.resultsCount(results.length)}
          </h1>
          <div className="flex items-center gap-2">
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
            {fuelFilter && <FilterChip label={fuelValueLabel} onRemove={() => setFuelFilter("")} />}
            {priceTouched && <FilterChip label={`£${Math.round(effectiveRange[0])} to £${Math.round(effectiveRange[1])}/wk`} onRemove={() => setPriceRange([priceMin, priceMax])} />}
            {bodyFilters.map((b) => <FilterChip key={b} label={b} onRemove={() => toggleBody(b)} />)}
            {transmission && <FilterChip label={transmission} onRemove={() => setTransmission("")} />}
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
