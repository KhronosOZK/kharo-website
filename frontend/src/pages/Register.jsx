import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { DRIVER_CARS, estimateDriverWeek } from "@/lib/pricing";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Enter } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EASE, SPRING } from "@/lib/motion";
import { useSeo } from "@/lib/seo";
import { REGISTER } from "@/content/pages/register";

const inputCls = "h-12 rounded-lg";

const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: 12 * dir }),
  center: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE.out } },
  exit: (dir) => ({ opacity: 0, x: -12 * dir, transition: { duration: 0.15, ease: EASE.out } }),
};

export default function Register() {
  const navigate = useNavigate();

  useSeo({
    title: "Join the waitlist · Kharo",
    description: "Join the Kharo driver waitlist. Tell us your city and what car you're after, and we'll email you the moment matching cars go live.",
    canonical: "https://kharo.co.uk/register",
  });

  const { tag, heading, sub, estimator, steps: STEPS, success } = REGISTER;

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", city: "", car_type: "Hybrid", years_experience: "New to private hire", dvla_licence: "", pco_licence: "", availability: "As soon as possible" });
  const started = useRef(false);

  const markStarted = () => {
    if (!started.current) { started.current = true; trackEvent("waitlist_start"); }
  };
  const set = (k) => (e) => { markStarted(); setF((p) => ({ ...p, [k]: e.target.value })); };
  const setSelect = (k) => (val) => { markStarted(); setF((p) => ({ ...p, [k]: val })); };

  const [carKey, setCarKey] = useState("hybrid");
  const est = estimateDriverWeek(carKey);

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const canNext = () => {
    if (cur.required) { for (const r of cur.required) if (!f[r]?.trim()) return false; }
    return true;
  };

  const finish = async () => {
    setLoading(true);
    try {
      await api.post("/driver-interest", f);
      trackEvent("waitlist_complete", { city: f.city, car_type: f.car_type });
      setDone(true);
      window.scrollTo(0, 0);
    } catch { toast.error("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const goToStep = (nextStep, direction) => {
    setDir(direction);
    setStep(nextStep);
    trackEvent("waitlist_step", { step: nextStep });
  };

  const next = () => {
    if (!canNext()) { toast.error("Please fill this in to continue."); return; }
    if (!isLast) goToStep(step + 1, 1); else finish();
  };
  const back = () => goToStep(Math.max(0, step - 1), -1);

  if (done) return (
    <main className="min-h-page bg-bone grid place-items-center px-4 py-section text-center">
      <div>
        <Check className="w-12 h-12 text-green mx-auto" strokeWidth={1.75} />
        <h1 className="text-h2 font-heading font-extrabold text-ink mt-6" data-testid="reg-success">{success.heading}</h1>
        <p className="text-ink-2 mt-3 text-[16px] leading-relaxed max-w-md">Thanks {f.name.split(" ")[0]}. We have saved your details and we will email you the moment cars are ready to rent in {f.city}. In the meantime, feel free to keep browsing the cars.</p>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Button onClick={() => navigate("/search")} data-testid="reg-browse">{success.browse} <ArrowRight className="w-4 h-4" strokeWidth={1.75} /></Button>
          <Button onClick={() => navigate("/driver-guide")} variant="outline">{success.guide}</Button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="bg-bone">
      <div className="wrap grid items-start gap-8 pt-[calc(var(--header-h)+1.5rem)] pb-section lg:min-h-[calc(100dvh-var(--header-h))] lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,26rem)] lg:gap-block lg:pt-[calc(var(--header-h)+2.5rem)]">
        <div>
          <Enter>
            <h1 className="font-heading text-h2 font-extrabold tracking-[-0.02em] leading-[1.05] text-ink max-w-[22ch]">{heading}</h1>
            <p className="mt-3 max-w-[50ch] text-lead leading-relaxed text-ink-2">{sub}</p>
          </Enter>

          <Enter delay={0.14} className="mt-8 panel rounded-lg p-6 sm:p-7 max-w-md" data-testid="driver-take-home">
            <div className="text-[13px] text-ink-3">{estimator.label}</div>
            <div className="flex items-end gap-2 mt-1.5">
              <AnimatedNumber value={est.takeHome} prefix="£" data-testid="driver-takehome-value" className="text-[clamp(2.2rem,6vw,3rem)] font-heading font-extrabold text-ink leading-[0.9]" />
              <span className="text-ink-3 text-[15px] pb-1.5">{estimator.perWeek}</span>
            </div>
            <div className="mt-4 h-px bg-line" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {DRIVER_CARS.map((c) => (
                <button key={c.key} type="button" onClick={() => setCarKey(c.key)} data-testid={`driver-car-${c.key}`}
                  className={`pressable rounded-xl px-3 py-3 text-left border ${carKey === c.key ? "border-green bg-green-soft" : "border-line hover:bg-surface-2"}`}>
                  <div className="text-[13px] font-semibold text-ink">{c.label}</div>
                  <div className="text-[10.5px] text-ink-3 leading-tight mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-[13px]">
              <Line l={estimator.fares} v={`£${est.gross.toLocaleString()}`} strong />
              <Line l={estimator.rentInsurance} v={`- £${est.carCost}`} />
              <Line l={estimator.fuel} v={`- £${est.fuel}`} />
            </div>
            <p className="text-[11.5px] text-ink-3 mt-4 leading-relaxed">{estimator.note}</p>
            <p className="text-[11.5px] text-ink-3 mt-1.5 leading-relaxed">{estimator.insuranceNote}</p>
          </Enter>
        </div>

        <Enter delay={0.1} className="w-full panel rounded-lg p-6 sm:p-8">
          <div className="mb-7">
            <div className="flex items-center justify-between text-[12.5px] text-ink-3 mb-2.5">
              <span data-testid="reg-step-label">Step {step + 1} of {STEPS.length}</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="reg-progress">
              {STEPS.map((_, i) => (<div key={i} className={`h-1.5 rounded-full flex-1 transition-colors duration-ui ease-out ${i <= step ? "bg-green" : "bg-surface-2"}`} />))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); next(); }}>
            <motion.div layout transition={SPRING.ui}>
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.div key={cur.key} custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  <h2 className="text-h3 font-heading font-bold text-ink leading-tight text-balance">{cur.q}</h2>
                  <p className="text-[15px] text-ink-2 mt-2 mb-6">{cur.sub}</p>
                  {cur.select ? (
                    <Select value={f[cur.select.name]} onValueChange={setSelect(cur.select.name)}>
                      <SelectTrigger data-testid={cur.select.testid} className="h-12 rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>{cur.select.options.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-4">
                      {cur.fields.map((fl, idx) => (
                        <Field key={fl.name} label={fl.label}>
                          <Input autoFocus={idx === 0} type={fl.type || "text"} value={f[fl.name]} onChange={set(fl.name)} data-testid={fl.testid} className={inputCls} placeholder={fl.placeholder} />
                        </Field>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-3 mt-8">
              {step > 0 && <Button type="button" variant="outline" onClick={back} data-testid="reg-back"><ArrowLeft className="w-4 h-4" strokeWidth={1.75} /></Button>}
              <Button type="submit" disabled={loading} className="flex-1" data-testid={isLast ? "reg-submit" : "reg-continue"}>
                {isLast ? (loading ? "Sending" : "Register my interest") : "Continue"} {!isLast && <ArrowRight className="w-4 h-4" strokeWidth={1.75} />}
              </Button>
            </div>
          </form>
        </Enter>
      </div>
    </main>
  );
}

const Field = ({ label, children }) => (<div><Label className="text-[13px] font-medium text-ink-2 mb-1.5 block">{label}</Label>{children}</div>);
const Line = ({ l, v, strong }) => (<div className="flex justify-between"><span className="text-ink-3">{l}</span><span className={strong ? "text-ink font-semibold" : "text-ink-2"}>{v}</span></div>);
