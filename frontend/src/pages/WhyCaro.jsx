import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHY } from "@/content/site";

const driverPoints = WHY.drivers.points;
const operatorPoints = WHY.operators.points;

export default function WhyCaro() {
  const navigate = useNavigate();
  return (
    <main>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[480px] flex items-center">
        <img src={WHY.hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/95 via-[#0A130F]/65 to-[#0A130F]/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A130F]/70 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">{WHY.hero.eyebrow}</p>
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-4 max-w-2xl leading-[1.03] text-balance">{WHY.hero.heading}</h1>
            <p className="text-white/75 mt-5 text-[18px] max-w-xl leading-relaxed">{WHY.hero.sub}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Headline stat ── */}
      <section className="bg-[#0A130F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
                <div className="text-[64px] sm:text-[88px] font-heading font-extrabold text-[#5FD3A6] leading-none tracking-tight">
                  {WHY.stat.number}
                </div>
                <p className="text-white text-xl sm:text-2xl font-heading font-bold mt-3 max-w-lg text-balance leading-snug">
                  {WHY.stat.label}
                </p>
                <p className="text-white/50 text-[13px] mt-2">{WHY.stat.source}</p>
              </motion.div>
            </div>
            <div className="lg:max-w-md">
              <p className="text-white/70 text-[17px] leading-relaxed">{WHY.stat.context}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── For drivers ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-xl order-1 lg:order-none">
            <img src={WHY.drivers.img} alt="Driver" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-widest uppercase">{WHY.drivers.eyebrow}</p>
            <h2 className="text-3xl sm:text-[42px] font-heading font-extrabold text-[#1A2E25] mt-3 text-balance leading-tight">{WHY.drivers.heading}</h2>
            <div className="mt-8 space-y-7">
              {driverPoints.map((p, i) => (
                <motion.div key={p.t} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#1A2E25] text-[16px]">{p.t}</h3>
                    <p className="text-[15px] text-[#4A564F] mt-1.5 leading-relaxed">{p.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button onClick={() => navigate("/")} className="mt-10 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold px-6">
              {WHY.drivers.cta} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── For operators — dark band ── */}
      <section className="bg-[#0E1A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">{WHY.operators.eyebrow}</p>
              <h2 className="text-3xl sm:text-[42px] font-heading font-extrabold text-white mt-3 text-balance leading-tight">{WHY.operators.heading}</h2>
              <div className="mt-8 space-y-7">
                {operatorPoints.map((p, i) => (
                  <motion.div key={p.t} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#5FD3A6] text-[#0E1A14] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-[16px]">{p.t}</h3>
                      <p className="text-[15px] text-white/65 mt-1.5 leading-relaxed">{p.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button onClick={() => navigate("/list-your-fleet")} className="mt-10 rounded-full bg-white text-[#0E1A14] hover:bg-[#F1EFE9] font-semibold px-6">
                {WHY.operators.cta} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-xl">
              <img src={WHY.operators.img} alt="Fleet" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="bg-[#F1EFE9] rounded-[26px] p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] text-balance">{WHY.closing.heading}</h2>
            <p className="text-[#4A564F] mt-2 text-[15px] max-w-md">{WHY.closing.sub}</p>
          </div>
          <Button onClick={() => navigate("/")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold shrink-0 px-6">
            {WHY.closing.cta} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </section>

    </main>
  );
}
