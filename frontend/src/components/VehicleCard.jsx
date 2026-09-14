import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart } from "lucide-react";

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const {
    id, make, model, year, fuel, weekly_rent, borough,
    photos, rating, review_count, transmission, body_type,
  } = vehicle;

  const photo = Array.isArray(photos) ? photos[0] : photos;

  return (
    <article
      onClick={() => navigate(`/vehicle/${id}`)}
      className="group bg-white cursor-pointer"
    >
      {/* Image block — plain neutral ground, car photo is the only colour */}
      <div className="relative bg-[#F5F5F5] aspect-[4/3] overflow-hidden rounded-md">
        <img
          src={photo}
          alt={`${year} ${make} ${model}`}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
        {/* Fuel tag — plain monochrome, no colour coding */}
        <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-[11px] font-semibold px-2 py-1 rounded-sm">
          {fuel === "Plug-in Hybrid" ? "PHEV" : fuel === "Electric" ? "EV" : fuel}
        </span>
        {/* Favourite */}
        <button
          onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={saved ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart size={15} className={saved ? "fill-[#111] text-[#111]" : "text-gray-500"} />
        </button>
      </div>

      {/* Card body — text does the work, no colour chrome */}
      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-gray-900 text-[15px] leading-tight truncate">
              {make} {model}
            </h3>
            <p className="text-gray-500 text-[13px] mt-0.5">
              {year} &middot; {body_type} &middot; {transmission}
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
