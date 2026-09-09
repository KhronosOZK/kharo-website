import { useNavigate } from "react-router-dom";
import { Heart, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/api";

export default function VehicleCard({ v }) {
  const navigate = useNavigate();
  const { saved, toggleSaved, compare, toggleCompare } = useAuth();
  const isSaved = saved.includes(v.id);
  const inCompare = compare.includes(v.id);

  const open = () => {
    trackEvent("card_click", { listing_id: v.id });
    navigate(`/vehicle/${v.id}`);
  };

  return (
    <div data-testid={`vehicle-card-${v.id}`} onClick={open} role="link" tabIndex={0}
      aria-label={`${v.year} ${v.make} ${v.model}, £${v.weekly_rent} per week, in ${v.borough}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
      className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B4F] focus-visible:ring-offset-2 bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200/70 hover:ring-slate-300 hover:shadow-[0_12px_40px_-12px_rgba(20,33,27,0.25)] transition-all duration-300">
      <div className="relative aspect-[16/11] overflow-hidden bg-[#EFEDE8]">
        <img src={v.photos[0]} alt={`${v.make} ${v.model}`} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
        <button data-testid={`save-btn-${v.id}`} aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save this car"}
          onClick={(e) => { e.stopPropagation(); toggleSaved(v.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
          <Heart className={`w-[18px] h-[18px] ${isSaved ? "fill-[#B4472E] text-[#B4472E]" : "text-[#3B4A44]"}`} />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center text-[12.5px] font-medium text-white bg-black/45 backdrop-blur-sm rounded-full px-2.5 py-1">
          {v.borough}
        </span>
        <button data-testid={`compare-check-${v.id}`}
          onClick={(e) => { e.stopPropagation(); toggleCompare(v.id); }}
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[12px] font-medium text-[#3B4A44] hover:bg-white transition-colors">
          <span className={`w-4 h-4 rounded border flex items-center justify-center ${inCompare ? "bg-[#0B6B4F] border-[#0B6B4F]" : "border-slate-400 bg-white"}`}>{inCompare && <Check className="w-3 h-3 text-white" strokeWidth={3} />}</span>
          Compare
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-[17px] text-[#1A2E25] leading-snug truncate">{v.make} {v.model}</h3>
            <p className="text-[13px] text-[#7A857F] mt-0.5 capitalize">{v.year} · {v.fuel} · {v.seats} seats</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[22px] font-heading font-extrabold text-[#1A2E25] leading-none">£{v.weekly_rent}</div>
            <div className="text-[12px] text-[#7A857F] mt-1">per week</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[13px]">
          <span className="text-[#3B4A44]">
            {v.fuel === "electric" ? "ULEZ exempt" : "ULEZ compliant"}
          </span>
          <span className="flex items-center gap-1.5 text-[#1A2E25] font-medium">
          </span>
        </div>
        <p className="mt-2 text-[12.5px] text-[#7A857F]">
          {v.breakdown_included ? "Breakdown cover and servicing included" : "Insurance and cover available at checkout"}
        </p>
      </div>
    </div>
  );
}
