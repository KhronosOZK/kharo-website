import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { POPULAR_CITIES, MORE_CITIES, LIVE_CITIES } from "@/lib/cities";
import { useAuth } from "@/context/AuthContext";
import VehicleCard from "@/components/VehicleCard";
import CityInterestForm from "@/components/CityInterestForm";
import { Button } from "@/components/ui/button";
import PreviewNotice from "@/components/PreviewNotice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { compare, clearCompare } = useAuth();
  const [listings, setListings] = useState(null);
  const [city, setCity] = useState(params.get("city") || "London");
  const [vtype, setVtype] = useState(params.get("type") || "any");
  const [fuel, setFuel] = useState(params.get("fuel") || "any");
  const [range, setRange] = useState([Number(params.get("min")) || 0, Number(params.get("max")) || 400]);
  const [sort, setSort] = useState("default");

  const run = useCallback(async () => {
    setListings(null);
    const q = { city };
    if (vtype !== "any") q.vehicle_type = vtype;
    if (fuel !== "any") q.fuel = fuel;
    if (sort !== "default") q.sort = sort;
    const { data } = await api.get("/listings", { params: q });
    setListings(data.filter((v) => v.weekly_rent >= range[0] && v.weekly_rent <= (range[1] >= 400 ? 9999 : range[1])));
  }, [city, vtype, fuel, sort, range]);

  useEffect(() => { run(); }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { trackEvent("page_view", { path: "/search", city }); run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = () => {
    const p = new URLSearchParams();
    p.set("city", city);
    if (vtype !== "any") p.set("type", vtype);
    if (fuel !== "any") p.set("fuel", fuel);
    p.set("min", range[0]); p.set("max", range[1]);
    setParams(p);
    trackEvent("search", { city, vtype, fuel, range });
    run();
  };

  const cityHasNoInventory = listings != null && listings.length === 0 && !LIVE_CITIES.includes(city);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <PreviewNotice />
      <button onClick={() => navigate("/")} className="text-sm text-[#4A564F] hover:text-[#0B6B4F]">Home</button>
      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1A2E25] mt-2">Cars in {city}</h1>

      <div className="mt-6 bg-white rounded-2xl p-4 ring-1 ring-slate-200/70">
        <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold text-sm mb-3"><SlidersHorizontal className="w-4 h-4" /> Refine</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="City">
            <Select value={city} onValueChange={setCity}><SelectTrigger data-testid="sr-city" className="h-11 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#0B6B4F]">Most popular</SelectLabel>{POPULAR_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectGroup>
                <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#9AA39D]">More cities</SelectLabel>{MORE_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectGroup>
              </SelectContent></Select>
          </Field>
          <Field label="Type"><Select value={vtype} onValueChange={setVtype}><SelectTrigger data-testid="sr-type" className="h-11 bg-white"><SelectValue /></SelectTrigger><SelectContent>{["any", "saloon", "executive", "mpv", "estate", "wav"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t === "any" ? "Any type" : t.toUpperCase()}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Fuel"><Select value={fuel} onValueChange={setFuel}><SelectTrigger data-testid="sr-fuel" className="h-11 bg-white"><SelectValue /></SelectTrigger><SelectContent>{["any", "hybrid", "electric", "petrol", "diesel"].map((f) => <SelectItem key={f} value={f} className="capitalize">{f === "any" ? "Any fuel" : f}</SelectItem>)}</SelectContent></Select></Field>
          <Field label={`Budget: £${range[0]} to £${range[1] >= 400 ? "400+" : range[1]}`}><div className="h-11 flex items-center px-1"><Slider min={0} max={400} step={5} value={range} onValueChange={setRange} data-testid="sr-budget" minStepsBetweenThumbs={1} /></div></Field>
        </div>
        <Button onClick={apply} data-testid="sr-apply" className="mt-4 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white"><Search className="w-4 h-4 mr-2" /> Update results</Button>
      </div>

      <div className="flex items-center justify-between mt-8 mb-6 flex-wrap gap-3">
        <p className="text-[#4A564F]" data-testid="sr-count">{listings == null ? "Searching…" : `${listings.length} cars match`}</p>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-52 bg-white" data-testid="sr-sort"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Our pick for you</SelectItem>
            <SelectItem value="price_asc">Cheapest first</SelectItem>
            <SelectItem value="price_desc">Dearest first</SelectItem>
            <SelectItem value="rating">Best rated operators</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {listings == null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={`sk-${i}`} className="h-80 rounded-2xl bg-white ring-1 ring-slate-200/70 animate-pulse" />)}</div>
      ) : cityHasNoInventory ? (
        <div className="bg-[#F1EFE9] rounded-[22px] p-6 sm:p-10" data-testid="sr-city-interest"><CityInterestForm city={city} /></div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-[#7A857F] bg-white rounded-2xl ring-1 ring-slate-200" data-testid="sr-empty">Nothing matches those filters in {city}. Try widening your budget or fuel type.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((v, i) => (<div key={v.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}><VehicleCard v={v} /></div>))}
        </div>
      )}

      {listings != null && listings.length > 0 && (
        <div className="mt-12 relative overflow-hidden rounded-[22px] bg-[#0A130F]" data-testid="sr-car-request">
          <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=60" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/96 via-[#0A130F]/85 to-[#0A130F]/60" />
          <div className="relative p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-white">
            <div className="[text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl sm:text-2xl font-heading font-bold">Can't find the right car in {city}?</h3>
              <p className="text-white/70 mt-2 text-[15px] max-w-md">Tell us exactly what you are after and we will match you when it comes up.</p>
            </div>
            <Button onClick={() => navigate(`/request-a-car?city=${encodeURIComponent(city)}`)} data-testid="sr-request-car-btn"
              className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0A130F] font-semibold shrink-0 hover:-translate-y-[2px] transition-transform">Request a car</Button>
          </div>
        </div>
      )}

      {compare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-[#1A2E25] text-white pl-5 pr-2 py-2 shadow-xl" data-testid="compare-bar">
          <span className="text-[14px] font-medium">{compare.length} car{compare.length !== 1 ? "s" : ""} to compare</span>
          <button onClick={clearCompare} data-testid="compare-clear-bar" className="text-[13px] text-white/60 hover:text-white transition-colors">Clear</button>
          <Button onClick={() => navigate("/compare")} data-testid="go-compare" className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0A130F] font-semibold h-9">Compare</Button>
        </div>
      )}
    </main>
  );
}

const Field = ({ label, children }) => (<div><label className="text-[12.5px] font-medium text-[#4A564F] mb-1.5 block truncate">{label}</label>{children}</div>);
