import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";
import { SELL } from "@/content/site";
import { ALL_CITIES } from "@/lib/cities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIMEFRAMES = ["As soon as possible", "Within a month", "Within three months", "Just exploring"];
const CONDITIONS = ["Excellent", "Good", "Fair", "Needs work"];
const PCO_WANTED = ["Any", "3 months or more", "6 months or more", "9 months or more"];

const field = "h-11 bg-[#F6F5F2] border border-transparent rounded-xl px-4 text-[15px] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B6B4F]/25 focus-visible:border-[#0B6B4F] transition-colors";

/**
 * Captures demand on both sides of the sales marketplace.
 *
 * props
 *   defaultIntent  "sell" | "buy" | "both"
 *   showToggle     let the visitor switch sides
 *   listingId      pre-attach the enquiry to a specific vehicle
 *   listingLabel   shown above the form when enquiring about one vehicle
 */
export default function MarketplaceInterestForm({
  defaultIntent = "buy", showToggle = true, listingId = null, listingLabel = null, city = "London",
}) {
  const [intent, setIntent] = useState(defaultIntent);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({
    name: "", email: "", phone: "", city,
    make: "", model: "", year: "", mileage: "", fuel: "", pco_expiry: "",
    asking_price: "", condition: "Good", timeframe: "Within a month", vehicle_count: "1",
    looking_for: "", budget: "", min_pco_months: "Any", seller_type: "driver", notes: "",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const pick = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const wantsSell = intent === "sell" || intent === "both";
  const wantsBuy = intent === "buy" || intent === "both";

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) { toast.error("Please add your name."); return; }
    if (!f.email.includes("@")) { toast.error("Please add a valid email address."); return; }
    if (!f.phone.trim()) { toast.error("Please add a phone number so we can reach you."); return; }
    setLoading(true);
    try {
      await api.post("/marketplace-interest", { ...f, intent, listing_id: listingId });
      trackEvent("marketplace_interest", { intent, city: f.city, listing_id: listingId });
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (done) {
    const copy = wantsSell ? SELL.form : SELL.buyer;
    return (
      <div className="text-center py-8" data-testid="marketplace-interest-success">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <Check className="w-7 h-7 text-emerald-700" />
        </div>
        <h3 className="text-xl font-heading font-bold text-[#1A2E25] mt-4">{copy.successHeading}</h3>
        <p className="text-[#4A564F] mt-2 text-[15px] leading-relaxed">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" data-testid="marketplace-interest-form">
      {listingLabel && (
        <div className="rounded-2xl bg-[#E6F5F0] border border-[#0B6B4F]/15 p-3.5 text-[13.5px] text-[#1A2E25]">
          Enquiry about <span className="font-semibold">{listingLabel}</span>
        </div>
      )}

      {showToggle && (
        <div data-testid="marketplace-intent-toggle">
          <span className="text-[12.5px] font-medium text-[#4A564F] block mb-2">{SELL.buyerToggle.question}</span>
          <div className="grid grid-cols-3 gap-2">
          {[["sell", SELL.buyerToggle.sell], ["buy", SELL.buyerToggle.buy], ["both", SELL.buyerToggle.both]].map(([key, label]) => (
            <button key={key} type="button" onClick={() => setIntent(key)} data-testid={`intent-${key}`}
              className={`rounded-2xl px-2 py-3 min-h-[44px] text-[13.5px] font-semibold ring-1 transition-all ${
                intent === key ? "ring-2 ring-[#0B6B4F] bg-[#0B6B4F]/[0.07] text-[#0B6B4F]" : "ring-slate-200 bg-white text-[#4A564F] hover:bg-slate-50"
              }`}>
              {label}
            </button>
          ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Your name</Label>
          <Input value={f.name} onChange={set("name")} data-testid="mi-name" className={field} /></div>
        <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Phone</Label>
          <Input value={f.phone} onChange={set("phone")} data-testid="mi-phone" className={field} /></div>
      </div>
      <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Email</Label>
        <Input type="email" value={f.email} onChange={set("email")} data-testid="mi-email" className={field} /></div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">City</Label>
          <Select value={f.city} onValueChange={pick("city")}>
            <SelectTrigger data-testid="mi-city" className="h-11 rounded-xl bg-[#F6F5F2] border-transparent"><SelectValue /></SelectTrigger>
            <SelectContent>{ALL_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Timeframe</Label>
          <Select value={f.timeframe} onValueChange={pick("timeframe")}>
            <SelectTrigger data-testid="mi-timeframe" className="h-11 rounded-xl bg-[#F6F5F2] border-transparent"><SelectValue /></SelectTrigger>
            <SelectContent>{TIMEFRAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select></div>
      </div>

      {wantsSell && (
        <div className="rounded-2xl bg-[#F9F8F6] ring-1 ring-slate-200/70 p-4 space-y-3" data-testid="mi-sell-block">
          <p className="text-[13px] font-semibold text-[#0B6B4F]">About the vehicle you are selling</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Make</Label>
              <Input value={f.make} onChange={set("make")} placeholder="Toyota" data-testid="mi-make" className={field} /></div>
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Model</Label>
              <Input value={f.model} onChange={set("model")} placeholder="Prius" data-testid="mi-model" className={field} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Year</Label>
              <Input value={f.year} onChange={set("year")} placeholder="2021" data-testid="mi-year" className={field} /></div>
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Mileage</Label>
              <Input value={f.mileage} onChange={set("mileage")} placeholder="86,000" data-testid="mi-mileage" className={field} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">PCO licence expires</Label>
              <Input type="date" value={f.pco_expiry} onChange={set("pco_expiry")} data-testid="mi-pco" className={field} /></div>
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Asking price</Label>
              <Input value={f.asking_price} onChange={set("asking_price")} placeholder="£11,500" data-testid="mi-price" className={field} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Condition</Label>
              <Select value={f.condition} onValueChange={pick("condition")}>
                <SelectTrigger data-testid="mi-condition" className="h-11 rounded-xl bg-[#F6F5F2] border-transparent"><SelectValue /></SelectTrigger>
                <SelectContent>{CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select></div>
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">How many vehicles</Label>
              <Input value={f.vehicle_count} onChange={set("vehicle_count")} data-testid="mi-count" className={field} /></div>
          </div>
        </div>
      )}

      {wantsBuy && (
        <div className="rounded-2xl bg-[#F9F8F6] ring-1 ring-slate-200/70 p-4 space-y-3" data-testid="mi-buy-block">
          <p className="text-[13px] font-semibold text-[#0B6B4F]">What you are looking for</p>
          <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Make, model or body type</Label>
            <Input value={f.looking_for} onChange={set("looking_for")} placeholder="Hybrid saloon, ideally a Prius or Corolla" data-testid="mi-looking" className={field} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Budget</Label>
              <Input value={f.budget} onChange={set("budget")} placeholder="Up to £13,000" data-testid="mi-budget" className={field} /></div>
            <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">PCO licence needed</Label>
              <Select value={f.min_pco_months} onValueChange={pick("min_pco_months")}>
                <SelectTrigger data-testid="mi-minpco" className="h-11 rounded-xl bg-[#F6F5F2] border-transparent"><SelectValue /></SelectTrigger>
                <SelectContent>{PCO_WANTED.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select></div>
          </div>
        </div>
      )}

      <div><Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">Anything else we should know</Label>
        <Textarea value={f.notes} onChange={set("notes")} rows={3} data-testid="mi-notes"
          className="bg-[#F6F5F2] border-transparent rounded-xl text-[15px] focus-visible:bg-white" /></div>

      <Button type="submit" disabled={loading} data-testid="mi-submit"
        className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold">
        {loading ? "Sending" : intent === "sell" ? "Register my vehicle" : intent === "both" ? "Register my interest" : "Set up my alert"}
      </Button>
      <p className="text-[12px] text-[#7A857F] text-center">We only use your details to make an introduction. No listing fee while we launch.</p>
    </form>
  );
}
