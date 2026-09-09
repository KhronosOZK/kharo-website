import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Check, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DURATIONS, weeklyForWeeks, discountForWeeks } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import PreviewNotice from "@/components/PreviewNotice";
import { PREVIEW } from "@/content/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const steps = ["Your plan", "About you", "Licence", "Review"];

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const { user } = useAuth();
  const [v, setV] = useState(null);
  const [quote, setQuote] = useState(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [weeks, setWeeks] = useState(Number(sp.get("weeks")) || 8);
  const [f, setF] = useState({ full_name: "", email: "", phone: "", dob: "", dvla_licence: "", pco_licence: "", years_experience: "", previous_incidents: "none" });

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/listings/${id}`).then((r) => setV(r.data)).catch(() => navigate("/"));
    api.post("/quote", { listing_id: id }).then((r) => setQuote(r.data)).catch(() => {});
  }, [id, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    api.get("/auth/me").then((r) => {
      const u = r.data;
      setF((p) => ({
        ...p,
        full_name: u.name || p.full_name, email: u.email || p.email, phone: u.phone || p.phone,
        dob: u.dob || p.dob, dvla_licence: u.dvla_licence || p.dvla_licence, pco_licence: u.pco_licence || p.pco_licence,
        years_experience: u.years_experience != null ? String(u.years_experience) : p.years_experience,
      }));
      if (u.dvla_licence || u.pco_licence) setPrefilled(true);
    }).catch(() => {});
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const insurance = quote ? quote.cheapest_weekly : 0;
  const breakdownCost = v && !v.breakdown_included ? 8 : 0;
  const rentWeekly = v ? weeklyForWeeks(v.weekly_rent, weeks) : 0;
  const total = v ? (rentWeekly + insurance + breakdownCost).toFixed(2) : "0";
  const saved = v ? ((v.weekly_rent - rentWeekly) * weeks).toFixed(0) : 0;
  const discount = discountForWeeks(weeks);

  const canNext = () => {
    if (step === 1) return f.full_name && f.email && f.phone && f.dob;
    if (step === 2) return f.dvla_licence && f.pco_licence;
    return true;
  };

  const submit = async () => {
    try {
      await api.post("/applications", {
        listing_id: id, full_name: f.full_name, email: f.email, phone: f.phone, dob: f.dob,
        dvla_licence: f.dvla_licence, pco_licence: f.pco_licence,
        years_experience: f.years_experience ? Number(f.years_experience) : null,
        previous_incidents: f.previous_incidents, duration_weeks: weeks,
        insurance_details: { insurer: quote?.quotes?.[0]?.insurer, weekly: insurance },
        estimated_weekly_cost: Number(total),
      });
      setDone(true); window.scrollTo(0, 0);
    } catch { toast.error("Couldn't send your application. Please try again."); }
  };

  if (!v) return <div className="max-w-2xl mx-auto px-4 py-20 text-[#7A857F]">Loading…</div>;

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <PreviewNotice variant="inline" className="mb-6" />
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-emerald-700" /></div>
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25] mt-6" data-testid="apply-success">Application sent</h1>
      <p className="text-[#4A564F] mt-3 leading-relaxed">{PREVIEW.successBody} Your licence details are saved, so when we match you to a real car you will not have to enter any of this again.</p>
      <div className="flex gap-3 justify-center mt-8"><Button onClick={() => navigate("/search")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">Browse more cars</Button><Button onClick={() => navigate("/")} variant="outline" className="rounded-full">Back to home</Button></div>
    </main>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i <= step ? "bg-[#0B6B4F] text-white" : "bg-[#E7E4DC] text-[#9AA39D]"}`}>{i < step ? <Check className="w-4 h-4" /> : i + 1}</div>
                  <span className={`text-[11px] mt-1.5 hidden sm:block ${i <= step ? "text-[#1A2E25] font-medium" : "text-[#9AA39D]"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 rounded ${i < step ? "bg-[#0B6B4F]" : "bg-[#E7E4DC]"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[22px] p-6 sm:p-8 ring-1 ring-slate-200/70">
            {step === 0 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">How long do you want the car?</h1>
              <p className="text-[15px] text-[#4A564F] mt-2 mb-6">Longer terms mean a lower weekly rate. You can extend later if you want to.</p>
              <Label className="mb-1.5 block text-sm">Rental length</Label>
              <Select value={String(weeks)} onValueChange={(x) => setWeeks(Number(x))}>
                <SelectTrigger data-testid="apply-duration" className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>{DURATIONS.map((d) => <SelectItem key={d.weeks} value={String(d.weeks)}>{d.label}{discountForWeeks(d.weeks) > 0 ? ` · save ${Math.round(discountForWeeks(d.weeks) * 100)}%` : ""}</SelectItem>)}</SelectContent>
              </Select>
              <div className="mt-5 rounded-2xl bg-emerald-50/60 ring-1 ring-emerald-100 p-5">
                <div className="flex items-center justify-between"><span className="text-[14px] text-[#3B4A44]">Your weekly rent</span><span className="font-heading font-extrabold text-2xl text-[#1A2E25]">£{rentWeekly.toFixed(2)}</span></div>
                {discount > 0 && <div className="text-[13px] text-[#0B6B4F] mt-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> That saves you about £{saved} over {weeks} weeks versus the weekly rate.</div>}
              </div>
            </div>)}
            {step === 1 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">A little about you</h1>
              <p className="text-[15px] text-[#4A564F] mt-2 mb-6">{prefilled ? "We have filled this in from your profile. Change anything that is out of date." : "Takes about a minute. Your licence details come next."}</p>
              <div className="space-y-4">
                <Field label="Full name" testid="apply-name"><Input value={f.full_name} onChange={set("full_name")} className="h-11" placeholder="Jordan Smith" /></Field>
                <Field label="Date of birth" testid="apply-dob"><Input type="date" value={f.dob} onChange={set("dob")} className="h-11" /></Field>
                <Field label="Email" testid="apply-email"><Input type="email" value={f.email} onChange={set("email")} className="h-11" /></Field>
                <Field label="Phone" testid="apply-phone"><Input value={f.phone} onChange={set("phone")} className="h-11" /></Field>
              </div>
            </div>)}
            {step === 2 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Licence and driving</h1>
              <p className="text-[15px] text-[#4A564F] mt-2 mb-6">The same details insurers ask for. Your PCO badge number is what lets us match you to a real car quickly at launch, so it is worth adding now.</p>
              <div className="space-y-4">
                <Field label="DVLA licence number" testid="apply-dvla"><Input value={f.dvla_licence} onChange={set("dvla_licence")} className="h-11" placeholder="SMITH901284JS9AB" /></Field>
                <Field label="PCO / TfL badge number" testid="apply-pco"><Input value={f.pco_licence} onChange={set("pco_licence")} className="h-11" placeholder="123456" /></Field>
                <Field label="Years of driving experience" testid="apply-exp"><Input type="number" value={f.years_experience} onChange={set("years_experience")} className="h-11" placeholder="3" /></Field>
                <Field label="Any incidents in the last 5 years?" testid="apply-incidents"><Input value={f.previous_incidents} onChange={set("previous_incidents")} className="h-11" placeholder="None declared" /></Field>
              </div>
            </div>)}
            {step === 3 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Check it over and send</h1>
              <p className="text-[15px] text-[#4A564F] mt-2 mb-6">Make sure this looks right, then send it. The operator will review it and come back to you within 24 hours.</p>
              <div className="space-y-3 text-[14px] bg-[#F9F8F6] rounded-2xl p-5">
                <Rev l="Car" v={`${v.make} ${v.model} ${v.year}`} />
                <Rev l="Rental length" v={`${weeks} weeks`} />
                <Rev l="Driver" v={f.full_name} />
                <Rev l="Weekly rent" v={`£${rentWeekly.toFixed(2)}${discount > 0 ? ` (${Math.round(discount * 100)}% off)` : ""}`} />
                <Rev l="Insurance" v={`${quote?.quotes?.[0]?.insurer || "Quote"}, £${insurance.toFixed(2)}/wk`} />
                <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-base"><span>Total each week</span><span className="text-[#0B6B4F]">£{total}</span></div>
              </div>
              <div className="mt-4 flex items-start gap-2 text-[12px] text-[#7A857F]"><ShieldCheck className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" /> Your details are used only to vet you for this rental, never sold on. Nothing is charged until you agree the rental terms with the operator.</div>
            </div>)}

            <div className="flex gap-3 mt-8">
              {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full" data-testid="apply-back">Back</Button>}
              {step < 3 ? (
                <Button onClick={() => canNext() ? setStep(step + 1) : toast.error("Please fill in the required fields.")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1" data-testid="apply-continue">Continue</Button>
              ) : (
                <Button onClick={submit} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1" data-testid="apply-submit">{PREVIEW.ctaSecondary}</Button>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="lg:sticky lg:top-24 bg-white rounded-[22px] overflow-hidden ring-1 ring-slate-200/70" data-testid="order-summary">
            <img src={v.photos[0]} alt="" className="w-full h-40 object-cover" />
            <div className="p-6">
              <h3 className="font-heading font-bold text-[#1A2E25]">{v.make} {v.model} {v.year}</h3>
              <p className="text-[12px] text-[#7A857F] capitalize">{v.fuel} · {v.seats} seats · {v.borough}</p>
              <div className="mt-4 space-y-2.5 text-[14px]">
                <div className="flex justify-between"><span className="text-[#4A564F]">Rent ({weeks} wks)</span><span className="font-semibold">£{rentWeekly.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#4A564F]">Insurance</span><span className="font-semibold">£{insurance.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#4A564F]">Breakdown</span><span className="font-semibold">{v.breakdown_included ? "Included" : `£${breakdownCost.toFixed(2)}`}</span></div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between text-base"><span className="font-semibold">Each week</span><span className="font-heading font-extrabold text-[#0B6B4F]">£{total}</span></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-[#7A857F]"><Lock className="w-3.5 h-3.5 text-[#0B6B4F]" /> Operator revealed once you are approved.</div>
              <div data-testid="apply-insurance-note"
                className="mt-4 flex items-start gap-2 rounded-xl bg-[#F1EFE9] px-3.5 py-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.8} />
                <span className="text-[12px] text-[#1A2E25] leading-snug">
                  The insurance figure is indicative. We confirm your exact premium with specialist
                  private hire insurers once your details are checked, and it never changes without
                  telling you first.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const Field = ({ label, children, testid }) => (<div data-testid={testid}><Label className="text-sm text-[#4A564F] mb-1.5 block">{label}</Label>{children}</div>);
const Rev = ({ l, v }) => (<div className="flex justify-between"><span className="text-[#7A857F]">{l}</span><span className="font-medium text-[#1A2E25]">{v}</span></div>);
