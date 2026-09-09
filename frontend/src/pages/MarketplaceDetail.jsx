import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, CalendarCheck, ShieldCheck, Gauge, Users, FileCheck, Fuel, Cog,
  MapPin, Check, Building2, User, AlertCircle, Heart, Share2, ChevronLeft,
  ChevronRight, TrendingDown, ChevronRight as Chev,
} from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MARKETPLACE } from "@/content/site";
import { useSeo, vehicleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import {
  formatPrice, formatMileage, formatDate, licenceTone, TONE_CLASSES, typeLabel, monthsLeft,
} from "@/lib/phv";
import MarketplaceInterestForm from "@/components/MarketplaceInterestForm";
import OwnershipCalculator from "@/components/OwnershipCalculator";
import SaleCard from "@/components/SaleCard";
import { Button } from "@/components/ui/button";

export default function MarketplaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedSales, toggleSavedSale } = useAuth();
  const [v, setV] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [photo, setPhoto] = useState(0);
  const enquiryRef = useRef(null);

  useEffect(() => {
    setV(null); setNotFound(false); setPhoto(0);
    window.scrollTo({ top: 0 });
    api.get(`/marketplace/${id}`).then((r) => setV(r.data)).catch(() => setNotFound(true));
  }, [id]);

  const count = v?.photos?.length || 0;
  const step = useCallback((n) => setPhoto((p) => (p + n + count) % Math.max(count, 1)), [count]);

  useEffect(() => {
    if (!count) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, step]);

  const title = v ? `${v.year} ${v.make} ${v.model}` : "";
  useSeo(v ? {
    title: `${title} for sale in ${v.borough} · ${formatPrice(v.price)} · Kharo`,
    description: `${title}, ${formatMileage(v.mileage)}, PCO licensed to ${formatDate(v.pco_expiry)}, MOT to ${formatDate(v.mot_expiry)}, ULEZ ${String(v.ulez).toLowerCase()}. For sale in ${v.seller_area}.`,
    image: v.photos?.[0],
    jsonLd: [
      vehicleJsonLd(v, window.location.href),
      breadcrumbJsonLd([
        { name: "Home", to: "/" },
        { name: "Marketplace", to: "/marketplace" },
        { name: title, to: `/marketplace/${v.id}` },
      ]),
    ],
  } : { title: "Vehicle for sale · Kharo" });

  const share = async () => {
    const data = { title, text: `${title} for sale on Kharo, ${formatPrice(v.price)}`, url: window.location.href };
    trackEvent("sale_share", { listing_id: v.id });
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied to your clipboard."); }
    } catch { /* the person cancelled the share sheet */ }
  };

  if (notFound) return (
    <main className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">That vehicle is no longer listed.</h1>
      <p className="text-[#4A564F] mt-3">It may have sold. Browse what is available now.</p>
      <Button onClick={() => navigate("/marketplace")} className="mt-7 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">
        Back to the marketplace
      </Button>
    </main>
  );

  if (!v) return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10" data-testid="md-loading">
      <div className="h-5 w-48 rounded bg-slate-200 animate-pulse" />
      <div className="grid lg:grid-cols-[1.55fr,1fr] gap-8 mt-6">
        <div className="h-[420px] rounded-[26px] bg-white ring-1 ring-slate-200/70 animate-pulse" />
        <div className="h-[420px] rounded-[26px] bg-white ring-1 ring-slate-200/70 animate-pulse" />
      </div>
    </main>
  );

  const months = v.pco_months_left ?? monthsLeft(v.pco_expiry);
  const badge = licenceTone(months);
  const SellerIcon = v.seller_type === "operator" ? Building2 : User;
  const isSaved = savedSales.includes(v.id);
  const ctx = v.price_context;
  const wellPriced = ctx && ctx.difference < 0;

  const licensing = [
    { icon: CalendarCheck, l: "PCO licence expires", v: formatDate(v.pco_expiry), note: badge.text },
    { icon: FileCheck, l: "MOT expires", v: formatDate(v.mot_expiry), note: v.mot_months_left != null ? `${v.mot_months_left} months remaining` : null },
    { icon: ShieldCheck, l: "ULEZ", v: v.ulez, note: "No daily charge in the London ULEZ" },
    { icon: MapPin, l: "Licensing authority", v: v.licensing_authority, note: `Licensed in ${v.city}` },
  ];

  const details = [
    { icon: Gauge, l: "Mileage", v: formatMileage(v.mileage) },
    { icon: Fuel, l: "Fuel", v: String(v.fuel).charAt(0).toUpperCase() + String(v.fuel).slice(1) },
    { icon: Cog, l: "Transmission", v: v.transmission },
    { icon: Users, l: "Seats", v: `${v.seats} seats` },
    { icon: FileCheck, l: "Service history", v: v.service_history },
    { icon: User, l: "Former keepers", v: `${v.owners}` },
  ];

  const goEnquiry = () => enquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <main className="bg-[#F9F8F6] pb-28 lg:pb-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        <ol className="flex items-center gap-1.5 text-[13px] text-[#7A857F] flex-wrap">
          <li><Link to="/" className="hover:text-[#0B6B4F]">Home</Link></li>
          <Chev className="w-3.5 h-3.5" aria-hidden />
          <li><Link to="/marketplace" className="hover:text-[#0B6B4F]">Marketplace</Link></li>
          <Chev className="w-3.5 h-3.5" aria-hidden />
          <li><Link to={`/marketplace?city=${encodeURIComponent(v.city)}`} className="hover:text-[#0B6B4F]">{v.city}</Link></li>
          <Chev className="w-3.5 h-3.5" aria-hidden />
          <li className="text-[#1A2E25] font-medium truncate">{title}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex items-center justify-between gap-3">
        <button onClick={() => navigate("/marketplace")} data-testid="md-back"
          className="inline-flex items-center gap-1.5 text-sm text-[#4A564F] hover:text-[#0B6B4F]">
          <ArrowLeft className="w-4 h-4" /> Back to the marketplace
        </button>
        <div className="flex items-center gap-4">
          <button onClick={share} data-testid="md-share"
            className="inline-flex items-center gap-1.5 text-sm text-[#4A564F] hover:text-[#0B6B4F]">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={() => toggleSavedSale(v.id)} data-testid="md-save" aria-pressed={isSaved}
            className="inline-flex items-center gap-1.5 text-sm text-[#4A564F] hover:text-[#0B6B4F]">
            <Heart className={`w-4 h-4 ${isSaved ? "fill-[#B4472E] text-[#B4472E]" : ""}`} /> {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 grid lg:grid-cols-[1.55fr,1fr] gap-8 lg:gap-12">
        {/* LEFT */}
        <div>
          <div className="relative rounded-[26px] overflow-hidden bg-[#EFEDE8] aspect-[16/10] group">
            <img src={v.photos[photo]} alt={`${title}, photo ${photo + 1} of ${count}`}
              className="w-full h-full object-cover" data-testid="md-photo" />
            {count > 1 && (
              <>
                <button onClick={() => step(-1)} aria-label="Previous photo" data-testid="md-prev"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                  <ChevronLeft className="w-5 h-5 text-[#1A2E25]" />
                </button>
                <button onClick={() => step(1)} aria-label="Next photo" data-testid="md-next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-[#1A2E25]" />
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 backdrop-blur text-white text-[12px] px-2.5 py-1">
                  {photo + 1} / {count}
                </span>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
            {v.photos.map((p, i) => (
              <button key={p} onClick={() => setPhoto(i)} data-testid={`md-thumb-${i}`}
                aria-label={`Show photo ${i + 1}`} aria-current={i === photo}
                className={`w-24 h-16 shrink-0 rounded-xl overflow-hidden ring-2 transition-all ${i === photo ? "ring-[#0B6B4F]" : "ring-transparent opacity-70 hover:opacity-100"}`}>
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold ${TONE_CLASSES[badge.tone]}`} data-testid="md-pco-badge">
                <CalendarCheck className="w-3.5 h-3.5" /> {badge.text}
              </span>
              <span className="rounded-full bg-[#E7E4DD] text-[#4A564F] px-3 py-1 text-[12.5px] font-medium">{typeLabel(v.vehicle_type)}</span>
              <span className="rounded-full bg-[#E7E4DD] text-[#4A564F] px-3 py-1 text-[12.5px] font-medium capitalize">{v.fuel}</span>
              {v.status === "under_offer" && (
                <span className="rounded-full bg-[#1A2E25] text-white px-3 py-1 text-[12.5px] font-semibold">Under offer</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-[42px] font-heading font-extrabold text-[#1A2E25] mt-3 leading-tight" data-testid="md-title">{title}</h1>
            <p className="text-[#4A564F] mt-1.5 text-[15px]">{v.colour} · {v.plate} · {v.seller_area}</p>
          </div>

          {/* LICENSING */}
          <section className="mt-9">
            <h2 className="text-xl font-heading font-bold text-[#1A2E25]">{MARKETPLACE.detail.licensingHeading}</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-4" data-testid="md-licensing">
              {licensing.map((row) => (
                <div key={row.l} className="bg-white rounded-2xl ring-1 ring-slate-200/70 p-4 flex gap-3">
                  <row.icon className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.7} />
                  <div className="min-w-0">
                    <div className="text-[12.5px] text-[#7A857F]">{row.l}</div>
                    <div className="font-heading font-bold text-[#1A2E25] text-[15px] mt-0.5">{row.v}</div>
                    {row.note && <div className="text-[12.5px] text-[#4A564F] mt-0.5">{row.note}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-[#E6F5F0] border border-[#0B6B4F]/15 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.7} />
              <p className="text-[13.5px] text-[#1A2E25] leading-relaxed">{MARKETPLACE.pcoNote.body}</p>
            </div>
          </section>

          {/* VEHICLE DETAILS */}
          <section className="mt-9">
            <h2 className="text-xl font-heading font-bold text-[#1A2E25]">{MARKETPLACE.detail.vehicleHeading}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4" data-testid="md-details">
              {details.map((row) => (
                <div key={row.l} className="bg-white rounded-2xl ring-1 ring-slate-200/70 p-4">
                  <row.icon className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.7} />
                  <div className="text-[12.5px] text-[#7A857F] mt-2.5">{row.l}</div>
                  <div className="font-heading font-bold text-[#1A2E25] text-[15px]">{row.v}</div>
                </div>
              ))}
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="mt-9">
            <h2 className="text-xl font-heading font-bold text-[#1A2E25]">{MARKETPLACE.detail.descriptionHeading}</h2>
            <p className="text-[#4A564F] mt-3 text-[16px] leading-relaxed">{v.description}</p>
            {v.features?.length > 0 && (
              <>
                <h3 className="font-heading font-bold text-[#1A2E25] mt-6">{MARKETPLACE.detail.featuresHeading}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {v.features.map((ft) => (
                    <span key={ft} className="rounded-full bg-white ring-1 ring-slate-200 text-[#3B4A44] px-3 py-1.5 text-[13px]">{ft}</span>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* BUY VS RENT */}
          <OwnershipCalculator vehicle={v} typicalWeeklyRent={v.typical_weekly_rent} />

          {/* BUYER CHECKLIST */}
          <section className="mt-9">
            <h2 className="text-xl font-heading font-bold text-[#1A2E25]">{MARKETPLACE.detail.checklistHeading}</h2>
            <ul className="mt-4 space-y-3" data-testid="md-checklist">
              {MARKETPLACE.detail.checklist.map((c) => (
                <li key={c} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] text-[#1A2E25] leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* RIGHT, sticky enquiry panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start" ref={enquiryRef}>
          <div className="bg-white rounded-[26px] ring-1 ring-slate-200 p-6 sm:p-7 shadow-xl">
            <div className="text-[12px] text-[#7A857F] uppercase tracking-[0.16em]">Asking price</div>
            <div className="text-[40px] font-heading font-extrabold text-[#1A2E25] leading-none mt-1" data-testid="md-price">
              {formatPrice(v.price)}
            </div>
            <div className="text-[13.5px] text-[#4A564F] mt-1.5">
              {v.open_to_offers ? "Open to sensible offers" : "Fixed price"}
              {v.part_exchange ? " · part exchange considered" : ""}
            </div>

            {ctx && (
              <div className={`mt-3 rounded-2xl p-3 flex gap-2.5 items-start ${wellPriced ? "bg-[#E6F5F0]" : "bg-[#F9F8F6]"}`} data-testid="md-price-context">
                <TrendingDown className={`w-4 h-4 shrink-0 mt-0.5 ${wellPriced ? "text-[#0B6B4F]" : "text-[#7A857F]"}`} strokeWidth={1.8} />
                <p className="text-[12.5px] text-[#1A2E25] leading-relaxed">
                  {wellPriced
                    ? `${formatPrice(-ctx.difference)} below the typical asking price for a ${v.fuel} ${typeLabel(v.vehicle_type).toLowerCase()} on Kharo, across ${ctx.sample} comparable listings.`
                    : `Around the typical asking price for a ${v.fuel} ${typeLabel(v.vehicle_type).toLowerCase()} on Kharo, across ${ctx.sample} comparable listings.`}
                </p>
              </div>
            )}

            <div className="h-px bg-slate-200 my-5" />

            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#0B6B4F]/[0.08] flex items-center justify-center">
                <SellerIcon className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.7} />
              </span>
              <div>
                <div className="text-[12.5px] text-[#7A857F]">{MARKETPLACE.detail.sellerHeading}</div>
                <div className="font-heading font-bold text-[#1A2E25] text-[15px]">{v.seller_label}, {v.seller_area}</div>
              </div>
            </div>
            <p className="text-[13px] text-[#4A564F] mt-3 leading-relaxed">{v.reason_for_sale}.</p>

            <div className="h-px bg-slate-200 my-5" />

            <h2 className="font-heading font-bold text-[#1A2E25] text-[17px]">{MARKETPLACE.detail.interestCta}</h2>
            <p className="text-[13px] text-[#4A564F] mt-1.5 mb-5 leading-relaxed">{MARKETPLACE.detail.interestNote}</p>

            <MarketplaceInterestForm defaultIntent="buy" showToggle={false} listingId={v.id} listingLabel={title} city={v.city} />
          </div>
        </aside>
      </div>

      {/* SIMILAR */}
      {v.similar?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16" data-testid="md-similar">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25]">Similar vehicles for sale</h2>
          <p className="text-[#4A564F] mt-1.5">Comparable cars at a similar price, so you can weigh them side by side.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {v.similar.map((s) => <SaleCard key={s.id} v={s} />)}
          </div>
        </section>
      )}

      {/* MOBILE STICKY BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3"
        data-testid="md-mobile-bar">
        <div className="min-w-0">
          <div className="text-[20px] font-heading font-extrabold text-[#1A2E25] leading-none">{formatPrice(v.price)}</div>
          <div className="text-[11.5px] text-[#7A857F] mt-1 truncate">{badge.text} · {formatMileage(v.mileage)}</div>
        </div>
        <Button onClick={goEnquiry} data-testid="md-mobile-cta"
          className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold shrink-0 h-11 px-5">
          Enquire
        </Button>
      </div>
    </main>
  );
}
