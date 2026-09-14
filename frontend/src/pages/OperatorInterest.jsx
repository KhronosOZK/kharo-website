import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, TrendingUp, Shield, Users, Zap, ChevronRight, Star, MapPin, Lock, Activity } from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";
import { useSeo } from "@/lib/seo";

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
  const [idleCars, setIdleCars] = useState(3);
  const [weeklyRate, setWeeklyRate] = useState(265);
  const [f, setF] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    fleet_size: "",
    current_idle: "",
    message: "",
  });

  useSeo({
    title: "List Your Fleet · Kharo | PCO Operator Platform",
    description:
      "Stop losing revenue to idle PCO cars. List your fleet on Kharo and connect with vetted London drivers in days, not weeks.",
  });

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.company_name.trim() || !f.email.includes("@") || !f.phone.trim()) {
      toast.error("Please fill in company name, email and phone.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/operator-interest", f);
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
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero - Obsidian surface, Hyper Blue B2B accent (per DESIGN.md) */}
      <section className="relative text-white py-20 px-4 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="relative max-w-6xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: "#0B6B4F" }}>
            For Fleet Operators
          </p>
          <h1 className="text-[38px] sm:text-5xl font-heading font-extrabold leading-[1.05] max-w-2xl mb-5">
            Stop losing money to idle PCO cars
          </h1>
          <p className="text-white/60 text-[17px] max-w-xl leading-relaxed mb-8">
            Every week a licensed car sits without a driver costs you hundreds of pounds.
            Kharo connects your fleet with vetted London drivers who are ready to rent now.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#form"
              className="px-6 py-3 rounded-md font-semibold text-[15px] transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "#0B6B4F", color: "#fff" }}
            >
              List your fleet
            </a>
            <button
              onClick={() => navigate("/operator-guide")}
              className="px-6 py-3 rounded-md border border-white/15 text-white font-medium text-[15px] hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              Read the operator guide
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: calculator + benefits */}
          <div>
            {/* Void Calculator */}
            <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-6">
              <h2 className="text-[18px] font-heading font-bold text-[#111] mb-1">
                Revenue you're losing right now
              </h2>
              <p className="text-[13px] text-[#888] mb-6">
                Adjust both sliders to see how much idle cars are costing your business.
              </p>

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

              {/* Revenue lost tiles */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-[#F8F8F8] rounded-xl p-3.5">
                  <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wide mb-1.5">
                    Per week
                  </div>
                  <div className="text-[22px] font-heading font-extrabold text-[#DC2626] leading-none tabular-nums">
                    £{weeklyRevenueLost.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#F8F8F8] rounded-xl p-3.5">
                  <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wide mb-1.5">
                    Per month
                  </div>
                  <div className="text-[22px] font-heading font-extrabold text-[#DC2626] leading-none tabular-nums">
                    £{monthlyRevenueLost.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#F8F8F8] rounded-xl p-3.5 border-2 border-[#DC2626]/20">
                  <div className="text-[10px] font-semibold text-[#DC2626] uppercase tracking-wide mb-1.5">
                    Per year
                  </div>
                  <div className="text-[22px] font-heading font-extrabold text-[#DC2626] leading-none tabular-nums">
                    £{yearlyRevenueLost.toLocaleString()}
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-[#BBB] mt-3">
                Based on your rate inputs. Actual figures depend on your specific contracts.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl border border-[#E8E8E8] p-5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#0B6B4F]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[15px] text-[#111] mb-0.5">
                      {title}
                    </h3>
                    <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-6 bg-[#0B6B4F] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#5FD3A6] text-[#5FD3A6]" />
                ))}
              </div>
              <p className="text-[14px] text-white/90 leading-relaxed mb-3">
                "We had 4 cars sitting idle for weeks. Kharo filled them within 10 days.
                The drivers were all properly vetted. No surprises."
              </p>
              <p className="text-[12px] text-white/60">Fleet operator, East London</p>
            </div>
          </div>

          {/* RIGHT: lead form */}
          <div id="form">
            <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6">
              <h2 className="text-[20px] font-heading font-bold text-[#111] mb-1">
                Tell us about your fleet
              </h2>
              <p className="text-[14px] text-[#888] mb-6">
                A Kharo fleet specialist will call within 1 working day.
              </p>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Company name" required>
                    <input
                      className={INPUT}
                      placeholder="e.g. London PHV Ltd"
                      value={f.company_name}
                      onChange={set("company_name")}
                      required
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
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] disabled:opacity-60 text-white font-semibold text-[15px] transition-colors"
                >
                  {loading ? "Sending..." : "Request a call back"}
                </button>

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
        </div>
      </div>
{/* RISK MANAGEMENT SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
          <div className="px-6 py-5" style={{ backgroundColor: "#0A0A0A" }}>
            <h2 className="font-heading font-bold text-white text-xl mb-1">
              Built-in Risk Management
            </h2>
            <p className="text-white/70 text-sm">
              Kharo gives you the tools to protect your fleet and guarantee rental income.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F0F0F0]">
            <div className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-[#0B6B4F]" />
              </div>
              <h3 className="font-heading font-bold text-[#111] text-base mb-2">
                Uber Enforcement Integration
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed">
                If a driver misses a rental payment, Kharo contacts Uber directly to flag the account. The driver cannot accept new trips until the outstanding rent is cleared. This ensures you never chase payments alone.
              </p>
              <div className="mt-4 flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0B6B4F] flex-shrink-0 mt-0.5" />
                <span className="text-[12px] text-[#888]">Applies to Uber, Bolt and other platforms we partner with</span>
              </div>
            </div>
            <div className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-[#0B6B4F]" />
              </div>
              <h3 className="font-heading font-bold text-[#111] text-base mb-2">
                GPS Tracker Required
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed">
                All vehicles listed on Kharo must have a certified GPS tracker installed prior to handover. This is a condition of listing. Kharo can recommend approved tracker providers and assist with installation through our partner garages.
              </p>
              <div className="mt-4 flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0B6B4F] flex-shrink-0 mt-0.5" />
                <span className="text-[12px] text-[#888]">Trackers must meet our minimum specification for real-time location</span>
              </div>
            </div>
            <div className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] flex items-center justify-center mb-4">
                <Activity className="w-5 h-5 text-[#0B6B4F]" />
              </div>
              <h3 className="font-heading font-bold text-[#111] text-base mb-2">
                Live Fleet Dashboard
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed">
                Track all your vehicles in real time from the Kharo Operator Dashboard. See location, driver status, mileage and payment status in one place. Get alerts for unusual movement or missed payments.
              </p>
              <div className="mt-4 flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0B6B4F] flex-shrink-0 mt-0.5" />
                <span className="text-[12px] text-[#888]">Access from any device, 24 hours a day</span>
              </div>
            </div>
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
        <div className="w-16 h-16 rounded-full bg-[#EAF5F1] flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-[#0B6B4F]" strokeWidth={2.5} />
        </div>
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
