import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { MOCK_LISTINGS } from "@/data/mockListings";
import { OPERATOR_EARNINGS } from "@/content/pages/operatorEarnings";

const WEEKS_PER_YEAR = 52;

/**
 * What a fleet earns on Kharo, and what the empty seats cost while it does not.
 *
 * Deliberately shows both numbers: the annual figure is the reason to list, the
 * idle figure is the reason to do it now. Utilisation is the honest dial, since
 * nobody rents every car every week.
 */
export default function OperatorEarnings({ className = "" }) {
  const navigate = useNavigate();
  const [cars, setCars] = useState(10);
  const [utilisation, setUtilisation] = useState(85);

  const rents = useMemo(() => MOCK_LISTINGS.map((v) => v.weekly_rent), []);
  const bounds = useMemo(() => [Math.min(...rents), Math.max(...rents)], [rents]);
  const [rate, setRate] = useState([165, 215]);

  const midRate = Math.round((rate[0] + rate[1]) / 2);
  const rentedCars = (cars * utilisation) / 100;
  const perWeek = Math.round(rentedCars * midRate);
  const perYear = perWeek * WEEKS_PER_YEAR;
  const idleCars = cars - rentedCars;
  const idleCost = Math.round(idleCars * midRate * WEEKS_PER_YEAR);

  const t = OPERATOR_EARNINGS;

  return (
    <div className={`surface-raised overflow-hidden ${className}`} data-testid="operator-earnings">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Inputs */}
        <div className="p-card border-b md:border-b-0 md:border-r border-line">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="oe-cars" className="text-[13.5px] font-medium text-ink-2">{t.carsLabel}</label>
              <span className="text-[15px] font-heading font-bold text-ink tabular">{cars}</span>
            </div>
            <input
              id="oe-cars" type="range" min={1} max={60} value={cars}
              onChange={(e) => setCars(Number(e.target.value))}
              data-testid="oe-cars"
              className="mt-2.5 w-full h-6 accent-green cursor-pointer"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="oe-util" className="text-[13.5px] font-medium text-ink-2">{t.utilLabel}</label>
              <span className="text-[15px] font-heading font-bold text-ink tabular">{utilisation}%</span>
            </div>
            <input
              id="oe-util" type="range" min={40} max={100} value={utilisation}
              onChange={(e) => setUtilisation(Number(e.target.value))}
              data-testid="oe-util"
              className="mt-2.5 w-full h-6 accent-green cursor-pointer"
            />
            <p className="mt-1.5 text-[12px] text-ink-3">{t.utilNote}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-line">
            <p className="text-[13.5px] font-medium text-ink-2 mb-2">{t.rateLabel}</p>
            <PriceRangeFilter
              values={rents}
              min={bounds[0]}
              max={bounds[1]}
              value={rate}
              onChange={setRate}
              id="oe-rate"
              countLabel={(n) => t.comparable(n)}
            />
            <p className="mt-2 text-[12px] text-ink-3">{t.rateNote}</p>
          </div>
        </div>

        {/* Output */}
        <div className="p-card bg-surface-2/40">
          <p className="text-[13px] text-ink-3">{t.yearLabel}</p>
          <p className="mt-1 font-heading font-extrabold text-ink leading-none text-[clamp(2.25rem,1.6rem+2.8vw,3.25rem)]">
            <AnimatedNumber value={perYear} prefix="£" data-testid="oe-year" />
          </p>

          <dl className="mt-6 divide-y divide-line border-y border-line">
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-[13.5px] text-ink-2">{t.weekLabel}</dt>
              <dd className="text-[15px] font-semibold text-ink tabular"><AnimatedNumber value={perWeek} prefix="£" /></dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-[13.5px] text-ink-2">{t.rentedLabel}</dt>
              <dd className="text-[15px] font-semibold text-ink tabular">{Math.round(rentedCars)} of {cars}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-[13.5px] text-ink-2">{t.idleLabel}</dt>
              <dd className="text-[15px] font-semibold text-danger tabular"><AnimatedNumber value={idleCost} prefix="£" /></dd>
            </div>
          </dl>

          <p className="mt-4 text-[12.5px] text-ink-3 leading-relaxed">{t.disclaimer}</p>

          <button
            type="button"
            onClick={() => navigate("/list-your-fleet")}
            data-testid="oe-cta"
            className="pressable mt-5 w-full h-12 rounded-md bg-green hover:bg-green-hover text-white font-semibold text-[14.5px] inline-flex items-center justify-center gap-2"
          >
            {t.cta} <ArrowRight size={16} strokeWidth={2} />
          </button>
          <p className="mt-2 text-center text-[12px] text-ink-3">{t.ctaNote}</p>
        </div>
      </div>
    </div>
  );
}
