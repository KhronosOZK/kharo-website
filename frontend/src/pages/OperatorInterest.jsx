import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { BRAND } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const inputCls = "h-12 bg-[#F5F5F5] border border-transparent rounded-xl px-4 text-[15px] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B6B4F]/25 focus-visible:border-[#0B6B4F] transition-colors";

// same £255/week assumption used elsewhere on the site (lib/pricing.js estimateOperatorAnnual)
const AVG_WEEKLY_RATE = 255;
const IDLE_BUCKETS = [
  { key: "low", label: "1 to 2 cars", sub: "Light idle", count: 2 },
  { key: "mid", label: "3 to 5 cars", sub: "Moderate idle", count: 4 },
  { key: "high", label: "6+ cars", sub: "Heavy idle", count: 8 },
];

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

export default function OperatorInterest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    company_name: "", contact_name: "", email: "", phone: "", areas: "",
    fleet_size: "1 to 5 vehicles", current_idle: "1 car", message: "",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const [idleKey, setIdleKey] = useState("mid");
  const idleBucket = IDLE_BUCKETS.find((b) => b.key === idleKey);
  const weeklyLoss = idleBucket.count * AVG_WEEKLY_RATE;
  const monthlyLoss = Math.round(weeklyLoss * 4.33);
  const yearlyLoss = weeklyLoss * 52;

  useSeo({
    title: "List Your Fleet · Kharo | PCO Operator Platform",
    description:
      "Stop losing revenue to idle PCO cars. List your fleet on Kharo and connect with vetted London drivers in days, not weeks.",
  });

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (!canNext()) { toast.error("Please fill this in to continue."); return; }
    if (!isLast) setStep(step + 1); else finish();
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <Check className="w-12 h-12 text-[#0B6B4F] mx-auto" strokeWidth={1.75} />
      <h1 className="text-3xl font-heading font-extrabold text-[#0A0A0A] mt-6" data-testid="op-success">We'll be in touch soon.</h1>
      <p className="text-[#666666] mt-3 text-[16px] leading-relaxed">
        A Kharo fleet specialist will call you within 1 working day to discuss how we can help fill your idle cars.
      </p>
      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        <Button onClick={() => navigate("/")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">Back to home <ArrowRight className="w-4 h-4 ml-2" /></Button>
        <Button onClick={() => navigate("/operator-guide")} variant="outline" className="rounded-full border-[#E8E8E8]">Read the operator guide</Button>
      </div>
    </main>
  );

  return (
    <main className="bg-[#F5F5F5] min-h-[calc(100vh-68px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center lg:text-left">
          <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">List with Kharo</p>
          <h1 className="mt-3 font-heading font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.03] text-[#0A0A0A] text-balance">
            Stop losing money<br /><span className="text-[#0B6B4F]">to idle cars.</span>
          </h1>
          <p className="mt-4 text-[16px] text-[#666666] max-w-md mx-auto lg:mx-0 leading-relaxed">
            List your idle PCO cars and connect with vetted London drivers who are ready to rent now.
          </p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}
            className="mt-8 max-w-md mx-auto lg:mx-0 text-left rounded-[24px] bg-white ring-1 ring-[#E8E8E8]/70 p-6 sm:p-7 shadow-sm" data-testid="operator-loss-card">
            <div className="text-[11px] text-[#888888] uppercase tracking-[0.18em]">Idle cars cost you</div>
            <div className="flex items-end gap-2 mt-1.5">
              <AnimatedNumber value={weeklyLoss} prefix="£" data-testid="operator-loss-value" className="text-[clamp(2.6rem,8vw,4rem)] font-heading font-extrabold text-[#0A0A0A] leading-[0.9]" />
              <span className="text-[#888888] text-lg pb-2">/ week</span>
            </div>
            <div className="mt-4 h-px bg-[#E8E8E8]/80" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {IDLE_BUCKETS.map((b) => (
                <button key={b.key} onClick={() => setIdleKey(b.key)} data-testid={`operator-idle-${b.key}`}
                  className={`rounded-2xl px-3 py-3 text-left ring-1 transition-all hover:-translate-y-[2px] ${idleKey === b.key ? "ring-2 ring-[#0B6B4F] bg-[#0B6B4F]/[0.06]" : "ring-[#E8E8E8] bg-white hover:bg-[#FAFAFA]"}`}>
                  <div className="text-[13px] font-semibold text-[#0A0A0A]">{b.label}</div>
                  <div className="text-[10.5px] text-[#888888] leading-tight mt-0.5">{b.sub}</div>
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-[13px]">
              <Line l="Per week" v={`£${weeklyLoss.toLocaleString()}`} strong />
              <Line l="Per month" v={`£${monthlyLoss.toLocaleString()}`} />
              <Line l="Per year" v={`£${yearlyLoss.toLocaleString()}`} />
            </div>
            <p className="text-[11px] text-[#999999] mt-4 leading-relaxed">
              Based on a typical £{AVG_WEEKLY_RATE}/week PCO rental rate. An illustrative estimate, not a quote.
            </p>
          </motion.div>

          <p className="mt-7 text-[13px] text-[#666666] leading-relaxed">
            Pre-screened drivers only<span className="text-[#CCC] mx-2">&middot;</span>Kharo calls within 1 working day<span className="text-[#CCC] mx-2">&middot;</span>Free to list, no monthly fees
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end bg-white rounded-[28px] ring-1 ring-[#E8E8E8] p-6 sm:p-9 shadow-xl">
          <div className="mb-7">
            <div className="flex items-center justify-between text-[12.5px] text-[#888888] mb-2.5">
              <span data-testid="op-step-label">Step {step + 1} of {STEPS.length}</span>
              <span>{pct}%</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="op-progress">
              {STEPS.map((_, i) => (<div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= step ? "bg-[#0B6B4F]" : "bg-[#E8E8E8]"}`} />))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); next(); }}>
            <AnimatePresence mode="wait">
              <motion.div key={cur.key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0A0A0A] leading-tight text-balance">{cur.q}</h2>
                <p className="text-[15px] text-[#666666] mt-2 mb-7">{cur.sub}</p>
                {cur.select ? (
                  <Select value={f[cur.select.name]} onValueChange={(val) => setF((p) => ({ ...p, [cur.select.name]: val }))}>
                    <SelectTrigger data-testid={cur.select.testid} className="h-12 rounded-xl bg-white border-[#E8E8E8]"><SelectValue /></SelectTrigger>
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

            <div className="flex gap-3 mt-8">
              {step > 0 && <Button type="button" variant="outline" onClick={back} className="rounded-full border-[#E8E8E8] hover:-translate-y-[2px] transition-transform" data-testid="op-back"><ArrowLeft className="w-4 h-4" /></Button>}
              <Button type="submit" disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1 h-11 hover:-translate-y-[2px] transition-transform" data-testid={isLast ? "op-submit" : "op-continue"}>
                {isLast ? (loading ? "Sending" : "Request a call back") : "Continue"} {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>

            {step === 0 && BRAND.whatsapp && (
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi Kharo, I'd like to list my fleet.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-[13px] font-medium text-[#666666] hover:text-[#0B6B4F] transition-colors mt-5"
              >
                <MessageCircle className="w-4 h-4" />
                Prefer WhatsApp? Message us instead
              </a>
            )}
          </form>
        </motion.div>
      </div>
    </main>
  );
}

const Field = ({ label, children }) => (<div><Label className="text-[13px] font-medium text-[#666666] mb-1.5 block">{label}</Label>{children}</div>);
const Line = ({ l, v, strong }) => (<div className="flex justify-between"><span className="text-[#888888]">{l}</span><span className={strong ? "text-[#0A0A0A] font-semibold" : "text-[#666666]"}>{v}</span></div>);
