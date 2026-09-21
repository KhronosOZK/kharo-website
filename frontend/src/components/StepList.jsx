import { useRef } from "react";
import { useInView } from "framer-motion";

/**
 * One sequence of steps that reads itself as you scroll. On a phone it is a
 * single column with the numbers down the left. On a wide screen it zigzags
 * down a centre spine: 1 on the left, 2 on the right, 3 on the left, so the
 * eye follows one path and only one step is ever "current".
 *
 * The step nearest the middle of the screen is active: its number fills
 * green, its text goes to full ink. Steps you have passed stay green; the
 * ones ahead sit quieter. One IntersectionObserver per step, no scroll maths.
 *
 * Used by pages/ForDrivers.jsx and pages/OperatorGuide.jsx.
 */
function Step({ n, title, body, last, right }) {
  const ref = useRef(null);
  const active = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const seen = useInView(ref, { margin: "0px 0px 100000px 0px" });
  const above = seen && !active && ref.current && ref.current.getBoundingClientRect().top < window.innerHeight * 0.4;
  const done = active || above;

  const badge = (
    <span
      aria-hidden="true"
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border text-[14px] font-bold tabular transition-[background-color,border-color,color,transform] duration-300 ease-out sm:h-11 sm:w-11 sm:text-[15px] ${done ? "border-green bg-green text-ink" : "border-line-strong bg-surface text-ink-3"} ${active ? "scale-105" : ""}`}
    >
      {n}
    </span>
  );
  const text = (
    <div className={`transition-opacity duration-300 ease-out ${active ? "opacity-100" : done ? "opacity-85" : "opacity-55"}`}>
      <h3 className="font-heading text-h3 font-bold text-ink">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2 measure-narrow">{body}</p>
    </div>
  );

  return (
    <li ref={ref} className="relative">
      {/* Phone and tablet: number left, text right. */}
      <div className="grid grid-cols-[2.25rem_1fr] gap-x-4 lg:hidden">
        <div className="flex flex-col items-center">
          {badge}
          {!last && <span aria-hidden="true" className={`mt-2 w-px flex-1 transition-colors duration-300 ${done ? "bg-green" : "bg-line"}`} />}
        </div>
        <div className="pb-8 pt-1.5">{text}</div>
      </div>

      {/* Wide screens: zigzag either side of a centre spine. */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_3.5rem_1fr] lg:gap-x-8">
        <div className={`pb-12 pt-2.5 ${right ? "" : "lg:text-right lg:[&_p]:ml-auto lg:[&_h3]:ml-auto"}`}>{right ? null : text}</div>
        <div className="flex flex-col items-center">
          {badge}
          {!last && <span aria-hidden="true" className={`mt-2 w-px flex-1 transition-colors duration-300 ${done ? "bg-green" : "bg-line"}`} />}
        </div>
        <div className="pb-12 pt-2.5">{right ? text : null}</div>
      </div>
    </li>
  );
}

export default function StepList({ items, start = 1, className = "" }) {
  return (
    <ol className={className} data-testid="step-list">
      {items.map((s, i) => (
        <Step key={s.t} n={start + i} title={s.t} body={s.d} last={i === items.length - 1} right={i % 2 === 1} />
      ))}
    </ol>
  );
}
