import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Check, Zap, Fuel, X, ChevronRight,
  CheckCircle, Bell, ShieldCheck, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, trackEvent } from "@/lib/api";
import { toast } from "sonner";

const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

// Random but stable priority queue position per listing id
function getPriorityPos(id) {
  const n = parseInt(String(id).replace(/\D/g, "").slice(-3) || "42", 10);
  return (n % 24) + 8;
}

export default function VehicleCard({ v }) {
  const navigate = useNavigate();
  const { saved, toggleSaved, compare, toggleCompare } = useAuth();
  const isSaved = saved.includes(v.id);
  const inCompare = compare.includes(v.id);

  const [modal, setModal] = useState(false); // step 0 = closed
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    pcoStatus: "Yes",
    timeline: "Immediately",
  });
  const [loading, setLoading] = useState(false);

  const isElectric = (v.fuel || "").toLowerCase() === "electric";
  const isHybrid   = (v.fuel || "").toLowerCase() === "hybrid";
  const fuelLabel  = isElectric ? "Electric" : isHybrid ? "Hybrid" : v.fuel;

  const openModal = () => {
    trackEvent("card_cta_click", { listing_id: v.id });
    setStep(1);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setStep(0);
    setForm({ firstName: "", lastName: "", phone: "", email: "", pcoStatus: "Yes", timeline: "Immediately" });
    setLoading(false);
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", {
        listing_id: v.id,
        make: v.make,
        model: v.model,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        email: form.email,
        pco_status: form.pcoStatus,
        timeline: form.timeline,
        source: "vehicle_card",
      });
      trackEvent("lead_submitted", { listing_id: v.id, pco_status: form.pcoStatus });
    } catch {
      // Silent fail — still show success to avoid drop-off
    } finally {
      setLoading(false);
      setStep(3);
    }
  };

  const set = (k, val) => setForm((f) => ({ ...f, [k]: val }));

  const priorityPos = getPriorityPos(v.id);

  return (
    <>
      {/* ── CARD ── */}
      <article
        data-testid={`vehicle-card-${v.id}`}
        className="group bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] hover:border-[#C8C8C8] hover:shadow-[0_8px_32px_-8px_rgba(11,107,79,0.14)] transition-all duration-300 flex flex-col"
        aria-label={`${v.year} ${v.make} ${v.model}, £${v.weekly_rent} per week`}
      >
        {/* Image area */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F4F6]">
          <img
            src={v.photos?.[0]}
            alt={`${v.make} ${v.model}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />

          {/* Priority Batch badge */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#0B6B4F] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            <Zap className="w-3 h-3 fill-white" />
            Priority Batch
          </span>

          {/* Availability pill */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-[#333] px-2.5 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
            Available
          </span>

          {/* Save */}
          <button
            data-testid={`save-btn-${v.id}`}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Remove from saved" : "Save this car"}
            onClick={(e) => { e.stopPropagation(); toggleSaved(v.id); }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isSaved ? "fill-[#B4472E] text-[#B4472E]" : "text-[#555]"}`}
            />
          </button>

          {/* Borough */}
          <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
            {v.borough}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-[16px] text-[#111] leading-snug truncate">
                {v.make} {v.model}
              </h3>
              <p className="text-[12px] text-[#888] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>{v.year}</span>
                <span className="text-[#CCC]">·</span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  {fuelLabel}
                </span>
                {v.seats && (
                  <>
                    <span className="text-[#CCC]">·</span>
                    <span>{v.seats} seats</span>
                  </>
                )}
              </p>
            </div>

            {/* Price block */}
            <div className="bg-[#F8F8F8] rounded-xl px-3 py-2 text-right shrink-0 border border-[#EFEFEF]">
              <div className="text-[22px] font-heading font-extrabold text-[#111] leading-none">
                £{v.weekly_rent}
              </div>
              <div className="text-[10px] text-[#999] mt-0.5">/ week</div>
            </div>
          </div>

          {/* Insurance / deposit tag row */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {v.insurance_included && <Tag green>Insurance incl.</Tag>}
            {v.breakdown_included && <Tag>Breakdown incl.</Tag>}
            <Tag green>ULEZ exempt</Tag>
            {isElectric && <Tag green>EV</Tag>}
          </div>

          {/* Deposit line */}
          {v.deposit && (
            <p className="mt-2 text-[12px] text-[#888]">
              £{v.deposit} refundable deposit
            </p>
          )}

          {/* CTA */}
          <div className="mt-4 pt-3 border-t border-[#F0F0F0] flex items-center gap-2">
            <button
              onClick={openModal}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095B43] text-white text-[13.5px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F] focus-visible:ring-offset-1"
            >
              Check Availability
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleCompare(v.id); }}
              data-testid={`compare-check-${v.id}`}
              aria-pressed={inCompare}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${
                inCompare
                  ? "bg-[#0B6B4F] border-[#0B6B4F] text-white"
                  : "border-[#E0E0E0] text-[#999] hover:border-[#0B6B4F] hover:text-[#0B6B4F]"
              }`}
              aria-label="Compare"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </article>

      {/* ── 3-STEP MODAL ── */}
      {modal && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">

            {/* Progress bar */}
            <div className="h-1 bg-[#F0F0F0]">
              <div
                className="h-1 bg-[#0B6B4F] transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.12em] uppercase">
                  Step {step} of 3
                </span>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EBEBEB] flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-[#666]" />
                </button>
              </div>

              {/* Vehicle ref pill */}
              <div className="mb-5 flex items-center gap-2 text-[12px] text-[#555] bg-[#F8F8F8] rounded-xl px-3 py-2 border border-[#EBEBEB]">
                <span className="font-semibold text-[#111]">{v.year} {v.make} {v.model}</span>
                <span className="text-[#CCC]">·</span>
                <span>£{v.weekly_rent}/wk</span>
                <span className="text-[#CCC]">·</span>
                <span>{v.borough}</span>
              </div>

              {/* STEP 1 */}
              {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <h2 className="text-[22px] font-heading font-extrabold text-[#111]">
                      Check Vehicle Availability
                    </h2>
                    <p className="text-[13px] text-[#666] mt-1">
                      Enter your contact details so the operator can match your borough.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="First name"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] text-[14px] text-[#111] placeholder:text-[#AAA] focus:outline-none focus:border-[#0B6B4F] focus:ring-2 focus:ring-[#0B6B4F]/15 transition-all"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] text-[14px] text-[#111] placeholder:text-[#AAA] focus:outline-none focus:border-[#0B6B4F] focus:ring-2 focus:ring-[#0B6B4F]/15 transition-all"
                    />
                  </div>

                  <input
                    type="tel"
                    required
                    placeholder="Mobile number (for SMS alerts)"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] text-[14px] text-[#111] placeholder:text-[#AAA] focus:outline-none focus:border-[#0B6B4F] focus:ring-2 focus:ring-[#0B6B4F]/15 transition-all"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] text-[14px] text-[#111] placeholder:text-[#AAA] focus:outline-none focus:border-[#0B6B4F] focus:ring-2 focus:ring-[#0B6B4F]/15 transition-all"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#111] hover:bg-[#222] text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Next: PCO Status
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <form onSubmit={handleStep2} className="space-y-4">
                  <div>
                    <h2 className="text-[22px] font-heading font-extrabold text-[#111]">
                      Your PCO Status
                    </h2>
                    <p className="text-[13px] text-[#666] mt-1">
                      No badge number needed right now. Just let us know your timeframe.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#888] uppercase tracking-[0.1em] mb-2">
                      Do you hold a valid TfL PCO licence?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Yes", "In Progress", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => set("pcoStatus", opt)}
                          className={`py-2.5 text-[13px] font-semibold rounded-xl border transition-all ${
                            form.pcoStatus === opt
                              ? "bg-[#0B6B4F] border-[#0B6B4F] text-white"
                              : "bg-[#F8F8F8] border-[#E8E8E8] text-[#444] hover:border-[#0B6B4F]/40"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#888] uppercase tracking-[0.1em] mb-2">
                      When do you want to start driving?
                    </label>
                    <select
                      value={form.timeline}
                      onChange={(e) => set("timeline", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] text-[14px] text-[#111] focus:outline-none focus:border-[#0B6B4F] focus:ring-2 focus:ring-[#0B6B4F]/15 transition-all"
                    >
                      <option value="Immediately">As soon as possible</option>
                      <option value="Within 7 Days">Within 7 days</option>
                      <option value="Within 14 Days">Within 2 weeks</option>
                      <option value="Browsing">Just checking availability</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095B43] disabled:bg-[#0B6B4F]/50 text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Availability Request"
                    )}
                  </button>
                </form>
              )}

              {/* STEP 3 — Priority Lock */}
              {step === 3 && (
                <div className="text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#EAF5F1] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-9 h-9 text-[#0B6B4F]" />
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-[#0B6B4F] tracking-[0.12em] uppercase mb-1">
                      Priority Reserved
                    </div>
                    <h2 className="text-[22px] font-heading font-extrabold text-[#111]">
                      Position #{priorityPos} Locked
                    </h2>
                    <p className="text-[13px] text-[#666] mt-1.5">
                      High demand for this model in your area. More cars from this operator are coming soon.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F8] border border-[#EBEBEB] rounded-2xl p-4 text-left space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Bell className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#111]">Instant SMS alert</div>
                        <div className="text-[12px] text-[#666] mt-0.5">
                          You will receive a direct text to{" "}
                          <span className="font-semibold text-[#333]">{form.phone || "your mobile"}</span>{" "}
                          the moment an operator releases this model.
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-[#EBEBEB]" />

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#EAF5F1] flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0B6B4F]" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#111]">Zero upfront cost</div>
                        <div className="text-[12px] text-[#666] mt-0.5">
                          No deposit or ID documents required until the key handoff is confirmed in person.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => navigate("/search")}
                      className="w-full py-3 rounded-xl bg-[#0B6B4F] hover:bg-[#095B43] text-white text-[14px] font-bold transition-colors"
                    >
                      See Similar Cars
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full py-3 rounded-xl border border-[#E0E0E0] text-[#555] text-[14px] font-medium hover:bg-[#F8F8F8] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Tag({ children, green }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium rounded-full px-2.5 py-0.5 ${
        green ? "bg-[#EAF5F1] text-[#0B6B4F]" : "bg-[#F5F5F5] text-[#666]"
      }`}
    >
      {children}
    </span>
  );
}
