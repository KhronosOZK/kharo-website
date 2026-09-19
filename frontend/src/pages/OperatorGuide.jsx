import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardSnapshot from "@/components/DashboardSnapshot";
import OperatorEarnings from "@/components/OperatorEarnings";
import Faq from "@/components/Faq";
import { RevealGroup, RevealItem, Enter } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { OPERATOR_GUIDE } from "@/content/site";
import { OPERATOR_EARNINGS } from "@/content/pages/operatorEarnings";
import { OPERATOR_GUIDE_PAGE } from "@/content/pages/operatorGuide";

const CONSOLE_ID = "console";

export default function OperatorGuide() {
  const navigate = useNavigate();
  useSeo({ title: OPERATOR_GUIDE.seo.title, description: OPERATOR_GUIDE.seo.description });

  const { hero, manage, dashboard, steps, claims, fee, faq, closer } = OPERATOR_GUIDE;
  const half = Math.ceil(steps.items.length / 2);
  const stepColumns = [steps.items.slice(0, half), steps.items.slice(half)];

  const scrollToConsole = () => {
    document.getElementById(CONSOLE_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-bone">
      {/* ── HERO: fleet photograph, left-aligned copy, one panel card ───── */}
      <section className="relative isolate overflow-hidden text-white">
        <img src={hero.img} alt={hero.imgAlt} className="absolute inset-0 h-full w-full object-cover object-[55%_center]" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/25 to-night/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/50 via-night/15 to-transparent" />

        <div className="wrap relative flex flex-col justify-end min-h-[78svh] lg:min-h-[82svh] pt-[clamp(5rem,12vh,8rem)] pb-[clamp(2rem,6vh,4rem)]">
          <div className="max-w-[46rem]">
            <Enter as="p" className="eyebrow text-mint">{hero.tag}</Enter>
            <Enter as="h1" delay={0.04} className="mt-3 text-display font-heading font-extrabold max-w-[16ch]">
              {hero.heading}
            </Enter>
            <Enter as="p" delay={0.08} className="mt-5 text-lead text-white/80 max-w-[48ch]">
              {hero.sub}
            </Enter>

            <Enter delay={0.16} className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/list-your-fleet")} data-testid="operator-guide-cta">
                {hero.primaryCta} <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="onDarkOutline" onClick={scrollToConsole}>
                {hero.secondaryCta}
              </Button>
            </Enter>
          </div>

        </div>
      </section>

      {/* ── MANAGE: statement plus hairline list ───────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-5">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{manage.heading}</h2>
          </RevealItem>
          <RevealItem as="ul" className="lg:col-span-7 divide-y divide-line border-y border-line">
            {manage.items.map((it) => (
              <li key={it.t} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 sm:gap-8 py-6">
                <h3 className="text-h3 font-heading font-bold text-ink">{it.t}</h3>
                <p className="text-[15.5px] text-ink-2 leading-relaxed">{it.d}</p>
              </li>
            ))}
          </RevealItem>
        </div>
      </RevealGroup>

      {/* ── CONSOLE: the operator account, live ────────────────────────── */}
      <section id={CONSOLE_ID} className="bg-surface border-y border-line scroll-mt-header">
        <RevealGroup className="wrap py-section">
          <RevealItem className="max-w-2xl">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{dashboard.heading}</h2>
            <p className="mt-4 text-lead text-ink-2">{dashboard.sub}</p>
          </RevealItem>
          <RevealItem className="mt-8">
            <DashboardSnapshot variant="operator" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── STEPS: a quiet vertical timeline, two columns on tablets up ── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem>
          <h2 className="text-h2 font-heading font-extrabold text-ink">{steps.heading}</h2>
        </RevealItem>
        <RevealItem className="mt-8 grid md:grid-cols-2 gap-x-block">
          {stepColumns.map((column, c) => (
            <ol key={c} className={`border-l border-line ${c > 0 ? "mt-8 md:mt-0" : ""}`} start={c * half + 1}>
              {column.map((s) => (
                <li key={s.t} className="relative pl-7 sm:pl-8 pb-8 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[5px] top-2 block w-2.5 h-2.5 rounded-full bg-green" />
                  <h3 className="text-h3 font-heading font-bold text-ink">{s.t}</h3>
                  <p className="mt-2 text-[15.5px] text-ink-2 leading-relaxed measure-narrow">{s.d}</p>
                </li>
              ))}
            </ol>
          ))}
        </RevealItem>
      </RevealGroup>

      {/* ── CLAIMS: the one photo and text split on the page ───────────── */}
      <RevealGroup as="section" className="wrap pb-section">
        <div className="grid lg:grid-cols-2 gap-block items-center">
          <RevealItem>
            <img src={claims.img} alt={claims.imgAlt} loading="lazy" className="w-full rounded-2xl aspect-[4/3] object-cover bg-surface-2" />
          </RevealItem>
          <RevealItem>
            <h2 className="text-h2 font-heading font-extrabold text-ink">{claims.heading}</h2>
            <p className="mt-4 text-lead text-ink-2 measure">{claims.body}</p>
          </RevealItem>
        </div>
      </RevealGroup>

      {/* ── FEE AND FAQ ────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-4">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{fee.heading}</h2>
            <p className="mt-4 text-[15.5px] text-ink-2 leading-relaxed measure-narrow">{fee.body}</p>
            <h2 className="mt-10 text-h2 font-heading font-extrabold text-ink">{OPERATOR_GUIDE_PAGE.faqHeading}</h2>
          </RevealItem>
          <RevealItem className="lg:col-span-8 lg:pt-1">
            <Faq items={faq} testId="operator-faq" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── EARNINGS: the number that makes an operator sign up ────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
          <RevealItem className="max-w-2xl">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{OPERATOR_EARNINGS.heading}</h2>
            <p className="mt-4 text-lead text-ink-2">{OPERATOR_EARNINGS.sub}</p>
          </RevealItem>
          <RevealItem className="mt-8">
            <OperatorEarnings />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── CLOSER: quiet, one panel, one button ───────────────────────── */}
      <section className="bg-bone">
        <RevealGroup className="wrap py-section">
          <RevealItem className="surface-raised rounded-hero p-card">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              <div className="lg:col-span-8">
                <h2 className="text-h2 font-heading font-extrabold text-ink">{closer.heading}</h2>
                <p className="mt-3 text-[15.5px] text-ink-2 leading-relaxed measure">{closer.sub}</p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button size="lg" onClick={() => navigate("/list-your-fleet")} className="w-full xs:w-auto" data-testid="operator-guide-closer-cta">
                  {closer.cta} <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>
    </div>
  );
}
