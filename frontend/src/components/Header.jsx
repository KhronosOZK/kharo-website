import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, Heart, User, Building2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
  const { saved, savedSales } = useAuth();
  const savedTotal = saved.length + savedSales.length;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const linkCls = ({ isActive }) =>
    `relative text-[14px] font-medium whitespace-nowrap transition-colors duration-hover ${isActive ? "text-ink" : "text-ink-2 hover:text-ink"} after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-green after:origin-left after:transition-transform after:duration-ui after:ease-out ${isActive ? "after:scale-x-100" : "after:scale-x-0"}`;

  return (
    <>
      <div ref={sentinel} aria-hidden className="absolute top-0 h-px w-px" />
      <header
        data-scrolled={scrolled || undefined}
        className={`sticky top-0 z-50 bg-bone/95 supports-[backdrop-filter]:bg-bone/80 backdrop-blur-sm transition-[box-shadow,border-color] duration-ui ease-out border-b ${scrolled ? "border-line shadow-1" : "border-transparent shadow-none"}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="wrap h-header flex items-center justify-between gap-4">
          <Link to="/" className="caro-wordmark text-[28px] text-ink leading-none" data-testid="logo-link" aria-label={`${BRAND.name} home`}>
            kharo<span className="text-green">.</span>
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
            <button onClick={() => navigate("/saved")} aria-label={`Saved vehicles, ${savedTotal} items`}
              className="pressable hidden sm:inline-flex items-center gap-1.5 h-10 px-2.5 rounded-full text-[14px] text-ink-2 hover:text-ink hover:bg-surface-2" data-testid="saved-count">
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.75} /> {savedTotal > 0 && <span className="tabular">{savedTotal}</span>}
            </button>

            <Link
              to={NAV.headerCta.to}
              data-testid="join-waitlist-link"
              className="pressable hidden md:inline-flex items-center h-10 px-4 rounded-full bg-green hover:bg-green-hover text-white text-[13.5px] font-semibold whitespace-nowrap"
            >
              {NAV.headerCta.label}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-testid="account-menu-btn" aria-label="Account menu"
                  className="pressable hidden md:inline-flex items-center gap-2 h-10 rounded-full border border-line-strong bg-surface px-3 hover:bg-surface-2">
                  <Menu className="w-4 h-4 text-ink-2" strokeWidth={1.75} />
                  <User className="w-4 h-4 text-green" strokeWidth={1.75} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 rounded-2xl bg-surface shadow-2 border-line p-1.5 duration-fast ease-out">
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
                <button className="pressable md:hidden grid place-items-center h-11 w-11 -mr-2 rounded-full hover:bg-surface-2" data-testid="mobile-menu-btn" aria-label="Open menu">
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
                  <button onClick={() => { setOpen(false); navigate("/saved"); }} data-testid="mobile-saved-link"
                    className="pressable py-3 px-3 -mx-3 text-[17px] font-medium text-ink hover:bg-surface-2 rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><Heart className="w-[18px] h-[18px] text-ink-3" strokeWidth={1.75} /> Saved cars</span>
                    {savedTotal > 0 && <span className="text-[12px] font-semibold text-green bg-green-soft rounded-full w-6 h-6 grid place-items-center tabular">{savedTotal}</span>}
                  </button>
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
