import { useNavigate } from "react-router-dom";
import { Star, MapPin, Zap, Fuel } from "lucide-react";

const FUEL_COLORS = {
  Electric: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Plug-in Hybrid": "bg-sky-50 text-sky-700 border-sky-200",
  Hybrid: "bg-teal-50 text-teal-700 border-teal-200",
  Petrol: "bg-orange-50 text-orange-700 border-orange-200",
  Diesel: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const {
    id, make, model, year, fuel, weekly_rent, borough,
    photos, rating, review_count, transmission, body_type, breakdown_included,
  } = vehicle;

  const photo = Array.isArray(photos) ? photos[0] : photos;
  const fuelColor = FUEL_COLORS[fuel] || FUEL_COLORS.Petrol;

  return (
    <article
      onClick={() => navigate(`/vehicles/${id}`)}
      className="group bg-white border border-gray-200 rounded-sm overflow-hidden cursor-pointer hover:border-gray-400 hover:shadow-md transition-all duration-200"
    >
      {/* Image block */}
      <div className="relative bg-gray-50 aspect-[16/9] overflow-hidden">
        <img
          src={photo}
          alt={`${year} ${make} ${model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Fuel badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-sm border ${fuelColor}`}>
          {fuel === "Plug-in Hybrid" ? "PHEV" : fuel === "Electric" ? "EV" : fuel}
        </span>
        {/* Breakdown cover badge */}
        {breakdown_included && (
          <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-sm border border-gray-200">
            Breakdown Cover
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <MapPin size={11} className="flex-shrink-0" />
          <span>{borough}, London</span>
        </div>

        {/* Name row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading font-bold text-gray-900 text-base leading-tight">
            {make} {model}
          </h3>
          <span className="font-heading font-bold text-green-800 text-base whitespace-nowrap">
            £{weekly_rent}
            <span className="font-normal text-gray-400 text-xs"> / wk</span>
          </span>
        </div>

        {/* Spec subtitle */}
        <p className="text-gray-400 text-xs mb-3">
          {year} &bull; {body_type} &bull; {transmission}
        </p>

        {/* Rating + insurance line */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-800">{rating?.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({review_count} reviews)</span>
          </div>
          <span className="text-xs text-gray-500 font-medium">Incl. Insurance</span>
        </div>
      </div>
    </article>
  );
}
