// Kharo motion system. Curves and durations mirror the CSS tokens in
// index.css so framer-motion and CSS transitions feel like one hand.
// Never type a bezier anywhere else.
import { useReducedMotion } from "framer-motion";

export const EASE = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
};

export const DUR = {
  press: 0.12, hover: 0.15, fast: 0.18, ui: 0.22, modal: 0.26, drawer: 0.4, reveal: 0.45, count: 0.6,
};

// Springs. bounce 0 is the house default: critically damped, no overshoot.
export const SPRING = {
  ui: { type: "spring", duration: 0.35, bounce: 0 },
  drawer: { type: "spring", duration: 0.45, bounce: 0.1 },
  success: { type: "spring", duration: 0.5, bounce: 0.25 }, // success screens only
};

// The one reveal. It moves, it never hides: text below the fold is readable
// the moment the page paints (and in a crawler, a screenshot, or a browser
// where the observer never fires), and only settles 14px upward on arrival.
export const reveal = {
  hidden: { y: 14 },
  visible: { y: 0, transition: { duration: DUR.reveal, ease: EASE.out } },
};

export const revealGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

// Fire once, slightly before the element is fully in view.
export const inView = { once: true, margin: "0px 0px -8% 0px" };

export function useMotionPrefs() {
  const reduce = useReducedMotion();
  return {
    reduce,
    loops: !reduce,
    t: (t) => (reduce ? { duration: 0.12 } : t),
  };
}
