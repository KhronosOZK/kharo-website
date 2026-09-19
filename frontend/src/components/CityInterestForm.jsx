import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";

/**
 * Expansion-demand capture. Distinct from the per-vehicle Register Interest
 * flow in Apply.jsx: this is for a city or area where Kharo has no cars
 * listed yet, so we can gauge where to bring operators and inventory next.
 *
 * If `city` is passed, the field is locked to that city (used on CityPage's
 * empty state). Otherwise the visitor types the city or area themselves
 * (used on the homepage, for anyone outside our current five cities).
 *
 * `mode="request"` is the specific-car variant used by RequestCar.jsx: the
 * note and vehicle_type make clear this is a driver asking for a particular
 * kind of car, not general city expansion interest.
 */
export default function CityInterestForm({ city: fixedCity, className = "", compact = false, mode = "expansion" }) {
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
        vehicle_type: mode === "request" ? "Specific request" : "General interest",
        note: mode === "request"
          ? `Specific car request from a driver in ${city}.`
          : `Expansion interest: no Kharo vehicles listed in ${city} yet.`,
      });
      trackEvent("city_interest", { city, mode });
      setDone(true);
    } catch {
      toast.error("Couldn't send that. Please try again.");
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <Check className="w-5 h-5 mt-0.5 shrink-0 text-green" strokeWidth={2} />
        <p className="text-[15px] text-ink">
          You are on the list. We will email you the moment Kharo has cars in {city}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`flex flex-col ${compact ? "" : "sm:flex-row"} gap-2.5 ${className}`}>
      {!fixedCity && (
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Your city or area"
          className="field flex-1 min-w-0 border border-line-strong text-base text-ink px-4 py-3 rounded-full bg-surface focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/20"
        />
      )}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="field flex-1 min-w-0 border border-line-strong text-base text-ink px-4 py-3 rounded-full bg-surface focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/20"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="field flex-1 min-w-0 border border-line-strong text-base text-ink px-4 py-3 rounded-full bg-surface focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/20"
      />
      <button
        type="submit"
        disabled={loading}
        className="pressable flex items-center justify-center gap-2 bg-green hover:bg-green-hover text-white text-sm font-semibold px-6 py-3 rounded-full disabled:opacity-60 shrink-0"
      >
        {loading ? "Sending" : "Register interest"} {!loading && <ArrowRight size={14} strokeWidth={1.75} />}
      </button>
    </form>
  );
}
