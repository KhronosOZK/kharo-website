import { Enter } from "@/components/Reveal";

/**
 * The hero every page wears.
 *
 * One photograph held inside an inset rounded frame rather than bleeding to
 * the window edge, with the page's own word set large enough to run off both
 * sides and get cropped by the frame. The crop is the point: it reads as a
 * printed cover rather than a stock photo with a headline dropped on top,
 * and it gives each page a distinct identity while the furniture stays
 * identical everywhere.
 *
 * The frame clips decoration ONLY. Content sits in a sibling layer that is
 * never clipped, so popovers opened from inside a hero (the homepage search)
 * can escape it.
 */
export default function PageHero({
  word,            // the oversized crop word, e.g. "KHARO", "LONDON"
  eyebrow,         // one small label above the heading
  heading,
  sub,
  img,
  imgAlt = "",
  position = "50% center",
  meta = [],       // short factual pairs, set against the top right corner
  caption,         // one line against the bottom left of the frame
  children,        // search bar, buttons
  priority = false,
  // "band" is the short variant for pages whose real content is a form. It
  // carries the same frame and crop word at roughly a third of the height, so
  // the form stays above the fold instead of being pushed under a photograph.
  size = "full",
  className = "",
}) {
  const band = size === "band";
  // Every word spans the frame regardless of length: the longer the word, the
  // smaller the type, so "KHARO" and "OPERATORS" both bleed off the edges by
  // about the same amount. 0.6em is the average uppercase advance in Cabinet
  // Grotesk at this weight.
  const fill = word ? `min(${(112 / (word.length * 0.6)).toFixed(2)}vw, ${band ? 15 : 25}vw)` : null;

  return (
    <section className={`relative isolate text-white ${className}`}>
      {/* Decoration layer: clipped by the frame */}
      <div className="absolute inset-[clamp(0.5rem,1vw,0.875rem)] rounded-hero overflow-hidden bg-night">
        <img
          src={img}
          alt={imgAlt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
          {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
          decoding="async"
        />
        {/* Three scrims, because the photographs vary from night streets to a
            bright showroom and the copy has to hold on all of them: a full
            wash, a left column behind the text, and a deep foot so the crop
            word never disappears into a pale image. */}
        <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/45 to-night/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-night/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/80 to-transparent" />

        {word && (
          <Enter
            aria-hidden="true"
            delay={0.18}
            className="absolute inset-x-0 bottom-0 select-none text-center font-heading font-extrabold
                       leading-[0.78] tracking-[-0.035em] whitespace-nowrap text-white/[0.30]
                       mb-[-0.14em]"
            style={{ fontSize: fill }}
          >
            {word}
          </Enter>
        )}
      </div>

      {/* Content layer: never clipped */}
      <div className={`wrap relative flex flex-col justify-end
                      px-[clamp(0.5rem,1vw,0.875rem)]
                      pt-[calc(var(--header-h)+clamp(1.5rem,5vh,3rem))]
                      ${band ? "min-h-band pb-[clamp(1.75rem,4vh,2.75rem)]" : "min-h-hero pb-[clamp(2.5rem,7vh,4.5rem)]"}`}>
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
            className="mt-10 max-w-[34ch] text-[12.5px] leading-relaxed text-white/60
                       [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
            {caption}
          </Enter>
        )}
      </div>
    </section>
  );
}
