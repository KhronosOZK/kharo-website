import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowRight, Check } from "lucide-react";
import { MOCK_LISTINGS, MOCK_BOROUGHS, MOCK_MAKES, BUDGET_OPTIONS, ENGINE_OPTIONS } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";

// Single restrained brand accent — used sparingly, everything else neutral
const INK = "#0A0A0A";
const ACCENT = "#5FD3A6";      // bright mint — buttons/highlights on dark
const ACCENT_TEXT = "#0B6B4F"; // deep green — text/links on white

function FilterSelect({ options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 text-gray-800 text-sm font-medium px-4 py-3 pr-9 rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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

      {/* HERO — near-black, one accent, no glow/glassmorphism */}
      <section
        className="relative min-h-[76vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{ backgroundColor: INK }}
      >
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,0.96) 100%), url('https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 flex flex-col items-center w-full">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.14em] mb-5">
            Direct Operator PCO Rentals
          </p>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-4" style={{ textWrap: "balance" }}>
            Find Your Next PCO Rental in London
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-xl mb-10">
            Direct from licensed operators. Weekly rental includes insurance and maintenance.
          </p>

          {/* SEARCH PANEL — clean white card, neutral shadow */}
          <div className="w-full max-w-3xl bg-white rounded-lg p-4 sm:p-5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)]">
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

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <ChevronDown size={14} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
                {showMore ? "Fewer filters" : "More filters"}
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-md transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: ACCENT, color: INK }}
              >
                <Search size={16} />
                Search Vehicles
              </button>
            </div>
          </div>

          {/* Stats strip — plain, no colour */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-white/45 text-sm">
            <span><strong className="text-white">200+</strong> Verified Operators</span>
            <span><strong className="text-white">500+</strong> Vehicles Listed</span>
            <span><strong className="text-white">4,000+</strong> Drivers Matched</span>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES — light, monochrome type, photos carry the colour */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
          {listings.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
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

      {/* WHY KHARO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Why Drivers Choose Us</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-6" style={{ textWrap: "balance" }}>
              The straightforward way to rent a PCO car in London
            </h2>
            <div className="space-y-5">
              {[
                { title: "Insurance included in every rental", body: "All vehicles on Kharo include fully comprehensive PCO insurance. No hidden costs." },
                { title: "Direct from licensed operators", body: "You deal directly with vetted, TfL-licensed fleet operators. We never take a cut of your deal." },
                { title: "Clear weekly pricing", body: "Every listing shows a single weekly figure. What you see is what you pay, including maintenance." },
                { title: "Flexible terms", body: "Weekly rolling contracts with most operators. No long-term commitments unless you want them." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: INK }}>
                    <Check size={11} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-0.5">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/search")}
              className="mt-8 inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-md transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: INK }}
            >
              Browse All Vehicles <ArrowRight size={15} />
            </button>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=700&q=80"
              alt="PCO vehicles lined up ready for rental"
              className="w-full h-80 lg:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* OPERATOR STRIP — same near-black, same single accent */}
      <section className="py-14" style={{ backgroundColor: INK }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1">
              Got vehicles sitting idle?
            </h2>
            <p className="text-white/55 text-sm max-w-md">
              List your PCO fleet on Kharo and start generating weekly income. No commission on agreed rates.
            </p>
          </div>
          <button
            onClick={() => navigate("/operators")}
            className="flex-shrink-0 font-semibold text-sm px-6 py-3 rounded-md transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: ACCENT, color: INK }}
          >
            List Your Fleet
          </button>
        </div>
      </section>

    </div>
  );
}
