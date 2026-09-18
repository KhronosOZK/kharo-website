import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  ChevronDown,
  Check,
  CircleDollarSign,
  FileCheck2,
  Image,
  MessageCircle,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSeo } from "@/lib/seo";
import { IMG } from "@/lib/images";

const FADE = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

const STEPS = [
  {
    num: "01",
    title: "Tell us about your fleet",
    body: "Register your interest and give us the basics: your company, where you operate and how many private hire vehicles you want to list.",
    photo: IMG.fleetLot,
  },
  {
    num: "02",
    title: "Get your operator details checked",
    body: "We review the information needed to set up your operator profile and confirm the relevant licensing details before your vehicles go live.",
    photo: IMG.handshakeDesk,
  },
  {
    num: "03",
    title: "Add your vehicles",
    body: "Give each car its own listing with photos, weekly rental, mileage allowance, location, fuel type and the information a driver needs before making an enquiry.",
    photo: IMG.rowCars,
  },
  {
    num: "04",
    title: "Drivers find your cars",
    body: "Drivers can discover your vehicles while searching the marketplace by location, vehicle type, fuel and budget.",
    photo: IMG.phoneInCar,
  },
  {
    num: "05",
    title: "Receive the enquiry",
    body: "When a driver registers interest, you receive the enquiry and can speak with them directly about availability, deposit, mileage and the rest of the rental terms.",
    photo: IMG.handshakeSmile,
  },
  {
    num: "06",
    title: "Agree the rental and hand over the car",
    body: "Once you are happy with the driver and the terms are agreed, arrange the handover and get the vehicle earning.",
    photo: IMG.keysHandover,
  },
];

const BENEFITS = [
  {
    icon: Users,
    title: "Reach drivers who are already looking",
    body: "Put your vehicles in front of people actively searching for a private hire car instead of relying only on referrals.",
  },
  {
    icon: Search,
    title: "Give your fleet a proper shop window",
    body: "Every vehicle gets a clear listing with the information drivers need to compare it with other cars.",
  },
  {
    icon: MessageCircle,
    title: "Better quality enquiries",
    body: "Drivers can see the basic information before contacting you, so the conversation starts further along.",
  },
  {
    icon: CircleDollarSign,
    title: "Turn idle vehicles into enquiries",
    body: "When a car is available, make it visible. More visibility means more chances to find the right renter.",
  },
];

const WHAT_TO_LIST = [
  ["Vehicle details", "Make, model, year, fuel type and private hire licensing information."],
  ["Price and terms", "Weekly rental, mileage allowance, deposit and any minimum period or important conditions."],
  ["Photos", "Clear exterior and interior photographs so drivers know exactly what they are looking at."],
  ["Location", "Where the vehicle is based and where the driver can collect it."],
];

const FAQS = [
  {
    q: "Does it cost anything to register my fleet?",
    a: "You can register your interest and discuss joining Kharo without paying a listing fee. Any future marketplace fees will be set out clearly before you use the service.",
  },
  {
    q: "What type of vehicles can I list?",
    a: "Kharo is focused on licensed private hire vehicles. Exact vehicle and licensing requirements can depend on the area where the vehicle operates.",
  },
  {
    q: "Who decides the rental price?",
    a: "You do. Operators set the weekly rental and their own rental terms. Kharo provides the marketplace and displays the information you provide.",
  },
  {
    q: "Can I choose which drivers I rent to?",
    a: "Yes. Kharo can help with the marketplace enquiry and required checks, but the operator should understand the driver's circumstances and agree the final rental before handover.",
  },
  {
    q: "What happens after a driver registers interest?",
    a: "You receive the enquiry and can contact the driver to confirm the vehicle is available, discuss the deposit and other terms, and decide whether to proceed.",
  },
  {
    q: "Can I list more than one car?",
    a: "Yes. Kharo is designed for operators with fleets as well as operators with a small number of vehicles.",
  },
];

function Faq({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#ECEAE4] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-[15px] sm:text-[16px] text-[#151515]">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#898E89] shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="text-[14px] sm:text-[15px] text-[#606761] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function Label({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0B6B4F] mb-3">
      {children}
    </p>
  );
}

export default function OperatorGuide() {
  const navigate = useNavigate();

  useSeo({
    title: "Operator Guide | List Your Private Hire Fleet on Kharo",
    description:
      "See how private hire vehicle operators can list their fleet, reach drivers and manage enquiries through the Kharo marketplace.",
  });

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111]">
      <section className="border-b border-[#E5E3DC] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-[1fr_.92fr] gap-10 lg:gap-16 items-center">
          <motion.div {...FADE}>
            <Label>For operators</Label>
            <h1 className="font-heading font-extrabold text-[44px] sm:text-[62px] lg:text-[68px] leading-[0.97] tracking-[-0.045em] max-w-3xl">
              Got private hire cars sitting unused?
            </h1>
            <p className="mt-6 text-[17px] sm:text-[19px] text-[#5D655F] leading-relaxed max-w-xl">
              Put your vehicles in front of drivers who are looking for a private
              hire car. Kharo gives your fleet a simple marketplace presence and
              brings the enquiry to you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/list-your-fleet")}
                className="rounded-full bg-[#0B6B4F] text-white px-6 py-3.5 font-semibold inline-flex items-center gap-2 hover:bg-[#095B43] transition-colors"
              >
                List your fleet
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/help")}
                className="rounded-full border border-[#D6D4CD] bg-white px-6 py-3.5 font-semibold hover:bg-[#F0EEE8] transition-colors"
              >
                Ask a question
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#7B817D]">
              <span>Small operators welcome</span>
              <span>Fleet operators welcome</span>
              <span>UK private hire focused</span>
            </div>
          </motion.div>

          <motion.div {...FADE} className="relative">
            <div className="rounded-[30px] overflow-hidden aspect-[4/3] bg-[#E4E0D7] shadow-[0_35px_80px_-35px_rgba(0,0,0,.34)]">
              <img
                src={IMG.fleetAerial}
                alt="A fleet of private hire vehicles"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute left-5 bottom-5 sm:left-auto sm:right-5 rounded-2xl border border-white/30 bg-[#10231B]/92 backdrop-blur-md text-white p-5 max-w-[290px]">
              <div className="flex items-center gap-2 text-[#72D7B0]">
                <Car className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-[0.14em] font-bold">
                  Your fleet
                </span>
              </div>
              <p className="mt-2 font-heading font-bold text-[17px] leading-snug">
                Your cars. Your price. Your rental terms.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b border-[#E6E4DE] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl mb-12">
            <Label>Why list on Kharo</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[44px] leading-tight tracking-[-0.03em]">
              More visibility for the cars you want to rent out.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#666D68]">
              The marketplace gives operators another route to drivers. Instead of
              depending only on WhatsApp, Facebook, referrals and repeat customers,
              your available vehicles have a place drivers can search.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <motion.article
                key={title}
                {...FADE}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-[22px] border border-[#E4E2DB] bg-[#FCFBF8] p-6 sm:p-7"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#E6F2ED] text-[#0B6B4F] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-[19px]">{title}</h3>
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-[#626963]">
                  {body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#F7F6F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl mb-14">
            <Label>How it works</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[44px] leading-tight tracking-[-0.03em]">
              From your first enquiry to your first driver.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#666D68]">
              The goal is straightforward: make your available vehicles easy to
              discover, then bring the driver enquiry back to you.
            </p>
          </motion.div>

          <div className="space-y-16 sm:space-y-20">
            {STEPS.map((step, i) => (
              <motion.article
                key={step.num}
                {...FADE}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className={`grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-14 items-center ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative">
                  <span
                    className="absolute -top-8 -left-2 font-heading font-extrabold text-[96px] leading-none text-[#0B6B4F]/[0.07] select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {step.num}
                  </span>
                  <div className="relative rounded-[26px] overflow-hidden aspect-[16/10] bg-[#E7E4DB]">
                    <img
                      src={step.photo}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="max-w-xl">
                  <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#0B6B4F]">
                    Step {step.num}
                  </span>
                  <h3 className="mt-2 font-heading font-bold text-[27px] sm:text-[31px] tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-[16px] text-[#626963] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 border-y border-[#E6E4DE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[.95fr_1.05fr] gap-10 lg:gap-16 items-center">
          <motion.div {...FADE}>
            <Label>What to put in a listing</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] leading-tight tracking-[-0.025em]">
              Give drivers enough information to make a decision.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#666D68]">
              Good listings reduce unnecessary calls and help the right drivers
              find the right car.
            </p>

            <div className="mt-8 space-y-3">
              {WHAT_TO_LIST.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[#E3E1DA] bg-[#FBFAF7] p-5">
                  <p className="font-heading font-bold text-[16px]">{title}</p>
                  <p className="mt-1.5 text-[14px] text-[#666D68] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE} className="relative">
            <div className="rounded-[28px] overflow-hidden aspect-[4/5] bg-[#E4E1D8]">
              <img
                src={IMG.showroom}
                alt="Vehicles displayed in a showroom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 backdrop-blur border border-white shadow-xl p-5">
              <div className="flex items-center gap-2 text-[#0B6B4F]">
                <Image className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-[0.14em] font-bold">
                  Good listing, better enquiry
                </span>
              </div>
              <p className="mt-2 text-[14px] text-[#4F5852] leading-relaxed">
                Clear photographs and clear terms make it easier for a driver to
                understand what you are offering before they contact you.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#F7F6F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="text-center max-w-2xl mx-auto">
            <Label>Trust works both ways</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] tracking-[-0.025em]">
              A marketplace is only useful when both sides know what happens next.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#666D68]">
              Kharo helps structure the enquiry. You still decide whether the
              driver and the rental terms are right for your vehicle.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {[
              ["Operator checks", "We review the relevant operator and licensing information before vehicles are listed."],
              ["Driver information", "Drivers can understand the vehicle and rental terms before they register interest."],
              ["Direct conversation", "You can speak with the driver and confirm the final details before agreeing the rental."],
              ["Clear responsibility", "The final rental agreement is between the driver and operator, with the terms understood before handover."],
            ].map(([title, body], i) => (
              <motion.div
                key={title}
                {...FADE}
                transition={{ delay: i * 0.06 }}
                className="rounded-[22px] border border-[#E3E1DA] bg-white p-6"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  {i === 0 ? (
                    <BadgeCheck className="w-5 h-5 text-[#0B6B4F]" />
                  ) : i === 1 ? (
                    <ShieldCheck className="w-5 h-5 text-[#0B6B4F]" />
                  ) : i === 2 ? (
                    <MessageCircle className="w-5 h-5 text-[#0B6B4F]" />
                  ) : (
                    <FileCheck2 className="w-5 h-5 text-[#0B6B4F]" />
                  )}
                  <h3 className="font-heading font-bold text-[17px]">{title}</h3>
                </div>
                <p className="text-[14px] leading-relaxed text-[#646B66]">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B6B4F] text-white py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...FADE}>
            <h2 className="font-heading font-extrabold text-[34px] sm:text-[46px] leading-tight tracking-[-0.03em]">
              Have vehicles ready to rent?
            </h2>
            <p className="mt-4 text-white/70 text-[15px] sm:text-[16px]">
              Register your fleet with Kharo and help drivers find your vehicles.
            </p>
            <div className="mt-8 flex justify-center flex-wrap gap-3">
              <button
                onClick={() => navigate("/list-your-fleet")}
                className="rounded-full bg-white text-[#0B6B4F] px-7 py-3.5 font-semibold hover:bg-[#EAF5F1] transition-colors inline-flex items-center gap-2"
              >
                List your fleet
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/help")}
                className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors"
              >
                Talk to us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
