import { useState } from "react";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { LEGAL, BRAND } from "@/content/site";
import { useSeo } from "@/lib/seo";

/** The right to erasure, as a form rather than an email address to find. */
function DeleteRequest() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try { await api.post("/privacy/delete-request", { email: email.trim() }); setState("done"); }
    catch { setState("error"); }
  };
  return (
    <form onSubmit={submit} className="mt-8 rounded-lg border border-line bg-surface p-5" data-testid="delete-request">
      <p className="font-heading text-[16px] font-bold text-ink">Delete my details</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">Type the email you gave us. We delete everything we hold about you within one month and confirm by email.</p>
      {state === "done" ? (
        <p className="mt-3 text-[13.5px] font-medium text-green-deep">Thank you. We have your request.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Your email"
            className="field h-11 min-w-0 flex-1 rounded-md border border-line-strong bg-surface px-3 text-[15px] text-ink outline-none focus:border-ink" />
          <Button type="submit" disabled={state === "sending"} className="shrink-0">Delete my details</Button>
        </div>
      )}
      {state === "error" && <p className="mt-2 text-[13px] text-danger">That did not send. Email {BRAND.privacyEmail} instead.</p>}
    </form>
  );
}

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
          <DeleteRequest />
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
