import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { MOCK_LISTINGS, MOCK_BOROUGHS, MOCK_MAKES } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";

const BODY_TYPES = ["Saloon", "Estate", "SUV", "Crossover", "MPV", "Hatchback"];
const FUEL_TYPES = ["Electric", "Plug-in Hybrid", "Hybrid", "Petrol", "Diesel"];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown size={14} className={`transition-transform text-gray-400 ${open ? "rotate-180" : ""}`} />
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
          checked ? "bg-[#0A0A0A] border-[#0A0A0A]" : "border-gray-300 bg-white group-hover:border-gray-400"
        }`}
      >
        {checked && <X size={10} className="text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-gray-600">{label}</span>
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
              ? "bg-[#0A0A0A] border-[#0A0A0A] text-white"
              : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
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
  const [borough, setBorough] = useState(searchParams.get("borough") || "");
  const [make, setMake] = useState(searchParams.get("make") || "");
  const [maxBudget, setMaxBudget] = useState(searchParams.get("budget") || "");
  const [fuelFilter, setFuelFilter] = useState(searchParams.get("engine") || "");
  const [bodyFilters, setBodyFilters] = useState(
    searchParams.get("bodyType") ? [searchParams.get("bodyType")] : []
  );
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [showSidebar, setShowSidebar] = useState(false);

  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("price_asc");

  const applyFilters = useCallback(() => {
    let data = [...MOCK_LISTINGS];
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
  }, [borough, make, fuelFilter, maxBudget, bodyFilters, transmission, sortBy]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const toggleBody = (bt) =>
    setBodyFilters((prev) => prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt]);

  const hasFilters = borough || make || fuelFilter || maxBudget || bodyFilters.length || transmission;

  const clearAll = () => {
    setBorough(""); setMake(""); setFuelFilter(""); setMaxBudget("");
    setBodyFilters([]); setTransmission("");
  };

  const Sidebar = () => (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-gray-900 text-sm">Filter by</h2>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-gray-500 hover:text-gray-900 font-medium">
              Reset all
            </button>
          )}
        </div>

        <FilterSection title="Borough / Area">
          <select
            value={borough}
            onChange={(e) => setBorough(e.target.value)}
            className="w-full border border-gray-200 text-sm text-gray-700 px-3 py-2 rounded-full focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
          >
            <option value="">All Areas</option>
            {MOCK_BOROUGHS.slice(1).map((b) => <option key={b} value={b}>{b}</option>)}
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
                    maxBudget === o.value ? "border-[#0A0A0A] bg-[#0A0A0A]" : "border-gray-300"
                  }`}
                  onClick={() => setMaxBudget(o.value)}
                >
                  {maxBudget === o.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-gray-600">{o.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Make">
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full border border-gray-200 text-sm text-gray-700 px-3 py-2 rounded-full focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2.5 rounded-full text-sm text-gray-700 font-medium hover:border-gray-400 lg:hidden mb-4"
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasFilters && <span className="w-4 h-4 bg-[#0A0A0A] rounded-full text-white text-xs flex items-center justify-center leading-none">{[borough, make, fuelFilter, maxBudget, ...bodyFilters, transmission].filter(Boolean).length}</span>}
        </button>
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Mobile sidebar overlay */}
          {showSidebar && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowSidebar(false)} />
              <div className="absolute right-0 top-0 h-full w-72 bg-white overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900">Filters</span>
                  <button onClick={() => setShowSidebar(false)}><X size={18} /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Main results */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-heading font-bold text-gray-900 text-lg">
                {results.length} vehicle{results.length !== 1 ? "s" : ""} to rent
              </h1>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 text-sm text-gray-700 px-3 py-2 rounded-full focus:outline-none focus:border-gray-400 bg-white"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {borough && <FilterChip label={borough} onRemove={() => setBorough("")} />}
                {make && <FilterChip label={make} onRemove={() => setMake("")} />}
                {fuelFilter && <FilterChip label={fuelFilter} onRemove={() => setFuelFilter("")} />}
                {maxBudget && <FilterChip label={`Up to £${maxBudget}/wk`} onRemove={() => setMaxBudget("")} />}
                {bodyFilters.map((b) => <FilterChip key={b} label={b} onRemove={() => toggleBody(b)} />)}
                {transmission && <FilterChip label={transmission} onRemove={() => setTransmission("")} />}
              </div>
            )}

            {results.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
                <p className="font-heading text-xl font-bold text-gray-900 mb-2">No vehicles match your filters</p>
                <p className="text-gray-500 text-sm mb-5">Try adjusting your search criteria.</p>
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
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-gray-900"><X size={11} /></button>
    </span>
  );
}
