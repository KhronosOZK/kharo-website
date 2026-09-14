import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, ChevronRight, ShieldCheck } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { VEHICLE_CLASSES } from "@/lib/pricing";

const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// hero content is already in view on load: animate on mount, not on scroll-into-view,
// since whileInView's IntersectionObserver can miss content that's visible at paint time
const FADE_UP_HERO = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const COMPARE = [
  {
    old: "Insurance folded into one \"all-in\" weekly figure",
    new: "Rental price shown on its own. Insurance quoted separately, at cost.",
  },
  {
    old: "Every driver charged the same, regardless of risk",
    new: "Quoted against your own profile, so safer records pay less.",
  },
  {
    old: "No way to tell what the cover actually costs",
    new: "The insurance line is shown on its own, every week, on every statement.",
  },
  {
    old: "Re-quoted and re-typed for every car you look at",
    new: "Your details are checked once and reused across every listing.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Tell us your details once",
    body: "Licence, driving history and a few questions about how you plan to work. Takes a few minutes, saved for every car you look at afterwards.",
  },
  {
    num: "02",
    title: "We put it to specialist private hire insurers",
    body: "A standard personal motor policy excludes hire and reward work entirely. We only quote you cover that is built for private hire, from insurers who underwrite it properly.",
  },
  {
    num: "03",
    title: "You see the figure before you commit",
    body: "The quote sits next to the rental price, not folded inside it. You can see exactly what each line costs before you apply for a car.",
  },
  {
    num: "04",
    title: "It travels with you",
    body: "Change cars within Kharo and your quote is re-run against the new vehicle rather than started from nothing.",
  },
];

const COVERED = [
  "Third party, fire and theft as a minimum, on every policy we quote",
  "Hire and reward use, the cover a standard personal policy specifically excludes",
  "Driving between private hire jobs and while waiting for a fare",
  "Passengers in the vehicle at the time of a claim",
];

const NOT_COVERED = [
  "Damage below your policy excess, which is settled from your deposit",
  "Use of the vehicle outside private hire work, unless your policy says otherwise",
  "Fines, penalty charges and congestion or ULEZ costs",
  "Fair wear and tear, which sits with the rental company, not the insurer",
];

const REQUIREMENTS = [
  "A valid TfL or council private hire driver licence",
  "A full UK or exchangeable driving licence, held for the period the listing states",
  "Usually 25 or over, the minimum most hire and reward insurers set",
  "No more than one fault claim in the last three years, as a general guide",
];

const FAQS = [
  {
    q: "Why isn't insurance just included in the price?",
    a: "Because it isn't the same cost for every driver. Folding it into one figure means safer drivers quietly subsidise riskier ones, and nobody can see what either line actually costs. Showing it separately means the rental price reflects the car, and the insurance price reflects you.",
  },
  {
    q: "Is this proper hire and reward cover?",
    a: "Yes. A standard personal motor policy excludes private hire work entirely, so it would not pay out on a claim while you had a fare in the car. Every quote we show comes from insurers who underwrite hire and reward cover specifically.",
  },
  {
    q: "What decides my price?",
    a: "Your driving history, how long you've held your licence, your claims record and the vehicle class you choose. We check your record once and reuse it, so you don't re-answer the same questions for every car.",
  },
  {
    q: "Can I use my own existing insurance instead?",
    a: "If you already hold a hire and reward policy that covers the specific vehicle and meets the operator's minimum terms, tell us when you apply and we will check it against the listing.",
  },
  {
    q: "What happens if I need to make a claim?",
    a: "Call us and we start it the same day. We deal with the insurer and the rental company on your behalf, and the liability table above sets out who covers what before you're ever in that position.",
  },
];

export default function Insurance() {
  const navigate = useNavigate();

  useSeo({
    title: "Insurance · Kharo",
    description:
      "How insurance works on Kharo: quoted separately from the rental price, based on your own profile, from specialist private hire insurers.",
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* Hero */}
      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 px-4 overflow-hidden border-b border-[#EEEEEE]" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p
            {...FADE_UP_HERO}
            className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5 text-[#0B6B4F]"
          >
            Insurance
          </motion.p>
          <motion.h1
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[40px] sm:text-6xl font-heading font-extrabold leading-[1.02] tracking-tight text-[#111] text-balance"
          >
            Priced on its own. Never padded into the rent.
          </motion.h1>
          <motion.p
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#666] text-[17px] mt-6 max-w-xl mx-auto leading-relaxed"
          >
            Every listing shows a rental price and nothing else. Insurance is quoted
            separately, based on your own profile, from insurers who actually underwrite
            hire and reward work.
          </motion.p>
          <motion.div
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-9 flex flex-wrap gap-3 justify-center"
          >
            <button
              onClick={() => navigate("/search")}
              className="px-7 py-3.5 rounded-full bg-[#0B6B4F] text-white font-semibold text-[15px] hover:bg-[#095B43] transition-colors"
            >
              See rental prices
            </button>
            <button
              onClick={() => navigate("/driver-guide")}
              className="px-7 py-3.5 rounded-full border border-[#D8D8D8] text-[#111] font-medium text-[15px] hover:bg-white transition-colors flex items-center gap-2"
            >
              How renting works
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Old way vs Kharo way */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            The way most platforms price insurance
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-10">
            And why Kharo does it differently.
          </p>

          <div className="space-y-4">
            {COMPARE.map(({ old, new: next }, i) => (
              <motion.div
                key={i}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
              >
                <div className="grid sm:grid-cols-2">
                  <div className="p-5 sm:border-r border-b sm:border-b-0 border-[#F0F0F0] flex items-start gap-3">
                    <X className="w-4 h-4 text-[#AAA] shrink-0 mt-0.5" />
                    <p className="text-[14px] text-[#666] leading-relaxed">{old}</p>
                  </div>
                  <div className="p-5 bg-[#FAFFFE] flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
                    <p className="text-[14px] text-[#444] leading-relaxed font-medium">{next}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How the quote works */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.p
            {...FADE_UP}
            className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
          >
            How it works
          </motion.p>
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[26px] sm:text-[30px] font-heading font-bold text-[#333] leading-snug mb-14 max-w-xl"
          >
            One form, reused on <span className="text-[#111] font-extrabold">every car you look at</span> from then on.
          </motion.h2>

          <div>
            {STEPS.map(({ num, title, body }, i) => (
              <motion.div
                key={title}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`grid sm:grid-cols-[64px_1fr] gap-x-6 gap-y-1 py-6 ${i > 0 ? "border-t border-[#EEEEEE]" : ""}`}
              >
                <span className="font-heading font-extrabold text-[15px] text-[#0B6B4F]">{num}</span>
                <div>
                  <h3 className="font-heading font-bold text-[17px] text-[#111] mb-1.5">{title}</h3>
                  <p className="text-[14px] text-[#666] leading-relaxed max-w-lg">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">What it costs</p>
            <h2 className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-4">
              An indicative figure, then a real one
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed mb-6">
              The number shown on a listing before you apply is indicative, built from typical
              driver profiles for that vehicle class. Your actual quote depends on your own
              driving history and claims record, and can land above or below it.
            </p>
            <div className="space-y-3">
              {[
                "Rental price never moves because of your insurance quote",
                "Quoted from specialist hire and reward insurers, not marked up by Kharo",
                "Shown as its own line on every statement, every week",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2.5">
                  <Check size={14} style={{ color: "#0B6B4F" }} strokeWidth={2.5} />
                  <span className="text-[#555] text-sm">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm border border-[#F5F5F5]"
              style={{ boxShadow: "0 32px 64px -20px rgba(0,0,0,0.22)", transform: "rotate(-2deg)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[#AAA] text-xs font-semibold uppercase tracking-wide">Indicative, by vehicle class</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#0B6B4F" }}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Per week
                </span>
              </div>

              <div className="space-y-0 border-t border-[#F5F5F5]">
                {VEHICLE_CLASSES.map((cls) => (
                  <div key={cls.key} className="flex items-center justify-between py-3 border-b border-[#F5F5F5]">
                    <span className="text-[#888] text-sm">{cls.label}</span>
                    <span className="text-[#111] text-sm font-semibold">from £{cls.weekly}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 border-b border-[#F5F5F5]">
                  <span className="text-[#888] text-sm">Insurance, indicative</span>
                  <span className="text-[#0B6B4F] text-sm font-semibold">about £38</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[#888] text-sm">Breakdown cover, optional</span>
                  <span className="text-[#111] text-sm font-semibold">£8</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 bg-[#FAFAFA] rounded-xl px-3.5 py-3">
                <ShieldCheck size={15} className="text-[#AAA] flex-shrink-0" />
                <span className="text-[#888] text-xs">Your real quote appears before you apply for a specific car</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Covered / not covered */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            What the cover includes
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-10 max-w-xl mx-auto">
            Set out plainly, before you need to rely on it.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div {...FADE_UP} className="bg-[#FAFFFE] rounded-2xl border border-[#E8E8E8] p-6">
              <h3 className="font-heading font-bold text-[16px] text-[#0B6B4F] mb-4">What's covered</h3>
              <div className="space-y-3">
                {COVERED.map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <Check size={15} className="text-[#0B6B4F] mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span className="text-[#444] text-[14px] leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...FADE_UP} transition={{ duration: 0.4, delay: 0.07 }} className="bg-[#FAFAFA] rounded-2xl border border-[#E8E8E8] p-6">
              <h3 className="font-heading font-bold text-[16px] text-[#666] mb-4">What isn't</h3>
              <div className="space-y-3">
                {NOT_COVERED.map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <X size={15} className="text-[#AAA] mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span className="text-[#666] text-[14px] leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.p
            {...FADE_UP}
            className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3 text-center"
          >
            Before you apply
          </motion.p>
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-10 text-center"
          >
            What insurers typically ask for
          </motion.h2>
          <motion.div {...FADE_UP} className="bg-white rounded-2xl border border-[#E8E8E8] p-7">
            <div className="space-y-4">
              {REQUIREMENTS.map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <Check size={16} className="text-[#0B6B4F] mt-0.5 shrink-0" strokeWidth={2.5} />
                  <span className="text-[#333] text-[14px] leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-[#AAA] mt-6 pt-5 border-t border-[#F0F0F0]">
              You can browse and register without any of this to hand. It's only checked to complete a rental.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-10 text-center"
          >
            Questions about insurance
          </motion.h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }, i) => (
              <motion.div
                key={q}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-[#FAFAFA] rounded-2xl border border-[#E8E8E8] p-6"
              >
                <h3 className="font-heading font-bold text-[15px] text-[#111] mb-2">{q}</h3>
                <p className="text-[14px] text-[#666] leading-relaxed">{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B6B4F] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[32px] font-heading font-extrabold text-white mb-4">
            See a real quote for a real car
          </h2>
          <p className="text-white/70 text-[15px] mb-8 max-w-md mx-auto">
            Rental price and insurance, shown as two separate lines, on every listing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/search")}
              className="px-7 py-3.5 rounded-full bg-white text-[#0B6B4F] font-semibold text-[15px] hover:bg-[#EAF5F1] transition-colors"
            >
              Browse cars
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-7 py-3.5 rounded-full border border-white/30 text-white font-medium text-[15px] hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Register your interest
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
