import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Star, Shield, Zap, MapPin, Check, ArrowRight, Car } from "lucide-react";
import { MOCK_LISTINGS, MOCK_BOROUGHS, MOCK_MAKES, BUDGET_OPTIONS, ENGINE_OPTIONS } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";

// Expandable filter row
function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 text-gray-800 text-sm font-medium px-4 py-3 pr-9 rounded-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 cursor-pointer"
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

// Trust badge pill
function TrustBadge({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-white/80 text-sm">
      <Icon size={14} className="text-emerald-400 flex-shrink-0" />
      <span>{text}</span>
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
  const [listings, setListings] = useState(MOCK_LISTINGS.slice(0, 6));

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

      {/* HERO */}
      <section
        className="relative min-h-[78vh] flex flex-col items-center justify-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(8,40,28,0.80) 0%, rgba(8,40,28,0.65) 60%, rgba(8,40,28,0.88) 100%), url('https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
          <TrustBadge icon={Shield} text="PCO Licensed Vehicles Only" />
          <TrustBadge icon={Zap} text="Insurance Included" />
          <TrustBadge icon={Check} text="Direct from Operators" />
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-4" style={{ textWrap: "balance" }}>
          Find Your Next PCO Rental in London
        </h1>
        <p className="text-white/70 text-base sm:text-lg max-w-xl mb-10">
          Direct from licensed operators. Weekly rental includes insurance and maintenance.
        </p>

        {/* SEARCH PANEL */}
        <div className="w-full max-w-3xl bg-white rounded-sm shadow-2xl p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FilterSelect
              label="Borough / Area"
              options={MOCK_BOROUGHS.map((b) => ({ label: b, value: b === "All Areas" ? "" : b }))}
              value={borough}
              onChange={setBorough}
            />
            <FilterSelect
              label="Make / Model"
              options={MOCK_MAKES.map((m) => ({ label: m, value: m === "All Makes" ? "" : m }))}
              value={make}
              onChange={setMake}
            />
            <FilterSelect
              label="Weekly Budget"
              options={BUDGET_OPTIONS}
              value={budget}
              onChange={setBudget}
            />
            <FilterSelect
              label="Engine Type"
              options={ENGINE_OPTIONS}
              value={engine}
              onChange={setEngine}
            />
          </div>

          {/* Expandable filters */}
          {showMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <FilterSelect
                label="Body Type"
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
                label="Transmission"
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
              className="flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white font-semibold text-sm px-6 py-3 rounded-sm transition-colors"
            >
              <Search size={16} />
              Search Vehicles
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-white/60 text-sm">
          <span><strong className="text-white">200+</strong> Verified Operators</span>
          <span><strong className="text-white">500+</strong> Vehicles Listed</span>
          <span><strong className="text-white">4,000+</strong> Drivers Matched</span>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-1">Available Now</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">Featured Rentals</h2>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-1 text-sm font-medium text-green-800 hover:text-green-900 transition-colors"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-1">Simple Process</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">How Kharo Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Search & Filter", body: "Browse vehicles by borough, make, budget and engine type. Every listing is from a verified London PCO operator." },
              { n: "02", title: "Check Availability", body: "Found a vehicle you like? Submit your details and the operator confirms availability. No commission, no middleman." },
              { n: "03", title: "Pick Up & Drive", body: "Sign the rental agreement directly with the operator, collect your keys, and start earning. Insurance and maintenance included." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col">
                <span className="font-heading text-4xl font-bold text-gray-100 mb-3 select-none">{step.n}</span>
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
            <p className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-2">Why Drivers Choose Us</p>
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
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-700 flex items-center justify-center mt-0.5">
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
              className="mt-8 inline-flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white font-semibold text-sm px-6 py-3 rounded-sm transition-colors"
            >
              Browse All Vehicles <ArrowRight size={15} />
            </button>
          </div>
          <div className="relative rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=700&q=80"
              alt="PCO vehicles lined up ready for rental"
              className="w-full h-80 lg:h-96 object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-sm p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-800 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Car size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Ready to drive today</p>
                  <p className="text-gray-500 text-xs">Most operators can have you on the road within 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPERATOR STRIP */}
      <section
        className="py-14"
        style={{
          backgroundImage: `linear-gradient(to right, #0B6B4F, #054a37)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1">
              Got vehicles sitting idle?
            </h2>
            <p className="text-white/70 text-sm max-w-md">
              List your PCO fleet on Kharo and start generating weekly income. No commission on agreed rates.
            </p>
          </div>
          <button
            onClick={() => navigate("/operators")}
            className="flex-shrink-0 bg-white text-green-900 font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-50 transition-colors"
          >
            List Your Fleet
          </button>
        </div>
      </section>

    </div>
  );
}
