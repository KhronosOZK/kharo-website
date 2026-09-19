import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, useMotionPrefs } from "@/lib/motion";

/**
 * The way through to a long-form guide. Built as a full-width band rather than
 * a button, because the guide is the next chapter, not a side action.
 *
 * The pointer drives a soft spotlight and a slight parallax on the contents
 * list, so it reads as a surface you can push into rather than a static box.
 * Everything collapses to a plain, still panel under reduced motion.
 */
export default function GuideLink({ kicker, heading, sub, contents = [], to, cta, testId = "guide-link" }) {
  const { reduce } = useMotionPrefs();
  const ref = useRef(null);
  const [hovering, setHovering] = useState(false);

  // Pointer position as motion values, never React state, so moving the mouse
  // does not re-render the tree.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 140, damping: 20, mass: 0.4 });

  const glow = useTransform(
    [sx, sy],
    ([x, y]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(95,211,166,0.16), transparent 70%)`
  );
  const shiftX = useTransform(sx, [0, 1], [6, -6]);

  const onMove = (e) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  return (
    <Link
      ref={ref}
      to={to}
      data-testid={testId}
      onPointerMove={onMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => { setHovering(false); px.set(0.5); py.set(0.5); }}
      className="pressable group relative block overflow-hidden rounded-lg border border-line-strong bg-ink text-white"
    >
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-ui ease-out group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}

      <div className="relative grid gap-6 p-card md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-10">
        <div>
          <p className="text-[12.5px] font-semibold text-mint">{kicker}</p>
          <h3 className="mt-2 font-heading text-h3 font-extrabold leading-tight text-white">{heading}</h3>
          <p className="mt-2.5 max-w-[42ch] text-[14.5px] leading-relaxed text-white/70">{sub}</p>

          <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-white">
            {cta}
            <motion.span
              aria-hidden
              animate={hovering && !reduce ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.22, ease: EASE.out }}
              className="inline-flex"
            >
              <ArrowRight size={17} strokeWidth={2.25} />
            </motion.span>
          </span>

          {/* Rule that draws in from the left on hover */}
          <motion.span
            aria-hidden
            className="mt-2 block h-px w-36 origin-left bg-mint"
            initial={false}
            animate={{ scaleX: hovering && !reduce ? 1 : 0 }}
            transition={{ duration: 0.32, ease: EASE.out }}
          />
        </div>

        {/* What is actually inside the guide */}
        <motion.ol
          className="divide-y divide-white/10 border-y border-white/10"
          style={reduce ? undefined : { x: shiftX }}
        >
          {contents.map((c, i) => (
            <li key={c} className="flex items-baseline gap-3 py-2.5">
              <span className="tabular text-[11.5px] font-semibold text-white/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13.5px] text-white/85">{c}</span>
            </li>
          ))}
        </motion.ol>
      </div>
    </Link>
  );
}
