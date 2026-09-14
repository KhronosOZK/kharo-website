import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check, ChevronRight, Wallet, ShieldCheck, Clock, Zap, Search, FileCheck, BadgeCheck,
} from "lucide-react";
import { useSeo } from "@/lib/seo";

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

const BENEFITS = [
  {
    icon: Wallet,
    title: "One clear weekly payment",
    body: "Rent, insurance and servicing rolled into a single figure. No surprise invoices mid-week.",
  },
  {
    icon: ShieldCheck,
    title: "4-layer vetting: fair and fast",
    body: "DVLA, identity, Open Banking affordability, and trade record. Takes 48 hours; protects you and the operator.",
  },
  {
    icon: Clock,
    title: "Drive within days",
    body: "Active PCO licence? Most approved drivers collect their car within 3 working days of applying.",
  },
  {
    icon: Zap,
    title: "Flexible terms",
    body: "Start weekly, commit to longer for a lower rate. No punishing lock-ins.",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Browse PCO cars",
    body: "Filter by make, weekly budget, fuel type and borough. Every car is TfL-eligible.",
  },
  {
    num: "02",
    title: "Register your interest",
    body: "60-second form. No documents at this stage: just your name, phone and when you want to start.",
  },
  {
    num: "03",
    title: "Operator calls you",
    body: "A fleet manager reviews your details and gets in touch to confirm availability and terms.",
  },
  {
    num: "04",
    title: "Behind the wheel",
    body: "Agree the rental, hand over the deposit, and collect your car. Ready to earn.",
  },
];

const REQUIREMENTS = [
  "Valid TfL PCO private hire driver licence",
  "UK driving licence (minimum 1 year)",
  "Right to work in the UK",
  "No more than 6 penalty points on your DVLA licence",
  "Clean Access NI or DBS check (some operators require this)",
  "Bank account for affordability check (Open Banking, no credit impact)",
];

export default function ForDrivers() {
  const navigate = useNavigate();

  useSeo({
    title: "For Drivers · Rent a PCO Car in London · Kharo",
    description:
      "Rent a PCO car in London from a verified operator. One weekly payment covers rent, insurance and servicing. Start this week.",
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero - white/light grey */}
      <section className="bg-white border-b border-[#EBEBEB] pt-12 pb-0 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
            {/* Left copy */}
            <div className="flex-1 pb-12 lg:py-20 text-center lg:text-left">
              <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-4">
                For PCO Drivers
              </p>
              <motion.h1
                {...FADE_UP_HERO}
                className="text-[40px] sm:text-5xl lg:text-[54px] font-heading font-extrabold text-[#111] leading-[1.04] tracking-tight"
              >
                Your next PCO car.<br />Sorted.
              </motion.h1>
              <motion.p
                {...FADE_UP_HERO}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[#666] text-[17px] mt-5 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                Browse London's PCO fleet. One weekly payment covers rent, insurance and servicing.
                Register interest in 60 seconds. No documents yet.
              </motion.p>
              <motion.div
                {...FADE_UP_HERO}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <button
                  onClick={() => navigate("/search")}
                  className="px-7 py-3.5 rounded-full bg-[#0B6B4F] text-white font-semibold text-[15px] hover:bg-[#095B43] transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Browse PCO cars
                </button>
                <button
                  onClick={() => navigate("/driver-guide")}
                  className="px-7 py-3.5 rounded-full border border-[#E0E0E0] text-[#333] font-medium text-[15px] hover:bg-[#F5F5F5] transition-colors flex items-center gap-2"
                >
                  How it works
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-[13px] text-[#777]">
                {["TfL-eligible cars only", "Verified operators", "No payment yet"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0B6B4F]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - stat card */}
            <div className="w-full lg:w-[400px] lg:ml-16 shrink-0">
              <div className="relative bg-[#F5F5F5] rounded-3xl p-8 text-center mx-auto max-w-sm lg:max-w-none">
                <p className="text-[13px] text-[#888] mb-3 uppercase tracking-wide font-semibold">
                  Driver licence gap · London
                </p>
                <div className="text-[72px] font-heading font-extrabold text-[#0B6B4F] leading-none tracking-tight">
                  12,712
                </div>
                <p className="text-[15px] text-[#555] mt-3 leading-snug">
                  More licensed drivers than available vehicles
                  <br />
                  <span className="text-[12px] text-[#AAA]">TfL May 2026</span>
                </p>
                <div className="mt-5 pt-5 border-t border-[#E8E8E8] text-[13px] text-[#666]">
                  More drivers than cars means <strong className="text-[#111]">operators need you</strong> as much as you need them.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            Why rent through Kharo?
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-10">
            Every listing is from an operator we've checked. Every driver is vetted before they drive.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-[#E8E8E8] p-5"
              >
                <Icon className="w-7 h-7 text-[#0B6B4F] mb-4" strokeWidth={1.5} />
                <h3 className="font-heading font-bold text-[15px] text-[#111] mb-1.5">{title}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-[#EBEBEB] py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-10 text-center"
          >
            How it works
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map(({ num, title, body }, i) => (
              <motion.div
                key={num}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative"
              >
                <div className="text-[48px] font-heading font-extrabold text-[#F0F0F0] leading-none mb-3">
                  {num}
                </div>
                <h3 className="font-heading font-bold text-[16px] text-[#111] mb-2">{title}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h2
                {...FADE_UP}
                className="text-[28px] font-heading font-extrabold text-[#111] mb-4"
              >
                What you need to qualify
              </motion.h2>
              <p className="text-[15px] text-[#666] leading-relaxed mb-6">
                Kharo's 4-layer vetting is thorough but fair. If you meet these basics,
                you're good to apply.
              </p>
              <ul className="space-y-3">
                {REQUIREMENTS.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[14px] text-[#444]">
                    <Check className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0B6B4F] rounded-2xl p-7 text-white">
              <BadgeCheck className="w-10 h-10 text-[#5FD3A6] mb-4" />
              <h3 className="font-heading font-bold text-[20px] mb-3">4-Layer Vetting</h3>
              <div className="space-y-4">
                {[
                  { step: "1", label: "DVLA eligibility check", desc: "Licence confirmed, points verified" },
                  { step: "2", label: "Identity verification", desc: "Liveness check against your photo ID" },
                  { step: "3", label: "Open Banking affordability", desc: "No credit impact, read-only check" },
                  { step: "4", label: "Trade record review", desc: "PHV history with operators and platforms" },
                ].map(({ step, label, desc }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      {step}
                    </span>
                    <div>
                      <p className="font-semibold text-[14px]">{label}</p>
                      <p className="text-white/60 text-[12px]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#0A0A0A] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[32px] font-heading font-extrabold text-white mb-4">
            Ready to find your next car?
          </h2>
          <p className="text-white/60 text-[15px] mb-8 max-w-md mx-auto">
            Browse verified PCO cars across London. Register interest in 60 seconds.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/search")}
              className="px-7 py-3.5 rounded-full bg-[#5FD3A6] text-[#0A0A0A] font-semibold text-[15px] hover:bg-white transition-colors"
            >
              Browse PCO cars
            </button>
            <button
              onClick={() => navigate("/driver-guide")}
              className="px-7 py-3.5 rounded-full border border-white/20 text-white font-medium text-[15px] hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Read the driver guide
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
