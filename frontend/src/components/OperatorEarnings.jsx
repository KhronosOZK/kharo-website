import { useState } from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Slider } from "@/components/ui/slider";
import { OPERATOR_INTEREST } from "@/content/site";

// Same default used as the slider's starting point on both surfaces.
const AVG_WEEKLY_RATE = 185;

/**
 * The idle-cost calculator: what standing cars cost an operator, per week,
 * per month and per year. Shared by /list-your-fleet, where it sits beside
 * the interest form, and /operator-guide, where it stands on its own, so
 * both surfaces show the same instrument rather than two different ones.
 */
export default function OperatorEarnings({ className = "" }) {
  const [idleCount, setIdleCount] = useState(4);
  const [weeklyRate, setWeeklyRate] = useState(AVG_WEEKLY_RATE);
  const weeklyLoss = idleCount * weeklyRate;
  const monthlyLoss = Math.round(weeklyLoss * 4.33);
  const yearlyLoss = weeklyLoss * 52;
  const { loss } = OPERATOR_INTEREST;

  return (
    <div className={`surface-raised rounded-lg p-card max-w-md ${className}`} data-testid="operator-loss-card">
      <p className="text-[14px] font-medium text-ink-3">{loss.label}</p>
      <div className="flex items-end gap-2 mt-1.5">
        <AnimatedNumber value={weeklyLoss} prefix="£" data-testid="operator-loss-value" className="text-stat font-heading font-extrabold text-ink" />
        <span className="text-ink-3 text-[15px] pb-1.5">a week</span>
      </div>
      <div className="mt-5 hairline" />

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[14px] font-medium text-ink-2">{loss.idle}</span>
          <span className="text-[15px] font-heading font-bold text-ink tabular">{idleCount} {idleCount === 1 ? "car" : "cars"}</span>
        </div>
        <Slider value={[idleCount]} onValueChange={([v]) => setIdleCount(v)} min={1} max={20} step={1} aria-label={loss.idle} data-testid="operator-idle-slider" />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[14px] font-medium text-ink-2">{loss.rate}</span>
          <span className="text-[15px] font-heading font-bold text-ink tabular">£{weeklyRate}</span>
        </div>
        <Slider value={[weeklyRate]} onValueChange={([v]) => setWeeklyRate(v)} min={100} max={300} step={5} aria-label={loss.rate} data-testid="operator-rate-slider" />
      </div>

      <dl className="mt-5 divide-y divide-line border-y border-line text-[14px]">
        <Line l={loss.perWeek} v={weeklyLoss} strong />
        <Line l={loss.perMonth} v={monthlyLoss} />
        <Line l={loss.perYear} v={yearlyLoss} />
      </dl>
      <p className="mt-4 text-[13px] text-ink-3 leading-relaxed">{loss.note}</p>
    </div>
  );
}

const Line = ({ l, v, strong }) => (
  <div className="flex justify-between py-2.5">
    <dt className="text-ink-3">{l}</dt>
    <dd className={strong ? "text-ink font-semibold" : "text-ink-2"}>
      <AnimatedNumber value={v} prefix="£" />
    </dd>
  </div>
);
