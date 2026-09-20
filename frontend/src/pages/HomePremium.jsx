import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { shortAuthority } from "@/lib/cities";
import { IMG } from "@/lib/images";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import VehicleCard from "@/components/VehicleCard";
import Faq from "@/components/Faq";
import { HOME, FACTS } from "@/content/site";
import { useSeo } from "@/lib/seo";

/**
 * Homepage, premium-automotive register.
 *
 * The reference is Turo and the better car-maker sites: photography given
 * room, larger type, more air between things, softer radii. Same facts and
 * the same search as the functional page; the difference is entirely in
 * how much the photograph is allowed to carry.
 */

const uniq = (a) => Array.from(new Set(a));
const COUNCILS = uniq(MOCK_LISTINGS.map((v) => v.licensing_authority)).sort((a, b) =>
  a.startsWith("Transport") ? -1 : b.startsWith("Transport") ? 1 : a.localeCompare(b));
const RENTS = MOCK_LISTINGS.map((v) => v.weekly_rent);
const BOUNDS = [Math.min(...RENTS), Math.max(...RENTS)];
const verified = (v) => typeof v.photos?.[0] === "string" && v.photos[0].startsWith("/images/listings/");

const BTN = "pressable inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white hover:bg-green";
const BTN_OUT = "pressable inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-[15px] font-semibold text-ink hover:bg-surface";

export default function HomePremium() {
  const navigate = useNavigate();
  useSeo({ title: HOME.seo.title, description: HOME.seo.description });

  const [council, setCouncil] = useState("");
  const [range, setRange] = useState(BOUNDS);

  const scoped = useMemo(() => MOCK_LISTINGS.filter((v) => !council || v.licensing_authority === council), [council]);
  const matches = useMemo(() => scoped.filter((v) => v.weekly_rent >= range[0] && v.weekly_rent <= range[1]), [scoped, range]);
  const featured = useMemo(() => MOCK_LISTINGS.filter(verified)
    .sort((a, b) => a.weekly_rent - b.weekly_rent).slice(0, 3), []);

  const search = () => {
    const p = new URLSearchParams();
    if (council) p.set("council", council);
    if (range[0] > BOUNDS[0]) p.set("minBudget", String(range[0]));
    if (range[1] < BOUNDS[1]) p.set("budget", String(range[1]));
    navigate(`/search?${p.toString()}`);
  };

  return (
    <div className="bg-bone">
      <section className="wrap pt-[calc(var(--header-h)+2.5rem)] pb-14 sm:pb-20 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
        <div>
          <p className="text-[13px] font-semibold text-green">UK private hire vehicle marketplace</p>
          <h1 className="mt-4 font-heading text-display font-extrabold leading-[1.0] tracking-[-0.03em] text-ink max-w-[14ch]">
            Find a licensed car you can afford this week.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lead leading-relaxed text-ink-2">
            Rent from operators we have checked, in {FACTS.cities.length} cities. Choose your cover when you apply, and we will have you live on Uber and Bolt before you collect the keys.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); search(); }}
            className="mt-8 rounded-xl border border-line bg-surface p-5 shadow-2" data-testid="home-search">
            <div className="grid gap-5 sm:grid-cols-[1fr_1.5fr]">
              <div>
                <label htmlFor="hp-council" className="block text-[12.5px] font-medium text-ink-3 mb-1.5">Where do you drive?</label>
                <select id="hp-council" value={council} onChange={(e) => setCouncil(e.target.value)}
                  className="block w-full rounded-lg border border-line-strong bg-surface px-3 h-12 text-[15px] font-medium text-ink outline-none focus:border-ink">
                  <option value="">Anywhere in the UK</option>
                  {COUNCILS.map((c) => <option key={c} value={c}>{shortAuthority(c)}</option>)}
                </select>
              </div>
              <div>
                <span className="block text-[12.5px] font-medium text-ink-3 mb-1.5">Weekly budget</span>
                <PriceRangeFilter values={scoped.map((v) => v.weekly_rent)} min={BOUNDS[0]} max={BOUNDS[1]} value={range} onChange={setRange} id="hp-price" compact />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button type="submit" data-testid="home-search-btn" className={BTN}>
                <Search size={16} strokeWidth={2.25} /> Search {matches.length} cars
              </button>
              <Link to="/list-your-fleet" className="pressable text-[14.5px] font-semibold text-ink-2 hover:text-ink">
                Operator? List your fleet →
              </Link>
            </div>
          </form>
          <p className="mt-4 max-w-[52ch] text-[12.5px] text-ink-3">{FACTS.prelaunch}</p>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-line bg-surface-2 aspect-[4/5] lg:aspect-auto lg:h-[36rem]">
          <img src="/images/listings/toyota-prius.jpg" alt="A Toyota Prius working as a private hire taxi"
            className="h-full w-full object-cover" fetchPriority="high" decoding="async" />
        </figure>
      </section>

      <section className="bg-surface border-y border-line">
        <div className="wrap py-14 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-h2 font-extrabold text-ink">Available now</h2>
            <Link to="/search" className="pressable inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-green">
              All {MOCK_LISTINGS.length} cars <ArrowRight size={15} strokeWidth={2.25} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featured.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </div>
      </section>

      <section className="wrap py-14 sm:py-20 grid gap-6 md:grid-cols-2">
        {[
          { k: "For drivers", h: "Rent a car and start earning the week you collect it.", img: "/images/listings/toyota-corolla.jpg", to: "/for-drivers", cta: "How it works" },
          { k: "For operators", h: "Cars standing idle cost you every week. Put them to work.", img: IMG.londonNight, to: "/operator-guide", cta: "List your fleet" },
        ].map((p) => (
          <Link key={p.k} to={p.to} className="pressable group relative block overflow-hidden rounded-2xl border border-line aspect-[4/3] md:aspect-[5/4]">
            <img src={p.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <p className="text-[12.5px] font-semibold text-white/70">{p.k}</p>
              <p className="mt-2 font-heading text-[22px] font-bold leading-tight max-w-[22ch]">{p.h}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold">{p.cta} <ArrowRight size={15} strokeWidth={2.25} className="transition-transform duration-ui ease-out group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-surface border-t border-line">
        <div className="wrap py-14 sm:py-20">
          <h2 className="font-heading text-h2 font-extrabold text-ink">{HOME.faq.heading}</h2>
          <div className="mt-8 max-w-3xl"><Faq items={HOME.faq.items} testId="home-faq" /></div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/search" className={BTN}>Find a car <ArrowRight size={15} strokeWidth={2.25} /></Link>
            <Link to="/list-your-fleet" className={BTN_OUT}>List your fleet</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
