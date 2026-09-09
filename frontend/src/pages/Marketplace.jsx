import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SlidersHorizontal, Search, ArrowRight, CalendarCheck, ShieldCheck, Gauge, Handshake, Info, X,
} from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { MARKETPLACE } from "@/content/site";
import { POPULAR_CITIES, MORE_CITIES } from "@/lib/cities";
import { BODY_TYPES, FUELS, SELLER_TYPES, PCO_MINIMUMS, typeLabel } from "@/lib/phv";
import { useSeo, faqJsonLd } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import SaleCard from "@/components/SaleCard";
import MarketplaceInterestForm from "@/components/MarketplaceInterestForm";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel,
} from "@/components/ui/select";

const ICONS = { CalendarCheck, ShieldCheck, Gauge, Handshake };
const MAX_PRICE = 30000;

const budgetLabel = ([lo, hi]) =>
  `£${lo.toLocaleString()} to £${hi >= MAX_PRICE ? "30,000+" : hi.toLocaleString()}`;

export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [demand, setDemand] = useState(null);
  const [city, setCity] = useState(params.get("city") || "London");
  const [vtype, setVtype] = useState(params.get("type") || "any");
  const [fuel, setFuel] = useState(params.get("fuel") || "any");
  const [seller, setSeller] = useState(params.get("seller") || "any");
  const [pco, setPco] = useState(params.get("pco") || "0");
  const [range, setRange] = useState([Number(params.get("min")) || 0, Number(params.get("max")) || MAX_PRICE]);
  const [sort, setSort] = useState("default");
  const [text, setText] = useState(params.get("q") || "");
  const mounted = useRef(false);

  const run = useCallback(async () => {
    setRows(null);
    const q = { city };
    if (text.trim()) q.q = text.trim();
    if (vtype !== "any") q.vehicle_type = vtype;
    if (fuel !== "any") q.fuel = fuel;
    if (seller !== "any") q.seller_type = seller;
    if (Number(pco) > 0) q.min_pco_months = Number(pco);
    if (range[0] > 0) q.min_price = range[0];
    if (range[1] < MAX_PRICE) q.max_price = range[1];
    if (sort !== "default") q.sort = sort;
    try {
      const { data } = await api.get("/marketplace", { params: q });
      setRows(data);
    } catch {
      setRows([]);
    }
  }, [city, vtype, fuel, seller, pco, range, sort, text]);

  // Sort re-queries immediately. The mount guard stops this firing alongside
  // the initial load below and doubling the request.
  useEffect(() => {
    if (!mounted.current) return;
    run();
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mounted.current = true;
    trackEvent("page_view", { path: "/marketplace", city });
    run();
    api.get("/marketplace-demand").then((r) => setDemand(r.data)).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = () => {
    const p = new URLSearchParams();
    p.set("city", city);
    if (vtype !== "any") p.set("type", vtype);
    if (fuel !== "any") p.set("fuel", fuel);
    if (seller !== "any") p.set("seller", seller);
    if (Number(pco) > 0) p.set("pco", pco);
    if (text.trim()) p.set("q", text.trim());
    p.set("min", range[0]); p.set("max", range[1]);
    setParams(p);
    trackEvent("marketplace_search", { city, vtype, fuel, seller, pco, range });
    run();
  };

  const scrollToAlert = () => document.getElementById("buyer-alert")?.scrollIntoView({ behavior: "smooth", block: "center" });

  // Chips for whatever narrowing is currently applied, each individually
  // clearable. Without these it is easy to forget a filter is still on and
  // conclude the marketplace is empty.
  const chips = [
    text.trim() && { label: `"${text.trim()}"`, clear: () => setText("") },
    vtype !== "any" && { label: typeLabel(vtype), clear: () => setVtype("any") },
    fuel !== "any" && { label: fuel, clear: () => setFuel("any") },
    seller !== "any" && { label: SELLER_TYPES.find((x) => x.value === seller)?.label, clear: () => setSeller("any") },
    Number(pco) > 0 && { label: `${pco}+ months PCO`, clear: () => setPco("0") },
    (range[0] > 0 || range[1] < MAX_PRICE) && {
      label: budgetLabel(range),
      clear: () => setRange([0, MAX_PRICE]),
    },
  ].filter(Boolean);

  const clearAll = () => {
    setText(""); setVtype("any"); setFuel("any"); setSeller("any");
    setPco("0"); setRange([0, MAX_PRICE]);
  };

  useSeo({
    title: `Private hire vehicles for sale in ${city} · Kharo Marketplace`,
    description: MARKETPLACE.hero.sub,
    jsonLd: faqJsonLd([
      { q: "Does the PCO licence transfer when I buy a car?", a: MARKETPLACE.pcoNote.body },
      { q: "What does Kharo check before a vehicle is listed?", a: MARKETPLACE.valueProps[1].d },
      { q: "Does it cost anything to list a vehicle for sale?", a: MARKETPLACE.sellerCta.sub },
    ]),
  });

  return (
    <main className="bg-[#F9F8F6]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={MARKETPLACE.hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/95 via-[#0A130F]/70 to-[#0A130F]/25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{MARKETPLACE.hero.eyebrow}</p>
          <h1 className="text-[30px] sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.06] text-balance">
            {MARKETPLACE.hero.heading}
          </h1>
          <p className="text-white/75 mt-4 text-[15.5px] sm:text-[17px] max-w-2xl leading-relaxed">{MARKETPLACE.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => document.getElementById("marketplace-results")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="mp-hero-browse"
              className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0E1A14] font-semibold h-11 px-6">
              {MARKETPLACE.hero.primaryCta} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => navigate("/sell-your-car")} data-testid="mp-hero-sell" variant="outline"
              className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white h-11 px-6">
              {MARKETPLACE.hero.secondaryCta}
            </Button>
          </div>
          {demand && demand.total > 0 && (
            <p className="text-white/55 text-[13px] mt-6" data-testid="mp-demand">
              {demand.buyers} looking to buy and {demand.sellers} looking to sell have registered so far.
            </p>
          )}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MARKETPLACE.valueProps.map((p, i) => {
            const Icon = ICONS[p.icon] || ShieldCheck;
            return (
              <motion.div key={p.t} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[24px] ring-1 ring-slate-200/70 p-6 shadow-sm">
                <div className="w-11 h-11 rounded-2xl bg-[#0B6B4F]/[0.08] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.7} />
                </div>
                <h3 className="font-heading font-bold text-[#1A2E25] mt-4 text-[17px]">{p.t}</h3>
                <p className="text-[14.5px] text-[#4A564F] mt-2 leading-relaxed">{p.d}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FILTERS + RESULTS */}
      <section id="marketplace-results" className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 scroll-mt-20">
        <div className="bg-white rounded-2xl p-4 ring-1 ring-slate-200/70">
          <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold text-sm mb-3">
            <SlidersHorizontal className="w-4 h-4" /> {MARKETPLACE.filters.heading}
          </div>
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-[#7A857F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()} data-testid="mp-search"
              aria-label="Search by make, model or registration"
              placeholder="Search by make, model or registration, for example Prius"
              className="h-12 pl-11 bg-[#F6F5F2] border-transparent rounded-xl text-[15px] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B6B4F]/25" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label={MARKETPLACE.filters.city}>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger data-testid="mp-city" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#0B6B4F]">Most popular</SelectLabel>
                    {POPULAR_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectGroup>
                  <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#9AA39D]">More cities</SelectLabel>
                    {MORE_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field label={MARKETPLACE.filters.type}>
              <Select value={vtype} onValueChange={setVtype}>
                <SelectTrigger data-testid="mp-type" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{BODY_TYPES.map((t) => <SelectItem key={t} value={t}>{t === "any" ? "Any body type" : typeLabel(t)}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label={MARKETPLACE.filters.fuel}>
              <Select value={fuel} onValueChange={setFuel}>
                <SelectTrigger data-testid="mp-fuel" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{FUELS.map((x) => <SelectItem key={x} value={x} className="capitalize">{x === "any" ? "Any fuel" : x}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label={MARKETPLACE.filters.seller}>
              <Select value={seller} onValueChange={setSeller}>
                <SelectTrigger data-testid="mp-seller" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{SELLER_TYPES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label={MARKETPLACE.filters.pco}>
              <Select value={pco} onValueChange={setPco}>
                <SelectTrigger data-testid="mp-pco" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{PCO_MINIMUMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label={`${MARKETPLACE.filters.price}: ${budgetLabel(range)}`}>
              <div className="h-11 flex items-center px-1">
                <Slider min={0} max={MAX_PRICE} step={500} value={range} onValueChange={setRange} data-testid="mp-price" minStepsBetweenThumbs={1} />
              </div>
            </Field>
          </div>
          <Button onClick={apply} data-testid="mp-apply" className="mt-4 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">
            <Search className="w-4 h-4 mr-2" /> {MARKETPLACE.filters.apply}
          </Button>
        </div>

        {chips.length > 0 && (
          <div className="flex items-center gap-2 mt-5 flex-wrap" data-testid="mp-chips">
            {chips.map((c) => (
              <button key={c.label} onClick={() => { c.clear(); }} data-testid={`mp-chip-${c.label}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-slate-200 px-3.5 py-2.5 min-h-[40px] text-[13px] text-[#1A2E25] capitalize hover:ring-[#0B6B4F] transition-colors">
                {c.label} <X className="w-3.5 h-3.5 text-[#7A857F]" />
              </button>
            ))}
            <button onClick={clearAll} data-testid="mp-clear-all"
              className="text-[13px] text-[#0B6B4F] font-medium underline underline-offset-4 ml-1 min-h-[40px] px-1">
              Clear all
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 mb-6 flex-wrap gap-3">
          <p className="text-[#4A564F]" data-testid="mp-count">
            {rows == null ? "Searching…" : `${rows.length} vehicle${rows.length === 1 ? "" : "s"} for sale in ${city}`}
          </p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-56 bg-white" data-testid="mp-sort"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(MARKETPLACE.filters.sort).map(([k, label]) => (
                <SelectItem key={k} value={k}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {rows == null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={`sk-${i}`} className="h-80 rounded-2xl bg-white ring-1 ring-slate-200/70 animate-pulse" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-[22px] ring-1 ring-slate-200 p-10 text-center" data-testid="mp-empty">
            <h3 className="text-xl font-heading font-bold text-[#1A2E25]">{MARKETPLACE.empty.heading}</h3>
            <p className="text-[#4A564F] mt-2 text-[15px] max-w-md mx-auto">{MARKETPLACE.empty.sub}</p>
            <Button onClick={scrollToAlert} className="mt-6 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">
              {MARKETPLACE.empty.cta}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((v, i) => (
              <div key={v.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <SaleCard v={v} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PCO EXPLAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#12211B] rounded-[26px] p-8 sm:p-12 text-white">
          <div className="flex items-start gap-4 max-w-3xl">
            <Info className="w-6 h-6 text-[#5FD3A6] shrink-0 mt-1" strokeWidth={1.7} />
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-balance">{MARKETPLACE.pcoNote.heading}</h2>
              <p className="text-white/70 mt-3 text-[16px] leading-relaxed">{MARKETPLACE.pcoNote.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BUYER ALERT */}
      <section id="buyer-alert" className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 scroll-mt-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{MARKETPLACE.sellerCta.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">
              {MARKETPLACE.buyerCta.heading}
            </h2>
            <p className="text-[#4A564F] mt-3 text-[16px] leading-relaxed">{MARKETPLACE.buyerCta.sub}</p>
            <div className="mt-8 rounded-[24px] bg-white ring-1 ring-slate-200/70 p-6">
              <h3 className="font-heading font-bold text-[#1A2E25] text-[18px]">{MARKETPLACE.sellerCta.heading}</h3>
              <p className="text-[14.5px] text-[#4A564F] mt-2 leading-relaxed">{MARKETPLACE.sellerCta.sub}</p>
              <Button onClick={() => navigate("/sell-your-car")} data-testid="mp-sell-cta"
                className="mt-4 rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white">
                {MARKETPLACE.sellerCta.cta} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-[28px] ring-1 ring-slate-200 p-6 sm:p-8 shadow-xl">
            <MarketplaceInterestForm defaultIntent="buy" city={city} />
          </div>
        </div>
      </section>
    </main>
  );
}

const Field = ({ label, children }) => (
  <div><label className="text-[12.5px] font-medium text-[#4A564F] mb-1.5 block truncate">{label}</label>{children}</div>
);
