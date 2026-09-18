import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  MapPin,
  PoundSterling,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSeo } from "@/lib/seo";
import { IMG } from "@/lib/images";

const FADE = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55 },
};

const STEPS = [
  { n: "01", title: "Find a car", body: "Search by city, area, vehicle type, fuel type and weekly budget. Start with the car that fits the work you want to do.", image: IMG.driverMirror },
  { n: "02", title: "Read the listing properly", body: "Check the weekly rental, mileage allowance, deposit, vehicle details and any other terms shown by the operator.", image: "/images/listings/toyota-prius.jpg" },
  { n: "03", title: "Register your interest", body: "Choose the vehicle and tell Kharo when you are looking to start. Registering interest is not the same as renting the car.", image: IMG.phoneInCar },
  { n: "04", title: "Speak to the operator", body: "The operator can confirm availability and explain the terms before you decide whether the car is right for you.", image: IMG.handshakeDesk },
  { n: "05", title: "Complete the checks", body: "When you decide to continue, the checks required for that rental are completed. The exact requirements can vary by operator and insurer.", image: IMG.signingCouple },
  { n: "06", title: "Agree and collect", body: "Once everything is agreed, arrange the handover, check the vehicle together and get on the road.", image: IMG.keysHandover },
];

const CHECKS = [
  { icon: PoundSterling, title: "Weekly rental", body: "Know what you are paying each week and what sits outside that figure." },
  { icon: Wallet, title: "Deposit", body: "Ask how much it is, how it is paid and what the operator's return conditions are." },
  { icon: Car, title: "Mileage", body: "Check the allowance and what happens if you go over it." },
  { icon: ShieldCheck, title: "Insurance", body: "Make sure you understand whether insurance is separate or included and what cover applies." },
  { icon: FileCheck2, title: "Rental terms", body: "Check the minimum period, notice period, payment dates and return process." },
  { icon: MapPin, title: "Collection", body: "Confirm where the car is collected and what you need to bring with you." },
];

const REQUIREMENTS = [
  "A valid private hire driver licence for the area where you intend to work",
  "A driving licence that meets the operator and insurer requirements",
  "The right to work in the UK where this is required for your private hire work",
  "Any identity, driving or insurance information needed for the checks",
];

const FAQS = [
  ["Does registering interest mean I have rented the car?", "No. It tells Kharo and the operator that you want to discuss the vehicle. You only proceed after you understand and agree the rental terms."],
  ["Do I pay Kharo to search for a car?", "No. Browsing vehicles and registering interest are free."],
  ["Who sets the weekly rental price?", "The vehicle operator sets the rental price and the other rental terms. Kharo displays the information supplied for the listing."],
  ["Can I ask the operator questions before deciding?", "Yes. The operator can confirm availability and explain the deposit, mileage, insurance and other terms before you decide whether to proceed."],
  ["What checks will I have to complete?", "It depends on the vehicle and operator. Checks can include driver licence, identity, right to work and insurance-related information."],
  ["What happens if I cannot find the right car?", "Register your interest and tell us what you are looking for. That helps us understand where demand is and what cars drivers want as Kharo expands."],
];

function Label({ children }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#0B6B4F] mb-3">{children}</p>;
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#ECEAE4] last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 py-5 text-left" aria-expanded={open}>
        <span className="font-semibold text-[15px] sm:text-[16px]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#888F89] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 pr-8"><p className="text-[14px] sm:text-[15px] text-[#606761] leading-relaxed">{a}</p></div>}
    </div>
  );
}

function StepsTimeline() {
  return (
    <div className="relative">
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[#DDDAD2]" />
      <div className="space-y-12 sm:space-y-16">
        {STEPS.map((step, i) => {
          const reverse = i % 2 === 1;
          return (
            <motion.div key={step.n} {...FADE} className="relative grid lg:grid-cols-2 gap-6 lg:gap-14 items-center">
              <div className={reverse ? "lg:order-2" : ""}>
                <div className="relative rounded-[26px] overflow-hidden aspect-[1.35/1] bg-[#E7E4DB] shadow-[0_28px_65px_-35px_rgba(0,0,0,.28)]">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#173126]">Step {step.n}</div>
                </div>
              </div>
              <div className={reverse ? "lg:order-1 lg:pr-10" : "lg:pl-10"}>
                <p className="font-heading font-extrabold text-[14px] text-[#0B6B4F]">{step.n}</p>
                <h3 className="font-heading font-extrabold text-[28px] sm:text-[34px] leading-tight tracking-[-0.025em] mt-3">{step.title}</h3>
                <p className="mt-4 text-[15px] sm:text-[16px] text-[#636B65] leading-relaxed max-w-xl">{step.body}</p>
              </div>
              <span className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#0B6B4F] ring-8 ring-[#F7F6F2]" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function DriverGuide() {
  const navigate = useNavigate();
  useSeo({
    title: "Driver Guide | How Kharo Works",
    description: "A clear step-by-step guide to finding and renting a private hire vehicle through Kharo.",
  });

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111]">
      {/* Hero */}
      <section className="overflow-hidden border-b border-[#E5E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-18 lg:py-22 grid lg:grid-cols-[.95fr_1.05fr] gap-10 lg:gap-16 items-center">
          <motion.div {...FADE}>
            <Label>For drivers</Label>
            <h1 className="font-heading font-extrabold text-[44px] sm:text-[62px] lg:text-[72px] leading-[.96] tracking-[-0.045em]">Looking for a private hire car? Start here.</h1>
            <p className="mt-6 text-[17px] sm:text-[19px] text-[#5F6761] leading-relaxed max-w-xl">Kharo is built to make the search easier. Find vehicles, compare the details, register your interest and speak to the operator before you commit.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate("/search")} className="inline-flex items-center gap-2 rounded-full bg-[#0B6B4F] text-white px-6 py-3.5 font-semibold hover:bg-[#095B43] transition-colors">Browse vehicles <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => navigate("/register")} className="rounded-full bg-white border border-[#D6D3CB] px-6 py-3.5 font-semibold hover:bg-[#F0EEE8] transition-colors">Register interest</button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
              {["Search", "Compare", "Connect"].map((item, i) => (
                <div key={item} className="rounded-2xl bg-white border border-[#E5E2DA] px-4 py-3"><p className="text-[10px] uppercase tracking-[0.12em] text-[#0B6B4F] font-bold">0{i + 1}</p><p className="font-heading font-bold text-[15px] mt-1">{item}</p></div>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE} className="relative lg:pl-6">
            <div className="rounded-[30px] overflow-hidden bg-[#E8E5DD] p-3 shadow-[0_35px_100px_-45px_rgba(0,0,0,.38)]">
              <div className="relative rounded-[24px] overflow-hidden aspect-[1.15/1]">
                <img src={IMG.taxiDriver} alt="Private hire driver in a car" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#9DE6C7]">Example listing</p>
                  <div className="mt-1 flex items-end justify-between gap-4">
                    <div><p className="font-heading font-bold text-[24px]">Toyota Prius</p><p className="text-white/75 text-[12px]">Southwark · Hybrid · Private hire</p></div>
                    <div className="text-right"><p className="font-heading font-extrabold text-[20px]">£175</p><p className="text-white/65 text-[11px]">per week</p></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 sm:left-0 rounded-2xl bg-white border border-[#E4E1D9] shadow-lg px-5 py-4 max-w-[265px]"><div className="flex items-center gap-2"><CircleHelp className="w-4 h-4 text-[#0B6B4F]" /><p className="text-[12px] font-semibold">No payment just to register interest.</p></div></div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl mb-12 sm:mb-16"><Label>The process</Label><h2 className="font-heading font-extrabold text-[36px] sm:text-[50px] leading-[1.02] tracking-[-0.035em]">From “I need a car” to “where do I collect it?”</h2><p className="mt-4 text-[16px] text-[#68706A] leading-relaxed">Six straightforward steps. The operator remains the person who confirms the final rental terms.</p></motion.div>
          <StepsTimeline />
        </div>
      </section>

      {/* What to check */}
      <section className="bg-white border-y border-[#E6E3DB] py-16 sm:py-22">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="grid lg:grid-cols-[.72fr_1.28fr] gap-10 lg:gap-16 items-start">
            <div><Label>Before you say yes</Label><h2 className="font-heading font-extrabold text-[35px] sm:text-[48px] leading-[1.03] tracking-[-0.035em]">Six things worth checking on every car.</h2><p className="mt-4 text-[15px] sm:text-[16px] text-[#666E68] leading-relaxed">Two cars can look similar online and work very differently for your week. Ask the questions before you hand over money.</p></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {CHECKS.map(({ icon: Icon, title, body }) => (
                <article key={title} className="rounded-[21px] border border-[#E3E0D8] bg-[#FBFAF7] p-5"><div className="w-10 h-10 rounded-xl bg-[#E7F3ED] text-[#0B6B4F] flex items-center justify-center"><Icon className="w-5 h-5" /></div><h3 className="font-heading font-bold text-[17px] mt-5">{title}</h3><p className="text-[13px] text-[#666E68] leading-relaxed mt-1.5">{body}</p></article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 sm:py-22 bg-[#10231B] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_.82fr] gap-10 lg:gap-16 items-center">
          <motion.div {...FADE}><Label>What you will need</Label><h2 className="font-heading font-extrabold text-[36px] sm:text-[48px] leading-[1.02] tracking-[-0.035em]">You can browse first. Get the paperwork ready when you want to move forward.</h2><p className="mt-5 text-white/65 text-[16px] leading-relaxed max-w-xl">The exact requirements can depend on the city, operator and insurance arrangements. These are the things most drivers should expect to have available.</p><div className="mt-7 space-y-3">{REQUIREMENTS.map((item) => <div key={item} className="flex items-start gap-3 text-white/78 text-[14px] sm:text-[15px]"><Check className="w-4 h-4 text-[#6DE0B1] mt-1 shrink-0" />{item}</div>)}</div></motion.div>
          <motion.div {...FADE} className="relative"><div className="rounded-[28px] overflow-hidden aspect-[.9/1] bg-[#173026]"><img src={IMG.keysWoman} alt="Driver receiving car keys" className="w-full h-full object-cover" /></div><div className="absolute left-4 right-4 bottom-4 rounded-2xl bg-[#0B1B15]/85 backdrop-blur-sm border border-white/10 px-5 py-4"><p className="text-[10px] uppercase tracking-[0.14em] text-[#8BE3BF] font-bold">Keep it simple</p><p className="font-heading font-bold text-[19px] mt-1">Do not hand over a deposit until you understand what you are agreeing to.</p></div></motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-22 bg-[#F7F6F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="text-center max-w-2xl mx-auto mb-10"><Label>Questions drivers ask</Label><h2 className="font-heading font-extrabold text-[35px] sm:text-[47px] tracking-[-0.03em]">No jargon. Just the answers.</h2></motion.div>
          <motion.div {...FADE} className="bg-white rounded-[24px] border border-[#E3E0D8] px-6 sm:px-8"><div>{FAQS.map(([q, a]) => <Faq key={q} q={q} a={a} />)}</div></motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B6B4F] text-white py-14 sm:py-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...FADE}><p className="text-[11px] uppercase tracking-[0.17em] text-[#A8EACF] font-bold">Ready to look?</p><h2 className="font-heading font-extrabold text-[36px] sm:text-[51px] leading-[1.02] tracking-[-0.035em] mt-3">Start with the cars, not the WhatsApp group.</h2><p className="mt-4 text-white/70 text-[15px] sm:text-[16px] max-w-2xl mx-auto">Browse the marketplace and register interest in the vehicles that fit your work.</p><div className="mt-8 flex justify-center flex-wrap gap-3"><button onClick={() => navigate("/search")} className="rounded-full bg-white text-[#0B6B4F] px-7 py-3.5 font-semibold hover:bg-[#EAF6F1] transition-colors">Browse vehicles</button><button onClick={() => navigate("/register")} className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors">Register interest</button></div></motion.div>
        </div>
      </section>
    </main>
  );
}
