import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, ChevronRight } from "lucide-react";
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

const PROBLEMS = [
  {
    problem: "Hidden fees discovered after you commit",
    solution: "One all-in weekly price (rent, insurance, breakdown), listed upfront. No surprises.",
  },
  {
    problem: "Operators with no checks, no accountability",
    solution: "Every operator verified against Companies House and the PHV licensing register before listing.",
  },
  {
    problem: "Weeks of back-and-forth before you're behind the wheel",
    solution: "4-layer vetting takes 48 hours. Active PCO licence? Most drivers collect within 3 working days.",
  },
  {
    problem: "Brokers who take a cut and disappear",
    solution: "Kharo connects you directly to the operator. You agree terms with them, not a middleman.",
  },
];

const PILLARS = [
  {
    num: "01",
    title: "Transparent listings",
    body: "Every listing shows the full weekly price: rent, insurance, and breakdown bundled in. What you see is what you pay.",
  },
  {
    num: "02",
    title: "Verified operators",
    body: "We cross-check every fleet operator against the PHV licensing register and Companies House before their cars go live.",
  },
  {
    num: "03",
    title: "4-layer driver vetting",
    body: "DVLA check, liveness identity verification, Open Banking affordability (no credit impact), and PHV trade record review.",
  },
  {
    num: "04",
    title: "Direct operator contact",
    body: "After you register interest, the operator calls you. No middleman between you and the fleet manager.",
  },
  {
    num: "05",
    title: "Faster to the wheel",
    body: "Our vetting means most approved drivers collect their car within 3 working days, not 3 weeks.",
  },
  {
    num: "06",
    title: "Flexible terms",
    body: "Start weekly. Commit to longer for a lower rate. No lock-ins, no penalty clauses for genuine circumstances.",
  },
];

const COMPARE = [
  { label: "All-in weekly price (no hidden extras)", kharo: true, them: false },
  { label: "Operator checked against Companies House & licensing register", kharo: true, them: false },
  { label: "Driver vetting within 48 hours", kharo: true, them: false },
  { label: "Direct operator contact, no middleman", kharo: true, them: false },
  { label: "TfL-eligible cars only", kharo: true, them: null },
  { label: "Thatcham S5 tracking standard", kharo: true, them: null },
  { label: "Flexible weekly terms", kharo: true, them: null },
];

const VETTING_STEPS = [
  {
    num: "01",
    title: "DVLA eligibility check",
    body: "Licence confirmed against DVLA records. Points verified. Any endorsements reviewed against operator thresholds.",
  },
  {
    num: "02",
    title: "Liveness identity check",
    body: "AI-assisted check against photo ID. Confirms you are who you say you are. No in-person visit needed.",
  },
  {
    num: "03",
    title: "Open Banking affordability",
    body: "Read-only review of your account activity. No credit impact. Confirms you can cover the weekly rental.",
  },
  {
    num: "04",
    title: "PHV trade record review",
    body: "Your history with other operators and platforms reviewed. Rewards reliable drivers with better placement.",
  },
];

export default function WhyKharo() {
  const navigate = useNavigate();

  useSeo({
    title: "Why Kharo · Verified PCO Rentals in London",
    description:
      "Kharo is a PCO car rental marketplace where every listing is all-in and every operator is verified. No hidden fees, no unaccountable landlords.",
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* Hero - solid dark ground with film grain, no photo banner */}
      <section className="relative text-white py-24 px-4 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="grain-overlay" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            {...FADE_UP_HERO}
            className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4 text-[#5FD3A6]"
          >
            Why Kharo
          </motion.p>
          <motion.h1
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[40px] sm:text-5xl font-heading font-extrabold leading-[1.05] tracking-tight text-balance"
          >
            PCO car rental that's actually clear.
          </motion.h1>
          <motion.p
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/70 text-[17px] mt-5 max-w-xl mx-auto leading-relaxed"
          >
            Every listing on Kharo shows one real price. Every operator is checked before they list.
            Every driver is vetted before they drive.
          </motion.p>
          <motion.div
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <button
              onClick={() => navigate("/search")}
              className="px-7 py-3.5 rounded-full bg-[#5FD3A6] text-[#0A0A0A] font-semibold text-[15px] hover:bg-white transition-colors"
            >
              Browse PCO cars
            </button>
            <button
              onClick={() => navigate("/driver-guide")}
              className="px-7 py-3.5 rounded-full border border-white/20 text-white font-medium text-[15px] hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              How it works
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* The problem */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            What PCO drivers deal with every day
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-10">
            And how Kharo addresses each one.
          </p>

          <div className="space-y-4">
            {PROBLEMS.map(({ problem, solution }, i) => (
              <motion.div
                key={i}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
              >
                <div className="grid sm:grid-cols-2">
                  <div className="p-5 sm:border-r border-b sm:border-b-0 border-[#F0F0F0] flex items-start gap-3">
                    <X className="w-4 h-4 text-[#AAA] shrink-0 mt-0.5" />
                    <p className="text-[14px] text-[#666] leading-relaxed">{problem}</p>
                  </div>
                  <div className="p-5 bg-[#FAFFFE] flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
                    <p className="text-[14px] text-[#444] leading-relaxed font-medium">{solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Kharo does differently - an editorial numbered index instead of a
          grid of identical icon cards, matching the site's photo-and-number
          language elsewhere rather than the generic SaaS "feature card" look */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.p
            {...FADE_UP}
            className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
          >
            What's different
          </motion.p>
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[26px] sm:text-[30px] font-heading font-bold text-[#333] leading-snug mb-14 max-w-xl"
          >
            Kharo isn't a listings board. <span className="text-[#111] font-extrabold">Every price is real, every operator is checked, and every driver is vetted</span> before a single call happens.
          </motion.h2>

          <div>
            {PILLARS.map(({ num, title, body }, i) => (
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

      {/* Accountability, kept live for both sides of the marketplace */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div {...FADE_UP} className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:order-2">
            <img
              src="https://images.pexels.com/photos/18969850/pexels-photo-18969850.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125"
              alt="Verified driver checking their account on a phone"
              className="w-full h-full object-cover grayscale contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#5FD3A6] mb-1">Every account, checked</p>
              <p className="text-[14px] text-white/80 leading-relaxed">Vetted once, monitored for as long as they're driving on Kharo.</p>
            </div>
          </motion.div>
          <div className="lg:order-1">
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">Built-in accountability</p>
            <h2 className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-4">
              The same rules protect both sides
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed mb-6">
              A marketplace only works if both sides can trust it. Every car on Kharo carries a certified GPS tracker as a condition of listing, and if a driver misses a rental payment, Kharo flags their account directly with Uber and Bolt: they can't accept new trips until it's cleared.
            </p>
            <button
              onClick={() => navigate("/list-your-fleet")}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0B6B4F] hover:text-[#095B43] transition-colors"
            >
              See exactly how enforcement works
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            Kharo vs. the rest
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-8">
            How Kharo compares to unverified listings and traditional PCO brokers.
          </p>
          <motion.div
            {...FADE_UP}
            className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
          >
            {/* Header row - label column keeps most of the width so feature text never has to
                fight two icon columns for room on a phone screen */}
            <div className="grid grid-cols-[1fr_64px_64px] sm:grid-cols-[1fr_88px_88px] bg-[#F8F8F8] border-b border-[#E8E8E8]">
              <div className="px-4 sm:px-5 py-3" />
              <div className="px-2 py-3 text-center">
                <span className="text-[12px] sm:text-[13px] font-extrabold text-[#0B6B4F]">Kharo</span>
              </div>
              <div className="px-2 py-3 text-center">
                <span className="text-[12px] sm:text-[13px] font-semibold text-[#888]">Others</span>
              </div>
            </div>

            {/* Feature rows */}
            {COMPARE.map(({ label, kharo, them }, i) => (
              <div
                key={label}
                className={`grid grid-cols-[1fr_64px_64px] sm:grid-cols-[1fr_88px_88px] items-center ${i < COMPARE.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
              >
                <div className="px-4 sm:px-5 py-4">
                  <span className="text-[13px] text-[#444] leading-snug">{label}</span>
                </div>
                <div className="px-2 py-4 flex justify-center items-center">
                  {kharo ? (
                    <Check className="w-4 h-4 text-[#0B6B4F]" strokeWidth={2.5} />
                  ) : (
                    <X className="w-4 h-4 text-[#CCC]" strokeWidth={2.5} />
                  )}
                </div>
                <div className="px-2 py-4 flex justify-center items-center">
                  {them === true ? (
                    <Check className="w-4 h-4 text-[#0B6B4F]" strokeWidth={2.5} />
                  ) : them === false ? (
                    <X className="w-4 h-4 text-[#CCC]" strokeWidth={2.5} />
                  ) : (
                    <span className="text-[11px] sm:text-[13px] text-[#CCC]">Varies</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4-Layer Vetting */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p
                {...FADE_UP}
                className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
              >
                How vetting works
              </motion.p>
              <motion.h2
                {...FADE_UP}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-4"
              >
                4-layer vetting in 48 hours
              </motion.h2>
              <p className="text-[15px] text-[#666] leading-relaxed mb-8">
                Thorough enough to protect operators. Fast enough not to cost you the week.
                No in-person appointments. Complete it from your phone.
              </p>
              <div className="space-y-5">
                {VETTING_STEPS.map(({ num, title, body }, i) => (
                  <motion.div
                    key={num}
                    {...FADE_UP}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-[32px] font-heading font-extrabold text-[#EBEBEB] leading-none shrink-0 w-10">
                      {num}
                    </span>
                    <div>
                      <p className="font-heading font-bold text-[15px] text-[#111] mb-1">{title}</p>
                      <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats card - clean and light, matching the numbered-index
                language used elsewhere on this page instead of a dark photo card */}
            <div className="bg-white rounded-2xl border border-[#E8E8E8] p-7">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0B6B4F] mb-6">
                The London PCO market
              </p>
              <div>
                <div>
                  <div className="text-[54px] font-heading font-extrabold text-[#111] leading-none">
                    12,712
                  </div>
                  <p className="text-[#666] text-[14px] mt-1">
                    More licensed PHV drivers than available vehicles in London
                    <br />
                    <span className="text-[#AAA] text-[12px]">TfL May 2026</span>
                  </p>
                </div>
                <div className="border-t border-[#EEEEEE] pt-6 mt-7">
                  <div className="text-[36px] font-heading font-extrabold text-[#111] leading-none">
                    48 hrs
                  </div>
                  <p className="text-[#666] text-[14px] mt-1">
                    Typical vetting turnaround from application to approval
                  </p>
                </div>
                <div className="border-t border-[#EEEEEE] pt-6 mt-7">
                  <div className="text-[36px] font-heading font-extrabold text-[#111] leading-none">
                    3 days
                  </div>
                  <p className="text-[#666] text-[14px] mt-1">
                    Most approved drivers collect their car within 3 working days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operator trust section - three columns divided by thin rules, the same
          restrained, numbered treatment as the section above instead of boxed
          icon cards */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.p
            {...FADE_UP}
            className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3 text-center"
          >
            Before a listing goes live
          </motion.p>
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            Every operator checked before they list
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-14 max-w-xl mx-auto">
            Drivers deserve to know who they're renting from.
          </p>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EBEBEB]">
            {[
              {
                num: "01",
                title: "Companies House verified",
                body: "We confirm the operator is a registered UK entity in good standing before they list.",
              },
              {
                num: "02",
                title: "PHV licensing register",
                body: "Every operator's PHV licence is checked against the relevant local authority register.",
              },
              {
                num: "03",
                title: "TfL-eligible vehicles only",
                body: "Only TfL-licensed vehicles appear on Kharo. No non-compliant cars, no exceptions.",
              },
            ].map(({ num, title, body }, i) => (
              <motion.div
                key={title}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="py-6 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0"
              >
                <span className="font-heading font-extrabold text-[13px] text-[#BBB]">{num}</span>
                <h3 className="font-heading font-bold text-[15px] text-[#111] mt-2 mb-1.5">{title}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - brand green, not another black block, so it doesn't visually
          fuse with the black footer directly beneath it */}
      <section className="bg-[#0B6B4F] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[32px] font-heading font-extrabold text-white mb-4">
            Ready to see for yourself?
          </h2>
          <p className="text-white/70 text-[15px] mb-8 max-w-md mx-auto">
            Browse verified PCO cars across London. One weekly price, no surprises.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/search")}
              className="px-7 py-3.5 rounded-full bg-white text-[#0B6B4F] font-semibold text-[15px] hover:bg-[#EAF5F1] transition-colors"
            >
              Browse PCO cars
            </button>
            <button
              onClick={() => navigate("/list-your-fleet")}
              className="px-7 py-3.5 rounded-full border border-white/30 text-white font-medium text-[15px] hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              List your fleet
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
