import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import DashboardSnapshot from "@/components/DashboardSnapshot";
import ApplicationFlow from "@/components/ApplicationFlow";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import StepList from "@/components/StepList";
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
      <PageHero heading={hero.heading} sub={hero.sub}
        img={hero.img} imgAlt={hero.imgAlt} position="55% center" priority
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate("/search")} data-testid="for-drivers-browse">{hero.primaryCta} <ArrowRight size={16} /></Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/register")} data-testid="for-drivers-register">{hero.secondaryCta}</Button>
        </div>
      </PageHero>

      {/* ── STEPS: the whole arc, browsing to earning ───────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem><h2 className="text-h2 font-heading font-extrabold text-ink max-w-[22ch]">{steps.heading}</h2></RevealItem>
        <StepList items={steps.items} className="mt-10" />

        <RevealItem className="mt-2">
          <Link to="/driver-guide" data-testid="driver-guide-link" className="pressable inline-flex items-center gap-1.5 text-[15px] font-semibold text-green hover:underline underline-offset-4">
            {steps.guideCta} <ArrowRight size={16} strokeWidth={1.75} />
          </Link>
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
        <RevealItem className="lg:col-span-7">
          <h2 className="text-h2 font-heading font-extrabold text-ink max-w-[20ch]">{support.heading}</h2>
          <p className="mt-4 text-[15px] text-ink-2 leading-relaxed measure">{support.body}</p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {support.points.map((p) => (
              <RevealItem as="li" key={p} className="flex items-start gap-3 py-3.5 text-[15px] text-ink">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-green text-ink">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
                {p}
              </RevealItem>
            ))}
          </ul>
        </RevealItem>
        <RevealItem className="lg:col-span-5">
          <img src={support.img} alt={support.imgAlt} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-lg border border-line" />
        </RevealItem>
      </RevealGroup>

      {/* ── REQUIREMENTS ──────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-5">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{requirements.heading}</h2>
            <p className="mt-4 text-[15px] text-ink-2 leading-relaxed measure-narrow">{requirements.sub}</p>
          </RevealItem>
          <RevealItem className="lg:col-span-7">
            <ul className="divide-y divide-line border-y border-line">
              {requirements.items.map((r) => (
                <li key={r} className="flex items-start gap-3 py-4 text-[15px] text-ink">
                  <Check className="w-4 h-4 text-green shrink-0 mt-1" strokeWidth={2.25} /> {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] text-ink-3 leading-relaxed">{requirements.note}</p>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── CLOSER ────────────────────────────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{closer.heading}</h2>
            <p className="mt-3 text-[15px] text-ink-2 leading-relaxed measure">{closer.sub}</p>
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
