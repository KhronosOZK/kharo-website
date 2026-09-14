import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

/**
 * Expansion-demand capture. Distinct from the per-vehicle Register Interest
 * flow in Apply.jsx: this is for a city or area where Kharo has no cars
 * listed yet, so we can gauge where to bring operators and inventory next.
 *
 * If `city` is passed, the field is locked to that city (used on CityPage's
 * empty state). Otherwise the visitor types the city or area themselves
 * (used on the homepage, for anyone outside our current four cities).
 */
export default function CityInterestForm({ city: fixedCity, className = "" }) {
  const [city, setCity] = useState(fixedCity || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!city || !name || !email) {
      toast.error("Please add your name, email and city so we can reach you.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/city-interest", {
        city,
        name,
        email,
        phone: "",
        vehicle_type: "General interest",
        note: `Expansion interest: no Kharo vehicles listed in ${city} yet.`,
      });
      setDone(true);
    } catch {
      toast.error("Couldn't send that. Please try again.");
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#0B6B4F" }} strokeWidth={2} />
        <p className="text-[15px] text-[#333]">
          You're on the list. We'll email you the moment Kharo has cars in {city}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`flex flex-col sm:flex-row gap-2.5 ${className}`}>
      {!fixedCity && (
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Your city or area"
          className="flex-1 min-w-0 border border-[#E8E8E8] text-sm text-[#333] px-4 py-3 rounded-full focus:outline-none focus:border-[#AAA] focus:ring-1 focus:ring-[#AAA]"
        />
      )}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="flex-1 min-w-0 border border-[#E8E8E8] text-sm text-[#333] px-4 py-3 rounded-full focus:outline-none focus:border-[#AAA] focus:ring-1 focus:ring-[#AAA]"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 min-w-0 border border-[#E8E8E8] text-sm text-[#333] px-4 py-3 rounded-full focus:outline-none focus:border-[#AAA] focus:ring-1 focus:ring-[#AAA]"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-[#0B6B4F] hover:bg-[#095B43] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors disabled:opacity-60 shrink-0"
      >
        {loading ? "Sending…" : "Register Interest"} {!loading && <ArrowRight size={14} />}
      </button>
    </form>
  );
}
