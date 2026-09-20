import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Search } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { shortAuthority } from "@/lib/cities";
import { IMG } from "@/lib/images";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import VehicleCard from "@/components/VehicleCard";
import Faq from "@/components/Faq";
import { HOME, FACTS } from "@/content/site";
import { useSeo } from "@/lib/seo";

/**
 * Homepage. Functional-clarity register: the search is the hero, the price
 * comes before everything, and the page looks like a tool people already
 * trust with money (Auto Trader, Rightmove) rather than a brochure.
 *
 * Critique 2026-09-20 drove this revision: no eyebrows, no tagline inside the
 * hero, a real photograph behind the search, the price distribution shown
 * rather than hidden, pre-launch status where the money is, a closing action.
 */

const uniq = (a) => Array.from(new Set(a));
const COUNCILS = uniq(MOCK_LISTINGS.map((v) => v.licensing_authority)).sort((a, b) =>
  a.startsWith("Transport") ? -1 : b.startsWith("Transport") ? 1 : a.localeCompare(b));
const FUELS = uniq(MOCK_LISTINGS.map((v) => v.fuel)).sort();
const RENTS = MOCK_LISTINGS.map((v) => v.weekly_rent);
const BOUNDS = [Math.min(...RENTS), Math.max(...RENTS)];
// A listing is "verified" when its first photograph genuinely shows that
// car: the matched CDN catalogue or one of the five local photographs.
const verified = (v) => {
  const p = v.photos?.[0];
  return typeof p === "string" && (p.startsWith("/images/listings/") || p.includes("prod-images.emergentagent.com"));
};

const DRIVER_POINTS = [
  "Licensed cars from operators we have checked against the licensing register",
  "The weekly price is the rent. You choose your own hire and reward cover when you apply",
  "Uber and Bolt set up on the car before you collect it",
  "Weekly payments, invoices and documents in one account",
];
const OPERATOR_POINTS = [
  "A consultant calls within one working day and builds your listings for you",
  "Every applicant arrives with DVLA, identity and affordability checks done",
  "Rent collected through Kharo each week and paid to you on schedule",
  "MOT, plate and insurance expiries tracked, claims handled by a dedicated team",
];

const BTN = "pressable inline-flex h-11 items-center gap-2 rounded bg-ink px-5 text-[14.5px] font-semibold text-white hover:bg-green";
const BTN_OUT = "pressable inline-flex h-11 items-center rounded border border-line-strong px-5 text-[14.5px] font-semibold text-ink hover:bg-surface-2";
const FIELD = "block w-full rounded border border-line-strong bg-surface px-3 h-11 text-[15px] font-medium text-ink outline-none focus:border-ink";
const LABEL = "block text-[13px] font-medium text-ink-2 mb-1.5";

export default function HomeFunctional() {
  const navigate = useNavigate();
  useSeo({ title: HOME.seo.title, description: HOME.seo.description });

  const [council, setCouncil] = useState("");
  const [fuel, setFuel] = useState("");
  const [range, setRange] = useState(BOUNDS);

  const scoped = useMemo(() => MOCK_LISTINGS.filter((v) =>
    (!council || v.licensing_authority === council) && (!fuel || v.fuel === fuel)), [council, fuel]);
  const matches = useMemo(() => scoped.filter((v) => v.weekly_rent >= range[0] && v.weekly_rent <= range[1]), [scoped, range]);
  const cheapest = useMemo(() => MOCK_LISTINGS.slice()
    .sort((a, b) => (verified(b) - verified(a)) || (a.weekly_rent - b.weekly_rent)).slice(0, 6), []);

  const search = () => {
    const p = new URLSearchParams();
    if (council) p.set("council", council);
    if (fuel) p.set("engine", fuel);
    if (range[0] > BOUNDS[0]) p.set("minBudget", String(range[0]));
    if (range[1] < BOUNDS[1]) p.set("budget", String(range[1]));
    navigate(`/search?${p.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* ── SEARCH IS THE HERO ──────────────────────────────────────────
          A real photograph behind the instrument, as Auto Trader does. The
          copy on it is the headline and one line; the panel is the action. */}
      <section className="relative isolate bg-night">
        <div className="absolute inset-0 overflow-hidden">
          <img src={IMG.londonBus} alt="" className="h-full w-full object-cover object-[60%_center]" fetchPriority="high" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/60 to-night/80" />
        </div>

        <div className="wrap relative pt-[calc(var(--header-h)+2.5rem)] pb-10 sm:pb-12 text-white">
          <h1 className="max-w-[18ch] font-heading text-h1 font-extrabold leading-[1.05] tracking-[-0.02em]">
            Find a licensed car you can afford this week.
          </h1>
          <p className="mt-3 max-w-[50ch] text-[16.5px] leading-relaxed text-white/85">
            {MOCK_LISTINGS.length} cars from operators we have checked, in {FACTS.cities.length} cities. Rent shown first.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); search(); }}
            className="mt-7 rounded-md border border-line bg-surface p-4 text-ink shadow-2 sm:p-5"
            data-testid="home-search"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <span className="text-[13.5px] font-semibold text-ink">Where do you drive?</span>
              <span className="text-[12.5px] text-ink-3" data-testid="home-preview-badge">Pre-launch preview. Cars are not bookable yet.</span>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.6fr_auto] lg:items-end">
              <div>
                <label htmlFor="hf-council" className={LABEL}>Licensing area</label>
                <select id="hf-council" value={council} onChange={(e) => setCouncil(e.target.value)} className={FIELD}>
                  <option value="">Anywhere</option>
                  {COUNCILS.map((c) => <option key={c} value={c}>{shortAuthority(c)}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="hf-fuel" className={LABEL}>Vehicle type</label>
                <select id="hf-fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className={FIELD}>
                  <option value="">Any type</option>
                  {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <span className={LABEL}>Weekly budget</span>
                <PriceRangeFilter
                  values={scoped.map((v) => v.weekly_rent)}
                  min={BOUNDS[0]} max={BOUNDS[1]}
                  value={range} onChange={setRange}
                  id="hf-price"
                />
              </div>
              <button type="submit" data-testid="home-search-btn"
                className="pressable inline-flex h-11 items-center justify-center gap-2 rounded bg-ink px-6 text-[14.5px] font-semibold text-white hover:bg-green">
                <Search size={16} strokeWidth={2.25} />
                Search {matches.length} {matches.length === 1 ? "car" : "cars"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── STOCK ─────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-bone">
        <div className="wrap py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-h2 font-extrabold text-ink">Cheapest this week</h2>
              <p className="mt-1 text-[15px] text-ink-2">From £{BOUNDS[0]} a week, rent only. Every car is a preview of what our launch operators rent out.</p>
            </div>
            <Link to="/search" className="pressable hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-green sm:inline-flex">
              All {MOCK_LISTINGS.length} cars <ArrowRight size={15} strokeWidth={2.25} />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cheapest.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
          <Link to="/search" className="pressable mt-6 flex h-11 items-center justify-center rounded border border-line-strong text-[14.5px] font-semibold text-ink sm:hidden">
            All {MOCK_LISTINGS.length} cars
          </Link>
        </div>
      </section>

      {/* ── TWO SIDES ─────────────────────────────────────────────────── */}
      <section className="wrap grid gap-10 py-10 sm:py-14 md:grid-cols-2 md:gap-14">
        <div>
          <h2 className="font-heading text-h3 font-extrabold text-ink">For drivers</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-2">Rent a car and start earning the week you collect it.</p>
          <ul className="mt-5 divide-y divide-line">
            {DRIVER_POINTS.map((t) => (
              <li key={t} className="flex gap-3 py-3.5 text-[14.5px] leading-relaxed text-ink-2">
                <Check size={17} strokeWidth={2.25} className="mt-0.5 shrink-0 text-green" />{t}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/search" className={BTN}>Find a car <ArrowRight size={15} strokeWidth={2.25} /></Link>
            <Link to="/for-drivers" className={BTN_OUT}>How it works</Link>
          </div>
        </div>
        <div>
          <h2 className="font-heading text-h3 font-extrabold text-ink">For operators</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-2">Cars standing idle cost you every week. List them.</p>
          <ul className="mt-5 divide-y divide-line">
            {OPERATOR_POINTS.map((t) => (
              <li key={t} className="flex gap-3 py-3.5 text-[14.5px] leading-relaxed text-ink-2">
                <Check size={17} strokeWidth={2.25} className="mt-0.5 shrink-0 text-green" />{t}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/list-your-fleet" className={BTN}>List your fleet <ArrowRight size={15} strokeWidth={2.25} /></Link>
            <Link to="/operator-guide" className={BTN_OUT}>See how it works</Link>
          </div>
        </div>
      </section>

      {/* ── WHAT IT COSTS ─────────────────────────────────────────────── */}
      <section className="border-y border-line bg-bone">
        <div className="wrap grid gap-8 py-10 sm:py-14 md:grid-cols-[1fr_2fr] md:gap-14">
          <div>
            <h2 className="font-heading text-h2 font-extrabold text-ink">What it costs</h2>
            <p className="mt-2 text-[15px] text-ink-2">The price you see is the price you pay. Nothing is added later.</p>
          </div>
          <dl className="divide-y divide-line text-[15px]">
            <div className="grid gap-1.5 py-4 first:pt-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="font-semibold text-ink">Drivers</dt>
              <dd className="text-ink-2">{FACTS.price} Drivers never pay Kharo. {FACTS.payments}</dd>
            </div>
            <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="font-semibold text-ink">Operators</dt>
              <dd className="text-ink-2">Listing is free. Kharo earns a fee from the operator when a rental completes.</dd>
            </div>
            <div className="grid gap-1.5 py-4 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="font-semibold text-ink">Insurance</dt>
              <dd className="text-ink-2">{FACTS.insurance}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="wrap py-10 sm:py-14">
        <h2 className="font-heading text-h2 font-extrabold text-ink">{HOME.faq.heading}</h2>
        <div className="mt-6 max-w-3xl"><Faq items={HOME.faq.items} testId="home-faq" /></div>
      </section>

      {/* ── CLOSE ─────────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-bone">
        <div className="wrap flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
          <div>
            <h2 className="font-heading text-h3 font-extrabold text-ink">Start with the cars, or tell us about yours.</h2>
            <p className="mt-1.5 text-[15px] text-ink-2">Both take a few minutes and cost nothing.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/search" className={BTN}>Find a car <ArrowRight size={15} strokeWidth={2.25} /></Link>
            <Link to="/list-your-fleet" className={BTN_OUT}>List your fleet</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
