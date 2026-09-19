import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Enter } from "@/components/Reveal";

/**
 * The hero every page wears.
 *
 * One photograph in an inset rounded frame, with the page's own word set to
 * span the frame and get cropped by its bottom edge. The crop is vertical
 * only: the word is measured and scaled to fit the frame's width exactly, so
 * no letter is ever sliced down the side. Guessing an average character width
 * instead of measuring is what produced "OPERATO" and "WHY KHA".
 *
 * The frame clips decoration ONLY. Copy sits in a sibling layer that is never
 * clipped, so popovers opened inside a hero can escape it.
 */
export default function PageHero({
  word,
  eyebrow,
  heading,
  sub,
  img,
  imgAlt = "",
  position = "50% center",
  meta = [],
  caption,
  children,
  priority = false,
  size = "full",
  className = "",
}) {
  const band = size === "band";
  // The crop word needs a full-height frame to land; in the short band it
  // came out at a quarter width and looked like a mistake.
  const crop = band ? null : word;
  const frameRef = useRef(null);
  const gaugeRef = useRef(null);
  const [fontPx, setFontPx] = useState(0);

  // Measured off a hidden twin pinned at 100px, never off the visible word.
  // Writing a measuring size onto the live element and relying on the next
  // render to put it back silently fails: when the computed size matches the
  // current state React skips the re-render, and the element is left stuck at
  // the measuring size.
  const fit = useCallback(() => {
    const frame = frameRef.current;
    const gauge = gaugeRef.current;
    if (!frame || !gauge || !crop) return;
    const natural = gauge.getBoundingClientRect().width;
    if (!natural) return;
    // Width alone made a five-letter word enormous and a nine-letter word
    // modest: "KHARO" reached 305px where "OPERATORS" sat at 180px. Capping
    // against the frame's own height keeps the word in proportion to the
    // photograph and keeps every page at roughly the same weight.
    // Width sets the size so the word spans the frame; height caps it so a
    // short word cannot balloon. 0.38 is the loosest cap that still keeps
    // every page inside an 84-97% fill, which reads as one deliberate
    // treatment rather than a different decision per page.
    const byWidth = (100 * frame.clientWidth * 0.97) / natural;
    const byHeight = frame.clientHeight * 0.38;
    setFontPx(Math.max(28, Math.min(byWidth, byHeight)));
  }, [crop]);

  useLayoutEffect(() => {
    if (!crop) return undefined;
    fit();
    const ro = new ResizeObserver(fit);
    if (frameRef.current) ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, [crop, fit]);

  // Webfonts land after first paint and change every advance width.
  useEffect(() => {
    if (!crop || !document.fonts?.ready) return;
    document.fonts.ready.then(fit).catch(() => {});
  }, [crop, fit]);

  // Keep the copy clear of the word instead of letting buttons sit on top of
  // it. 0.62 is the share of the line box left visible after the bottom crop.
  const clearance = fontPx ? Math.round(fontPx * 0.62) + 26 : 0;

  return (
    <section className={`relative isolate text-white ${className}`}>
      <div ref={frameRef} className="absolute inset-[clamp(0.5rem,1vw,0.875rem)] rounded-hero overflow-hidden bg-night">
        <img
          src={img}
          alt={imgAlt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
          {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
          decoding="async"
        />
        {/* Three scrims: the photographs run from night streets to a bright
            showroom and the copy has to hold on all of them. */}
        <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/45 to-night/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-night/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/80 to-transparent" />

        {crop && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
            style={{ height: fontPx ? `${Math.round(fontPx * 0.62)}px` : 0 }}
          >
            <span
              className="block whitespace-nowrap font-heading font-extrabold leading-[0.78]
                         tracking-[-0.03em] text-white/[0.18] select-none"
              style={{ fontSize: fontPx ? `${fontPx}px` : "100px", visibility: fontPx ? "visible" : "hidden" }}
            >
              {crop}
            </span>
          </div>
        )}
      </div>

      {/* The gauge: same face, weight and tracking, fixed at 100px, out of
          flow and out of the accessibility tree. Only ever read from. */}
      {crop && (
        <span
          ref={gaugeRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-[-9999px] top-0 whitespace-nowrap font-heading
                     font-extrabold leading-[0.78] tracking-[-0.03em]"
          style={{ fontSize: "100px", visibility: "hidden" }}
        >
          {crop}
        </span>
      )}

      <div
        className={`wrap relative flex flex-col justify-end
                    px-[clamp(0.5rem,1vw,0.875rem)]
                    pt-[calc(var(--header-h)+clamp(1.5rem,5vh,3rem))]
                    ${band ? "min-h-band" : "min-h-hero"}`}
        style={{ paddingBottom: clearance || undefined }}
      >
        {meta.length > 0 && (
          <Enter delay={0.1} className="absolute right-[clamp(1.5rem,4vw,3.5rem)] top-[calc(var(--header-h)+1.5rem)] hidden md:block text-right">
            <dl className="space-y-3">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">{m.label}</dt>
                  <dd className="text-[15px] font-heading font-bold text-white/90 tabular">{m.value}</dd>
                </div>
              ))}
            </dl>
          </Enter>
        )}

        {eyebrow && (
          <Enter as="p" className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/60">
            {eyebrow}
          </Enter>
        )}

        <Enter as="h1" delay={0.04}
          className={`font-heading font-extrabold leading-[1.04] tracking-[-0.02em] max-w-[18ch]
                      ${band ? "text-h2" : "text-h1"}`}>
          {heading}
        </Enter>

        {sub && (
          <Enter as="p" delay={0.09} className="mt-4 text-lead text-white/75 max-w-[46ch]">
            {sub}
          </Enter>
        )}

        {children && <Enter delay={0.14} className="mt-8">{children}</Enter>}

        {caption && (
          <Enter as="p" delay={0.22}
            className="mt-10 max-w-[34ch] text-[12.5px] leading-relaxed text-white/60">
            {caption}
          </Enter>
        )}
      </div>
    </section>
  );
}
