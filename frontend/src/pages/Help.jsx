import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HELP, BRAND } from "@/content/site";

const faqs = HELP.faqs;

export default function Help() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const filtered = faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#1A2E25]">{HELP.heading}</h1>
        <p className="text-[#475569] mt-3">{HELP.sub}</p>
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="w-5 h-5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={HELP.searchPlaceholder} className="pl-11 h-12 rounded-full bg-white" data-testid="help-search" />
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-10">
        {filtered.map((f, i) => (
          <AccordionItem key={f.q} value={`f-${i}`} className="border border-slate-200 rounded-2xl mb-3 px-5 bg-white">
            <AccordionTrigger className="hover:no-underline font-heading font-bold text-[#1A2E25] text-left" data-testid={`faq-${i}`}>{f.q}</AccordionTrigger>
            <AccordionContent className="text-[#475569] leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
        {filtered.length === 0 && <div className="text-center text-[#64748B] py-10">No articles match "{q}". Try a different search.</div>}
      </Accordion>

      <div className="mt-10 bg-[#1A2E25] rounded-3xl p-8 text-center text-white">
        <MessageCircle className="w-8 h-8 text-[#0B6B4F] mx-auto" />
        <h2 className="text-2xl font-heading font-bold mt-3">{HELP.contact.heading}</h2>
        <p className="text-white/70 mt-2">{HELP.contact.sub}</p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <a href={`mailto:${BRAND.supportEmail}`}><Button className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white"><Mail className="w-4 h-4 mr-2" /> {BRAND.supportEmail}</Button></a>
          <Button onClick={() => navigate("/list-your-fleet")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"><Phone className="w-4 h-4 mr-2" /> List your fleet</Button>
        </div>
      </div>
    </main>
  );
}
