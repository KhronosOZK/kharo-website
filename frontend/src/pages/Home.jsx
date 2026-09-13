import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Shield, Zap, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { HOME, BRAND } from "@/content/site";
import { useSeo } from "@/lib/seo";

const FADE_UP = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const TRUST_BADGES = [
  { label: "TfL Approved", icon: Shield },
  { label: "Uber Eligible", icon: CheckCircle },
  { label: "Bolt Eligible", icon: CheckCircle },
  { label: "FreeNow Eligible", icon: CheckCircle },
];

const HOW_STEPS = [
  { num: "01", title: "Browse PCO Cars", body: "Filter by make, weekly rate and borough. Every listing is from a verified London operator." },
  { num: "02", title: "Check Availability", body: "Tell us what you need and when. Takes under 60 seconds. No documents at this stage." },
  { num: "03", title: "Operator Contacts You", body: "A fleet manager reviews your details and calls to confirm availability and key collection." },
];

const DRIVER_REASONS = [
  { icon: Zap, title: "One weekly payment", body: "Rent, insurance and servicing in a single figure. No surprise invoices." },
  { icon: Shield, title: "4-layer vetting", body: "DVLA eligibility, identity, affordability and trade record. Fair to pass, impossible to fake." },
  { icon: Clock, title: "Start this week", body: "Active PCO licence? Most drivers are behind the wheel within 3 working days." },
];

export default function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/listings").then((r) => setListings(r.data)).catch(() => {});
    trackEvent("page_view", { path: "/" });
  }, []);

  useSeo({ title: `Kharo · ${BRAND.tagline}`, description: HOME?.hero?.sub || "The PCO car rental marketplace for London drivers." });

  const handleSearch = (e) => {
    e.preventDefault();
    trackEvent("search", { query });
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const featured = listings.slice(0, 6);

  return (
    <main className="bg-white">
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-[#F5F5F5] pt-14 pb-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
            {/* Left copy */}
            <div className="flex-1 pt-4 pb-8 lg:py-20 text-center lg:text-left">
              <motion.p {...FADE_UP} className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-5">
                London's PCO Car Rental Marketplace
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="text-[42px] sm:text-5xl lg:text-[56px] font-heading font-extrabold text-[#111111] leading-[1.04] tracking-tight"
              >
                PCO Cars.<br />Ready to Drive.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                className="mt-5 text-[16px] text-[#555555] max-w-md mx-auto lg:mx-0 leading-relaxed"
              >
                Find verified PHV rental cars across London. Weekly rates from operators who know the trade.
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                onSubmit={handleSearch}
                className="mt-8 flex items-center gap-3 max-w-md mx-auto lg:mx-0"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Toyota Prius, Kia Niro, borough..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E0E0E0] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0B6B4F]/30 focus:border-[#0B6B4F] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3.5 bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold text-[14px] rounded-xl transition-colors shrink-0"
                >
                  Search
                </button>
              </motion.form>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
              >
                {TRUST_BADGES.map((b) => (
                  <span key={b.label} className="flex items-center gap-1.5 text-[12px] font-medium text-[#555555]">
                    <b.icon className="w-3.5 h-3.5 text-[#0B6B4F]" />
                    {b.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: hero car image */}
            <div className="flex-1 flex justify-center lg:justify-end items-end self-end">
              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                className="w-full max-w-[520px] lg:max-w-none"
              >
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&auto=format&fit=crop"
                  alt="PCO car available on Kharo"
                  className="w-full object-cover object-center"
                  style={{ borderRadius: "16px 16px 0 0" }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED VEHICLES ──────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-1">Available Now</p>
              <h2 className="text-[28px] sm:text-3xl font-heading font-extrabold text-[#111111]">PCO Vehicles to Rent</h2>
            </div>
            <Link
              to="/search"
              onClick={() => trackEvent("cta_click", { label: "view_all_home" })}
              className="hidden sm:flex items-center gap-1.5 text-[14px] font-semibold text-[#0B6B4F] hover:gap-2.5 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => { trackEvent("card_click", { listing_id: v.id }); navigate(`/vehicle/${v.id}`); }}
                  className="group cursor-pointer bg-white rounded-2xl border border-[#E8E8E8] hover:border-[#D0D0D0] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-[#F4F4F4] overflow-hidden">
                    <img
                      src={v.photos?.[0]}
                      alt={`${v.make} ${v.model}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-[#333] px-2.5 py-1 rounded-full">
                      {v.borough}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-bold text-[16px] text-[#111] leading-snug">{v.make} {v.model}</h3>
                        <p className="text-[12px] text-[#888] mt-0.5">{v.year} · {v.fuel} · {v.seats} seats</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[22px] font-heading font-extrabold text-[#111] leading-none">£{v.weekly_rent}</div>
                        <div className="text-[11px] text-[#888]">/week</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                      <span className="text-[12px] text-[#666]">£{v.deposit || 500} deposit</span>
                      <span className="text-[12px] font-semibold text-[#0B6B4F] flex items-center gap-1">
                        Check availability <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-[#F4F4F4] animate-pulse aspect-[4/3]" />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] text-white font-semibold text-[14px] rounded-xl"
            >
              View all vehicles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOR DRIVERS ────────────────────────────────────────────── */}
      <section className="py-16 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-3">For Drivers</p>
              <h2 className="text-[32px] sm:text-4xl font-heading font-extrabold text-[#111] leading-tight">
                Drive for Uber or Bolt.<br />Rent the car to do it.
              </h2>
              <p className="mt-4 text-[15px] text-[#555] leading-relaxed max-w-lg">
                Every car on Kharo is PHV-licensed and TfL-eligible. No middlemen, no hidden costs. Just a weekly rate that covers everything.
              </p>

              <div className="mt-8 space-y-5">
                {DRIVER_REASONS.map((r) => (
                  <div key={r.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0B6B4F]/10 flex items-center justify-center shrink-0">
                      <r.icon className="w-5 h-5 text-[#0B6B4F]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#111]">{r.title}</h3>
                      <p className="text-[13px] text-[#666] mt-0.5 leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/search"
                  onClick={() => trackEvent("cta_click", { label: "driver_browse" })}
                  className="px-6 py-3 bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold text-[14px] rounded-xl transition-colors"
                >
                  Browse cars
                </Link>
                <Link
                  to="/driver-guide"
                  className="px-6 py-3 bg-white border border-[#E0E0E0] hover:border-[#999] text-[#333] font-semibold text-[14px] rounded-xl transition-colors"
                >
                  Driver guide
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-[#EFEFEF] aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?w=800&auto=format&fit=crop"
                  alt="Driver with PCO car"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Stat card overlay */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-[#E8E8E8]">
                <div className="text-[32px] font-heading font-extrabold text-[#0B6B4F] leading-none">12,712</div>
                <div className="text-[12px] text-[#666] mt-1 max-w-[160px] leading-snug">more PHV licences than licensed vehicles in London</div>
                <div className="text-[10px] text-[#999] mt-1">TfL, May 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR OPERATORS ──────────────────────────────────────────── */}
      <section className="py-16 bg-[#0B6B4F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-bold text-[#5FD3A6] tracking-[0.14em] uppercase mb-3">For Operators</p>
              <h2 className="text-[32px] sm:text-4xl font-heading font-extrabold text-white leading-tight">
                Stop letting PCO vehicles sit idle.
              </h2>
              <p className="mt-4 text-[15px] text-[#A8D5C4] leading-relaxed max-w-lg">
                Every week a car sits unrented costs you £200–£300 in depreciation, insurance and missed revenue. Kharo connects you with pre-qualified drivers.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { n: "48h", l: "Average time to fill a void" },
                  { n: "4-layer", l: "Driver vetting before contact" },
                  { n: "£0", l: "Listing fee" },
                  { n: "Direct", l: "Driver-to-operator connection" },
                ].map((s) => (
                  <div key={s.l} className="bg-white/10 rounded-xl p-4">
                    <div className="text-[24px] font-heading font-extrabold text-white">{s.n}</div>
                    <div className="text-[12px] text-[#A8D5C4] mt-1">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/list-your-fleet"
                  onClick={() => trackEvent("cta_click", { label: "operator_list" })}
                  className="px-6 py-3 bg-white text-[#0B6B4F] font-bold text-[14px] rounded-xl hover:bg-[#F0F0F0] transition-colors"
                >
                  List your fleet free
                </Link>
                <Link
                  to="/operator-guide"
                  className="px-6 py-3 bg-white/15 border border-white/30 text-white font-semibold text-[14px] rounded-xl hover:bg-white/20 transition-colors"
                >
                  Operator guide
                </Link>
              </div>
            </div>

            {/* Void calculator */}
            <VoidCalc />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.14em] uppercase mb-2">Simple process</p>
            <h2 className="text-[32px] sm:text-4xl font-heading font-extrabold text-[#111]">How Kharo works</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {HOW_STEPS.map((s) => (
              <div key={s.num} className="relative">
                <div className="text-[48px] font-heading font-extrabold text-[#F0F0F0] leading-none mb-3">{s.num}</div>
                <h3 className="font-semibold text-[17px] text-[#111] mb-2">{s.title}</h3>
                <p className="text-[14px] text-[#666] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─────────────────────────────────────────────── */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[32px] sm:text-4xl font-heading font-extrabold text-white mb-4">
            Start driving this week
          </h2>
          <p className="text-[15px] text-[#888] max-w-md mx-auto mb-8">
            Browse verified PCO cars from London operators and register your interest in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/search"
              onClick={() => trackEvent("cta_click", { label: "bottom_driver" })}
              className="px-8 py-4 bg-[#0B6B4F] hover:bg-[#095B43] text-white font-bold text-[15px] rounded-xl transition-colors"
            >
              Browse PCO cars
            </Link>
            <Link
              to="/list-your-fleet"
              onClick={() => trackEvent("cta_click", { label: "bottom_operator" })}
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-[15px] rounded-xl hover:bg-white/15 transition-colors"
            >
              List your fleet
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function VoidCalc() {
  const navigate = useNavigate();
  const [idle, setIdle] = useState(4);
  const weekly = idle * 265;
  const monthly = Math.round(weekly * 4.33);

  return (
    <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
      <p className="text-[12px] font-bold text-[#5FD3A6] uppercase tracking-wider mb-3">Void cost calculator</p>
      <div className="mb-4">
        <div className="flex justify-between text-[13px] font-semibold text-white mb-2">
          <span>Idle vehicles</span>
          <span className="text-[#5FD3A6] text-[18px] font-extrabold">{idle}</span>
        </div>
        <input
          type="range" min={1} max={20} value={idle}
          onChange={(e) => setIdle(Number(e.target.value))}
          className="w-full accent-[#5FD3A6] h-1.5 rounded"
        />
      </div>
      <div className="bg-[#0A130F]/40 rounded-xl p-4 mb-4">
        <div className="text-[11px] text-[#5FD3A6] font-semibold uppercase tracking-wide">Monthly revenue lost</div>
        <div className="text-[36px] font-heading font-extrabold text-white leading-none mt-1">
          £{monthly.toLocaleString("en-GB")}
        </div>
        <div className="text-[12px] text-[#5FD3A6]/70 mt-1">£{weekly.toLocaleString("en-GB")} / week</div>
      </div>
      <button
        onClick={() => { trackEvent("cta_click", { label: "void_calc_cta" }); navigate("/list-your-fleet"); }}
        className="w-full py-3.5 bg-white text-[#0B6B4F] font-bold text-[14px] rounded-xl hover:bg-[#F0F0F0] transition-colors"
      >
        Fill idle cars in 48 hours
      </button>
    </div>
  );
}
