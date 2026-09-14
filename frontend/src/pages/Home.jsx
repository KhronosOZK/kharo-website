import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, Zap, ShieldCheck, FileCheck, Wrench, Check, TrendingUp, Star } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, MOCK_CITIES, AREAS_BY_CITY, BUDGET_OPTIONS, ENGINE_OPTIONS } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";
import CityInterestForm from "@/components/CityInterestForm";

const INK = "#0A0A0A";
const ACCENT = "#5FD3A6";

const BRANDS = ["Toyota", "Kia", "Volkswagen", "Skoda", "Mercedes-Benz", "Hyundai", "Ford"];

function FilterSelect({ options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 text-gray-800 text-sm font-medium px-4 py-3 pr-9 rounded-full focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// Fleet showcase - horizontal carousel tile, photography-led, no chrome
function FleetTile({ src, label, sub, className }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
      <img
        src={src}
        alt={label}
        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
      <div className="absolute bottom-4 left-4 right-4">
        <span className="block text-white font-heading font-semibold text-base">{label}</span>
        {sub && <span className="block text-white/70 text-xs mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("London");
  const [borough, setBorough] = useState("All Areas");
  const [make, setMake] = useState("All Makes");
  const [budget, setBudget] = useState("");
  const [engine, setEngine] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [bodyType, setBodyType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [listings] = useState(MOCK_LISTINGS.slice(0, 6));
  const fleetScrollRef = useRef(null);
  const scrollFleet = (dir) => {
    const el = fleetScrollRef.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  const areaOptions = AREAS_BY_CITY[city] || ["All Areas"];

  function handleCityChange(next) {
    setCity(next);
    setBorough("All Areas"); // areas are scoped to the chosen city
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (borough && borough !== "All Areas") params.set("borough", borough);
    if (make && make !== "All Makes") params.set("make", make);
    if (budget) params.set("budget", budget);
    if (engine) params.set("engine", engine);
    if (bodyType) params.set("bodyType", bodyType);
    if (transmission) params.set("transmission", transmission);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-white">

      {/* HERO - cinematic, tight cropped car, grayscale-treated for a studio feel */}
      <section
        className="relative min-h-[82vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{ backgroundColor: INK }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.92) 100%), url('https://images.pexels.com/photos/17152058/pexels-photo-17152058.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1000')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: "grayscale(0.35) contrast(1.05)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center w-full">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.16em] mb-6">
            Direct Operator PCO Rentals
          </p>

          <h1 className="font-heading text-[42px] leading-[1.02] sm:text-6xl lg:text-7xl font-bold text-white max-w-4xl mb-5" style={{ textWrap: "balance", letterSpacing: "-0.02em" }}>
            Your City.<br />Your Terms.
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-xl mb-10">
            Weekly PCO rentals direct from licensed operators in London, Manchester, Birmingham and Leeds. Insurance and maintenance included.
          </p>

          {/* SEARCH PANEL - pill fields, single accent CTA */}
          <div className="w-full max-w-3xl bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <FilterSelect
                options={MOCK_CITIES.map((c) => ({ label: c, value: c }))}
                value={city}
                onChange={handleCityChange}
              />
              <FilterSelect
                options={areaOptions.map((b) => ({ label: b, value: b === "All Areas" ? "All Areas" : b }))}
                value={borough}
                onChange={setBorough}
              />
              <FilterSelect
                options={MOCK_MAKES.map((m) => ({ label: m, value: m === "All Makes" ? "" : m }))}
                value={make}
                onChange={setMake}
              />
              <FilterSelect options={BUDGET_OPTIONS} value={budget} onChange={setBudget} />
              <FilterSelect options={ENGINE_OPTIONS} value={engine} onChange={setEngine} />
            </div>

            {showMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FilterSelect
                  options={[
                    { label: "Any Body Type", value: "" },
                    { label: "Saloon", value: "Saloon" },
                    { label: "Estate", value: "Estate" },
                    { label: "SUV / Crossover", value: "SUV" },
                    { label: "MPV", value: "MPV" },
                  ]}
                  value={bodyType}
                  onChange={setBodyType}
                />
                <FilterSelect
                  options={[
                    { label: "Any Transmission", value: "" },
                    { label: "Automatic", value: "Automatic" },
                    { label: "Manual", value: "Manual" },
                  ]}
                  value={transmission}
                  onChange={setTransmission}
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-3 px-1">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <ChevronDown size={14} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
                {showMore ? "Fewer filters" : "More filters"}
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: ACCENT, color: INK }}
              >
                <Search size={16} />
                Search Vehicles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STRIP - the makes actually on the platform */}
      <section className="border-b border-gray-100 py-7">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {BRANDS.map((b) => (
            <span key={b} className="text-gray-400 hover:text-gray-900 font-heading font-semibold text-sm tracking-wide transition-colors cursor-default">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* FLEET SHOWCASE - horizontal drag/scroll carousel, editorial, photography-led */}
      <section className="max-w-7xl mx-auto py-16">
        <div className="flex items-end justify-between mb-6 px-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">The Fleet</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Cars Drivers Actually Drive</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollFleet(-1)}
              aria-label="Scroll fleet left"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollFleet(1)}
              aria-label="Scroll fleet right"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 text-gray-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate("/search")}
              className="ml-2 flex items-center gap-2 border border-gray-200 hover:border-gray-400 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Show all vehicles <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div
          ref={fleetScrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {[
            { src: "https://images.pexels.com/photos/100656/pexels-photo-100656.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Toyota Prius", sub: "From £225 / week · London" },
            { src: "https://images.pexels.com/photos/32716427/pexels-photo-32716427.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Kia Niro EV", sub: "From £270 / week · Manchester" },
            { src: "https://images.pexels.com/photos/8332625/pexels-photo-8332625.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Toyota Camry", sub: "From £245 / week · Birmingham" },
            { src: "https://images.pexels.com/photos/35414515/pexels-photo-35414515.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "VW Passat GTE", sub: "From £255 / week · Leeds" },
            { src: "https://images.pexels.com/photos/17185083/pexels-photo-17185083.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Mercedes E-Class", sub: "From £310 / week · London" },
            { src: "https://images.pexels.com/photos/17792325/pexels-photo-17792325.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Ford Kuga PHEV", sub: "From £250 / week · Manchester" },
          ].map((tile) => (
            <FleetTile key={tile.label} {...tile} className="snap-start shrink-0 w-[68vw] sm:w-[280px] h-[380px]" />
          ))}
        </div>
        <button
          onClick={() => navigate("/search")}
          className="sm:hidden mt-4 mx-4 flex items-center justify-center gap-2 border border-gray-200 text-gray-900 text-sm font-semibold px-5 py-3 rounded-full"
        >
          Show all vehicles <ArrowUpRight size={14} />
        </button>
      </section>

      {/* FEATURED LISTINGS - real cards, explicit interest-capture CTA on each */}
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Available Now</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Featured Rentals</h2>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-9">
            {listings.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES - circular monochrome icon badges, no colour */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Taking Care of Every Driver</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111]">Every rental, fully covered</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Fully comprehensive insurance", body: "Included in every weekly rate." },
            { icon: Wrench, title: "Maintenance included", body: "Servicing handled by the operator." },
            { icon: FileCheck, title: "TfL-licensed vehicles only", body: "Every listing is PCO compliant." },
            { icon: Zap, title: "On the road fast", body: "Most drivers are matched within 48 hours." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <f.icon size={30} className="text-[#0B6B4F] mb-4" strokeWidth={1.5} />
              <p className="font-semibold text-[#111] text-sm mb-1">{f.title}</p>
              <p className="text-[#888] text-xs leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING TRANSPARENCY - bespoke floating widget, reinforces the all-in weekly rate */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">One Number, No Surprises</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-5" style={{ textWrap: "balance" }}>
              The weekly price is the whole price
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
              No separate insurance quote. No maintenance invoice halfway through the month.
              Every listing on Kharo shows one weekly figure, and that figure is what you pay
              from day one to the day you hand the keys back.
            </p>
            <div className="space-y-3 max-w-md">
              {[
                "Fully comprehensive PCO insurance",
                "Scheduled servicing and maintenance",
                "Breakdown cover on most vehicles",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2.5">
                  <Check size={14} style={{ color: "#0B6B4F" }} strokeWidth={2.5} />
                  <span className="text-gray-700 text-sm">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm border border-gray-100"
              style={{ boxShadow: "0 32px 64px -20px rgba(0,0,0,0.22)", transform: "rotate(-2deg)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Toyota Prius &middot; Southwark</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#0B6B4F" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#5FD3A6" }} />
                  Live rate
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading font-bold text-gray-900 text-5xl tracking-tight">£249</span>
                <span className="text-gray-400 text-sm font-medium">/ week</span>
              </div>

              <div className="space-y-0 border-t border-gray-100">
                {[
                  { label: "Weekly rental", value: "£169" },
                  { label: "Insurance", value: "Included" },
                  { label: "Maintenance", value: "Included" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{row.label}</span>
                    <span className="text-gray-900 text-sm font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-5 bg-gray-50 rounded-xl px-3.5 py-3">
                <TrendingUp size={15} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 text-xs">Typical driver nets £480&ndash;£650/week after this rental</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F5F5F5] border-t border-[#EBEBEB] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-[#0B6B4F] font-semibold mb-1">Simple Process</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111]">How Kharo Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Search & Filter", body: "Browse vehicles by city, area, make, budget and engine type. Every listing is from a verified, checked operator." },
              { n: "02", title: "Register Your Interest", body: "Found a vehicle you like? Submit your name and contact details in under a minute. The operator gets in touch to confirm availability, no commission, no middleman." },
              { n: "03", title: "Pick Up & Drive", body: "Sign the rental agreement directly with the operator, collect your keys, and start earning. Insurance and maintenance included." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col">
                <span className="font-heading text-4xl font-bold text-[#E0E0E0] mb-3 select-none">{step.n}</span>
                <h3 className="font-heading font-semibold text-[#111] text-lg mb-2">{step.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - photo strip, star ratings, real-feeling voice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Drivers On Kharo</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">What renting direct actually feels like</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              name: "Amir R.",
              city: "London",
              vehicle: "Toyota Prius",
              rating: 5,
              quote: "Applied on a Sunday, was driving by Wednesday. The weekly number I saw online is the weekly number I pay, no haggling over insurance quotes.",
              photo: "https://images.pexels.com/photos/5834947/pexels-photo-5834947.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=200&h=200",
            },
            {
              name: "Kelly M.",
              city: "Manchester",
              vehicle: "Kia Niro EV",
              rating: 5,
              quote: "Switched to electric and my running costs dropped straight away. The operator called within a few hours of me registering interest.",
              photo: "https://images.pexels.com/photos/5262276/pexels-photo-5262276.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=200&h=200",
            },
            {
              name: "Faisal H.",
              city: "Birmingham",
              vehicle: "Skoda Octavia",
              rating: 4.8,
              quote: "First time renting instead of buying outright. Having maintenance included took one big worry off my plate completely.",
              photo: "https://images.pexels.com/photos/5835346/pexels-photo-5835346.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=200&h=200",
            },
            {
              name: "Grace O.",
              city: "Leeds",
              vehicle: "Toyota Corolla",
              rating: 4.9,
              quote: "Kharo was the only place showing me the full weekly cost upfront, not a headline price with extras added later.",
              photo: "https://images.pexels.com/photos/4872060/pexels-photo-4872060.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=200&h=200",
            },
          ].map((t) => (
            <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < Math.round(t.rating) ? "text-amber-400" : "text-gray-200"} fill="currentColor" />
                ))}
              </div>
              <p className="text-[#333] text-sm leading-relaxed mb-5 flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.vehicle} &middot; {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPANSION INTEREST - for anyone outside our current four cities */}
      <section className="bg-[#F5F5F5] border-t border-[#EBEBEB] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-[#0B6B4F] font-semibold mb-2">Expanding Beyond London</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111] mb-3" style={{ textWrap: "balance" }}>
            Don&rsquo;t see your city yet?
          </h2>
          <p className="text-[#666] text-sm sm:text-base max-w-lg mx-auto mb-7">
            We&rsquo;re live in London, Manchester, Birmingham and Leeds, with more cities on the way.
            Tell us where you are and we&rsquo;ll bring operators to your area next.
          </p>
          <CityInterestForm className="max-w-xl mx-auto" />
        </div>
      </section>

      {/* OPERATOR CTA - full-bleed photographic panel, pill button */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-[32px] px-8 py-16 sm:py-24 text-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.75) 45%, rgba(10,10,10,0.45) 100%), url('https://images.pexels.com/photos/29566898/pexels-photo-29566898.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1000')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(0.25)",
            }}
          />
          <div className="relative">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mb-3" style={{ textWrap: "balance" }}>
              Got vehicles sitting idle?
            </h2>
            <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto mb-8">
              List your PCO fleet on Kharo and start generating weekly income. No commission on agreed rates.
            </p>
            <button
              onClick={() => navigate("/list-your-fleet")}
              className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-full transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: ACCENT, color: INK }}
            >
              List Your Fleet <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
