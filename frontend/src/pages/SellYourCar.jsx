import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Tag, ShieldCheck, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { SELL, MARKETPLACE } from "@/content/site";
import { IMG } from "@/lib/images";
import MarketplaceInterestForm from "@/components/MarketplaceInterestForm";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useSeo } from "@/lib/seo";

const ICONS = { Users, Tag, ShieldCheck, Layers };

export default function SellYourCar() {
  const [params] = useSearchParams();
  const [demand, setDemand] = useState(null);
  const intent = params.get("intent") === "buy" ? "buy" : "sell";

  useSeo({
    title: "Sell your private hire vehicle · Kharo",
    description: SELL.hero.sub,
  });

  useEffect(() => {
    api.get("/marketplace-demand").then((r) => setDemand(r.data)).catch(() => {});
  }, []);

  return (
    <main className="bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* LEFT */}
        <div>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{SELL.hero.eyebrow}</p>
            <h1 className="mt-3 font-heading font-extrabold tracking-tight text-[30px] sm:text-5xl lg:text-6xl leading-[1.06] text-[#1A2E25] text-balance">
              {SELL.hero.heading}
            </h1>
            <p className="mt-4 text-[16px] text-[#4A564F] max-w-md leading-relaxed">{SELL.hero.sub}</p>
          </motion.div>

          {/* Live demand, the reason a seller should bother */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-8 rounded-[24px] bg-white ring-1 ring-slate-200/70 p-6 sm:p-7 shadow-sm" data-testid="sell-demand">
            <div className="text-[11px] text-[#7A857F] uppercase tracking-[0.18em]">Registered on the marketplace</div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <AnimatedNumber value={demand?.buyers ?? 0} className="text-[34px] font-heading font-extrabold text-[#0B6B4F] leading-none block" />
                <div className="text-[12.5px] text-[#4A564F] mt-1.5">looking to buy</div>
              </div>
              <div>
                <AnimatedNumber value={demand?.sellers ?? 0} className="text-[34px] font-heading font-extrabold text-[#1A2E25] leading-none block" />
                <div className="text-[12.5px] text-[#4A564F] mt-1.5">looking to sell</div>
              </div>
              <div>
                <AnimatedNumber value={demand?.listings ?? 0} className="text-[34px] font-heading font-extrabold text-[#1A2E25] leading-none block" />
                <div className="text-[12.5px] text-[#4A564F] mt-1.5">vehicles listed</div>
              </div>
            </div>
            <p className="text-[12.5px] text-[#7A857F] mt-4 leading-relaxed">
              Numbers update as people register. Tell us which side you are on and we will match you when the marketplace opens.
            </p>
          </motion.div>

          <div className="mt-7 space-y-4 max-w-md">
            {SELL.points.map((p) => {
              const Icon = ICONS[p.icon] || ShieldCheck;
              return (
                <div key={p.t} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.6} />
                  <div>
                    <div className="font-heading font-bold text-[#1A2E25] text-[15px]">{p.t}</div>
                    <p className="text-[14px] text-[#4A564F] mt-0.5 leading-relaxed">{p.d}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-[24px] overflow-hidden aspect-[16/9] shadow-lg hidden lg:block">
            <img src={IMG.keysHandover} alt="Handing over keys" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* RIGHT, the form */}
        <div className="w-full lg:justify-self-end lg:max-w-md bg-white rounded-[28px] ring-1 ring-slate-200 p-6 sm:p-8 shadow-xl">
          <h2 className="text-[22px] font-heading font-bold text-[#1A2E25]">{SELL.form.heading}</h2>
          <p className="text-[14px] text-[#4A564F] mt-1.5">{SELL.form.sub}</p>
          <div className="mt-5 mb-6 rounded-2xl bg-[#E6F5F0] border border-[#0B6B4F]/15 p-3.5">
            <p className="text-[13px] text-[#1A2E25] leading-relaxed">{SELL.form.note}</p>
          </div>
          <MarketplaceInterestForm defaultIntent={intent} />
        </div>
      </div>

      {/* PCO note, useful for sellers too */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#12211B] rounded-[26px] p-8 sm:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-balance max-w-2xl">{MARKETPLACE.pcoNote.heading}</h2>
          <p className="text-white/70 mt-3 text-[16px] leading-relaxed max-w-3xl">{MARKETPLACE.pcoNote.body}</p>
        </div>
      </section>
    </main>
  );
}
