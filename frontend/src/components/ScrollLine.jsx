import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useMotionPrefs } from "@/lib/motion";

/**
 * A step list whose left rule fills green as the reader scrolls down it and
 * empties again on the way back up. Used on the driver and operator pages
 * for the "how it works" columns. Reduced motion shows the rule filled.
 */
export default function ScrollTrack({ as: As = "ol", className = "", children, ...rest }) {
  const ref = useRef(null);
  const { reduce } = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 62%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className="relative">
      <motion.span
        aria-hidden="true"
        style={{ scaleY: reduce ? 1 : scaleY }}
        className="pointer-events-none absolute -left-px top-0 h-full w-[2px] origin-top bg-green"
      />
      <As className={className} {...rest}>{children}</As>
    </div>
  );
}
