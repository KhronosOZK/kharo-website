import { useEffect, useRef, useState } from "react";
import PageHero from "@/components/PageHero";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import Faq from "@/components/Faq";
import { useSeo } from "@/lib/seo";
import { DRIVER_GUIDE } from "@/content/site";
import { DRIVER_GUIDE_EXTRA } from "@/content/pages/driverGuide";

/**
 * Left column: a sticky index of step titles that tracks scroll position via
 * IntersectionObserver (never a scroll listener). Right column: the step
 * blocks themselves, with a photo on every other step so the page never
 * turns into a long zig-zag of alternating image sides.
 */
function StepsIndex({ steps }) {
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [steps.length]);

  const scrollTo = (i) => itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
      {/* mobile: horizontal pill index */}
      <div className="lg:hidden track gap-2 pb-1">
        {steps.map((s, i) => (
          <button
            key={s.t}
            type="button"
            onClick={() => scrollTo(i)}
            className={`pressable shrink-0 rounded-full px-4 h-10 text-[13.5px] font-medium border ${
              active === i ? "bg-green text-white border-green" : "bg-surface text-ink-2 border-line-strong"
            }`}
          >
            {s.t}
          </button>
        ))}
      </div>

      {/* desktop: sticky vertical index */}
      <div className="hidden lg:block lg:col-span-4">
        <ol className="lg:sticky top-below-header space-y-0.5">
          {steps.map((s, i) => (
            <li key={s.t}>
              <button
                type="button"
                onClick={() => scrollTo(i)}
                className={`pressable block w-full text-left py-2.5 text-[15px] transition-colors duration-hover ease-out ${
                  active === i ? "font-semibold text-ink" : "text-ink-3"
                }`}
              >
                <span className="tabular mr-2.5">{String(i + 1).padStart(2, "0")}</span>{s.t}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-14">
        {steps.map((s, i) => {
          const withPhoto = i % 2 === 0;
          return (
            <div
              key={s.t}
              ref={(el) => { itemRefs.current[i] = el; }}
              data-index={i}
              className={withPhoto ? "grid sm:grid-cols-2 gap-6 items-center" : ""}
            >
              {withPhoto && (
                <img src={s.img} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl order-1 sm:order-2" />
              )}
              <div className={withPhoto ? "order-2 sm:order-1" : "max-w-xl"}>
                <p className="text-[12.5px] font-semibold text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-h3 font-heading font-bold text-ink">{s.t}</h3>
                <p className="mt-2.5 text-[15.5px] text-ink-2 leading-relaxed measure">{s.d}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DriverGuide() {
  const navigate = useNavigate();
  const { hero, steps, money, damage, faq, closer } = DRIVER_GUIDE;
  useSeo({ title: DRIVER_GUIDE.seo.title, description: DRIVER_GUIDE.seo.description, canonical: "https://kharo.co.uk/driver-guide" });

  return (
    <div className="bg-bone">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <PageHero eyebrow={hero.tag} heading={hero.heading} sub={hero.sub}
        img={hero.img} position="50% center" priority
      >
        <Button size="lg" onClick={() => navigate("/search")} data-testid="driver-guide-browse">{hero.cta} <ArrowRight size={16} /></Button>
      </PageHero>

      {/* ── STEPS: sticky index on desktop, pill track on mobile ────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="max-w-2xl mb-10">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{DRIVER_GUIDE_EXTRA.stepsHeading}</h2>
        </RevealItem>
        <RevealItem>
          <StepsIndex steps={steps} />
        </RevealItem>
      </RevealGroup>

      {/* ── MONEY: hairline definition list ──────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section">
          <RevealItem className="max-w-2xl">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{money.heading}</h2>
          </RevealItem>
          <RevealItem as="dl" className="mt-8 divide-y divide-line border-y border-line">
            {money.rows.map(([term, desc]) => (
              <div key={term} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-1 sm:gap-8 py-5">
                <dt className="text-[15.5px] font-semibold text-ink">{term}</dt>
                <dd className="text-[15px] text-ink-2 leading-relaxed">{desc}</dd>
              </div>
            ))}
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── DAMAGE TIMELINE + LIABILITY ──────────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="max-w-2xl">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{damage.heading}</h2>
        </RevealItem>
        <RevealItem as="ol" className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
          {damage.steps.map((s, i) => (
            <li key={s.when} className="relative pl-6 md:pl-0 md:pt-6 border-l md:border-l-0 md:border-t border-line">
              <span aria-hidden className="absolute -left-[5px] top-1 md:left-0 md:-top-[5px] w-[9px] h-[9px] rounded-full bg-green" />
              <p className="text-[12.5px] font-semibold text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-h3 font-heading font-bold text-ink">{s.when}</h3>
              <p className="mt-2 text-[15px] text-ink-2 leading-relaxed">{s.d}</p>
            </li>
          ))}
        </RevealItem>
        <RevealItem className="mt-12">
          <h3 className="text-h3 font-heading font-bold text-ink">{DRIVER_GUIDE_EXTRA.liabilityHeading}</h3>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {damage.liability.map(([situation, who]) => (
              <li key={situation} className="grid sm:grid-cols-2 gap-1 sm:gap-8 py-3.5">
                <span className="text-[15px] text-ink">{situation}</span>
                <span className="text-[15px] text-ink-2 sm:text-right">{who}</span>
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14">
          <RevealItem className="lg:col-span-4">
            <h2 className="text-h2 font-heading font-extrabold text-ink">{DRIVER_GUIDE_EXTRA.faqHeading}</h2>
          </RevealItem>
          <RevealItem className="lg:col-span-8">
            <Faq items={faq} testId="driver-guide-faq" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── CLOSER: compact, no band ──────────────────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{closer.heading}</h2>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/search")}>{closer.primaryCta}</Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/register")}>{closer.secondaryCta}</Button>
          </div>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
