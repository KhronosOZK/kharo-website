import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, X, SlidersHorizontal, ChevronDown, MapPin } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import VehicleCard from "@/components/VehicleCard";
import CityInterestForm from "@/components/CityInterestForm";
import PreviewNotice from "@/components/PreviewNotice";
import { Slider } from "@/components/ui/slider";
import { useSeo } from "@/lib/seo";

const CAR_BRANDS = ["Toyota", "Tesla", "Mercedes", "BMW", "Hyundai", "Kia", "Volkswagen", "Skoda", "Ford", "Vauxhall"];
const BODY_TYPES = [
  { value: "saloon", label: "Saloon" },
  { value: "estate", label: "Estate" },
  { value: "mpv", label: "MPV / People Carrier" },
  { value: "executive", label: "Executive" },
  { value: "wav", label: "WAV" },
];

const QUICK_FILTERS = [
  { label: "ULEZ Exempt", key: "ulez" },
  { label: "Available now", key: "available" },
  { label: "Automatic", key: "auto" },
  { label: "EV only", key: "ev" },
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { compare, clearCompare } = useAuth();
  const [listings, setListings] = useState(null);

  // Filter state
  const [rentalType, setRentalType] = useState("any");
  const [availableNow, setAvailableNow] = useState(false);
  const [range, setRange] = useState([0, 500]);
  const [brands, setBrands] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [transmission, setTransmission] = useState("any");
  const [sort, setSort] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const city = searchParams.get("city") || searchParams.get("q") || "London";

  // Keep search input in sync with URL
  useEffect(() => {
    setSearchInput(city);
  }, [city]);

  useSeo({
    title: `PCO Cars for Rent in ${city} · Kharo`,
    description: `Browse PCO-licensed cars available to rent in ${city}. Weekly and monthly rentals from verified London operators.`,
  });

  const run = useCallback(async () => {
    setListings(null);
    try {
      const q = { city };
      if (sort !== "default") q.sort = sort;
      const { data } = await api.get("/listings", { params: q });

      let filtered = Array.isArray(data) ? data : [];
      if (range[0] > 0 || range[1] < 500) {
        filtered = filtered.filter(
          (v) => v.weekly_rent >= range[0] && v.weekly_rent <= (range[1] >= 500 ? 9999 : range[1])
        );
      }
      if (bodyTypes.length > 0) {
        filtered = filtered.filter((v) =>
          bodyTypes.some(
            (bt) =>
              (v.vehicle_type || "").toLowerCase() === bt ||
              (v.body_type || "").toLowerCase() === bt
          )
        );
      }
      if (brands.length > 0) {
        filtered = filtered.filter((v) =>
          brands.some((b) => (v.make || "").toLowerCase() === b.toLowerCase())
        );
      }
      if (transmission !== "any") {
        filtered = filtered.filter(
          (v) => (v.transmission || "").toLowerCase() === transmission
        );
      }
      setListings(filtered);
    } catch {
      setListings([]);
    }
  }, [city, sort, range, bodyTypes, brands, transmission]);

  useEffect(() => {
    trackEvent("page_view", { path: "/search", city });
    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    run();
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = () => {
    trackEvent("search_filter", { city, rentalType, range, brands, bodyTypes, transmission });
    run();
    setSidebarOpen(false);
  };

  const resetFilters = () => {
    setRentalType("any");
    setAvailableNow(false);
    setRange([0, 500]);
    setBrands([]);
    setBodyTypes([]);
    setTransmission("any");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchInput.trim() || "London";
    trackEvent("hero_search", { city: q });
    setSearchParams({ city: q });
  };

  const toggleBrand = (brand) =>
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const toggleBodyType = (bt) =>
    setBodyTypes((prev) =>
      prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt]
    );

  const activeFilterCount = [
    rentalType !== "any",
    availableNow,
    range[0] > 0 || range[1] < 500,
    brands.length > 0,
    bodyTypes.length > 0,
    transmission !== "any",
  ].filter(Boolean).length;

  const cityHasNoInventory = listings != null && listings.length === 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <PreviewNotice />

      {/* Hero search bar */}
      <section className="bg-[#0B6B4F]">
        <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
          <p className="text-center text-[11px] font-bold tracking-[0.14em] uppercase text-[#5FD3A6] mb-3">
            Direct Operator PCO Rentals
          </p>
          <h1 className="text-center text-white font-heading font-extrabold text-[28px] sm:text-[36px] leading-tight mb-6">
            PCO cars for rent in {city}
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
              <div className="flex items-center gap-3 flex-1 pl-5 pr-3 py-1">
                <MapPin className="w-5 h-5 text-[#0B6B4F] shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by borough or postcode..."
                  className="flex-1 h-12 text-[16px] text-[#111] placeholder:text-[#AAA] bg-transparent focus:outline-none"
                  aria-label="Search city or area"
                />
                {searchInput && searchInput !== city && (
                  <button
                    type="button"
                    onClick={() => setSearchInput(city)}
                    className="text-[#BBB] hover:text-[#555] transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-2 pr-2">
                <button
                  type="submit"
                  className="h-12 px-6 bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold text-[15px] rounded-xl transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {QUICK_FILTERS.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => {
                  if (key === "auto") setTransmission(t => t === "automatic" ? "any" : "automatic");
                  if (key === "available") setAvailableNow(v => !v);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-[12px] font-medium hover:bg-white/20 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <p className="text-[13px] text-[#888]" data-testid="sr-count">
            {listings == null ? "Searching..." : `${listings.length} vehicle${listings.length !== 1 ? "s" : ""} to rent`}
          </p>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-[#E0E0E0] text-[13px] font-medium text-[#333] shadow-sm shrink-0"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#0B6B4F] text-white text-[11px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6 items-start">
          {/* FILTER SIDEBAR */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              aria-hidden
            />
          )}

          <aside
            className={`
              shrink-0 bg-white border border-[#E8E8E8] rounded-2xl
              lg:block lg:w-[270px] lg:static lg:z-auto
              ${sidebarOpen
                ? "fixed left-0 top-0 h-full w-[300px] sm:w-[320px] z-50 overflow-y-auto rounded-none shadow-2xl"
                : "hidden"
              }
            `}
            aria-label="Filter vehicles"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-[16px] text-[#111]">Filter by</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="text-[13px] text-[#888] hover:text-[#0B6B4F] transition-colors"
                  >
                    Reset all
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-[#E8E8E8]"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4 text-[#555]" />
                  </button>
                </div>
              </div>

              {/* Rental Period */}
              <FilterSection title="Rental Period">
                <div className="flex rounded-xl bg-[#F5F5F5] p-1 gap-0.5">
                  {["Any", "Weekly", "Monthly"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setRentalType(t.toLowerCase())}
                      className={`flex-1 text-[13px] font-medium py-2 rounded-[10px] transition-all ${
                        rentalType === t.toLowerCase()
                          ? "bg-white shadow-sm text-[#0B6B4F] font-semibold"
                          : "text-[#666] hover:text-[#333]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Availability */}
              <FilterSection title="Availability">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#333]">Available now</span>
                  <button
                    role="switch"
                    aria-checked={availableNow}
                    onClick={() => setAvailableNow((v) => !v)}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F] ${
                      availableNow ? "bg-[#0B6B4F]" : "bg-[#D0D0D0]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                        availableNow ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection
                title={`Weekly Budget: £${range[0]} – £${range[1] >= 500 ? "500+" : range[1]}`}
              >
                <div className="px-1 py-2">
                  <Slider
                    min={0}
                    max={500}
                    step={5}
                    value={range}
                    onValueChange={setRange}
                    minStepsBetweenThumbs={1}
                  />
                  <div className="flex justify-between mt-2.5 text-[12px] text-[#AAA]">
                    <span>£0</span>
                    <span>£500+</span>
                  </div>
                </div>
              </FilterSection>

              {/* Car Brand */}
              <FilterSection title="Car Brand" collapsible defaultOpen={false}>
                <div className="space-y-2.5">
                  {CAR_BRANDS.map((brand) => (
                    <CheckRow
                      key={brand}
                      label={brand}
                      checked={brands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Body Type */}
              <FilterSection title="Body Type">
                <div className="space-y-2.5">
                  {BODY_TYPES.map(({ value, label }) => (
                    <CheckRow
                      key={value}
                      label={label}
                      checked={bodyTypes.includes(value)}
                      onChange={() => toggleBodyType(value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Transmission */}
              <FilterSection title="Transmission">
                <div className="flex rounded-xl bg-[#F5F5F5] p-1 gap-0.5">
                  {["Any", "Automatic", "Manual"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTransmission(t.toLowerCase())}
                      className={`flex-1 text-[12px] font-medium py-2 rounded-[10px] transition-all ${
                        transmission === t.toLowerCase()
                          ? "bg-white shadow-sm text-[#0B6B4F] font-semibold"
                          : "text-[#666] hover:text-[#333]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <button
                onClick={applyFilters}
                className="lg:hidden w-full mt-5 py-3 rounded-full bg-[#0B6B4F] text-white font-semibold text-[15px] hover:bg-[#095B43] transition-colors"
              >
                Show results
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Desktop controls bar */}
            <div className="hidden lg:flex items-center justify-between mb-5">
              <p className="text-[14px] text-[#888]" data-testid="sr-count">
                {listings == null
                  ? "Searching..."
                  : `${listings.length} vehicle${listings.length !== 1 ? "s" : ""} to rent`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={applyFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#E0E0E0] text-[13px] font-medium text-[#333] shadow-sm hover:border-[#0B6B4F] hover:text-[#0B6B4F] transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  Apply filters
                </button>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-9 pl-3 pr-8 bg-white border border-[#E0E0E0] rounded-full text-[13px] text-[#333] appearance-none cursor-pointer focus:outline-none focus:border-[#0B6B4F] shadow-sm"
                  >
                    <option value="default">Our pick</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                    <option value="rating">Best rated</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#888] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Vehicle grid */}
            {listings == null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`sk-${i}`}
                    className="h-80 rounded-2xl bg-white animate-pulse border border-[#E8E8E8]"
                  />
                ))}
              </div>
            ) : cityHasNoInventory ? (
              <div
                className="bg-white rounded-2xl p-8 border border-[#E8E8E8]"
                data-testid="sr-city-interest"
              >
                <CityInterestForm city={city} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {listings.map((v, i) => (
                  <div
                    key={v.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                  >
                    <VehicleCard v={v} />
                  </div>
                ))}
              </div>
            )}

            {/* No match banner */}
            {listings != null && listings.length > 0 && (
              <div
                className="mt-10 bg-[#0B6B4F] rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                data-testid="sr-car-request"
              >
                <div>
                  <h3 className="text-white font-heading font-bold text-[18px]">
                    Can't find the right car in {city}?
                  </h3>
                  <p className="text-white/70 mt-1 text-[14px] max-w-sm">
                    Tell us what you need and we'll reach out when it becomes available.
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/request-a-car?city=${encodeURIComponent(city)}`)
                  }
                  className="shrink-0 px-5 py-2.5 bg-white rounded-full text-[#0B6B4F] font-semibold text-[14px] hover:bg-[#5FD3A6] hover:text-white transition-colors"
                >
                  Request a car
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare bar */}
      {compare.length > 0 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-[#1A2E25] text-white pl-5 pr-2 py-2 shadow-xl"
          data-testid="compare-bar"
        >
          <span className="text-[14px] font-medium">
            {compare.length} car{compare.length !== 1 ? "s" : ""} to compare
          </span>
          <button
            onClick={clearCompare}
            data-testid="compare-clear-bar"
            className="text-[13px] text-white/60 hover:text-white transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => navigate("/compare")}
            data-testid="go-compare"
            className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0A130F] font-semibold h-9 px-4 text-[14px] transition-colors"
          >
            Compare
          </button>
        </div>
      )}
    </div>
  );
}

/* Subcomponents */

function FilterSection({ title, children, collapsible = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[#F0F0F0] py-4">
      <button
        onClick={() => collapsible && setOpen((v) => !v)}
        className={`flex items-center justify-between w-full mb-3 ${
          collapsible ? "cursor-pointer" : "cursor-default"
        }`}
        aria-expanded={collapsible ? open : undefined}
      >
        <span className="text-[12px] font-semibold text-[#777] uppercase tracking-[0.08em]">
          {title}
        </span>
        {collapsible && (
          <ChevronDown
            className={`w-4 h-4 text-[#AAA] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      {open && children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <span
        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
          checked
            ? "bg-[#0B6B4F] border-[#0B6B4F]"
            : "border-[#CCCCCC] group-hover:border-[#0B6B4F]"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5">
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span className="text-[14px] text-[#333] group-hover:text-[#111] transition-colors">
        {label}
      </span>
    </label>
  );
}
