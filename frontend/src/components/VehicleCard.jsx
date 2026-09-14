import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ArrowUpRight } from "lucide-react";

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const {
    id, make, model, year, fuel, weekly_rent, borough,
    photos, rating, review_count, transmission,
  } = vehicle;

  const photo = Array.isArray(photos) ? photos[0] : photos;

  return (
    <article
      onClick={() => navigate(`/vehicle/${id}`)}
      className="group cursor-pointer"
    >
      {/* Image — tight, cinematic, neutral studio ground */}
      <div className="relative bg-[#EDEDED] aspect-[4/3] overflow-hidden rounded-2xl">
        <img
          src={photo}
          alt={`${year} ${make} ${model}`}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={saved ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart size={15} className={saved ? "fill-[#111] text-[#111]" : "text-gray-500"} />
        </button>

        {/* Check Availability — explicit interest-capture action, appears on hover (desktop) / always (touch) */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/apply/${id}`); }}
          className="absolute bottom-3 left-3 right-3 sm:opacity-0 sm:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-white text-[#0A0A0A] text-[13px] font-semibold py-2.5 rounded-full flex items-center justify-center gap-1.5"
        >
          Check Availability
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Text — no colour chrome, typography carries it */}
      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-gray-900 text-[15px] leading-tight truncate">
              {make} {model}
            </h3>
            <p className="text-gray-500 text-[13px] mt-0.5">
              {year} &middot; {fuel} &middot; {transmission}
            </p>
          </div>
          <span className="font-heading font-bold text-gray-900 text-[15px] whitespace-nowrap">
            £{weekly_rent}
            <span className="font-normal text-gray-400 text-xs"> / wk</span>
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[12px] font-semibold text-gray-800">{rating?.toFixed(1)}</span>
            <span className="text-[12px] text-gray-400">({review_count})</span>
          </div>
          <span className="text-[12px] text-gray-400">{borough}</span>
        </div>
      </div>
    </article>
  );
}
