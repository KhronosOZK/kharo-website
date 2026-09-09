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
      <section className="relative overflow-hidden">
        <img src={WHY.hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/92 via-[#0E1A14]/58 to-[#0E1A14]/15" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0E1A14]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{WHY.hero.eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.03] text-balance">{WHY.hero.heading}</h1>
          <p className="text-white/75 mt-4 text-[17px] max-w-xl leading-relaxed">{WHY.hero.sub}</p>
        </div>
      </section>

      {/* Drivers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-lg order-1"><img src={WHY.drivers.img} alt="Driver" className="w-full h-full object-cover" /></div>
          <div className="order-2">
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{WHY.drivers.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">{WHY.drivers.heading}</h2>
            <div className="mt-7 space-y-6">
              {driverPoints.map((p, i) => (
                <motion.div key={p.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                  <div><h3 className="font-heading font-bold text-[#1A2E25]">{p.t}</h3><p className="text-[15px] text-[#4A564F] mt-1 leading-relaxed">{p.d}</p></div>
                </motion.div>
              ))}
            </div>
            <Button onClick={() => navigate("/")} className="mt-8 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">{WHY.drivers.cta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </div>
      </section>

      {/* Operators */}
      <section className="bg-[#12211B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{WHY.operators.eyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mt-2 text-balance">{WHY.operators.heading}</h2>
              <div className="mt-7 space-y-6">
                {operatorPoints.map((p, i) => (
                  <motion.div key={p.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#5FD3A6] text-[#0E1A14] flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                    <div><h3 className="font-heading font-bold text-white">{p.t}</h3><p className="text-[15px] text-white/70 mt-1 leading-relaxed">{p.d}</p></div>
                  </motion.div>
                ))}
              </div>
              <Button onClick={() => navigate("/list-your-fleet")} className="mt-8 rounded-full bg-white text-[#12211B] hover:bg-[#F1EFE9] font-semibold">{WHY.operators.cta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
            <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-lg"><img src={WHY.operators.img} alt="Fleet" className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-[#F1EFE9] rounded-[26px] p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div><h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] text-balance">{WHY.closing.heading}</h2><p className="text-[#4A564F] mt-2 text-[15px]">{WHY.closing.sub}</p></div>
          <Button onClick={() => navigate("/")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold shrink-0">{WHY.closing.cta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>
    </main>
  );
}
