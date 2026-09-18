import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Check,
  ChevronRight,
  CircleDollarSign,
  Handshake,
  MapPin,
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

const MARKETPLACE_CARDS = [
  {
    image: "/images/listings/toyota-prius.jpg",
    name: "Toyota Prius",
    place: "Southwark, London",
    price: "£175 / week",
    tag: "Hybrid",
  },
  {
    image: "/images/listings/skoda-octavia.jpg",
    name: "Skoda Octavia",
    place: "Leeds",
    price: "£165 / week",
    tag: "Diesel",
  },
  {
    image: "/images/listings/toyota-corolla.jpg",
    name: "Toyota Corolla",
    place: "Birmingham",
    price: "£180 / week",
    tag: "Hybrid",
  },
];

const DRIVER_BENEFITS = [
  "Search cars in one place",
  "Compare by location, vehicle and budget",
  "See the important rental details before enquiring",
  "Register interest without chasing adverts around",
];

const OPERATOR_BENEFITS = [
  "Put available cars in front of drivers who are looking",
  "Show each vehicle with clear photos and details",
  "Receive enquiries without relying only on word of mouth",
  "Build a stronger online presence for your fleet",
];

const TRUST_POINTS = [
  {
    icon: BadgeCheck,
    title: "Operators are checked",
    body: "We check the operator information and relevant licensing details before vehicles are listed.",
  },
  {
    icon: CircleDollarSign,
    title: "Prices are easier to compare",
    body: "The weekly rental is shown on the vehicle listing, alongside the information you need to ask the right questions.",
  },
  {
    icon: Handshake,
    title: "The two sides can speak",
    body: "Kharo brings the driver and operator together. The final rental terms are discussed before anyone commits.",
  },
  {
    icon: ShieldCheck,
    title: "The process is explained",
    body: "Drivers can see what happens next instead of having to work it out through a chain of messages.",
  },
];

const AREAS = ["London", "Birmingham", "Manchester", "Leeds", "Sheffield", "More cities to come"];

function Label({ children, light = false }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.17em] mb-3 ${
        light ? "text-[#6DE0B1]" : "text-[#0B6B4F]"
      }`}
    >
      {children}
    </p>
  );
}

function ListingCard({ image, name, place, price, tag }) {
  return (
    <div className="rounded-[22px] overflow-hidden bg-white border border-[#E5E3DC] shadow-[0_16px_45px_-25px_rgba(0,0,0,.28)]">
      <div className="relative aspect-[1.35/1] bg-[#ECE9E1]">
        <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#1E2A24]">
          {tag}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-[17px] text-[#111]">{name}</h3>
            <p className="text-[12px] text-[#777D78] mt-0.5">{place}</p>
          </div>
          <p className="font-heading font-extrabold text-[15px] text-[#111] whitespace-nowrap">{price}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#ECEAE4] flex items-center justify-between text-[11px] text-[#818681]">
          <span>Weekly rental</span>
          <span className="text-[#0B6B4F] font-semibold">View car</span>
        </div>
      </div>
    </div>
  );
}

function BulletList({ items, dark = false }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 text-[14px] sm:text-[15px] leading-relaxed ${dark ? "text-white/72" : "text-[#555D57]"}`}>
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dark ? "bg-[#64D5A7]" : "bg-[#0B6B4F]"}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function WhyKharo() {
  const navigate = useNavigate();

  useSeo({
    title: "Why Kharo | UK Private Hire Vehicle Marketplace",
    description:
      "Kharo is a marketplace for private hire vehicles, helping drivers find cars and operators reach drivers looking to rent.",
  });

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#111]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
          <motion.div {...FADE} className="grid lg:grid-cols-[1.02fr_.98fr] gap-10 lg:gap-16 items-center">
            <div>
              <Label>The private hire marketplace</Label>
              <h1 className="font-heading font-extrabold text-[45px] sm:text-[62px] lg:text-[76px] leading-[0.95] tracking-[-0.05em] max-w-3xl">
                Find the car.
                <br />
                Find the driver.
                <br />
                <span className="text-[#0B6B4F]">Find each other.</span>
              </h1>
              <p className="mt-7 text-[17px] sm:text-[19px] text-[#5D655F] leading-relaxed max-w-xl">
                Private hire cars are spread across rental companies, Facebook groups, WhatsApp chats and individual websites. Kharo brings the market into one place.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/search")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0B6B4F] text-white px-6 py-3.5 font-semibold text-[15px] hover:bg-[#095B43] transition-colors"
                >
                  Browse vehicles
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/list-your-fleet")}
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D7D4CC] px-6 py-3.5 font-semibold text-[15px] hover:bg-[#F0EEE8] transition-colors"
                >
                  List your fleet
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#7A807B]">
                {AREAS.map((area) => (
                  <span key={area} className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#0B6B4F]" />
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div className="absolute -top-5 -right-3 sm:right-0 w-36 h-36 rounded-full bg-[#CFEFE0] blur-3xl opacity-60" />
              <div className="relative rounded-[30px] bg-[#E8E5DD] p-3 sm:p-4 shadow-[0_35px_100px_-45px_rgba(0,0,0,.4)]">
                <div className="rounded-[24px] overflow-hidden aspect-[1.02/1]">
                  <img src={IMG.rowCars} alt="A row of private hire vehicles" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="hidden sm:block absolute -left-7 bottom-10 w-[290px] rounded-[22px] bg-white border border-[#E4E1D9] shadow-[0_28px_55px_-30px_rgba(0,0,0,.32)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#0B6B4F] font-bold">Kharo marketplace</p>
                    <p className="font-heading font-bold text-[17px] mt-0.5">Cars drivers can actually compare</p>
                  </div>
                  <Search className="w-5 h-5 text-[#0B6B4F]" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MARKETPLACE_CARDS.map((card) => (
                    <img key={card.name} src={card.image} alt="" className="w-full aspect-square object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The market problem */}
      <section className="bg-white border-b border-[#E7E4DD] py-16 sm:py-22">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="grid lg:grid-cols-[.72fr_1.28fr] gap-10 lg:gap-20 items-start">
            <div>
              <Label>Why build this?</Label>
              <h2 className="font-heading font-extrabold text-[34px] sm:text-[46px] leading-[1.03] tracking-[-0.035em]">
                The cars are there. The drivers are there. Finding the right match is the problem.
              </h2>
            </div>
            <div>
              <p className="text-[16px] sm:text-[18px] text-[#606762] leading-relaxed max-w-2xl">
                A driver can spend hours asking around for a suitable rental. At the same time, an operator can have perfectly usable vehicles sitting still while waiting for the next driver.
              </p>
              <p className="mt-5 text-[16px] sm:text-[18px] text-[#606762] leading-relaxed max-w-2xl">
                Kharo is built to make that search more organised. Drivers get a place to look. Operators get a place to list. Both sides get a clearer route from first enquiry to a rental.
              </p>
              <div className="mt-8 grid sm:grid-cols-3 gap-3">
                {[
                  ["01", "Search", "Drivers start with the vehicle they need."],
                  ["02", "Compare", "The useful details sit together."],
                  ["03", "Connect", "The two sides can then speak directly."],
                ].map(([n, title, body]) => (
                  <div key={n} className="rounded-2xl bg-[#F7F6F2] border border-[#E5E2DA] p-5">
                    <span className="text-[11px] font-heading font-extrabold text-[#0B6B4F]">{n}</span>
                    <h3 className="font-heading font-bold text-[19px] mt-4">{title}</h3>
                    <p className="text-[13px] text-[#69706A] leading-relaxed mt-1.5">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marketplace visual */}
      <section className="py-16 sm:py-24 bg-[#F7F6F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="flex items-end justify-between gap-6 mb-10">
            <div>
              <Label>What the marketplace feels like</Label>
              <h2 className="font-heading font-extrabold text-[34px] sm:text-[48px] leading-tight tracking-[-0.035em]">
                Search less. See more.
              </h2>
              <p className="mt-3 text-[15px] sm:text-[17px] text-[#666E68] max-w-2xl leading-relaxed">
                Instead of starting with a phone number and a conversation, start with the car you actually want.
              </p>
            </div>
            <button onClick={() => navigate("/search")} className="hidden sm:inline-flex items-center gap-2 text-[#0B6B4F] font-semibold text-[14px] shrink-0">
              Browse the marketplace <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {MARKETPLACE_CARDS.map((card, i) => (
              <motion.div key={card.name} {...FADE} transition={{ duration: 0.45, delay: i * 0.07 }}>
                <ListingCard {...card} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-sided marketplace */}
      <section className="bg-[#10231B] text-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-3xl">
            <Label light>One marketplace. Two sides.</Label>
            <h2 className="font-heading font-extrabold text-[36px] sm:text-[54px] leading-[1] tracking-[-0.04em]">
              Kharo only works when it works for both sides.
            </h2>
            <p className="mt-5 text-white/65 text-[16px] sm:text-[18px] leading-relaxed">
              The aim is simple. Give drivers more choice and give operators a better way to reach them.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5 mt-10">
            <motion.div {...FADE} className="rounded-[28px] overflow-hidden bg-[#172E24] border border-white/10">
              <div className="aspect-[1.7/1] overflow-hidden">
                <img src={IMG.happyDriver} alt="Private hire driver inside a car" className="w-full h-full object-cover" />
              </div>
              <div className="p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center"><Users className="w-5 h-5 text-[#6DE0B1]" /></div>
                  <div><p className="text-[11px] uppercase tracking-[0.14em] text-[#6DE0B1] font-bold">For drivers</p><h3 className="font-heading font-bold text-[25px]">Find your next car</h3></div>
                </div>
                <p className="text-white/65 text-[15px] leading-relaxed mt-5 max-w-xl">A simpler way to find a private hire vehicle that fits where you work and what you can afford.</p>
                <div className="mt-6"><BulletList items={DRIVER_BENEFITS} dark /></div>
                <button onClick={() => navigate("/driver-guide")} className="mt-8 inline-flex items-center gap-2 text-[#73DDB0] font-semibold text-[14px]">Read the driver guide <ChevronRight className="w-4 h-4" /></button>
              </div>
            </motion.div>

            <motion.div {...FADE} transition={{ delay: 0.08 }} className="rounded-[28px] overflow-hidden bg-[#172E24] border border-white/10">
              <div className="aspect-[1.7/1] overflow-hidden">
                <img src={IMG.fleetLot} alt="Private hire fleet waiting for drivers" className="w-full h-full object-cover" />
              </div>
              <div className="p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center"><CarFront className="w-5 h-5 text-[#6DE0B1]" /></div>
                  <div><p className="text-[11px] uppercase tracking-[0.14em] text-[#6DE0B1] font-bold">For operators</p><h3 className="font-heading font-bold text-[25px]">Put your cars to work</h3></div>
                </div>
                <p className="text-white/65 text-[15px] leading-relaxed mt-5 max-w-xl">A clearer online home for vehicles that are available to rent and a way to reach drivers beyond the usual channels.</p>
                <div className="mt-6"><BulletList items={OPERATOR_BENEFITS} dark /></div>
                <button onClick={() => navigate("/operator-guide")} className="mt-8 inline-flex items-center gap-2 text-[#73DDB0] font-semibold text-[14px]">Read the operator guide <ChevronRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white border-y border-[#E7E4DD] py-16 sm:py-22">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="max-w-2xl mb-11">
            <Label>What makes it useful</Label>
            <h2 className="font-heading font-extrabold text-[34px] sm:text-[46px] leading-[1.03] tracking-[-0.03em]">A marketplace has to earn trust.</h2>
            <p className="mt-4 text-[16px] text-[#666E68] leading-relaxed">Not by making big promises, but by making the important parts of the process clear.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_POINTS.map(({ icon: Icon, title, body }, i) => (
              <motion.article key={title} {...FADE} transition={{ duration: 0.45, delay: i * 0.05 }} className="rounded-[22px] border border-[#E3E0D8] bg-[#FBFAF7] p-6">
                <div className="w-11 h-11 rounded-2xl bg-[#E7F3ED] text-[#0B6B4F] flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                <h3 className="font-heading font-bold text-[18px] mt-6">{title}</h3>
                <p className="text-[14px] text-[#656D67] leading-relaxed mt-2">{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 sm:py-20 bg-[#F7F6F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...FADE} className="rounded-[30px] bg-[#0B6B4F] text-white px-6 py-12 sm:px-12 sm:py-14 text-center overflow-hidden relative">
            <div className="absolute -top-28 -right-28 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.17em] font-bold text-[#A7E8CF]">The idea in one sentence</p>
              <h2 className="font-heading font-extrabold text-[34px] sm:text-[48px] leading-[1.02] tracking-[-0.035em] max-w-3xl mx-auto mt-4">Kharo is where private hire drivers find cars and operators find drivers.</h2>
              <div className="mt-8 flex justify-center flex-wrap gap-3">
                <button onClick={() => navigate("/search")} className="rounded-full bg-white text-[#0B6B4F] px-7 py-3.5 font-semibold hover:bg-[#E9F6F1] transition-colors">Browse vehicles</button>
                <button onClick={() => navigate("/list-your-fleet")} className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors">List your fleet</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
