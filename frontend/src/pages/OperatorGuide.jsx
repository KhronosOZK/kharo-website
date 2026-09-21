import { useNavigate } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { ArrowRight, Check } from "lucide-react";
import DashboardSnapshot from "@/components/DashboardSnapshot";
import OperatorEarnings from "@/components/OperatorEarnings";
import Faq from "@/components/Faq";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import StepList from "@/components/StepList";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { OPERATOR_GUIDE } from "@/content/site";
import { OPERATOR_GUIDE_PAGE } from "@/content/pages/operatorGuide";
import { OPERATOR_STORY } from "@/content/pages/operatorStory";

const CONSOLE_ID = "console";

export default function OperatorGuide() {
  const navigate = useNavigate();
  useSeo({ title: OPERATOR_GUIDE.seo.title, description: OPERATOR_GUIDE.seo.description });

  const { hero, manage, dashboard, steps, claims, fee, earnings, faq } = OPERATOR_GUIDE;

  const scrollToConsole = () => {
    document.getElementById(CONSOLE_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-bone">
      {/* ── HERO: fleet photograph, left-aligned copy, one panel card ───── */}
      <PageHero heading={hero.heading} sub={hero.sub}
        img={hero.img} imgAlt={hero.imgAlt} position="50% center" priority
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate("/list-your-fleet")} data-testid="operator-guide-list">{hero.primaryCta} <ArrowRight size={16} /></Button>
          <Button size="lg" variant="outline" onClick={scrollToConsole} data-testid="operator-guide-console">{hero.secondaryCta}</Button>
        </div>
      </PageHero>

      {/* ── WHAT KHARO IS: the model, before any detail ─────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="max-w-2xl">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{OPERATOR_STORY.intro.heading}</h2>
        </RevealItem>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {OPERATOR_STORY.intro.points.map((p, i) => (
            <RevealItem as="li" key={p.t} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 sm:gap-8 py-7">
              <div>
                <h3 className="text-h3 font-heading font-bold text-ink">{p.t}</h3>
              </div>
              <p className="text-[15px] text-ink-2 leading-relaxed measure">{p.d}</p>
            </RevealItem>
          ))}
        </ol>
      </RevealGroup>

      {/* ── STEPS: how listing works, the onboarding sequence ───────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
          <RevealItem>
            <h2 className="text-h2 font-heading font-extrabold text-ink">{steps.heading}</h2>
          </RevealItem>
          <StepList items={steps.items} className="mt-8" />
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
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2 max-w-[34ch]">{manage.sub}</p>
          </RevealItem>
          <ul className="lg:col-span-7 divide-y divide-line border-y border-line">
            {manage.items.map((it) => (
              <RevealItem as="li" key={it.t} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2 sm:gap-8 py-6">
                <h3 className="text-h3 font-heading font-bold text-ink">{it.t}</h3>
                <p className="text-[15px] text-ink-2 leading-relaxed">{it.d}</p>
              </RevealItem>
            ))}
          </ul>
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
      <RevealGroup as="section" className="wrap py-section">
        <div className="grid items-center gap-8 rounded-lg border border-line bg-surface p-5 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10">
          <RevealItem className="lg:col-span-5">
            <img src={claims.img} alt={claims.imgAlt} loading="lazy" className="w-full rounded-md aspect-[4/3] object-cover bg-surface-2" />
          </RevealItem>
          <RevealItem className="lg:col-span-7">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{claims.heading}</h2>
            <p className="mt-4 text-lead text-ink-2 measure">{claims.body}</p>
          </RevealItem>
        </div>
      </RevealGroup>

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
              <p className="mt-3.5 text-[15px] leading-relaxed text-ink-2">{earnings.ctaBody}</p>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {earnings.ctaPoints.map((pt) => (
                  <li key={pt} className="flex gap-3 py-3 text-[15px] text-ink-2">
                    <Check size={17} strokeWidth={2.25} className="mt-0.5 shrink-0 text-green" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-6" onClick={() => navigate("/list-your-fleet")} data-testid="earnings-list-fleet">
                {earnings.cta} <ArrowRight size={16} />
              </Button>
              <p className="mt-3.5 text-[13px] leading-relaxed text-ink-3 max-w-[40ch]">{earnings.ctaNote}</p>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── WHAT IT COSTS: one number, worked out ────────────────────────── */}
      <section>
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-4">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{fee.heading}</h2>
            <p className="mt-4 text-[15px] text-ink-2 leading-relaxed measure-narrow">{fee.body}</p>
          </RevealItem>
          <RevealItem className="lg:col-span-8 rounded-lg border border-line bg-surface p-5 sm:p-6" data-testid="fee-example">
            {(() => {
              const { cars, rent, weeks, feeRate, payoutDay } = fee.example;
              const gross = cars * rent * weeks; const feeAmt = Math.round(gross * feeRate); const net = gross - feeAmt;
              return (
                <>
                  <p className="text-[13px] font-semibold text-ink">One month, worked out: {cars} cars at £{rent} a week</p>
                  <dl className="mt-3 divide-y divide-line border-y border-line text-[15px]">
                    <div className="flex justify-between py-3"><dt className="text-ink-2">Rent collected ({cars} × £{rent} × {weeks} weeks)</dt><dd className="tabular font-semibold text-ink">£{gross.toLocaleString()}</dd></div>
                    <div className="flex justify-between py-3"><dt className="text-ink-2">Kharo fee ({Math.round(feeRate * 100)}%)</dt><dd className="tabular text-ink">- £{feeAmt.toLocaleString()}</dd></div>
                    <div className="flex justify-between py-3"><dt className="font-semibold text-ink">Paid to you</dt><dd className="tabular font-heading text-[18px] font-bold text-ink">£{net.toLocaleString()}</dd></div>
                  </dl>
                  <p className="mt-3 text-[13px] text-ink-3">Paid {payoutDay}. Insurance is paid by the driver to the insurer and is not part of this.</p>
                </>
              );
            })()}
          </RevealItem>

        </RevealGroup>
      </section>

      {/* ── HOW YOU GET PAID: the risk answer, on its own dark band ──────── */}
      <section className="bg-surface border-y border-line" data-testid="paid-band">
        <RevealGroup className="wrap py-section">
          <RevealItem className="max-w-2xl">
            <h2 className="font-heading text-h2 font-extrabold tracking-[-0.01em] text-ink">{OPERATOR_GUIDE.paid.heading}</h2>
            <p className="mt-4 text-lead leading-relaxed text-ink-2">{OPERATOR_GUIDE.paid.sub}</p>
          </RevealItem>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {OPERATOR_GUIDE.paid.points.map((p, i) => (
              <RevealItem key={p.t} className="rounded-lg border border-line bg-bone p-5">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-green font-heading text-[14px] font-bold tabular text-ink">{i + 1}</span>
                <p className="mt-4 font-heading text-[17px] font-bold text-ink">{p.t}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.d}</p>
              </RevealItem>
            ))}
          </div>

          <RevealItem className="mt-12 border-t border-line pt-8">
            <h3 className="font-heading text-h3 font-bold text-ink">{OPERATOR_GUIDE.enforcement.heading}</h3>
            <p className="mt-2 text-[15px] text-ink-2">This is what happens, and when. It is written into the operator agreement before you list.</p>
          </RevealItem>
          <ol className="mt-6 grid gap-6 sm:grid-cols-4 sm:gap-4" data-testid="enforcement-timeline">
            {OPERATOR_GUIDE.enforcement.steps.map((s) => (
              <RevealItem as="li" key={s.day} className="relative border-t-2 border-green pt-4">
                <span aria-hidden="true" className="absolute -top-[7px] left-0 h-3 w-3 rounded-full bg-green" />
                <p className="font-heading text-[15px] font-bold text-green-deep">{s.day}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{s.d}</p>
              </RevealItem>
            ))}
          </ol>
        </RevealGroup>
      </section>

      {/* ── QUESTIONS ────────────────────────────────────────────────────── */}
      <section>
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-4">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{OPERATOR_GUIDE_PAGE.faqHeading}</h2>
            <p className="mt-4 text-[15px] text-ink-2 leading-relaxed measure-narrow">Short answers. If yours is not here, the person who calls you will answer it.</p>
          </RevealItem>
          <RevealItem className="lg:col-span-8 rounded-lg border border-line bg-surface px-5">
            <Faq items={faq} testId="operator-faq" />
          </RevealItem>
        </RevealGroup>
      </section>
    </div>
  );
}
