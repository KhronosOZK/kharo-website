import { RevealGroup, RevealItem } from "@/components/Reveal";
import { LEGAL, BRAND } from "@/content/site";
import { useSeo } from "@/lib/seo";

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
}

const sections = LEGAL.sections.map((s) => ({ ...s, id: slugify(s.t) }));

export default function Legal() {
  useSeo({
    title: "Legal and privacy · Kharo",
    description: "Kharo's terms of service, privacy policy and other legal notices.",
    canonical: "https://kharo.co.uk/legal",
  });

  return (
    <RevealGroup as="main" className="wrap py-section grid lg:grid-cols-12 gap-block">
      <RevealItem className="lg:col-span-4">
        <div className="lg:sticky top-below-header">
          <h1 className="text-h1 font-heading font-extrabold text-ink">{LEGAL.heading}</h1>
          <p className="mt-3 text-[13.5px] text-ink-3 leading-relaxed">{LEGAL.updated}</p>
          <nav className="mt-8 hidden lg:block" aria-label="Sections">
            <ol className="border-l border-line space-y-0.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="pressable block pl-4 py-1.5 text-[14px] text-ink-2 hover:text-green">
                    {s.t}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </RevealItem>

      <RevealItem className="lg:col-span-8 divide-y divide-line border-y border-line">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="py-8 scroll-mt-24">
            <h2 className="text-h3 font-heading font-bold text-ink">{s.t}</h2>
            <p className="mt-3 text-[15px] text-ink-2 leading-relaxed measure">{s.b}</p>
          </section>
        ))}
        <section className="py-8">
          <p className="text-[14px] text-ink-2 leading-relaxed">
            Questions about your data? Email{" "}
            <a href={`mailto:${BRAND.privacyEmail}`} className="text-green font-semibold break-all">
              {BRAND.privacyEmail}
            </a>
            .
          </p>
        </section>
      </RevealItem>
    </RevealGroup>
  );
}
