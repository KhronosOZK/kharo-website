import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  Image,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Users,
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
  { n: "01", title: "Tell us about your fleet", body: "Register your interest with the basics: your company, where you operate and how many private hire vehicles you want to list.", image: IMG.fleetLot },
  { n: "02", title: "Get your operator details checked", body: "We review the information needed for your operator profile and confirm the relevant licensing details before vehicles go live.", image: IMG.handshakeDesk },
  { n: "03", title: "Create your vehicle listings", body: "Add clear photos, the weekly rental, location, mileage allowance and the information a driver needs before making an enquiry.", image: IMG.rowCars },
  { n: "04", title: "Drivers find your cars", body: "Drivers can discover your vehicles while searching the marketplace by location, vehicle type, fuel and budget.", image: IMG.phoneInCar },
  { n: "05", title: "Receive the enquiry", body: "When a driver registers interest, you receive the enquiry and can speak with them directly about availability and the rental terms.", image: IMG.handshakeSmile },
  { n: "06", title: "Agree the rental and hand over the car", body: "Once you and the driver are happy with the terms, arrange the handover and start earning from the vehicle.", image: IMG.keysHandover },
];

const OPERATOR_POINTS = [
  { icon: Users, title: "Reach people who are already searching", body: "Put your available cars in front of drivers who have come to Kharo looking for a vehicle." },
  { icon: Search, title: "Give every car a proper listing", body: "Photos, weekly rental, location and useful vehicle information are easier for drivers to compare." },
  { icon: MessageCircle, title: "Get a useful enquiry", body: "The driver tells us what they are looking for, so the conversation starts with more context." },
  { icon: CircleDollarSign, title: "Make idle cars more visible", body: "A car sitting outside your office is not earning. A listing gives another route to a potential renter." },
];

const WHAT_TO_ADD = [
  ["Vehicle photos", "Clear exterior and interior photos. Good photos do more work than a long description."],
  ["Weekly rental", "The weekly amount you are asking for the vehicle."],
  ["Mileage allowance", "State the mileage included and any additional mileage terms."],
  ["Location", "Tell drivers where the vehicle is based and where collection takes place."],
  ["Vehicle details", "Make, model, year, fuel type, seats and anything else a driver needs to know."],
  ["Your terms", "Deposit, minimum period, notice and any restrictions should be clear before the rental starts."],
];

const FAQS = [
  ["How much does it cost to list a car?", "During the launch phase, registering your fleet is free. Kharo's commercial model and any operator charges are explained before you start using the marketplace."],
  ["Do I choose my own rental price?", "Yes. You set the weekly rental and the other terms for your vehicle. Kharo displays the information you provide."],
  ["Can I decide which drivers I rent to?", "Yes. Kharo can help structure the enquiry and checks, but the final rental decision remains with the operator."],
  ["What happens when a driver is interested?", "The enquiry is sent through the Kharo process and you can speak with the driver about availability and the final rental terms."],
  ["Can I list several vehicles?", "Yes. The marketplace is intended for operators with individual vehicles and larger fleets alike."],
  ["What vehicles can I list?", "Vehicles need to meet the relevant private hire licensing requirements for the area where they operate. The exact requirements depend on the licensing authority."],
];

function Label({ children, light = false }) {
  return <p className={`text-[11px] font-bold uppercase tracking-[0.17em] mb-3 ${light ? "text-[#6DE0B1]" : "text-[#0B6B4F]"}`}>{children}</p>;
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
              <div className={reverse ? "lg:order-2" : ""}><div className="relative rounded-[26px] overflow-hidden aspect-[1.35/1] bg-[#E7E4DB] shadow-[0_28px_65px_-35px_rgba(0,0,0,.28)]"><img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" /><div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#173126]">Step {step.n}</div></div></div>
              <div className={reverse ? "lg:order-1 lg:pr-10" : "lg:pl-10"}><p className="font-heading font-extrabold text-[14px] text-[#0B6B4F]">{step.n}</p><h3 className="font-heading font-extrabold text-[28px] sm:text-[34px] leading-tight tracking-[-0.025em] mt-3">{step.title}</h3><p className="mt-4 text-[15px] sm:text-[16px] text-[#636B65] leading-relaxed max-w-xl">{step.body}</p></div>
              <span className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#0B6B4F] ring-8 ring-[#F7F6F2]" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function DemoListing() {
  return (
    <div className="rounded-[28px] bg-white border border-[#E3E0D8] overflow-hidden shadow-[0_30px_70px_-40px_rgba(0,0,0,.38)]">
      <div className="bg-[#F4F3EF] border-b border-[#E4E1D9] px-4 py-3 flex items-center justify-between"><div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D7D3CA]" /><span className="w-2.5 h-2.5 rounded-full bg-[#D7D3CA]" /><span className="w-2.5 h-2.5 rounded-full bg-[#D7D3CA]" /></div><span className="text-[10px] text-[#999F9A]">kharo.co.uk</span></div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.13em] text-[#0B6B4F] font-bold">Your listing</p><h3 className="font-heading font-bold text-[21px] mt-1">Toyota Prius</h3></div><span className="rounded-full bg-[#E7F3ED] text-[#0B6B4F] px-3 py-1.5 text-[11px] font-semibold">Live</span></div>
        <div className="grid sm:grid-cols-[.95fr_1.05fr] gap-4 mt-5"><img src="/images/listings/toyota-prius.jpg" alt="Toyota Prius listing" className="w-full aspect-[1.15/1] object-cover rounded-2xl" /><div className="space-y-2.5"><div className="rounded-xl bg-[#FAF9F6] border border-[#E8E5DE] p-3.5"><p className="text-[10px] uppercase tracking-wide text-[#919792]">Weekly rental</p><p className="font-heading font-extrabold text-[22px] mt-1">£175 <span className="text-[12px] font-medium text-[#868C86]">/ week</span></p></div><div className="grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#FAF9F6] border border-[#E8E5DE] p-3"><p className="text-[10px] text-[#929792]">Fuel</p><p className="font-semibold text-[12px] mt-1">Hybrid</p></div><div className="rounded-xl bg-[#FAF9F6] border border-[#E8E5DE] p-3"><p className="text-[10px] text-[#929792]">Location</p><p className="font-semibold text-[12px] mt-1">Southwark</p></div></div><div className="rounded-xl border border-[#DCE9E2] bg-[#F3FAF7] p-3"><p className="text-[11px] font-semibold text-[#15392D]">Driver interest</p><p className="text-[11px] text-[#66706A] mt-1">A driver has asked to discuss this vehicle.</p></div></div></div>
      </div>
    </div>
  );
}

export default function OperatorGuide() {
  const navigate = useNavigate();
  useSeo({
    title: "Operator Guide | List Private Hire Vehicles on Kharo",
    description: "How private hire vehicle operators can list cars on Kharo and reach drivers looking to rent.",
  });

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111]">
      {/* Hero */}
      <section className="overflow-hidden border-b border-[#E5E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-18 lg:py-22 grid lg:grid-cols-[1.02fr_.98fr] gap-10 lg:gap-16 items-center">
          <motion.div {...FADE}>
            <Label>The operator marketplace</Label>
            <h1 className="font-heading font-extrabold text-[44px] sm:text-[62px] lg:text-[72px] leading-[.96] tracking-[-0.045em]">Got private hire cars sitting unused? Put them in front of drivers.</h1>
            <p className="mt-6 text-[17px] sm:text-[19px] text-[#5F6761] leading-relaxed max-w-xl">Kharo gives operators a dedicated place to list vehicles and reach drivers who are actively looking for a private hire car.</p>
            <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => navigate("/list-your-fleet")} className="inline-flex items-center gap-2 rounded-full bg-[#0B6B4F] text-white px-6 py-3.5 font-semibold hover:bg-[#095B43] transition-colors">List your fleet <ArrowRight className="w-4 h-4" /></button><button onClick={() => navigate("/help")} className="rounded-full bg-white border border-[#D6D3CB] px-6 py-3.5 font-semibold hover:bg-[#F0EEE8] transition-colors">Talk to us first</button></div>
            <div className="mt-8 flex flex-wrap gap-5 text-[12px] text-[#777E78]"><span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-[#0B6B4F]" /> Free to register interest</span><span className="inline-flex items-center gap-1.5"><Search className="w-3.5 h-3.5 text-[#0B6B4F]" /> Drivers search by need</span><span className="inline-flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-[#0B6B4F]" /> Direct enquiries</span></div>
          </motion.div>

          <motion.div {...FADE} className="relative lg:pl-4"><div className="rounded-[30px] overflow-hidden bg-[#E8E5DD] p-3 shadow-[0_35px_100px_-45px_rgba(0,0,0,.38)]"><div className="rounded-[24px] overflow-hidden aspect-[1.07/1]"><img src={IMG.fleetAerial} alt="Private hire fleet" className="w-full h-full object-cover" /></div></div><div className="absolute -bottom-5 left-3 sm:left-0 w-[300px] rounded-[22px] bg-white border border-[#E4E1D9] shadow-lg p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.14em] text-[#0B6B4F] font-bold">Example</p><p className="font-heading font-bold text-[17px] mt-0.5">24 cars. One marketplace.</p></div><Car className="w-5 h-5 text-[#0B6B4F]" /></div><div className="mt-3 h-2 rounded-full bg-[#E8E5DE] overflow-hidden"><div className="h-full w-[72%] bg-[#0B6B4F] rounded-full" /></div><p className="mt-2 text-[11px] text-[#848A85]">The point is not more admin. It is more visibility.</p></div></motion.div>
        </div>
      </section>

      {/* Why operators */}
      <section className="bg-white border-b border-[#E7E4DD] py-16 sm:py-22">
        <div className="max-w-6xl mx-auto px-4 sm:px-6"><motion.div {...FADE} className="max-w-2xl mb-11"><Label>Why use a marketplace?</Label><h2 className="font-heading font-extrabold text-[35px] sm:text-[48px] leading-[1.03] tracking-[-0.035em]">Your cars already exist. Kharo gives them somewhere to be found.</h2><p className="mt-4 text-[16px] text-[#666E68] leading-relaxed">Operators often find drivers through referrals, repeat customers and informal groups. Those channels can work, but they are hard to scale and hard for a new driver to search.</p></motion.div><div className="grid md:grid-cols-2 gap-4">{OPERATOR_POINTS.map(({ icon: Icon, title, body }, i) => <motion.article key={title} {...FADE} transition={{ duration: .45, delay: i * .06 }} className="rounded-[24px] border border-[#E3E0D8] bg-[#FBFAF7] p-6 sm:p-7"><div className="w-11 h-11 rounded-2xl bg-[#E7F3ED] text-[#0B6B4F] flex items-center justify-center"><Icon className="w-5 h-5" /></div><h3 className="font-heading font-bold text-[20px] mt-6">{title}</h3><p className="text-[14px] sm:text-[15px] text-[#666E68] leading-relaxed mt-2.5">{body}</p></motion.article>)}</div></div>
      </section>

      {/* Flow */}
      <section className="py-16 sm:py-24"><div className="max-w-6xl mx-auto px-4 sm:px-6"><motion.div {...FADE} className="max-w-2xl mb-12"><Label>How it works</Label><h2 className="font-heading font-extrabold text-[36px] sm:text-[50px] leading-[1.02] tracking-[-0.035em]">From an empty space in your yard to a driver enquiry.</h2><p className="mt-4 text-[16px] text-[#666E68] leading-relaxed">Six simple steps. The marketplace handles the discovery. You stay in control of the rental.</p></motion.div><StepsTimeline /></div></section>

      {/* Listing preview */}
      <section className="bg-[#10231B] text-white py-16 sm:py-24 overflow-hidden"><div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[.86fr_1.14fr] gap-10 lg:gap-16 items-center"><motion.div {...FADE}><Label light>Your cars deserve better listings</Label><h2 className="font-heading font-extrabold text-[36px] sm:text-[49px] leading-[1.02] tracking-[-0.035em]">Give drivers enough information to make a serious enquiry.</h2><p className="mt-5 text-white/65 text-[16px] leading-relaxed max-w-xl">A good marketplace listing does not need a sales essay. It needs clear photos, the price, the location and the terms that matter.</p><div className="mt-7 space-y-3">{["Good exterior and interior photos", "Weekly rental shown clearly", "Mileage and location visible", "Deposit and other terms easy to understand"].map((x) => <div key={x} className="flex items-start gap-3 text-white/75 text-[14px] sm:text-[15px]"><Check className="w-4 h-4 text-[#6DE0B1] mt-1 shrink-0" />{x}</div>)}</div></motion.div><motion.div {...FADE}><DemoListing /></motion.div></div></section>

      {/* What to add */}
      <section className="bg-white border-y border-[#E6E3DB] py-16 sm:py-22"><div className="max-w-6xl mx-auto px-4 sm:px-6"><motion.div {...FADE} className="grid lg:grid-cols-[.72fr_1.28fr] gap-10 lg:gap-16 items-start"><div><Label>What goes on a listing</Label><h2 className="font-heading font-extrabold text-[35px] sm:text-[48px] leading-[1.03] tracking-[-0.035em]">Keep it simple. Give drivers the information they actually ask for.</h2><p className="mt-4 text-[15px] sm:text-[16px] text-[#666E68] leading-relaxed">The goal is not to make every vehicle sound perfect. The goal is to make it easy for the right driver to decide whether it is worth enquiring.</p></div><div className="grid sm:grid-cols-2 gap-3">{WHAT_TO_ADD.map(([title, body], i) => <div key={title} className="rounded-[20px] border border-[#E3E0D8] bg-[#FBFAF7] p-5"><span className="text-[11px] font-heading font-extrabold text-[#0B6B4F]">0{i + 1}</span><h3 className="font-heading font-bold text-[17px] mt-4">{title}</h3><p className="text-[13px] text-[#666E68] leading-relaxed mt-1.5">{body}</p></div>)}</div></motion.div></div></section>

      {/* Operator control */}
      <section className="py-16 sm:py-22 bg-[#F7F6F2]"><div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"><motion.div {...FADE}><div className="rounded-[28px] overflow-hidden aspect-[1.06/1]"><img src={IMG.showroom} alt="Vehicle showroom" className="w-full h-full object-cover" /></div></motion.div><motion.div {...FADE}><Label>You still run your business</Label><h2 className="font-heading font-extrabold text-[35px] sm:text-[48px] leading-[1.03] tracking-[-0.035em]">Kharo helps with discovery. You decide the rental.</h2><p className="mt-5 text-[16px] text-[#666E68] leading-relaxed">Your vehicles are still your vehicles. You set the price, deposit, mileage allowance and other rental terms. You decide whether a driver is right for the car.</p><div className="mt-7 grid gap-3"><div className="rounded-2xl bg-white border border-[#E3E0D8] p-4 flex gap-3"><ShieldCheck className="w-5 h-5 text-[#0B6B4F] mt-0.5" /><div><p className="font-semibold text-[14px]">Operator verification</p><p className="text-[13px] text-[#68706A] mt-1">We check the relevant operator information before vehicles go live.</p></div></div><div className="rounded-2xl bg-white border border-[#E3E0D8] p-4 flex gap-3"><MessageCircle className="w-5 h-5 text-[#0B6B4F] mt-0.5" /><div><p className="font-semibold text-[14px]">Direct conversation</p><p className="text-[13px] text-[#68706A] mt-1">The driver enquiry gives you a starting point for the conversation.</p></div></div><div className="rounded-2xl bg-white border border-[#E3E0D8] p-4 flex gap-3"><CircleDollarSign className="w-5 h-5 text-[#0B6B4F] mt-0.5" /><div><p className="font-semibold text-[14px]">You set the terms</p><p className="text-[13px] text-[#68706A] mt-1">The marketplace does not replace your rental agreement or commercial decisions.</p></div></div></div></motion.div></div></section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-22 border-y border-[#E6E3DB]"><div className="max-w-4xl mx-auto px-4 sm:px-6"><motion.div {...FADE} className="text-center max-w-2xl mx-auto mb-10"><Label>Questions operators ask</Label><h2 className="font-heading font-extrabold text-[35px] sm:text-[47px] tracking-[-0.03em]">The practical bits.</h2></motion.div><motion.div {...FADE} className="rounded-[24px] border border-[#E3E0D8] px-6 sm:px-8">{FAQS.map(([q, a]) => <Faq key={q} q={q} a={a} />)}</motion.div></div></section>

      {/* CTA */}
      <section className="bg-[#0B6B4F] text-white py-14 sm:py-18"><div className="max-w-5xl mx-auto px-4 sm:px-6 text-center"><motion.div {...FADE}><p className="text-[11px] uppercase tracking-[0.17em] text-[#A8EACF] font-bold">Ready to put your fleet in front of drivers?</p><h2 className="font-heading font-extrabold text-[36px] sm:text-[51px] leading-[1.02] tracking-[-0.035em] mt-3">List the cars you have available. Let drivers find them.</h2><p className="mt-4 text-white/70 text-[15px] sm:text-[16px] max-w-2xl mx-auto">Register your fleet with Kharo and help shape the marketplace as we expand across the UK.</p><div className="mt-8 flex justify-center flex-wrap gap-3"><button onClick={() => navigate("/list-your-fleet")} className="rounded-full bg-white text-[#0B6B4F] px-7 py-3.5 font-semibold hover:bg-[#EAF6F1] transition-colors">List your fleet</button><button onClick={() => navigate("/help")} className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors">Talk to us</button></div></motion.div></div></section>
    </main>
  );
}
