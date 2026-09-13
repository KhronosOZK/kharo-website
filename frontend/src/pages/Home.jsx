import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Zap, Accessibility, Sparkles, Coins } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { IMG } from "@/lib/images";
import { HOME, BRAND } from "@/content/site";
import { useSeo } from "@/lib/seo";
import { estimateOperatorAnnual } from "@/lib/pricing";
import { POPULAR_CITIES, MORE_CITIES, LIVE_CITIES, CITY_IMAGES } from "@/lib/cities";
import { Button } from "@/components/ui/button";
import PreviewNotice from "@/components/PreviewNotice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const ICONS = { Zap, Accessibility, Sparkles, Coins };

export default function Home() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [city, setCity] = useState("London");
  const [vtype, setVtype] = useState("any");
  const [fuel, setFuel] = useState("any");
  const [range, setRange] = useState([0, 400]);

  useEffect(() => { api.get("/listings").then((r) => setAll(r.data)); }, []);

  useSeo({ title: `Kharo · ${BRAND.tagline}`, description: HOME.hero.sub });

  const goSearch = () => {
    const p = new URLSearchParams();
    p.set("city", city);
    if (vtype !== "any") p.set("type", vtype);
    if (fuel !== "any") p.set("fuel", fuel);
    p.set("min", range[0]); p.set("max", range[1]);
    trackEvent("search", { city, vtype, fuel, range });
    navigate(`/search?${p.toString()}`);
  };

  const byValue = [...all].sort((a, b) => a.weekly_rent - b.weekly_rent);
  const featured = byValue[0];
  const spotlight = byValue.slice(1, 4);
  const earn = estimateOperatorAnnual("6-15");

  const stats = HOME.stats.map((s, i) => ({
    n: i === 0 ? (all.length ? `${all.length}` : s.fallback) : s.value,
    l: s.label,
  }));

  return (
    <main>
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center">
        <div className="absolute inset-0">
          <img src={IMG.londonNight} alt="London at night" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/72" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/95 via-[#0A130F]/55 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#5FD3A6] tracking-[0.1em] uppercase"
          >
            <span className="w-5 h-px bg-[#5FD3A6]" />
            {HOME.hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-5 text-[38px] leading-[1.0] sm:text-6xl lg:text-[76px] font-heading font-extrabold text-white tracking-tight max-w-3xl"
          >
            {HOME.hero.heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="hidden sm:block mt-5 text-[17px] text-white/70 max-w-lg leading-relaxed"
          >
            {HOME.hero.sub}
          </motion.p>

          {/* Search panel — flat dark glass instead of bright white card */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 sm:mt-10 bg-white/[0.06] backdrop-blur-md border border-white/12 rounded-2xl p-5 sm:p-6 max-w-3xl"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <FilterDark label={HOME.hero.filters.city}>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger data-testid="filter-borough" className="h-11 bg-white/10 border-white/20 text-white hover:bg-white/15 focus:ring-[#5FD3A6]/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-[11px] uppercase tracking-wide text-[#0B6B4F]">Most popular</SelectLabel>
                      {POPULAR_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-[11px] uppercase tracking-wide text-[#9AA39D]">More cities</SelectLabel>
                      {MORE_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FilterDark>

              <FilterDark label={HOME.hero.filters.type}>
                <Select value={vtype} onValueChange={setVtype}>
                  <SelectTrigger data-testid="filter-type" className="h-11 bg-white/10 border-white/20 text-white hover:bg-white/15 focus:ring-[#5FD3A6]/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["any", "saloon", "executive", "mpv", "estate", "wav"].map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">{t === "any" ? "Any type" : t.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterDark>

              <FilterDark label={HOME.hero.filters.fuel}>
                <Select value={fuel} onValueChange={setFuel}>
                  <SelectTrigger data-testid="filter-fuel" className="h-11 bg-white/10 border-white/20 text-white hover:bg-white/15 focus:ring-[#5FD3A6]/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["any", "hybrid", "electric", "petrol", "diesel"].map((f) => (
                      <SelectItem key={f} value={f} className="capitalize">{f === "any" ? "Any fuel" : f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterDark>

              <FilterDark label={`${HOME.hero.filters.budget}: £${range[0]}–£${range[1] >= 400 ? "400+" : range[1]}`}>
                <div className="h-11 flex items-center px-1">
                  <Slider min={0} max={400} step={5} value={range} onValueChange={setRange}
                    data-testid="filter-budget" minStepsBetweenThumbs={1}
                    className="[&_[role=slider]]:bg-[#5FD3A6] [&_[role=slider]]:border-[#5FD3A6]" />
                </div>
              </FilterDark>
            </div>

            <Button
              onClick={goSearch}
              data-testid="search-btn"
              className="w-full mt-4 h-12 rounded-xl bg-[#5FD3A6] hover:bg-[#4bbf94] text-[#0A130F] text-[15px] font-bold tracking-tight transition-all duration-200 hover:shadow-[0_0_24px_rgba(95,211,166,0.35)]"
            >
              <Search className="w-4 h-4 mr-2" /> {HOME.hero.searchCta}
            </Button>
          </motion.div>

          {/* Stats — one dominant, three subordinate */}
          <div className="mt-12 sm:mt-14 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((s, i) => (
              <div key={s.l} className={i === 0 ? "flex flex-col" : "flex flex-col border-l border-white/15 pl-6"}>
                <span className={`font-heading font-extrabold text-white leading-none ${i === 0 ? "text-[44px] sm:text-[52px]" : "text-[22px] sm:text-[26px]"}`}>
                  {s.n}
                </span>
                <span className={`text-white/50 mt-1.5 leading-snug ${i === 0 ? "text-[13px]" : "text-[12px]"}`}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PreviewNotice />

      {/* ─── SPOTLIGHT ─────────────────────────────────────────────── */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[12px] font-semibold text-[#0B6B4F] tracking-[0.08em] uppercase">{HOME.spotlight.eyebrow}</p>
              <h2 className="text-[28px] sm:text-[38px] font-heading font-bold text-[#1A2E25] mt-2 leading-tight">{HOME.spotlight.heading}</h2>
            </div>
            <Button onClick={() => navigate("/search")} variant="ghost"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#0B6B4F] hover:text-[#095B43] text-sm font-medium shrink-0">
              {HOME.spotlight.allCta} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-[3fr_2fr] gap-5">
            {/* Featured large card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/vehicle/${featured.id}`)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer min-h-[420px] sm:min-h-[480px] flex flex-col justify-end"
              data-testid="spotlight-featured"
            >
              <img src={featured.photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A130F]/95 via-[#0A130F]/30 to-transparent" />
              <div className="relative p-7 sm:p-9 text-white">
                <p className="text-[12px] text-white/60 uppercase tracking-wide font-medium">{featured.borough}, {featured.city}</p>
                <h3 className="text-[26px] sm:text-[34px] font-heading font-bold mt-1.5 leading-tight">
                  {featured.make} {featured.model} <span className="text-white/50 font-medium">{featured.year}</span>
                </h3>
                <p className="text-white/55 mt-1 capitalize text-[14px]">{featured.fuel} · {featured.seats} seats</p>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-[32px] font-heading font-extrabold">
                    £{featured.weekly_rent}
                    <span className="text-[16px] font-normal text-white/55"> / week</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-[#5FD3A6] font-medium group-hover:gap-2.5 transition-all duration-200">
                    {HOME.spotlight.featuredCta} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Sidebar stack */}
            <div className="flex flex-col gap-4">
              {spotlight.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => navigate(`/vehicle/${v.id}`)}
                  className="group flex gap-4 bg-white rounded-2xl p-3.5 cursor-pointer border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-28 sm:w-36 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-[#EFEDE8]">
                    <img src={v.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-heading font-bold text-[#1A2E25] text-[15px] truncate leading-snug">{v.make} {v.model}</h3>
                    <p className="text-[12px] text-[#7A857F] mt-0.5 capitalize">{v.year} · {v.fuel} · {v.seats} seats</p>
                    <p className="text-[11.5px] text-[#9AA39D] mt-0.5">{v.borough}</p>
                    <div className="mt-2.5">
                      <span className="text-[18px] font-heading font-extrabold text-[#1A2E25]">
                        £{v.weekly_rent}<span className="text-[12px] font-normal text-[#7A857F]"> pw</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Mobile see all */}
              <Button onClick={() => navigate("/search")} variant="outline" className="mt-1 rounded-full sm:hidden">
                {HOME.spotlight.allCta} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ─── COLLECTIONS ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-7">
          <h2 className="text-[26px] sm:text-[34px] font-heading font-bold text-[#1A2E25]">{HOME.collections.heading}</h2>
        </div>

        {/* Asymmetric grid: first card spans 2 rows */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: "1fr" }}>
          {HOME.collections.items.map((c, i) => {
            const Icon = ICONS[c.icon] || Zap;
            const isHero = i === 0;
            return (
              <motion.button
                key={c.key}
                onClick={() => navigate(`/search?${c.q}`)}
                data-testid={`collection-${c.key}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`group relative rounded-2xl overflow-hidden text-left ${
                  isHero
                    ? "lg:row-span-2 aspect-[4/5] lg:aspect-auto"
                    : "aspect-[4/3] sm:aspect-[4/3.5]"
                }`}
              >
                <img
                  src={c.img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isHero ? "from-[#0A130F]/94 via-[#0A130F]/35" : "from-[#0A130F]/90 via-[#0A130F]/25"} to-transparent`} />
                <div className="relative h-full flex flex-col justify-end p-5">
                  <Icon className={`text-[#5FD3A6] mb-2 ${isHero ? "w-7 h-7" : "w-5 h-5"}`} aria-hidden="true" />
                  <h3 className={`font-heading font-bold text-white leading-tight ${isHero ? "text-[20px] sm:text-[22px]" : "text-[16px]"}`}>{c.label}</h3>
                  <p className={`text-white/65 mt-1 ${isHero ? "text-[13px]" : "text-[12px]"}`}>{c.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ─── CITIES ────────────────────────────────────────────────── */}
      <section className="bg-[#F1EFE9] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[12px] font-semibold text-[#0B6B4F] tracking-[0.08em] uppercase mb-2">{HOME.cities.eyebrow}</p>
              <h2 className="text-[26px] sm:text-[34px] font-heading font-bold text-[#1A2E25]">{HOME.cities.heading}</h2>
            </div>
          </div>

          {/* Landscape cards — clearly distinct from the portrait Collections above */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_CITIES.map((c, i) => {
              const n = all.filter((v) => v.city === c).length;
              const isFirst = i === 0;
              return (
                <motion.button
                  key={c}
                  onClick={() => navigate(`/city/${c}`)}
                  data-testid={`home-city-${c}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative rounded-2xl overflow-hidden text-left cursor-pointer ${
                    isFirst ? "sm:col-span-2 aspect-[16/7]" : "aspect-[16/9]"
                  }`}
                >
                  <img
                    src={CITY_IMAGES[c]}
                    alt={`${c} skyline`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/80 via-[#0A130F]/30 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6">
                    <h3 className={`font-heading font-bold text-white leading-tight ${isFirst ? "text-[28px] sm:text-[34px]" : "text-[20px]"}`}>{c}</h3>
                    <p className="text-[12.5px] text-white/65 mt-1">
                      {all.length ? `${n} car${n !== 1 ? "s" : ""} available` : "View cars"}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-[12px] font-semibold text-[#0B6B4F] tracking-[0.08em] uppercase mb-4">{HOME.howItWorks.eyebrow}</p>
            <h2 className="text-[32px] sm:text-[42px] font-heading font-bold text-[#1A2E25] leading-tight text-balance">
              {HOME.howItWorks.heading}
            </h2>
            <p className="text-[#4A564F] mt-5 leading-relaxed text-[16px] max-w-md">{HOME.howItWorks.sub}</p>

            <div className="mt-10 space-y-0">
              {HOME.howItWorks.steps.map((s, i) => (
                <div key={s.n} className="flex gap-5 relative">
                  {/* Step number — small badge, not a giant grey number */}
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div className="w-8 h-8 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center text-[13px] font-bold font-heading z-10">
                      {s.n}
                    </div>
                    {i < HOME.howItWorks.steps.length - 1 && (
                      <div className="w-px flex-1 bg-[#0B6B4F]/15 my-2" />
                    )}
                  </div>
                  <div className={`pb-8 ${i === HOME.howItWorks.steps.length - 1 ? "pb-0" : ""}`}>
                    <h3 className="font-heading font-bold text-[#1A2E25] text-[17px] mt-0.5">{s.t}</h3>
                    <p className="text-[15px] text-[#4A564F] mt-1.5 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate("/driver-guide")}
              className="mt-8 rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white px-6 transition-all duration-200"
            >
              {HOME.howItWorks.cta} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Photo mosaic — staggered, not a flat 2x2 */}
          <div className="relative hidden lg:grid grid-cols-2 gap-3.5" style={{ gridTemplateRows: "auto auto" }}>
            <img src={IMG.phoneInCar} alt="" className="rounded-2xl object-cover w-full h-52 mt-10" />
            <img src={IMG.driverMirror} alt="" className="rounded-2xl object-cover w-full h-52" />
            <img src={IMG.keysHandover} alt="" className="rounded-2xl object-cover w-full h-52" />
            <img src={IMG.interior} alt="" className="rounded-2xl object-cover w-full h-52 -mt-10" />
          </div>
        </div>
      </section>

      {/* ─── OPERATOR CTA ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative rounded-3xl overflow-hidden">
          <img src={IMG.showroom} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/97 via-[#0A130F]/88 to-[#0A130F]/50" />

          <div className="relative p-8 sm:p-14 lg:p-16 grid lg:grid-cols-[1fr_360px] gap-10 items-center">
            <div className="text-white">
              <p className="text-[12px] font-semibold text-[#5FD3A6] tracking-[0.08em] uppercase mb-4">{HOME.operatorCta.eyebrow}</p>
              <h2 className="text-[28px] sm:text-[40px] lg:text-[46px] font-heading font-bold leading-tight text-balance">
                {HOME.operatorCta.heading}
              </h2>
              <p className="text-white/65 mt-5 leading-relaxed text-[16px] max-w-lg">{HOME.operatorCta.sub}</p>
              <div className="flex gap-3 mt-8 flex-wrap">
                <Button
                  onClick={() => navigate("/list-your-fleet")}
                  data-testid="list-fleet-cta"
                  className="rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold px-6 transition-all duration-200"
                >
                  {HOME.operatorCta.primaryCta} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate("/operator-guide")}
                  variant="outline"
                  className="rounded-full border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white px-6"
                >
                  {HOME.operatorCta.secondaryCta}
                </Button>
              </div>
            </div>

            {/* Earnings card — premium treatment with gold accent */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              {/* Gold header strip */}
              <div className="bg-[#C08A2D] px-7 py-4">
                <p className="text-[11px] font-bold text-[#7a5218] uppercase tracking-[0.1em]">{HOME.operatorCta.card.label}</p>
                <div className="text-[38px] sm:text-[44px] font-heading font-extrabold text-white leading-none mt-1">
                  £{earn.perCarYear.toLocaleString()}
                  <span className="text-[15px] font-normal text-white/70"> / year</span>
                </div>
                <p className="text-[13px] text-white/75 mt-1">{HOME.operatorCta.card.note}</p>
              </div>

              <div className="px-7 py-5">
                <div className="space-y-3 text-[14px]">
                  {HOME.operatorCta.card.rows.map(([label, value]) => (
                    <div key={label} className="flex justify-between items-baseline">
                      <span className="text-[#4A564F]">{label}</span>
                      <span className="font-heading font-bold text-[#1A2E25]">
                        {value === null ? `£${(earn.perCarYear * 10).toLocaleString()}/yr` : value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-slate-100 my-5" />
                <Button
                  onClick={() => navigate("/list-your-fleet")}
                  className="w-full rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white font-semibold transition-all duration-200"
                >
                  {HOME.operatorCta.card.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Filter label wrapper for the dark hero search panel
const FilterDark = ({ label, children }) => (
  <div>
    <label className="text-[11.5px] font-medium text-white/55 mb-1.5 block truncate">{label}</label>
    {children}
  </div>
);
