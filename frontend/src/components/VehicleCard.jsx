import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ArrowUpRight, MapPin, Fuel, Cog, Gauge } from "lucide-react";

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const {
    id, make, model, year, fuel, weekly_rent, borough,
    photos, rating, review_count, transmission,
    mileage_allowance, breakdown_included, features,
  } = vehicle;

  const pcoLicensed = features?.includes("PCO Licensed");
  const includesLine = breakdown_included
    ? "Includes insurance, maintenance & breakdown cover"
    : "Includes insurance & maintenance";

  const photo = Array.isArray(photos) ? photos[0] : photos;

  return (
    <article
      onClick={() => navigate(`/vehicle/${id}`)}
      className="group cursor-pointer"
    >
      {/* Image - tight, cinematic, neutral studio ground */}
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
          <Heart size={15} className={saved ? "fill-[#111] text-[#111]" : "text-[#888]"} />
        </button>

        {/* Register Interest - lightweight lead-capture action, appears on hover (desktop) / always (touch) */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/apply/${id}`); }}
          className="absolute bottom-3 left-3 right-3 sm:opacity-0 sm:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-white text-[#0A0A0A] text-[13px] font-semibold py-2.5 rounded-full flex items-center justify-center gap-1.5"
        >
          Register Interest
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Text - no colour chrome, typography carries it */}
      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-[#111] text-[15px] leading-tight truncate">
              {make} {model}
            </h3>
            <p className="text-[#888] text-[13px] mt-0.5">{year}</p>
          </div>
          <span className="font-heading font-bold text-[#111] text-[15px] whitespace-nowrap">
            £{weekly_rent}
            <span className="font-normal text-[#AAA] text-xs"> / wk</span>
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-[12px] text-[#666]">
          <span className="inline-flex items-center gap-1"><MapPin size={12} className="text-[#AAA]" /> {borough}</span>
          <span className="inline-flex items-center gap-1"><Fuel size={12} className="text-[#AAA]" /> {fuel}</span>
          <span className="inline-flex items-center gap-1"><Cog size={12} className="text-[#AAA]" /> {transmission}</span>
          {mileage_allowance && (
            <span className="inline-flex items-center gap-1"><Gauge size={12} className="text-[#AAA]" /> {mileage_allowance.toLocaleString()} mi/mo</span>
          )}
        </div>

        <p className="text-[#AAA] text-[11.5px] mt-1.5">
          {pcoLicensed ? "PCO licensed. " : ""}{includesLine}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[12px] font-semibold text-[#333]">{rating?.toFixed(1)}</span>
            <span className="text-[12px] text-[#AAA]">({review_count})</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[12px] text-[#0B6B4F] font-medium">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#5FD3A6" }} /> Available now
          </span>
        </div>
      </div>
    </article>
  );
}
