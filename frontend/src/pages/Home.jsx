import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, Zap, ShieldCheck, FileCheck, Wrench, Check, TrendingUp, Star, HelpCircle } from "lucide-react";
import { MOCK_LISTINGS, MOCK_MAKES, MOCK_CITIES, AREAS_BY_CITY, BUDGET_OPTIONS, ENGINE_OPTIONS } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";
import CityInterestForm from "@/components/CityInterestForm";

const BRANDS = ["Toyota", "Kia", "Volkswagen", "Skoda", "Mercedes-Benz", "Hyundai", "Ford"];

function FilterSelect({ options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-[#E8E8E8] text-[#333] text-sm font-medium px-4 py-3 pr-9 rounded-full focus:outline-none focus:border-[#AAA] focus:ring-1 focus:ring-[#AAA] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAA] pointer-events-none" />
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

      {/* HERO - light ground matching the rest of the page; bold type carries
          the section instead of a dark banner or photo behind the text */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden border-b border-[#EEEEEE]"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="relative z-10 flex flex-col items-center w-full">
          <p className="text-[#0B6B4F] text-xs font-bold uppercase tracking-[0.16em] mb-6">
            The Private Hire Marketplace
          </p>

          <h1 className="font-heading text-[44px] leading-[1.02] sm:text-6xl lg:text-7xl font-extrabold text-[#111] max-w-4xl mb-5" style={{ textWrap: "balance", letterSpacing: "-0.02em" }}>
            Find your next PHV.
          </h1>
          <p className="text-[#666] text-base sm:text-lg max-w-xl mb-8">
            Compare rental cars from operators in London, Manchester, Birmingham and Leeds. One clear weekly rental price, maintenance included, insurance quoted separately.
          </p>

          <div className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E8E8]">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#0B6B4F" }} />
            <span className="text-[#111] text-xs font-semibold">120 vehicles live now</span>
          </div>

          {/* SEARCH PANEL - pill fields, single accent CTA */}
          <div className="w-full max-w-3xl bg-white rounded-[28px] p-4 sm:p-5 border border-[#E8E8E8] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]">
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
              <div className="sm:col-span-2">
                <FilterSelect options={ENGINE_OPTIONS} value={engine} onChange={setEngine} />
              </div>
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
                className="text-sm text-[#888] hover:text-[#555] flex items-center gap-1 transition-colors"
              >
                <ChevronDown size={14} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
                {showMore ? "Fewer filters" : "More filters"}
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full text-white bg-[#0B6B4F] hover:bg-[#095B43] transition-colors"
              >
                <Search size={16} />
                Search Vehicles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STRIP - the makes actually on the platform */}
      <section className="border-b border-[#F5F5F5] py-7">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {BRANDS.map((b) => (
            <span key={b} className="text-[#AAA] hover:text-[#111] font-heading font-semibold text-sm tracking-wide transition-colors cursor-default">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* TWO-SIDED MARKETPLACE - the two journeys, stated plainly, right under the fold.
          Light cards with a small inset photo instead of a full-bleed dark banner,
          so they don't repeat the heavy dark-photo treatment dropped elsewhere. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => navigate("/search")}
            className="group bg-white border border-[#E8E8E8] rounded-[28px] overflow-hidden cursor-pointer"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.pexels.com/photos/5834947/pexels-photo-5834947.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=560')" }}
              />
            </div>
            <div className="p-6 sm:p-7">
              <p className="text-[#0B6B4F] text-xs font-semibold uppercase tracking-wide mb-2">Need a car to drive?</p>
              <h3 className="font-heading text-xl sm:text-[22px] font-bold text-[#111] mb-3" style={{ textWrap: "balance" }}>
                Find a vehicle that fits your budget.
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[#111] font-semibold text-sm">
                Find a vehicle <ArrowRight size={15} />
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate("/list-your-fleet")}
            className="group bg-white border border-[#E8E8E8] rounded-[28px] overflow-hidden cursor-pointer"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.pexels.com/photos/29566898/pexels-photo-29566898.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=560')" }}
              />
            </div>
            <div className="p-6 sm:p-7">
              <p className="text-[#0B6B4F] text-xs font-semibold uppercase tracking-wide mb-2">Have a car sitting idle?</p>
              <h3 className="font-heading text-xl sm:text-[22px] font-bold text-[#111] mb-3" style={{ textWrap: "balance" }}>
                List it and reach drivers looking to rent.
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[#0B6B4F] font-semibold text-sm">
                List your vehicle <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FLEET SHOWCASE - horizontal drag/scroll carousel, editorial, photography-led */}
      <section className="max-w-7xl mx-auto py-16">
        <div className="flex items-end justify-between mb-6 px-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#AAA] font-semibold mb-1">The Fleet</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111]">Cars Drivers Actually Drive</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollFleet(-1)}
              aria-label="Scroll fleet left"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E8E8E8] hover:border-[#AAA] text-[#555] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollFleet(1)}
              aria-label="Scroll fleet right"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E8E8E8] hover:border-[#AAA] text-[#555] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate("/search")}
              className="ml-2 flex items-center gap-2 border border-[#E8E8E8] hover:border-[#AAA] text-[#111] text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
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
            { src: "/images/listings/toyota-prius.jpg", label: "Toyota Prius", sub: "From £225 / week · London" },
            { src: "https://images.pexels.com/photos/13733818/pexels-photo-13733818.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Kia Niro EV", sub: "From £270 / week · Manchester" },
            { src: "https://images.pexels.com/photos/8332625/pexels-photo-8332625.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Toyota Camry", sub: "From £245 / week · Birmingham" },
            { src: "/images/listings/vw-passat-gte.jpg", label: "VW Passat GTE", sub: "From £255 / week · Leeds" },
            { src: "https://images.pexels.com/photos/17185083/pexels-photo-17185083.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Mercedes E-Class", sub: "From £310 / week · London" },
            { src: "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1250", label: "Toyota RAV4", sub: "From £250 / week · Manchester" },
          ].map((tile) => (
            <FleetTile key={tile.label} {...tile} className="snap-start shrink-0 w-[68vw] sm:w-[280px] h-[380px]" />
          ))}
        </div>
        <button
          onClick={() => navigate("/search")}
          className="sm:hidden mt-4 mx-4 flex items-center justify-center gap-2 border border-[#E8E8E8] text-[#111] text-sm font-semibold px-5 py-3 rounded-full"
        >
          Show all vehicles <ArrowUpRight size={14} />
        </button>
      </section>

      {/* FEATURED LISTINGS - real cards, explicit interest-capture CTA on each */}
      <section className="bg-[#FAFAFA] border-t border-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#AAA] font-semibold mb-1">Available Now</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111]">Featured Rentals</h2>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-1 text-sm font-medium text-[#111] hover:text-[#666] transition-colors"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          {/* Horizontal scroll on mobile instead of a 6-card vertical stack - the
              fleet carousel above already covers "browse everything", this is
              a shorter, swipeable "here's a few to start with" */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-5 sm:gap-y-9 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {listings.map((vehicle) => (
              <div key={vehicle.id} className="shrink-0 w-[82vw] max-w-[320px] snap-start sm:w-auto sm:max-w-none sm:shrink">
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY KHARO - the marketplace value prop, in plain English, hits the real pain point */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-[#AAA] font-semibold mb-1">No More WhatsApp Hunting</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111]" style={{ textWrap: "balance" }}>Why drivers use Kharo</h2>
          <p className="text-[#888] text-sm mt-2 max-w-lg mx-auto">
            Stop messaging dozens of operators on WhatsApp and Facebook to find a car. Every vehicle is in one place.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 border-t border-l border-[#EBEBEB] max-w-3xl mx-auto">
          {[
            { title: "More choice", body: "Compare vehicles from different operators in one place." },
            { title: "Clear pricing", body: "See the full weekly price before you get in touch." },
            { title: "Search your area", body: "Find vehicles close to where you live or work." },
            { title: "Less hassle", body: "No more chasing operators one by one to find a car." },
          ].map((f) => (
            <div key={f.title} className="p-6 sm:p-7 border-r border-b border-[#EBEBEB]">
              <p className="font-semibold text-[#111] text-[15px] mb-1.5">{f.title}</p>
              <p className="text-[#888] text-[13px] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST - honest, no claims we can't back yet */}
      <section className="bg-[#FAFAFA] border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#0B6B4F] font-semibold mb-2">Built For The Private Hire Community</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111] mb-8" style={{ textWrap: "balance" }}>
            What every listing on Kharo means
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              "Every operator is checked against Companies House and the licensing register",
              "The weekly price shown is the rental price, no insurance quietly folded in",
              "You speak directly to the operator, no middleman marking up the rate",
              "Your details go to the operator, and nowhere else",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 bg-white rounded-2xl border border-[#E8E8E8] p-4">
                <Check size={16} className="text-[#0B6B4F] mt-0.5 shrink-0" strokeWidth={2.5} />
                <span className="text-[#333] text-[14px] leading-relaxed">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TRANSPARENCY - bespoke floating widget, reinforces the all-in weekly rate */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs uppercase tracking-widest text-[#AAA] font-semibold mb-2">Rental Price, No Hidden Markup</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111] mb-5" style={{ textWrap: "balance" }}>
              The price you see is the rental price
            </h2>
            <p className="text-[#888] text-sm leading-relaxed mb-6 max-w-md">
              The weekly figure on every listing is the rental cost only, priced to beat
              what other PCO platforms charge for the same car. Insurance is quoted
              separately, based on your own profile, so you're never paying a markup
              baked silently into someone else's "all-in" number.
            </p>
            <div className="space-y-3 max-w-md">
              {[
                "Rental price kept below the market rate for the same car",
                "Insurance quoted transparently, based on your profile",
                "Scheduled servicing and maintenance included",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2.5">
                  <Check size={14} style={{ color: "#0B6B4F" }} strokeWidth={2.5} />
                  <span className="text-[#555] text-sm">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm border border-[#F5F5F5]"
              style={{ boxShadow: "0 32px 64px -20px rgba(0,0,0,0.22)", transform: "rotate(-2deg)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[#AAA] text-xs font-semibold uppercase tracking-wide">Toyota Prius &middot; Southwark</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#0B6B4F" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#5FD3A6" }} />
                  Live rate
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading font-bold text-[#111] text-5xl tracking-tight">£165</span>
                <span className="text-[#AAA] text-sm font-medium">/ week rental</span>
              </div>
              <p className="text-[#AAA] text-[12px] mb-5">All-in from £203/week with insurance quoted below</p>

              <div className="space-y-0 border-t border-[#F5F5F5]">
                {[
                  { label: "Weekly rental", value: "£165" },
                  { label: "Insurance (indicative)", value: "£38" },
                  { label: "Maintenance", value: "Included" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-[#F5F5F5]">
                    <span className="text-[#888] text-sm">{row.label}</span>
                    <span className="text-[#111] text-sm font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-5 bg-[#FAFAFA] rounded-xl px-3.5 py-3">
                <TrendingUp size={15} className="text-[#AAA] flex-shrink-0" />
                <span className="text-[#888] text-xs">Typical driver nets £480&ndash;£650/week after this rental</span>
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
              { n: "01", title: "Search & Filter", body: "Browse vehicles by city, area, make, budget and engine type. Every operator is checked against Companies House and the licensing register." },
              { n: "02", title: "Register Your Interest", body: "Found a vehicle you like? Submit your name and contact details in under a minute. The operator gets in touch to confirm availability, no commission, no middleman." },
              { n: "03", title: "Pick Up & Drive", body: "Sign the rental agreement directly with the operator, collect your keys, and start earning. Maintenance included, insurance quoted separately." },
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
          <p className="text-xs uppercase tracking-widest text-[#AAA] font-semibold mb-1">Drivers On Kharo</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111]">What renting direct actually feels like</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            {
              name: "Amir R.",
              city: "London",
              vehicle: "Toyota Prius",
              rating: 5,
              quote: "Applied on a Sunday, was driving by Wednesday. The rental price I saw online is the rental price I pay, and my insurance quote came through just as clearly.",
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
            <div key={t.name} className="shrink-0 w-[80vw] max-w-[300px] snap-start sm:w-auto sm:max-w-none sm:shrink bg-white border border-[#F5F5F5] rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < Math.round(t.rating) ? "text-amber-400" : "text-[#E8E8E8]"} fill="currentColor" />
                ))}
              </div>
              <p className="text-[#333] text-sm leading-relaxed mb-5 flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="text-sm font-semibold text-[#111]">{t.name}</p>
                  <p className="text-xs text-[#AAA]">{t.vehicle} &middot; {t.city}</p>
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

      {/* FAQ - short, genuinely useful, driver-focused */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-[#AAA] font-semibold mb-1">Questions</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111]">Frequently asked</h2>
        </div>
        <div className="divide-y divide-[#E8E8E8] rounded-2xl ring-1 ring-[#E8E8E8] bg-white">
          {[
            { q: "What is a PHV?", a: "A private hire vehicle: a car licensed to carry fare-paying passengers booked in advance, for services like Uber, Bolt and local minicab firms. It is different to a black cab." },
            { q: "Do I need a licence to rent a car on Kharo?", a: "Yes. You need a valid private hire driver licence for the city you plan to drive in (a TfL licence for London, or the equivalent local council licence elsewhere)." },
            { q: "Is insurance included in the price?", a: "No. The weekly price shown is the rental price only, kept below what other PCO platforms charge for the same car. Maintenance is included; insurance is quoted separately based on your profile, so you always see it broken out rather than marked up and hidden inside someone else's \"all-in\" figure." },
            { q: "Is a deposit required?", a: "Most operators ask for a deposit, shown on the vehicle's listing page. It's held by the operator and is separate from the weekly rent." },
            { q: "What happens if the vehicle breaks down?", a: "Most listings include breakdown cover, shown on the vehicle page. If anything goes wrong, you contact the operator directly, since the rental agreement is between you and them." },
            { q: "How do I contact the operator?", a: "Register your interest on a listing and the operator gets your details directly. There's no messaging system yet, most operators call or message within a few hours." },
            { q: "How much does it cost to list a vehicle?", a: "Listing is free for operators. Kharo doesn't charge a monthly fee to appear on the marketplace." },
            { q: "Who handles payments?", a: "Kharo doesn't process rental payments. Rent, deposit and any other terms are agreed and paid directly between the driver and the operator." },
          ].map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-heading font-semibold text-[#111]">
                {item.q}
                <ChevronDown className="w-5 h-5 text-[#0B6B4F] shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="text-[15px] text-[#555] mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* OPERATOR CTA - solid brand green, matching the CTA band used on every
          other page instead of a dark full-bleed photo panel */}
      <section className="bg-[#0B6B4F] py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mb-3" style={{ textWrap: "balance" }}>
            Got vehicles sitting idle?
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto mb-8">
            List your PCO fleet on Kharo and start generating weekly income. No commission on agreed rates.
          </p>
          <button
            onClick={() => navigate("/list-your-fleet")}
            className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-full bg-white text-[#0B6B4F] hover:bg-[#EAF5F1] transition-colors"
          >
            List Your Fleet <ArrowRight size={15} />
          </button>
        </div>
      </section>

    </div>
  );
}
