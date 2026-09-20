import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { BRAND, NAV } from "@/content/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const socials = [
    { key: "Instagram", href: BRAND.social?.instagram, Icon: Instagram },
    { key: "Facebook", href: BRAND.social?.facebook, Icon: Facebook },
    { key: "LinkedIn", href: BRAND.social?.linkedin, Icon: Linkedin },
  ].filter((s) => s.href);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    try {
      await api.post("/leads", { email, source: "footer_newsletter" });
      setSent(true);
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-night text-white">
      <div className="wrap pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.6fr_repeat(3,1fr)] gap-x-6 gap-y-10 lg:gap-x-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="caro-wordmark text-[28px] text-white inline-block leading-none">
              kharo<span className="text-mint">.</span>
            </Link>
            <p className="text-[14px] text-white/60 mt-4 leading-relaxed max-w-[30ch]">
              {BRAND.footerBlurb}
            </p>

            {socials.length > 0 && (
              <div className="mt-7" data-testid="footer-social">
                <p className="text-[13px] font-semibold text-white/70 mb-2.5">Follow Kharo</p>
                <div className="flex items-center gap-2">
                  {socials.map(({ key, href, Icon }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      title={key}
                      data-testid={`social-${key.toLowerCase()}`}
                      className="pressable grid h-11 w-11 place-items-center rounded-md border border-white/15 bg-white/[0.06] text-white/70 hover:border-mint hover:bg-mint hover:text-night"
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7">
              <p className="text-[13px] font-semibold text-white/70 mb-2.5">{NAV.newsletter.heading}</p>
              {sent ? (
                <p className="text-[13.5px] text-mint">{NAV.newsletter.success}</p>
              ) : (
                <form onSubmit={subscribe} className="flex items-center gap-2 max-w-[19rem]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={NAV.newsletter.placeholder}
                    autoComplete="email"
                    inputMode="email"
                    data-testid="footer-newsletter-input"
                    className="field flex-1 h-11 rounded-full bg-white/[0.08] border border-white/15 px-4 text-base sm:text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-mint/60 focus:ring-[3px] focus:ring-mint/15"
                  />
                  <button
                    type="submit"
                    data-testid="footer-newsletter-submit"
                    aria-label="Subscribe"
                    className="pressable h-11 w-11 shrink-0 rounded-full bg-mint hover:bg-white grid place-items-center"
                  >
                    <ArrowRight className="w-4 h-4 text-night" strokeWidth={2} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {NAV.footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[13px] font-semibold text-white/50 mb-4">{col.heading}</h3>
              <ul className="space-y-2.5">
                {/* No public sign in for operators pre-launch: the account routes stay
                    mounted for the backend's email links but are never linked from here. */}
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-[14px] text-white/75 hover:text-white transition-colors duration-hover">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-3 pb-safe">
          <span className="text-[12.5px] text-white/40 text-center sm:text-left">{BRAND.copyright}</span>

          <div className="flex items-center flex-wrap justify-center gap-x-5 gap-y-2">
            <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
              <Link to="/legal" className="text-[12.5px] text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
              <Link to="/legal" className="text-[12.5px] text-white/40 hover:text-white/70 transition-colors">Terms</Link>
              <button
                onClick={() => window.dispatchEvent(new Event("kharo:open-cookie-preferences"))}
                className="text-[12.5px] text-white/40 hover:text-white/70 transition-colors"
              >
                Cookie preferences
              </button>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
