import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Map as MapIcon, List as ListIcon } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, AREAS_BY_CITY, BUDGET_OPTIONS, ENGINE_OPTIONS } from "@/data/mockListings";
import { ALL_CITIES, LIVE_CITIES } from "@/lib/cities";
import VehicleCard from "@/components/VehicleCard";
import SearchMap from "@/components/SearchMap";
import CityInterestForm from "@/components/CityInterestForm";
import PreviewNotice from "@/components/PreviewNotice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSeo } from "@/lib/seo";
import { SPRING } from "@/lib/motion";
import { SEARCH } from "@/content/pages/marketplace";

const BODY_TYPES = ["Saloon", "Estate", "SUV", "Crossover", "MPV", "Hatchback"];
const FUEL_OPTIONS = ENGINE_OPTIONS.filter((o) => o.value);
const TRANSMISSIONS = ["Automatic", "Manual"];

/* ── Small, hoisted pieces. Kept out of the page function so their identity
   never changes between renders - a component redefined on every keystroke
   gets unmounted and remounted by React, which was silently resetting any
   local UI state (open sections, sheet position) on every filter edit. ── */

function FilterSelect({ label, value, onChange, options, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-field w-full"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable shrink-0 h-9 px-3.5 rounded-full border text-[13px] font-medium ${
        active ? "bg-green border-green text-white" : "bg-surface border-line-strong text-ink-2"
      }`}
    >
      {children}
    </button>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="pressable inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-line-strong bg-surface text-[13px] font-medium text-ink">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`} className="pressable text-ink-3 hover:text-ink">
        <X size={13} strokeWidth={2} />
      </button>
    </span>
  );
}

/** The bottom sheet holding every filter on mobile, and the overflow filters
 * (make, body type, transmission) on desktop where city/area/fuel/budget
 * already sit in the sticky bar. */
function MoreFiltersSheet({
  open, onOpenChange, full, resultCount,
  city, setCity, borough, setBorough, areaOptions,
  fuelFilter, setFuelFilter, maxBudget, setMaxBudget,
  make, setMake, bodyFilters, toggleBody, transmission, setTransmission,
  hasFilters, onClear,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85svh] overflow-y-auto rounded-t-2xl pb-safe">
        <SheetTitle className="text-h3 font-heading font-bold text-ink">{SEARCH.filters.filtersButton}</SheetTitle>
        <div className="mt-5 flex flex-col gap-5">
          {full && (
            <>
              <FilterSelect
                label={SEARCH.filters.cityLabel}
                value={city}
                onChange={setCity}
                options={[{ label: SEARCH.filters.cityPlaceholder, value: "" }, ...ALL_CITIES.map((c) => ({ label: c, value: c }))]}
              />
              <FilterSelect
                label={SEARCH.filters.areaLabel}
                value={borough}
                onChange={setBorough}
                options={[{ label: SEARCH.filters.areaPlaceholder, value: "" }, ...areaOptions.slice(1).map((b) => ({ label: b, value: b }))]}
              />
              <div>
                <p className="text-[13px] font-medium text-ink-2 mb-2">{SEARCH.filters.fuelLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {FUEL_OPTIONS.map((f) => (
                    <PillButton key={f.value} active={fuelFilter === f.value} onClick={() => setFuelFilter(fuelFilter === f.value ? "" : f.value)}>
                      {f.label}
                    </PillButton>
                  ))}
                </div>
              </div>
              <FilterSelect label={SEARCH.filters.budgetLabel} value={maxBudget} onChange={setMaxBudget} options={BUDGET_OPTIONS} />
            </>
          )}
          <FilterSelect
            label={SEARCH.filters.makeLabel}
            value={make}
            onChange={setMake}
            options={MOCK_MAKES.map((m) => ({ label: m, value: m === "All Makes" ? "" : m }))}
          />
          <div>
            <p className="text-[13px] font-medium text-ink-2 mb-2">{SEARCH.filters.bodyLabel}</p>
            <div className="flex flex-wrap gap-2">
              {BODY_TYPES.map((bt) => (
                <PillButton key={bt} active={bodyFilters.includes(bt)} onClick={() => toggleBody(bt)}>{bt}</PillButton>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[13px] font-medium text-ink-2 mb-2">{SEARCH.filters.transmissionLabel}</p>
            <div className="flex flex-wrap gap-2">
              {TRANSMISSIONS.map((t) => (
                <PillButton key={t} active={transmission === t} onClick={() => setTransmission(transmission === t ? "" : t)}>{t}</PillButton>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex gap-3">
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
  const [searchParams] = useSearchParams();

  useSeo({
    title: SEARCH.seo.title,
    description: SEARCH.seo.description,
    canonical: "https://kharo.co.uk/search",
  });

  const [city, setCityRaw] = useState(searchParams.get("city") || "");
  const [borough, setBorough] = useState(searchParams.get("borough") || "");
  const [make, setMake] = useState(searchParams.get("make") || "");
  const [maxBudget, setMaxBudget] = useState(searchParams.get("budget") || "");
  const [fuelFilter, setFuelFilter] = useState(searchParams.get("engine") || "");
  const [bodyFilters, setBodyFilters] = useState(searchParams.get("bodyType") ? [searchParams.get("bodyType")] : []);
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [sortBy, setSortBy] = useState("price_asc");
  const [showMap, setShowMap] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFull, setSheetFull] = useState(true);

  const areaOptions = city
    ? AREAS_BY_CITY[city] || ["All Areas"]
    : ["All Areas", ...Array.from(new Set(LIVE_CITIES.flatMap((c) => (AREAS_BY_CITY[c] || []).slice(1))))];

  const setCity = (next) => { setCityRaw(next); setBorough(""); };

  const toggleBody = (bt) => setBodyFilters((prev) => (prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt]));

  const hasFilters = Boolean(city || borough || make || fuelFilter || maxBudget || bodyFilters.length || transmission);
  const extraActiveCount = [make, transmission].filter(Boolean).length + bodyFilters.length;
  const mobileActiveCount = [city, borough, make, fuelFilter, maxBudget, transmission].filter(Boolean).length + bodyFilters.length;

  const clearAll = () => {
    setCityRaw(""); setBorough(""); setMake(""); setFuelFilter(""); setMaxBudget("");
    setBodyFilters([]); setTransmission("");
  };

  const applyFilters = useCallback(() => {
    let data = [...MOCK_LISTINGS];
    if (city) data = data.filter((v) => v.city === city);
    if (borough) data = data.filter((v) => v.borough === borough);
    if (make) data = data.filter((v) => v.make === make);
    if (fuelFilter) data = data.filter((v) => v.fuel === fuelFilter);
    if (maxBudget) data = data.filter((v) => v.weekly_rent <= parseInt(maxBudget, 10));
    if (bodyFilters.length) data = data.filter((v) => bodyFilters.includes(v.body_type));
    if (transmission) data = data.filter((v) => v.transmission === transmission);

    if (sortBy === "price_asc") data.sort((a, b) => a.weekly_rent - b.weekly_rent);
    if (sortBy === "price_desc") data.sort((a, b) => b.weekly_rent - a.weekly_rent);
    return data;
  }, [city, borough, make, fuelFilter, maxBudget, bodyFilters, transmission, sortBy]);

  const [results, setResults] = useState([]);
  useEffect(() => { setResults(applyFilters()); }, [applyFilters]);

  const animateLayout = results.length <= 24;
  const cityHasNoCars = results.length === 0 && city && !LIVE_CITIES.includes(city);

  return (
    <div className="min-h-page bg-bone">
      <PreviewNotice />

      {/* Sticky filter bar. Not a sidebar card: a single row of controls that
          stays reachable while the grid scrolls underneath it. */}
      <div className="sticky top-below-header z-30 bg-bone/95 border-b border-line">
        <div className="wrap">
          <div className="hidden lg:flex items-center gap-3 py-3">
            <FilterSelect
              label={SEARCH.filters.cityLabel}
              value={city}
              onChange={setCity}
              options={[{ label: SEARCH.filters.cityPlaceholder, value: "" }, ...ALL_CITIES.map((c) => ({ label: c, value: c }))]}
              className="min-w-[9rem]"
            />
            <FilterSelect
              label={SEARCH.filters.areaLabel}
              value={borough}
              onChange={setBorough}
              options={[{ label: SEARCH.filters.areaPlaceholder, value: "" }, ...areaOptions.slice(1).map((b) => ({ label: b, value: b }))]}
              className="min-w-[9rem]"
            />
            <div className="flex flex-wrap gap-2">
              {FUEL_OPTIONS.map((f) => (
                <PillButton key={f.value} active={fuelFilter === f.value} onClick={() => setFuelFilter(fuelFilter === f.value ? "" : f.value)}>
                  {f.label}
                </PillButton>
              ))}
            </div>
            <FilterSelect label={SEARCH.filters.budgetLabel} value={maxBudget} onChange={setMaxBudget} options={BUDGET_OPTIONS} className="min-w-[10rem]" />
            <Button
              variant="outline"
              onClick={() => { setSheetFull(false); setSheetOpen(true); }}
              className="ml-auto shrink-0"
              data-testid="more-filters-btn"
            >
              <SlidersHorizontal size={16} strokeWidth={1.75} /> {SEARCH.filters.moreFilters}
              {extraActiveCount > 0 && (
                <span className="tabular h-5 w-5 rounded-full bg-green text-white text-[11px] font-semibold grid place-items-center">{extraActiveCount}</span>
              )}
            </Button>
          </div>

          <div className="lg:hidden track gap-2 py-3">
            <button
              type="button"
              onClick={() => { setSheetFull(true); setSheetOpen(true); }}
              className="pressable shrink-0 h-9 px-3.5 rounded-full border border-line-strong bg-surface text-[13px] font-medium text-ink inline-flex items-center gap-1.5"
              data-testid="mobile-filters-btn"
            >
              <SlidersHorizontal size={14} strokeWidth={1.75} /> {SEARCH.filters.filtersButton}
              {mobileActiveCount > 0 && (
                <span className="tabular h-5 w-5 rounded-full bg-green text-white text-[11px] font-semibold grid place-items-center">{mobileActiveCount}</span>
              )}
            </button>
            <PillButton active={Boolean(city)} onClick={() => { setSheetFull(true); setSheetOpen(true); }}>
              {city || SEARCH.filters.cityLabel}
            </PillButton>
            <PillButton active={Boolean(fuelFilter)} onClick={() => { setSheetFull(true); setSheetOpen(true); }}>
              {fuelFilter || SEARCH.filters.fuelLabel}
            </PillButton>
            <PillButton active={Boolean(maxBudget)} onClick={() => { setSheetFull(true); setSheetOpen(true); }}>
              {maxBudget ? `Up to £${maxBudget}/wk` : SEARCH.filters.budgetLabel}
            </PillButton>
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
        maxBudget={maxBudget} setMaxBudget={setMaxBudget}
        make={make} setMake={setMake}
        bodyFilters={bodyFilters} toggleBody={toggleBody}
        transmission={transmission} setTransmission={setTransmission}
        hasFilters={hasFilters}
        onClear={clearAll}
      />

      <div className="wrap py-6 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-h3 font-heading font-extrabold text-ink" data-testid="results-count">
            {SEARCH.resultsCount(results.length)}
          </h1>
          <div className="flex items-center gap-2.5">
            <label className="sr-only" htmlFor="search-sort">{SEARCH.sort.label}</label>
            <select
              id="search-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
            >
              {SEARCH.sort.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              type="button"
              onClick={() => setShowMap((s) => !s)}
              className="pressable inline-flex items-center gap-1.5 h-11 px-4 rounded-full border border-line-strong bg-surface text-[13.5px] font-medium text-ink-2"
              data-testid="map-toggle"
            >
              <MapIcon size={15} strokeWidth={1.75} /> {showMap ? SEARCH.map.hide : SEARCH.map.show}
            </button>
          </div>
        </div>

        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {city && <FilterChip label={city} onRemove={() => setCity("")} />}
            {borough && <FilterChip label={borough} onRemove={() => setBorough("")} />}
            {make && <FilterChip label={make} onRemove={() => setMake("")} />}
            {fuelFilter && <FilterChip label={fuelFilter} onRemove={() => setFuelFilter("")} />}
            {maxBudget && <FilterChip label={`Up to £${maxBudget}/wk`} onRemove={() => setMaxBudget("")} />}
            {bodyFilters.map((b) => <FilterChip key={b} label={b} onRemove={() => toggleBody(b)} />)}
            {transmission && <FilterChip label={transmission} onRemove={() => setTransmission("")} />}
            <button type="button" onClick={clearAll} className="pressable text-[13.5px] font-semibold text-green">
              {SEARCH.filters.clearAll}
            </button>
          </div>
        )}

        <div className="mt-7 flex flex-col lg:flex-row gap-8 items-start">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-9">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-9">
                {results.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>

          {showMap && (
            <div
              className="w-full lg:w-[min(28rem,40vw)] lg:shrink-0 fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 lg:static lg:z-auto lg:sticky lg:top-below-header lg:h-[calc(100dvh-8rem)]"
              data-testid="search-map-pane"
            >
              <div className="h-full rounded-none lg:rounded-2xl overflow-hidden border-0 lg:border lg:border-line bg-surface-2">
                <SearchMap results={results} activeBorough={borough} onAreaClick={(b) => setBorough(b || "")} visibilityTrigger={showMap} />
              </div>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="pressable lg:hidden bottom-safe absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-ink text-white text-[13.5px] font-semibold shadow-2"
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
