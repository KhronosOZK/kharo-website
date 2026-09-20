import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Share2, MapPin, Check, RotateCw, Zap } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { PRICING_TIERS, weeklyForWeeks } from "@/lib/pricing";
import ApproxAreaMap from "@/components/ApproxAreaMap";
import { Button } from "@/components/ui/button";
import { useSeo, breadcrumbJsonLd } from "@/lib/seo";
import { getMockById, isPreviewId } from "@/data/mockListings";
import { areaCoords } from "@/lib/geo";
import { DETAIL } from "@/content/pages/marketplace";
import { mileageLabel, hasOwnPhoto, weeklyInsurance } from "@/lib/format";
import { BRAND } from "@/content/site";
import { APPLY } from "@/content/site";
import { APPLICATION_FLOW } from "@/content/pages/applicationFlow";

const COVER_LEVELS = ["comp", "tpft", "tp"];
const quoteFor = (level) => APPLICATION_FLOW.quotes.find((q) => q.id === level);

function experienceLabel(months) {
  if (!months) return DETAIL.experienceOpen;
  if (months >= 12) return `${Math.round(months / 12)}+ years`;
  return `${months}+ months`;
}

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [photo, setPhoto] = useState(0);
  const [weeks, setWeeks] = useState(1);
  const [coverLevel, setCoverLevel] = useState("comp");
  const [coverTerm, setCoverTerm] = useState("monthly");
  const [copied, setCopied] = useState(false);
  // The sticky bar must get out of the way at the end of the page, or it
  // permanently covers the footer's legal links on a phone.
  const [barHidden, setBarHidden] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const el = endRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setBarHidden(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Handle mock vehicle IDs without making API calls
    if (isPreviewId(id)) {
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
  const [lat, lon] = areaCoords(v.borough, v.city);

  const isElectric = (v.fuel || "").toLowerCase() === "electric";
  // Mock listings often repeat the same photo url in every slot: only offer
  // gallery navigation when there's more than one genuinely distinct image.
  const uniquePhotoCount = new Set(v.photos).size;

  const specs = [
    ...(v.licensing_authority ? [{ label: "Licensed by", value: v.licensing_authority }] : []),
    { label: DETAIL.specs.fuel, value: v.fuel, capitalize: true },
    { label: DETAIL.specs.seats, value: v.seats },
    ...(v.mpg ? [{ label: DETAIL.specs.economy, value: `${v.mpg} mpg` }] : []),
    { label: DETAIL.specs.mileage, value: mileageLabel(v.mileage_allowance) },
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
    trackEvent("apply_click", { listing_id: id, weeks, cover: coverLevel, term: coverTerm });
    navigate(`/apply/${v.id}?weeks=${weeks}&cover=${coverLevel}&term=${coverTerm}`);
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
              onClick={handleShare}
              className="pressable inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-green"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.75} />
              {copied ? DETAIL.shareCopied : DETAIL.share}
            </button>
          </div>
        </div>

        {/* Gallery: one bordered object holding the photo, the counter and
            the thumbnail strip, rather than three loose elements stacked. */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_21rem] gap-8 mt-4 items-start">
        <div>
        <figure className="rounded-lg border border-line bg-surface p-2">
        <div className="relative rounded-md overflow-hidden aspect-[16/10] bg-surface-2" data-testid="gallery-main">
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
        {uniquePhotoCount > 1 && (
          <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-line overflow-x-auto hide-scrollbar">
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
        </figure>
        {!hasOwnPhoto(v) && (
          <p className="mt-2.5 text-[12.5px] text-ink-3" data-testid="same-model-note">Photo shows the same model, not this exact car. The operator adds their own photos before launch.</p>
        )}
        {isElectric && (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-green mt-2.5">
            <Zap className="w-3.5 h-3.5" strokeWidth={1.75} /> Electric, ULEZ exempt
          </p>
        )}


            <div className="mt-6 pb-6">
              <h1 className="text-h1 font-heading font-extrabold text-ink leading-tight">
                {v.make} {v.model} {v.year}
              </h1>
              <p className="mt-2 text-[14px] text-ink-3">{v.colour}, {v.mileage?.toLocaleString()} miles on the clock</p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-2">
                {v.operator_name && (
                  <span data-testid="detail-operator">
                    <span className="font-semibold text-ink">{v.operator_name}</span>, {v.borough} · {v.operator_fleet} cars on Kharo
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-deep" strokeWidth={1.75} />
                  Licence and company checked
                </span>
                <span className="flex items-center gap-1.5 text-ink-3">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {v.borough}, {v.city}
                </span>
              </div>

              <div className="mt-6 pt-6 hairline">
                <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.vehicleDetailsHeading}</h2>
                <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4">
                  {specs.map((sp) => (
                    <div key={sp.label}>
                      <div className="text-[12.5px] text-ink-3">{sp.label}</div>
                      <div className={`mt-1 font-medium text-ink text-[15px] ${sp.capitalize ? "capitalize" : ""}`}>{sp.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 hairline">
                <p className="text-[15px] text-ink-2 leading-relaxed measure">{v.description}</p>
                {v.features?.length > 0 && (
                  <ul className="mt-4 grid gap-x-8 gap-y-1.5 text-[14px] text-ink-2 sm:grid-cols-2" data-testid="detail-features">
                    {v.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-green" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>
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

            {/* Insurance comparison. The brief puts this on the car, before the
                application: a driver needs the full weekly picture to decide. */}
            <section className="hairline py-6" data-testid="detail-cover">
              <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.coverHeading}</h2>
              <p className="mt-2 text-[14.5px] text-ink-2 leading-relaxed measure">{DETAIL.coverSub}</p>

              <p className="mt-5 text-[13px] font-semibold text-ink">How often you pay</p>
              <div className="mt-2 divide-y divide-line border-y border-line" role="radiogroup" aria-label="How often you pay">
                {APPLICATION_FLOW.terms.map((t) => {
                  const on = coverTerm === t.id;
                  return (
                    <label key={t.id} data-testid={`detail-term-${t.id}`}
                      className={`pressable flex cursor-pointer items-center gap-3 px-1 py-3.5 ${on ? "bg-green-soft" : ""}`}>
                      <input type="radio" name="cover-term" checked={on} onChange={() => setCoverTerm(t.id)} className="h-4 w-4 accent-[#111312]" />
                      <span className="font-heading text-[15px] font-bold text-ink">{t.label}</span>
                      <span className="ml-auto text-[12.5px] text-ink-3">{t.suffix}</span>
                    </label>
                  );
                })}
              </div>

              <p className="mt-5 text-[13px] font-semibold text-ink">Level of cover</p>
              <div className="mt-2 divide-y divide-line border-y border-line" role="radiogroup" aria-label="Cover level">
                {COVER_LEVELS.map((lvl) => {
                  const q = quoteFor(lvl); const on = coverLevel === lvl;
                  const suffix = APPLICATION_FLOW.terms.find((t) => t.id === coverTerm).suffix;
                  return (
                    <button key={lvl} type="button" role="radio" aria-checked={on}
                      onClick={() => setCoverLevel(lvl)}
                      data-testid={`detail-cover-${lvl}`}
                      className="pressable grid w-full grid-cols-[1.25rem_1fr_auto] items-start gap-3 py-4 text-left">
                      <span aria-hidden="true" className={`mt-1 h-4 w-4 rounded-full border-2 ${on ? "border-green bg-green" : "border-line-strong"}`} />
                      <span>
                        <span className="block text-[15px] font-semibold text-ink">{APPLY.stepCover.levels[lvl]}</span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-2">{APPLY.stepCover.levelNotes[lvl]}</span>
                        <span className="mt-1 block text-[12.5px] text-ink-3">{q.excess}</span>
                      </span>
                      <span className="text-right tabular">
                        <span className="block font-heading text-[19px] font-bold text-ink">£{q.price[coverTerm].toLocaleString()}</span>
                        <span className="block text-[12px] text-ink-3">{suffix}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-[12.5px] text-ink-3 leading-relaxed measure">{DETAIL.coverNote}</p>
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
              <h2 className="text-h3 font-heading font-bold text-ink">{DETAIL.collectionAreaHeading}</h2>
              <div className="relative rounded-lg overflow-hidden border border-line h-80 mt-4" data-testid="location-map">
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
            <CostPanel v={v} weeks={weeks} rentWeekly={rentWeekly} coverLevel={coverLevel} coverTerm={coverTerm} onApply={handleApply} />
          </div>
        </div>
      </div>

      <div ref={endRef} aria-hidden="true" className="h-px w-full" />

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line p-4 pb-safe transition-transform duration-ui ease-out"
          style={{ transform: barHidden ? "translateY(110%)" : "translateY(0)" }}>
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

function CostPanel({ v, weeks, rentWeekly, coverLevel, coverTerm, onApply }) {
  const quote = quoteFor(coverLevel);
  const term = APPLICATION_FLOW.terms.find((t) => t.id === coverTerm);
  // "Call me back": a phone number and nothing else. Stored as a lead so
  // nobody has to type an email to get a person to ring them.
  const [callback, setCallback] = useState(false);
  const [phone, setPhone] = useState("");
  const [callbackDone, setCallbackDone] = useState(false);
  const requestCallback = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    try {
      await api.post("/leads", { phone: phone.trim(), source: "call_back", data: { listing_id: v.id, vehicle: `${v.make} ${v.model}`, city: v.city } });
      trackEvent("call_back", { listing_id: v.id });
      setCallbackDone(true);
    } catch {
      setCallbackDone(true);
    }
  };
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
          <span className="text-ink-2">{DETAIL.insuranceHeading}<span className="block text-[12px] text-ink-3">{APPLY.stepCover.levels[coverLevel]}</span></span>
          <span className="text-right font-semibold text-ink tabular" data-testid="detail-cover-price">£{quote.price[coverTerm].toLocaleString()}<span className="block text-[12px] font-normal text-ink-3">{term.suffix}</span></span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-ink-2">Breakdown cover</span>
          <span className="font-semibold text-ink">{v.breakdown_included ? "Included" : "£8 a week to add"}</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="font-semibold text-ink">Total a week, about</span>
          <span className="font-heading text-[17px] font-bold text-ink tabular" data-testid="detail-total-week">£{Math.round(rentWeekly + weeklyInsurance(quote, coverTerm))}</span>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-ink-3">Rent plus your insurance, worked out per week. Fuel is not included.</p>

      <Button onClick={onApply} size="lg" className="w-full mt-5" data-testid="apply-to-rent-btn">
        {DETAIL.applyCta}
      </Button>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setCallback((c) => !c)} aria-expanded={callback}
          className="pressable inline-flex h-11 items-center justify-center rounded-md border border-line-strong bg-surface text-[13.5px] font-semibold text-ink hover:bg-surface-2" data-testid="call-me-back">
          Call me back
        </button>
        <a href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi Kharo, I am asking about the ${v.make} ${v.model} (${v.id}).`)}`} target="_blank" rel="noopener noreferrer"
          className="pressable inline-flex h-11 items-center justify-center rounded-md border border-line-strong bg-surface text-[13.5px] font-semibold text-ink hover:bg-surface-2" data-testid="whatsapp-ask">
          Ask on WhatsApp
        </a>
      </div>
      {callback && (
        <form onSubmit={requestCallback} className="mt-3 rounded-md border border-line bg-bone p-3" data-testid="callback-form">
          {callbackDone ? (
            <p className="text-[13.5px] text-ink">Thank you. A person will call you within one working day.</p>
          ) : (
            <>
              <label htmlFor="cb-phone" className="block text-[12.5px] font-medium text-ink-2">Your phone number</label>
              <div className="mt-1.5 flex gap-2">
                <input id="cb-phone" type="tel" inputMode="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07700 900 000"
                  className="field h-11 min-w-0 flex-1 rounded-md border border-line-strong bg-surface px-3 text-[15px] text-ink outline-none focus:border-ink" />
                <Button type="submit" className="shrink-0">Call me</Button>
              </div>
              <p className="mt-2 text-[12px] text-ink-3">We call within one working day. No email needed.</p>
            </>
          )}
        </form>
      )}
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
