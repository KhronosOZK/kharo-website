import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { EASE, DUR } from "@/lib/motion";
import { HERO_MARKETPLACE } from "@/content/pages/heroMarketplace";

/* ── Options derived from the real inventory, never a hardcoded list ──── */

const uniq = (arr) => Array.from(new Set(arr));

const COUNCILS = uniq(MOCK_LISTINGS.map((v) => v.licensing_authority)).sort((a, b) =>
  // TfL first: the largest market and the one drivers look for by name.
  a.startsWith("Transport") ? -1 : b.startsWith("Transport") ? 1 : a.localeCompare(b)
);
const VEHICLE_TYPES = uniq(MOCK_LISTINGS.map((v) => v.fuel)).sort((a, b) => a.localeCompare(b));
const RATE_STEPS = [150, 175, 200, 225, 250, 275];

/** A real listing, so every figure shown is one a driver can go and check. */
const FEATURED =
  MOCK_LISTINGS.find((v) => v.id === "KH-1005") ||
  MOCK_LISTINGS.find((v) => v.fuel === "Electric") ||
  MOCK_LISTINGS[0];

const shortCouncil = (a) =>
  a?.startsWith("Transport for London") ? "TfL licensed"
    : a ? `${a.replace(" City Council", "").replace("City of ", "")} licensed` : null;

/* ── Pieces ───────────────────────────────────────────────────────────── */

/** One of the two journeys. Both are on screen at once and carry the same
 *  visual weight: an operator should never have to find a tab. */
function PathCard({ path, tone, testId }) {
  const dark = tone === "dark";
  return (
    <Link
      to={path.to}
      data-testid={testId}
      className={`pressable group flex flex-col justify-between rounded-xl border p-5 transition-colors duration-ui
        ${dark
          ? "border-white/15 bg-white text-ink hover:bg-white/90"
          : "border-white/20 bg-transparent text-white hover:bg-white/10"}`}
    >
      <div>
        <p className={`text-[11.5px] font-semibold ${dark ? "text-ink-3" : "text-white/55"}`}>
          {path.audience}
        </p>
        <p className="mt-2 font-heading text-[18px] font-bold leading-tight">{path.title}</p>
        <p className={`mt-1.5 text-[13.5px] leading-relaxed ${dark ? "text-ink-2" : "text-white/65"}`}>
          {path.body}
        </p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold">
        {path.cta}
        <ArrowRight
          size={15}
          strokeWidth={2.25}
          className="transition-transform duration-ui ease-out group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

function Field({ label, value, onChange, children, testId }) {
  return (
    <label className="group relative flex-1 min-w-0 px-4 py-3 sm:px-5 sm:py-3.5 cursor-pointer">
      <span className="block text-[11.5px] font-medium text-ink-3">{label}</span>
      <span className="mt-1.5 flex items-center justify-between gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testId}
          aria-label={label}
          className="peer w-full cursor-pointer appearance-none truncate bg-transparent
                     text-[15px] font-medium text-ink outline-none"
        >
          {children}
        </select>
        <ChevronDown size={14} strokeWidth={2.25} className="shrink-0 text-ink-3" aria-hidden="true" />
      </span>
    </label>
  );
}

/* ── The hero ─────────────────────────────────────────────────────────── */

export default function HeroMarketplace() {
  const navigate = useNavigate();
  const [council, setCouncil] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [maxRate, setMaxRate] = useState("");

  const H = HERO_MARKETPLACE;
  const S = H.search;
  const v = FEATURED;

  // Keeps the button honest: it never promises more than the results page has.
  const matches = useMemo(
    () =>
      MOCK_LISTINGS.filter(
        (x) =>
          (!council || x.licensing_authority === council) &&
          (!vehicleType || x.fuel === vehicleType) &&
          (!maxRate || x.weekly_rent <= Number(maxRate))
      ).length,
    [council, vehicleType, maxRate]
  );

  const search = () => {
    const p = new URLSearchParams();
    if (council) p.set("council", council);
    if (vehicleType) p.set("engine", vehicleType);
    if (maxRate) p.set("budget", maxRate);
    navigate(`/search?${p.toString()}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-night text-white" data-testid="hero-marketplace">
      {/* Wordmark, set low enough to read as paper texture rather than an
          element competing with the headline. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   select-none whitespace-nowrap font-heading font-extrabold leading-none
                   tracking-[-0.04em] text-white opacity-[0.04]"
        style={{ fontSize: "clamp(6rem, 14vw, 17rem)" }}
      >
        {H.watermark}
      </span>

      <div className="wrap relative pt-[calc(var(--header-h)+clamp(1.25rem,4vh,2.25rem))] pb-[clamp(1.75rem,4vh,2.5rem)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
          {/* ── Proposition and the two journeys ──────────────────────── */}
          <div>
            <p className="text-[12.5px] font-semibold text-white/55">{H.eyebrow}</p>
            <h1 className="mt-4 max-w-[21ch] font-heading text-h1 font-extrabold leading-[1.05] tracking-[-0.025em]">
              {H.heading}
            </h1>
            <p className="mt-4 max-w-[50ch] text-lead leading-relaxed text-white/70">{H.sub}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <PathCard path={H.paths.driver} tone="dark" testId="hero-path-driver" />
              <PathCard path={H.paths.operator} tone="light" testId="hero-path-operator" />
            </div>
          </div>

          {/* ── The vehicle, shown as a vehicle ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.reveal, ease: EASE.out, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-white/12 bg-night"
            data-testid="hero-featured"
          >
            <div className="aspect-[16/11]">
              <img
                src={v.photos?.[0]}
                alt={`${v.year} ${v.make} ${v.model}`}
                className="h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="border-t border-white/12 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11.5px] font-semibold text-white/50">{H.featured.label}</p>
                  <p className="mt-1.5 truncate font-heading text-[17px] font-bold text-white">
                    {v.year} {v.make} {v.model}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-white/55">
                    {shortCouncil(v.licensing_authority)} · {v.fuel} · {v.seats} seats
                  </p>
                </div>
                <p className="shrink-0 text-right tabular">
                  <span className="font-heading text-2xl font-bold tracking-tight text-white">£{v.weekly_rent}</span>
                  <span className="block text-xs font-normal text-white/55">{H.featured.weekLabel}</span>
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/12 pt-4">
                <p className="text-[13px] text-white/55 tabular">
                  £{v.deposit} {H.featured.depositLabel} · {v.mileage_allowance?.toLocaleString()} mi/mo
                </p>
                <Link
                  to={`/vehicle/${v.id}`}
                  data-testid="hero-featured-link"
                  className="pressable group inline-flex shrink-0 items-center gap-1.5 text-[13.5px] font-semibold text-white"
                >
                  {H.featured.cta}
                  <ArrowRight
                    size={14}
                    strokeWidth={2.25}
                    className="transition-transform duration-ui ease-out group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Discovery: the marketplace, immediately ───────────────────── */}
        <div className="mt-8 lg:mt-10">
          <h2 className="text-[13px] font-semibold text-white/55">{S.heading}</h2>
          <div
            className="mt-3 flex flex-col overflow-hidden rounded-xl bg-surface shadow-2
                       divide-y divide-line lg:flex-row lg:items-stretch lg:divide-y-0 lg:divide-x"
            data-testid="hero-filter-bar"
          >
            <Field label={S.council} value={council} onChange={setCouncil} testId="hero-council">
              <option value="">{S.councilAny}</option>
              {COUNCILS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Field>

            <Field label={S.vehicle} value={vehicleType} onChange={setVehicleType} testId="hero-vehicle-type">
              <option value="">{S.vehicleAny}</option>
              {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Field>

            <Field label={S.rate} value={maxRate} onChange={setMaxRate} testId="hero-max-rate">
              <option value="">{S.rateAny}</option>
              {RATE_STEPS.map((r) => <option key={r} value={r}>Up to £{r}</option>)}
            </Field>

            <div className="p-2 lg:shrink-0 lg:self-center lg:pr-2">
              <button
                type="button"
                onClick={search}
                data-testid="hero-search-fleet"
                className="pressable group flex h-12 w-full items-center justify-center gap-2 rounded-lg
                           bg-ink px-7 text-[14px] font-semibold text-white
                           hover:bg-obsidian-3 active:scale-[0.98]
                           transition-[background-color,transform] duration-press lg:w-auto"
              >
                <Search size={16} strokeWidth={2.25} />
                {S.submit}
              </button>
            </div>
          </div>

          <p className="mt-3.5 max-w-[56ch] text-[12.5px] leading-relaxed text-white/45">
            <span className="tabular text-white/70">{S.matches(matches)}</span>. {H.note}
          </p>
        </div>
      </div>
    </section>
  );
}
