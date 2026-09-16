import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X, Map as MapIcon, List as ListIcon } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, AREAS_BY_CITY } from "@/data/mockListings";
import { ALL_CITIES, LIVE_CITIES } from "@/lib/cities";
import VehicleCard from "@/components/VehicleCard";
import SearchMap from "@/components/SearchMap";
import CityInterestForm from "@/components/CityInterestForm";
import { MapPin } from "lucide-react";

const BODY_TYPES = ["Saloon", "Estate", "SUV", "Crossover", "MPV", "Hatchback"];
const FUEL_TYPES = ["Electric", "Plug-in Hybrid", "Hybrid", "Petrol", "Diesel"];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#F5F5F5] pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-[#333] mb-3"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown size={14} className={`transition-transform text-[#AAA] ${open ? "rotate-180" : ""}`} />
      </button>
      {open && children}
    </div>
  );
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group mb-2">
      <div
        className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors ${
          checked ? "bg-[#0A0A0A] border-[#0A0A0A]" : "border-[#CCC] bg-white group-hover:border-[#AAA]"
        }`}
      >
        {checked && <X size={10} className="text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-[#666]">{label}</span>
    </label>
  );
}

function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(value === o ? "" : o)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            value === o
              ? "bg-[#0B6B4F] border-[#0B6B4F] text-white"
              : "bg-white border-[#E8E8E8] text-[#666] hover:border-[#AAA]"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter state from URL or defaults
  const [city, setCityRaw] = useState(searchParams.get("city") || "");
  const [borough, setBorough] = useState(searchParams.get("borough") || "");
  const [make, setMake] = useState(searchParams.get("make") || "");

  // Areas available depend on the selected city; with no city chosen, show every area across all cities
  const areaOptions = city
    ? AREAS_BY_CITY[city] || ["All Areas"]
    : ["All Areas", ...Array.from(new Set(LIVE_CITIES.flatMap((c) => (AREAS_BY_CITY[c] || []).slice(1))))];

  const setCity = (next) => {
    setCityRaw(next);
    setBorough(""); // area list changes with city, so reset the drill-down
  };
  const [maxBudget, setMaxBudget] = useState(searchParams.get("budget") || "");
  const [fuelFilter, setFuelFilter] = useState(searchParams.get("engine") || "");
  const [bodyFilters, setBodyFilters] = useState(
    searchParams.get("bodyType") ? [searchParams.get("bodyType")] : []
  );
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMap, setShowMap] = useState(false); // mobile: list/map toggle

  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("price_asc");

  const applyFilters = useCallback(() => {
    let data = [...MOCK_LISTINGS];
    if (city) data = data.filter((v) => v.city === city);
    if (borough) data = data.filter((v) => v.borough === borough);
    if (make) data = data.filter((v) => v.make === make);
    if (fuelFilter) data = data.filter((v) => v.fuel === fuelFilter);
    if (maxBudget) data = data.filter((v) => v.weekly_rent <= parseInt(maxBudget));
    if (bodyFilters.length) data = data.filter((v) => bodyFilters.includes(v.body_type));
    if (transmission) data = data.filter((v) => v.transmission === transmission);

    if (sortBy === "price_asc") data.sort((a, b) => a.weekly_rent - b.weekly_rent);
    if (sortBy === "price_desc") data.sort((a, b) => b.weekly_rent - a.weekly_rent);
    if (sortBy === "rating") data.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    setResults(data);
  }, [city, borough, make, fuelFilter, maxBudget, bodyFilters, transmission, sortBy]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const toggleBody = (bt) =>
    setBodyFilters((prev) => prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt]);

  const hasFilters = city || borough || make || fuelFilter || maxBudget || bodyFilters.length || transmission;

  const clearAll = () => {
    setCityRaw(""); setBorough(""); setMake(""); setFuelFilter(""); setMaxBudget("");
    setBodyFilters([]); setTransmission("");
  };

  const Sidebar = () => (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sticky top-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-[#111] text-sm">Filter by</h2>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-[#888] hover:text-[#111] font-medium">
              Reset all
            </button>
          )}
        </div>

        <FilterSection title="City">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-[#E8E8E8] text-sm text-[#555] px-3 py-2 rounded-full focus:outline-none focus:border-[#AAA] focus:ring-1 focus:ring-[#AAA]"
          >
            <option value="">All Cities</option>
            {ALL_CITIES.map((c) => (
              <option key={c} value={c}>{LIVE_CITIES.includes(c) ? c : `${c} (coming soon)`}</option>
            ))}
          </select>
        </FilterSection>

        <FilterSection title="Borough / Area">
          <select
            value={borough}
            onChange={(e) => setBorough(e.target.value)}
            className="w-full border border-[#E8E8E8] text-sm text-[#555] px-3 py-2 rounded-full focus:outline-none focus:border-[#AAA] focus:ring-1 focus:ring-[#AAA]"
          >
            <option value="">All Areas</option>
            {areaOptions.slice(1).map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </FilterSection>

        <FilterSection title="Engine / Fuel Type">
          <PillGroup
            options={["EV", "PHEV", "Hybrid", "Petrol", "Diesel"]}
            value={
              fuelFilter === "Electric" ? "EV" :
              fuelFilter === "Plug-in Hybrid" ? "PHEV" :
              fuelFilter
            }
            onChange={(v) => {
              if (!v) { setFuelFilter(""); return; }
              const map = { EV: "Electric", PHEV: "Plug-in Hybrid" };
              setFuelFilter(map[v] || v);
            }}
          />
        </FilterSection>

        <FilterSection title="Weekly Budget">
          <div className="space-y-2">
            {[
              { label: "Any", value: "" },
              { label: "Up to £200", value: "200" },
              { label: "Up to £250", value: "250" },
              { label: "Up to £300", value: "300" },
              { label: "Up to £350", value: "350" },
            ].map((o) => (
              <label key={o.value} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                    maxBudget === o.value ? "border-[#0B6B4F] bg-[#0B6B4F]" : "border-[#CCC]"
                  }`}
                  onClick={() => setMaxBudget(o.value)}
                >
                  {maxBudget === o.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-[#666]">{o.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Make">
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full border border-[#E8E8E8] text-sm text-[#555] px-3 py-2 rounded-full focus:outline-none focus:border-[#AAA] focus:ring-1 focus:ring-[#AAA]"
          >
            <option value="">All Makes</option>
            {MOCK_MAKES.slice(1).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </FilterSection>

        <FilterSection title="Body Type" defaultOpen={false}>
          {BODY_TYPES.map((bt) => (
            <CheckItem
              key={bt}
              label={bt}
              checked={bodyFilters.includes(bt)}
              onChange={() => toggleBody(bt)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Transmission" defaultOpen={false}>
          <PillGroup
            options={["Any", "Automatic", "Manual"]}
            value={transmission || "Any"}
            onChange={(v) => setTransmission(v === "Any" ? "" : v)}
          />
        </FilterSection>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex items-center gap-2 border border-[#E8E8E8] bg-white px-3 py-2.5 rounded-full text-sm text-[#555] font-medium hover:border-[#AAA] lg:hidden mb-4"
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasFilters && <span className="w-4 h-4 bg-[#0B6B4F] rounded-full text-white text-xs flex items-center justify-center leading-none">{[city, borough, make, fuelFilter, maxBudget, ...bodyFilters, transmission].filter(Boolean).length}</span>}
        </button>
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Mobile sidebar overlay - z-[60] so it sits above the floating
              map/list toggle button (z-50), which otherwise stayed visible
              and overlapped the drawer's content since they share a layer */}
          {showSidebar && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowSidebar(false)} />
              <div className="absolute right-0 top-0 h-full w-72 bg-white overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-[#111]">Filters</span>
                  <button onClick={() => setShowSidebar(false)}><X size={18} /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Main results */}
          <div className={`flex-1 min-w-0 ${showMap ? "hidden lg:block" : ""}`}>
            {/* Results header */}
            <div className="flex items-start justify-between mb-5">
              <h1 className="font-heading font-bold text-[#111] text-lg pt-2">
                {results.length} vehicle{results.length !== 1 ? "s" : ""} to rent
              </h1>
              <div className="hidden lg:flex flex-col items-end gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-[#E8E8E8] text-sm text-[#555] px-3 py-2 rounded-full focus:outline-none focus:border-[#AAA] bg-white"
                >
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <button
                  onClick={() => setShowMap((s) => !s)}
                  className="flex items-center gap-1.5 border border-[#E8E8E8] bg-white px-3 py-2 rounded-full text-sm text-[#555] font-medium hover:border-[#AAA]"
                >
                  <MapIcon size={14} />
                  {showMap ? "Hide map" : "Show map"}
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="lg:hidden border border-[#E8E8E8] text-sm text-[#555] px-3 py-2 rounded-full focus:outline-none focus:border-[#AAA] bg-white"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {city && <FilterChip label={city} onRemove={() => setCity("")} />}
                {borough && <FilterChip label={borough} onRemove={() => setBorough("")} />}
                {make && <FilterChip label={make} onRemove={() => setMake("")} />}
                {fuelFilter && <FilterChip label={fuelFilter} onRemove={() => setFuelFilter("")} />}
                {maxBudget && <FilterChip label={`Up to £${maxBudget}/wk`} onRemove={() => setMaxBudget("")} />}
                {bodyFilters.map((b) => <FilterChip key={b} label={b} onRemove={() => toggleBody(b)} />)}
                {transmission && <FilterChip label={transmission} onRemove={() => setTransmission("")} />}
              </div>
            )}

            {results.length === 0 && city && !LIVE_CITIES.includes(city) ? (
              <div className="text-center py-16 bg-white border border-[#E8E8E8] rounded-2xl px-6">
                <div className="w-11 h-11 rounded-full bg-[#EAF5F1] flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-5 h-5 text-[#0B6B4F]" />
                </div>
                <p className="font-heading text-xl font-bold text-[#111] mb-2">No cars in {city} just yet</p>
                <p className="text-[#888] text-sm mb-6 max-w-sm mx-auto">
                  Kharo is nationwide, but we're still bringing operators to every city. Register your
                  interest and we'll email you the moment {city} has live listings.
                </p>
                <CityInterestForm city={city} compact className="max-w-xs mx-auto" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#E8E8E8] rounded-2xl px-6">
                <p className="font-heading text-xl font-bold text-[#111] mb-2">No vehicles match your filters</p>
                <p className="text-[#888] text-sm mb-5">Try adjusting your search criteria.</p>
                <button onClick={clearAll} className="bg-[#0B6B4F] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#095B43] transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>

          {/* Map: only mounted once actually visible, toggled via the header button
              (desktop) or floating pill (mobile). Leaflet measures its container's
              size once at construction - mounting it behind a display:none wrapper
              (as before) meant it always measured 0x0 and its tile layer never
              recovered, even with a later invalidateSize() call: no tiles ever
              loaded, just the bare price pins on a blank gray box. Only rendering
              it once showMap is true guarantees it always sees its real size. */}
          {showMap && (
            <div className="flex-1 lg:flex-none lg:w-[42%] lg:sticky lg:top-4 lg:self-start">
              {/* Mobile: the outer fixed/inset-0 box already tracks the real visual
                  viewport. Giving the inner box its own 100vh-based height fought that -
                  100vh reflects the *largest* possible viewport (chrome hidden), so once
                  the mobile browser's address bar collapsed after a tap, the two boxes
                  disagreed and a blank gap opened up beneath the map. h-full instead of
                  a second vh calc means the inner box just fills whatever the outer box
                  actually is, so there's nothing left to disagree. */}
              <div className="fixed inset-0 z-40 lg:static lg:z-auto">
                <div className="h-full lg:h-[calc(100vh-100px)] rounded-none lg:rounded-2xl overflow-hidden border border-[#E8E8E8]">
                  <SearchMap results={results} activeBorough={borough} onAreaClick={(b) => setBorough(b || "")} visibilityTrigger={showMap} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile list/map toggle */}
      <button
        onClick={() => setShowMap((s) => !s)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#111] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)]"
      >
        {showMap ? <><ListIcon size={16} /> List</> : <><MapIcon size={16} /> Map</>}
      </button>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-[#CCC] text-[#333] text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-[#111]"><X size={11} /></button>
    </span>
  );
}
