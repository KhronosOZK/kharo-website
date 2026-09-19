import { motion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

/**
 * The top of every page except the homepage, which runs its own marketplace
 * hero.
 *
 * One charcoal band: the proposition on the left, the photograph held in a
 * framed object on the right. The photograph is a subject, not a background
 * wash with type dropped on top, so the copy never has to fight it for
 * contrast and the page reads the same on every image.
 *
 * `size="band"` drops the image for pages whose real content is a form.
 */
export default function PageHero({
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
  const showImage = !band && Boolean(img);

  return (
    <section className={`relative isolate bg-night text-white ${className}`} data-testid="page-hero">
      <div
        className={`wrap relative pt-[calc(var(--header-h)+clamp(1.5rem,4.5vh,2.75rem))]
                    ${band ? "pb-[clamp(1.75rem,4vh,2.5rem)]" : "pb-[clamp(2rem,5vh,3rem)]"}`}
      >
        <div
          className={
            showImage
              ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16"
              : ""
          }
        >
          <div className={band ? "max-w-[58ch]" : ""}>
            {eyebrow && <p className="text-[12.5px] font-semibold text-white/55">{eyebrow}</p>}

            <h1
              className={`mt-4 font-heading font-extrabold tracking-[-0.025em] leading-[1.05]
                          ${band ? "text-h2 max-w-[24ch]" : "text-h1 max-w-[20ch]"}`}
            >
              {heading}
            </h1>

            {sub && (
              <p className="mt-4 max-w-[50ch] text-lead leading-relaxed text-white/70">{sub}</p>
            )}

            {meta.length > 0 && (
              <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/12 pt-5">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="text-[11.5px] font-medium text-white/50">{m.label}</dt>
                    <dd className="mt-1 text-[15px] font-heading font-bold text-white">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {children && <div className="mt-8">{children}</div>}

            {caption && (
              <p className="mt-7 max-w-[46ch] text-[12.5px] leading-relaxed text-white/45">{caption}</p>
            )}
          </div>

          {showImage && (
            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.reveal, ease: EASE.out, delay: 0.08 }}
              className="overflow-hidden rounded-2xl border border-white/12 bg-obsidian-2"
            >
              <div className="aspect-[16/11]">
                <img
                  src={img}
                  alt={imgAlt}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: position }}
                  {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
                  decoding="async"
                />
              </div>
            </motion.figure>
          )}
        </div>
      </div>
    </section>
  );
}
