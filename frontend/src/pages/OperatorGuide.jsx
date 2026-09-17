import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car, ChevronDown, ChevronRight, Check, Clock,
  LayoutDashboard, Wallet, FileCheck2, ShieldPlus,
  UploadCloud, Wrench, LifeBuoy, ArrowRight, BadgeCheck,
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
    title: "Submit your fleet details",
    body: "Fill in the operator interest form with your company name, fleet size, and how many cars are currently idle. A Kharo fleet specialist will call you within 1 working day.",
    detail: "Takes 3 minutes. No commitment at this stage.",
    photo: IMG.signingLaptop,
  },
  {
    num: "02",
    title: "Kharo reviews and onboards you",
    body: "We verify your operator licence and Companies House registration, then set up your operator profile. You tell us your rates, deposit requirements, borough coverage, and any vehicle restrictions.",
    detail: "Operator verification typically completes within 2 working days.",
    photo: IMG.handshakeDesk,
  },
  {
    num: "03",
    title: "Your cars go live on Kharo",
    body: "Add listings for each available vehicle: make, model, fuel type, weekly price (all-in), photos, and mileage allowance. Only TfL-eligible cars are listed. Listings are reviewed before going live.",
    detail: "First listings are usually live within 24 hours of onboarding.",
    photo: IMG.rowCars,
  },
  {
    num: "04",
    title: "Drivers register interest: you get the lead",
    body: "A driver sees your car and registers interest. Kharo runs its vetting check: DVLA, identity, and Open Banking affordability. You receive the approved driver's details and you make contact.",
    detail: "Vetting takes 48 hours. You only speak to approved drivers.",
    photo: IMG.phoneInCar,
  },
  {
    num: "05",
    title: "Agree terms and start earning",
    body: "You call the driver, confirm availability and deposit, and agree terms. The rental is between you and the driver directly. Kharo earns a fee when the rental completes, not before.",
    detail: "No monthly listing fee. Kharo earns on completions only.",
    photo: IMG.handshakeSmile,
  },
  {
    num: "06",
    title: "Risk management protects your fleet",
    body: "Every Kharo rental includes our built-in risk management framework. GPS trackers must be fitted to all vehicles before handover. If a driver misses a payment, we contact their rideshare platform directly (Uber, Bolt, etc.) so they cannot accept new trips until the rent is cleared. Your fleet is trackable live from the Kharo Operator Dashboard.",
    detail: "Uber enforcement, GPS tracking, and live dashboard are included for all operators.",
    photo: IMG.fleetAerial,
  },
];

// What Kharo actually needs from an operator to list a car - not vehicle
// spec thresholds an operator already knows, but the documents and media
// Kharo needs submitted before a listing can go live.
const WHAT_TO_SUBMIT = [
  { label: "Vehicle documents", body: "V5C logbook and MOT certificate for each car you want to list." },
  { label: "Licensing documents", body: "Your PHV operator licence and each vehicle's TfL private hire licence." },
  { label: "Photos and video", body: "Clear exterior and interior shots, plus a short walk-around video of the car." },
];

const WHAT_WE_CHECK = [
  "DVLA licence confirmed and points verified",
  "Liveness identity check against photo ID",
  "Open Banking affordability review (no credit impact)",
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
    a: "Kharo runs its vetting check (DVLA, identity, Open Banking). You receive only approved drivers. You still do your own final checks and agree terms directly with the driver.",
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
  {
    q: "I already have fleet insurance. Can that be reflected in my price?",
    a: "Yes. Add your policy details and certificate in the Fleet insurance section of your dashboard, then switch on \"Include insurance in the price drivers see\" and your listings show one weekly figure with insurance already built in. Leave it off and we quote insurance separately, based on each driver's own profile, as we do by default. Cover details are self-declared by you, not verified by Kharo, so it's on you to keep the policy valid while the toggle is on.",
  },
];

const OPERATOR_DASHBOARD_NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Car, label: "Fleet" },
  { icon: BadgeCheck, label: "Applications" },
  { icon: ShieldPlus, label: "Fleet insurance" },
  { icon: Wrench, label: "Maintenance" },
  { icon: LifeBuoy, label: "Claims" },
  { icon: Wallet, label: "Payouts" },
];

const OPERATOR_STATS = [
  { label: "Fleet size", value: "24 cars" },
  { label: "Active rentals", value: "19" },
  { label: "This month", value: "£14,820" },
];

const OPERATOR_APPLICATIONS = [
  { name: "A. Okafor", car: "Toyota Prius · LK22 CAR", status: "Vetted" },
  { name: "M. Hussain", car: "Skoda Octavia · SK20 OCT", status: "Vetted" },
  { name: "R. Novak", car: "Ford Galaxy · LG21 GXY", status: "In review" },
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

export default function OperatorGuide() {
  const navigate = useNavigate();

  useSeo({
    title: "Operator Guide · List Your PCO Fleet on Kharo",
    description:
      "How fleet operators list their PCO vehicles on Kharo, how driver vetting works, and what to expect after your first enquiry.",
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
            Operator Guide
          </motion.p>
          <motion.h1
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[40px] sm:text-6xl font-heading font-extrabold leading-[1.02] tracking-tight text-[#111] text-balance"
          >
            How Kharo works for fleet operators.
          </motion.h1>
          <motion.p
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#666] text-[17px] mt-6 max-w-xl mx-auto leading-relaxed"
          >
            List your idle PCO cars, receive pre-vetted driver leads, and fill your fleet faster,
            with no upfront listing fee.
          </motion.p>
          <motion.div
            {...FADE_UP_HERO}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-9 flex flex-wrap gap-3 justify-center"
          >
            <a
              href="/list-your-fleet"
              className="px-6 py-3 rounded-full bg-[#0B6B4F] text-white font-semibold text-[15px] hover:bg-[#095B43] transition-colors"
            >
              List your fleet
            </a>
            <button
              onClick={() => navigate("/help")}
              className="px-6 py-3 rounded-full border border-[#D8D8D8] text-[#111] font-medium text-[15px] hover:bg-white transition-colors flex items-center gap-2"
            >
              Get help
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Step by step - widened from max-w-4xl/5xl to 6xl/7xl so it fills
          the page like the driver guide's version; icon-in-a-circle badge
          per step dropped for a plain "Step N" label. */}
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

      {/* Dashboard showcase */}
      <section className="py-16 px-4 overflow-hidden">
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
              Your fleet, your applications and your cover, in one dashboard
            </motion.h2>
            <motion.p
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[15px] text-[#666] leading-relaxed"
            >
              Every vehicle, every vetted application and every payout in one view. If you
              already carry your own fleet insurance, add it once and we build it straight
              into the rental price drivers see.
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
                app.kharo.co.uk/operator
              </span>
            </div>

            <div className="grid sm:grid-cols-[168px_1fr]">
              {/* sidebar */}
              <div className="hidden sm:flex flex-col gap-1 p-3 bg-[#FAFAFA] border-r border-[#EEEEEE]">
                {OPERATOR_DASHBOARD_NAV.map(({ icon: Icon, label, active }) => (
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
                {/* stat row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {OPERATOR_STATS.map(({ label, value }) => (
                    <div key={label} className="rounded-2xl border border-[#EEEEEE] p-4">
                      <p className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">{label}</p>
                      <p className="font-heading font-extrabold text-[19px] sm:text-[22px] text-[#111] mt-1">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* applications */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Vetted applications</span>
                    <div className="mt-2">
                      {OPERATOR_APPLICATIONS.map(({ name, car, status }, i) => (
                        <div key={name} className={`flex items-center justify-between py-2.5 ${i > 0 ? "border-t border-[#F0F0F0]" : ""}`}>
                          <div>
                            <p className="text-[13px] text-[#333] font-medium">{name}</p>
                            <p className="text-[11px] text-[#AAA]">{car}</p>
                          </div>
                          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0 ${status === "Vetted" ? "text-[#0B6B4F] bg-[#EAF5F1]" : "text-[#8A5E1E] bg-[#FDF3E3]"}`}>
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* fleet insurance card - the bring-your-own-cover feature */}
                  <div className="rounded-2xl border border-[#0B6B4F]/25 p-5 bg-[#FAFFFE]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-semibold text-[#0B6B4F] uppercase tracking-wide flex items-center gap-1.5">
                        <ShieldPlus className="w-3.5 h-3.5" /> Fleet insurance
                      </span>
                      <span className="text-[10px] font-bold text-white bg-[#0B6B4F] rounded-full px-2 py-0.5">On file</span>
                    </div>
                    <div className="space-y-2 text-[12px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#888]">Policy holder</span>
                        <span className="text-[#111] font-medium">Your fleet policy</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#888]">Cover expiry</span>
                        <span className="text-[#111] font-medium">14 Feb 2027</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0B6B4F] font-medium pt-1">
                        <UploadCloud className="w-3.5 h-3.5" /> Certificate uploaded
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#0B6B4F]/15">
                      <span className="text-[11px] text-[#444] font-medium leading-snug max-w-[140px]">Include insurance in the price drivers see</span>
                      <span className="w-9 h-5 rounded-full bg-[#0B6B4F] relative shrink-0">
                        <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {/* maintenance */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="w-3.5 h-3.5 text-[#0B6B4F]" />
                      <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Maintenance</span>
                    </div>
                    <p className="text-[13px] text-[#333] mt-2">Ford Galaxy &middot; scheduled service booked</p>
                    <span className="inline-block text-[10px] font-bold text-[#666] bg-[#F0F0F0] rounded-full px-2 py-0.5 mt-2">2 open jobs</span>
                  </div>

                  {/* claims */}
                  <div className="rounded-2xl border border-[#EEEEEE] p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <LifeBuoy className="w-3.5 h-3.5 text-[#0B6B4F]" />
                      <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wide">Claims</span>
                    </div>
                    <p className="text-[13px] text-[#333] mt-2">Tesla Model 3 &middot; attempted theft</p>
                    <span className="inline-block text-[10px] font-bold text-[#8A5E1E] bg-[#FDF3E3] rounded-full px-2 py-0.5 mt-2">Reported</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What you need to know - one consolidated section instead of three
          separate ones (the old "vehicle eligibility"/"commercial terms"
          split, a standalone driver-vetting section, and a note tacked onto
          the bottom of the dashboard). Vehicle eligibility content is
          dropped - operators already know their own vehicle specs; what
          they actually need is what to submit. Commercial terms is dropped
          entirely. PHV trade record is removed from vetting - Kharo doesn't
          check it. */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.p
              {...FADE_UP}
              className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3"
            >
              Before you list
            </motion.p>
            <motion.h2
              {...FADE_UP}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[28px] font-heading font-extrabold text-[#111]"
            >
              What you need to know
            </motion.h2>
          </div>

          <p className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-4">What to submit</p>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EBEBEB] pb-10 mb-10 border-b border-[#EBEBEB]">
            {WHAT_TO_SUBMIT.map(({ label, body }, i) => (
              <motion.div
                key={label}
                {...FADE_UP}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="py-6 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0"
              >
                <p className="font-heading font-bold text-[15px] text-[#111] mb-1.5">{label}</p>
                <p className="text-[13px] text-[#666] leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-4">How driver vetting works</p>
          <div className="grid lg:grid-cols-2 gap-10 items-start pb-10 mb-10 border-b border-[#EBEBEB]">
            <div>
              <p className="text-[15px] text-[#666] leading-relaxed mb-5">
                You'll only receive leads from drivers who have passed Kharo's check.
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

            <div className="bg-[#FAFAFA] rounded-2xl border border-[#E8E8E8] p-6">
              <h3 className="font-heading font-bold text-[16px] text-[#111] mb-4">What the check covers</h3>
              <div>
                {[
                  { step: "01", label: "DVLA eligibility", desc: "Licence confirmed, points verified" },
                  { step: "02", label: "Liveness identity", desc: "AI-assisted check against photo ID" },
                  { step: "03", label: "Open Banking affordability", desc: "Read-only review, no credit impact" },
                ].map(({ step, label, desc }, i) => (
                  <div key={step} className={`py-3 ${i > 0 ? "border-t border-[#EEEEEE]" : ""}`}>
                    <span className="text-[11px] font-heading font-extrabold text-[#0B6B4F]">{step}</span>
                    <p className="font-semibold text-[13px] text-[#111] mt-0.5">{label}</p>
                    <p className="text-[#888] text-[11px]">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#EEEEEE] text-[12px] text-[#888]">
                Runs within 48 hours of the driver registering interest. You're notified once approved.
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto flex items-start gap-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-2xl p-5">
            <FileCheck2 className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#666] leading-relaxed">
              <span className="font-semibold text-[#111]">Already carry your own fleet cover?</span> Add
              the policy details and certificate to your operator account. Once it's on file, switch the
              toggle on and your listings show one weekly price with insurance already built in, no
              separate quote for the driver to see. Switch it off at any time and we go back to quoting
              insurance separately, based on the driver's own profile. Cover details are self-declared by
              you and not verified by Kharo - you're responsible for keeping the policy valid and adequate
              while the toggle is on.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-[#EBEBEB] py-16 px-4">
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto">
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

      <FloatingCTA label="See how much you could earn" onClick={() => navigate("/list-your-fleet")} />
    </div>
  );
}
