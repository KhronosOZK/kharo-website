import { useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";
import PreviewNotice from "@/components/PreviewNotice";
import DashboardSnapshot from "@/components/DashboardSnapshot";
import Faq from "@/components/Faq";
import HeroSearch from "@/components/HeroSearch";
import { RevealGroup, RevealItem, Enter } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { HOME } from "@/content/site";

export default function Home() {
  const navigate = useNavigate();
  useSeo({ title: HOME.seo.title, description: HOME.seo.description, canonical: "https://kharo.co.uk/" });

  const fleetRef = useRef(null);

  const listings = useMemo(() => MOCK_LISTINGS.slice(0, 6), []);

  // One tile per model, at its lowest listed weekly rent, straight from the
  // inventory so the carousel never shows a price the data does not contain.
  const fleetTiles = useMemo(() => {
    const seen = new Map();
    for (const v of MOCK_LISTINGS) {
      const key = `${v.make} ${v.model}`;
      const photo = Array.isArray(v.photos) ? v.photos[0] : v.photos;
      if (!photo) continue;
      const cur = seen.get(key);
      if (!cur || v.weekly_rent < cur.rent) seen.set(key, { id: v.id, label: key, rent: v.weekly_rent, city: v.city, src: photo });
    }
    return [...seen.values()].slice(0, 8);
  }, []);

  const scrollFleet = (dir) => {
    const el = fleetRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const { hero, work, fleet, featured, dashboard, paths, faq, closer } = HOME;

  return (
    <div className="bg-bone">
      {/* ── HERO: one photograph, one sentence, one action ─────────────── */}
      <section className="relative isolate text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img src={hero.img} alt={hero.imgAlt} className="absolute inset-0 h-full w-full object-cover object-[60%_center]" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/35 to-night/15" />
        </div>

        <div className="wrap relative flex flex-col justify-end min-h-[88svh] pt-[clamp(4rem,10vh,7rem)] pb-[clamp(2rem,6vh,4rem)]">
          <Enter as="h1" className="text-display font-heading font-extrabold max-w-[18ch]">
            {hero.heading}
          </Enter>
          <Enter as="p" delay={0.06} className="mt-5 text-lead text-white/80 max-w-[48ch]">
            {hero.sub}
          </Enter>

          <Enter delay={0.12} className="mt-9">
            <HeroSearch />
          </Enter>
        </div>
      </section>

      {/* ── THE WORK AROUND THE CAR: statement + hairline list ─────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-5">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{work.heading}</h2>
            <p className="mt-4 text-lead text-ink-2 measure-narrow">{work.sub}</p>
          </RevealItem>
          <RevealItem as="ul" className="lg:col-span-7 divide-y divide-line border-y border-line">
            {work.items.map((it) => (
              <li key={it.t} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 sm:gap-8 py-6">
                <h3 className="text-h3 font-heading font-bold text-ink">{it.t}</h3>
                <p className="text-[15.5px] text-ink-2 leading-relaxed">{it.d}</p>
              </li>
            ))}
          </RevealItem>
        </div>
      </RevealGroup>

      {/* ── FLEET: photography-led horizontal track ───────────────────── */}
      <RevealGroup as="section" className="wrap pb-section">
        <RevealItem className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{fleet.heading}</h2>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scrollFleet(-1)} aria-label="Scroll left" className="pressable grid place-items-center w-11 h-11 rounded-full border border-line-strong bg-surface text-ink-2 hover:bg-surface-2"><ChevronLeft size={18} strokeWidth={1.75} /></button>
            <button onClick={() => scrollFleet(1)} aria-label="Scroll right" className="pressable grid place-items-center w-11 h-11 rounded-full border border-line-strong bg-surface text-ink-2 hover:bg-surface-2"><ChevronRight size={18} strokeWidth={1.75} /></button>
            <Button variant="outline" onClick={() => navigate("/search")} className="ml-2">{fleet.cta} <ArrowRight size={16} /></Button>
          </div>
        </RevealItem>
        <RevealItem>
          <div ref={fleetRef} className="track gap-3 pb-2">
            {fleetTiles.map((tile) => (
              <Link key={tile.id} to={`/search?make=${encodeURIComponent(tile.label.split(" ")[0])}`}
                className="pressable-card zoom-media relative block w-[clamp(13rem,68vw,17.5rem)] aspect-[4/5] rounded-2xl overflow-hidden bg-surface-2 group">
                <img src={tile.src} alt={tile.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="block font-heading font-bold text-[17px] leading-tight">{tile.label}</span>
                  <span className="block text-[13px] text-white/80 mt-1 tabular">From £{tile.rent} a week · {tile.city}</span>
                </div>
              </Link>
            ))}
          </div>
          <Button variant="outline" onClick={() => navigate("/search")} className="sm:hidden mt-4 w-full">{fleet.cta} <ArrowRight size={16} /></Button>
        </RevealItem>
      </RevealGroup>

      {/* ── FEATURED LISTINGS: honest preview, real cards ─────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
          <RevealItem className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{featured.heading}</h2>
            <Link to="/search" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-green hover:underline underline-offset-4">{featured.cta} <ArrowRight size={16} strokeWidth={1.75} /></Link>
          </RevealItem>
          <RevealItem>
            <PreviewNotice variant="inline" className="mb-6 max-w-3xl" />
            <div className="track gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-5 sm:gap-y-9 sm:mx-0 sm:px-0 sm:overflow-visible">
              {listings.map((vehicle) => (
                <div key={vehicle.id} className="w-[min(82vw,20rem)] sm:w-auto">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── THE ACCOUNT: the console, live ────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="max-w-2xl">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{dashboard.heading}</h2>
          <p className="mt-4 text-lead text-ink-2">{dashboard.sub}</p>
        </RevealItem>
        <RevealItem className="mt-8">
          <DashboardSnapshot variant="driver" />
        </RevealItem>
        <RevealItem className="mt-6">
          <Link to="/for-drivers" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-green hover:underline underline-offset-4">{dashboard.cta} <ArrowRight size={16} strokeWidth={1.75} /></Link>
        </RevealItem>
      </RevealGroup>

      {/* ── TWO PATHS: photography panels ─────────────────────────────── */}
      <RevealGroup as="section" className="wrap pb-section">
        <RevealItem><h2 className="text-h2 font-heading font-extrabold text-ink mb-6">{paths.heading}</h2></RevealItem>
        <RevealItem className="grid md:grid-cols-2 gap-4">
          {[paths.driver, paths.operator].map((p) => (
            <Link key={p.to} to={p.to} className="pressable-card zoom-media group relative block aspect-[4/5] xs:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4] rounded-2xl overflow-hidden bg-surface-2">
              <img src={p.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                <div className="panel rounded-2xl p-5 text-ink">
                  <p className="eyebrow">{p.kicker}</p>
                  <p className="mt-1.5 font-heading font-bold text-[19px] sm:text-[21px] leading-snug text-balance">{p.heading}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-green">
                    {p.cta} <ArrowRight size={16} strokeWidth={1.75} className="transition-transform duration-ui ease-out group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </RevealItem>
      </RevealGroup>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-4">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{faq.heading}</h2>
            <p className="mt-4 text-[15.5px] text-ink-2 measure-narrow">More answers on the <Link to="/help" className="text-green font-semibold hover:underline underline-offset-4">help page</Link>.</p>
          </RevealItem>
          <RevealItem className="lg:col-span-8">
            <Faq items={faq.items} testId="home-faq" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── CLOSER: full-width operator band ───────────────────────────── */}
      <section className="relative isolate overflow-hidden text-white">
        <img src={closer.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-night/70" />
        <RevealGroup className="wrap relative py-section">
          <RevealItem className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-h2 font-heading font-extrabold max-w-[20ch]">{closer.heading}</h2>
              <p className="mt-4 text-lead text-white/75 max-w-[52ch]">{closer.sub}</p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" variant="onDark" onClick={() => navigate("/list-your-fleet")}>{closer.cta} <ArrowRight size={16} /></Button>
              <Button size="lg" variant="onDarkOutline" onClick={() => navigate("/operator-guide")}>{closer.secondary}</Button>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

    </div>
  );
}
