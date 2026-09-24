import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";

/**
 * Expansion-demand capture. Distinct from the per-vehicle Register Interest
 * flow in Apply.jsx: this is for a city or area where Kharo has no cars
 * listed yet, so we can gauge where to bring operators and inventory next.
 *
 * The fields follow the same rule as every other form on the site: phone
 * first and required, then name, then email as an option.
 *
 * If `city` is passed, the field is locked to that city (used on CityPage's
 * empty state). Otherwise the visitor types the city or area themselves
 * (used on the homepage, for anyone outside our current cities).
 *
 * `mode="request"` is the specific-car variant used by RequestCar.jsx: the
 * note and vehicle_type make clear this is a driver asking for a particular
 * kind of car, not general city expansion interest.
 */
export default function CityInterestForm({ city: fixedCity, className = "", compact = false, mode = "expansion" }) {
  const [city, setCity] = useState(fixedCity || "");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!city.trim() || !name.trim() || !phone.trim()) {
      toast.error("Please add your phone number, your name and your city so we can reach you.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/city-interest", {
        city: city.trim(),
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim(),
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
          Thank you. We will call or message you the moment Kharo has cars in {city}.
        </p>
      </div>
    );
  }

  const field = "field min-w-0 border border-line-strong text-[16px] text-ink px-4 py-3 rounded-md bg-surface focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/20";

  return (
    <form onSubmit={submit} className={`grid gap-2.5 ${compact ? "" : "sm:grid-cols-2"} ${className}`} data-testid="city-interest-form">
      <input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" aria-label="Your phone number" className={field} data-testid="city-phone" />
      <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" className={field} data-testid="city-name" />
      {!fixedCity && (
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city or area" aria-label="Your city or area" className={field} data-testid="city-city" />
      )}
      <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (if you have one)" aria-label="Email, optional" className={field} data-testid="city-email" />
      <button
        type="submit"
        disabled={loading}
        className={`pressable flex items-center justify-center gap-2 bg-green hover:bg-green-hover text-ink text-[14px] font-semibold px-6 py-3 rounded-md disabled:opacity-60 ${compact ? "" : "sm:col-span-2"}`}
        data-testid="city-submit"
      >
        {loading ? "Sending" : "Register interest"} {!loading && <ArrowRight size={14} strokeWidth={1.75} />}
      </button>
    </form>
  );
}
