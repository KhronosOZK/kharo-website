import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { EASE, SPRING } from "@/lib/motion";
import { Enter } from "@/components/Reveal";
import OperatorEarnings from "@/components/OperatorEarnings";
import { BRAND, OPERATOR_INTEREST } from "@/content/site";
import { OPERATOR_INTEREST_PAGE } from "@/content/pages/operatorInterest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STEPS = [
  { key: "company", q: "What's your company name?", sub: "So we know who we're speaking with.", fields: [{ label: "Company name", name: "company_name", placeholder: "e.g. London PHV Ltd", testid: "op-company" }], required: ["company_name"] },
  { key: "phone", q: "Your phone number", sub: "A person calls you within one working day.", fields: [{ label: "Phone number", name: "phone", type: "tel", placeholder: "07700 900 000", testid: "op-phone" }], required: ["phone"] },
  { key: "contact", q: "What's your name?", sub: "Your point of contact for this fleet.", fields: [{ label: "Your name", name: "contact_name", placeholder: "Your full name", testid: "op-contact" }], required: ["contact_name"] },
  { key: "email", q: "Your email, if you have one", sub: "Optional. We send the confirmation here.", fields: [{ label: "Email (if you have one)", name: "email", type: "email", placeholder: "you@company.com", testid: "op-email" }] },
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

  useSeo({ title: OPERATOR_INTEREST.seo.title, description: OPERATOR_INTEREST.seo.description });

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const { success } = OPERATOR_INTEREST;
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
      <Enter delay={0.15}>
        <a
          href={`https://wa.me/?text=${encodeURIComponent("Kharo lists private hire cars for free and brings checked drivers who pay through the platform every week. If you have cars standing still: https://kharo.co.uk/list-your-fleet")}`}
          target="_blank" rel="noopener noreferrer" data-testid="op-share"
          className="pressable mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-green px-6 text-[15px] font-semibold text-ink hover:bg-green-hover"
        >
          Send this to another operator
        </a>
        <p className="mt-2 text-[13px] text-ink-3">Opens WhatsApp with the message already written.</p>
      </Enter>
      <Enter delay={0.18} className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button onClick={() => navigate("/")}>{T.success.home} <ArrowRight size={16} /></Button>
        <Button variant="outline" onClick={() => navigate("/operator-guide")}>{T.success.guide}</Button>
      </Enter>
    </main>
  );

  return (
    <main className="bg-bone min-h-page">
      <div className="wrap grid items-start gap-8 pt-6 pb-section lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,26rem)] lg:gap-block lg:pt-10">
        {/* ── Heading and the loss calculator ─────────────────────────── */}
        <div>
          <Enter>
            <h1 className="font-heading text-h2 font-extrabold tracking-[-0.02em] leading-[1.05] text-ink max-w-[22ch]">{OPERATOR_INTEREST.heading}</h1>
            <p className="mt-3 max-w-[50ch] text-lead leading-relaxed text-ink-2">{OPERATOR_INTEREST.sub}</p>
          </Enter>
          <Enter delay={0.14} className="mt-8">
            <OperatorEarnings />
          </Enter>
        </div>

        {/* ── The form: first on phones, the page's one hero object ─────── */}
        <Enter delay={0.06} className="w-full">
          <motion.div layout transition={SPRING.ui} className="surface-raised rounded-lg p-card">
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
                  className="pressable mt-5 flex items-center justify-center gap-2 min-h-11 text-[14px] font-medium text-ink-2 hover:text-green"
                >
                  <MessageCircle size={16} strokeWidth={1.75} />
                  {T.whatsapp}
                </a>
              )}
            </form>
          </motion.div>
          <p className="mt-4 text-[14px] text-ink-3 leading-relaxed text-center lg:text-left">{T.trustSentence}</p>
        </Enter>
      </div>
    </main>
  );
}

const Field = ({ label, children }) => (
  <div>
    <Label className="text-[14px] font-medium text-ink-2 mb-1.5 block">{label}</Label>
    {children}
  </div>
);
