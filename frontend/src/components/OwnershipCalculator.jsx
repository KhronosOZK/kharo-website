import { useMemo, useState } from "react";
import { Calculator, RotateCcw, Info } from "lucide-react";
import { formatPrice } from "@/lib/phv";
import { trackEvent } from "@/lib/api";

/**
 * Buy versus rent, worked through properly.
 *
 * A driver deciding between buying this vehicle and renting an equivalent one
 * is asking a cash question, not an accounting one: I am laying out the full
 * purchase price today, so how many weeks of rent does that buy me, and when
 * does renting start costing more than owning?
 *
 * Note this is deliberately modelled on cash out, not on economic cost. If you
 * compare depreciation plus running costs against rent, owning wins in the
 * first week on almost any vehicle, which is true but useless to someone
 * deciding whether to hand over five figures. The break-even below only counts
 * money actually spent, and the resale value is shown separately as what you
 * get back at the end.
 *
 * Everything is an editable estimate rather than a claimed figure. Licensing
 * fees, insurance and servicing all vary by authority, by driver and by year,
 * so the defaults are starting points the driver replaces with their own
 * quotes. Fuel and charging are excluded deliberately, since they are the same
 * either way and would only pad both sides of the comparison.
 */

const DEFAULTS = {
  insuranceWeekly: 55,     // hire and reward, typical starting point
  maintenanceWeekly: 25,   // servicing, tyres, wear items
  licensingAnnual: 350,    // vehicle licence plus inspection, varies by authority
  depreciationAnnual: 15,  // percent of value per year
};

const HORIZONS = [26, 52, 104, 156];

export default function OwnershipCalculator({ vehicle, typicalWeeklyRent }) {
  const [weeks, setWeeks] = useState(104);
  const [insurance, setInsurance] = useState(DEFAULTS.insuranceWeekly);
  const [maintenance, setMaintenance] = useState(DEFAULTS.maintenanceWeekly);
  const [licensing, setLicensing] = useState(DEFAULTS.licensingAnnual);
  const [depreciation, setDepreciation] = useState(DEFAULTS.depreciationAnnual);
  const [rent, setRent] = useState(typicalWeeklyRent || 200);
  const [touched, setTouched] = useState(false);

  const price = vehicle.price;

  const model = useMemo(() => {
    const years = weeks / 52;

    // What you actually pay out: the car, plus everything renting would have
    // bundled into the weekly rate.
    const ownRunning = Math.round((insurance + maintenance) * weeks + licensing * years);
    const ownCashOut = price + ownRunning;

    // What the vehicle is still worth when you are done, on compound
    // depreciation. This is money back, not money saved, so it sits apart.
    const residual = Math.round(price * Math.pow(1 - depreciation / 100, years));
    const ownNet = ownCashOut - residual;

    // Renting bundles insurance, servicing and licensing into the weekly rate,
    // which is why only the rent figure appears on this side.
    const rentTotal = Math.round(rent * weeks);

    // Break-even on cash. Every week of renting costs the full rate, while
    // owning costs only the running items once the car is paid for, so the gap
    // closes at a steady weekly rate.
    const weeklyGap = rent - insurance - maintenance - licensing / 52;
    const breakEven = weeklyGap > 0 ? Math.ceil(price / weeklyGap) : null;

    return {
      residual, ownRunning, ownCashOut, ownNet, rentTotal,
      difference: rentTotal - ownNet,
      ownWeekly: Math.round(ownNet / weeks),
      breakEven, weeklyGap: Math.round(weeklyGap),
    };
  }, [price, weeks, insurance, maintenance, licensing, depreciation, rent]);

  const change = (setter) => (e) => {
    const n = Number(e.target.value);
    setter(Number.isFinite(n) ? n : 0);
    if (!touched) { setTouched(true); trackEvent("ownership_calc_used", { listing_id: vehicle.id }); }
  };

  const reset = () => {
    setWeeks(104);
    setInsurance(DEFAULTS.insuranceWeekly);
    setMaintenance(DEFAULTS.maintenanceWeekly);
    setLicensing(DEFAULTS.licensingAnnual);
    setDepreciation(DEFAULTS.depreciationAnnual);
    setRent(typicalWeeklyRent || 200);
  };

  const ownCheaper = model.difference > 0;
  const maxBar = Math.max(model.ownNet, model.rentTotal, 1);

  return (
    <section className="mt-9" data-testid="ownership-calculator">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#0B6B4F]/[0.08] flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold text-[#1A2E25]">Should you buy this or rent one?</h2>
          <p className="text-[14.5px] text-[#4A564F] mt-1 leading-relaxed">
            Change any figure to match your own quotes. Fuel and charging are left out because they cost the same either way.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[26px] bg-white ring-1 ring-slate-200/70 overflow-hidden">
        {/* Headline result */}
        <div className={`p-6 sm:p-7 ${ownCheaper ? "bg-[#0B6B4F]" : "bg-[#12211B]"} text-white`}>
          {model.breakEven && model.breakEven <= 520 ? (
            <>
              <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">You break even after</div>
              <div className="text-[34px] sm:text-[42px] font-heading font-extrabold leading-none mt-2" data-testid="calc-breakeven">
                {model.breakEven} weeks
              </div>
              <p className="text-white/75 mt-2.5 text-[14.5px] leading-relaxed max-w-lg">
                That is about {(model.breakEven / 52).toFixed(1)} years. Buying costs you {formatPrice(price)}{" "}
                today, then roughly {formatPrice(model.weeklyGap)} a week less than renting once it is yours.
                Keep it past that point and you are ahead, with the resale value on top.
              </p>
            </>
          ) : (
            <>
              <div className="text-[12px] uppercase tracking-[0.16em] text-white/60">On these figures</div>
              <div className="text-[28px] sm:text-[34px] font-heading font-extrabold leading-tight mt-2">
                Renting stays cheaper
              </div>
              <p className="text-white/75 mt-2.5 text-[14.5px] leading-relaxed max-w-lg">
                Your insurance, servicing and licensing add up to more than the weekly rent, so buying never
                catches up. Check those three figures, since they are usually where the difference sits.
              </p>
            </>
          )}
        </div>

        {/* Comparison bars */}
        <div className="p-6 sm:p-7 border-b border-slate-100">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <span className="text-[13px] font-semibold text-[#1A2E25]">Total cost over {weeks} weeks</span>
            <span className={`text-[13px] font-semibold ${ownCheaper ? "text-[#0B6B4F]" : "text-[#C08A2D]"}`}>
              {ownCheaper ? `Owning saves ${formatPrice(model.difference)}` : `Renting saves ${formatPrice(-model.difference)}`}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <Bar label="Buy, after resale value" total={model.ownNet} width={(model.ownNet / maxBar) * 100}
              tone="own" weekly={model.ownWeekly} testid="calc-own" />
            <Bar label="Rent an equivalent" total={model.rentTotal} width={(model.rentTotal / maxBar) * 100}
              tone="rent" weekly={rent} testid="calc-rent" />
          </div>

          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <Cell label="Cash you lay out in total" value={formatPrice(model.ownCashOut)} />
            <Cell label="Of that, running costs" value={formatPrice(model.ownRunning)} />
            <Cell label="Vehicle worth at the end" value={formatPrice(model.residual)} highlight />
          </div>
        </div>

        {/* Inputs */}
        <div className="p-6 sm:p-7 bg-[#F9F8F6]">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <span className="text-[13px] font-semibold text-[#1A2E25]">Your assumptions</span>
            <button onClick={reset} data-testid="calc-reset"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-1 text-[12.5px] text-[#4A564F] hover:text-[#0B6B4F] transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset to defaults
            </button>
          </div>

          <div className="mb-5">
            <span className="text-[12.5px] font-medium text-[#4A564F] block mb-2">How long you would keep it</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {HORIZONS.map((w) => (
                <button key={w} onClick={() => { setWeeks(w); setTouched(true); }} data-testid={`calc-weeks-${w}`}
                  className={`rounded-xl py-3 min-h-[44px] text-[13px] font-semibold ring-1 transition-all ${
                    weeks === w ? "ring-2 ring-[#0B6B4F] bg-[#0B6B4F]/[0.07] text-[#0B6B4F]"
                                : "ring-slate-200 bg-white text-[#4A564F] hover:bg-white/60"}`}>
                  {w === 26 ? "6 months" : `${w / 52} year${w > 52 ? "s" : ""}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input label="Rent for a comparable car" prefix="£" suffix="a week" value={rent} onChange={change(setRent)} testid="calc-input-rent" />
            <Input label="Hire and reward insurance" prefix="£" suffix="a week" value={insurance} onChange={change(setInsurance)} testid="calc-input-insurance" />
            <Input label="Servicing and wear" prefix="£" suffix="a week" value={maintenance} onChange={change(setMaintenance)} testid="calc-input-maintenance" />
            <Input label="Licensing and inspection" prefix="£" suffix="a year" value={licensing} onChange={change(setLicensing)} testid="calc-input-licensing" />
            <Input label="Depreciation" suffix="% a year" value={depreciation} onChange={change(setDepreciation)} testid="calc-input-depreciation" />
            <Input label="Purchase price" prefix="£" value={price} readOnly testid="calc-input-price" />
          </div>

          <div className="mt-5 flex gap-2.5 items-start rounded-2xl bg-white ring-1 ring-slate-200/70 p-3.5">
            <Info className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.8} />
            <p className="text-[12.5px] text-[#4A564F] leading-relaxed">
              These are estimates to help you think it through, not a quote or financial advice. Licensing
              fees differ by authority and change year to year, insurance depends on your own record, and
              finance costs are not included. Check every figure against your own quotes before you commit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const Bar = ({ label, total, width, tone, weekly, testid }) => (
  <div data-testid={testid}>
    <div className="flex items-baseline justify-between gap-3 flex-wrap text-[13.5px] mb-1.5">
      <span className="text-[#1A2E25] font-medium">{label}</span>
      <span className="font-heading font-bold text-[#1A2E25] whitespace-nowrap">
        {formatPrice(total)} <span className="text-[12px] font-normal text-[#7A857F]">≈ £{weekly}/wk</span>
      </span>
    </div>
    <div className="h-3 rounded-full bg-[#EFEDE8] overflow-hidden">
      <div style={{ width: `${Math.max(width, 2)}%` }}
        className={`h-full rounded-full transition-all duration-500 ${tone === "own" ? "bg-[#0B6B4F]" : "bg-[#C08A2D]"}`} />
    </div>
  </div>
);

const Cell = ({ label, value, highlight }) => (
  <div className={`rounded-2xl p-4 ${highlight ? "bg-[#E6F5F0] ring-1 ring-[#0B6B4F]/15" : "bg-[#F9F8F6] ring-1 ring-slate-200/70"}`}>
    <div className="text-[12px] text-[#7A857F] leading-snug">{label}</div>
    <div className="font-heading font-bold text-[#1A2E25] text-[18px] mt-1.5">{value}</div>
  </div>
);

const Input = ({ label, prefix, suffix, value, onChange, readOnly, testid }) => (
  <label className="block">
    <span className="text-[12.5px] font-medium text-[#4A564F] block mb-1.5">{label}</span>
    <span className={`flex items-center gap-1 h-11 rounded-xl px-3 ring-1 transition-colors ${
      readOnly ? "bg-[#EFEDE8] ring-transparent" : "bg-white ring-slate-200 focus-within:ring-2 focus-within:ring-[#0B6B4F]"}`}>
      {prefix && <span className="text-[15px] text-[#7A857F]">{prefix}</span>}
      <input type="number" inputMode="numeric" value={value} onChange={onChange} readOnly={readOnly}
        data-testid={testid} aria-label={label}
        className="flex-1 min-w-0 bg-transparent text-[15px] font-medium text-[#1A2E25] outline-none" />
      {suffix && <span className="text-[12px] text-[#7A857F] whitespace-nowrap">{suffix}</span>}
    </span>
  </label>
);
