import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Wallet, ShieldCheck, MapPin, Wrench, BadgeCheck, Navigation, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOR_DRIVERS } from "@/content/site";

const ICONS = { Wallet, ShieldCheck, MapPin, Wrench, BadgeCheck, Navigation, Clock, FileCheck };

const benefits = FOR_DRIVERS.benefits.items;
const steps = FOR_DRIVERS.steps.items;
const requirements = FOR_DRIVERS.requirements.items;

export default function ForDrivers() {
  const navigate = useNavigate();
  return (
    <main className="bg-[#F9F8F6]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={FOR_DRIVERS.hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/92 via-[#0E1A14]/58 to-[#0E1A14]/15" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0E1A14]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{FOR_DRIVERS.hero.eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.03] text-balance">
            {FOR_DRIVERS.hero.heading}
          </h1>
          <p className="text-white/75 mt-4 text-[17px] max-w-xl leading-relaxed">
            {FOR_DRIVERS.hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/")} data-testid="fd-browse" className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0E1A14] font-semibold h-11 px-6">{FOR_DRIVERS.hero.primaryCta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            <Button onClick={() => navigate("/register")} data-testid="fd-register" variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white h-11 px-6">{FOR_DRIVERS.hero.secondaryCta}</Button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {FOR_DRIVERS.trustStrip.map(([n, l]) => (
            <div key={n} className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1A2E25]">{n}</div>
              <div className="text-[13px] text-[#4A564F] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why drivers choose Kharo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{FOR_DRIVERS.benefits.eyebrow}</p>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 max-w-2xl text-balance">{FOR_DRIVERS.benefits.heading}</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => {
            const Icon = ICONS[b.icon] || Wallet;
            return (
            <motion.div key={b.t} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[24px] ring-1 ring-slate-200/70 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#0B6B4F]/[0.08] flex items-center justify-center"><Icon className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.7} /></div>
              <h3 className="font-heading font-bold text-[#1A2E25] mt-4 text-[17px]">{b.t}</h3>
              <p className="text-[14.5px] text-[#4A564F] mt-2 leading-relaxed">{b.d}</p>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* Earnings teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <div className="rounded-[26px] overflow-hidden bg-[#0E1A14] text-white grid lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">{FOR_DRIVERS.earnings.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mt-3 leading-tight text-balance">{FOR_DRIVERS.earnings.heading}</h2>
            <p className="text-white/70 mt-4 text-[15px] leading-relaxed max-w-md">
              {FOR_DRIVERS.earnings.sub}
            </p>
            <Button onClick={() => navigate("/register")} className="mt-7 rounded-full bg-[#5FD3A6] hover:bg-white text-[#0E1A14] font-semibold h-11 px-6">{FOR_DRIVERS.earnings.cta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
          <div className="min-h-[240px] lg:min-h-0"><img src={FOR_DRIVERS.earnings.img} alt="Private hire driver at night" className="w-full h-full object-cover" /></div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{FOR_DRIVERS.steps.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">{FOR_DRIVERS.steps.heading}</h2>
          </div>
          <button onClick={() => navigate("/driver-guide")} className="text-[#0B6B4F] font-semibold text-[15px] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all self-start sm:self-auto">{FOR_DRIVERS.steps.linkCta} <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[24px] ring-1 ring-slate-200/70 p-6 shadow-sm">
              <span className="font-heading font-extrabold text-[#0B6B4F]/25 text-3xl">{s.n}</span>
              <h3 className="font-heading font-bold text-[#1A2E25] mt-3 text-[17px]">{s.t}</h3>
              <p className="text-[14px] text-[#4A564F] mt-2 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-lg"><img src={FOR_DRIVERS.requirements.img} alt="Driver collecting keys" className="w-full h-full object-cover" /></div>
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">{FOR_DRIVERS.requirements.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">{FOR_DRIVERS.requirements.heading}</h2>
            <p className="text-[15px] text-[#4A564F] mt-3 leading-relaxed">{FOR_DRIVERS.requirements.sub}</p>
            <ul className="mt-6 space-y-4">
              {requirements.map((r) => (
                <li key={r} className="flex gap-3"><div className="w-6 h-6 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></div><span className="text-[15px] text-[#1A2E25] leading-relaxed">{r}</span></li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-4 text-[13px] text-[#4A564F]">
              {FOR_DRIVERS.requirements.notes.map((n) => {
                const Icon = ICONS[n.icon] || Clock;
                return <span key={n.t} className="inline-flex items-center gap-2"><Icon className="w-4 h-4 text-[#0B6B4F]" /> {n.t}</span>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-[#F1EFE9] rounded-[26px] p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div><h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] text-balance">{FOR_DRIVERS.closing.heading}</h2><p className="text-[#4A564F] mt-2 text-[15px]">{FOR_DRIVERS.closing.sub}</p></div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button onClick={() => navigate("/")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold">{FOR_DRIVERS.closing.primaryCta} <ArrowRight className="w-4 h-4 ml-2" /></Button>
            <Button onClick={() => navigate("/register")} variant="outline" className="rounded-full border-[#1A2E25]/20 text-[#1A2E25]">{FOR_DRIVERS.closing.secondaryCta}</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
