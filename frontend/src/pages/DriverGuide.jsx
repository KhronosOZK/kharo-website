import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DRIVER_GUIDE } from "@/content/site";

const steps = DRIVER_GUIDE.steps;
const tracking = DRIVER_GUIDE.tracking;
const damage = DRIVER_GUIDE.damage;

export default function DriverGuide() {
  const navigate = useNavigate();
  return (
    <main>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center">
        <img src={DRIVER_GUIDE.hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/94 via-[#0E1A14]/58 to-[#0E1A14]/15" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0E1A14]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">{DRIVER_GUIDE.hero.eyebrow}</p>
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-4 max-w-2xl leading-[1.03] text-balance">{DRIVER_GUIDE.hero.heading}</h1>
            <p className="text-white/75 mt-4 text-[18px] max-w-xl leading-relaxed">{DRIVER_GUIDE.hero.sub}</p>
            <Button onClick={() => navigate("/")} className="mt-8 rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">
              {DRIVER_GUIDE.hero.cta} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Steps ── */}
      {steps.map((s, i) => {
        const dark = i % 2 === 1;
        return (
          <section key={s.n} className={dark ? "bg-[#0E1A14]" : "bg-[#F9F8F6]"}>
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}
              className={`max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 sm:py-20 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
              <div className="lg:[direction:ltr]">
                <span className={`text-[13px] font-heading font-bold tracking-widest uppercase ${dark ? "text-[#5FD3A6]" : "text-[#0B6B4F]"}`}>{s.n}</span>
                <h2 className={`text-3xl sm:text-[38px] font-heading font-bold mt-3 leading-tight text-balance ${dark ? "text-white" : "text-[#1A2E25]"}`}>{s.t}</h2>
                <p className={`mt-4 text-[17px] leading-relaxed ${dark ? "text-white/70" : "text-[#4A564F]"}`}>{s.d}</p>
              </div>
              <div className="lg:[direction:ltr]">
                <div className="rounded-[26px] overflow-hidden shadow-lg aspect-[4/3]">
                  <img src={s.img} alt={s.t} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </section>
        );
      })}

      {/* ── Tracking transparency ── */}
      <section className="bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-widest uppercase">{tracking.eyebrow}</p>
            <h2 className="text-3xl sm:text-[40px] font-heading font-bold text-[#1A2E25] mt-3 max-w-2xl text-balance leading-tight">{tracking.heading}</h2>
            <p className="text-[#4A564F] mt-4 text-[17px] leading-relaxed max-w-3xl">{tracking.body}</p>
          </motion.div>

          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {/* Kharo sees */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-7 ring-1 ring-slate-200/70 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#0B6B4F]/10 flex items-center justify-center">
                  <Eye className="w-4.5 h-4.5 text-[#0B6B4F]" />
                </div>
                <span className="font-heading font-bold text-[#1A2E25]">{tracking.kharo.label}</span>
              </div>
              <ul className="space-y-3">
                {tracking.kharo.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-[#4A564F] leading-relaxed">
                    <span className="text-[#0B6B4F] mt-0.5 shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Operator sees */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}
              className="bg-white rounded-2xl p-7 ring-1 ring-slate-200/70 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <EyeOff className="w-4.5 h-4.5 text-[#4A564F]" />
                </div>
                <span className="font-heading font-bold text-[#1A2E25]">{tracking.operator.label}</span>
              </div>
              <ul className="space-y-3">
                {tracking.operator.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-[#4A564F] leading-relaxed">
                    <span className="text-[#0B6B4F] mt-0.5 shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Damage process ── */}
      <section className="bg-[#0E1A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">{damage.eyebrow}</p>
            <h2 className="text-3xl sm:text-[38px] font-heading font-bold text-white mt-3 max-w-2xl text-balance leading-tight">{damage.heading}</h2>
          </motion.div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {damage.steps.map((s, i) => (
              <motion.div key={s.when} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white/[0.06] ring-1 ring-white/10 rounded-2xl p-6">
                <div className="text-[12px] font-medium text-[#5FD3A6] tracking-wide uppercase mb-3">{s.when}</div>
                <p className="text-[15px] text-white/75 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>

          {/* Liability table */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 bg-white/[0.04] ring-1 ring-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-white font-heading font-bold">Who covers what — published before you sign anything</p>
            </div>
            <div className="divide-y divide-white/[0.07]">
              {damage.liability.map(([situation, who]) => (
                <div key={situation} className="grid grid-cols-2 px-6 py-4 gap-4">
                  <span className="text-[14px] text-white/65">{situation}</span>
                  <span className="text-[14px] text-white font-medium">{who}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="text-white/45 text-[13px] mt-5 max-w-2xl leading-relaxed">{damage.note}</p>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-6">
        <div className="relative rounded-[26px] overflow-hidden p-10 sm:p-16 text-center">
          <img src={DRIVER_GUIDE.closing.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/84" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white text-balance">{DRIVER_GUIDE.closing.heading}</h2>
            <p className="text-white/75 mt-3 max-w-xl mx-auto text-[16px] leading-relaxed">{DRIVER_GUIDE.closing.sub}</p>
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              <Button onClick={() => navigate("/register")} className="rounded-full bg-[#5FD3A6] hover:bg-[#0B6B4F] text-[#0E1A14] hover:text-white font-semibold">
                {DRIVER_GUIDE.closing.primaryCta} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <button onClick={() => navigate("/")} className="text-white/80 hover:text-white text-[14px] font-medium underline underline-offset-4">
                {DRIVER_GUIDE.closing.secondaryCta}
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
