import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car, ChevronDown, BadgeCheck, Clock, ChevronRight, LayoutDashboard,
  ShieldCheck, CreditCard, FileText, ArrowUpRight, Wrench, LifeBuoy,
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
    title: "Browse and find your car",
    body: "Use filters to narrow by budget, fuel type, car make and borough. Every car on Kharo is TfL-eligible. The weekly rental price you see is set by the operator and shown upfront, kept below what other PCO platforms charge for the same car.",
    detail: "Takes about 5 minutes. No account needed to browse.",
    photo: IMG.phoneInCar,
  },
  {
    num: "02",
    title: "Register your interest",
    body: "Found a car you like? Hit 'Register interest'. Fill in a short form: your name, contact details and when you want to start. No licence numbers, no documents, no payment at this stage.",
    detail: "Takes 60 seconds. You'll receive an email confirmation.",
    photo: IMG.signingLaptop,
  },
  {
    num: "03",
    title: "The operator calls you",
    body: "A fleet manager from the operator reviews your interest and gets in touch, usually within 1 working day. They'll confirm the car is available, explain the deposit, and answer any questions.",
    detail: "Kharo isn't in this call. You deal directly with the operator.",
    photo: IMG.handshakeDesk,
  },
  {
    num: "04",
    title: "Vetting in 48 hours",
    body: "Once you and the operator agree to move forward, Kharo's vetting runs: DVLA eligibility, liveness identity, and Open Banking affordability (no credit impact). Most checks complete in 48 hours.",
    detail: "All done on your phone. No in-person appointments.",
    photo: IMG.signingCouple,
  },
  {
    num: "05",
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
  "Clean Access NI or DBS check (some operators require this)",
  "Bank account for Open Banking affordability check (no credit impact)",
];

const INSURANCE_POLICIES = [
  { name: "Essential Cover", price: "£32/wk", tag: "Most affordable" },
  { name: "Standard Cover", price: "£38/wk", tag: "Most popular" },
  { name: "Comprehensive Cover", price: "£45/wk", tag: "Full protection" },
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
    a: "There's no fixed cut-off from Kharo. Your DVLA check confirms your points as part of vetting, and that information is passed to the operator, who decides what's acceptable for their fleet.",
  },
  {
    q: "How quickly can I be driving?",
    a: "Most drivers with an active PCO licence collect within 3 working days of registering interest. Vetting takes around 48 hours once both sides agree to proceed.",
  },
  {
    q: "What is included in the weekly price?",
    a: "Every Kharo listing shows the rental price only, set by the operator and kept below what other PCO platforms charge for the same car. Scheduled maintenance is included. Insurance is picked separately from a shortlist of competitive policies, and fuel is your own cost.",
  },
  {
    q: "Can I switch car or operator later?",
    a: "Yes. Kharo's weekly rental model means you're not locked in long-term. Operators set their own minimum periods, typically 1 to 4 weeks, after which you can give notice and move on.",
  },
  {
    q: "What happens if the car breaks down?",
    a: "Contact Kharo's support team or the operator directly and we'll help you sort it quickly. Some of the insurance policies available at checkout include roadside assistance as standard - worth checking when you pick your cover.",
  },
];

const DASHBOARD_NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Car, label: "My rental" },
  { icon: ShieldCheck, label: "Insurance" },
  { icon: Wrench, label: "Maintenance" },
  { icon: LifeBuoy, label: "Claims" },
  { icon: CreditCard, label: "Payments" },
  { icon: FileText, label: "Documents" },
];

const DASHBOARD_PAYMENTS = [
  { label: "Weekly rental", value: "£165.00", date: "Paid 3 Sep" },
  { label: "Weekly insurance", value: "£38.00", date: "Paid 3 Sep" },
];

const DASHBOARD_DOCUMENTS = [
  { label: "PCO driver licence", status: "Valid", detail: "Expires Mar 2027" },
  { label: "Insurance certificate", status: "Valid", detail: "Renews 14 Sep" },
  { label: "Rental agreement", status: "Signed", detail: "12-week term" },
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

// Small self-contained "product demo": pick a car, then pick an insurance
// policy from a shortlist. Auto-cycles the selected policy every few seconds
// so the flow reads as alive without needing any user interaction.
function InsurancePicker() {
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setSelected((s) => (s + 1) % INSURANCE_POLICIES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      {...FADE_UP}
      className="rounded-[28px] border border-[#E8E8E8] bg-white p-6 sm:p-8"
      style={{ boxShadow: "0 30px 70px -30px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-7 h-7 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center text-[11px] font-bold shrink-0">1</div>
        <p className="text-[13px] font-semibold text-[#111]">Pick your car</p>
        <div className="flex-1 h-px bg-[#EEEEEE]" />
        <div className="w-7 h-7 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center text-[11px] font-bold shrink-0">2</div>
        <p className="text-[13px] font-semibold text-[#111]">Pick your insurance</p>
      </div>

      <div className="rounded-2xl bg-[#FAFAFA] p-3.5 mb-5 flex items-center gap-3">
        <img src={IMG.phoneInCar} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-[#111]">Toyota Prius &middot; Southwark</p>
          <p className="text-[12px] text-[#888]">£165 / week rental</p>
        </div>
      </div>

      <div className="space-y-2">
        {INSURANCE_POLICIES.map((p, i) => {
          const active = i === selected;
          return (
            <motion.div
              key={p.name}
              animate={{
                borderColor: active ? "#0B6B4F" : "#EEEEEE",
                backgroundColor: active ? "#FAFFFE" : "#FFFFFF",
              }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between rounded-xl border p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-[#0B6B4F]" : "border-[#DDD]"}`}>
                  {active && <div className="w-2 h-2 rounded-full bg-[#0B6B4F]" />}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#111]">{p.name}</p>
                  <p className="text-[11px] text-[#999]">{p.tag}</p>
                </div>
              </div>
              <span className="text-[13px] font-bold text-[#111] shrink-0">{p.price}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
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

      {/* Hero - light ground matching the rest of the page; bold type carries
          the section instead of a dark banner */}
      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 px-4 overflow-hidden border-b border-[#EEEEEE]" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p
            {...FADE_UP_HERO}
            className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5 text-[#0B6B4F]"
          >
            Driver Guide
          </motion.p>
          <motion.h1
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[40px] sm:text-6xl font-heading font-extrabold leading-[1.02] tracking-tight text-[#111] text-balance"
          >
            How renting works: from browse to keys.
          </motion.h1>
          <motion.p
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#666] text-[17px] mt-6 max-w-xl mx-auto leading-relaxed"
          >
            Five steps, 48-hour vetting, and most drivers are in their car within 3 working days.
            No payment until you've met the operator and agreed terms.
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
              onClick={() => navigate("/for-drivers")}
              className="px-7 py-3.5 rounded-full border border-[#D8D8D8] text-[#111] font-medium text-[15px] hover:bg-white transition-colors flex items-center gap-2"
            >
              For drivers overview
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Step-by-step - alternating photo/text rows, all visible, reveal on
          scroll. Widened from max-w-4xl/5xl to max-w-6xl/7xl so each row
          actually fills the page at desktop widths instead of running two
          narrow columns down the page's centre; the icon-in-a-circle badge
          per step (the generic template look) is dropped in favour of a
          plain "Step N" label, matching the numbered-index language used
          elsewhere on the site. */}
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
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

          <div className="flex flex-col gap-16 lg:gap-24">
            {STEPS.map(({ num, title, body, detail, photo }, i) => {
              const reversed = i % 2 === 1;
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-16 items-center ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="relative">
                    <span
                      className="absolute -top-10 -left-3 font-heading font-extrabold text-[110px] leading-none text-[#0B6B4F]/[0.07] select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      {num}
                    </span>
                    <div className="relative rounded-[28px] overflow-hidden aspect-[16/11] bg-[#EDEDED] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                      <img src={photo} alt={title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </div>

                  <div className={reversed ? "lg:pr-4" : "lg:pl-4"}>
                    <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">
                      Step {num}
                    </p>
                    <h3 className="font-heading font-bold text-[24px] sm:text-[26px] text-[#111]">{title}</h3>
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

      {/* What you pay - rebuilt as a pick-your-car-then-pick-your-insurance
          flow instead of a static price breakdown, since the rental price is
          set by the operator (not a fixed Kharo figure) and insurance is a
          real choice between several policies, not one quoted number.
          Breakdown cover is dropped from here entirely: it's replaced by the
          aftercare/support promise below and, where relevant, by whichever
          insurance policy a driver picks. */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4 overflow-hidden">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">What you pay</p>
            <motion.h2
              {...FADE_UP}
              className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-4"
            >
              Rental set by the operator, insurance set by you
            </motion.h2>
            <p className="text-[15px] text-[#666] leading-relaxed mb-8 max-w-md">
              Each operator prices their own fleet, so the weekly rental figure on a listing
              is what they charge, kept below what other PCO platforms charge for the same
              car. Once you're matched with a car, you pick your own cover from a shortlist
              of specialist private hire insurers at competitive rates, rather than having
              one policy picked for you.
            </p>
            <div className="space-y-5 max-w-md">
              <div className="border-t border-[#EEEEEE] pt-4">
                <p className="font-semibold text-[14px] text-[#111]">Weekly rental</p>
                <p className="text-[13px] text-[#888] mt-0.5">Set by the operator, shown upfront on every listing.</p>
              </div>
              <div className="border-t border-[#EEEEEE] pt-4">
                <p className="font-semibold text-[14px] text-[#111]">Insurance</p>
                <p className="text-[13px] text-[#888] mt-0.5">Your choice from a shortlist of competitive policies, priced separately.</p>
              </div>
              <div className="border-t border-b border-[#EEEEEE] py-4">
                <p className="font-semibold text-[14px] text-[#111]">Maintenance &amp; servicing</p>
                <p className="text-[13px] text-[#888] mt-0.5">Scheduled servicing at the operator's designated garage, included.</p>
              </div>
            </div>
          </div>

          <InsurancePicker />
        </div>
      </section>

      {/* Aftercare - a light green band (not the solid CTA green, not another
          dark band) so it reads as its own distinct moment on the page
          instead of another card grid. */}
      <section className="bg-[#EAF5F1] py-16 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">Aftercare</p>
            <h2 className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-4" style={{ textWrap: "balance" }}>
              A real team, on call for as long as you're driving
            </h2>
            <p className="text-[#555] text-[15px] leading-relaxed max-w-lg">
              Issues don't stick to office hours, so neither do we. If something goes wrong
              with the car, or you're involved in an accident, Kharo's support team is a call
              away to help get it sorted with the operator, rather than leaving you to handle
              it alone.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-[#D5EAE2] px-8 py-7 text-center shrink-0">
            <div className="text-[44px] font-heading font-extrabold text-[#0B6B4F] leading-none">24/7</div>
            <p className="text-[#0B6B4F]/80 text-[13px] mt-2 max-w-[170px] mx-auto">
              Support for issues and accidents, whenever you need us
            </p>
          </div>
        </div>
      </section>

      {/* Requirements - short divided list instead of a green-checkmark
          checklist (the checkmark-per-line pattern is the same generic
          template look the icon-circle badges above had), paired with a
          trimmed 3-layer vetting card. */}
      <section className="py-16 px-4">
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <motion.h2
                {...FADE_UP}
                className="text-[28px] font-heading font-extrabold text-[#111] mb-4"
              >
                What you need to qualify
              </motion.h2>
              <p className="text-[15px] text-[#666] leading-relaxed mb-8">
                Our vetting is thorough but fair. If you meet the basics below,
                you're in a strong position to apply.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {REQUIREMENTS.map((r, i) => (
                  <motion.p
                    key={r}
                    {...FADE_UP}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="text-[14px] text-[#333] font-medium leading-snug pb-4 border-b border-[#EEEEEE]"
                  >
                    {r}
                  </motion.p>
                ))}
              </div>
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
              <h3 className="font-heading font-bold text-[20px] text-[#111] mb-1">3-Layer Vetting</h3>
              <p className="text-[#888] text-[13px] mb-5">
                Done on your phone. Takes 48 hours. No credit impact.
              </p>
              <div>
                {[
                  { step: "01", label: "DVLA eligibility check", desc: "Licence confirmed, points shared with the operator" },
                  { step: "02", label: "Liveness identity check", desc: "AI check against your photo ID" },
                  { step: "03", label: "Open Banking affordability", desc: "Read-only account review, no credit impact" },
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

      {/* Dashboard showcase - moved to the bottom of the page, right before
          the FAQ, instead of sitting right after the step-by-step process */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4 overflow-hidden">
        <div className="max-w-5xl 2xl:max-w-6xl mx-auto">
          <div className="max-w-xl mx-auto text-center mb-12">
            <motion.p
              {...FADE_UP}
              className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
            >
              Your account
            </motion.p>
            <motion.h2
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-4"
            >
              Your rental and your cover, in one dashboard
            </motion.h2>
            <motion.p
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[15px] text-[#666] leading-relaxed"
            >
              Once you're approved, everything lives in your Kharo account: the rental itself,
              your insurance certificate and renewal date, every payment, and every document,
              all in one place instead of scattered across emails.
            </motion.p>
          </div>

          <motion.div
            {...FADE_UP}
            className="rounded-[22px] overflow-hidden border border-[#E8E8E8] bg-white"
            style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.22)" }}
          >
            {/* browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#F5F5F5] border-b border-[#E8E8E8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-[11px] text-[#999] bg-white border border-[#E8E8E8] rounded-full px-3 py-1">
                app.kharo.co.uk/driver
              </span>
            </div>

            <div className="grid sm:grid-cols-[168px_1fr]">
              {/* sidebar */}
              <div className="hidden sm:flex flex-col gap-1 p-3 bg-[#FAFAFA] border-r border-[#EEEEEE]">
                {DASHBOARD_NAV.map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium ${active ? "bg-[#0B6B4F] text-white" : "text-[#666]"}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                ))}
              </div>

              {/* main content */}
              <div className="p-5 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {/* rental card */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">My rental</span>
                      <span className="text-[10px] font-bold text-[#0B6B4F] bg-[#EAF5F1] rounded-full px-2 py-0.5">Active</span>
                    </div>
                    <p className="font-heading font-bold text-[17px] text-[#111]">Toyota Prius &middot; Southwark</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="font-heading font-extrabold text-[26px] text-[#111]">£165</span>
                      <span className="text-[#AAA] text-[12px]">/ week rental</span>
                    </div>
                    <p className="text-[11px] text-[#AAA] mt-1">Next payment due 10 Sep</p>
                  </div>

                  {/* insurance card */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5 bg-[#FAFFFE]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Insurance</span>
                      <span className="text-[10px] font-bold text-[#0B6B4F] bg-[#EAF5F1] rounded-full px-2 py-0.5">Active</span>
                    </div>
                    <p className="font-heading font-bold text-[17px] text-[#111]">Standard Cover</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="font-heading font-extrabold text-[26px] text-[#111]">£38</span>
                      <span className="text-[#AAA] text-[12px]">/ week</span>
                    </div>
                    <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B6B4F] mt-2">
                      View certificate <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {/* maintenance */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="w-3.5 h-3.5 text-[#0B6B4F]" />
                      <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Maintenance</span>
                    </div>
                    <p className="text-[13px] text-[#333] mt-2">Warning light &middot; reported 4 Sep</p>
                    <span className="inline-block text-[10px] font-bold text-[#8A5E1E] bg-[#FDF3E3] rounded-full px-2 py-0.5 mt-2">In progress</span>
                  </div>

                  {/* claims */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <LifeBuoy className="w-3.5 h-3.5 text-[#0B6B4F]" />
                      <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Claims</span>
                    </div>
                    <p className="text-[13px] text-[#333] mt-2">No open claims</p>
                    <span className="inline-block text-[10px] font-bold text-[#0B6B4F] bg-[#EAF5F1] rounded-full px-2 py-0.5 mt-2">Report a claim</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* payments */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Recent payments</span>
                    <div className="mt-2">
                      {DASHBOARD_PAYMENTS.map(({ label, value, date }, i) => (
                        <div key={label} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-[#F0F0F0]" : ""}`}>
                          <div>
                            <p className="text-[13px] text-[#333] font-medium">{label}</p>
                            <p className="text-[11px] text-[#AAA]">{date}</p>
                          </div>
                          <span className="text-[13px] font-semibold text-[#111]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* documents */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Documents</span>
                    <div className="mt-2">
                      {DASHBOARD_DOCUMENTS.map(({ label, status, detail }, i) => (
                        <div key={label} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-[#F0F0F0]" : ""}`}>
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#AAA]" />
                            <div>
                              <p className="text-[13px] text-[#333] font-medium">{label}</p>
                              <p className="text-[11px] text-[#AAA]">{detail}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#0B6B4F] bg-[#EAF5F1] rounded-full px-2 py-0.5 shrink-0">{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto">
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
