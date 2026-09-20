import { motion } from "framer-motion";
import { EASE, DUR, useMotionPrefs } from "@/lib/motion";

/**
 * The top of every page except the homepage, which runs its own search hero.
 *
 * Same register as the homepage: white ground, the heading carrying its own
 * weight with no label above it, and the photograph held as a framed object
 * on the right rather than a wash behind the words. Copy never has to fight
 * an image for contrast, and every page top reads the same.
 *
 * `size="band"` drops the image for pages whose real content is a form.
 */
export default function PageHero({
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
  const { reduce } = useMotionPrefs();
  const band = size === "band";
  const showImage = !band && Boolean(img);

  return (
    <section className={`border-b border-line bg-white ${className}`} data-testid="page-hero">
      <div
        className={`wrap pt-[calc(var(--header-h)+2rem)] ${band ? "pb-8 sm:pb-10" : "pb-10 sm:pb-12"}
                    ${showImage ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-14" : ""}`}
      >
        <div className={band ? "max-w-[58ch]" : ""}>
          <h1
            className={`font-heading font-extrabold tracking-[-0.02em] leading-[1.05] text-ink
                        ${band ? "text-h2 max-w-[24ch]" : "text-h1 max-w-[20ch]"}`}
          >
            {heading}
          </h1>

          {sub && <p className="mt-3 max-w-[52ch] text-lead leading-relaxed text-ink-2">{sub}</p>}

          {meta.length > 0 && (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-4">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-[12.5px] font-medium text-ink-3">{m.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-semibold text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {children && <div className="mt-7">{children}</div>}

          {caption && (
            <p className="mt-6 max-w-[48ch] text-[12.5px] leading-relaxed text-ink-3">{caption}</p>
          )}
        </div>

        {showImage && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.reveal, ease: EASE.out }}
            className="overflow-hidden rounded-lg border border-line bg-surface-2"
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
    </section>
  );
}
