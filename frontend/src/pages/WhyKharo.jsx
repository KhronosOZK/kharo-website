import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInView } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { RevealGroup, RevealItem, Enter } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { DUR, EASE } from "@/lib/motion";
import { useSeo } from "@/lib/seo";
import { WHY } from "@/content/site";
import { ONE_PLATFORM, CLOSER_PANELS } from "@/content/pages/whyKharo";

/** The 12,712 figure, counting up once from zero the moment it scrolls into view. */
function GapFigure({ value, label, source }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <AnimatedNumber
          value={inView ? value : 0}
          from={0}
          transition={{ duration: DUR.count, ease: EASE.out }}
          className="text-stat font-heading font-extrabold text-green tabular"
        />
        <p className="text-[15.5px] text-ink max-w-[26ch] leading-snug">{label}</p>
      </div>
      <p className="mt-3 text-[12.5px] text-ink-3">{source}</p>
    </div>
  );
}

export default function WhyKharo() {
  const navigate = useNavigate();
  const { hero, gap, drivers, operators, honesty, closer } = WHY;
  useSeo({ title: WHY.seo.title, description: WHY.seo.description, canonical: "https://kharo.co.uk/why-kharo" });

  const [gapValue] = useState(() => Number(String(gap.number).replace(/[^0-9]/g, "")));

  return (
    <div className="bg-bone">
      {/* ── HERO: photograph, headline, sub. Nothing floating. ──────────── */}
      <section className="relative isolate overflow-hidden text-white">
        <img src={hero.img} alt="" className="absolute inset-0 h-full w-full object-cover object-[55%_center]" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/30 to-night/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/50 via-night/15 to-transparent" />
        <div className="wrap relative min-h-[64svh] flex flex-col justify-end pt-[clamp(4rem,10vh,7rem)] pb-[clamp(2rem,6vh,4rem)]">
          <Enter as="h1" className="text-display font-heading font-extrabold max-w-[18ch] drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
            {hero.heading}
          </Enter>
          <Enter as="p" delay={0.06} className="mt-4 text-lead text-white/85 max-w-[42ch] drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
            {hero.sub}
          </Enter>
        </div>
      </section>

      {/* ── THE GAP: one editorial figure, a lead paragraph beside it ──── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap py-section grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <RevealItem className="lg:col-span-5">
            <GapFigure value={gapValue} label={gap.label} source={gap.source} />
          </RevealItem>
          <RevealItem className="lg:col-span-7">
            <p className="text-lead text-ink-2 measure">{gap.body}</p>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── ONE PLATFORM, NOT FIVE: the argument, as a comparison ───────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem className="max-w-2xl">
          <h2 className="text-h2 font-heading font-extrabold text-ink">{ONE_PLATFORM.heading}</h2>
          <p className="mt-4 text-lead text-ink-2">{ONE_PLATFORM.body}</p>
        </RevealItem>
        <RevealItem className="mt-10 grid md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <h3 className="text-h3 font-heading font-bold text-ink-3">{ONE_PLATFORM.without.heading}</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {ONE_PLATFORM.without.items.map((it) => (
                <li key={it} className="py-4 text-[15px] text-ink-3">{it}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-h3 font-heading font-bold text-ink">{ONE_PLATFORM.with.heading}</h3>
            <div className="mt-4 border-t-2 border-green pt-5">
              <p className="text-[17px] font-medium text-ink leading-relaxed">{ONE_PLATFORM.with.line}</p>
              <p className="mt-3 text-[14px] text-ink-3 leading-relaxed measure">{ONE_PLATFORM.with.note}</p>
            </div>
          </div>
        </RevealItem>
      </RevealGroup>

      {/* ── FOR DRIVERS: photo left, argument right ─────────────────────── */}
      <RevealGroup as="section" className="wrap py-section grid lg:grid-cols-12 gap-block items-center">
        <RevealItem className="lg:col-span-6 lg:order-1 zoom-media">
          <img src={drivers.img} alt="" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-2xl" data-zoom />
        </RevealItem>
        <RevealItem className="lg:col-span-6 lg:order-2">
          <h2 className="text-h2 font-heading font-extrabold text-ink max-w-[16ch]">{drivers.heading}</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {drivers.points.map((p) => (
              <li key={p.t} className="py-4">
                <p className="text-[15.5px] font-semibold text-ink">{p.t}</p>
                <p className="mt-1.5 text-[14.5px] text-ink-2 leading-relaxed">{p.d}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button onClick={() => navigate("/for-drivers")} data-testid="why-drivers-cta">
              {drivers.cta} <ArrowRight size={16} />
            </Button>
          </div>
        </RevealItem>
      </RevealGroup>

      {/* ── FOR OPERATORS: mirrored, text left, photo right ─────────────── */}
      <RevealGroup as="section" className="wrap py-section grid lg:grid-cols-12 gap-block items-center">
        <RevealItem className="lg:col-span-6 lg:order-1">
          <h2 className="text-h2 font-heading font-extrabold text-ink max-w-[16ch]">{operators.heading}</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {operators.points.map((p) => (
              <li key={p.t} className="py-4">
                <p className="text-[15.5px] font-semibold text-ink">{p.t}</p>
                <p className="mt-1.5 text-[14.5px] text-ink-2 leading-relaxed">{p.d}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button onClick={() => navigate("/operator-guide")} data-testid="why-operators-cta">
              {operators.cta} <ArrowRight size={16} />
            </Button>
          </div>
        </RevealItem>
        <RevealItem className="lg:col-span-6 lg:order-2 zoom-media">
          <img src={operators.img} alt="" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-2xl" data-zoom />
        </RevealItem>
      </RevealGroup>

      {/* ── WHAT WE WILL NOT DO ──────────────────────────────────────────── */}
      <section className="bg-surface border-y border-line">
        <RevealGroup className="wrap wrap-mid py-section">
          <RevealItem>
            <h2 className="text-h2 font-heading font-extrabold text-ink max-w-[20ch]">{honesty.heading}</h2>
          </RevealItem>
          <RevealItem as="ul" className="mt-8 divide-y divide-line border-y border-line">
            {honesty.items.map((it) => (
              <li key={it} className="flex items-start gap-3 py-4 text-[15.5px] text-ink">
                <Check className="w-4 h-4 text-green shrink-0 mt-1" strokeWidth={1.75} /> {it}
              </li>
            ))}
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── CLOSER: the hub. Two panels, plus two more ways through. ────── */}
      <RevealGroup as="section" className="wrap py-section">
        <RevealItem>
          <h2 className="text-h2 font-heading font-extrabold text-ink mb-8">{closer.heading}</h2>
        </RevealItem>
        <RevealItem className="grid md:grid-cols-2 gap-4">
          <div className="panel rounded-2xl p-6 sm:p-8">
            <h3 className="text-h3 font-heading font-bold text-ink">{CLOSER_PANELS.driver.heading}</h3>
            <p className="mt-2 text-[15px] text-ink-2 leading-relaxed">{CLOSER_PANELS.driver.body}</p>
            <div className="mt-6">
              <Button onClick={() => navigate(CLOSER_PANELS.driver.to)}>{closer.driverCta} <ArrowRight size={16} /></Button>
            </div>
          </div>
          <div className="panel rounded-2xl p-6 sm:p-8">
            <h3 className="text-h3 font-heading font-bold text-ink">{CLOSER_PANELS.operator.heading}</h3>
            <p className="mt-2 text-[15px] text-ink-2 leading-relaxed">{CLOSER_PANELS.operator.body}</p>
            <div className="mt-6">
              <Button onClick={() => navigate(CLOSER_PANELS.operator.to)}>{closer.operatorCta} <ArrowRight size={16} /></Button>
            </div>
          </div>
        </RevealItem>
        <RevealItem className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/driver-guide" className="pressable text-[14.5px] font-semibold text-green hover:underline underline-offset-4">How renting works</Link>
          <Link to="/list-your-fleet" className="pressable text-[14.5px] font-semibold text-green hover:underline underline-offset-4">List your fleet</Link>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
