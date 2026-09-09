import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, TrendingUp, ShieldCheck, Wallet, MapPin, Mail } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { VEHICLE_CLASSES, fleetBucket, estimateFleetEarnings } from "@/lib/pricing";
import { AnimatedNumber } from "@/components/AnimatedNumber";

const fleetOpts = ["1-5", "6-15", "16-30", "30+"];
const inputCls = "h-12 bg-[#F6F5F2] border border-transparent rounded-xl px-4 text-[15px] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0B6B4F]/25 focus-visible:border-[#0B6B4F] transition-colors";

const STEPS = [
  { key: "company", q: "What's your company called?", sub: "The trading name drivers will see once you're verified.", fields: [{ label: "Company name", name: "company_name", testid: "int-company" }], required: ["company_name"] },
  { key: "reg", q: "Your registrations", sub: "Optional right now. It helps us fast-track verification later.", fields: [{ label: "Companies House number", name: "companies_house", testid: "int-ch" }, { label: "TfL operator licence", name: "tfl_operator_licence", testid: "int-tfl" }] },
  { key: "fleet", q: "How many vehicles do you run?", sub: "Helps us understand the supply you can bring.", select: { name: "fleet_size", testid: "int-fleet", options: fleetOpts, render: (x) => `${x} vehicles` } },
  { key: "areas", q: "Where do you operate?", sub: "The boroughs or areas your cars cover.", fields: [{ label: "Boroughs or areas", name: "areas", placeholder: "Croydon, Bromley", testid: "int-areas" }], required: ["areas"] },
  { key: "types", q: "What types of car do you rent out?", sub: "A quick idea of your fleet mix.", fields: [{ label: "Types of car", name: "vehicle_types", placeholder: "Hybrids, saloons, one WAV", testid: "int-types" }] },
  { key: "you", q: "A little about you", sub: "So we know who we're speaking to.", fields: [{ label: "Your name", name: "contact_name", testid: "int-name" }, { label: "Your role", name: "role", testid: "int-role" }], required: ["contact_name"] },
  { key: "contact", q: "How can we reach you?", sub: "We'll email you your earning potential and the launch steps.", fields: [{ label: "Email", name: "email", type: "email", testid: "int-email" }, { label: "Phone", name: "phone", testid: "int-phone" }], required: ["email", "phone"] },
  { key: "heard", q: "How did you hear about us?", sub: "Last one. This really helps us.", select: { name: "heard_from", testid: "int-heard", options: ["Word of mouth", "Social media", "Search engine", "Industry event", "Other"], render: (x) => x } },
];

export default function OperatorInterest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState(10);
  const [vClass, setVClass] = useState(VEHICLE_CLASSES[0]);
  const [f, setF] = useState({
    company_name: "", companies_house: "", tfl_operator_licence: "", fleet_size: "6-15",
    vehicle_types: "", areas: "", contact_name: "", role: "", email: "", phone: "", heard_from: "Word of mouth",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => { api.get("/stats").then((r) => setCount(r.data.operators)).catch(() => {}); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setF((p) => ({ ...p, fleet_size: fleetBucket(cars) })); }, [cars]); // eslint-disable-line react-hooks/exhaustive-deps

  const earn = estimateFleetEarnings(cars, vClass.weekly);
  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  const canNext = () => {
    if (cur.required) { for (const r of cur.required) if (!f[r]?.trim()) return false; }
    return true;
  };

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/interest", {
        company_name: f.company_name, companies_house: f.companies_house, tfl_operator_licence: f.tfl_operator_licence,
        fleet_size: f.fleet_size, areas: f.areas, vehicle_types: f.vehicle_types,
        contact_name: f.contact_name, role: f.role, email: f.email, phone: f.phone, heard_from: f.heard_from,
      });
      setDone(true); window.scrollTo(0, 0);
    } catch { toast.error("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const next = () => {
    if (!canNext()) { toast.error("Please fill this in to continue."); return; }
    if (!isLast) setStep(step + 1); else submit();
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const scrollToForm = () => document.getElementById("operator-form")?.scrollIntoView({ behavior: "smooth", block: "center" });

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-emerald-700" /></div>
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25] mt-6" data-testid="interest-success">You're on the launch list.</h1>
      <p className="text-[#4A564F] mt-3 text-[16px] leading-relaxed">Thanks for registering {f.company_name}. We've saved your details and we'll be in touch with your earning potential and the onboarding steps as we get ready to go live.</p>
      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        <Button onClick={() => navigate("/operator-guide")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white" data-testid="interest-guide">See how it works <ArrowRight className="w-4 h-4 ml-2" /></Button>
        <Button onClick={() => navigate("/")} variant="outline" className="rounded-full border-slate-200">Back to home</Button>
      </div>
    </main>
  );

  return (
    <main className="bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">For rental companies</p>
            <h1 className="mt-3 font-heading font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.03] text-[#1A2E25] text-balance">
              Put your fleet<br /><span className="text-[#0B6B4F]">to work.</span>
            </h1>
            <p className="mt-4 text-[16px] text-[#4A564F] max-w-md mx-auto lg:mx-0 leading-relaxed">See what your fleet could bring in, then register to get matched with vetted drivers at launch.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}
            className="mt-8 max-w-md mx-auto lg:mx-0 text-left rounded-[24px] bg-white ring-1 ring-slate-200/70 p-6 sm:p-7 shadow-sm" data-testid="earnings-estimator">
            <div className="text-[11px] text-[#7A857F] uppercase tracking-[0.18em]">Estimated monthly earnings</div>
            <div className="flex items-end gap-1.5 mt-1">
              <AnimatedNumber value={earn.grossMonth} prefix="£" data-testid="estimator-monthly" className="text-[clamp(2.6rem,7vw,3.8rem)] font-heading font-extrabold text-[#0B6B4F] leading-[0.9]" />
              <span className="text-[#7A857F] text-lg pb-1.5">/ month</span>
            </div>
            <div className="text-[13.5px] text-[#4A564F] mt-2">Around <span className="font-semibold text-[#1A2E25]"><AnimatedNumber value={earn.grossYear} prefix="£" /></span> a year gross, keeping <span className="font-semibold text-[#1A2E25]"><AnimatedNumber value={earn.netYear} prefix="£" /></span> after our fee.</div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-[13px] text-[#4A564F]">How many cars would you list?</Label>
                <span className="font-heading font-extrabold text-[#1A2E25] text-lg" data-testid="estimator-cars">{cars}{cars >= 40 ? "+" : ""}</span>
              </div>
              <Slider min={1} max={40} step={1} value={[cars]} onValueChange={(v) => setCars(v[0])} data-testid="estimator-slider" />
              <div className="flex justify-between text-[11px] text-[#9AA39D] mt-1.5"><span>1 car</span><span>40+ cars</span></div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {VEHICLE_CLASSES.map((c) => {
                const active = vClass.key === c.key;
                return (
                  <button key={c.key} onClick={() => setVClass(c)} data-testid={`estimator-class-${c.key}`}
                    className={`text-left rounded-2xl px-4 py-2.5 ring-1 transition-all hover:-translate-y-[2px] ${active ? "ring-2 ring-[#0B6B4F] bg-[#0B6B4F]/[0.06]" : "ring-slate-200 bg-white hover:bg-slate-50"}`}>
                    <div className="text-[13px] font-semibold text-[#1A2E25]">{c.label}</div>
                    <div className="text-[11.5px] text-[#7A857F]">£{c.weekly}/wk each</div>
                  </button>
                );
              })}
            </div>
            <button onClick={scrollToForm} data-testid="estimator-cta" className="w-full mt-5 h-11 rounded-2xl bg-[#0B6B4F] hover:bg-[#095B43] text-white text-[15px] font-semibold transition-colors">Register my fleet interest</button>
          </motion.div>

          <div className="mt-7 space-y-2.5 max-w-md mx-auto lg:mx-0 text-left">
            {[[ShieldCheck, "Every driver background and licence checked"], [Wallet, "No listing fees, a flat 10% on the rental side only"], [MapPin, "See your fleet's live location in the operator tools at launch"], [TrendingUp, "Rent covered up to two weeks if a driver defaults"]].map(([Icon, t]) => (
              <div key={t} className="flex items-start gap-3 text-[14px] text-[#4A564F]"><Icon className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.6} /> {t}</div>
            ))}
            <p className="text-[#9AA39D] text-[13px] pt-1">{count > 0 ? `${count} operator${count === 1 ? "" : "s"} have already registered their interest` : "Be one of the first operators to join Kharo"}</p>
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end bg-white rounded-[28px] ring-1 ring-slate-200 p-6 sm:p-9 shadow-xl scroll-mt-24" id="operator-form">
          <h2 className="text-[22px] font-heading font-bold text-[#1A2E25]">Claim your spot on the launch list</h2>
          <p className="text-[14px] text-[#4A564F] mt-1.5">Two minutes and you're on the list.</p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#E6F5F0] border border-[#0B6B4F]/15 p-3.5">
            <Mail className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.6} />
            <p className="text-[13px] text-[#1A2E25] leading-relaxed">Once you register, we'll email you the details: your earning potential, the onboarding process and how verification works.</p>
          </div>

          <div className="mt-6 mb-6">
            <div className="flex items-center justify-between text-[12.5px] text-[#7A857F] mb-2.5">
              <span data-testid="int-step-label">Step {step + 1} of {STEPS.length}</span>
              <span>{pct}%</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="int-progress">
              {STEPS.map((_, i) => (<div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= step ? "bg-[#0B6B4F]" : "bg-[#E7E4DD]"}`} />))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); next(); }}>
            <AnimatePresence mode="wait">
              <motion.div key={cur.key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] leading-tight text-balance">{cur.q}</h3>
                <p className="text-[14px] text-[#4A564F] mt-1.5 mb-6">{cur.sub}</p>
                {cur.select ? (
                  <Select value={f[cur.select.name]} onValueChange={(v) => setF((p) => ({ ...p, [cur.select.name]: v }))}>
                    <SelectTrigger data-testid={cur.select.testid} className="h-12 rounded-xl bg-white border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>{cur.select.options.map((x) => <SelectItem key={x} value={x}>{cur.select.render(x)}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-4">
                    {cur.fields.map((fl, idx) => (
                      <div key={fl.name}>
                        <Label className="mb-1.5 block text-[13px] font-medium text-[#4A564F]">{fl.label}</Label>
                        <Input autoFocus={idx === 0} type={fl.type || "text"} value={f[fl.name]} onChange={set(fl.name)} data-testid={fl.testid} className={inputCls} placeholder={fl.placeholder} />
                      </div>
                    ))}
                  </div>
                )}

                {cur.key === "fleet" && (
                  <div className="mt-5 rounded-2xl bg-[#0E1A14] text-white p-4" data-testid="int-earnings">
                    <div className="text-[11.5px] text-white/60 uppercase tracking-wide">A fleet your size could earn</div>
                    <div className="text-2xl font-heading font-extrabold text-[#5FD3A6] mt-1">£{estimateFleetEarnings({ "1-5": 3, "6-15": 10, "16-30": 22, "30+": 40 }[f.fleet_size] || 10, vClass.weekly).grossYear.toLocaleString()}<span className="text-sm font-normal text-white/60"> a year</span></div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 mt-7">
              {step > 0 && <Button type="button" variant="outline" onClick={back} className="rounded-full border-slate-200 hover:-translate-y-[2px] transition-transform" data-testid="int-back"><ArrowLeft className="w-4 h-4" /></Button>}
              <Button type="submit" disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1 h-11 hover:-translate-y-[2px] transition-transform" data-testid={isLast ? "int-submit" : "int-continue"}>
                {isLast ? (loading ? "Sending" : "Register my interest") : "Continue"} {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

