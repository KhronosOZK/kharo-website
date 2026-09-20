import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
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
    if (!s.has("breakdown") && f.breakdownOnly && !v.breakdown_included) return false;
    if (!s.has("price") && f.priceRange && (v.weekly_rent < f.priceRange[0] || v.weekly_rent > f.priceRange[1])) return false;
    return true;
  });
}

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
    if (next[0] > next[1]) next[i === 0 ? 1 : 0] = next[i];
    onChange(next);
  };

  const field = (i, label) => (
    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line-strong bg-surface px-2.5 h-10 focus-within:border-green focus-within:ring-2 focus-within:ring-green/25">
      <span className="text-[11px] font-medium uppercase tracking-wide text-ink-3">{label}</span>
      <span className="ml-auto text-[13px] text-ink-3">£</span>
      <input
        type="text" inputMode="numeric" pattern="[0-9]*"
        value={draft[i]}
        onChange={(e) => setDraft((d) => (i === 0 ? [e.target.value, d[1]] : [d[0], e.target.value]))}
        onBlur={() => commit(i)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(i); e.currentTarget.blur(); } }}
        aria-label={`${SEARCH.filters.budgetLabel} ${label}`}
        data-testid={`rent-input-${i === 0 ? "min" : "max"}`}
        className="w-12 bg-transparent text-right text-[14px] font-semibold text-ink tabular outline-none"
      />
    </label>
  );

  return <div className="mt-3 flex gap-2">{field(0, SEARCH.filters.rentFrom)}{field(1, SEARCH.filters.rentTo)}</div>;
}

function SegRow({ options, value, onChange, label }) {
  return (
    <div className="segmented flex-wrap" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} data-active={value === o.value}
          onClick={() => onChange(value === o.value ? "" : o.value)} className="min-h-10">
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CheckRow({ checked, onChange, children, count }) {
  return (
    <label className="pressable flex min-h-9 cursor-pointer items-center justify-between gap-3 rounded-md px-1.5 text-[13.5px] text-ink hover:bg-surface-2">
      <span className="flex min-w-0 items-center gap-2.5">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 shrink-0 rounded border-line-strong accent-green" />
        <span className="truncate">{children}</span>
      </span>
      {count != null && <span className="tabular shrink-0 text-[12px] text-ink-3">{count}</span>}
    </label>
  );
}

/** One filter group. A native disclosure, open by default, so the sidebar
 * reads as a list of headings the way Auto Trader's does and a person can
 * fold away what they do not care about. */
function Group({ title, children, open = true, testId }) {
  return (
    <details open={open} className="group border-t border-line py-4 first:border-t-0 first:pt-0" data-testid={testId}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={15} strokeWidth={2} className="text-ink-3 transition-transform duration-ui group-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

/**
 * The full filter set as one column. Rendered in the sidebar on wide
 * screens and inside a dialog on narrow ones, so both are always the same
 * controls in the same order. Every option is derived from the inventory
 * and every change is reflected live in the result count by the caller.
 */
export function FilterPanel({
  fuelOptions,
  city, setCity, cityOptions = [],
  borough, setBorough, areaOptions,
  fuel, setFuel,
  transmission, setTransmission,
  bodyTypes, setBodyTypes,
  colour, setColour,
  seats, toggleSeat,
  councils, toggleCouncil,
  make, setMake, makeOptions,
  model, setModel,
  yearRange, setYearRange,
  mileageMin, setMileageMin,
  breakdownOnly, setBreakdownOnly,
  priceValues, priceMin, priceMax, priceRange, setPriceRange,
  hasFilters, onClear,
  showHeader = true,
}) {
  const councilCounts = useMemo(() => {
    const pool = applyFilters(MOCK_LISTINGS, {
      city, borough, make, model, fuel, transmission, bodyTypes, seats, councils, yearRange, mileageMin, breakdownOnly, priceRange,
    }, ["councils"]);
    const counts = {};
    for (const v of pool) counts[v.licensing_authority] = (counts[v.licensing_authority] || 0) + 1;
    return counts;
  }, [city, borough, make, model, fuel, transmission, bodyTypes, seats, councils, yearRange, mileageMin, breakdownOnly, priceRange]);

  const bodyCounts = useMemo(() => {
    const pool = applyFilters(MOCK_LISTINGS, {
      city, borough, make, model, fuel, transmission, seats, councils, yearRange, mileageMin, breakdownOnly, priceRange,
    }, ["bodyTypes"]);
    const counts = {};
    for (const v of pool) counts[v.body_type] = (counts[v.body_type] || 0) + 1;
    return counts;
  }, [city, borough, make, model, fuel, transmission, seats, councils, yearRange, mileageMin, breakdownOnly, priceRange]);

  const modelOptions = make ? (MODELS_BY_MAKE[make] || []) : [];
  const toggleBody = (bt) => setBodyTypes(bodyTypes.includes(bt) ? bodyTypes.filter((b) => b !== bt) : [...bodyTypes, bt]);
  const years = Array.from({ length: YEAR_BOUNDS[1] - YEAR_BOUNDS[0] + 1 }, (_, i) => YEAR_BOUNDS[0] + i);

  return (
    <div data-testid="filter-panel">
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <p className="font-heading text-[17px] font-bold text-ink">Filter by</p>
          {hasFilters && (
            <button type="button" onClick={onClear} className="pressable text-[13px] font-medium text-ink-3 hover:text-ink" data-testid="filters-reset">
              {SEARCH.filters.clearAll}
            </button>
          )}
        </div>
      )}

      {setCity && (
        <Group title="Where" testId="filter-where">
          <div className="grid gap-2">
            <select value={city} onChange={(e) => setCity(e.target.value)} className="select-field w-full" aria-label={SEARCH.filters.cityLabel}>
              <option value="">Any city</option>
              {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={borough} onChange={(e) => setBorough(e.target.value)} className="select-field w-full" aria-label={SEARCH.filters.areaLabel}>
              <option value="">{SEARCH.filters.areaPlaceholder}</option>
              {areaOptions.slice(1).map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </Group>
      )}

      <Group title={SEARCH.filters.budgetLabel} testId="filter-rent">
        <PriceRangeFilter id="price-range-panel" values={priceValues} min={priceMin} max={priceMax} value={priceRange} onChange={setPriceRange} />
        <RentInputs value={priceRange} min={priceMin} max={priceMax} onChange={setPriceRange} />
      </Group>

      <Group title="Breakdown cover" testId="filter-breakdown">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-[13.5px] text-ink">
          <span>Included in the rent only</span>
          <button type="button" role="switch" aria-checked={breakdownOnly} onClick={() => setBreakdownOnly(!breakdownOnly)}
            data-testid="filter-breakdown-toggle"
            className={`pressable relative h-6 w-11 shrink-0 rounded-full transition-colors duration-ui ${breakdownOnly ? "bg-green" : "bg-line-strong"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-1 transition-transform duration-ui ease-out ${breakdownOnly ? "translate-x-[1.375rem]" : "translate-x-0.5"}`} />
          </button>
        </label>
      </Group>

      <Group title={SEARCH.filters.fuelLabel} testId="filter-fuel">
        <SegRow label={SEARCH.filters.fuelLabel} options={fuelOptions} value={fuel} onChange={setFuel} />
      </Group>

      <Group title={SEARCH.filters.bodyLabel} testId="filter-body-type">
        <div className="grid grid-cols-2 gap-x-2">
          {BODY_TYPES.map((bt) => (
            <CheckRow key={bt} checked={bodyTypes.includes(bt)} onChange={() => toggleBody(bt)} count={bodyCounts[bt] || 0}>{bt}</CheckRow>
          ))}
        </div>
      </Group>

      <Group title={SEARCH.filters.makeModelLabel} testId="filter-make-model">
        <div className="grid gap-2">
          <select value={make} onChange={(e) => setMake(e.target.value)} className="select-field w-full" aria-label={SEARCH.filters.anyMake}>
            <option value="">{SEARCH.filters.anyMake}</option>
            {makeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make} className="select-field w-full disabled:opacity-50" aria-label={SEARCH.filters.anyModel}>
            <option value="">{make ? SEARCH.filters.anyModel : SEARCH.filters.pickMakeFirst}</option>
            {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </Group>

      <Group title={SEARCH.filters.councilLabel} testId="filter-council" open={false}>
        <div className="-mx-1 max-h-56 overflow-y-auto px-1">
          {COUNCILS.map((authority) => (
            <CheckRow key={authority} checked={councils.includes(authority)} onChange={() => toggleCouncil(authority)} count={councilCounts[authority] || 0}>{authority}</CheckRow>
          ))}
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-3">{SEARCH.filters.councilNote}</p>
      </Group>

      <Group title={SEARCH.filters.seatsLabel} testId="filter-seats">
        <SegRow label={SEARCH.filters.seatsLabel}
          options={SEAT_OPTIONS.map((n) => ({ label: SEARCH.filters.seatsValue(n), value: n }))}
          value={seats[0] ?? ""} onChange={(v) => { if (seats[0] != null) toggleSeat(seats[0]); if (v !== "" && v !== seats[0]) toggleSeat(v); }} />
      </Group>

      <Group title={SEARCH.filters.transmissionLabel} testId="filter-transmission">
        <SegRow label={SEARCH.filters.transmissionLabel} options={TRANSMISSIONS.map((t) => ({ label: t, value: t }))} value={transmission} onChange={setTransmission} />
      </Group>

      <Group title={SEARCH.filters.ageLabel} testId="filter-age">
        <div className="flex items-center gap-2">
          <select value={yearRange[0]} onChange={(e) => { const v = parseInt(e.target.value, 10); setYearRange([v, Math.max(v, yearRange[1])]); }} className="select-field w-full" aria-label="From year">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="shrink-0 text-[13px] text-ink-3">{SEARCH.filters.ageTo}</span>
          <select value={yearRange[1]} onChange={(e) => { const v = parseInt(e.target.value, 10); setYearRange([Math.min(yearRange[0], v), v]); }} className="select-field w-full" aria-label="To year">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </Group>

      <Group title={SEARCH.filters.mileageLabel} testId="filter-mileage" open={false}>
        <select value={mileageMin} onChange={(e) => setMileageMin(parseInt(e.target.value, 10) || 0)} className="select-field w-full" aria-label={SEARCH.filters.mileageLabel}>
          <option value={0}>{SEARCH.filters.mileageAny}</option>
          {MILEAGE_OPTIONS.map((n) => <option key={n} value={n}>{SEARCH.filters.mileageAtLeast(n)}</option>)}
        </select>
      </Group>

      <Group title={SEARCH.filters.colourLabel} testId="filter-colour" open={false}>
        <select value={colour} onChange={(e) => setColour(e.target.value)} className="select-field w-full" aria-label={SEARCH.filters.colourLabel}>
          <option value="">{SEARCH.filters.anyColour}</option>
          {COLOURS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Group>
    </div>
  );
}

/** The same panel inside a dialog, for narrow screens. */
export default function FiltersDialog({ open, onOpenChange, resultCount, hasFilters, onClear, ...panel }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-lg flex-col gap-0 overflow-hidden p-0" data-testid="filters-dialog">
        <div className="shrink-0 border-b border-line px-5 py-4">
          <DialogTitle className="font-heading text-h3 font-bold text-ink">{SEARCH.filters.filtersButton}</DialogTitle>
          <DialogDescription className="sr-only">
            Filter cars by city, licensing council, make, model, fuel, transmission, body type, seats, vehicle age, mileage allowance and weekly rent.
          </DialogDescription>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <FilterPanel {...panel} hasFilters={hasFilters} onClear={onClear} showHeader={false} />
        </div>
        <div className="flex shrink-0 gap-2.5 border-t border-line px-5 py-4">
          {hasFilters && <Button variant="outline" onClick={onClear} className="flex-1">{SEARCH.filters.clearAll}</Button>}
          <Button onClick={() => onOpenChange(false)} className="flex-1">{SEARCH.filters.showCars(resultCount)}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
