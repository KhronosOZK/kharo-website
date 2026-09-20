import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Search } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { shortAuthority } from "@/lib/cities";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import VehicleCard from "@/components/VehicleCard";
import Faq from "@/components/Faq";
import { HOME, FACTS } from "@/content/site";
import { useSeo } from "@/lib/seo";

/**
 * Homepage, functional-clarity register.
 *
 * The reference is Auto Trader and Rightmove, not a magazine: white ground,
 * the search panel as the first object, price before everything, tight radii,
 * and copy that says exactly what happens. Trust in this category comes from
 * looking like a tool people already use with money.
 */

const uniq = (a) => Array.from(new Set(a));
const COUNCILS = uniq(MOCK_LISTINGS.map((v) => v.licensing_authority)).sort((a, b) =>
  a.startsWith("Transport") ? -1 : b.startsWith("Transport") ? 1 : a.localeCompare(b));
const FUELS = uniq(MOCK_LISTINGS.map((v) => v.fuel)).sort();
const RENTS = MOCK_LISTINGS.map((v) => v.weekly_rent);
const BOUNDS = [Math.min(...RENTS), Math.max(...RENTS)];
const verified = (v) => typeof v.photos?.[0] === "string" && v.photos[0].startsWith("/images/listings/");

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
const BTN_OUT = "pressable inline-flex h-11 items-center rounded border border-line-strong px-5 text-[14.5px] font-semibold text-ink";

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

  const field = "block w-full rounded border border-line-strong bg-surface px-3 h-11 text-[15px] font-medium text-ink outline-none focus:border-ink";
  const label = "block text-[12.5px] font-medium text-ink-3 mb-1.5";

  return (
    <div className="bg-white">
      <section className="wrap pt-[calc(var(--header-h)+2rem)] pb-10 sm:pb-14">
        <div className="max-w-[60ch]">
          <p className="text-[13px] font-semibold text-green">UK private hire vehicle marketplace</p>
          <h1 className="mt-3 font-heading text-h1 font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
            Find a licensed car you can afford this week.
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
            {MOCK_LISTINGS.length} cars from operators we have checked, in {FACTS.cities.length} cities.
            Rent shown first. Insurance chosen by you when you apply.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); search(); }}
          className="mt-7 rounded-md border border-line-strong bg-surface p-4 sm:p-5 shadow-1" data-testid="home-search">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_auto] lg:items-end">
            <div>
              <label htmlFor="hf-council" className={label}>Licensing area</label>
              <select id="hf-council" value={council} onChange={(e) => setCouncil(e.target.value)} className={field}>
                <option value="">Anywhere</option>
                {COUNCILS.map((c) => <option key={c} value={c}>{shortAuthority(c)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="hf-fuel" className={label}>Vehicle type</label>
              <select id="hf-fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className={field}>
                <option value="">Any type</option>
                {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <span className={label}>Weekly budget</span>
              <PriceRangeFilter values={scoped.map((v) => v.weekly_rent)} min={BOUNDS[0]} max={BOUNDS[1]} value={range} onChange={setRange} id="hf-price" compact />
            </div>
            <button type="submit" data-testid="home-search-btn"
              className="pressable inline-flex h-11 items-center justify-center gap-2 rounded bg-ink px-6 text-[14.5px] font-semibold text-white hover:bg-green">
              <Search size={16} strokeWidth={2.25} />
              Search {matches.length} {matches.length === 1 ? "car" : "cars"}
            </button>
          </div>
          <p className="mt-3 text-[12.5px] text-ink-3">{FACTS.prelaunch}</p>
        </form>
      </section>

      <section className="border-t border-line bg-bone">
        <div className="wrap py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-h2 font-extrabold text-ink">Cheapest this week</h2>
              <p className="mt-1 text-[14.5px] text-ink-2">From £{BOUNDS[0]} a week. Rent only.</p>
            </div>
            <Link to="/search" className="pressable hidden sm:inline-flex items-center gap-1.5 text-[14px] font-semibold text-green">
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

      <section className="wrap py-10 sm:py-14 grid gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <p className="text-[13px] font-semibold text-green">For drivers</p>
          <h2 className="mt-2 font-heading text-h3 font-extrabold text-ink">Rent a car and start earning the week you collect it.</h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {DRIVER_POINTS.map((t) => (
              <li key={t} className="flex gap-3 py-3 text-[14.5px] leading-relaxed text-ink-2">
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
          <p className="text-[13px] font-semibold text-green">For operators</p>
          <h2 className="mt-2 font-heading text-h3 font-extrabold text-ink">Cars standing idle cost you every week. List them.</h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {OPERATOR_POINTS.map((t) => (
              <li key={t} className="flex gap-3 py-3 text-[14.5px] leading-relaxed text-ink-2">
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

      <section className="border-y border-line bg-bone">
        <div className="wrap py-10 sm:py-14 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-14">
          <h2 className="font-heading text-h2 font-extrabold text-ink">What it costs</h2>
          <dl className="divide-y divide-line border-y border-line text-[15px]">
            <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]"><dt className="font-semibold text-ink">Drivers</dt><dd className="text-ink-2">{FACTS.price} {FACTS.payments}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]"><dt className="font-semibold text-ink">Operators</dt><dd className="text-ink-2">{FACTS.fee}</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]"><dt className="font-semibold text-ink">Insurance</dt><dd className="text-ink-2">{FACTS.insurance}</dd></div>
          </dl>
        </div>
      </section>

      <section className="wrap py-10 sm:py-14">
        <h2 className="font-heading text-h2 font-extrabold text-ink">{HOME.faq.heading}</h2>
        <div className="mt-6 max-w-3xl"><Faq items={HOME.faq.items} testId="home-faq" /></div>
      </section>
    </div>
  );
}
