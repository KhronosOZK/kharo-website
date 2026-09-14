import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, ClipboardList, Phone, Car, Check, ChevronDown,
  BadgeCheck, Clock, ChevronRight,
} from "lucide-react";
import { useSeo } from "@/lib/seo";
import { IMG } from "@/lib/images";

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

const STEPS = [
  {
    num: "01",
    icon: Search,
    title: "Browse and find your car",
    body: "Use filters to narrow by budget, fuel type, car make and borough. Every car on Kharo is TfL-eligible. You'll see a single all-in weekly price covering rent, insurance and breakdown, with no hidden add-ons.",
    detail: "Takes about 5 minutes. No account needed to browse.",
    photo: IMG.phoneInCar,
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "Register your interest",
    body: "Found a car you like? Hit 'Register interest'. Fill in a short form: your name, contact details and when you want to start. No licence numbers, no documents, no payment at this stage.",
    detail: "Takes 60 seconds. You'll receive an email confirmation.",
    photo: IMG.signingLaptop,
  },
  {
    num: "03",
    icon: Phone,
    title: "The operator calls you",
    body: "A fleet manager from the operator reviews your interest and gets in touch, usually within 1 working day. They'll confirm the car is available, explain the deposit, and answer any questions.",
    detail: "Kharo isn't in this call. You deal directly with the operator.",
    photo: IMG.handshakeDesk,
  },
  {
    num: "04",
    icon: BadgeCheck,
    title: "Vetting in 48 hours",
    body: "Once you and the operator agree to move forward, Kharo's 4-layer check runs: DVLA eligibility, liveness identity, Open Banking affordability (no credit impact), and PHV trade record. Most checks complete in 48 hours.",
    detail: "All done on your phone. No in-person appointments.",
    photo: IMG.signingCouple,
  },
  {
    num: "05",
    icon: Car,
    title: "Collect your car",
    body: "Approved? Agree the rental terms, hand over the deposit, and pick up your car. Active PCO licence holders typically collect within 3 working days of first applying.",
    detail: "Start earning on Uber, Bolt or your platform of choice.",
    photo: IMG.keysHandover,
  },
];

const REQUIREMENTS = [
  "Valid TfL PCO private hire driver licence",
  "UK driving licence (minimum 1 year held)",
  "Right to work in the UK",
  "No more than 6 penalty points on your DVLA licence",
  "Clean Access NI or DBS check (some operators require this)",
  "Bank account for Open Banking affordability check (no credit impact)",
];

const FAQS = [
  {
    q: "Does Kharo take any payment from drivers?",
    a: "No. Kharo is free for drivers to use. You pay the operator directly: weekly rental, deposit, and nothing else. Kharo earns from operators when a rental completes.",
  },
  {
    q: "What is the deposit and how much will it be?",
    a: "Deposits are set by each operator and vary by vehicle and driver profile. Typical deposits are 2–4 weeks' rent. The operator confirms this when they call you, before you commit to anything.",
  },
  {
    q: "Does the Open Banking check affect my credit score?",
    a: "No. The Open Banking check is a read-only review of your account activity to confirm you can cover the weekly rental. It does not appear on your credit file and does not count as a credit application.",
  },
  {
    q: "Can I rent if I have points on my licence?",
    a: "Up to 6 penalty points is the typical threshold for Kharo-listed vehicles. Each operator sets their own rules, so it's worth asking when they call. Some operators may accept up to 9 points at their discretion.",
  },
  {
    q: "How quickly can I be driving?",
    a: "Most drivers with an active PCO licence collect within 3 working days of registering interest. Vetting takes around 48 hours once both sides agree to proceed.",
  },
  {
    q: "What is included in the weekly price?",
    a: "Every Kharo listing shows a single all-in weekly price covering the car rental, motor insurance, and breakdown cover. Fuel is not included. That is your own cost.",
  },
  {
    q: "Can I switch car or operator later?",
    a: "Yes. Kharo's weekly rental model means you're not locked in long-term. Operators set their own minimum periods, typically 1 to 4 weeks, after which you can give notice and move on.",
  },
  {
    q: "What happens if the car breaks down?",
    a: "Breakdown cover is included in the weekly price. Contact the breakdown provider whose details are in your rental agreement. In most cases the operator will arrange a replacement vehicle while repairs are made.",
  },
];

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#F0F0F0] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-[#111]">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#999] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-[14px] text-[#555] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function DriverGuide() {
  const navigate = useNavigate();

  useSeo({
    title: "Driver Guide · How to Rent a PCO Car on Kharo",
    description:
      "A step-by-step guide to renting a PCO car through Kharo. Browse, check availability, get vetted, and be behind the wheel in days.",
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
            Driver Guide
          </motion.p>
          <motion.h1
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[40px] sm:text-5xl font-heading font-extrabold leading-[1.05] tracking-tight text-balance"
          >
            How renting works: from browse to keys.
          </motion.h1>
          <motion.p
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/60 text-[17px] mt-5 max-w-xl mx-auto leading-relaxed"
          >
            Five steps, 48-hour vetting, and most drivers are in their car within 3 working days.
            No payment until you've met the operator and agreed terms.
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
              onClick={() => navigate("/for-drivers")}
              className="px-7 py-3.5 rounded-full border border-white/20 text-white font-medium text-[15px] hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              For drivers overview
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Step-by-step - alternating photo/text rows, all visible, reveal on scroll */}
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-lg mx-auto text-center mb-16">
            <motion.p
              {...FADE_UP}
              className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
            >
              How it works
            </motion.p>
            <motion.h2
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] leading-tight"
            >
              From register interest to keys in {STEPS.length} steps
            </motion.h2>
            <motion.p
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[15px] text-[#666] leading-relaxed mt-4"
            >
              No hidden stages, no chasing for updates. Here's exactly what happens from
              the moment you find a car to the moment it's yours.
            </motion.p>
          </div>

          <div className="flex flex-col gap-16 lg:gap-20">
            {STEPS.map(({ num, icon: Icon, title, body, detail, photo }, i) => {
              const reversed = i % 2 === 1;
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`grid lg:grid-cols-2 gap-6 lg:gap-12 items-center ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="relative">
                    <span
                      className="absolute -top-10 -left-3 font-heading font-extrabold text-[110px] leading-none text-[#0B6B4F]/[0.07] select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      {num}
                    </span>
                    <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] bg-[#EDEDED] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                      <img src={photo} alt={title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </div>

                  <div className={reversed ? "lg:pr-4" : "lg:pl-4"}>
                    <div className="w-11 h-11 rounded-full border-2 border-[#0B6B4F] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-[#0B6B4F]" />
                    </div>
                    <h3 className="font-heading font-bold text-[22px] text-[#111]">{title}</h3>
                    <p className="text-[15px] text-[#555] leading-relaxed mt-2.5">{body}</p>
                    <div className="inline-flex items-center gap-1.5 text-[12px] text-[#888] bg-[#F8F8F8] rounded-full px-3 py-1 mt-4">
                      <Clock className="w-3 h-3" />
                      {detail}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <motion.h2
                {...FADE_UP}
                className="text-[28px] font-heading font-extrabold text-[#111] mb-4"
              >
                What you need to qualify
              </motion.h2>
              <p className="text-[15px] text-[#666] leading-relaxed mb-7">
                Our 4-layer vetting is thorough but fair. If you meet the basics below,
                you're in a strong position to apply.
              </p>
              <ul className="space-y-3">
                {REQUIREMENTS.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[14px] text-[#444]">
                    <Check className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {r}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/search")}
                className="mt-8 px-6 py-3 rounded-full bg-[#0B6B4F] text-white font-semibold text-[14px] hover:bg-[#095B43] transition-colors"
              >
                Browse available cars
              </button>
            </div>

            {/* Vetting card - clean and light, matching the numbered-index
                language used elsewhere instead of a dark photo card */}
            <div className="bg-white rounded-2xl border border-[#E8E8E8] p-7">
              <BadgeCheck className="w-8 h-8 text-[#0B6B4F] mb-4" strokeWidth={1.5} />
              <h3 className="font-heading font-bold text-[20px] text-[#111] mb-1">4-Layer Vetting</h3>
              <p className="text-[#888] text-[13px] mb-5">
                Done on your phone. Takes 48 hours. No credit impact.
              </p>
              <div>
                {[
                  { step: "01", label: "DVLA eligibility check", desc: "Licence confirmed, points verified" },
                  { step: "02", label: "Liveness identity check", desc: "AI check against your photo ID" },
                  { step: "03", label: "Open Banking affordability", desc: "Read-only account review, no credit impact" },
                  { step: "04", label: "PHV trade record review", desc: "Your history with operators and platforms" },
                ].map(({ step, label, desc }, i) => (
                  <div key={step} className={`py-3.5 ${i > 0 ? "border-t border-[#EEEEEE]" : ""}`}>
                    <span className="text-[12px] font-heading font-extrabold text-[#0B6B4F]">{step}</span>
                    <p className="font-semibold text-[14px] text-[#111] mt-0.5">{label}</p>
                    <p className="text-[#888] text-[12px]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost explainer */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            What you pay and what's included
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-10">
            No hidden extras. One weekly price covers everything listed below.
          </p>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EBEBEB]">
            {[
              {
                title: "Car rental",
                body: "The cost of renting the TfL-eligible PCO vehicle, set by the operator.",
              },
              {
                title: "Motor insurance",
                body: "PHV insurance for private hire driving is bundled into the weekly price.",
              },
              {
                title: "Breakdown cover",
                body: "Roadside assistance included if the car breaks down during your rental.",
              },
            ].map(({ title, body }) => (
              <motion.div
                key={title}
                {...FADE_UP}
                className="py-6 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0"
              >
                <span className="text-[11px] font-bold text-[#0B6B4F] bg-[#EAF5F1] rounded-full px-2.5 py-0.5">
                  Included
                </span>
                <h3 className="font-heading font-bold text-[15px] text-[#111] mt-3 mb-1.5">{title}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-[13px] text-[#AAA] text-center mt-5">
            Fuel is not included. That is your own cost. Deposit is agreed with the operator.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] font-heading font-extrabold text-[#111] mb-10 text-center"
          >
            Frequently asked questions
          </motion.h2>
          <div className="bg-white rounded-2xl border border-[#E8E8E8] px-6 py-2">
            {FAQS.map((faq) => (
              <Faq key={faq.q} {...faq} />
            ))}
          </div>
          <p className="text-[13px] text-[#888] text-center mt-6">
            More questions?{" "}
            <button
              onClick={() => navigate("/help")}
              className="text-[#0B6B4F] font-medium hover:underline"
            >
              Visit our help centre
            </button>
          </p>
        </div>
      </section>

      {/* CTA - brand green, not another black block, so it doesn't visually
          fuse with the black footer directly beneath it */}
      <section className="bg-[#0B6B4F] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[32px] font-heading font-extrabold text-white mb-4">
            Ready to find your car?
          </h2>
          <p className="text-white/70 text-[15px] mb-8 max-w-md mx-auto">
            Browse verified PCO cars across London. Register interest in 60 seconds.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/search")}
              className="px-7 py-3.5 rounded-full bg-white text-[#0B6B4F] font-semibold text-[15px] hover:bg-[#EAF5F1] transition-colors"
            >
              Browse PCO cars
            </button>
            <button
              onClick={() => navigate("/for-drivers")}
              className="px-7 py-3.5 rounded-full border border-white/30 text-white font-medium text-[15px] hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              For drivers overview
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
