import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  ChevronRight,
  CircleDollarSign,
  Handshake,
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

const MARKETPLACE_BENEFITS = [
  {
    icon: Search,
    title: "Search in one place",
    body: "Drivers can look by area, vehicle type, fuel type and weekly budget instead of jumping between adverts and group chats.",
  },
  {
    icon: CircleDollarSign,
    title: "See the important numbers",
    body: "Each listing gives drivers a clearer view of the weekly rental, vehicle details, mileage allowance and other terms before they register interest.",
  },
  {
    icon: BadgeCheck,
    title: "Know who you are dealing with",
    body: "Kharo checks rental operators and the relevant licensing information before vehicles are listed on the marketplace.",
  },
  {
    icon: Handshake,
    title: "Connect directly",
    body: "Kharo introduces the two sides. The driver and operator then discuss availability and the final rental terms directly.",
  },
];

const DRIVER_POINTS = [
  "More vehicles to compare",
  "Less time searching through informal adverts",
  "Clearer information before you make an enquiry",
  "One place to register interest in the cars you want",
];

const OPERATOR_POINTS = [
  "Put available vehicles in front of drivers who are looking",
  "Show your cars with consistent photos and information",
  "Receive enquiries without relying only on word of mouth",
  "Give your fleet a proper online shop window",
];

const TRUST_POINTS = [
  "Operator and vehicle information checked before listing",
  "Clear listing information instead of vague adverts",
  "A simple enquiry process with no payment just to register interest",
  "Final rental terms are agreed before the driver commits",
];

function Label({ children, light = false }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-3 ${
        light ? "text-[#72D7B0]" : "text-[#0B6B4F]"
      }`}
    >
      {children}
    </p>
  );
}

function BenefitCard({ icon: Icon, title, body }) {
  return (
    <article className="rounded-[22px] border border-[#E4E2DB] bg-[#FCFBF8] p-6 sm:p-7">
      <div className="w-11 h-11 rounded-2xl bg-[#E6F2ED] text-[#0B6B4F] flex items-center justify-center mb-5">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <h3 className="font-heading font-bold text-[19px] text-[#111]">{title}</h3>
      <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-[#626963]">
        {body}
      </p>
    </article>
  );
}

function BulletList({ items, light = false }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-3 text-[14px] sm:text-[15px] leading-relaxed ${
            light ? "text-white/72" : "text-[#5E6661]"
          }`}
        >
          <span
            className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
              light ? "bg-[#65D2A4]" : "bg-[#0B6B4F]"
            }`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function WhyKharo() {
  const navigate = useNavigate();

  useSeo({
    title: "Why Kharo | Private Hire Vehicle Marketplace",
    description:
      "Kharo is building a marketplace for private hire vehicles, bringing drivers and rental operators together in one place.",
  });

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111]">
      <section className="border-b border-[#E5E3DC] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-[1.02fr_.98fr] gap-10 lg:gap-16 items-center">
          <motion.div {...FADE}>
            <Label>The private hire marketplace</Label>
            <h1 className="font-heading font-extrabold text-[44px] sm:text-[62px] lg:text-[70px] leading-[0.97] tracking-[-0.045em] text-balance max-w-3xl">
              Finding a private hire car should be easier.
            </h1>
            <p className="mt-6 text-[17px] sm:text-[19px] leading-relaxed text-[#5C655F] max-w-xl">
              Kharo brings private hire drivers and vehicle operators together
              in one marketplace. Search for a car, compare the details and
              register your interest without chasing adverts across the internet.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/search")}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B6B4F] px-6 py-3.5 text-white font-semibold hover:bg-[#095B43] transition-colors"
              >
                Browse vehicles
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/list-your-fleet")}
                className="inline-flex items-center gap-2 rounded-full border border-[#D7D5CE] bg-white px-6 py-3.5 text-[#151515] font-semibold hover:bg-[#F0EEE8] transition-colors"
              >
                List your fleet
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#7B817D]">
              <span>For private hire drivers</span>
              <span>For rental operators</span>
              <span>Built for the UK market</span>
            </div>
          </motion.div>

          <motion.div {...FADE} className="relative">
            <div className="rounded-[30px] overflow-hidden aspect-[4/3] bg-[#E6E2D9] shadow-[0_35px_80px_-35px_rgba(0,0,0,.32)]">
              <img
                src={IMG.fleetLot}
                alt="Private hire vehicles in a fleet"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute left-5 right-5 sm:left-7 sm:right-auto -bottom-5 sm:max-w-[320px] rounded-2xl border border-[#E5E3DC] bg-white shadow-[0_18px_40px_-20px_rgba(0,0,0,.28)] px-5 py-4">
              <div className="flex items-center gap-2 text-[#0B6B4F]">
                <Users className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-[0.14em] font-bold">
                  Two sides, one marketplace
                </span>
              </div>
              <p className="mt-1.5 font-heading font-bold text-[17px] leading-snug">
                Drivers find cars. Operators find drivers.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 border-b border-[#E6E4DE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl mb-12">
            <Label>What Kharo changes</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[44px] leading-tight tracking-[-0.03em]">
              A fragmented market needs one proper place to search.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#646B66]">
              Private hire cars are often advertised through Facebook groups,
              WhatsApp, word of mouth and individual rental websites. Kharo brings
              the listings together so drivers can compare their options and
              operators can reach people already looking for a car.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {MARKETPLACE_BENEFITS.map((item, i) => (
              <motion.div
                key={item.title}
                {...FADE}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <BenefitCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10231B] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl mb-12">
            <Label light>One marketplace, two sides</Label>
            <h2 className="font-heading font-extrabold text-[34px] sm:text-[48px] leading-[1.02] tracking-[-0.035em]">
              Give both sides a better way to find each other.
            </h2>
            <p className="mt-5 text-white/65 text-[16px] leading-relaxed">
              Kharo is not just another place to post an advert. The point is to
              make the search easier for drivers and the supply side easier for
              operators.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5">
            <motion.div
              {...FADE}
              className="rounded-[26px] border border-white/10 bg-white/[0.045] p-7 sm:p-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <CarFront className="w-6 h-6 text-[#65D2A4]" />
              </div>
              <h3 className="font-heading font-bold text-[23px]">For drivers</h3>
              <p className="mt-2.5 text-white/60 text-[15px] leading-relaxed max-w-lg">
                Search for the vehicle that fits your work, your area and your
                budget without contacting ten different people first.
              </p>
              <div className="mt-6">
                <BulletList items={DRIVER_POINTS} light />
              </div>
              <button
                onClick={() => navigate("/driver-guide")}
                className="mt-8 inline-flex items-center gap-2 text-[#72D7B0] font-semibold text-[14px]"
              >
                See how it works
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              {...FADE}
              transition={{ delay: 0.08 }}
              className="rounded-[26px] border border-white/10 bg-white/[0.045] p-7 sm:p-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Handshake className="w-6 h-6 text-[#65D2A4]" />
              </div>
              <h3 className="font-heading font-bold text-[23px]">For operators</h3>
              <p className="mt-2.5 text-white/60 text-[15px] leading-relaxed max-w-lg">
                Put your available private hire vehicles in front of drivers who
                are actively looking, rather than waiting for the next referral.
              </p>
              <div className="mt-6">
                <BulletList items={OPERATOR_POINTS} light />
              </div>
              <button
                onClick={() => navigate("/operator-guide")}
                className="mt-8 inline-flex items-center gap-2 text-[#72D7B0] font-semibold text-[14px]"
              >
                See the operator guide
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#F7F6F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-16 items-center">
            <div className="relative">
              <div className="rounded-[28px] overflow-hidden aspect-[4/5] bg-[#E5E2D9]">
                <img
                  src={IMG.phoneInCar}
                  alt="Driver looking at their phone inside a car"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-3 sm:right-5 rounded-2xl bg-white border border-[#E4E2DB] shadow-lg px-5 py-4 max-w-[235px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#0B6B4F] font-bold">
                  The simple idea
                </p>
                <p className="font-heading font-bold text-[17px] leading-snug mt-1">
                  Less searching. More useful enquiries.
                </p>
              </div>
            </div>

            <div>
              <Label>How Kharo works</Label>
              <h2 className="font-heading font-extrabold text-[34px] sm:text-[46px] leading-[1.03] tracking-[-0.03em]">
                Browse, register, connect.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-[#646B66] max-w-xl">
                The marketplace is deliberately simple. Kharo helps the two sides
                find each other. The final vehicle, price, deposit, mileage and
                rental terms are understood before the driver agrees to proceed.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  ["01", "Browse", "Search vehicles by city, area, vehicle type, fuel and budget."],
                  ["02", "Register interest", "Tell us which vehicle you want and when you are looking to start."],
                  ["03", "Connect", "The operator reviews the enquiry, confirms the details and speaks with you directly."],
                ].map(([num, title, body]) => (
                  <div key={num} className="flex gap-4 rounded-2xl border border-[#E2E0D9] bg-white p-5">
                    <span className="font-heading font-extrabold text-[13px] text-[#0B6B4F] mt-0.5">
                      {num}
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-[17px]">{title}</h3>
                      <p className="mt-1.5 text-[14px] text-[#666D68] leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-y border-[#E6E4DE] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="text-center max-w-2xl mx-auto">
            <Label>Built around trust</Label>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] tracking-[-0.025em]">
              Clearer listings. Clearer conversations.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#666D68]">
              Trust on a marketplace comes from making the important information
              easy to see. Kharo is designed around that principle.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {TRUST_POINTS.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-[#E3E1DA] bg-[#FBFAF7] p-5"
              >
                <ShieldCheck className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" />
                <p className="text-[14px] sm:text-[15px] text-[#505852] leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B6B4F] text-white py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...FADE}>
            <h2 className="font-heading font-extrabold text-[33px] sm:text-[46px] leading-tight tracking-[-0.03em]">
              Looking for a car or ready to list one?
            </h2>
            <p className="mt-4 text-white/70 text-[15px] sm:text-[16px] max-w-2xl mx-auto">
              Browse the marketplace as a driver or put your private hire fleet in
              front of people looking for a vehicle.
            </p>
            <div className="mt-8 flex justify-center flex-wrap gap-3">
              <button
                onClick={() => navigate("/search")}
                className="rounded-full bg-white text-[#0B6B4F] px-7 py-3.5 font-semibold hover:bg-[#EAF5F1] transition-colors"
              >
                Browse vehicles
              </button>
              <button
                onClick={() => navigate("/list-your-fleet")}
                className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors"
              >
                List your fleet
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
