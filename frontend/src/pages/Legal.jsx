import { LEGAL, BRAND } from "@/content/site";

const sections = LEGAL.sections;

export default function Legal() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0A0A0A]">{LEGAL.heading}</h1>
      <p className="text-gray-500 mt-3">{LEGAL.updated}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.t} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
            <h2 className="text-xl font-heading font-bold text-[#0A0A0A]">{s.t}</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">{s.b}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 text-sm text-gray-600">
        Questions about your data? Email <a href={`mailto:${BRAND.privacyEmail}`} className="text-[#0B6B4F] font-semibold hover:text-[#095B43] transition-colors">{BRAND.privacyEmail}</a>.
      </div>
    </main>
  );
}
