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
    <footer className="bg-[#0E1A14] text-white">
      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Link to="/" className="caro-wordmark text-[28px] text-white inline-block">
              kharo<span className="text-[#5FD3A6]">.</span>
            </Link>
            <p className="text-[13.5px] text-white/55 mt-3 leading-relaxed max-w-[260px]">
              Rent a PCO car from a verified London operator. One weekly payment. Drive within days.
            </p>

            {/* Newsletter */}
            <div className="mt-7">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                Stay updated
              </p>
              {sent ? (
                <p className="text-[13px] text-[#5FD3A6]">
                  You're on the list. We'll be in touch.
                </p>
              ) : (
                <form onSubmit={subscribe} className="flex items-center gap-2 max-w-[240px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    data-testid="footer-newsletter-input"
                    className="flex-1 h-10 rounded-full bg-white/8 border border-white/10 px-4 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#5FD3A6]/50 transition-colors"
                  />
                  <button
                    type="submit"
                    data-testid="footer-newsletter-submit"
                    aria-label="Subscribe"
                    className="h-10 w-10 shrink-0 rounded-full bg-[#0B6B4F] hover:bg-[#5FD3A6] flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Nav columns */}
          {NAV.footerColumns.map((col) => (
            <div key={col.heading} className="col-span-1 md:col-span-2 lg:col-span-2">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[12px] text-white/35">
            {BRAND.copyright}
          </span>

          <div className="flex items-center gap-5">
            {/* Legal links */}
            <div className="flex items-center gap-4">
              <Link to="/legal" className="text-[12px] text-white/35 hover:text-white/60 transition-colors">
                Privacy
              </Link>
              <Link to="/legal" className="text-[12px] text-white/35 hover:text-white/60 transition-colors">
                Terms
              </Link>
              <Link to="/legal" className="text-[12px] text-white/35 hover:text-white/60 transition-colors">
                Cookies
              </Link>
            </div>

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex items-center gap-2" data-testid="footer-social">
                {socials.map(({ key, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    data-testid={`social-${key.toLowerCase()}`}
                    className="w-8 h-8 rounded-full bg-white/6 hover:bg-[#0B6B4F] flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-white/50" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
