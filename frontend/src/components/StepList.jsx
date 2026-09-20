import { useRef } from "react";
import { useInView } from "framer-motion";

/**
 * A numbered list of steps that reads itself as you scroll: the step in the
 * middle of the screen is the active one, its number fills green and its
 * text goes to full ink; steps you have passed stay green, steps still to
 * come sit quieter. One IntersectionObserver per step, no scroll maths.
 *
 * Used by pages/ForDrivers.jsx and pages/OperatorGuide.jsx.
 */
function Step({ n, title, body, last }) {
  const ref = useRef(null);
  // "Active" is the band across the middle of the screen. "Passed" is
  // anything whose top has gone above that band, tracked with a second
  // observer whose root margin extends far below the viewport.
  const active = useInView(ref, { margin: "-42% 0px -42% 0px" });
  const passedOrActive = useInView(ref, { margin: "0px 0px 100000px 0px" });
  const above = passedOrActive && !active && ref.current && ref.current.getBoundingClientRect().top < window.innerHeight * 0.42;
  const done = active || above;

  return (
    <li ref={ref} className="grid grid-cols-[2.25rem_1fr] gap-x-4 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5">
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border text-[13.5px] font-bold tabular transition-[background-color,border-color,color,transform] duration-300 ease-out sm:h-11 sm:w-11 sm:text-[15px] ${done ? "border-green bg-green text-ink" : "border-line-strong bg-surface text-ink-3"} ${active ? "scale-105" : ""}`}
        >
          {n}
        </span>
        {!last && <span aria-hidden="true" className={`mt-2 w-px flex-1 transition-colors duration-300 ${done ? "bg-green" : "bg-line"}`} />}
      </div>
      <div className={`pb-8 transition-opacity duration-300 ease-out sm:pb-10 ${active ? "opacity-100" : done ? "opacity-85" : "opacity-55"}`}>
        <h3 className="pt-1.5 font-heading text-h3 font-bold text-ink sm:pt-2.5">{title}</h3>
        <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2 measure-narrow">{body}</p>
      </div>
    </li>
  );
}

export default function StepList({ items, start = 1, className = "" }) {
  return (
    <ol className={className}>
      {items.map((s, i) => (
        <Step key={s.t} n={start + i} title={s.t} body={s.d} last={i === items.length - 1} />
      ))}
    </ol>
  );
}
