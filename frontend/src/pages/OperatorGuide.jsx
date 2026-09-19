import { useNavigate } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { ArrowRight, Check } from "lucide-react";
import DashboardSnapshot from "@/components/DashboardSnapshot";
import OperatorEarnings from "@/components/OperatorEarnings";
import Faq from "@/components/Faq";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { OPERATOR_GUIDE } from "@/content/site";
import { OPERATOR_GUIDE_PAGE } from "@/content/pages/operatorGuide";
import { OPERATOR_STORY } from "@/content/pages/operatorStory";

const CONSOLE_ID = "console";

export default function OperatorGuide() {
  const navigate = useNavigate();
  useSeo({ title: OPERATOR_GUIDE.seo.title, description: OPERATOR_GUIDE.seo.description });

  const { hero, manage, dashboard, steps, claims, fee, earnings, faq, closer } = OPERATOR_GUIDE;
  const half = Math.ceil(steps.items.length / 2);
  const stepColumns = [steps.items.slice(0, half), steps.items.slice(half)];

  const scrollToConsole = () => {
    document.getElementById(CONSOLE_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-bone">
      {/* ── HERO: fleet photograph, left-aligned copy, one panel card ───── */}
      <PageHero
        word={hero.word} eyebrow={hero.tag} heading={hero.heading} sub={hero.sub}
        img={hero.img} imgAlt={hero.imgAlt} position="50% center" priority
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate("/list-your-fleet")} data-testid="operator-guide-list">{hero.primaryCta} <ArrowRight size={16} /></Button>
          <Button size="lg" variant="onDarkOutline" onClick={scrollToConsole} data-testid="operator-guide-console">{hero.secondaryCta}</Button>
        </div>
      </PageHero>

      {/* ── WHAT KHARO IS: the model, before any detail ─────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="max-w-2xl">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{OPERATOR_STORY.intro.heading}</h2>
        </RevealItem>
        <RevealItem as="ol" className="mt-10 divide-y divide-line border-y border-line">
          {OPERATOR_STORY.intro.points.map((p, i) => (
            <li key={p.t} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 sm:gap-8 py-7">
              <div>
                <p className="text-[12.5px] font-semibold text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-h3 font-heading font-bold text-ink">{p.t}</h3>
              </div>
              <p className="text-[15.5px] text-ink-2 leading-relaxed measure">{p.d}</p>
            </li>
          ))}
        </RevealItem>
      </RevealGroup>

      {/* ── STEPS: how listing works, the onboarding sequence ───────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
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
      </section>

      {/* ── MANAGE: statement plus hairline list ───────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        {/* items-start matters: a grid stretches its children by default, so
            the column would fill the row's full height and sticky would have
            nothing left to travel within. */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <RevealItem className="lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{manage.heading}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-2 max-w-[34ch]">{manage.sub}</p>
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
            <p className="mt-4 text-lead text-ink-2">{OPERATOR_STORY.consoleLine}</p>
            <p className="mt-2 text-[15px] text-ink-3">{dashboard.sub}</p>
          </RevealItem>
          <RevealItem className="mt-8">
            <DashboardSnapshot variant="operator" />
          </RevealItem>
        </RevealGroup>
      </section>

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
      <section id="earnings" className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
          <RevealItem className="max-w-2xl">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{earnings.heading}</h2>
            <p className="mt-4 text-lead text-ink-2">{earnings.sub}</p>
          </RevealItem>
          {/* The calculator produces a number; the column beside it is what
              to do about that number. It was empty space before. */}
          <RevealItem className="mt-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <OperatorEarnings className="max-w-none" />
            <div className="lg:pt-2">
              <h3 className="text-h3 font-heading font-extrabold text-ink">{earnings.ctaHeading}</h3>
              <p className="mt-3.5 text-[15.5px] leading-relaxed text-ink-2">{earnings.ctaBody}</p>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {earnings.ctaPoints.map((pt) => (
                  <li key={pt} className="flex gap-3 py-3 text-[14.5px] text-ink-2">
                    <Check size={17} strokeWidth={2.25} className="mt-0.5 shrink-0 text-green" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-6" onClick={() => navigate("/list-your-fleet")} data-testid="earnings-list-fleet">
                {earnings.cta} <ArrowRight size={16} />
              </Button>
              <p className="mt-3.5 text-[12.5px] leading-relaxed text-ink-3 max-w-[40ch]">{earnings.ctaNote}</p>
            </div>
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
