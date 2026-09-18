import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { EASE, SPRING } from "@/lib/motion";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Enter } from "@/components/Reveal";
import { BRAND, OPERATOR_INTEREST } from "@/content/site";
import { OPERATOR_INTEREST_PAGE } from "@/content/pages/operatorInterest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// same £185/week default used as the slider's starting point
const AVG_WEEKLY_RATE = 185;

const STEPS = [
  { key: "company", q: "What's your company name?", sub: "So we know who we're speaking with.", fields: [{ label: "Company name", name: "company_name", placeholder: "e.g. London PHV Ltd", testid: "op-company" }], required: ["company_name"] },
  { key: "contact", q: "What's your name?", sub: "Your point of contact for this fleet.", fields: [{ label: "Your name", name: "contact_name", placeholder: "Your full name", testid: "op-contact" }] },
  { key: "email", q: "What's your email?", sub: "We'll send confirmation here.", fields: [{ label: "Email", name: "email", type: "email", placeholder: "you@company.com", testid: "op-email" }], required: ["email"] },
  { key: "phone", q: "Your phone number", sub: "So we can call you within 1 working day.", fields: [{ label: "Phone number", name: "phone", type: "tel", placeholder: "07700 900 000", testid: "op-phone" }], required: ["phone"] },
  { key: "areas", q: "Which areas do you operate in?", sub: "Boroughs or areas your fleet covers.", fields: [{ label: "Areas", name: "areas", placeholder: "e.g. East London, Barking, Ilford", testid: "op-areas" }], required: ["areas"] },
  { key: "fleet", q: "How big is your fleet?", sub: "A rough number is fine.", select: { name: "fleet_size", testid: "op-fleet", options: ["1 to 5 vehicles", "6 to 15 vehicles", "16 to 30 vehicles", "30+ vehicles"] } },
  { key: "idle", q: "How many cars are sitting idle?", sub: "This is what we'll help you fill first.", select: { name: "current_idle", testid: "op-idle", options: ["1 car", "2 to 3 cars", "4 to 5 cars", "5+ cars"] } },
  { key: "notes", q: "Anything else we should know?", sub: "Optional. Vehicle makes, requirements, borough coverage.", fields: [{ label: "Notes", name: "message", placeholder: "Optional", testid: "op-notes" }] },
];

// Direction-aware step slide: 12px in the direction of travel, quick exit.
const STEP_VARIANTS = {
  enter: (d) => ({ opacity: 0, x: 12 * d }),
  center: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE.out } },
  exit: (d) => ({ opacity: 0, x: -12 * d, transition: { duration: 0.15, ease: EASE.out } }),
};

export default function OperatorInterest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    company_name: "", contact_name: "", email: "", phone: "", areas: "",
    fleet_size: "1 to 5 vehicles", current_idle: "1 car", message: "",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const [idleCount, setIdleCount] = useState(4);
  const [weeklyRate, setWeeklyRate] = useState(AVG_WEEKLY_RATE);
  const weeklyLoss = idleCount * weeklyRate;
  const monthlyLoss = Math.round(weeklyLoss * 4.33);
  const yearlyLoss = weeklyLoss * 52;

  useSeo({ title: OPERATOR_INTEREST.seo.title, description: OPERATOR_INTEREST.seo.description });

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const { loss, success } = OPERATOR_INTEREST;
  const T = OPERATOR_INTEREST_PAGE;

  const canNext = () => {
    if (cur.required) { for (const r of cur.required) if (!f[r]?.trim()) return false; }
    return true;
  };

  const finish = async () => {
    setLoading(true);
    try {
      await api.post("/interest", {
        company_name: f.company_name,
        contact_name: f.contact_name,
        email: f.email,
        phone: f.phone,
        fleet_size: f.fleet_size,
        areas: f.areas,
        // backend's InterestIn has no idle-count/notes field; fold them into heard_from so the ops team still sees them
        heard_from: f.message ? `Idle: ${f.current_idle}. Notes: ${f.message}` : `Idle: ${f.current_idle}`,
      });
      trackEvent("operator_interest", { fleet_size: f.fleet_size });
      setDone(true);
      window.scrollTo(0, 0);
    } catch {
      toast.error(T.errors.failed);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (!canNext()) { toast.error(T.errors.required); return; }
    if (!isLast) { setDir(1); setStep(step + 1); } else finish();
  };
  const back = () => { setDir(-1); setStep((s) => Math.max(0, s - 1)); };

  if (done) return (
    <main className="wrap wrap-narrow min-h-page flex flex-col items-center justify-center text-center py-section">
      <Enter><Check className="w-12 h-12 text-green" strokeWidth={1.75} /></Enter>
      <Enter as="h1" delay={0.06} className="mt-6 text-h1 font-heading font-extrabold text-ink" data-testid="op-success">{success.heading}</Enter>
      <Enter as="p" delay={0.12} className="mt-4 text-lead text-ink-2 measure">{success.body}</Enter>
      <Enter delay={0.18} className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button onClick={() => navigate("/")}>{T.success.home} <ArrowRight size={16} /></Button>
        <Button variant="outline" onClick={() => navigate("/operator-guide")}>{T.success.guide}</Button>
      </Enter>
    </main>
  );

  return (
    <main className="bg-bone min-h-page">
      <div className="wrap py-section grid lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,26rem)] gap-block items-start">
        {/* ── Intro and the loss calculator ─────────────────────────────── */}
        <div>
          <Enter as="p" className="eyebrow">{OPERATOR_INTEREST.tag}</Enter>
          <Enter as="h1" delay={0.04} className="mt-3 text-h1 font-heading font-extrabold text-ink max-w-[18ch]">
            {OPERATOR_INTEREST.heading}
          </Enter>
          <Enter as="p" delay={0.08} className="mt-4 text-lead text-ink-2 measure-narrow">
            {OPERATOR_INTEREST.sub}
          </Enter>

          <Enter delay={0.12} className="mt-8 surface-raised rounded-2xl p-card max-w-md" data-testid="operator-loss-card">
            <p className="text-[13.5px] font-medium text-ink-3">{loss.label}</p>
            <div className="flex items-end gap-2 mt-1.5">
              <AnimatedNumber value={weeklyLoss} prefix="£" data-testid="operator-loss-value" className="text-stat font-heading font-extrabold text-ink" />
              <span className="text-ink-3 text-[15px] pb-1.5">a week</span>
            </div>
            <div className="mt-5 hairline" />

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[13.5px] font-medium text-ink-2">{loss.idle}</span>
                <span className="text-[15px] font-heading font-bold text-ink tabular">{idleCount} {T.carUnit(idleCount)}</span>
              </div>
              <Slider value={[idleCount]} onValueChange={([v]) => setIdleCount(v)} min={1} max={20} step={1} aria-label={loss.idle} data-testid="operator-idle-slider" />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[13.5px] font-medium text-ink-2">{loss.rate}</span>
                <span className="text-[15px] font-heading font-bold text-ink tabular">£{weeklyRate}</span>
              </div>
              <Slider value={[weeklyRate]} onValueChange={([v]) => setWeeklyRate(v)} min={100} max={300} step={5} aria-label={loss.rate} data-testid="operator-rate-slider" />
            </div>

            <dl className="mt-5 divide-y divide-line border-y border-line text-[14px]">
              <Line l={loss.perWeek} v={weeklyLoss} strong />
              <Line l={loss.perMonth} v={monthlyLoss} />
              <Line l={loss.perYear} v={yearlyLoss} />
            </dl>
            <p className="mt-4 text-[12.5px] text-ink-3 leading-relaxed">{loss.note}</p>
          </Enter>
        </div>

        {/* ── The form: first on phones, the page's one hero object ─────── */}
        <Enter delay={0.06} className="order-first lg:order-none w-full">
          <motion.div layout transition={SPRING.ui} className="surface-raised rounded-hero p-card">
            <div className="mb-7">
              <p className="text-[13px] text-ink-3 mb-2.5" data-testid="op-step-label">{T.stepLabel(step + 1, STEPS.length)}</p>
              <div className="flex items-center gap-1.5" data-testid="op-progress">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors duration-ui ${i <= step ? "bg-green" : "bg-surface-2"}`} />
                ))}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); next(); }}>
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.div key={cur.key} custom={dir} variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit">
                  <h2 className="text-h3 font-heading font-bold text-ink">{cur.q}</h2>
                  <p className="mt-2 mb-6 text-[15px] text-ink-2">{cur.sub}</p>
                  {cur.select ? (
                    <Select value={f[cur.select.name]} onValueChange={(val) => setF((p) => ({ ...p, [cur.select.name]: val }))}>
                      <SelectTrigger data-testid={cur.select.testid} className="field h-12 rounded-lg border-line-strong bg-surface text-base text-ink shadow-none focus:ring-[3px] focus:ring-green/20 focus:border-green">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        {cur.select.options.map((x) => <SelectItem key={x} value={x} className="text-base py-2.5">{x}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-4">
                      {cur.fields.map((fl, idx) => (
                        <Field key={fl.name} label={fl.label}>
                          <Input autoFocus={idx === 0} type={fl.type || "text"} value={f[fl.name]} onChange={set(fl.name)} data-testid={fl.testid} placeholder={fl.placeholder} />
                        </Field>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <Button type="button" variant="outline" size="icon" onClick={back} aria-label={T.back} data-testid="op-back">
                    <ArrowLeft size={16} strokeWidth={1.75} />
                  </Button>
                )}
                <Button type="submit" disabled={loading} className="flex-1" data-testid={isLast ? "op-submit" : "op-continue"}>
                  {isLast ? (loading ? T.sending : T.submitCta) : T.continueCta} {!isLast && <ArrowRight size={16} />}
                </Button>
              </div>

              {step === 0 && BRAND.whatsapp && (
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(T.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable mt-5 flex items-center justify-center gap-2 min-h-11 text-[13.5px] font-medium text-ink-2 hover:text-green"
                >
                  <MessageCircle size={16} strokeWidth={1.75} />
                  {T.whatsapp}
                </a>
              )}
            </form>
          </motion.div>
          <p className="mt-4 text-[13.5px] text-ink-3 leading-relaxed text-center lg:text-left">{T.trustSentence}</p>
        </Enter>
      </div>
    </main>
  );
}

const Field = ({ label, children }) => (
  <div>
    <Label className="text-[13.5px] font-medium text-ink-2 mb-1.5 block">{label}</Label>
    {children}
  </div>
);

const Line = ({ l, v, strong }) => (
  <div className="flex justify-between py-2.5">
    <dt className="text-ink-3">{l}</dt>
    <dd className={strong ? "text-ink font-semibold" : "text-ink-2"}>
      <AnimatedNumber value={v} prefix="£" />
    </dd>
  </div>
);
