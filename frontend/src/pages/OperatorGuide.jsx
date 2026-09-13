import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";
import { OPERATOR_GUIDE } from "@/content/site";

const perks = OPERATOR_GUIDE.perks;
const steps = OPERATOR_GUIDE.steps;
const vetting = OPERATOR_GUIDE.vetting;
const arrears = OPERATOR_GUIDE.arrears;
const tracking = OPERATOR_GUIDE.tracking;

export default function OperatorGuide() {
  const navigate = useNavigate();
  return (
    <main>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center">
        <img src={OPERATOR_GUIDE.hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/94 via-[#0E1A14]/58 to-[#0E1A14]/15" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0E1A14]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">{OPERATOR_GUIDE.hero.eyebrow}</p>
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-4 max-w-3xl leading-[1.03] text-balance">{OPERATOR_GUIDE.hero.heading}</h1>
            <p className="text-white/75 mt-5 text-[18px] max-w-2xl leading-relaxed">{OPERATOR_GUIDE.hero.sub}</p>
            <Button onClick={() => navigate("/list-your-fleet")} className="mt-8 rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">
              {OPERATOR_GUIDE.hero.cta} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Perks strip ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {perks.map((p) => (
            <div key={p.t} className="bg-white rounded-2xl p-6 ring-1 ring-slate-200/70 shadow-md">
              <div className="font-heading font-extrabold text-[#0B6B4F] text-2xl">{p.t}</div>
              <p className="text-[14px] text-[#4A564F] mt-2 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works — steps ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {steps.map((s, i) => (
          <motion.section key={s.n}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}
            className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 sm:py-16 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
            <div className="lg:[direction:ltr]">
              <span className="text-[13px] font-heading font-bold text-[#0B6B4F] tracking-widest uppercase">{s.n}</span>
              <h2 className="text-3xl sm:text-[38px] font-heading font-bold text-[#1A2E25] mt-3 leading-tight text-balance">{s.t}</h2>
              <p className="text-[#4A564F] mt-4 text-[17px] leading-relaxed">{s.d}</p>
            </div>
            <div className="lg:[direction:ltr]">
              <div className="rounded-[26px] overflow-hidden shadow-lg aspect-[4/3]">
                <img src={s.img} alt={s.t} className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* ── Vetting deep-dive ── */}
      <section className="bg-[#0E1A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="max-w-3xl mb-12">
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">{vetting.eyebrow}</p>
            <h2 className="text-3xl sm:text-[40px] font-heading font-bold text-white mt-3 text-balance leading-tight">{vetting.heading}</h2>
            <p className="text-white/65 mt-4 text-[17px] leading-relaxed">{vetting.intro}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {vetting.layers.map((layer, i) => (
              <motion.div key={layer.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/[0.05] ring-1 ring-white/10 rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#5FD3A6] text-[#0E1A14] flex items-center justify-center font-heading font-extrabold text-[13px] shrink-0">
                    {layer.n}
                  </div>
                  <h3 className="font-heading font-bold text-white text-[17px]">{layer.t}</h3>
                </div>
                <p className="text-[15px] text-white/65 leading-relaxed">{layer.d}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-6 bg-[#5FD3A6]/10 ring-1 ring-[#5FD3A6]/25 rounded-xl px-6 py-4">
            <p className="text-[14px] text-[#5FD3A6] leading-relaxed">{vetting.note}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Arrears ladder ── */}
      <section className="bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="max-w-2xl mb-12">
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-widest uppercase">{arrears.eyebrow}</p>
            <h2 className="text-3xl sm:text-[40px] font-heading font-bold text-[#1A2E25] mt-3 text-balance leading-tight">{arrears.heading}</h2>
            <p className="text-[#4A564F] mt-4 text-[17px] leading-relaxed">{arrears.intro}</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line on desktop */}
            <div className="hidden lg:block absolute left-[88px] top-0 bottom-0 w-px bg-[#0B6B4F]/15" aria-hidden="true" />
            <div className="space-y-5">
              {arrears.ladder.map((step, i) => (
                <motion.div key={step.day} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex gap-5 lg:gap-8 items-start">
                  <div className="shrink-0 w-[72px] lg:w-[88px] text-right">
                    <span className={`text-[13px] font-heading font-bold tracking-wide ${i >= 4 ? "text-[#C05B2B]" : "text-[#0B6B4F]"}`}>{step.day}</span>
                  </div>
                  <div className="relative flex items-start gap-4 flex-1">
                    <div className={`hidden lg:flex w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border-2 ${i >= 4 ? "bg-[#C05B2B] border-[#C05B2B]" : "bg-[#0B6B4F] border-[#0B6B4F]"}`} />
                    <div className="bg-white rounded-xl p-5 ring-1 ring-slate-200/70 flex-1 shadow-sm">
                      <p className="text-[15px] text-[#1A2E25] leading-relaxed">{step.action}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-10 bg-[#1A2E25]/6 rounded-xl px-6 py-5">
            <p className="text-[15px] text-[#4A564F] leading-relaxed">{arrears.immobilisation}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Tracking rules ── */}
      <section className="bg-[#0E1A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-2xl mb-10">
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">{tracking.eyebrow}</p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-3 text-balance">{tracking.heading}</h2>
            <p className="text-white/65 mt-3 text-[16px] leading-relaxed">{tracking.intro}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-white/[0.06] ring-1 ring-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#5FD3A6]/15 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#5FD3A6]" />
                </div>
                <span className="text-white font-heading font-bold">You see</span>
              </div>
              <ul className="space-y-3">
                {tracking.operatorSees.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[14px] text-white/65 leading-relaxed">
                    <span className="text-[#5FD3A6] shrink-0 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}
              className="bg-white/[0.04] ring-1 ring-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">
                  <EyeOff className="w-4 h-4 text-white/50" />
                </div>
                <span className="text-white/70 font-heading font-bold">Kharo holds separately</span>
              </div>
              <ul className="space-y-3">
                {tracking.kharoHolds.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[14px] text-white/55 leading-relaxed">
                    <span className="text-white/30 shrink-0 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Earnings calculator ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-[#0E1A14] rounded-[26px] p-7 sm:p-12 text-white">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-widest uppercase">Your earning potential</p>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-end mt-3">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-balance">See what your fleet could bring in.</h2>
              <p className="text-white/70 mt-3 text-[16px] leading-relaxed">Real figures based on typical London weekly rates at 85% utilisation, before our flat 10% fee. Register to get a full breakdown for your exact fleet.</p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-6">
              <div className="text-[12px] text-white/55 uppercase tracking-wide">A well run car earns up to</div>
              <div className="text-[44px] sm:text-6xl font-heading font-extrabold text-[#5FD3A6] leading-none mt-2">
                £14,586<span className="text-lg font-normal text-white/55"> / year</span>
              </div>
              <div className="text-[13px] text-white/60 mt-2">Executive vehicles, at £330 a week and typical utilisation.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
            {[["Hybrid saloon", 255], ["Executive", 330], ["Electric", 235], ["Wheelchair accessible", 255]].map(([label, wk]) => {
              const perYear = Math.round(wk * 52 * 0.85);
              return (
                <div key={label} className="bg-white/5 rounded-2xl p-5 ring-1 ring-white/10">
                  <div className="text-[13px] text-white/60">{label}</div>
                  <div className="text-2xl font-heading font-extrabold text-[#5FD3A6] mt-2">£{perYear.toLocaleString()}</div>
                  <div className="text-[12px] text-white/50 mt-1">per car, per year · £{wk}/wk</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
            {[5, 15, 30].map((n) => (
              <div key={n} className="flex items-center justify-between bg-white/5 rounded-2xl p-5 ring-1 ring-white/10">
                <span className="text-white/70">{n} hybrid saloons</span>
                <span className="text-xl font-heading font-extrabold text-white">
                  £{(255 * 52 * 0.85 * n).toLocaleString()}<span className="text-[12px] text-white/50 font-normal">/yr</span>
                </span>
              </div>
            ))}
          </div>

          <Button onClick={() => navigate("/list-your-fleet")} className="mt-8 rounded-full bg-[#5FD3A6] hover:bg-white text-[#0E1A14] font-semibold">
            Register to see your full breakdown <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-2">
        <div className="relative rounded-[26px] overflow-hidden p-10 sm:p-16 text-center">
          <img src={IMG.handshakeDesk} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/86" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white text-balance">Get your fleet ready for launch.</h2>
            <p className="text-white/70 mt-3 max-w-xl mx-auto text-[16px] leading-relaxed">Register your interest and take a look at the dashboard you will run everything from.</p>
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              <Button onClick={() => navigate("/list-your-fleet")} className="rounded-full bg-[#5FD3A6] hover:bg-[#0B6B4F] text-[#0E1A14] hover:text-white font-semibold">
                Register interest
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
