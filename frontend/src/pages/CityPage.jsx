import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Car, Building2, PoundSterling, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { LIVE_CITIES, CITY_IMAGES } from "@/lib/cities";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import PreviewNotice from "@/components/PreviewNotice";
import { CITY_PAGE } from "@/content/site";
import { useSeo, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const CITY_SEO = CITY_PAGE.cities;

// Fills {placeholders} in the copy file with live numbers.
const t = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => vars[k]);

export default function CityPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const city = LIVE_CITIES.find((c) => c.toLowerCase() === (name || "").toLowerCase()) || name;
  const isLive = LIVE_CITIES.includes(city);
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get(`/listings?city=${encodeURIComponent(city)}`).then((r) => setItems(r.data)).catch(() => setItems([]));
  }, [city]);

  const list = items || [];
  const count = list.length;
  const operators = new Set(list.map((v) => v.operator_code)).size;
  const boroughs = new Set(list.map((v) => v.borough)).size;
  const fromRent = count ? Math.min(...list.map((v) => v.weekly_rent)) : 0;
  const greenCount = list.filter((v) => v.fuel === "electric" || v.fuel === "hybrid").length;

  const stats = [
    { icon: Car, n: count, l: CITY_PAGE.stats.cars },
    { icon: Building2, n: operators, l: CITY_PAGE.stats.operators },
    { icon: MapPin, n: boroughs, l: CITY_PAGE.stats.areas },
    { icon: PoundSterling, n: `£${fromRent}`, l: CITY_PAGE.stats.from },
  ];

  const seoFaqs = CITY_SEO[city]?.faq || [];
  useSeo({
    title: `Private hire cars to rent in ${city} · Kharo`,
    description: CITY_SEO[city]?.intro,
    jsonLd: seoFaqs.length
      ? [faqJsonLd(seoFaqs), breadcrumbJsonLd([{ name: "Home", to: "/" }, { name: city, to: `/city/${city}` }])]
      : undefined,
  });

  if (!isLive) return <Navigate to="/" replace />;
  if (items === null)
    return <main className="max-w-7xl mx-auto px-4 py-24 text-[#7A857F]" data-testid="city-loading">Loading {city}…</main>;

  return (
    <main data-testid={`city-page-${city}`}>
      <PreviewNotice />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CITY_IMAGES[city]} alt={`${city} skyline`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/82" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F] via-[#0A130F]/70 to-[#0A130F]/35" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{CITY_PAGE.eyebrow}</p>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-[42px] leading-[1.02] sm:text-6xl lg:text-[72px] font-heading font-extrabold text-white tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {city}
          </motion.h1>
          <p className="mt-4 text-[17px] sm:text-xl text-white/85 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {t(CITY_PAGE.heroSubTemplate, { count, city, operators })}
          </p>
          <div className="flex gap-3 mt-8 flex-wrap">
            <Button onClick={() => navigate(`/search?city=${encodeURIComponent(city)}`)} data-testid="city-see-all"
              className="rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">
              {t(CITY_PAGE.seeAllCta, { count })} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => navigate("/register")} variant="outline"
              className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">
              {CITY_PAGE.accountCta}
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.l} data-testid="city-stat" className="bg-white rounded-2xl p-5 ring-1 ring-slate-200/70 shadow-sm">
              <s.icon className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.6} />
              <div className="text-2xl sm:text-[28px] font-heading font-extrabold text-[#1A2E25] mt-3 leading-none">{s.n}</div>
              <div className="text-[12.5px] text-[#7A857F] mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <p className="text-[17px] text-[#3B4A44] leading-relaxed max-w-3xl" data-testid="city-intro">{CITY_SEO[city]?.intro}</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-7">
          <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25]">{t(CITY_PAGE.listingsHeading, { city })}</h2>
          <p className="text-[#7A857F] mt-1.5">
            {t(CITY_PAGE.greenNote, { green: greenCount })}
          </p>
        </div>
        {count === 0 ? (
          <div className="text-center py-20 text-[#7A857F] bg-white rounded-2xl ring-1 ring-slate-200">
            {t(CITY_PAGE.emptyNote, { city })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.slice(0, 9).map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        )}
        {count > 9 && (
          <div className="mt-8">
            <Button onClick={() => navigate(`/search?city=${encodeURIComponent(city)}`)} variant="outline" className="rounded-full">
              See all {count} cars in {city} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4" data-testid="city-faq">
        <h2 className="text-[24px] sm:text-3xl font-heading font-bold text-[#1A2E25] mb-6">{t(CITY_PAGE.faqHeading, { city })}</h2>
        <div className="divide-y divide-slate-200 rounded-2xl ring-1 ring-slate-200 bg-white">
          {(CITY_SEO[city]?.faq || []).map((item) => (
            <details key={item.q} data-testid="city-faq-item" className="group p-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-heading font-semibold text-[#1A2E25]">
                {item.q}
                <ChevronDown className="w-5 h-5 text-[#0B6B4F] shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="text-[15px] text-[#4A564F] mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" data-testid="city-marketplace">
        <div className="bg-[#F1EFE9] rounded-[26px] p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] text-balance">
              {t(CITY_PAGE.marketplaceHeading, { city })}
            </h2>
            <p className="text-[#4A564F] mt-2 text-[15px] max-w-xl">{CITY_PAGE.marketplaceSub}</p>
          </div>
          <Button onClick={() => navigate(`/marketplace?city=${encodeURIComponent(city)}`)} data-testid="city-marketplace-cta"
            className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold shrink-0">
            {CITY_PAGE.marketplaceCta} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h3 className="font-heading font-bold text-[#1A2E25] text-lg mb-4">{CITY_PAGE.otherCitiesHeading}</h3>
        <div className="flex flex-wrap gap-2.5">
          {LIVE_CITIES.filter((c) => c !== city).map((c) => (
            <Link key={c} to={`/city/${c}`} data-testid={`city-link-${c}`}
              className="px-4 py-2 rounded-full bg-white ring-1 ring-slate-200 text-[#1A2E25] text-sm font-medium hover:ring-[#0B6B4F] hover:text-[#0B6B4F] transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
