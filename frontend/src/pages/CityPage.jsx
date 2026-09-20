import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ALL_CITIES, LIVE_CITIES, CITY_IMAGES } from "@/lib/cities";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { IMG } from "@/lib/images";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import CityInterestForm from "@/components/CityInterestForm";
import Faq from "@/components/Faq";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { CITY_PAGE } from "@/content/site";
import { useSeo, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const CITY_SEO = CITY_PAGE.cities;

// Fills {placeholders} in the copy file with live numbers.
const t = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => vars[k]);

export default function CityPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const city = ALL_CITIES.find((c) => c.toLowerCase() === (name || "").toLowerCase()) || name;

  // Rental inventory is mock data (this is a pre-launch marketplace), same source as
  // Home and Search, so every page agrees on what cars exist in which city.
  const list = useMemo(() => MOCK_LISTINGS.filter((v) => v.city === city), [city]);
  const count = list.length;
  const boroughs = useMemo(() => new Set(list.map((v) => v.borough)).size, [list]);
  const fromRent = count ? Math.min(...list.map((v) => v.weekly_rent)) : 0;
  const greenCount = list.filter((v) => v.fuel === "Electric" || v.fuel === "Hybrid" || v.fuel === "Plug-in Hybrid").length;

  // Every city has a hero photo; the five we have real inventory for get their
  // own skyline, everywhere else falls back to a generic UK street of cars
  // rather than breaking the image.
  const heroImg = CITY_IMAGES[city] || IMG.rowCars;

  // Which council or authority licenses private hire here. Taken from the
  // listings themselves rather than a second table, so it can never disagree
  // with the cars on the page.
  const authority = list[0]?.licensing_authority || "";

  const seoFaqs = CITY_SEO[city]?.faq || [];
  useSeo({
    title: `Private hire cars to rent in ${city} · Kharo`,
    description: CITY_SEO[city]?.intro || t(CITY_PAGE.comingSoon.sub, { city }),
    jsonLd: seoFaqs.length
      ? [faqJsonLd(seoFaqs), breadcrumbJsonLd([{ name: "Home", to: "/" }, { name: city, to: `/city/${city}` }])]
      : undefined,
  });

  // Discovery happens by clicking, not by being pre-refused: every city in
  // ALL_CITIES resolves to this page. A city with no cars yet (whether or
  // not it is in LIVE_CITIES) gets the same composed state, never an error.
  if (count === 0) {
    return (
      <main data-testid={`city-page-${city}-coming-soon`}>
        <PageHero
          heading={t(CITY_PAGE.comingSoon.heading, { city })}
          sub={t(CITY_PAGE.comingSoon.sub, { city })}
          img={heroImg}
          priority
        >
          <div className="panel rounded-lg p-5 sm:p-6 text-ink max-w-xl">
            <CityInterestForm city={city} compact />
          </div>
        </PageHero>

        <RevealGroup as="section" className="wrap py-section">
          <RevealItem>
            <h3 className="text-h3 font-heading font-bold text-ink mb-4">{CITY_PAGE.comingSoon.liveHeading}</h3>
            <div className="flex flex-wrap gap-2.5">
              {LIVE_CITIES.filter((c) => c !== city).map((c) => (
                <Link
                  key={c}
                  to={`/city/${c}`}
                  data-testid={`city-link-${c}`}
                  className="pressable px-4 py-2 rounded-md bg-surface border border-line-strong text-ink text-[13.5px] font-medium hover:border-green hover:text-green"
                >
                  {c}
                </Link>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>
      </main>
    );
  }

  const figures = [
    { v: count, l: CITY_PAGE.stats.cars },
    { v: boroughs, l: CITY_PAGE.stats.areas },
    { v: `£${fromRent}`, l: CITY_PAGE.stats.from },
    { v: greenCount, l: CITY_PAGE.stats.green },
  ];

  return (
    <main data-testid={`city-page-${city}`}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <PageHero
        heading={t(CITY_PAGE.heroHeadingTemplate, { city })}
        sub={t(CITY_PAGE.heroSubTemplate, { count, city })}
        img={heroImg}
        imgAlt={`${city} skyline`}
        meta={authority ? [{ label: "Licensing authority", value: authority }] : []}
        priority
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate(`/search?city=${encodeURIComponent(city)}`)} data-testid="city-see-all">
            {t(CITY_PAGE.seeAllCta, { count })} <ArrowRight size={16} />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/register")}>{CITY_PAGE.accountCta}</Button>
        </div>
      </PageHero>

      {/* ── FIGURES: one hairline-divided row, no cards ─────────────────── */}
      <RevealGroup as="section" className="wrap">
        <RevealItem as="dl" className="figures">
          {figures.map((f) => (
            <div key={f.l} data-testid="city-stat">
              <dt className="text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-heading font-extrabold text-ink leading-none tabular">{f.v}</dt>
              <dd className="mt-2 text-[14px] text-ink-2 leading-snug max-w-[22ch]">{f.l}</dd>
            </div>
          ))}
        </RevealItem>
      </RevealGroup>

      {/* ── INTRO ─────────────────────────────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem>
          <p className="text-lead text-ink-2 measure" data-testid="city-intro">{CITY_SEO[city]?.intro}</p>
        </RevealItem>
      </RevealGroup>

      {/* ── LISTINGS ──────────────────────────────────────────────────── */}
      <RevealGroup as="section" className="wrap pb-section">
        <RevealItem className="mb-7">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{t(CITY_PAGE.listingsHeading, { city })}</h2>
          <p className="mt-1.5 text-[14.5px] text-ink-3">{t(CITY_PAGE.greenNote, { green: greenCount })}</p>
        </RevealItem>
        <RevealItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-9">
            {list.slice(0, 9).map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
          {count > 9 && (
            <div className="mt-8">
              <Button variant="outline" onClick={() => navigate(`/search?city=${encodeURIComponent(city)}`)}>
                {t(CITY_PAGE.seeAllCta, { count })} <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </RevealItem>
      </RevealGroup>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
          <RevealItem className="max-w-2xl mb-8">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{t(CITY_PAGE.faqHeading, { city })}</h2>
          </RevealItem>
          <RevealItem>
            <Faq items={CITY_SEO[city]?.faq || []} testId="city-faq" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── OTHER CITIES ──────────────────────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem>
          <h3 className="text-h3 font-heading font-bold text-ink mb-4">{CITY_PAGE.otherCitiesHeading}</h3>
          <div className="flex flex-wrap gap-2.5">
            {LIVE_CITIES.filter((c) => c !== city).map((c) => (
              <Link
                key={c}
                to={`/city/${c}`}
                data-testid={`city-link-${c}`}
                className="pressable px-4 py-2 rounded-md bg-surface border border-line-strong text-ink text-[13.5px] font-medium hover:border-green hover:text-green"
              >
                {c}
              </Link>
            ))}
          </div>
        </RevealItem>
      </RevealGroup>
    </main>
  );
}
