import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Share2, MapPin, Check, RotateCw, Shield, Zap } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PRICING_TIERS, weeklyForWeeks } from "@/lib/pricing";
import PreviewNotice from "@/components/PreviewNotice";
import ApproxAreaMap from "@/components/ApproxAreaMap";
import { Button } from "@/components/ui/button";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { getMockById } from "@/data/mockListings";
import { areaCoords } from "@/lib/geo";
import { DETAIL } from "@/content/pages/marketplace";

function experienceLabel(months) {
  if (!months) return DETAIL.experienceOpen;
  if (months >= 12) return `${Math.round(months / 12)}+ years`;
  return `${months}+ months`;
}

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saved, toggleSaved } = useAuth();
  const [v, setV] = useState(null);
  const [photo, setPhoto] = useState(0);
  const [weeks, setWeeks] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Handle mock vehicle IDs without making API calls
    if (id && id.startsWith("mock-")) {
      const mockVehicle = getMockById(id);
      if (mockVehicle) {
        setV(mockVehicle);
      } else {
        navigate("/search");
      }
      return;
    }
    api
      .get(`/listings/${id}`)
      .then((r) => {
        setV(r.data);
        trackEvent("vehicle_view", { listing_id: id });
      })
      .catch(() => navigate("/search"));
  }, [id, navigate]);

  useSeo({
    title: v ? `${v.make} ${v.model} ${v.year} for Rent · Kharo` : "Loading · Kharo",
    description: v
      ? `Rent a ${v.year} ${v.make} ${v.model} in ${v.borough} from £${v.weekly_rent}/week. PCO-licensed, checked operator.`
      : undefined,
    jsonLd: v
      ? breadcrumbJsonLd([
          { name: "Home", to: "/" },
          { name: "Search", to: "/search" },
          { name: v.city, to: `/search?city=${encodeURIComponent(v.city)}` },
          { name: `${v.make} ${v.model}`, to: `/vehicle/${v.id}` },
        ])
      : undefined,
  });

  if (!v) {
    return (
      <div className="min-h-page bg-bone grid place-items-center">
        <p className="text-ink-3 text-[15px]">Loading vehicle</p>
      </div>
    );
  }

  const rentWeekly = weeklyForWeeks(v.weekly_rent, weeks);
  const isSaved = saved.includes(v.id);
  const [lat, lon] = areaCoords(v.borough, v.city);

  const isElectric = (v.fuel || "").toLowerCase() === "electric";
  // Mock listings often repeat the same photo url in every slot: only offer
  // gallery navigation when there's more than one genuinely distinct image.
  const uniquePhotoCount = new Set(v.photos).size;

  const specs = [
    { label: DETAIL.specs.fuel, value: v.fuel, capitalize: true },
    { label: DETAIL.specs.seats, value: v.seats },
    ...(v.mpg ? [{ label: DETAIL.specs.economy, value: `${v.mpg} mpg` }] : []),
    { label: DETAIL.specs.mileage, value: `${v.mileage_allowance} miles` },
    { label: DETAIL.specs.experience, value: experienceLabel(v.min_experience) },
    { label: DETAIL.specs.deposit, value: `£${v.deposit}, returned at end` },
    { label: DETAIL.specs.servicing, value: v.designated_garage },
    { label: DETAIL.specs.restrictions, value: v.restrictions || DETAIL.specs.none },
  ];

  const included = [
    DETAIL.covers.compliance,
    v.breakdown_included ? DETAIL.covers.breakdownIncluded : DETAIL.covers.breakdownAvailable,
    DETAIL.covers.servicingAt(v.designated_garage),
  ];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const handleApply = () => {
    trackEvent("apply_click", { listing_id: id, weeks });
    navigate(`/apply/${v.id}?weeks=${weeks}`);
  };

  return (
    <div className="min-h-page bg-bone pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="wrap py-6 lg:py-8">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1.5 text-[13px] text-ink-3 flex-wrap">
            <li><Link to="/" className="hover:text-green">{DETAIL.breadcrumbHome}</Link></li>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <li><Link to="/search" className="hover:text-green">{DETAIL.breadcrumbSearch}</Link></li>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <li><Link to={`/search?city=${encodeURIComponent(v.city)}`} className="hover:text-green">{v.city}</Link></li>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <li className="text-ink font-medium truncate">{v.make} {v.model}</li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="pressable inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-green"
            data-testid="back-btn"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            {DETAIL.back}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { toggleSaved(v.id); trackEvent("save", { listing_id: id }); }}
              className="pressable inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-green"
              data-testid="detail-save"
              aria-pressed={isSaved}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-ink text-ink" : ""}`} strokeWidth={1.75} />
              {isSaved ? DETAIL.saved : DETAIL.save}
            </button>
            <button
              onClick={handleShare}
              className="pressable inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-green"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.75} />
              {copied ? DETAIL.shareCopied : DETAIL.share}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative rounded-lg overflow-hidden aspect-[4/3] sm:aspect-[3/2] bg-surface-2" data-testid="gallery-main">
          <img src={v.photos?.[photo]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
          {uniquePhotoCount > 1 && (
            <>
              <button
                data-testid="gallery-prev"
                onClick={() => setPhoto((photo - 1 + v.photos.length) % v.photos.length)}
                className="pressable panel rounded-md absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 text-ink" strokeWidth={1.75} />
              </button>
              <button
                data-testid="gallery-next"
                onClick={() => setPhoto((photo + 1) % v.photos.length)}
                className="pressable panel rounded-md absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5 text-ink" strokeWidth={1.75} />
              </button>
              <span className="absolute bottom-3 right-3 text-[12px] font-medium text-white bg-ink/60 rounded-md px-2 py-1 tabular">
                {photo + 1} / {v.photos.length}
              </span>
            </>
          )}
        </div>
        {isElectric && (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-green mt-2.5">
            <Zap className="w-3.5 h-3.5" strokeWidth={1.75} /> Electric, ULEZ exempt
          </p>
        )}

        {uniquePhotoCount > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
            {v.photos.map((p, i) => (
              <button
                key={`${p}-${i}`}
                onClick={() => setPhoto(i)}
                className={`pressable w-20 h-14 rounded-md overflow-hidden shrink-0 ring-2 ${photo === i ? "ring-green" : "ring-transparent opacity-60"}`}
                aria-label={`View photo ${i + 1}`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <PreviewNotice variant="inline" className="lg:hidden mt-4" />

        <div className="grid lg:grid-cols-[1fr_21rem] gap-8 mt-6 items-start">
          {/* ── ONE TYPOGRAPHIC COLUMN ─────────────────────────────────── */}
          <div>
            <div className="pb-6">
              <h1 className="text-h1 font-heading font-extrabold text-ink leading-tight">
                {v.make} {v.model} {v.year}
              </h1>
              <p className="mt-2 text-[14px] text-ink-3">{v.colour}, {v.mileage?.toLocaleString()} miles on the clock</p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green" strokeWidth={1.75} />
                  Operator licence checked
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green" strokeWidth={1.75} />
                  Companies House checked
                </span>
                <span className="flex items-center gap-1.5 text-ink-3">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {v.borough}, {v.city}
                </span>
              </div>

              <div className="mt-6 pt-6 hairline">
                <p className="text-[15px] text-ink-2 leading-relaxed measure">{v.description}</p>
                {v.features?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {v.features.map((f) => (
                      <span key={f} className="text-[13px] text-ink-2 bg-surface-2 border border-line px-3 py-1.5 rounded-md">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <section className="hairline py-6">
              <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.whatCoversHeading}</h2>
              <ul className="mt-4 space-y-3">
                {included.map((text) => (
                  <li key={text} className="flex items-start gap-3 text-[15px] text-ink-2">
                    <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={1.75} />
                    {text}
                  </li>
                ))}
              </ul>
            </section>

            <section className="hairline py-6">
              <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.pricingHeading}</h2>
              <div className="mt-4 divide-y divide-line border-y border-line" role="radiogroup" aria-label={DETAIL.pricingHeading}>
                {PRICING_TIERS.map((t, i) => {
                  const wk = weeklyForWeeks(v.weekly_rent, t.weeks);
                  const active = weeks === t.weeks;
                  return (
                    <label
                      key={t.label}
                      data-testid={`tier-${i}`}
                      className={`pressable flex items-center justify-between gap-4 py-4 cursor-pointer ${active ? "bg-green-soft" : ""}`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pricing-tier"
                          checked={active}
                          onChange={() => setWeeks(t.weeks)}
                          className="h-4 w-4 accent-green"
                        />
                        <span>
                          <span className="block font-heading font-bold text-ink text-[15px]">{t.label}</span>
                          <span className="block text-[12.5px] text-ink-3">{t.sub}</span>
                        </span>
                      </span>
                      <span className="text-right shrink-0">
                        <span className="block font-heading font-extrabold text-ink text-[17px] tabular">
                          £{wk.toFixed(0)}<span className="text-[12px] font-normal text-ink-3"> a week</span>
                        </span>
                        {i > 0 && <span className="block text-[11px] font-semibold text-green">{i === 1 ? DETAIL.save3 : DETAIL.save6}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {uniquePhotoCount > 1 && (
              <section className="hairline py-6">
                <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.moreAnglesHeading}</h2>
                <div className="mt-4">
                  <Spin360 photos={v.photos} />
                </div>
              </section>
            )}

            <section className="hairline py-6">
              <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.vehicleDetailsHeading}</h2>
              <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4">
                {specs.map((s) => (
                  <div key={s.label}>
                    <div className="text-[12.5px] text-ink-3">{s.label}</div>
                    <div className={`mt-1 font-medium text-ink text-[15px] ${s.capitalize ? "capitalize" : ""}`}>{s.value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="hairline py-6">
              <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.collectionAreaHeading}</h2>
              <div className="relative rounded-lg overflow-hidden border border-line h-64 mt-4" data-testid="location-map">
                <ApproxAreaMap lat={lat} lon={lon} />
              </div>
              <p className="text-[13px] text-ink-3 mt-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green shrink-0" strokeWidth={1.75} />
                {DETAIL.collectionNote(v.borough, v.postcode)}
              </p>
            </section>

            <section className="hairline py-6">
              <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.reviewsHeading}</h2>
              <p className="mt-3 text-[13px] text-ink-3" data-testid="reviews-empty">{DETAIL.noReviews}</p>
              <p className="mt-2 text-[14px] text-ink-2 leading-relaxed measure">{DETAIL.reviewsBody}</p>
            </section>

            <div className="hairline pt-6">
              <p className="text-[13px] text-ink-3">
                Own a fleet?{" "}
                <Link to="/list-your-fleet" className="text-green font-semibold hover:underline underline-offset-4">
                  See what your idle cars could earn
                </Link>
              </p>
            </div>
          </div>

          {/* ── COST PANEL (desktop) ─────────────────────────────────────── */}
          <div className="hidden lg:block lg:sticky top-below-header">
            <CostPanel v={v} weeks={weeks} rentWeekly={rentWeekly} onApply={handleApply} />
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line p-4 pb-safe">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-ink-3">{DETAIL.mobileRentPrefix}</div>
            <div className="text-[20px] font-heading font-extrabold text-ink tabular">
              £{v.weekly_rent} <span className="text-[13px] font-normal text-ink-3">{DETAIL.mobileRentSuffix}</span>
            </div>
          </div>
          <Button onClick={handleApply} size="lg" className="flex-1" data-testid="apply-mobile-btn">
            {DETAIL.applyCta}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Cost panel ─────────────────────────────────────── */

function CostPanel({ v, weeks, rentWeekly, onApply }) {
  return (
    <div className="panel p-card">
      <div className="flex items-baseline gap-1.5" data-testid="detail-headline-price">
        <span className="font-heading font-extrabold text-ink text-[32px] tabular">£{rentWeekly.toFixed(0)}</span>
        <span className="text-[15px] text-ink-3">a week</span>
      </div>
      <p className="mt-1 text-[12px] text-ink-3">
        Over {weeks} {weeks === 1 ? "week" : "weeks"}, rental only. £{v.deposit} deposit, returned at end.
      </p>

      <div className="mt-5 divide-y divide-line border-y border-line text-[14px]">
        <div className="flex justify-between py-3">
          <span className="text-ink-2">Weekly rent</span>
          <span className="font-semibold text-ink tabular" data-testid="detail-weekly-rent">£{rentWeekly.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-ink-2">{DETAIL.insuranceHeading}</span>
          <span className="font-semibold text-ink">{DETAIL.insuranceChosen}</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-ink-2">Breakdown cover</span>
          <span className="font-semibold text-ink">{v.breakdown_included ? "Included" : "£8 a week to add"}</span>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] text-ink-3 leading-relaxed">{DETAIL.insuranceHelper}</p>

      <Button onClick={onApply} size="lg" className="w-full mt-5" data-testid="apply-to-rent-btn">
        {DETAIL.applyCta}
      </Button>
      <PreviewNotice variant="inline" className="mt-3" />

      <div className="mt-6">
        <p className="text-[12.5px] font-semibold text-ink-3">{DETAIL.nextStepsHeading}</p>
        <ol className="mt-3 space-y-2.5">
          {DETAIL.nextSteps.map((step, i) => (
            <li key={step} className="flex items-start gap-2.5 text-[12.5px] text-ink-2">
              <span className="tabular w-5 h-5 rounded-md bg-green-soft text-green text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 pt-4 hairline flex items-center gap-2 text-[12px] text-ink-3">
        <Shield className="w-3.5 h-3.5 text-green shrink-0" strokeWidth={1.75} />
        {DETAIL.trustFooter}
      </div>
    </div>
  );
}

/* ── 360 spin ───────────────────────────────────────── */

function Spin360({ photos }) {
  const [idx, setIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const startX = useRef(null);

  useEffect(() => {
    if (!spinning) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 220);
    return () => clearInterval(t);
  }, [spinning, photos.length]);

  const onDown = (e) => {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setSpinning(false);
  };
  const onMove = (e) => {
    if (startX.current == null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    if (Math.abs(x - startX.current) > 28) {
      setIdx((i) => (i + (x > startX.current ? 1 : photos.length - 1)) % photos.length);
      startX.current = x;
    }
  };
  const onUp = () => { startX.current = null; };

  return (
    <div
      className="pressable-card touch-pan-y relative rounded-lg overflow-hidden bg-surface-2 aspect-[16/10] select-none cursor-grab active:cursor-grabbing"
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      data-testid="spin-360"
      aria-label="Drag to rotate view"
    >
      <img
        src={photos[idx]}
        alt="360-degree view"
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />
      <div className="panel rounded-md absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-1.5 py-1.5">
        <button
          data-testid="spin-360-prev"
          onClick={() => setIdx((i) => (i + photos.length - 1) % photos.length)}
          className="pressable w-8 h-8 rounded-md hover:bg-surface-2 flex items-center justify-center"
          aria-label="Previous angle"
        >
          <ChevronLeft className="w-4 h-4 text-ink-2" strokeWidth={1.75} />
        </button>
        <button
          data-testid="spin-360-spin"
          onClick={() => setSpinning((s) => !s)}
          className="pressable px-3 h-8 rounded-md bg-green text-white text-[12px] font-semibold flex items-center gap-1.5"
        >
          <RotateCw className={`w-3.5 h-3.5 ${spinning ? "animate-spin" : ""}`} strokeWidth={1.75} />
          {spinning ? "Stop" : "Spin"}
        </button>
        <button
          data-testid="spin-360-next"
          onClick={() => setIdx((i) => (i + 1) % photos.length)}
          className="pressable w-8 h-8 rounded-md hover:bg-surface-2 flex items-center justify-center"
          aria-label="Next angle"
        >
          <ChevronRight className="w-4 h-4 text-ink-2" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
