import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, User, Building2, ArrowRight } from "lucide-react";
import { BRAND, NAV } from "@/content/site";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const MENU_ICONS = [User, Building2];

/**
 * Sticky panel header. Sits flush with the page at the top and only separates
 * (border, shadow) once content is actually scrolling underneath it.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Pages that open on a photograph mark it with data-hero-photo. Over that
  // photograph the header is transparent with white type, and turns solid
  // the moment the page scrolls, the way the dealership reference does.
  const [overHero, setOverHero] = useState(false);
  useLayoutEffect(() => {
    setOverHero(Boolean(document.querySelector("[data-hero-photo]")));
  }, [location.pathname]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const clear = overHero && !scrolled;
  const linkCls = ({ isActive }) =>
    `relative text-[14px] font-medium whitespace-nowrap transition-colors duration-hover ${clear ? (isActive ? "text-white" : "text-white/80 hover:text-white") : (isActive ? "text-ink" : "text-ink-2 hover:text-ink")} after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:rounded-full ${clear ? "after:bg-white" : "after:bg-green"} after:origin-left after:transition-transform after:duration-ui after:ease-out ${isActive ? "after:scale-x-100" : "after:scale-x-0"}`;

  return (
    <>
      <div ref={sentinel} aria-hidden className="absolute top-0 h-px w-px" />
      <header
        data-scrolled={scrolled || undefined}
        data-clear={clear || undefined}
        className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color,color] duration-ui ease-out ${clear ? "bg-transparent border-transparent shadow-none" : `bg-bone/95 supports-[backdrop-filter]:bg-bone/80 backdrop-blur-sm ${scrolled ? "border-line shadow-1" : "border-transparent shadow-none"}`}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="wrap h-header flex items-center justify-between gap-4">
          <Link to="/" className={`caro-wordmark text-[28px] leading-none transition-colors duration-ui ${clear ? "text-white" : "text-ink"}`} data-testid="logo-link" aria-label={`${BRAND.name} home`}>
            kharo<span className={clear ? "text-mint" : "text-green"}>.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Primary">
            {NAV.primary.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkCls}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to={NAV.headerCta.to}
              data-testid="join-waitlist-link"
              className={`pressable hidden md:inline-flex items-center h-10 px-4 rounded-md text-[13.5px] font-semibold whitespace-nowrap transition-colors duration-ui ${clear ? "bg-white text-ink hover:bg-bone" : "bg-green hover:bg-green-hover text-white"}`}
            >
              {NAV.headerCta.label}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-testid="account-menu-btn" aria-label="Account menu"
                  className={`pressable hidden md:inline-flex items-center gap-2 h-10 rounded-md border px-3 transition-colors duration-ui ${clear ? "border-white/35 bg-transparent text-white hover:bg-white/10" : "border-line-strong bg-surface hover:bg-surface-2"}`}>
                  <Menu className={`w-4 h-4 ${clear ? "text-white" : "text-ink-2"}`} strokeWidth={1.75} />
                  <User className={`w-4 h-4 ${clear ? "text-mint" : "text-green"}`} strokeWidth={1.75} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 rounded-lg bg-surface shadow-2 border-line p-1.5 duration-fast ease-out">
                {NAV.accountMenu.map((item, i) => {
                  const Icon = MENU_ICONS[i] || User;
                  return (
                    <button key={item.to} onClick={() => navigate(item.to)} data-testid={`menu-${item.title.toLowerCase().split(" ")[0]}`}
                      className="pressable w-full text-left rounded-xl px-3 py-3 hover:bg-surface-2 flex items-start gap-3">
                      <Icon className="w-5 h-5 text-green shrink-0 mt-0.5" strokeWidth={1.75} />
                      <span>
                        <span className="block font-semibold text-ink text-[14px]">{item.title}</span>
                        <span className="block text-[12.5px] text-ink-3">{item.sub}</span>
                      </span>
                    </button>
                  );
                })}
                <DropdownMenuSeparator className="bg-line" />
                <DropdownMenuItem onClick={() => navigate("/help")} className="cursor-pointer py-2.5 rounded-lg text-ink-2">Help</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/legal")} className="cursor-pointer py-2.5 rounded-lg text-ink-2">Legal and privacy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className={`pressable md:hidden grid place-items-center h-11 w-11 -mr-2 rounded-md ${clear ? "text-white hover:bg-white/10" : "text-ink hover:bg-surface-2"}`} data-testid="mobile-menu-btn" aria-label="Open menu">
                  <Menu className="w-6 h-6" strokeWidth={1.75} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(20rem,86vw)] bg-surface overflow-y-auto pb-safe">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="caro-wordmark text-3xl text-ink mt-1 mb-6">kharo<span className="text-green">.</span></div>
                <div className="flex flex-col gap-0.5">
                  {NAV.primary.map((l) => (
                    <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                      className={({ isActive }) => `pressable py-3 px-3 -mx-3 text-[17px] font-medium rounded-xl hover:bg-surface-2 ${isActive ? "text-green" : "text-ink"}`}>
                      {l.label}
                    </NavLink>
                  ))}
                  <div className="hairline my-3" />
                  {NAV.mobileCtas.map((c) => (
                    <Link key={c.to} to={c.to} onClick={() => setOpen(false)}
                      className="pressable py-3 px-3 -mx-3 font-semibold text-green rounded-xl hover:bg-surface-2 flex items-center gap-2">{c.label} <ArrowRight className="w-4 h-4" strokeWidth={1.75} /></Link>
                  ))}
                  <div className="hairline my-3" />
                  <Link to="/help" onClick={() => setOpen(false)} className="pressable py-3 px-3 -mx-3 rounded-xl text-ink-2 hover:bg-surface-2">Help</Link>
                  <Link to="/legal" onClick={() => setOpen(false)} className="pressable py-3 px-3 -mx-3 rounded-xl text-ink-2 hover:bg-surface-2">Legal and privacy</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
