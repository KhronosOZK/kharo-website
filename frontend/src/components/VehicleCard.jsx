import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SPRING } from "@/lib/motion";
import { CARD } from "@/content/pages/marketplace";

/**
 * The browse card. Editorial, not boxy: the photo carries the visual weight,
 * the text below reads like a listing line, not a stat block. No rating, no
 * review count, no "available now" dot - none of it is real pre-launch.
 */
export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const { saved = [], toggleSaved } = useAuth() || {};
  const heartControls = useAnimation();

  const {
    id, make, model, year, fuel, weekly_rent, borough,
    photos, transmission, mileage_allowance, insurance_included,
  } = vehicle;

  const isSaved = saved.includes(id);
  const photo = Array.isArray(photos) ? photos[0] : photos;

  const goToDetail = () => navigate(`/vehicle/${id}`);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetail();
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSaved?.(id);
    heartControls.start({ scale: [1, 1.28, 1], transition: SPRING.ui });
  };

  const handleApply = (e) => {
    e.stopPropagation();
    navigate(`/apply/${id}`);
  };

  const specs = [fuel, transmission, mileage_allowance ? `${mileage_allowance.toLocaleString()} mi/mo` : null].filter(Boolean);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      className="pressable-card group cursor-pointer"
      data-testid="vehicle-card"
    >
      <div className="relative zoom-media aspect-[4/3] rounded-2xl overflow-hidden bg-surface-2">
        <img
          src={photo}
          alt={`${year} ${make} ${model}`}
          loading="lazy"
          data-zoom
          className="w-full h-full object-cover"
        />
        <motion.button
          type="button"
          onClick={handleSave}
          animate={heartControls}
          className="pressable absolute top-3 right-3 bg-surface/95 rounded-full h-10 w-10 grid place-items-center shadow-1"
          aria-label={isSaved ? "Remove from saved cars" : "Save this car"}
          aria-pressed={isSaved}
          data-testid="vehicle-card-save"
        >
          <Heart size={17} strokeWidth={1.75} className={isSaved ? "fill-ink text-ink" : "text-ink-3"} />
        </motion.button>
      </div>

      <div className="pt-3.5">
        <h3 className="font-heading font-bold text-ink text-[17px] leading-tight truncate">{make} {model}</h3>
        <p className="mt-0.5 text-[13px] text-ink-3">{year}, {borough}</p>

        <div className="mt-3 hairline" />

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="tabular">
            <span className="font-heading font-extrabold text-ink text-[21px]">£{weekly_rent}</span>
            <span className="ml-1.5 text-[13px] text-ink-3">a week</span>
          </p>
          <button
            type="button"
            onClick={handleApply}
            className="pressable shrink-0 text-[13.5px] font-semibold text-green"
            data-testid="vehicle-card-apply"
          >
            {CARD.registerInterest}
          </button>
        </div>

        {specs.length > 0 && (
          <div className="mt-2.5 flex items-center gap-2 text-[12.5px] text-ink-3">
            {specs.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="w-px h-3 bg-line-strong" />}
                {s}
              </span>
            ))}
          </div>
        )}

        <p className="mt-2 text-[12px] text-ink-3 leading-relaxed">
          {insurance_included ? CARD.insuranceIncluded : CARD.rentalOnly}
        </p>
      </div>
    </article>
  );
}
