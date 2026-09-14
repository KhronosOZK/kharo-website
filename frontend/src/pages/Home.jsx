import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowRight, ArrowUpRight, Zap, ShieldCheck, FileCheck, Wrench, Check, TrendingUp } from "lucide-react";
import { MOCK_LISTINGS, MOCK_BOROUGHS, MOCK_MAKES, BUDGET_OPTIONS, ENGINE_OPTIONS } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";

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

// Fleet showcase - asymmetric masonry, photography-led, no chrome
function FleetTile({ src, label, className }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
      <img
        src={src}
        alt={label}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
      <span className="absolute bottom-3 left-4 text-white font-heading font-semibold text-sm">{label}</span>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [borough, setBorough] = useState("All Areas");
  const [make, setMake] = useState("All Makes");
  const [budget, setBudget] = useState("");
  const [engine, setEngine] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [bodyType, setBodyType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [listings] = useState(MOCK_LISTINGS.slice(0, 6));

  function handleSearch() {
    const params = new URLSearchParams();
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
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,0.97) 100%), url('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1800&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
            filter: "grayscale(0.55) contrast(1.08)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center w-full">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.16em] mb-6">
            Direct Operator PCO Rentals
          </p>

          <h1 className="font-heading text-[42px] leading-[1.02] sm:text-6xl lg:text-7xl font-bold text-white max-w-4xl mb-5" style={{ textWrap: "balance", letterSpacing: "-0.02em" }}>
            Drive London.<br />On Your Terms.
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-xl mb-10">
            Weekly PCO rentals direct from licensed operators, insurance and maintenance included.
          </p>

          {/* SEARCH PANEL - pill fields, single accent CTA */}
          <div className="w-full max-w-3xl bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <FilterSelect
                options={MOCK_BOROUGHS.map((b) => ({ label: b, value: b === "All Areas" ? "" : b }))}
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

      {/* FLEET SHOWCASE - asymmetric masonry, editorial, photography-led */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">The Fleet</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Cars London Actually Drives</h2>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="hidden sm:flex items-center gap-2 border border-gray-200 hover:border-gray-400 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Show all vehicles <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 h-[520px] sm:h-[420px]">
          <FleetTile
            src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80"
            label="Toyota Prius"
            className="col-span-2 row-span-2"
          />
          <FleetTile
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=700&q=80"
            label="Kia Niro EV"
            className="col-span-1 row-span-1"
          />
          <FleetTile
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=700&q=80"
            label="Toyota Camry"
            className="col-span-1 row-span-1"
          />
          <FleetTile
            src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=700&q=80"
            label="VW Passat GTE"
            className="col-span-1 row-span-1"
          />
          <FleetTile
            src="https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=700&q=80"
            label="Mercedes E-Class"
            className="col-span-1 row-span-1"
          />
        </div>
        <button
          onClick={() => navigate("/search")}
          className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-900 text-sm font-semibold px-5 py-3 rounded-full"
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
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Every rental, fully covered</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Fully comprehensive insurance", body: "Included in every weekly rate." },
            { icon: Wrench, title: "Maintenance included", body: "Servicing handled by the operator." },
            { icon: FileCheck, title: "TfL-licensed vehicles only", body: "Every listing is PCO compliant." },
            { icon: Zap, title: "On the road fast", body: "Most drivers are matched within 48 hours." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <f.icon size={22} className="text-gray-900" strokeWidth={1.75} />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{f.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{f.body}</p>
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
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Simple Process</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">How Kharo Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Search & Filter", body: "Browse vehicles by borough, make, budget and engine type. Every listing is from a verified London PCO operator." },
              { n: "02", title: "Check Availability", body: "Found a vehicle you like? Submit your details and the operator confirms availability. No commission, no middleman." },
              { n: "03", title: "Pick Up & Drive", body: "Sign the rental agreement directly with the operator, collect your keys, and start earning. Insurance and maintenance included." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col">
                <span className="font-heading text-4xl font-bold text-gray-200 mb-3 select-none">{step.n}</span>
                <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPERATOR CTA - contained black block, dot-grid texture, pill button */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div
          className="relative rounded-[32px] px-8 py-16 sm:py-20 text-center overflow-hidden"
          style={{ backgroundColor: INK }}
        >
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mb-3" style={{ textWrap: "balance" }}>
              Got vehicles sitting idle?
            </h2>
            <p className="text-white/55 text-sm sm:text-base max-w-md mx-auto mb-8">
              List your PCO fleet on Kharo and start generating weekly income. No commission on agreed rates.
            </p>
            <button
              onClick={() => navigate("/operators")}
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
