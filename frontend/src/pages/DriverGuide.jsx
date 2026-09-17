import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car, ChevronDown, Clock, ChevronRight, LayoutDashboard,
  ShieldCheck, CreditCard, FileText, ArrowUpRight, Wrench, LifeBuoy,
  Phone, Check, ArrowRight,
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

// A pill that follows the reader down the page instead of sitting static in
// one section - visible once they've scrolled past the hero, hidden again
// near the footer CTA so it doesn't stack with it.
function FloatingCTA({ label, onClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > 500;
      const nearBottom = window.innerHeight + window.scrollY > document.body.offsetHeight - 700;
      setVisible(pastHero && !nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      animate={
        visible
          ? { opacity: 1, y: [0, -6, 0], pointerEvents: "auto" }
          : { opacity: 0, y: 20, pointerEvents: "none" }
      }
      transition={
        visible
          ? { y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } }
          : { duration: 0.3 }
      }
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 bg-[#0B6B4F] text-white pl-5 pr-4 py-3.5 rounded-full hover:bg-[#095B43] transition-colors"
      style={{ boxShadow: "0 20px 40px -12px rgba(11,107,79,0.5)" }}
    >
      <span className="text-[13px] font-semibold whitespace-nowrap">{label}</span>
      <ArrowRight className="w-4 h-4 shrink-0" />
    </motion.button>
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

      {/* Aftercare - an "incoming call" mock instead of another stat card:
          the site already leans on big-number-in-a-white-card everywhere
          (pricing, vetting stats, driver gap), so a second one here just
          reads as the same template again. This ties directly to the "a
          call away" promise and gives the page a moment nothing else on it
          looks like. No explicit background: it sits on the page's own grey
          straight after the white "what you pay" band, so the two don't
          merge into one undifferentiated white block. */}
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">Aftercare</p>
            <h2 className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111] mb-4" style={{ textWrap: "balance" }}>
              A real team, on call for as long as you're driving
            </h2>
            <p className="text-[#666] text-[15px] leading-relaxed max-w-lg">
              Issues don't stick to office hours, so neither do we. If something goes wrong
              with the car, or you're involved in an accident, Kharo's support team is a call
              away to help get it sorted with the operator, rather than leaving you to handle
              it alone.
            </p>
          </div>
          <motion.div
            {...FADE_UP}
            className="relative shrink-0 w-[190px] bg-white border border-[#E8E8E8] rounded-[28px] p-6 text-center mx-auto"
            style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.15)" }}
          >
            <div className="relative w-14 h-14 mx-auto mb-4">
              <motion.span
                className="absolute inset-0 rounded-full bg-[#0B6B4F]/25"
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-[#0B6B4F]/25"
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
              />
              <div className="relative w-14 h-14 rounded-full bg-[#0B6B4F] flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-[#111] text-[13px] font-semibold">Kharo Support</p>
            <p className="text-[#0B6B4F] text-[11px] mt-1 font-medium flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B4F] animate-pulse" />
              Available 24/7
            </p>
          </motion.div>
        </div>
      </section>

      {/* What you need to qualify - one mock "eligibility check" screen
          instead of a bulleted list next to a separate numbered card (the
          list-plus-card layout used above and on several other pages).
          Requirements as check-off rows, vetting as a connected-dot tracker
          underneath, so it reads as one real product moment. */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">What you need to qualify</p>
          <motion.h2
            {...FADE_UP}
            className="text-[28px] sm:text-[32px] font-heading font-extrabold text-[#111]"
            style={{ textWrap: "balance" }}
          >
            Meet the basics. We'll handle the rest.
          </motion.h2>
        </div>

        <motion.div
          {...FADE_UP}
          className="max-w-lg mx-auto bg-white rounded-[28px] border border-[#E8E8E8] overflow-hidden"
          style={{ boxShadow: "0 30px 70px -30px rgba(0,0,0,0.15)" }}
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-[#FAFAFA] border-b border-[#E8E8E8]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-3 text-[11px] text-[#999]">Your eligibility check</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-3.5 mb-8">
              {REQUIREMENTS.map((r, i) => (
                <motion.div
                  key={r}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-md bg-[#0B6B4F] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-[14px] text-[#333]">{r}</p>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-[#EEEEEE] pt-6">
              <p className="text-[11px] font-semibold text-[#888] uppercase tracking-wide mb-5">
                Then, 3-layer vetting in 48 hours
              </p>
              <div className="relative flex justify-between max-w-xs mx-auto">
                <div className="absolute top-[5px] left-[16%] right-[16%] h-px bg-[#0B6B4F]/25" />
                {["DVLA eligibility", "Liveness identity", "Open Banking"].map((label) => (
                  <div key={label} className="relative flex flex-col items-center text-center w-1/3 px-1">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#0B6B4F] ring-4 ring-white" />
                    <p className="text-[11px] text-[#666] mt-2.5 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/search")}
            className="px-6 py-3 rounded-full bg-[#0B6B4F] text-white font-semibold text-[14px] hover:bg-[#095B43] transition-colors"
          >
            Browse available cars
          </button>
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

      <FloatingCTA label="See what you could earn" onClick={() => navigate("/search")} />
    </div>
  );
}
