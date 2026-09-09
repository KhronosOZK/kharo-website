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
    if (!email.includes("@")) { toast.error("Enter a valid email address."); return; }
    try {
      await api.post("/leads", { email, source: "footer_newsletter" });
      setSent(true); setEmail("");
      toast.success("You are on the list. We will be in touch as we launch.");
    } catch { toast.error("Something went wrong. Please try again."); }
  };

  return (
    <footer className="bg-[#12211B] text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="caro-wordmark text-3xl">kharo<span className="text-[#0B6B4F]">.</span></div>
            <p className="text-sm text-white/60 mt-3 max-w-xs">{BRAND.footerBlurb}</p>
            <div className="mt-6">
              <p className="text-[13px] font-semibold text-white/90">{NAV.newsletter.heading}</p>
              <p className="text-[12.5px] text-white/50 mt-1">{NAV.newsletter.sub}</p>
              {sent ? (
                <p className="text-[13px] text-[#5FD3A6] mt-3">{NAV.newsletter.success}</p>
              ) : (
                <form onSubmit={subscribe} className="mt-3 flex items-center gap-2 max-w-xs">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={NAV.newsletter.placeholder}
                    data-testid="footer-newsletter-input"
                    className="flex-1 h-10 rounded-full bg-white/8 border border-white/12 px-4 text-[13.5px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#5FD3A6]/60" />
                  <button type="submit" data-testid="footer-newsletter-submit"
                    className="h-10 w-10 shrink-0 rounded-full bg-[#5FD3A6] text-[#0A130F] flex items-center justify-center hover:bg-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
          {NAV.footerColumns.map((c) => (
            <div key={c.heading}>
              <h4 className="text-sm font-semibold mb-4">{c.heading}</h4>
              <ul className="space-y-2 text-sm text-white/60">
                {c.links.map(([label, to]) => (<li key={label}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <span>{BRAND.copyright}</span>
          {socials.length > 0 && (
            <div className="flex items-center gap-3" data-testid="footer-social">
              {socials.map(({ key, href, Icon }) => (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={key}
                  data-testid={`social-${key.toLowerCase()}`}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#0B6B4F] flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-white/70" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
