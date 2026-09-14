import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, Heart, User, Building2, Tag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BRAND, NAV } from "@/content/site";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const MENU_ICONS = [User, Building2, Tag];

export default function Header() {
  const { saved, savedSales } = useAuth();
  const savedTotal = saved.length + savedSales.length;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#E8E8E8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        <Link to="/" className="caro-wordmark text-[30px] text-[#0A0A0A]" data-testid="logo-link">
          kharo<span className="text-[#0B6B4F]">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {NAV.primary.map((l) => (
            <Link key={l.to} to={l.to} data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[14px] font-medium text-[#666] hover:text-[#0B6B4F] transition-colors whitespace-nowrap">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => navigate("/saved")} aria-label={`Saved vehicles, ${savedTotal} items`}
            className="hidden sm:inline-flex items-center gap-1.5 text-[14px] text-[#666] hover:text-[#0B6B4F] transition-colors" data-testid="saved-count">
            <Heart className="w-[18px] h-[18px]" /> {savedTotal > 0 && savedTotal}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button data-testid="account-menu-btn"
                className="hidden md:inline-flex items-center gap-2.5 rounded-full border border-[#CCC] bg-white pl-3.5 pr-2 py-1.5 hover:shadow-md transition-shadow">
                <Menu className="w-4 h-4 text-[#666]" />
                <span className="w-7 h-7 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center text-xs font-semibold"><User className="w-4 h-4" /></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white shadow-xl border-[#E8E8E8] p-1.5">
              {NAV.accountMenu.map((item, i) => {
                const Icon = MENU_ICONS[i] || User;
                return (
                  <button key={item.to} onClick={() => navigate(item.to)} data-testid={`menu-${item.title.toLowerCase().split(" ")[0]}`}
                    className="w-full text-left rounded-xl px-3 py-3 hover:bg-[#FAFAFA] transition-colors flex items-start gap-3">
                    <Icon className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.75} />
                    <span>
                      <span className="block font-semibold text-[#0A0A0A] text-[14px]">{item.title}</span>
                      <span className="block text-[12.5px] text-[#888]">{item.sub}</span>
                    </span>
                  </button>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/help")} className="cursor-pointer py-2.5 rounded-lg text-[#666]">Get help</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/legal")} className="cursor-pointer py-2.5 rounded-lg text-[#666]">Legal and privacy</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2.5 -mr-1" data-testid="mobile-menu-btn" aria-label="Open menu"><Menu className="w-6 h-6" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white overflow-y-auto">
              <div className="caro-wordmark text-3xl text-[#0A0A0A] mt-2 mb-6">kharo<span className="text-[#0B6B4F]">.</span></div>
              <div className="flex flex-col gap-1">
                <button onClick={() => { setOpen(false); navigate("/saved"); }} data-testid="mobile-saved-link"
                  className="py-3 px-2 text-base font-medium text-[#0A0A0A] hover:bg-[#FAFAFA] rounded-lg flex items-center justify-between">
                  <span className="flex items-center gap-2.5"><Heart className="w-[18px] h-[18px] text-[#888]" /> Saved vehicles</span>
                  {savedTotal > 0 && <span className="text-[12px] font-semibold text-[#0B6B4F] bg-[#EAF5F1] rounded-full w-6 h-6 flex items-center justify-center">{savedTotal}</span>}
                </button>
                {NAV.primary.map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                    className="py-3 px-2 text-base font-medium text-[#0A0A0A] hover:bg-[#FAFAFA] rounded-lg">{l.label}</Link>
                ))}
                <div className="border-t border-[#E8E8E8] my-3" />
                {NAV.mobileCtas.map((c) => (
                  <Link key={c.to} to={c.to} onClick={() => setOpen(false)}
                    className="py-3 px-2 font-semibold text-[#0B6B4F] flex items-center gap-2">{c.label} <ArrowRight className="w-4 h-4" /></Link>
                ))}
                <div className="border-t border-[#E8E8E8] my-3" />
                <Link to="/why-caro" onClick={() => setOpen(false)} className="py-3 px-2 text-[#666]">Why choose {BRAND.name}</Link>
                <Link to="/help" onClick={() => setOpen(false)} className="py-3 px-2 text-[#666]">Get help</Link>
                <Link to="/legal" onClick={() => setOpen(false)} className="py-3 px-2 text-[#666]">Legal and privacy</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
