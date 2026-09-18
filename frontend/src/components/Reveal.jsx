import { motion } from "framer-motion";
import { reveal, revealGroup, inView } from "@/lib/motion";

/**
 * Scroll reveal, used once per section. Wrap the section's children in a
 * RevealGroup and give each block that should arrive separately a RevealItem.
 * Keep it to a heading block plus one content block; paragraphs never animate
 * on their own.
 */
export function RevealGroup({ as = "div", className, children, amount, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      variants={revealGroup}
      initial="hidden"
      whileInView="visible"
      viewport={amount ? { ...inView, amount } : inView}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}

export function RevealItem({ as = "div", className, children, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M variants={reveal} className={className} {...rest}>
      {children}
    </M>
  );
}

/** Mount-time entrance for content already in view at paint (heroes). */
export function Enter({ as = "div", className, children, delay = 0, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}
