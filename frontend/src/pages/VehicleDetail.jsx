import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Heart, Share2, MapPin, Check,
  RotateCw, Shield, Zap, Clock, Star,
} from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PRICING_TIERS, weeklyForWeeks } from "@/lib/pricing";
import PreviewNotice from "@/components/PreviewNotice";
import { useSeo } from "@/lib/seo";
import { getMockById } from "@/data/mockListings";

const COORDS = {
  "Newham": [51.528, 0.035], "Croydon": [51.372, -0.101], "Redbridge": [51.559, 0.076],
  "Harrow": [51.58, -0.336], "Barking & Dagenham": [51.554, 0.129], "Westminster": [51.497, -0.137],
  "Camden": [51.549, -0.142], "Hounslow": [51.468, -0.361], "Lewisham": [51.462, -0.011],
  "Ealing": [51.513, -0.305], "Bromley": [51.406, 0.015],
};

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saved, toggleSaved } = useAuth();
  const [v, setV] = useState(null);
  const [quote, setQuote] = useState(null);
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
        api
          .post("/quote", { listing_id: id })
          .then((q) => setQuote(q.data))
          .catch(() => {});
      })
      .catch(() => navigate("/search"));
  }, [id, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  useSeo({
    title: v ? `${v.make} ${v.model} ${v.year} for Rent · Kharo` : "Loading · Kharo",
    description: v
      ? `Rent a ${v.year} ${v.make} ${v.model} in ${v.borough} from £${v.weekly_rent}/week. PCO-licensed, ULEZ exempt, verified operator.`
      : undefined,
  });

  if (!v) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-[#888] text-[15px]">Loading vehicle…</div>
      </div>
    );
  }

  const insurance = quote ? quote.cheapest_weekly : null;
  const breakdownCost = v.breakdown_included ? 0 : 8;
  const rentWeekly = weeklyForWeeks(v.weekly_rent, weeks);
  const total = (rentWeekly + (insurance || 0) + breakdownCost).toFixed(2);
  const monthly = (Number(total) * 4.33).toFixed(0);
  const isSaved = saved.includes(v.id);
  const [lat, lon] = COORDS[v.borough] || [51.509, -0.118];
  // no marker param: this is an approximate-area map, a precise pin would overclaim location accuracy
  const bbox = `${lon - 0.07}%2C${lat - 0.035}%2C${lon + 0.07}%2C${lat + 0.035}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  const isElectric = (v.fuel || "").toLowerCase() === "electric";
  // mock listings often repeat the same photo url in every slot: only offer gallery
  // navigation when there's more than one genuinely distinct image to look at
  const uniquePhotoCount = new Set(v.photos).size;

  const specs = [
    { label: "Fuel type", value: v.fuel, capitalize: true },
    { label: "Seats", value: v.seats },
    { label: isElectric ? "Range" : "Economy", value: isElectric ? "330 miles" : `${v.mpg} mpg` },
    { label: "Weekly mileage", value: `${v.mileage_allowance} miles` },
    { label: "Experience required", value: v.min_experience ? `${v.min_experience}+ years` : "Open to new drivers" },
    { label: "Deposit", value: `£${v.deposit}, returned at end` },
    { label: "Servicing", value: v.designated_garage },
    { label: "Restrictions", value: v.restrictions || "None" },
  ];

  const included = [
    { text: "MOT, road tax and PHV compliance, handled by the operator", always: true },
    { text: v.breakdown_included ? "24/7 breakdown cover included" : "Breakdown cover available to add (£8/week)", always: true },
    { text: `Servicing booked at ${v.designated_garage}`, always: true },
    { text: "PHV insurance arranged before you drive", always: true },
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
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-[13px] text-[#555] hover:text-[#0B6B4F] transition-colors"
            data-testid="back-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to results
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { toggleSaved(v.id); trackEvent("save", { listing_id: id }); }}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#555] hover:text-[#0B6B4F] transition-colors"
              data-testid="detail-save"
              aria-pressed={isSaved}
            >
              <Heart className={`w-4 h-4 transition-colors ${isSaved ? "fill-[#111] text-[#111]" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#555] hover:text-[#0B6B4F] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-[#E8E8E8]" data-testid="gallery-main">
          <img src={v.photos?.[photo]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
          {uniquePhotoCount > 1 && (
            <>
              <button
                data-testid="gallery-prev"
                onClick={() => setPhoto((photo - 1 + v.photos.length) % v.photos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 text-[#333]" />
              </button>
              <button
                data-testid="gallery-next"
                onClick={() => setPhoto((photo + 1) % v.photos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5 text-[#333]" />
              </button>
              <span className="absolute bottom-3 right-3 text-[12px] font-medium text-white bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                {photo + 1} / {v.photos.length}
              </span>
            </>
          )}
        </div>
        {isElectric && (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-[#0B6B4F] mt-2.5">
            <Zap className="w-3.5 h-3.5" /> Electric &middot; ULEZ exempt
          </p>
        )}

        {/* Thumbnail strip */}
        {uniquePhotoCount > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {v.photos.map((p, i) => (
              <button
                key={`${p}-${i}`}
                onClick={() => setPhoto(i)}
                className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 ring-2 transition-all ${
                  photo === i ? "ring-[#0B6B4F]" : "ring-transparent opacity-60 hover:opacity-90"
                }`}
                aria-label={`View photo ${i + 1}`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content grid */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 mt-8 items-start">
          {/* LEFT COLUMN */}
          <div>
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111] leading-tight">
                  {v.make} {v.model} {v.year}
                </h1>
                <p className="text-[14px] text-[#888] mt-1">
                  {v.colour} · {v.mileage?.toLocaleString()} miles on the clock
                </p>
              </div>

              {/* Trust row - the verification claim lives here as plain text, not a badge */}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#555]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#0B6B4F]" />
                  TfL licence checked
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#0B6B4F]" />
                  Companies House checked
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#888]" />
                  {v.borough}, {v.city}
                </span>
                <span className="flex items-center gap-1.5 text-[#888]">
                  <Clock className="w-3.5 h-3.5" />
                  Usually replies in {v.operator_response}
                </span>
              </div>
            </div>

            {/* What's included */}
            <DetailSection title="What your weekly rent covers">
              <ul className="space-y-3">
                {included.map(({ text }) => (
                  <li key={text} className="flex items-start gap-3 text-[15px] text-[#444]">
                    <Check className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
                    {text}
                  </li>
                ))}
              </ul>
            </DetailSection>

            {/* Pricing tiers */}
            <DetailSection title="The longer you rent, the less you pay">
              <div className="grid sm:grid-cols-3 gap-3">
                {PRICING_TIERS.map((t, i) => {
                  const wk = weeklyForWeeks(v.weekly_rent, t.weeks);
                  const active = weeks === t.weeks;
                  return (
                    <button
                      key={t.label}
                      onClick={() => setWeeks(t.weeks)}
                      data-testid={`tier-${i}`}
                      className={`text-left rounded-2xl p-4 border-2 transition-all ${
                        active
                          ? "border-[#0B6B4F] bg-[#EAF5F1]"
                          : "border-[#E8E8E8] bg-white hover:border-[#CACACA]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-[#111] text-[15px]">
                          {t.label}
                        </span>
                        {i > 0 && (
                          <span className="text-[11px] font-semibold text-[#0B6B4F] bg-[#EAF5F1] px-1.5 py-0.5 rounded-full">
                            save {i === 1 ? "3" : "6"}%
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#888] mb-2">{t.sub}</div>
                      <div className="text-[22px] font-heading font-extrabold text-[#111] leading-none">
                        £{wk.toFixed(0)}
                        <span className="text-[12px] font-normal text-[#888] ml-1">/ week</span>
                      </div>
                      <div className={`flex items-center gap-1 text-[12px] mt-2 font-medium ${active ? "text-[#0B6B4F]" : "text-[#BBB]"}`}>
                        {active && <Check size={12} strokeWidth={2.5} />}
                        {active ? "Selected" : "Select"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </DetailSection>

            {/* About this car */}
            <DetailSection title="About this car">
              <p className="text-[15px] text-[#444] leading-relaxed">{v.description}</p>
              {v.features?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {v.features.map((f) => (
                    <span
                      key={f}
                      className="text-[13px] text-[#333] bg-[#F5F5F5] border border-[#E8E8E8] px-3 py-1.5 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </DetailSection>

            {/* 360 spin: only worth offering when the listing actually has distinct angles to show */}
            {new Set(v.photos).size > 1 && (
              <DetailSection title="More angles">
                <Spin360 photos={v.photos} />
              </DetailSection>
            )}

            {/* Specs grid */}
            <DetailSection title="Vehicle details">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specs.slice(0, 4).map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#E8E8E8]">
                    <div className="text-[11px] text-[#999] uppercase tracking-wide">{s.label}</div>
                    <div className={`font-semibold text-[#111] mt-1 text-[15px] ${s.capitalize ? "capitalize" : ""}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mt-5">
                {specs.slice(4).map((s) => (
                  <div key={s.label}>
                    <div className="text-[12px] text-[#999]">{s.label}</div>
                    <div className="font-medium text-[#333] mt-0.5 text-[14px]">{s.value}</div>
                  </div>
                ))}
              </div>
            </DetailSection>

            {/* Location map */}
            <DetailSection title="Collection area">
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E8E8]">
                <iframe
                  title="Collection area map"
                  src={mapUrl}
                  className="w-full h-64 border-0 pointer-events-none"
                  style={{ filter: "grayscale(0.9) contrast(1.05) brightness(1.03)" }}
                  loading="lazy"
                  data-testid="location-map"
                />
                {/* soft area indicator, not a precise pin: this is an approximate area, not an exact address */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-24 h-24 rounded-full bg-[#0B6B4F]/10 ring-1 ring-[#0B6B4F]/30" />
                </div>
              </div>
              <p className="text-[13px] text-[#888] mt-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0B6B4F] shrink-0" />
                Approximate area: {v.borough}, {v.postcode}. Exact address shared once your details are confirmed.
              </p>
            </DetailSection>

            {/* Reviews placeholder */}
            <DetailSection title="Operator reviews">
              <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]" data-testid="reviews-empty">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#DDD]" />
                  ))}
                  <span className="text-[13px] text-[#888] ml-1">No reviews yet</span>
                </div>
                <p className="text-[14px] text-[#444] leading-relaxed">
                  This operator is new to Kharo. Background and licence checks are complete.
                  Driver reviews will appear here after the first rentals.
                </p>
              </div>
            </DetailSection>
          </div>

          {/* RIGHT COLUMN - sticky cost panel (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CostPanel
                v={v}
                insurance={insurance}
                breakdownCost={breakdownCost}
                rentWeekly={rentWeekly}
                weeks={weeks}
                total={total}
                monthly={monthly}
                onApply={handleApply}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E8E8] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <PreviewNotice />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-[#888]">All-in from</div>
            <div className="text-[20px] font-heading font-extrabold text-[#111]">
              £{total}
              <span className="text-[13px] font-normal text-[#888]"> / week</span>
            </div>
          </div>
          <button
            onClick={handleApply}
            data-testid="apply-mobile-btn"
            className="flex-1 h-12 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold text-[15px] transition-colors"
          >
            Register Interest
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Cost panel ─────────────────────────────────────── */

function CostPanel({ v, insurance, breakdownCost, rentWeekly, weeks, total, monthly, onApply }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 shadow-sm">
      {/* Price headline */}
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-[32px] font-heading font-extrabold text-[#111]" data-testid="detail-headline-price">
          £{rentWeekly.toFixed(0)}
        </span>
        <span className="text-[15px] text-[#888]">/ week</span>
      </div>
      <p className="text-[12px] text-[#AAA]">
        over {weeks} {weeks === 1 ? "week" : "weeks"} · £{v.deposit} deposit (returned at end)
      </p>

      {/* Cost breakdown */}
      <div className="mt-5 space-y-3 text-[14px]">
        <CostRow label="Weekly rent" value={`£${rentWeekly.toFixed(2)}`} testId="detail-weekly-rent" />
        <CostRow
          label={<>Insurance <span className="text-[11px] text-[#BBB]">(indicative)</span></>}
          value={insurance != null ? `£${insurance.toFixed(2)}` : "…"}
        />
        <CostRow
          label="Breakdown cover"
          value={v.breakdown_included ? "Included" : `£${breakdownCost.toFixed(2)}`}
        />
        <div className="border-t border-[#F0F0F0] pt-3 flex justify-between">
          <span className="font-semibold text-[#111]">Every week</span>
          <span className="font-heading font-extrabold text-[#0B6B4F]" data-testid="detail-all-in">
            £{total}
          </span>
        </div>
        <p className="text-[12px] text-[#AAA] text-right">≈ £{monthly} / month</p>
      </div>

      {/* CTA */}
      <button
        onClick={onApply}
        data-testid="apply-to-rent-btn"
        className="w-full mt-5 h-12 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold text-[15px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F] focus-visible:ring-offset-2"
      >
        Register Interest
      </button>
      <PreviewNotice variant="inline" className="mt-3" />

      {/* Next steps */}
      <div className="mt-6">
        <p className="text-[11px] font-semibold text-[#777] uppercase tracking-[0.08em] mb-3">
          What happens next
        </p>
        <ol className="space-y-2.5">
          {[
            "You register your interest with your name and contact details",
            "We add you to the priority list for this vehicle and borough",
            "We email you the moment Kharo goes live near you",
            "No commitment, no charge, until you decide to go ahead",
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-2.5 text-[12.5px] text-[#666]">
              <span className="w-5 h-5 rounded-full bg-[#EAF5F1] text-[#0B6B4F] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Trust footer */}
      <div className="mt-5 pt-4 border-t border-[#F0F0F0] flex items-center gap-2 text-[12px] text-[#888]">
        <Shield className="w-3.5 h-3.5 text-[#0B6B4F] shrink-0" />
        Operator checked against the licensing register · No payment taken at this stage
      </div>
    </div>
  );
}

function CostRow({ label, value, testId }) {
  return (
    <div className="flex justify-between text-[14px]">
      <span className="text-[#555]">{label}</span>
      <span className="font-semibold text-[#111]" data-testid={testId}>{value}</span>
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
      className="relative rounded-2xl overflow-hidden bg-[#EDEDED] aspect-[16/10] select-none cursor-grab active:cursor-grabbing"
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-1.5 py-1.5 shadow-md">
        <button
          data-testid="spin-360-prev"
          onClick={() => setIdx((i) => (i + photos.length - 1) % photos.length)}
          className="w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center"
          aria-label="Previous angle"
        >
          <ChevronLeft className="w-4 h-4 text-[#444]" />
        </button>
        <button
          data-testid="spin-360-spin"
          onClick={() => setSpinning((s) => !s)}
          className="px-3 h-8 rounded-full bg-[#0B6B4F] text-white text-[12px] font-semibold flex items-center gap-1.5"
        >
          <RotateCw className={`w-3.5 h-3.5 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Stop" : "Spin"}
        </button>
        <button
          data-testid="spin-360-next"
          onClick={() => setIdx((i) => (i + 1) % photos.length)}
          className="w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center"
          aria-label="Next angle"
        >
          <ChevronRight className="w-4 h-4 text-[#444]" />
        </button>
      </div>
    </div>
  );
}

/* ── Section wrapper ────────────────────────────────── */

function DetailSection({ title, children }) {
  return (
    <div className="mt-5 bg-white rounded-2xl p-6 border border-[#E8E8E8]">
      <h2 className="text-[17px] font-heading font-bold text-[#111] mb-4">{title}</h2>
      {children}
    </div>
  );
}
