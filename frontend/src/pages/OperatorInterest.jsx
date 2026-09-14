import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, TrendingUp, Shield, Users, Zap, ChevronRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { BRAND } from "@/content/site";

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Fill idle cars faster",
    body: "Every week a PCO car sits empty is revenue gone. Kharo puts it in front of vetted drivers actively looking.",
  },
  {
    icon: Shield,
    title: "Pre-screened drivers only",
    body: "4-layer vetting: DVLA check, identity, Open Banking affordability and trade record. Your fleet, protected.",
  },
  {
    icon: Users,
    title: "You control the terms",
    body: "Set your weekly rate, deposit, mileage allowance and restrictions. Kharo handles the lead; you close the deal.",
  },
  {
    icon: Zap,
    title: "No upfront cost",
    body: "Listing is free. Kharo earns only when a rental completes, so we are incentivised to find you quality drivers.",
  },
];

const INPUT =
  "w-full h-11 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl px-4 text-[15px] text-[#111] placeholder:text-[#BBB] focus:outline-none focus:border-[#0B6B4F] focus:bg-white transition-colors";
const LABEL = "block text-[13px] font-semibold text-[#555] mb-1.5";

function SliderTrack({ min, max, value, onChange, step = 1, label, formatVal }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[13px] font-semibold text-[#555]">{label}</label>
        <span className="text-[22px] font-heading font-extrabold text-[#111] tabular-nums">
          {formatVal(value)}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#F0F0F0]">
        <div
          className="absolute h-2 rounded-full bg-[#0B6B4F] transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          aria-label={label}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#0B6B4F] shadow-md pointer-events-none transition-all"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-[#CCC] mt-2">
        <span>{formatVal(min)}</span>
        <span>{formatVal(max)}</span>
      </div>
    </div>
  );
}

export default function OperatorInterest() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [idleCars, setIdleCars] = useState(3);
  const [weeklyRate, setWeeklyRate] = useState(265);
  const [f, setF] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    fleet_size: "",
    current_idle: "",
    areas: "",
    message: "",
  });

  useSeo({
    title: "List Your Fleet · Kharo | PCO Operator Platform",
    description:
      "Stop losing revenue to idle PCO cars. List your fleet on Kharo and connect with vetted London drivers in days, not weeks.",
  });

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!f.company_name.trim() || !f.email.includes("@") || !f.phone.trim()) {
        toast.error("Please fill in company name, email and phone.");
        return;
      }
      setStep(2);
      return;
    }
    submit();
  };

  const submit = async () => {
    if (!f.areas.trim()) {
      toast.error("Let us know which areas you operate in.");
      return;
    }
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
        heard_from: f.message ? `Idle: ${f.current_idle || "n/a"}. Notes: ${f.message}` : `Idle: ${f.current_idle || "n/a"}`,
      });
      trackEvent("operator_interest", { fleet_size: f.fleet_size });
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const weeklyRevenueLost = idleCars * weeklyRate;
  const monthlyRevenueLost = Math.round(weeklyRevenueLost * 4.33);
  const yearlyRevenueLost = weeklyRevenueLost * 52;

  if (sent) return <SuccessScreen navigate={navigate} />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - fleet photography, matches the homepage's dark cinematic treatment */}
      <section className="relative text-white py-24 px-4 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,0.97) 100%), url('https://images.pexels.com/photos/35011130/pexels-photo-35011130.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1000')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4 text-[#5FD3A6]">
            For Fleet Operators
          </p>
          <h1 className="text-[38px] sm:text-5xl font-heading font-extrabold leading-[1.05] max-w-2xl mb-5" style={{ textWrap: "balance" }}>
            Stop losing money to idle PCO cars
          </h1>
          <p className="text-white/60 text-[17px] max-w-xl leading-relaxed mb-8">
            Every week a licensed car sits without a driver costs you hundreds of pounds.
            Kharo connects your fleet with vetted London drivers who are ready to rent now.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#form"
              className="px-7 py-3.5 rounded-full bg-[#5FD3A6] text-[#0A0A0A] font-semibold text-[15px] hover:bg-white transition-colors"
            >
              List your fleet
            </a>
            <button
              onClick={() => navigate("/operator-guide")}
              className="px-7 py-3.5 rounded-full border border-white/20 text-white font-medium text-[15px] hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              Read the operator guide
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* BENEFITS STRIP - clean icon + text, matches the Operator Guide page */}
      <section className="bg-white border-b border-[#EBEBEB] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="w-7 h-7 text-[#0B6B4F] shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-heading font-bold text-[14px] text-[#111] mb-0.5">{title}</p>
                  <p className="text-[12.5px] text-[#666] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVENUE CALCULATOR - its own full-width, breathing section */}
      <section className="bg-[#FAFAFA] border-b border-[#EBEBEB] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-2">Idle Cars Cost You</p>
            <h2 className="font-heading font-bold text-[#111] text-[26px] sm:text-[30px]" style={{ textWrap: "balance" }}>
              See what idle cars are costing you
            </h2>
            <p className="text-[14px] text-[#888] mt-2">Adjust both sliders to estimate your lost revenue.</p>
          </div>

          <div className="bg-white rounded-[26px] border border-[#E8E8E8] p-6 sm:p-8">
            <SliderTrack
              label="Cars sitting idle"
              min={1}
              max={20}
              value={idleCars}
              onChange={setIdleCars}
              formatVal={(v) => `${v} car${v !== 1 ? "s" : ""}`}
            />

            <SliderTrack
              label="Weekly rate per car"
              min={150}
              max={500}
              step={5}
              value={weeklyRate}
              onChange={setWeeklyRate}
              formatVal={(v) => `£${v}`}
            />

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-[#FAFAFA] rounded-xl p-4 text-center">
                <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wide mb-1.5">Per week</div>
                <div className="text-[22px] font-heading font-extrabold text-[#DC2626] leading-none tabular-nums">
                  £{weeklyRevenueLost.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl p-4 text-center">
                <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wide mb-1.5">Per month</div>
                <div className="text-[22px] font-heading font-extrabold text-[#DC2626] leading-none tabular-nums">
                  £{monthlyRevenueLost.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl p-4 text-center ring-1 ring-[#DC2626]/15">
                <div className="text-[10px] font-semibold text-[#DC2626] uppercase tracking-wide mb-1.5">Per year</div>
                <div className="text-[22px] font-heading font-extrabold text-[#DC2626] leading-none tabular-nums">
                  £{yearlyRevenueLost.toLocaleString()}
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#BBB] mt-4 text-center">
              An illustrative estimate based on your inputs, not a quote. Actual figures depend on your contracts.
            </p>
          </div>
        </div>
      </section>

      {/* LEAD FORM - two-step: minimal contact info first, details second. Fewer fields up front lifts B2B form completion. */}
      <section id="form" className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-2">Get Started</p>
            <h2 className="font-heading font-bold text-[#111] text-[26px] sm:text-[30px]" style={{ textWrap: "balance" }}>
              Tell us about your fleet
            </h2>
            <p className="text-[14px] text-[#888] mt-2">A Kharo fleet specialist will call within 1 working day.</p>
          </div>

          <div className="bg-white rounded-[26px] border border-[#E8E8E8] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((n) => (
                <div key={n} className="flex-1 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${step >= n ? "bg-[#0B6B4F] text-white" : "bg-[#F0F0F0] text-[#AAA]"}`}>
                    {step > n ? <Check className="w-3.5 h-3.5" /> : n}
                  </div>
                  <span className={`text-[12px] font-medium ${step >= n ? "text-[#111]" : "text-[#AAA]"}`}>
                    {n === 1 ? "Your details" : "About your fleet"}
                  </span>
                  {n === 1 && <div className={`flex-1 h-px ${step > 1 ? "bg-[#0B6B4F]" : "bg-[#EBEBEB]"}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <FormField label="Company name" required>
                    <input
                      className={INPUT}
                      placeholder="e.g. London PHV Ltd"
                      value={f.company_name}
                      onChange={set("company_name")}
                      required
                      autoFocus
                    />
                  </FormField>
                  <FormField label="Your name">
                    <input
                      className={INPUT}
                      placeholder="Your full name"
                      value={f.contact_name}
                      onChange={set("contact_name")}
                    />
                  </FormField>
                  <FormField label="Email address" required>
                    <input
                      className={INPUT}
                      type="email"
                      placeholder="you@company.com"
                      value={f.email}
                      onChange={set("email")}
                      required
                      autoComplete="email"
                      inputMode="email"
                    />
                  </FormField>
                  <FormField label="Phone number" required>
                    <input
                      className={INPUT}
                      type="tel"
                      placeholder="07700 900 000"
                      value={f.phone}
                      onChange={set("phone")}
                      required
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </FormField>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold text-[15px] transition-colors"
                  >
                    Continue
                  </button>

                  {BRAND.whatsapp && (
                    <a
                      href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi Kharo, I'd like to list my fleet.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-[13px] font-medium text-[#555] hover:text-[#0B6B4F] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Prefer WhatsApp? Message us instead
                    </a>
                  )}
                </>
              ) : (
                <>
                  <FormField label="Areas you operate in" required>
                    <input
                      className={INPUT}
                      placeholder="e.g. East London, Barking, Ilford"
                      value={f.areas}
                      onChange={set("areas")}
                      required
                      autoFocus
                    />
                  </FormField>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Total fleet size">
                      <select
                        className={INPUT + " appearance-none cursor-pointer"}
                        value={f.fleet_size}
                        onChange={set("fleet_size")}
                      >
                        <option value="">Select...</option>
                        <option value="1-5">1 to 5 vehicles</option>
                        <option value="6-15">6 to 15 vehicles</option>
                        <option value="16-30">16 to 30 vehicles</option>
                        <option value="30+">30+ vehicles</option>
                      </select>
                    </FormField>
                    <FormField label="Cars currently idle">
                      <select
                        className={INPUT + " appearance-none cursor-pointer"}
                        value={f.current_idle}
                        onChange={set("current_idle")}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 car</option>
                        <option value="2-3">2 to 3 cars</option>
                        <option value="4-5">4 to 5 cars</option>
                        <option value="5+">5+ cars</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Anything else we should know?">
                    <textarea
                      className={INPUT + " h-24 py-3 resize-none"}
                      placeholder="Vehicle makes, specific requirements, borough coverage..."
                      value={f.message}
                      onChange={set("message")}
                    />
                  </FormField>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="h-12 px-5 rounded-full border border-[#E8E8E8] text-[#555] font-medium text-[15px] hover:bg-[#F5F5F5] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] disabled:opacity-60 text-white font-semibold text-[15px] transition-colors"
                    >
                      {loading ? "Sending..." : "Request a call back"}
                    </button>
                  </div>
                </>
              )}

              <ul className="space-y-1.5 pt-1">
                {[
                  "Free to list, no monthly fees",
                  "Kharo calls you within 1 working day",
                  "Your details are never sold",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[12.5px] text-[#888]">
                    <Check className="w-3.5 h-3.5 text-[#0B6B4F] shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Success screen */

function SuccessScreen({ navigate }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-[#E8E8E8] p-8">
        <Check className="w-14 h-14 text-[#0B6B4F] mx-auto mb-5" strokeWidth={1.75} />
        <h1 className="text-[22px] font-heading font-extrabold text-[#111] mb-2">
          We'll be in touch soon
        </h1>
        <p className="text-[14px] text-[#555] leading-relaxed mb-6">
          A Kharo fleet specialist will call you within 1 working day to discuss
          how we can help fill your idle cars.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/operator-guide")}
            className="h-11 rounded-full border border-[#E8E8E8] text-[#333] text-[14px] font-medium hover:bg-[#F5F5F5] transition-colors"
          >
            Read the operator guide
          </button>
          <button
            onClick={() => navigate("/")}
            className="h-11 rounded-full bg-[#0B6B4F] text-white text-[14px] font-semibold hover:bg-[#095B43] transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className={LABEL}>
        {label}
        {required && <span className="text-[#0B6B4F] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
