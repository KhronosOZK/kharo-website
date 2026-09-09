import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DRIVER_GUIDE } from "@/content/site";

const steps = DRIVER_GUIDE.steps;

export default function DriverGuide() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={DRIVER_GUIDE.hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/92 via-[#0E1A14]/58 to-[#0E1A14]/15" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0E1A14]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{DRIVER_GUIDE.hero.eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.03] text-balance">{DRIVER_GUIDE.hero.heading}</h1>
          <p className="text-white/75 mt-4 text-[17px] max-w-xl leading-relaxed">{DRIVER_GUIDE.hero.sub}</p>
          <Button onClick={() => navigate("/")} className="mt-8 rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">{DRIVER_GUIDE.hero.cta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      {steps.map((s, i) => {
        const dark = i % 2 === 1;
        return (
          <section key={s.n} className={dark ? "bg-[#0E1A14]" : "bg-[#F9F8F6]"}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}
              className={`max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 sm:py-20 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
              <div className="lg:[direction:ltr]">
                <span className={`text-[15px] font-heading font-bold tracking-widest ${dark ? "text-[#5FD3A6]" : "text-[#0B6B4F]"}`}>{s.n}</span>
                <h2 className={`text-3xl sm:text-[40px] font-heading font-bold mt-3 leading-tight text-balance ${dark ? "text-white" : "text-[#1A2E25]"}`}>{s.t}</h2>
                <p className={`mt-4 text-[17px] leading-relaxed ${dark ? "text-white/70" : "text-[#4A564F]"}`}>{s.d}</p>
              </div>
              <div className="lg:[direction:ltr]"><div className="rounded-[26px] overflow-hidden shadow-lg aspect-[4/3]"><img src={s.img} alt={s.t} className="w-full h-full object-cover" /></div></div>
            </motion.div>
          </section>
        );
      })}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-[26px] overflow-hidden p-8 sm:p-16 text-center">
          <img src={DRIVER_GUIDE.closing.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/82" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white text-balance">{DRIVER_GUIDE.closing.heading}</h2>
            <p className="text-white/75 mt-3 max-w-xl mx-auto text-[16px]">{DRIVER_GUIDE.closing.sub}</p>
            <div className="flex gap-3 justify-center mt-7 flex-wrap">
              <Button onClick={() => navigate("/register")} className="rounded-full bg-[#5FD3A6] hover:bg-[#0B6B4F] text-[#0E1A14] hover:text-white font-semibold">{DRIVER_GUIDE.closing.primaryCta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
              <button onClick={() => navigate("/")} className="text-white/80 hover:text-white text-[14px] font-medium underline underline-offset-4">{DRIVER_GUIDE.closing.secondaryCta}</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
