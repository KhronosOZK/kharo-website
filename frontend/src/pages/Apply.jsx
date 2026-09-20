import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";
import { getMockById, isPreviewId } from "@/data/mockListings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Enter } from "@/components/Reveal";
import { EASE, SPRING } from "@/lib/motion";
import { useSeo } from "@/lib/seo";
import { APPLY, FACTS, BRAND } from "@/content/site";
import { APPLICATION_FLOW } from "@/content/pages/applicationFlow";

const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: 12 * dir }),
  center: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE.out } },
  exit: (dir) => ({ opacity: 0, x: -12 * dir, transition: { duration: 0.15, ease: EASE.out } }),
};

const STEP_KEYS = ["about", "licence", "cover", "review"];
const COVER = { comp: "comp", tpft: "tpft", tp: "tp" };
const quoteFor = (level) => APPLICATION_FLOW.quotes.find((q) => q.id === level);

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preCover = COVER[params.get("cover")] || COVER.comp;
  const preTerm = APPLICATION_FLOW.terms.some((t) => t.id === params.get("term")) ? params.get("term") : "monthly";

  useSeo({
    title: "Register interest · Kharo",
    description: "Register your interest in a car on Kharo. Nothing is charged and nothing is committed.",
  });

  const [v, setV] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [f, setF] = useState({ name: "", email: "", phone: "", start_when: APPLY.timeframes[0], dvla_licence: "", pco_licence: "", cover_level: preCover, cover_term: preTerm });
  const started = useRef(false);
  const set = (k) => (e) => { markStarted(); setF((p) => ({ ...p, [k]: e.target.value })); };

  function markStarted() {
    if (!started.current) { started.current = true; trackEvent("apply_start", { listing_id: id }); }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isPreviewId(id)) {
      const mockVehicle = getMockById(id);
      if (mockVehicle) setV(mockVehicle); else navigate("/search");
      return;
    }
    api.get(`/listings/${id}`).then((r) => setV(r.data)).catch(() => navigate("/search"));
  }, [id, navigate]);

  const cur = STEP_KEYS[step];
  const isLast = step === STEP_KEYS.length - 1;

  const canNext = () => {
    if (cur === "about") return f.name.trim() && f.phone.trim();
    return true;
  };

  const goToStep = (nextStep, direction) => { setDir(direction); setStep(nextStep); };
  const nextStep = () => {
    if (!canNext()) { toast.error("Please add your phone number and your name, so we can call you."); return; }
    if (!isLast) goToStep(step + 1, 1); else submit();
  };
  const back = () => goToStep(Math.max(0, step - 1), -1);

  const submit = async () => {
    setLoading(true);
    try {
      let note = `Interested in ${v.make} ${v.model} (${v.id}). Wants to start: ${f.start_when}.`;
      if (f.dvla_licence) note += ` DVLA licence: ${f.dvla_licence}.`;
      if (f.pco_licence) note += ` PCO/TfL badge: ${f.pco_licence}.`;
      await api.post("/city-interest", {
        city: v.borough,
        name: f.name,
        email: f.email,
        phone: f.phone,
        vehicle_type: `${v.make} ${v.model}`,
        cover_level: APPLY.stepCover.levels[f.cover_level],
        cover_term: f.cover_term,
        note: `${note} Cover: ${APPLY.stepCover.levels[f.cover_level]}, ${f.cover_term}, indicative £${quoteFor(f.cover_level).price[f.cover_term]}.`,
      });
      trackEvent("apply_complete", { listing_id: v.id, city: v.borough, weekly_rent: v.weekly_rent });
      setDone(true);
      window.scrollTo(0, 0);
    } catch {
      toast.error("Couldn't send that. Please try again.");
    }
    setLoading(false);
  };

  if (!v) return <div className="min-h-page bg-bone grid place-items-center text-ink-3">Loading</div>;

  if (done) return (
    <main className="min-h-page bg-bone grid place-items-center px-4 py-section text-center">
      <div className="max-w-xl">
        <Check className="w-12 h-12 text-green mx-auto" strokeWidth={1.75} />
        <h1 className="text-h2 font-heading font-extrabold text-ink mt-6" data-testid="apply-success">{APPLY.success.heading}</h1>
        <p className="text-ink-2 mt-3 leading-relaxed">{APPLY.success.body} We plan to open in {v.city} in {FACTS.launch[v.city] || "2027"}.</p>
        <div className="mt-8 text-left panel rounded-lg p-6">
          <p className="font-heading font-bold text-ink">{APPLY.success.nextHeading}</p>
          <ul className="mt-3 divide-y divide-line">
            {APPLY.success.next.map((n) => (
              <li key={n} className="flex items-start gap-2.5 py-2.5 text-[14.5px] text-ink-2">
                <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={2} /> {n}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Button onClick={() => navigate("/search")}>Browse cars</Button>
          <Button onClick={() => navigate("/")} variant="outline">Back to home</Button>
        </div>
      </div>
    </main>
  );

  const photo = Array.isArray(v.photos) ? v.photos[0] : v.photos;

  return (
    <main className="bg-bone wrap py-section">
      <button onClick={() => navigate(-1)} className="pressable inline-flex items-center gap-1.5 text-[14px] text-ink-2 hover:text-ink">
        <ArrowLeft size={16} strokeWidth={1.75} /> Back
      </button>

      <div className="mt-6 grid lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,26rem)] gap-block items-start">
        {/* Vehicle summary */}
        <div className="lg:sticky top-below-header">
          <img src={photo} alt="" loading="lazy" className="w-full aspect-[16/9] rounded-lg border border-line object-cover" />
          <div className="panel rounded-lg p-5 mt-4">
            <h3 className="font-heading font-bold text-ink text-lg">{v.make} {v.model}</h3>
            <p className="text-ink-3 text-xs mt-0.5">{v.year}, {v.fuel}, {v.borough}</p>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="font-heading font-bold text-ink text-h3 tabular">£{v.weekly_rent}</span>
              <span className="text-ink-3 text-sm">/ week</span>
            </div>
            <p className="text-ink-3 text-xs mt-1">Rent only. You choose the insurance in step 3.</p>
            <a href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi Kharo, I have a question about the ${v.make} ${v.model} (${v.id}).`)}`} target="_blank" rel="noopener noreferrer"
              className="pressable mt-4 inline-flex h-10 w-full items-center justify-center rounded-md border border-line-strong bg-surface text-[13.5px] font-semibold text-ink hover:bg-surface-2" data-testid="apply-whatsapp">
              Ask a question on WhatsApp
            </a>
          </div>
        </div>

        {/* Interest form */}
        <Enter className="order-first lg:order-none w-full panel rounded-lg p-6 sm:p-8">
          <h1 className="text-h3 font-heading font-extrabold text-ink">Register interest in the {v.make} {v.model}</h1>
          <p className="mt-1.5 text-[14.5px] text-ink-2">Four short steps. Nothing is charged, and a person reads every application.</p>
          <div className="mt-4 mb-6">
            <div className="text-[12.5px] text-ink-3 mb-2.5">Step {step + 1} of {STEP_KEYS.length}</div>
            <div className="flex items-center gap-1.5">
              {STEP_KEYS.map((k) => (<div key={k} className={`h-1.5 rounded-full flex-1 transition-colors duration-ui ease-out ${STEP_KEYS.indexOf(k) <= step ? "bg-green" : "bg-surface-2"}`} />))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <motion.div layout transition={SPRING.ui}>
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.div key={cur} custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  {cur === "about" && (
                    <>
                      <h2 className="text-h3 font-heading font-bold text-ink">{APPLY.step1.heading}</h2>
                      <p className="text-[15px] text-ink-2 mt-2 mb-6">{APPLY.step1.sub}</p>
                      <div className="space-y-4">
                        <Field label="Your phone number"><Input autoFocus type="tel" inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="07700 900 000" data-testid="apply-phone" /></Field>
                        <Field label="Your name"><Input value={f.name} onChange={set("name")} placeholder="Your full name" data-testid="apply-name" /></Field>
                        <Field label="Email (if you have one)"><Input type="email" value={f.email} onChange={set("email")} data-testid="apply-email" /></Field>
                        <Field label="When do you want to start driving?">
                          <select value={f.start_when} onChange={set("start_when")} className="select-field w-full" data-testid="apply-start-when">
                            {APPLY.timeframes.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </Field>
                      </div>
                    </>
                  )}
                  {cur === "licence" && (
                    <>
                      <h2 className="text-h3 font-heading font-bold text-ink">{APPLY.step2.heading}</h2>
                      <p className="text-[15px] text-ink-2 mt-2 mb-6">{APPLY.step2.sub}</p>
                      <div className="space-y-4">
                        <Field label="DVLA licence number (optional)"><Input value={f.dvla_licence} onChange={set("dvla_licence")} placeholder="SMITH901284JS9AB" data-testid="apply-dvla" /></Field>
                        <Field label="PCO / TfL badge number (optional)"><Input value={f.pco_licence} onChange={set("pco_licence")} placeholder="123456" data-testid="apply-pco" /></Field>
                      </div>
                      <p className="text-[12.5px] text-ink-3 mt-4 leading-relaxed">{APPLY.step2.privacy}</p>
                    </>
                  )}
                  {cur === "cover" && (
                    <>
                      <h2 className="text-h3 font-heading font-bold text-ink">{APPLY.stepCover.heading}</h2>
                      <p className="text-[15px] text-ink-2 mt-2 mb-5">{APPLY.stepCover.sub}</p>

                      {/* Underline tabs, not a boxed control: this already sits inside the
                          form panel and a box in a box reads as clutter. */}
                      <div className="flex gap-6 border-b border-line mb-1" role="radiogroup" aria-label="How you would pay">
                        {APPLICATION_FLOW.terms.map((t) => {
                          const on = f.cover_term === t.id;
                          return (
                            <button key={t.id} type="button" role="radio" aria-checked={on}
                              onClick={() => setF((p) => ({ ...p, cover_term: t.id }))}
                              data-testid={`apply-term-${t.id}`}
                              className={`pressable -mb-px border-b-2 pb-2.5 pt-1 text-[14px] font-semibold transition-colors duration-ui ${on ? "border-green text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                              {t.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="divide-y divide-line border-y border-line" role="radiogroup" aria-label="Cover level">
                        {["comp", "tpft", "tp"].map((lvl) => {
                          const q = quoteFor(lvl); const on = f.cover_level === lvl;
                          const suffix = APPLICATION_FLOW.terms.find((t) => t.id === f.cover_term).suffix;
                          return (
                            <button key={lvl} type="button" role="radio" aria-checked={on}
                              onClick={() => setF((p) => ({ ...p, cover_level: lvl }))}
                              data-testid={`apply-cover-${lvl}`}
                              className="pressable grid w-full grid-cols-[1.25rem_1fr_auto] items-start gap-3 py-4 text-left">
                              <span aria-hidden="true" className={`mt-1 h-4 w-4 rounded-full border-2 ${on ? "border-green bg-green" : "border-line-strong"}`} />
                              <span>
                                <span className="block text-[15px] font-semibold text-ink">{APPLY.stepCover.levels[lvl]}</span>
                                <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-2">{APPLY.stepCover.levelNotes[lvl]}</span>
                                <span className="mt-1 block text-[12.5px] text-ink-3">{q.excess}</span>
                              </span>
                              <span className="text-right tabular">
                                <span className="block font-heading text-[19px] font-bold text-ink">£{q.price[f.cover_term].toLocaleString()}</span>
                                <span className="block text-[12px] text-ink-3">{suffix}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[12.5px] text-ink-3 mt-4 leading-relaxed">{APPLY.stepCover.note}</p>
                    </>
                  )}
                  {cur === "review" && (
                    <>
                      <h2 className="text-h3 font-heading font-bold text-ink">{APPLY.step3.heading}</h2>
                      <p className="text-[15px] text-ink-2 mt-2 mb-6">{APPLY.step3.sub}</p>
                      <div className="divide-y divide-line border-y border-line text-[14px]">
                        <Row l="Car" v={`${v.make} ${v.model}, ${v.borough}`} />
                        <Row l="Name" v={f.name} />
                        <Row l="Email" v={f.email} />
                        {f.phone && <Row l="Phone" v={f.phone} />}
                        <Row l="Start" v={f.start_when} />
                        <Row l="Cover" v={`${APPLY.stepCover.levels[f.cover_level]}, £${quoteFor(f.cover_level).price[f.cover_term].toLocaleString()} ${APPLICATION_FLOW.terms.find((t) => t.id === f.cover_term).suffix} (indicative)`} />
                      </div>
                      <ul className="mt-5 space-y-2.5">
                        {APPLY.reassure.items.map((it) => (
                          <li key={it} className="flex items-start gap-2.5 text-[13.5px] text-ink-2">
                            <Check className="w-3.5 h-3.5 text-green shrink-0 mt-0.5" strokeWidth={2.25} /> {it}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-3 mt-8">
              {step > 0 && <Button type="button" variant="outline" onClick={back}><ArrowLeft className="w-4 h-4" strokeWidth={1.75} /></Button>}
              <Button type="submit" disabled={loading} className="flex-1" data-testid={isLast ? "apply-submit" : "apply-continue"}>
                {isLast ? (loading ? "Sending" : APPLY.step3.cta) : "Continue"} {!isLast && <ArrowRight className="w-4 h-4" strokeWidth={1.75} />}
              </Button>
            </div>
          </form>
        </Enter>
      </div>
    </main>
  );
}

const Field = ({ label, children }) => (<div><Label className="text-[13px] font-medium text-ink-2 mb-1.5 block">{label}</Label>{children}</div>);
const Row = ({ l, v }) => (<div className="flex justify-between gap-3 py-3"><span className="text-ink-3">{l}</span><span className="text-ink font-medium text-right">{v}</span></div>);
