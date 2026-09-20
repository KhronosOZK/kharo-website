import { motion } from "framer-motion";
import { EASE, DUR, useMotionPrefs } from "@/lib/motion";

// The one entrance on a page top: each line settles up 16px as it appears.
const RISE = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.out } } };

/**
 * The top of every page except the homepage, which runs its own search hero.
 *
 * One photograph across the full width, the heading and one line set on it,
 * and whatever the page needs next (a button, a fact row, a small form) held
 * in the same column. The same object on every page, so nothing at the top
 * of the site reads as a different product.
 *
 * `size="band"` drops the photograph for pages whose real content is a form.
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
  aside,
  priority = false,
  size = "full",
  className = "",
}) {
  const { reduce } = useMotionPrefs();
  const band = size === "band" || !img;

  if (band) {
    return (
      <section className={`border-b border-line bg-surface ${className}`} data-testid="page-hero">
        <div className="wrap pt-[calc(var(--header-h)+2rem)] pb-8 sm:pb-10">
          <div className="max-w-[58ch]">
            <h1 className="font-heading text-h2 font-extrabold tracking-[-0.02em] leading-[1.05] text-ink max-w-[24ch]">{heading}</h1>
            {sub && <p className="mt-3 max-w-[52ch] text-lead leading-relaxed text-ink-2">{sub}</p>}
            {children && <div className="mt-6">{children}</div>}
            {caption && <p className="mt-5 max-w-[48ch] text-[12.5px] leading-relaxed text-ink-3">{caption}</p>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative isolate -mt-[var(--header-h)] overflow-hidden bg-night ${className}`} data-testid="page-hero" data-hero-photo="true">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.reveal, ease: EASE.out }}
        className="absolute inset-0"
      >
        <img
          src={img}
          alt={imgAlt}
          className="h-full w-full object-cover"
          style={{ objectPosition: position }}
          {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night/80 via-night/55 to-night/25" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/70 to-transparent" />
      </motion.div>

      <div className="wrap relative grid gap-8 pt-[calc(var(--header-h)+2rem)] pb-10 sm:pb-14 sm:pt-[calc(var(--header-h)+3rem)] lg:min-h-[27rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
        <motion.div
          className="text-white"
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          <motion.h1 variants={RISE} className="font-heading text-h1 font-extrabold tracking-[-0.02em] leading-[1.05] max-w-[18ch]">{heading}</motion.h1>
          {sub && <motion.p variants={RISE} className="mt-4 max-w-[50ch] text-lead leading-relaxed text-white/85">{sub}</motion.p>}

          {meta.length > 0 && (
            <motion.dl variants={RISE} className="mt-6 grid gap-x-8 gap-y-3 border-t border-white/20 pt-4 sm:grid-cols-3">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-[12.5px] font-medium text-white/65">{m.label}</dt>
                  <dd className="mt-0.5 text-[14.5px] font-semibold text-white">{m.value}</dd>
                </div>
              ))}
            </motion.dl>
          )}

          {children && <motion.div variants={RISE} className="mt-7 flex flex-wrap gap-3">{children}</motion.div>}
          {caption && <motion.p variants={RISE} className="mt-6 max-w-[48ch] text-[12.5px] leading-relaxed text-white/65">{caption}</motion.p>}
        </motion.div>

        {aside && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.out, delay: 0.25 }}
            className="rounded-lg border border-line bg-surface p-5 text-ink shadow-2 sm:p-6" data-testid="page-hero-aside">
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}
