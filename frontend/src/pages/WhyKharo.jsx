import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
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

// Short problem statements only - the "what's different" section right above
// this one already spells out the solution to each of these in full, so this
// list stays a quick callback instead of restating the same claims again.
// Same numbered-index shape as PILLARS below, so the two sections read as
// one consistent idiom instead of two different component styles back to
// back - a light number here instead of a green one is the only difference.
const PROBLEMS = [
  { num: "01", title: "Hidden fees discovered after you commit" },
  { num: "02", title: "Operators with no checks, no accountability" },
  { num: "03", title: "Weeks of back-and-forth before you're behind the wheel" },
  { num: "04", title: "Brokers who take a cut and disappear" },
];

// Trimmed from 6 to 4: the original also had "4-layer driver vetting" and
// "Faster to the wheel" as one-line teasers, but both are covered in full two
// sections below (VETTING_STEPS and its stats card) - repeating them here as
// a one-liner first added nothing but another near-identical list to scroll
// past.
const PILLARS = [
  {
    num: "01",
    title: "Transparent listings",
    body: "Every listing shows the rental price up front, priced below the market rate for the same car. Insurance is quoted separately, not bundled and marked up.",
  },
  {
    num: "02",
    title: "Verified operators",
    body: "We cross-check every fleet operator against the PHV licensing register and Companies House before their cars go live.",
  },
  {
    num: "03",
    title: "Direct operator contact",
    body: "After you register interest, the operator calls you. No middleman between you and the fleet manager.",
  },
  {
    num: "04",
    title: "Flexible terms",
    body: "Start weekly. Commit to longer for a lower rate. No lock-ins, no penalty clauses for genuine circumstances.",
  },
];

const VETTING_STEPS = [
  {
    num: "01",
    title: "DVLA eligibility check",
    body: "Licence confirmed against DVLA records. Points verified and shared with operators, who decide what's acceptable for their fleet.",
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

      {/* Hero - light ground matching the rest of the page; bold type carries
          the section instead of a dark banner */}
      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 px-4 overflow-hidden border-b border-[#EEEEEE]" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h1
            {...FADE_UP_HERO}
            className="text-[40px] sm:text-6xl font-heading font-extrabold leading-[1.02] tracking-tight text-[#111] text-balance"
          >
            Why Kharo.
          </motion.h1>
          <motion.p
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#666] text-[17px] mt-6 max-w-xl mx-auto leading-relaxed"
          >
            Every listing on Kharo shows one real price. Every operator is checked before they list.
            Every driver is vetted before they drive.
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
              Browse PCO cars
            </button>
            <button
              onClick={() => navigate("/driver-guide")}
              className="px-7 py-3.5 rounded-full border border-[#D8D8D8] text-[#111] font-medium text-[15px] hover:bg-white transition-colors flex items-center gap-2"
            >
              How it works
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* What Kharo does differently - an editorial numbered index instead of a
          grid of identical icon cards, matching the site's photo-and-number
          language elsewhere rather than the generic SaaS "feature card" look.
          Sits first, right after the hero, so the page opens with what Kharo
          actually does rather than a list of industry complaints. */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-5xl 2xl:max-w-6xl mx-auto">
          <motion.p
            {...FADE_UP}
            className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
          >
            What's different
          </motion.p>
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[26px] sm:text-[30px] font-heading font-bold text-[#333] leading-snug mb-14 max-w-2xl"
          >
            Kharo isn't a listings board. <span className="text-[#111] font-extrabold">Every price is real, every operator is checked, and every driver is vetted</span> before a single call happens.
          </motion.h2>

          <div className="grid lg:grid-cols-2 lg:gap-x-16">
            {PILLARS.map(({ num, title, body }, i) => (
              <motion.div
                key={title}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`grid sm:grid-cols-[64px_1fr] gap-x-6 gap-y-1 py-6 ${i > 0 ? "border-t border-[#EEEEEE]" : ""} ${i === 1 ? "lg:border-t-0" : ""}`}
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

      {/* The problem - same numbered-index shape as "What's different" above,
          just with a light grey number instead of green, so the two
          sections read as one consistent idiom instead of two different
          component styles stacked back to back. "What's different" already
          states the solution in full, so this stays a quick punch list. No
          explicit background here (unlike the white section above) so the
          two don't visually merge into one undifferentiated white block. */}
      <section className="py-16 px-4">
        <div className="max-w-5xl 2xl:max-w-6xl mx-auto">
          <motion.p
            {...FADE_UP}
            className="text-[11px] font-bold text-[#AAA] tracking-[0.14em] uppercase mb-3"
          >
            What PCO drivers deal with
          </motion.p>
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[26px] sm:text-[30px] font-heading font-bold text-[#333] leading-snug mb-14 max-w-2xl"
          >
            None of this happens on Kharo.
          </motion.h2>

          <div className="grid lg:grid-cols-2 lg:gap-x-16">
            {PROBLEMS.map(({ num, title }, i) => (
              <motion.div
                key={num}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`grid sm:grid-cols-[64px_1fr] gap-x-6 gap-y-1 py-6 ${i > 0 ? "border-t border-[#EEEEEE]" : ""} ${i === 1 ? "lg:border-t-0" : ""}`}
              >
                <span className="font-heading font-extrabold text-[15px] text-[#CCC]">{num}</span>
                <p className="font-heading font-bold text-[17px] text-[#111]">{title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accountability, kept live for both sides of the marketplace */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div {...FADE_UP} className="relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-[4/5] lg:order-2">
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

      {/* Vetting - the "Kharo vs. the rest" comparison table that used to live
          here was cut: it repeated the same claims already made, more
          readably, in the "What PCO drivers deal with every day" section
          above (hidden fees, operator checks, fast vetting, direct contact) -
          two comparison sections back to back was the exact kind of
          duplicate-pattern section the page didn't need. */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto">
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
                3-layer vetting in 48 hours
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
