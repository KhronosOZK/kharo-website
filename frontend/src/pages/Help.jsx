import { useState } from "react";
import { Search, Mail, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import Faq from "@/components/Faq";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { HELP, BRAND } from "@/content/site";
import { useSeo } from "@/lib/seo";

export default function Help() {
  useSeo({
    title: "Help · Kharo",
    description: "Answers to the questions drivers and operators ask most, plus how to get in touch.",
    canonical: "https://kharo.co.uk/help",
  });

  const [q, setQ] = useState("");
  const filtered = HELP.faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="wrap wrap-narrow py-section">
      <RevealGroup>
        <RevealItem>
          <h1 className="text-h1 font-heading font-extrabold text-ink">{HELP.heading}</h1>
          <p className="mt-3 text-lead text-ink-2">{HELP.sub}</p>
          <div className="relative mt-6 max-w-xl">
            <Search className="w-4 h-4 text-ink-3 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={HELP.searchPlaceholder}
              className="pl-11"
              data-testid="help-search"
            />
          </div>
        </RevealItem>

        <RevealItem className="mt-10">
          {filtered.length > 0 ? (
            <Faq items={filtered} testId="help-faq" />
          ) : (
            <p className="py-10 text-center text-[15px] text-ink-3">No articles match "{q}". Try a different search.</p>
          )}
        </RevealItem>

        <RevealItem className="mt-12 panel rounded-lg p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-h3 font-heading font-bold text-ink">{HELP.contact.heading}</h2>
            <p className="mt-2 text-[15px] text-ink-2 leading-relaxed">{HELP.contact.sub}</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end sm:text-right">
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="pressable inline-flex items-center gap-2 text-[15px] font-semibold text-green break-all"
            >
              <Mail className="w-4 h-4 shrink-0" strokeWidth={1.75} /> {BRAND.supportEmail}
            </a>
            {BRAND.whatsapp && (
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi Kharo, I have a question about")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable inline-flex items-center gap-2 text-[15px] font-semibold text-ink"
              >
                <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} /> WhatsApp us
              </a>
            )}
          </div>
        </RevealItem>
      </RevealGroup>
    </main>
  );
}
