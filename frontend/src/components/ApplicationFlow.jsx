import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, ArrowRight, RotateCcw } from "lucide-react";
import { EASE, SPRING, useMotionPrefs } from "@/lib/motion";
import { APPLICATION_FLOW } from "@/content/pages/applicationFlow";

const STEP_KEYS = ["car", "insurance", "send", "done"];

/**
 * The application, shown working: choose a car, choose your cover, send it.
 * It advances on its own the first time it is seen, and hands control to the
 * visitor the moment they touch it.
 */
export default function ApplicationFlow({ className = "" }) {
  const { cars, quotes, steps, sent } = APPLICATION_FLOW;
  const [step, setStep] = useState(0);
  const [car, setCar] = useState(cars[0].id);
  const [quote, setQuote] = useState(quotes[1].id);
  const [term, setTerm] = useState("monthly");
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45 });
  const { reduce } = useMotionPrefs();

  const chosenCar = cars.find((c) => c.id === car) || cars[0];
  const chosenQuote = quotes.find((q) => q.id === quote) || quotes[1];

  const go = useCallback((next, fromUser = true) => {
    if (fromUser) setTouched(true);
    setStep(next);
  }, []);

  // Autoplay the sequence once, until the visitor takes over.
  useEffect(() => {
    if (touched || reduce || !inView || step >= 3) return undefined;
    const delay = step === 2 ? 1500 : 2600;
    const t = setTimeout(() => {
      if (step === 2) { setSending(true); setTimeout(() => { setSending(false); setStep(3); }, 900); }
      else setStep((s) => s + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [step, touched, reduce, inView]);

  const submit = () => {
    setTouched(true);
    setSending(true);
    setTimeout(() => { setSending(false); setStep(3); }, reduce ? 0 : 900);
  };

  const restart = () => { setTouched(true); setStep(0); };

  const panel = {
    enter: { opacity: 0, y: reduce ? 0 : 10 },
    center: { opacity: 1, y: 0, transition: { duration: reduce ? 0.12 : 0.24, ease: EASE.out } },
    exit: { opacity: 0, y: reduce ? 0 : -8, transition: { duration: 0.15, ease: EASE.out } },
  };

  return (
    <div ref={ref} className={`surface-raised overflow-hidden ${className}`} data-testid="application-flow" onPointerDown={() => setTouched(true)}>
      {/* Progress rail */}
      <ol className="flex items-stretch border-b border-line bg-surface-2/50" aria-label="Application steps">
        {steps.map((s, i) => {
          const state = i === step ? "current" : i < step ? "done" : "todo";
          return (
            <li key={STEP_KEYS[i]} className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => i <= step && go(i)}
                disabled={i > step}
                aria-current={state === "current" ? "step" : undefined}
                data-testid={`flow-step-${STEP_KEYS[i]}`}
                className={`pressable relative w-full h-full px-2 sm:px-4 py-3 text-left disabled:cursor-default ${state === "todo" ? "opacity-45" : ""}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`grid place-items-center w-5 h-5 shrink-0 rounded-full text-[10.5px] font-bold tabular ${state === "done" ? "bg-green text-white" : state === "current" ? "bg-ink text-white" : "bg-surface-2 text-ink-3"}`}>
                    {state === "done" ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="hidden sm:block text-[13px] font-medium text-ink truncate">{s}</span>
                </span>
                {i === step && (
                  <motion.span layoutId="flow-rail" className="absolute inset-x-0 bottom-0 h-[2px] bg-green"
                    transition={reduce ? { duration: 0 } : SPRING.ui} />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative p-card min-h-[24rem] sm:min-h-[23rem]">
        <AnimatePresence mode="wait" initial={false}>
          {/* 1 — pick the car */}
          {step === 0 && (
            <motion.div key="car" variants={panel} initial="enter" animate="center" exit="exit">
              <p className="text-[13px] text-ink-3">{APPLICATION_FLOW.labels.car}</p>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {cars.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => { setCar(c.id); go(1); }} data-testid={`flow-car-${c.id}`}
                      className={`pressable w-full flex items-center gap-3 py-3 text-left ${car === c.id ? "" : ""}`}>
                      <img src={c.img} alt="" loading="lazy" className="w-16 h-12 rounded-lg object-cover bg-surface-2 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading font-bold text-[15px] text-ink truncate">{c.name}</span>
                        <span className="block text-[12.5px] text-ink-3 truncate">{c.meta}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-heading font-extrabold text-ink tabular">£{c.rent}</span>
                        <span className="block text-[11.5px] text-ink-3">a week</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* 2 — choose the cover */}
          {step === 1 && (
            <motion.div key="insurance" variants={panel} initial="enter" animate="center" exit="exit">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[13px] text-ink-3">{APPLICATION_FLOW.labels.insurance}</p>
                <div className="flex gap-1" role="group" aria-label="Payment term">
                  {APPLICATION_FLOW.terms.map((t) => (
                    <button key={t.id} type="button" onClick={() => { setTerm(t.id); setTouched(true); }}
                      className={`pressable rounded-full h-8 px-3 text-[12.5px] font-medium ${term === t.id ? "bg-ink text-white" : "text-ink-2 hover:bg-surface-2"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="mt-3 divide-y divide-line border-y border-line">
                {quotes.map((q) => {
                  const active = quote === q.id;
                  return (
                    <li key={q.id}>
                      <button type="button" onClick={() => { setQuote(q.id); go(2); }} data-testid={`flow-quote-${q.id}`}
                        className="pressable w-full flex items-center gap-3 py-3.5 text-left">
                        <span className={`grid place-items-center w-4 h-4 shrink-0 rounded-full border-2 ${active ? "border-green" : "border-line-strong"}`}>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-[14.5px] text-ink truncate">{q.cover}</span>
                          <span className="block text-[12.5px] text-ink-3 truncate">{q.insurer} · {q.excess}</span>
                        </span>
                        <span className="shrink-0 font-heading font-bold text-ink tabular">£{q.price[term]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-[12.5px] text-ink-3">{APPLICATION_FLOW.labels.quoteNote}</p>
            </motion.div>
          )}

          {/* 3 — send it */}
          {step === 2 && (
            <motion.div key="send" variants={panel} initial="enter" animate="center" exit="exit">
              <p className="text-[13px] text-ink-3">{APPLICATION_FLOW.labels.review}</p>
              <dl className="mt-3 divide-y divide-line border-y border-line">
                {[
                  [APPLICATION_FLOW.labels.rowCar, chosenCar.name, `£${chosenCar.rent} a week`],
                  [APPLICATION_FLOW.labels.rowCover, chosenQuote.cover, `£${chosenQuote.price[term]} ${APPLICATION_FLOW.terms.find((t) => t.id === term).suffix}`],
                  [APPLICATION_FLOW.labels.rowChecks, APPLICATION_FLOW.labels.checksValue, ""],
                ].map(([k, v, extra]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-[13px] text-ink-3 shrink-0">{k}</dt>
                    <dd className="text-right min-w-0">
                      <span className="block text-[14.5px] font-medium text-ink truncate">{v}</span>
                      {extra && <span className="block text-[12.5px] text-ink-3 tabular">{extra}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
              <button type="button" onClick={submit} disabled={sending} data-testid="flow-submit"
                className="pressable mt-5 w-full h-12 rounded-full bg-green hover:bg-green-hover text-white font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-80">
                {sending ? (
                  <>
                    <motion.span aria-hidden className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                      animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                    {APPLICATION_FLOW.labels.sending}
                  </>
                ) : (
                  <>{APPLICATION_FLOW.labels.submit} <ArrowRight size={16} strokeWidth={2} /></>
                )}
              </button>
            </motion.div>
          )}

          {/* 4 — sent */}
          {step === 3 && (
            <motion.div key="done" variants={panel} initial="enter" animate="center" exit="exit" className="text-center py-4">
              <motion.div
                initial={reduce ? false : { scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={reduce ? { duration: 0.12 } : SPRING.success}
                className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-green-soft"
              >
                <motion.svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" aria-hidden>
                  <motion.path d="M5 13l4 4L19 7" stroke="#0B6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : 0.45, ease: EASE.out, delay: reduce ? 0 : 0.12 }} />
                </motion.svg>
              </motion.div>
              <h3 className="mt-5 text-h3 font-heading font-extrabold text-ink">{sent.heading}</h3>
              <p className="mt-2 text-[14.5px] text-ink-2 leading-relaxed max-w-[38ch] mx-auto">{sent.body}</p>
              <ul className="mt-5 text-left divide-y divide-line border-y border-line max-w-sm mx-auto">
                {sent.next.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 py-3 text-[13.5px] text-ink-2">
                    <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={2.25} /> {n}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={restart} data-testid="flow-restart"
                className="pressable mt-5 inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-[13.5px] font-semibold text-ink-2 hover:bg-surface-2">
                <RotateCcw className="w-4 h-4" strokeWidth={1.75} /> {APPLICATION_FLOW.labels.replay}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="px-card py-2.5 border-t border-line bg-surface-2/50 text-[11.5px] text-ink-3">{APPLICATION_FLOW.labels.footnote}</p>
    </div>
  );
}
