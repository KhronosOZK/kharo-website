import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList, Phone, BadgeCheck, Car, TrendingUp, Shield,
  Users, Zap, ChevronDown, ChevronRight, Check, Clock,
  Lock, Activity,
} from "lucide-react";
import { useSeo } from "@/lib/seo";
import { IMG } from "@/lib/images";

const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// hero content is already in view on load: animate on mount, not on scroll-into-view
const FADE_UP_HERO = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const STEPS = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Submit your fleet details",
    body: "Fill in the operator interest form with your company name, fleet size, and how many cars are currently idle. A Kharo fleet specialist will call you within 1 working day.",
    detail: "Takes 3 minutes. No commitment at this stage.",
    photo: IMG.signingLaptop,
  },
  {
    num: "02",
    icon: Phone,
    title: "Kharo reviews and onboards you",
    body: "We verify your operator licence and Companies House registration, then set up your operator profile. You tell us your rates, deposit requirements, borough coverage, and any vehicle restrictions.",
    detail: "Operator verification typically completes within 2 working days.",
    photo: IMG.handshakeDesk,
  },
  {
    num: "03",
    icon: Car,
    title: "Your cars go live on Kharo",
    body: "Add listings for each available vehicle: make, model, fuel type, weekly price (all-in), photos, and mileage allowance. Only TfL-eligible cars are listed. Listings are reviewed before going live.",
    detail: "First listings are usually live within 24 hours of onboarding.",
    photo: IMG.rowCars,
  },
  {
    num: "04",
    icon: BadgeCheck,
    title: "Drivers register interest: you get the lead",
    body: "A driver sees your car and registers interest. Kharo runs the 4-layer vetting check: DVLA, identity, Open Banking affordability, and PHV trade record. You receive the approved driver's details and you make contact.",
    detail: "Vetting takes 48 hours. You only speak to approved drivers.",
    photo: IMG.phoneInCar,
  },
  {
    num: "05",
    icon: TrendingUp,
    title: "Agree terms and start earning",
    body: "You call the driver, confirm availability and deposit, and agree terms. The rental is between you and the driver directly. Kharo earns a fee when the rental completes, not before.",
    detail: "No monthly listing fee. Kharo earns on completions only.",
    photo: IMG.handshakeSmile,
  },
  {
    num: "06",
    icon: Lock,
    title: "Risk management protects your fleet",
    body: "Every Kharo rental includes our built-in risk management framework. GPS trackers must be fitted to all vehicles before handover. If a driver misses a payment, we contact their rideshare platform directly (Uber, Bolt, etc.) so they cannot accept new trips until the rent is cleared. Your fleet is trackable live from the Kharo Operator Dashboard.",
    detail: "Uber enforcement, GPS tracking, and live dashboard are included for all operators.",
    photo: IMG.fleetAerial,
  },
];

const BENEFITS = [
  {
    icon: Zap,
    title: "Fill idle cars faster",
    body: "Every week a PCO car sits empty is revenue gone. Kharo puts it in front of vetted drivers who are actively looking.",
  },
  {
    icon: Shield,
    title: "Pre-screened drivers only",
    body: "4-layer vetting: DVLA eligibility, liveness identity check, Open Banking affordability, and PHV trade record. Your fleet, protected.",
  },
  {
    icon: Users,
    title: "You control the terms",
    body: "Set your weekly rate, deposit, mileage allowance and vehicle restrictions. Kharo handles the lead; you close the deal.",
  },
  {
    icon: TrendingUp,
    title: "No upfront cost",
    body: "Listing is free. Kharo earns only when a rental completes; we are incentivised to find you quality drivers.",
  },
];

const VEHICLE_ELIGIBILITY = [
  {
    icon: Car,
    label: "Vehicle age",
    value: "10 years or newer",
    body: "TfL requires private hire vehicles to be within 10 years of first registration at the point of first licensing.",
  },
  {
    icon: Activity,
    label: "Emissions standard",
    value: "Euro 6, or ZEC",
    body: "Cars must meet Euro 6 emissions, or qualify as Zero Emission Capable (ZEC): under 50g/km CO2 with 10+ miles of zero-emission range.",
  },
  {
    icon: BadgeCheck,
    label: "Licensing",
    value: "M1 category, TfL-recognised",
    body: "Every vehicle needs a valid TfL private hire vehicle licence before it can be listed or collect passengers.",
  },
];

const WHAT_WE_CHECK = [
  "DVLA licence confirmed and points verified",
  "Liveness identity check against photo ID",
  "Open Banking affordability review (no credit impact)",
  "PHV trade record with previous operators",
  "TfL private hire driver licence validity",
  "Right to work in the UK",
];

const FAQS = [
  {
    q: "How much does it cost to list my fleet on Kharo?",
    a: "Listing is free. Kharo charges a fee to the operator when a rental completes. You don't pay anything until a driver is in your car.",
  },
  {
    q: "Who does the vetting: Kharo or me?",
    a: "Kharo runs the 4-layer vetting check (DVLA, identity, Open Banking, trade record). You receive only approved drivers. You still do your own final checks and agree terms directly with the driver.",
  },
  {
    q: "How long does operator verification take?",
    a: "We check your PHV operator licence and Companies House registration. This typically completes in 2 working days. We'll call you within 1 working day of your initial enquiry to get started.",
  },
  {
    q: "Can I refuse a driver Kharo has vetted?",
    a: "Yes. Kharo's vetting confirms basic eligibility. You remain in full control of who you rent to. If you have concerns about a specific driver, you can decline; Kharo will not override your decision.",
  },
  {
    q: "What happens if a driver stops paying rent?",
    a: "The rental agreement is directly between you and the driver. Kharo is not a party to it. We recommend ensuring your rental contract includes standard protections and that you hold an appropriate deposit.",
  },
  {
    q: "Can I set my own deposit and terms?",
    a: "Yes. You set your weekly rate, deposit, mileage allowance, and any vehicle-specific restrictions. Kharo displays what you tell us. The operator call is where final terms are agreed.",
  },
  {
    q: "Can I list vehicles in more than one borough?",
    a: "Yes. You can list vehicles across any borough you operate in. Drivers can filter by borough when searching.",
  },
  {
    q: "What types of vehicles can I list?",
    a: "Any TfL-licensed private hire vehicle: saloons, estates, MPVs, executive cars, and WAVs. The car must hold a valid TfL PHV licence. Electric and hybrid vehicles are clearly marked on listings.",
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

export default function OperatorGuide() {
  const navigate = useNavigate();

  useSeo({
    title: "Operator Guide · List Your PCO Fleet on Kharo",
    description:
      "How fleet operators list their PCO vehicles on Kharo, how driver vetting works, and what to expect after your first enquiry.",
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* Hero - fleet photography, matches the homepage's dark cinematic treatment */}
      <section className="relative text-white py-24 px-4 overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,0.97) 100%), url('https://images.pexels.com/photos/29566898/pexels-photo-29566898/free-photo-of-aerial-view-of-car-lot-with-parked-vehicles.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1000')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(0.3)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            {...FADE_UP_HERO}
            className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4 text-[#5FD3A6]"
          >
            Operator Guide
          </motion.p>
          <motion.h1
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[40px] sm:text-5xl font-heading font-extrabold leading-[1.05] tracking-tight text-balance"
          >
            How Kharo works for fleet operators.
          </motion.h1>
          <motion.p
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/70 text-[17px] mt-5 max-w-xl mx-auto leading-relaxed"
          >
            List your idle PCO cars, receive pre-vetted driver leads, and fill your fleet faster,
            with no upfront listing fee.
          </motion.p>
          <motion.div
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <a
              href="/list-your-fleet"
              className="px-6 py-3 rounded-full bg-[#5FD3A6] text-[#0A0A0A] font-semibold text-[15px] hover:bg-white transition-colors"
            >
              List your fleet
            </a>
            <button
              onClick={() => navigate("/help")}
              className="px-6 py-3 rounded-full border border-white/20 text-white font-medium text-[15px] hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              Get help
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-white border-b border-[#EBEBEB] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-start gap-3"
              >
                <Icon className="w-7 h-7 text-[#0B6B4F] shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-heading font-bold text-[14px] text-[#111] mb-0.5">{title}</p>
                  <p className="text-[12.5px] text-[#666] leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by step - alternating photo/text rows, all visible, reveal on scroll */}
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
              From sign-up to first driver in {STEPS.length} steps
            </motion.h2>
            <motion.p
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[15px] text-[#666] leading-relaxed mt-4"
            >
              No lengthy onboarding, no waiting weeks for your first lead. Here's what
              happens from the moment you sign up to your first vetted driver.
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

      {/* Vehicle eligibility */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <motion.p
              {...FADE_UP}
              className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
            >
              Only TfL-eligible cars get listed
            </motion.p>
            <motion.h2
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[28px] font-heading font-extrabold text-[#111]"
            >
              What makes a vehicle eligible
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {VEHICLE_ELIGIBILITY.map(({ icon: Icon, label, value, body }, i) => (
              <motion.div
                key={label}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-[#F5F5F5] rounded-2xl border border-[#E8E8E8] p-6"
              >
                <Icon className="w-7 h-7 text-[#0B6B4F] mb-4" strokeWidth={1.5} />
                <p className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1">{label}</p>
                <p className="text-[18px] font-heading font-extrabold text-[#111] mb-2">{value}</p>
                <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-[13px] text-[#AAA] text-center mt-6">
            We check every listing against current TfL private hire vehicle requirements before it goes live.
          </p>
        </div>
      </section>

      {/* Driver vetting */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h2
                {...FADE_UP}
                className="text-[28px] font-heading font-extrabold text-[#111] mb-4"
              >
                Every driver vetted before you speak to them
              </motion.h2>
              <p className="text-[15px] text-[#666] leading-relaxed mb-6">
                You'll only receive leads from drivers who have passed Kharo's 4-layer check.
                You still retain full control over who you rent to.
              </p>
              <ul className="space-y-2.5">
                {WHAT_WE_CHECK.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-[#444]">
                    <Check className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl overflow-hidden p-7 text-white">
              <img
                src="https://images.pexels.com/photos/8388228/pexels-photo-8388228.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=1125"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(165deg, rgba(11,107,79,0.90) 0%, rgba(7,26,20,0.85) 55%, rgba(5,15,12,0.94) 100%)" }}
              />
              <div className="relative">
                <BadgeCheck className="w-10 h-10 text-[#5FD3A6] mb-4" />
                <h3 className="font-heading font-bold text-[20px] mb-3">What the check covers</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", label: "DVLA eligibility", desc: "Licence confirmed, points verified against operator threshold" },
                    { step: "2", label: "Liveness identity", desc: "AI-assisted check against government-issued photo ID" },
                    { step: "3", label: "Open Banking affordability", desc: "Read-only review, no credit impact on the driver" },
                    { step: "4", label: "PHV trade record", desc: "History reviewed with previous operators and platforms" },
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
                <div className="mt-6 pt-5 border-t border-white/15 text-[13px] text-white/60">
                  Vetting runs within 48 hours of the driver registering interest. You are notified when a driver is approved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] font-heading font-extrabold text-[#111] mb-2 text-center"
          >
            Pricing that's aligned with yours
          </motion.h2>
          <p className="text-[15px] text-[#888] text-center mb-10">
            No monthly fees. No listing charges. Kharo earns only when you do.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                label: "Listing fee",
                value: "£0",
                sub: "Adding your cars to Kharo is free. No monthly subscription.",
              },
              {
                label: "Kharo charges",
                value: "Completion only",
                sub: "We earn a fee when a rental completes. No charge for leads that don't convert.",
              },
              {
                label: "Your rate",
                value: "You set it",
                sub: "You decide the weekly rate, deposit, and terms. Kharo lists what you tell us.",
              },
            ].map(({ label, value, sub }) => (
              <motion.div
                key={label}
                {...FADE_UP}
                className="bg-white rounded-2xl border border-[#E8E8E8] p-5 text-center"
              >
                <p className="text-[12px] font-bold text-[#888] uppercase tracking-wider mb-1">{label}</p>
                <p className="text-[22px] font-heading font-extrabold text-[#0B6B4F] mb-2">{value}</p>
                <p className="text-[13px] text-[#666] leading-relaxed">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            {...FADE_UP}
            className="text-[28px] font-heading font-extrabold text-[#111] mb-10 text-center"
          >
            Questions operators ask us
          </motion.h2>
          <div className="bg-white rounded-2xl border border-[#E8E8E8] px-6 py-2">
            {FAQS.map((faq) => (
              <Faq key={faq.q} {...faq} />
            ))}
          </div>
          <p className="text-[13px] text-[#888] text-center mt-6">
            Still have questions?{" "}
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
            Ready to stop losing revenue to idle cars?
          </h2>
          <p className="text-white/70 text-[15px] mb-8 max-w-md mx-auto">
            List your fleet on Kharo. A fleet specialist will call you within 1 working day.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/list-your-fleet"
              className="px-7 py-3.5 rounded-full bg-white text-[#0B6B4F] font-semibold text-[15px] hover:bg-[#EAF5F1] transition-colors"
            >
              List your fleet
            </a>
            <button
              onClick={() => navigate("/help")}
              className="px-7 py-3.5 rounded-full border border-white/30 text-white font-medium text-[15px] hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Talk to us first
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
