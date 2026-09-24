import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import ContactWays from "@/components/ContactWays";
import { useSeo } from "@/lib/seo";
import { ABOUT } from "@/content/site";

const ENTER = "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-safe:fill-mode-both";

// The photo strip runs six frames of different widths in one row, the way
// the reference does. Columns are the frame widths; the row is one height.
const STRIP_COLS = "lg:grid-cols-[1.15fr_1.9fr_1.5fr_1.9fr_1.5fr_1.15fr]";

/** A founder: the portrait inside a white card, the name and role under it
 * (the same object as a vehicle card, which is why it belongs on this site).
 * Until the photograph exists the frame carries the wordmark's green dot and
 * "Photo to follow" rather than pretending. */
function PersonCard({ person, placeholder }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="rounded-lg border border-line bg-surface p-2" data-testid="about-person">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-2">
        {!missing ? (
          <img src={person.img} alt={person.name} loading="lazy" onError={() => setMissing(true)} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <span aria-hidden="true" className="mx-auto block h-3 w-3 rounded-full bg-green" />
              <span className="mt-3 block text-[13px] text-ink-3">{placeholder}</span>
            </div>
          </div>
        )}
      </div>
      <div className="px-3 pb-3 pt-4">
        <p className="font-heading text-[19px] font-bold leading-tight text-ink">{person.name}</p>
        <p className="mt-1 text-[13px] text-ink-3">{person.role}</p>
        {person.bio && <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{person.bio}</p>}
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const { heading, sub, strip, story, values, team, closer } = ABOUT;
  useSeo({ title: ABOUT.seo.title, description: ABOUT.seo.description, canonical: "https://kharo.co.uk/about" });

  return (
    <div className="bg-bone">
      {/* ── Page top: one heading, one line. Nothing else. ─────────────── */}
      <section className="wrap pt-12 sm:pt-16">
        <h1 className={`${ENTER} font-heading text-[clamp(2.75rem,1.6rem+5vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink`}>{heading}</h1>
        <p className={`${ENTER} mt-5 max-w-[46ch] text-lead text-ink-2 motion-safe:[animation-delay:90ms]`}>{sub}</p>
      </section>

      {/* ── Six frames, one row, different widths. Scrolls on a phone. ──── */}
      <section className="mt-10 sm:mt-12" aria-label="Kharo in pictures">
        <div className={`${ENTER} wrap motion-safe:[animation-delay:180ms]`}>
          <div className={`-mx-[var(--gutter)] flex h-56 snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] scroll-px-[var(--gutter)] hide-scrollbar sm:h-64 lg:mx-0 lg:grid lg:h-72 lg:px-0 ${STRIP_COLS}`}>
            {strip.map((src, i) => (
              <div key={i} className="h-full w-[68vw] shrink-0 snap-start overflow-hidden rounded-lg bg-surface-2 sm:w-[44vw] lg:w-auto">
                <img src={src} alt="" loading={i < 3 ? "eager" : "lazy"} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why we started, and what we stand for ───────────────────────── */}
      <RevealGroup as="section" className="wrap py-section">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <RevealItem className="lg:col-span-4">
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-surface-2">
              <img src={story.img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </RevealItem>
          <div className="lg:col-span-8">
            <RevealItem>
              <h2 className="text-h2 font-heading font-extrabold tracking-[-0.02em] text-ink">{story.heading}</h2>
              <div className="mt-5 max-w-[62ch] space-y-4">
                {story.body.map((p) => <p key={p} className="text-[16px] leading-[1.6] text-ink-2">{p}</p>)}
              </div>
            </RevealItem>
            <RevealItem className="mt-12">
              <h3 className="text-[13px] font-semibold text-ink-3">{values.heading}</h3>
              <ol className="mt-3 grid border-t border-line sm:grid-cols-2 sm:gap-x-12">
                {values.items.map((v, i) => (
                  <li key={v.t} className="border-b border-line py-6">
                    <span className="block text-[13px] tabular text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-3 font-heading text-[20px] font-bold leading-tight text-ink">{v.t}</p>
                    <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-ink-2">{v.d}</p>
                  </li>
                ))}
              </ol>
            </RevealItem>
          </div>
        </div>
      </RevealGroup>

      {/* ── The founders: photo in a white card, name under it ──────────── */}
      <RevealGroup as="section" className="border-t border-line bg-surface">
        <div className="wrap py-section">
          <RevealItem className="max-w-2xl">
            <h2 className="text-h2 font-heading font-extrabold tracking-[-0.02em] text-ink">{team.heading}</h2>
            <p className="mt-3 text-lead text-ink-2">{team.sub}</p>
          </RevealItem>
          <RevealItem className="mt-10 grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
            {team.people.map((p) => <PersonCard key={p.name} person={p} placeholder={team.photoToFollow} />)}
          </RevealItem>
          <RevealItem className="mt-8 lg:max-w-3xl">
            <ContactWays message="Hi Omed and Walid, I have a question about Kharo." source="about_page" />
          </RevealItem>
        </div>
      </RevealGroup>

      {/* ── Closer ──────────────────────────────────────────────────────── */}
      <section className="bg-night text-white">
        <div className="wrap grid gap-6 py-14 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-h2 font-heading font-extrabold tracking-[-0.02em]">{closer.heading}</h2>
            <p className="mt-3 max-w-[50ch] text-lead text-white/75">{closer.sub}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/register")}>{closer.driverCta} <ArrowRight size={16} strokeWidth={2} /></Button>
            <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10" onClick={() => navigate("/list-your-fleet")}>{closer.operatorCta}</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
