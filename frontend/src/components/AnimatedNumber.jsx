import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { SPRING, useMotionPrefs } from "@/lib/motion";

/**
 * A number that morphs to its new value instead of restarting from zero.
 * Pass `from` for a deliberate one-time count-up (e.g. when a card enters view).
 */
export function AnimatedNumber({
  value, from, prefix = "", suffix = "", decimals = 0, transition = SPRING.ui, className, ...rest
}) {
  const { reduce } = useMotionPrefs();
  const mv = useMotionValue(from ?? value);
  const text = useTransform(mv, (v) =>
    `${prefix}${Number(v).toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
  );
  useEffect(() => {
    if (reduce) { mv.set(value); return undefined; }
    const c = animate(mv, value, transition);
    return () => c.stop();
  }, [value, mv, reduce, transition]);
  return <motion.span className={`tabular ${className || ""}`} {...rest}>{text}</motion.span>;
}

export default AnimatedNumber;
