import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import DashboardSnapshot from "@/components/DashboardSnapshot";
import ApplicationFlow from "@/components/ApplicationFlow";
import { RevealGroup, RevealItem, Enter } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { FOR_DRIVERS } from "@/content/site";

export default function ForDrivers() {
  const navigate = useNavigate();
  const { seo, hero, steps, flow, dashboard, support, requirements, closer } = FOR_DRIVERS;
  useSeo({ title: seo.title, description: seo.description });

  return (
    <div className="bg-bone">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden text-white">
        <img src={hero.img} alt={hero.imgAlt} className="absolute inset-0 h-full w-full object-cover object-[65%_center]" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/30 to-night/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/50 via-night/15 to-transparent" />

        <div className="wrap relative min-h-[78svh] flex flex-col justify-end pt-[clamp(4rem,10vh,7rem)] pb-[clamp(2rem,6vh,4rem)]">
          <Enter as="p" className="eyebrow text-mint">{hero.tag}</Enter>
          <Enter as="h1" delay={0.04} className="mt-3 text-display font-heading font-extrabold max-w-[18ch]">
            {hero.heading}
          </Enter>
          <Enter as="p" delay={0.08} className="mt-5 text-lead text-white/80 max-w-[46ch]">{hero.sub}</Enter>
          <Enter delay={0.12} className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/search")} data-testid="for-drivers-browse">{hero.primaryCta} <ArrowRight size={16} /></Button>
            <Button size="lg" variant="onDarkOutline" onClick={() => navigate("/register")} data-testid="for-drivers-register">{hero.secondaryCta}</Button>
          </Enter>
        </div>
      </section>

      {/* ── STEPS: one horizontal timeline ────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem><h2 className="text-h2 font-heading font-extrabold text-ink max-w-[22ch]">{steps.heading}</h2></RevealItem>
        <RevealItem as="ol" className="mt-10 grid gap-8 md:grid-cols-5 md:gap-6">
          {steps.items.map((s, i) => (
            <li key={s.t} className="relative pl-6 md:pl-0 md:pt-6 border-l md:border-l-0 md:border-t border-line">
              <span aria-hidden className="absolute -left-[5px] top-1 md:left-0 md:-top-[5px] w-[9px] h-[9px] rounded-full bg-green" />
              <p className="text-[12.5px] font-semibold text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-h3 font-heading font-bold text-ink">{s.t}</h3>
              <p className="mt-2 text-[15px] text-ink-2 leading-relaxed">{s.d}</p>
            </li>
          ))}
        </RevealItem>
      </RevealGroup>

      {/* ── THE APPLICATION, SHOWN WORKING ───────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <RevealItem className="lg:col-span-4 lg:sticky top-below-header">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{flow.heading}</h2>
            <p className="mt-4 text-lead text-ink-2 measure-narrow">{flow.sub}</p>
          </RevealItem>
          <RevealItem className="lg:col-span-8">
            <ApplicationFlow />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── THE ACCOUNT ───────────────────────────────────────────────── */}
      <section>
        <RevealGroup className="wrap py-section">
          <RevealItem className="max-w-2xl">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{dashboard.heading}</h2>
            <p className="mt-4 text-lead text-ink-2">{dashboard.sub}</p>
          </RevealItem>
          <RevealItem className="mt-8">
            <DashboardSnapshot variant="driver" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── SUPPORT: one split with photography ───────────────────────── */}
      <RevealGroup as="section" className="wrap py-section grid lg:grid-cols-12 gap-block items-center">
        <RevealItem className="lg:col-span-6">
          <h2 className="text-h2 font-heading font-extrabold text-ink max-w-[20ch]">{support.heading}</h2>
          <p className="mt-4 text-[15.5px] text-ink-2 leading-relaxed measure">{support.body}</p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {support.points.map((p) => (
              <li key={p} className="flex items-start gap-3 py-3.5 text-[15px] text-ink">
                <Check className="w-4 h-4 text-green shrink-0 mt-1" strokeWidth={2.25} /> {p}
              </li>
            ))}
          </ul>
        </RevealItem>
        <RevealItem className="lg:col-span-6 zoom-media">
          <img src={support.img} alt={support.imgAlt} loading="lazy" className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover rounded-2xl" data-zoom />
        </RevealItem>
      </RevealGroup>

      {/* ── REQUIREMENTS ──────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-5">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{requirements.heading}</h2>
            <p className="mt-4 text-[15.5px] text-ink-2 leading-relaxed measure-narrow">{requirements.sub}</p>
          </RevealItem>
          <RevealItem className="lg:col-span-7">
            <ul className="divide-y divide-line border-y border-line">
              {requirements.items.map((r) => (
                <li key={r} className="flex items-start gap-3 py-4 text-[15.5px] text-ink">
                  <Check className="w-4 h-4 text-green shrink-0 mt-1" strokeWidth={2.25} /> {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] text-ink-3 leading-relaxed">{requirements.note}</p>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── CLOSER ────────────────────────────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{closer.heading}</h2>
            <p className="mt-3 text-[15.5px] text-ink-2 leading-relaxed measure">{closer.sub}</p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
            <Button size="lg" onClick={() => navigate("/search")}>{closer.primaryCta}</Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/register")}>{closer.secondaryCta}</Button>
          </div>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
