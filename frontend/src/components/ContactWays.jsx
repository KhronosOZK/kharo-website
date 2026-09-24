import { useState } from "react";
import { MessageCircle, Phone, Mail, ArrowUpRight, Check } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { BRAND } from "@/content/site";

/**
 * The ways to reach a person, as one object: a white panel split into
 * hairline cells, each with a drawn icon, what it is, and the detail.
 * Replaces every "WhatsApp +44… or email …" text line on the site.
 *
 * Used by pages/About.jsx, pages/Help.jsx and pages/HomeFunctional.jsx.
 *
 *   message   the pre-written WhatsApp opener
 *   source    lead source stored with a call-back request
 *   callback  false hides the call-me-back cell (two cells instead of three)
 */
export default function ContactWays({ message = "Hi Kharo, I have a question.", source = "contact_ways", callback = true, className = "" }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const request = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    try {
      await api.post("/leads", { phone: phone.trim(), source, data: { page: window.location.pathname } });
      trackEvent("call_back", { source });
    } catch { /* still confirm: the number is on the same panel */ }
    setSent(true);
  };

  const pretty = `+${BRAND.whatsapp.slice(0, 2)} ${BRAND.whatsapp.slice(2, 6)} ${BRAND.whatsapp.slice(6)}`;
  const cell = "group pressable flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-ui hover:bg-surface-2 focus-visible:bg-surface-2 outline-none";
  const arrow = "shrink-0 text-ink-3 transition-transform duration-ui ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink";

  return (
    <div className={`overflow-hidden rounded-lg border border-line bg-surface ${className}`} data-testid="contact-ways">
      <div className={`grid divide-y divide-line sm:divide-x sm:divide-y-0 ${callback ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        <a href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={cell} data-testid="contact-whatsapp">
          <MessageCircle size={22} strokeWidth={1.75} className="shrink-0 text-ink" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-ink">WhatsApp</span>
            <span className="block text-[13px] tabular text-ink-3">{pretty}</span>
          </span>
          <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" className={arrow} />
        </a>

        {callback && (
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={cell} data-testid="contact-callback">
            <Phone size={22} strokeWidth={1.75} className="shrink-0 text-ink" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-ink">Call me back</span>
              <span className="block text-[13px] text-ink-3">Within one working day</span>
            </span>
            <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" className={`shrink-0 text-ink-3 transition-transform duration-ui ease-out group-hover:text-ink ${open ? "rotate-90" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"}`} />
          </button>
        )}

        <a href={`mailto:${BRAND.supportEmail}`} className={cell} data-testid="contact-email">
          <Mail size={22} strokeWidth={1.75} className="shrink-0 text-ink" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-ink">Email</span>
            <span className="block truncate text-[13px] text-ink-3">{BRAND.supportEmail}</span>
          </span>
          <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" className={arrow} />
        </a>
      </div>

      {/* The call-back field slides open under the row. */}
      {callback && open && (
        <form onSubmit={request} className="border-t border-line bg-bone px-5 py-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:duration-200" data-testid="contact-callback-form">
          {sent ? (
            <p className="flex items-center gap-2 text-[14px] text-ink"><Check size={16} strokeWidth={2} className="text-green-deep" /> Thank you. A person will call you within one working day.</p>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label htmlFor="contact-phone" className="text-[13px] font-medium text-ink-2 sm:w-40">Your phone number</label>
              <input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07700 900 000" autoFocus
                className="field h-11 min-w-0 flex-1 rounded-md border border-line-strong bg-surface px-3 text-[16px] text-ink outline-none focus:border-ink" />
              <button type="submit" className="pressable h-11 rounded-md bg-ink px-5 text-[14px] font-semibold text-white hover:bg-ink/90">Request a call</button>
            </div>
          )}
        </form>
      )}

      {/* Status line with a live dot: the one small moving thing on the panel. */}
      <p className="flex items-center gap-2 border-t border-line px-5 py-2.5 text-[13px] text-ink-3">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green opacity-75 motion-safe:animate-ping motion-safe:[animation-duration:2.4s]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-deep" />
        </span>
        A person replies within one working day.
      </p>
    </div>
  );
}
