import { useNavigate } from "react-router-dom";
import { Gauge, CalendarCheck, User, Building2, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/api";
import {
  formatPrice, formatMileage, formatDate, licenceTone, TONE_CLASSES, typeLabel, monthsLeft,
} from "@/lib/phv";

export default function SaleCard({ v }) {
  const navigate = useNavigate();
  const { savedSales, toggleSavedSale } = useAuth();
  const isSaved = savedSales.includes(v.id);
  const months = v.pco_months_left ?? monthsLeft(v.pco_expiry);
  const badge = licenceTone(months);
  const SellerIcon = v.seller_type === "operator" ? Building2 : User;

  const open = () => {
    trackEvent("sale_card_click", { listing_id: v.id });
    navigate(`/marketplace/${v.id}`);
  };

  return (
    <div data-testid={`sale-card-${v.id}`} onClick={open} role="link" tabIndex={0}
      aria-label={`${v.year} ${v.make} ${v.model}, ${formatPrice(v.price)}, in ${v.borough}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
      className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F] focus-visible:ring-offset-2 bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200/70 hover:ring-slate-300 hover:shadow-[0_12px_40px_-12px_rgba(20,33,27,0.25)] transition-all duration-300">
      <div className="relative aspect-[16/11] overflow-hidden bg-[#EFEDE8]">
        <img src={v.photos[0]} alt={`${v.make} ${v.model}`} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />

        <span data-testid={`sale-pco-${v.id}`}
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${TONE_CLASSES[badge.tone]}`}>
          <CalendarCheck className="w-3.5 h-3.5" /> {badge.text}
        </span>

        <button data-testid={`sale-save-${v.id}`} aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save this vehicle"}
          onClick={(e) => { e.stopPropagation(); toggleSavedSale(v.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
          <Heart className={`w-[18px] h-[18px] ${isSaved ? "fill-[#B4472E] text-[#B4472E]" : "text-[#3B4A44]"}`} />
        </button>

        {v.status === "under_offer" && (
          <span className="absolute bottom-3 right-3 rounded-full bg-[#1A2E25] text-white px-2.5 py-1 text-[12px] font-semibold">
            Under offer
          </span>
        )}

        <span className="absolute bottom-3 left-3 inline-flex items-center text-[12.5px] font-medium text-white bg-black/45 backdrop-blur-sm rounded-full px-2.5 py-1">
          {v.borough}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-[17px] text-[#1A2E25] leading-snug truncate">
              {v.make} {v.model}
            </h3>
            <p className="text-[13px] text-[#7A857F] mt-0.5 capitalize">
              {v.year} · {v.fuel} · {typeLabel(v.vehicle_type)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[22px] font-heading font-extrabold text-[#1A2E25] leading-none">{formatPrice(v.price)}</div>
            <div className="text-[12px] text-[#7A857F] mt-1">{v.open_to_offers ? "Open to offers" : "Fixed price"}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-2 text-[13px] text-[#3B4A44]">
          <span className="inline-flex items-center gap-1.5"><Gauge className="w-4 h-4 text-[#7A857F]" /> {formatMileage(v.mileage)}</span>
          <span className="inline-flex items-center gap-1.5 justify-end"><SellerIcon className="w-4 h-4 text-[#7A857F]" /> {v.seller_label}</span>
        </div>

        <p className="mt-2 text-[12.5px] text-[#7A857F]">
          MOT to {formatDate(v.mot_expiry)} · ULEZ {String(v.ulez).toLowerCase()}
        </p>
      </div>
    </div>
  );
}
