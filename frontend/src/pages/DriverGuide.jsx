import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  ChevronDown,
  Check,
  CircleHelp,
  FileCheck2,
  MapPin,
  PoundSterling,
  ShieldCheck,
  UserCheck,
  Wallet,
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
    title: "Find a car",
    body: "Search by city, area, vehicle type, fuel type and weekly budget. Open the listing and check the details before you register interest.",
    photo: IMG.driverMirror,
  },
  {
    num: "02",
    title: "Compare the details",
    body: "Look at the weekly rental, mileage allowance, deposit, vehicle information and any other terms the operator has provided.",
    photo: IMG.phoneInCar,
  },
  {
    num: "03",
    title: "Register your interest",
    body: "Found a car you like? Tell Kharo which vehicle you are interested in and when you want to start. Registering interest does not commit you to a rental.",
    photo: IMG.signingLaptop,
  },
  {
    num: "04",
    title: "Speak to the operator",
    body: "The operator reviews your enquiry and can confirm availability, answer questions and explain the rental terms before you decide whether to proceed.",
    photo: IMG.handshakeDesk,
  },
  {
    num: "05",
    title: "Complete the checks",
    body: "Once you decide to move forward, the required driver and vehicle checks are completed. The exact checks can depend on the operator and the rental.",
    photo: IMG.signingCouple,
  },
  {
    num: "06",
    title: "Agree the rental and collect the car",
    body: "Once the terms are agreed and everything is ready, arrange the handover with the operator and get on the road.",
    photo: IMG.keysHandover,
  },
];

const WHAT_TO_CHECK = [
  {
    icon: PoundSterling,
    title: "Weekly rental",
    body: "Make sure the weekly amount is clear and that you understand what is included.",
  },
  {
    icon: Wallet,
    title: "Deposit",
    body: "Ask how much the deposit is, when it is paid and when it is returned.",
  },
  {
    icon: Car,
    title: "Mileage",
    body: "Check the weekly or monthly mileage allowance and any charge for going over it.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance and cover",
    body: "Check whether insurance is separate or included and what breakdown or roadside cover applies.",
  },
  {
    icon: FileCheck2,
    title: "Rental terms",
    body: "Understand the minimum period, notice period, payment dates and what happens when you return the car.",
  },
  {
    icon: MapPin,
    title: "Collection",
    body: "Confirm where the car is collected, what documents you need and what condition the vehicle will be handed over in.",
  },
];

const REQUIREMENTS = [
  "A valid private hire driver licence for the area where you intend to work",
  "A driving licence that meets the operator and insurer requirements",
  "The right to work in the UK where required for your private hire work",
  "Any identification, driving or insurance information needed for the checks",
];

const FAQS = [
  {
    q: "Does registering interest mean I have rented the car?",
    a: "No. Registering interest simply tells Kharo and the operator that you want to discuss the vehicle. You only proceed once you have understood and agreed the rental terms.",
  },
  {
    q: "Do I pay Kharo to search for a car?",
    a: "No. Browsing and registering interest are free.",
  },
  {
    q: "Who sets the rental price?",
    a: "The vehicle operator sets the rental price and the other rental terms. Kharo displays the information provided for the listing.",
  },
  {
    q: "Can I contact the operator before deciding?",
    a: "Yes. The operator can confirm availability and explain the deposit, mileage, insurance and other terms before you decide whether to proceed.",
  },
  {
    q: "What checks will I need to complete?",
    a: "The checks depend on the rental and operator. They can include driver licence, identity, right-to-work and insurance-related information.",
  },
  {
    q: "What happens if I cannot find the right car?",
    a: "Register your interest and tell us what you are looking for. The more information you give us, the easier it is to understand what vehicles drivers want as Kharo opens more of the UK.",
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

export default function DriverGuide() {
  const navigate = useNavigate();

  useSeo({
    title: "Drivers Guide | How Kharo Works",
    description:
      "See how drivers can find, compare and register interest in private hire vehicles through the Kharo marketplace.",
  });

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111]">
      <section className="border-b border-[#E5E3DC] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-[1fr_.92fr] gap-10 lg:gap-16 items-center">
          <motion.div {...FADE}>
            <Label>Drivers guide</Label>
            <h1 className="font-heading font-extrabold text-[44px] sm:text-[62px] lg:text-[68px] leading-[0.97] tracking-[-0.045em] max-w-3xl">
              Looking for a private hire car? Start here.
            </h1>
            <p className="mt-6 text-[17px] sm:text-[19px] text-[#5D655F] leading-relaxed max-w-xl">
              Kharo is a marketplace for private hire vehicles. Search for a car,
              compare the details, register your interest and speak directly with
              the operator before you decide.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/search")}
                className="rounded-full bg-[#0B6B4F] text-white px-6 py-3.5 font-semibold inline-flex items-center gap-2 hover:bg-[#095B43] transition-colors"
              >
                Browse vehicles
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-full border border-[#D6D4CD] bg-white px-6 py-3.5 font-semibold hover:bg-[#F0EEE8] transition-colors"
              >
                Join the launch list
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              {[
                ["01", "Find", "Search the marketplace"],
                ["02", "Compare", "Check the key details"],
                ["03", "Connect", "Speak to the operator"],
              ].map(([n, title, body]) => (
                <div key={n} className="rounded-2xl border border-[#E3E1DA] bg-white p-4">
                  <span className="text-[11px] font-heading font-extrabold text-[#0B6B4F]">{n}</span>
                  <p className="mt-3 font-heading font-bold text-[14px]">{title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#7A817B]">{body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE} className="relative">
            <div className="rounded-[30px] overflow-hidden aspect-[4/5] bg-[#E5E1D8] shadow-[0_35px_80px_-35px_rgba(0,0,0,.34)]">
              <img
                src={IMG.taxiDriver}
                alt="Private hire driver in a car"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute left-5 right-5 bottom-5 sm:left-auto sm:right-5 sm:max-w-[270px] rounded-2xl border border-white/30 bg-[#10231B]/92 backdrop-blur-md text-white p-5">
              <div className="flex items-center gap-2 text-[#72D7B0]">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-[0.14em] font-bold">
                  Before you commit
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-white/80">
                Check the price, deposit, mileage, insurance and rental terms first.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b border-[#E6E4DE] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl mb-14">
            <Label>How it works</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[44px] leading-tight tracking-[-0.03em]">
              From finding a car to getting the keys.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#666D68]">
              The process is designed to be easy to follow. You can look around
              first and decide later.
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

      <section className="py-16 sm:py-20 bg-[#F7F6F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl">
            <Label>Before you say yes</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] leading-tight">
              These are the details worth checking.
            </h2>
            <p className="mt-4 text-[16px] text-[#666D68] leading-relaxed">
              Every operator can set its own rental terms. Ask questions until
              you know exactly what you are agreeing to.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {WHAT_TO_CHECK.map(({ icon: Icon, title, body }, i) => (
              <motion.article
                key={title}
                {...FADE}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="rounded-[22px] border border-[#E2E0D9] bg-white p-6"
              >
                <Icon className="w-5 h-5 text-[#0B6B4F] mb-5" />
                <h3 className="font-heading font-bold text-[18px]">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#646B66]">
                  {body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10231B] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.1fr_.9fr] gap-10 lg:gap-16 items-start">
          <motion.div {...FADE}>
            <Label light>What you will need</Label>
            <h2 className="font-heading font-extrabold text-[34px] sm:text-[44px] leading-tight tracking-[-0.03em]">
              Get the basics ready.
            </h2>
            <p className="mt-4 text-white/65 text-[15px] sm:text-[16px] leading-relaxed max-w-xl">
              The exact requirements can vary by operator, vehicle and insurance.
              This is the usual starting point.
            </p>

            <div className="mt-8 space-y-4">
              {REQUIREMENTS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#65D2A4] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-[14px] sm:text-[15px] text-white/78 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE} className="rounded-[25px] border border-white/10 bg-white/[0.045] p-6 sm:p-7">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
              <UserCheck className="w-5 h-5 text-[#65D2A4]" />
            </div>
            <h3 className="font-heading font-bold text-[21px]">Your application is not a commitment</h3>
            <p className="mt-3 text-[14px] text-white/65 leading-relaxed">
              Registering interest tells us which car you want. You still get the
              chance to speak with the operator, understand the terms and decide
              whether the rental is right for you.
            </p>
            <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
              <CircleHelp className="w-4 h-4 text-[#65D2A4] shrink-0 mt-0.5" />
              <p className="text-[13px] text-white/55 leading-relaxed">
                Never pay a deposit or sign a rental agreement until you are
                comfortable with the terms and know who the agreement is with.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 border-y border-[#E6E4DE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="text-center">
            <Label>Questions drivers ask</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] tracking-[-0.025em]">
              Before you register
            </h2>
          </motion.div>

          <motion.div
            {...FADE}
            className="mt-10 rounded-[22px] border border-[#E2E0D9] bg-white px-5 sm:px-7"
          >
            {FAQS.map((faq) => (
              <Faq key={faq.q} {...faq} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#0B6B4F] text-white py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...FADE}>
            <h2 className="font-heading font-extrabold text-[34px] sm:text-[46px] leading-tight tracking-[-0.03em]">
              Ready to find your next car?
            </h2>
            <p className="mt-4 text-white/70 text-[15px] sm:text-[16px]">
              Browse the Kharo marketplace and see what is available in your area.
            </p>
            <div className="mt-8 flex justify-center flex-wrap gap-3">
              <button
                onClick={() => navigate("/search")}
                className="rounded-full bg-white text-[#0B6B4F] px-7 py-3.5 font-semibold hover:bg-[#EAF5F1] transition-colors inline-flex items-center gap-2"
              >
                Browse vehicles
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors"
              >
                Join the launch list
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
