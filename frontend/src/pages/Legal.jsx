import { LEGAL, BRAND } from "@/content/site";

const sections = LEGAL.sections;

export default function Legal() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#1A2E25]">{LEGAL.heading}</h1>
      <p className="text-[#64748B] mt-3">{LEGAL.updated}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.t}>
            <h2 className="text-xl font-heading font-bold text-[#1A2E25]">{s.t}</h2>
            <p className="text-[#475569] mt-2 leading-relaxed">{s.b}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 text-sm text-[#64748B]">
        Questions about your data? Email <a href={`mailto:${BRAND.privacyEmail}`} className="text-[#0B6B4F] font-semibold">{BRAND.privacyEmail}</a>.
      </div>
    </main>
  );
}
