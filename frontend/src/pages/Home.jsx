import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Zap, Accessibility, Sparkles, Coins, Check } from "lucide-react";
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

  // Ordered by weekly rent so the cheapest way in leads, which is what a
  // driver comparing options actually cares about.
  const byValue = [...all].sort((a, b) => a.weekly_rent - b.weekly_rent);
  const featured = byValue[0];
  const spotlight = byValue.slice(1, 4);
  const earn = estimateOperatorAnnual("6-15");

  // The first stat reflects live inventory; the rest are fixed in the copy file.
  const stats = HOME.stats.map((s, i) => ({
    n: i === 0 ? (all.length ? `${all.length}` : s.fallback) : s.value,
    l: s.label,
  }));

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.londonNight} alt="London at night" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/68" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/90 via-[#0A130F]/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-16 sm:pb-16">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[12px] sm:text-[13px] font-medium text-[#5FD3A6] tracking-wide">
            {HOME.hero.eyebrow}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-3 text-[30px] leading-[1.05] sm:text-5xl lg:text-[64px] font-heading font-extrabold text-white tracking-tight max-w-4xl text-balance drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {HOME.hero.heading}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="hidden sm:block mt-4 text-lg text-white/80 max-w-xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {HOME.hero.sub}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="mt-5 sm:mt-8 bg-white rounded-[26px] p-4 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Filter label={HOME.hero.filters.city}>
                <Select value={city} onValueChange={setCity}><SelectTrigger data-testid="filter-borough" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#0B6B4F]">Most popular</SelectLabel>
                      {POPULAR_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectGroup>
                    <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#9AA39D]">More cities</SelectLabel>
                      {MORE_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent></Select>
              </Filter>
              <Filter label={HOME.hero.filters.type}>
                <Select value={vtype} onValueChange={setVtype}><SelectTrigger data-testid="filter-type" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["any", "saloon", "executive", "mpv", "estate", "wav"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t === "any" ? "Any type" : t.toUpperCase()}</SelectItem>)}</SelectContent></Select>
              </Filter>
              <Filter label={HOME.hero.filters.fuel}>
                <Select value={fuel} onValueChange={setFuel}><SelectTrigger data-testid="filter-fuel" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["any", "hybrid", "electric", "petrol", "diesel"].map((f) => <SelectItem key={f} value={f} className="capitalize">{f === "any" ? "Any fuel" : f}</SelectItem>)}</SelectContent></Select>
              </Filter>
              <Filter label={`${HOME.hero.filters.budget}: £${range[0]} to £${range[1] >= 400 ? "400+" : range[1]}`}>
                <div className="h-11 flex items-center px-1"><Slider min={0} max={400} step={5} value={range} onValueChange={setRange} data-testid="filter-budget" minStepsBetweenThumbs={1} /></div>
              </Filter>
            </div>
            <Button onClick={goSearch} data-testid="search-btn" className="w-full mt-4 h-12 rounded-2xl bg-[#0B6B4F] hover:bg-[#095B43] text-white text-base font-semibold">
              <Search className="w-5 h-5 mr-2" /> {HOME.hero.searchCta}
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 mt-7 sm:mt-9">
            {stats.map((s) => (
              <div key={s.l} className="border-l border-white/20 pl-4">
                <div className="text-2xl sm:text-[28px] font-heading font-extrabold text-white leading-none">{s.n}</div>
                <div className="text-[12.5px] text-white/60 mt-2 leading-snug">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PreviewNotice />

      {/* SPOTLIGHT */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{HOME.spotlight.eyebrow}</p>
          <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2">{HOME.spotlight.heading}</h2>
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              onClick={() => navigate(`/vehicle/${featured.id}`)}
              className="group relative rounded-[26px] overflow-hidden cursor-pointer min-h-[400px] flex flex-col justify-end" data-testid="spotlight-featured">
              <img src={featured.photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A130F]/92 via-[#0A130F]/25 to-transparent" />
              <div className="relative p-7 sm:p-9 text-white">
                <span className="text-[13px] text-white/80">{featured.borough}, {featured.city}</span>
                <h3 className="text-2xl sm:text-[32px] font-heading font-bold mt-2">{featured.make} {featured.model} {featured.year}</h3>
                <p className="text-white/70 mt-1 capitalize">{featured.fuel} · {featured.seats} seats · {featured.borough}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-[30px] font-heading font-extrabold">£{featured.weekly_rent}<span className="text-base font-normal text-white/70"> a week</span></span>
                  <span className="inline-flex items-center gap-1 text-sm text-white group-hover:gap-2 transition-all">{HOME.spotlight.featuredCta} <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </motion.div>
            <div className="grid gap-4">
              {spotlight.map((v) => (
                <div key={v.id} onClick={() => navigate(`/vehicle/${v.id}`)}
                  className="group flex gap-4 bg-white rounded-2xl p-3 cursor-pointer ring-1 ring-slate-200/70 hover:ring-slate-300 hover:shadow-md transition-all">
                  <div className="w-32 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-[#EFEDE8]">
                    <img src={v.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 py-1.5">
                    <h3 className="font-heading font-bold text-[#1A2E25] mt-0.5 truncate">{v.make} {v.model} {v.year}</h3>
                    <p className="text-[12.5px] text-[#7A857F] capitalize">{v.fuel} · {v.seats} seats · {v.borough}</p>
                                        <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-heading font-extrabold text-[#1A2E25]">£{v.weekly_rent}<span className="text-xs font-normal text-[#7A857F]"> pw</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8"><Button onClick={() => navigate("/search")} variant="outline" className="rounded-full">{HOME.spotlight.allCta} <ArrowRight className="w-4 h-4 ml-2" /></Button></div>
        </section>
      )}

      {/* COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25] mb-7">{HOME.collections.heading}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {HOME.collections.items.map((c, i) => {
            const Icon = ICONS[c.icon] || Zap;
            return (
              <motion.button key={c.key} onClick={() => navigate(`/search?${c.q}`)} data-testid={`collection-${c.key}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left">
                <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A130F]/92 via-[#0A130F]/30 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-5 text-white">
                  <Icon className="w-6 h-6 text-[#5FD3A6] mb-2" />
                  <h3 className="font-heading font-bold text-[17px] leading-tight">{c.label}</h3>
                  <p className="text-[12.5px] text-white/70 mt-1">{c.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* MARKETPLACE TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="relative rounded-[26px] overflow-hidden" data-testid="home-marketplace-teaser">
          <img src={IMG.rowCars} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/96 via-[#0A130F]/86 to-[#0A130F]/55" />
          <div className="relative p-8 sm:p-14 grid lg:grid-cols-[1.2fr,1fr] gap-8 items-center text-white">
            <div className="[text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
              <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{HOME.marketplaceTeaser.eyebrow}</p>
              <h2 className="text-[26px] sm:text-4xl font-heading font-bold mt-3 text-balance">{HOME.marketplaceTeaser.heading}</h2>
              <p className="text-white/75 mt-4 leading-relaxed text-[17px] max-w-xl">{HOME.marketplaceTeaser.sub}</p>
              <div className="flex gap-3 mt-7 flex-wrap">
                <Button onClick={() => navigate("/marketplace")} data-testid="home-marketplace-cta"
                  className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0A130F] font-semibold">
                  {HOME.marketplaceTeaser.primaryCta} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => navigate("/sell-your-car")} variant="outline"
                  className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">
                  {HOME.marketplaceTeaser.secondaryCta}
                </Button>
              </div>
            </div>
            <ul className="space-y-3">
              {HOME.marketplaceTeaser.points.map((p) => (
                <li key={p} className="flex gap-3 items-start rounded-2xl bg-white/[0.07] ring-1 ring-white/10 p-4">
                  <span className="w-5 h-5 rounded-full bg-[#5FD3A6] text-[#0A130F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span className="text-[14.5px] text-white/85 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{HOME.cities.eyebrow}</p>
        <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 mb-7">{HOME.cities.heading}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {LIVE_CITIES.map((c, i) => {
            const n = all.filter((v) => v.city === c).length;
            return (
              <motion.button key={c} onClick={() => navigate(`/city/${c}`)} data-testid={`home-city-${c}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left">
                <img src={CITY_IMAGES[c]} alt={`${c} skyline`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A130F]/92 via-[#0A130F]/25 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-4 text-white">
                  <h3 className="font-heading font-bold text-[18px] leading-tight">{c}</h3>
                  <p className="text-[12.5px] text-white/75 mt-0.5">{all.length ? `${n} car${n !== 1 ? "s" : ""}` : "View cars"}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{HOME.howItWorks.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">{HOME.howItWorks.heading}</h2>
            <p className="text-[#4A564F] mt-4 leading-relaxed text-[17px]">{HOME.howItWorks.sub}</p>
            <div className="mt-7 space-y-6">
              {HOME.howItWorks.steps.map((s) => (
                <div key={s.n} className="flex gap-5">
                  <div className="text-[34px] font-heading font-extrabold text-[#D6D2C8] leading-none w-8">{s.n}</div>
                  <div><h3 className="font-heading font-bold text-[#1A2E25] text-lg">{s.t}</h3><p className="text-[15px] text-[#4A564F] mt-1">{s.d}</p></div>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate("/driver-guide")} className="mt-8 rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white">{HOME.howItWorks.cta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <img src={IMG.phoneInCar} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64 sm:mt-8" />
            <img src={IMG.driverMirror} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64" />
            <img src={IMG.keysHandover} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64" />
            <img src={IMG.interior} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64 sm:-mt-8" />
          </div>
        </div>
      </section>

      {/* OPERATOR CTA with earnings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="relative rounded-[26px] overflow-hidden">
          <img src={IMG.showroom} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/97 via-[#0A130F]/90 to-[#0A130F]/70" />
          <div className="relative p-8 sm:p-16 grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
              <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{HOME.operatorCta.eyebrow}</p>
              <h2 className="text-[26px] sm:text-4xl font-heading font-bold mt-3 text-balance">{HOME.operatorCta.heading}</h2>
              <p className="text-white/75 mt-4 leading-relaxed text-[17px]">{HOME.operatorCta.sub}</p>
              <div className="flex gap-3 mt-7 flex-wrap">
                <Button onClick={() => navigate("/list-your-fleet")} data-testid="list-fleet-cta" className="rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">{HOME.operatorCta.primaryCta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
                <Button onClick={() => navigate("/operator-guide")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">{HOME.operatorCta.secondaryCta}</Button>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-7 shadow-xl">
              <div className="text-[12px] text-[#7A857F] uppercase tracking-wide font-semibold">{HOME.operatorCta.card.label}</div>
              <div className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0B6B4F] mt-2">£{earn.perCarYear.toLocaleString()}<span className="text-lg text-[#7A857F] font-normal"> / year</span></div>
              <div className="text-[#4A564F] text-[14px] mt-1">{HOME.operatorCta.card.note}</div>
              <div className="h-px bg-slate-200 my-5" />
              <div className="space-y-2.5 text-[14px]">
                {HOME.operatorCta.card.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[#4A564F]">{label}</span>
                    <span className={`font-heading font-bold ${value === null ? "text-[#1A2E25]" : label.includes("defaults") ? "text-[#0B6B4F]" : "text-[#1A2E25]"}`}>
                      {value === null ? `£${(earn.perCarYear * 10).toLocaleString()}/yr` : value}
                    </span>
                  </div>
                ))}
              </div>
              <Button onClick={() => navigate("/list-your-fleet")} className="w-full mt-6 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold">{HOME.operatorCta.card.cta}</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const Filter = ({ label, children }) => (
  <div><label className="text-[12.5px] font-medium text-[#4A564F] mb-1.5 block truncate">{label}</label>{children}</div>
);
