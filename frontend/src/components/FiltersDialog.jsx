import { useEffect, useMemo, useState } from "react";
import { MOCK_LISTINGS } from "@/data/mockListings";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SEARCH } from "@/content/pages/marketplace";

/* ── Data derived from the real inventory, never hardcoded lists. Computed
   once at module scope since the underlying dataset never changes at
   runtime. ── */

const uniq = (arr) => Array.from(new Set(arr));

export const BODY_TYPES = uniq(MOCK_LISTINGS.map((v) => v.body_type)).sort((a, b) => a.localeCompare(b));
export const TRANSMISSIONS = uniq(MOCK_LISTINGS.map((v) => v.transmission)).sort((a, b) => a.localeCompare(b));
export const COLOURS = uniq(MOCK_LISTINGS.map((v) => v.colour)).sort((a, b) => a.localeCompare(b));
export const SEAT_OPTIONS = uniq(MOCK_LISTINGS.map((v) => v.seats)).sort((a, b) => a - b);
export const MILEAGE_OPTIONS = uniq(MOCK_LISTINGS.map((v) => v.mileage_allowance)).sort((a, b) => a - b);
export const YEAR_BOUNDS = [
  Math.min(...MOCK_LISTINGS.map((v) => v.year)),
  Math.max(...MOCK_LISTINGS.map((v) => v.year)),
];

export const COUNCILS = uniq(MOCK_LISTINGS.map((v) => v.licensing_authority)).sort((a, b) => a.localeCompare(b));

export const MODELS_BY_MAKE = MOCK_LISTINGS.reduce((acc, v) => {
  (acc[v.make] ||= new Set()).add(v.model);
  return acc;
}, {});
for (const make of Object.keys(MODELS_BY_MAKE)) {
  MODELS_BY_MAKE[make] = Array.from(MODELS_BY_MAKE[make]).sort((a, b) => a.localeCompare(b));
}

/** Applies every filter dimension except the ones named in `skip`, so a
 * pool can be built for "how many if I also chose this" counts. */
export function applyFilters(list, f, skip = []) {
  const s = new Set(skip);
  return list.filter((v) => {
    if (!s.has("city") && f.city && v.city !== f.city) return false;
    if (!s.has("borough") && f.borough && v.borough !== f.borough) return false;
    if (!s.has("make") && f.make && v.make !== f.make) return false;
    if (!s.has("model") && f.model && v.model !== f.model) return false;
    if (!s.has("fuel") && f.fuel && v.fuel !== f.fuel) return false;
    if (!s.has("transmission") && f.transmission && v.transmission !== f.transmission) return false;
    if (!s.has("bodyTypes") && f.bodyTypes?.length && !f.bodyTypes.includes(v.body_type)) return false;
    if (!s.has("colour") && f.colour && v.colour !== f.colour) return false;
    if (!s.has("seats") && f.seats?.length && !f.seats.includes(v.seats)) return false;
    if (!s.has("councils") && f.councils?.length && !f.councils.includes(v.licensing_authority)) return false;
    if (!s.has("year") && f.yearRange && (v.year < f.yearRange[0] || v.year > f.yearRange[1])) return false;
    if (!s.has("mileage") && f.mileageMin && v.mileage_allowance < f.mileageMin) return false;
    if (!s.has("price") && f.priceRange && (v.weekly_rent < f.priceRange[0] || v.weekly_rent > f.priceRange[1])) return false;
    return true;
  });
}

const sectionCls =
  "pt-5 border-t border-line first:border-t-0 first:pt-0 sm:border-t sm:pt-5 sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+2)]:pt-0";
const headingCls = "text-[13px] font-semibold text-ink-2 mb-2.5";

/** Typed bounds for the rent range. The slider is fine for browsing but
 * useless when someone already knows they cannot go over £200, so both ends
 * are editable. Values commit on blur or Enter, never on every keystroke,
 * so a half-typed "1" does not momentarily filter everything away. */
function RentInputs({ value, min, max, onChange }) {
  const [draft, setDraft] = useState([String(value[0]), String(value[1])]);
  useEffect(() => { setDraft([String(value[0]), String(value[1])]); }, [value]);

  const commit = (i) => {
    const n = parseInt(draft[i], 10);
    if (Number.isNaN(n)) { setDraft([String(value[0]), String(value[1])]); return; }
    const next = [...value];
    next[i] = Math.min(max, Math.max(min, n));
    // Keep the pair ordered: dragging one past the other pushes, never swaps.
    if (next[0] > next[1]) next[i === 0 ? 1 : 0] = next[i];
    onChange(next);
  };

  const field = (i, label) => (
    <label className="flex-1 min-w-0">
      <span className="block text-[11.5px] text-ink-3 mb-1">{label}</span>
      <div className="flex items-center gap-1 rounded-md border border-line-strong bg-surface px-2.5 h-11 focus-within:ring-2 focus-within:ring-green/30 focus-within:border-green">
        <span className="text-ink-3 text-[14px]">£</span>
        <input
          type="text" inputMode="numeric" pattern="[0-9]*"
          value={draft[i]}
          onChange={(e) => setDraft((d) => (i === 0 ? [e.target.value, d[1]] : [d[0], e.target.value]))}
          onBlur={() => commit(i)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(i); e.currentTarget.blur(); } }}
          aria-label={`${SEARCH.filters.budgetLabel} ${label}`}
          data-testid={`rent-input-${i === 0 ? "min" : "max"}`}
          className="w-full bg-transparent text-[15px] font-medium text-ink tabular outline-none"
        />
      </div>
    </label>
  );

  return <div className="flex items-end gap-3 mb-4">{field(0, SEARCH.filters.rentFrom)}{field(1, SEARCH.filters.rentTo)}</div>;
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pressable min-h-11 px-3 rounded-md border text-[12.5px] font-medium ${active ? "bg-ink border-ink text-white" : "bg-surface border-line-strong text-ink-2 hover:bg-surface-2"}`}
    >
      {children}
    </button>
  );
}

function SegRow({ options, value, onChange, label }) {
  return (
    <div className="segmented flex-wrap" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          data-active={value === o.value}
          onClick={() => onChange(value === o.value ? "" : o.value)}
          className="min-h-11"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * The full filter set, in one centred dialog rather than a bottom sheet.
 * Every option here is derived from the real inventory (mockListings.js),
 * and every change is reflected live in `resultCount` since the caller
 * recomputes results from the same state this dialog edits.
 */
export default function FiltersDialog({
  open, onOpenChange, resultCount,
  fuelOptions,
  city,
  borough, setBorough, areaOptions,
  fuel, setFuel,
  transmission, setTransmission,
  bodyTypes, setBodyTypes,
  colour, setColour,
  seats, toggleSeat,
  councils, toggleCouncil,
  make, setMake,
  model, setModel,
  yearRange, setYearRange,
  mileageMin, setMileageMin,
  priceValues, priceMin, priceMax, priceRange, setPriceRange,
  makeOptions,
  hasFilters, onClear,
}) {
  const councilCounts = useMemo(() => {
    const pool = applyFilters(MOCK_LISTINGS, {
      city, borough, make, model, fuel, transmission, bodyTypes, seats, councils, yearRange, mileageMin, priceRange,
    }, ["councils"]);
    const counts = {};
    for (const v of pool) counts[v.licensing_authority] = (counts[v.licensing_authority] || 0) + 1;
    return counts;
  }, [city, borough, make, model, fuel, transmission, bodyTypes, seats, councils, yearRange, mileageMin, priceRange]);

  const modelOptions = make ? (MODELS_BY_MAKE[make] || []) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[85dvh]" data-testid="filters-dialog">
        <div className="shrink-0 px-6 py-4 border-b border-line">
          <DialogTitle className="text-h3 font-heading font-bold text-ink">{SEARCH.filters.filtersButton}</DialogTitle>
          <DialogDescription className="sr-only">
            Filter cars by licensing council, make, model, fuel, transmission, body type, seats, vehicle age, mileage allowance and weekly rent.
          </DialogDescription>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
          <section className={sectionCls} data-testid="filter-area">
            <h3 className={headingCls}>{SEARCH.filters.areaLabel}</h3>
            <select value={borough} onChange={(e) => setBorough(e.target.value)} className="select-field w-full">
              <option value="">{SEARCH.filters.areaPlaceholder}</option>
              {areaOptions.slice(1).map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </section>

          <section className={sectionCls} data-testid="filter-council">
            <h3 className={headingCls}>{SEARCH.filters.councilLabel}</h3>
            <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto -mx-1 px-1">
              {COUNCILS.map((authority) => (
                <label key={authority} className="pressable min-h-11 flex items-center justify-between gap-3 rounded-md px-2 py-2 text-[13.5px] text-ink hover:bg-surface-2 cursor-pointer">
                  <span className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={councils.includes(authority)}
                      onChange={() => toggleCouncil(authority)}
                      className="h-4 w-4 shrink-0 rounded border-line-strong accent-green"
                    />
                    <span className="truncate">{authority}</span>
                  </span>
                  <span className="tabular text-[12px] text-ink-3 shrink-0">{councilCounts[authority] || 0}</span>
                </label>
              ))}
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-ink-3">{SEARCH.filters.councilNote}</p>
          </section>

          <section className={sectionCls} data-testid="filter-make-model">
            <h3 className={headingCls}>{SEARCH.filters.makeModelLabel}</h3>
            <div className="flex flex-col gap-2.5">
              <select value={make} onChange={(e) => setMake(e.target.value)} className="select-field w-full">
                <option value="">{SEARCH.filters.anyMake}</option>
                {makeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!make}
                className="select-field w-full disabled:opacity-50"
              >
                <option value="">{make ? SEARCH.filters.anyModel : SEARCH.filters.pickMakeFirst}</option>
                {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </section>

          <section className={sectionCls} data-testid="filter-fuel">
            <h3 className={headingCls}>{SEARCH.filters.fuelLabel}</h3>
            <SegRow label={SEARCH.filters.fuelLabel} options={fuelOptions} value={fuel} onChange={setFuel} />
          </section>

          <section className={sectionCls} data-testid="filter-transmission">
            <h3 className={headingCls}>{SEARCH.filters.transmissionLabel}</h3>
            <SegRow
              label={SEARCH.filters.transmissionLabel}
              options={TRANSMISSIONS.map((t) => ({ label: t, value: t }))}
              value={transmission}
              onChange={setTransmission}
            />
          </section>

          <section className={sectionCls} data-testid="filter-body-type">
            <h3 className={headingCls}>{SEARCH.filters.bodyLabel}</h3>
            <select
              value={bodyTypes[0] || ""}
              onChange={(e) => setBodyTypes(e.target.value ? [e.target.value] : [])}
              className="select-field w-full"
              aria-label={SEARCH.filters.bodyLabel}
            >
              <option value="">{SEARCH.filters.anyBody}</option>
              {BODY_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </section>

          <section className={sectionCls} data-testid="filter-colour">
            <h3 className={headingCls}>{SEARCH.filters.colourLabel}</h3>
            <select
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className="select-field w-full"
              aria-label={SEARCH.filters.colourLabel}
            >
              <option value="">{SEARCH.filters.anyColour}</option>
              {COLOURS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </section>

          <section className={sectionCls} data-testid="filter-seats">
            <h3 className={headingCls}>{SEARCH.filters.seatsLabel}</h3>
            <div className="flex flex-wrap gap-1.5">
              {SEAT_OPTIONS.map((n) => (
                <Chip key={n} active={seats.includes(n)} onClick={() => toggleSeat(n)}>{SEARCH.filters.seatsValue(n)}</Chip>
              ))}
            </div>
          </section>

          <section className={sectionCls} data-testid="filter-age">
            <h3 className={headingCls}>{SEARCH.filters.ageLabel}</h3>
            <div className="flex items-center gap-2.5">
              <select
                value={yearRange[0]}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setYearRange([v, Math.max(v, yearRange[1])]);
                }}
                className="select-field w-full"
                aria-label="From year"
              >
                {Array.from({ length: YEAR_BOUNDS[1] - YEAR_BOUNDS[0] + 1 }, (_, i) => YEAR_BOUNDS[0] + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="text-[13px] text-ink-3 shrink-0">{SEARCH.filters.ageTo}</span>
              <select
                value={yearRange[1]}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setYearRange([Math.min(yearRange[0], v), v]);
                }}
                className="select-field w-full"
                aria-label="To year"
              >
                {Array.from({ length: YEAR_BOUNDS[1] - YEAR_BOUNDS[0] + 1 }, (_, i) => YEAR_BOUNDS[0] + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </section>

          <section className={sectionCls} data-testid="filter-mileage">
            <h3 className={headingCls}>{SEARCH.filters.mileageLabel}</h3>
            <SegRow
              label={SEARCH.filters.mileageLabel}
              options={[
                { label: SEARCH.filters.mileageAny, value: 0 },
                ...MILEAGE_OPTIONS.map((n) => ({ label: SEARCH.filters.mileageAtLeast(n), value: n })),
              ]}
              value={mileageMin}
              onChange={(v) => setMileageMin(v || 0)}
            />
          </section>

          <section className={`${sectionCls} sm:col-span-2`} data-testid="filter-rent">
            <h3 className={headingCls}>{SEARCH.filters.budgetLabel}</h3>
            <RentInputs value={priceRange} min={priceMin} max={priceMax} onChange={setPriceRange} />
            <PriceRangeFilter id="price-range-dialog" values={priceValues} min={priceMin} max={priceMax} value={priceRange} onChange={setPriceRange} />
          </section>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-line flex gap-2.5">
          {hasFilters && (
            <Button variant="outline" onClick={onClear} className="flex-1">{SEARCH.filters.clearAll}</Button>
          )}
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            {SEARCH.filters.showCars(resultCount)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
