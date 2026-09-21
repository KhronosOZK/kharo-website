import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotionPrefs } from "@/lib/motion";

/**
 * Weekly-rent range with the real distribution drawn behind it.
 *
 * The histogram is the point: a driver can see at a glance that most cars sit
 * between £150 and £200, and watch the count fall as they drag the handles in.
 * Bars come from the unfiltered set so the shape stays stable while you drag,
 * and the count reflects the current selection.
 */
export default function PriceRangeFilter({
  values,                 // every weekly_rent in the current result set
  min, max,               // bounds; derived from values when omitted
  value,                  // [lo, hi]
  onChange,
  buckets = 18,
  countLabel = (n) => `${n} ${n === 1 ? "car" : "cars"} in range`,
  className = "",
  id = "price-range",
  compact = false,
  showCount = false,
}) {
  const { reduce } = useMotionPrefs();
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null); // "lo" | "hi" | null

  const lowest = min ?? Math.min(...values);
  const highest = max ?? Math.max(...values);
  const span = Math.max(1, highest - lowest);

  const [lo, hi] = value;
  const pct = useCallback((v) => ((v - lowest) / span) * 100, [lowest, span]);

  // Distribution of the whole set, bucketed once.
  const bars = useMemo(() => {
    const out = new Array(buckets).fill(0);
    for (const v of values) {
      const i = Math.min(buckets - 1, Math.floor(((v - lowest) / span) * buckets));
      out[i] += 1;
    }
    const peak = Math.max(1, ...out);
    return out.map((n, i) => ({
      n,
      h: n === 0 ? 0.06 : 0.18 + (n / peak) * 0.82,
      from: lowest + (i / buckets) * span,
      to: lowest + ((i + 1) / buckets) * span,
    }));
  }, [values, buckets, lowest, span]);

  const inRange = useMemo(() => values.filter((v) => v >= lo && v <= hi).length, [values, lo, hi]);

  const valueFromClientX = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return lo;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    return Math.round(lowest + ratio * span);
  }, [lo, lowest, span]);

  // Pointer events only: no window scroll/resize listeners, and pointer capture
  // keeps the drag alive if the finger leaves the track.
  useEffect(() => {
    if (!dragging) return undefined;
    const move = (e) => {
      const v = valueFromClientX(e.clientX);
      if (dragging === "lo") onChange([Math.min(v, hi - 5), hi]);
      else onChange([lo, Math.max(v, lo + 5)]);
    };
    const up = () => setDragging(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, hi, lo, onChange, valueFromClientX]);

  const onKey = (which) => (e) => {
    const step = e.shiftKey ? 25 : 5;
    let next = which === "lo" ? lo : hi;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next += step;
    else if (e.key === "Home") next = lowest;
    else if (e.key === "End") next = highest;
    else return;
    e.preventDefault();
    next = Math.min(highest, Math.max(lowest, next));
    if (which === "lo") onChange([Math.min(next, hi - 5), hi]);
    else onChange([lo, Math.max(next, lo + 5)]);
  };

  const handle = (which, v) => (
    <button
      type="button"
      role="slider"
      aria-label={which === "lo" ? "Minimum weekly rent" : "Maximum weekly rent"}
      aria-valuemin={lowest}
      aria-valuemax={highest}
      aria-valuenow={v}
      aria-valuetext={`£${v} a week`}
      data-testid={`${id}-${which}`}
      onPointerDown={(e) => { e.preventDefault(); setDragging(which); }}
      onKeyDown={onKey(which)}
      style={{ left: `${pct(v)}%` }}
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-surface border-2 border-ink shadow-1 cursor-grab active:cursor-grabbing touch-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green/30 after:absolute after:-inset-2.5 after:content-['']"
    />
  );

  return (
    <div className={className} data-testid={id}>
      <div className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 ${compact ? "" : "mb-2"}`}>
        <span className={`font-medium text-ink tabular ${compact ? "text-[14px]" : "text-[14px]"}`}>£{lo} to £{hi}</span>
        {!compact && showCount && (
          <span className="text-[13px] text-ink-3 tabular" data-testid={`${id}-count`} aria-live="polite">
            {countLabel(inRange)}
          </span>
        )}
      </div>

      {/* Distribution */}
      {!compact && (
      <div className="flex items-end gap-[2px] h-11" aria-hidden="true">
        {bars.map((b, i) => {
          const active = b.to >= lo && b.from <= hi;
          return (
            <span
              key={i}
              style={{
                height: `${b.h * 100}%`,
                transition: reduce ? "none" : "background-color 160ms var(--ease-out)",
              }}
              className={`flex-1 rounded-[1px] ${active ? "bg-green" : "bg-line-strong"}`}
            />
          );
        })}
      </div>
      )}

      {/* Track */}
      <div ref={trackRef} className={`relative select-none ${compact ? "h-5 mt-0.5" : "h-6 mt-1"}`}>
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-surface-2" />
        <span
          className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-ink"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        {handle("lo", lo)}
        {handle("hi", hi)}
      </div>
    </div>
  );
}
