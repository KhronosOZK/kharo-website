import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export function AnimatedNumber({ value, prefix = "", suffix = "", className = "", ...rest }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.65, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span className={className} {...rest}>{text}</motion.span>;
}
