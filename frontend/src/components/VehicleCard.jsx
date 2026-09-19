import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { EASE, SPRING } from "@/lib/motion";
import { CARD } from "@/content/pages/marketplace";

const MAX_ZONES = 5;

/**
 * The browse card. Editorial, not boxy: the photo carries the visual weight,
 * the text below reads like a listing line, not a stat block. No rating, no
 * review count, no "available now" dot - none of it is real pre-launch.
 *
 * The photo scrubs through the vehicle's other shots on hover (pointer
 * devices) or on tap of the left/right half (touch devices), with a thin
 * segmented indicator along the top. Reaching the last frame surfaces a
 * "see the full car" prompt instead of a photo.
 */
export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const { saved = [], toggleSaved } = useAuth() || {};
  const heartControls = useAnimation();
  const [hasHover] = useState(() => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    id, make, model, year, fuel, weekly_rent, borough,
    photos, transmission, mileage_allowance, insurance_included,
  } = vehicle;

  const isSaved = saved.includes(id);
  const uniquePhotos = Array.isArray(photos) ? [...new Set(photos)] : [photos].filter(Boolean);
  const zoneCount = Math.min(uniquePhotos.length, MAX_ZONES);
  const canScrub = zoneCount > 1;
  const atLastFrame = canScrub && activeIndex === zoneCount - 1;
  const activePhoto = uniquePhotos[Math.min(activeIndex, uniquePhotos.length - 1)];

  // Warm the other frames the first time a pointer touches the card, so
  // scrubbing swaps instantly instead of flashing an empty box while the
  // browser fetches the next photo.
  const warmed = useRef(false);
  const warmPhotos = () => {
    if (warmed.current || !canScrub) return;
    warmed.current = true;
    uniquePhotos.slice(1, MAX_ZONES).forEach((src) => { const i = new Image(); i.src = src; });
  };

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

  const handleMouseMove = (e) => {
    if (!hasHover || !canScrub) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(zoneCount - 1, Math.max(0, Math.floor(relX * zoneCount)));
    setActiveIndex(idx);
  };
  const handleMouseLeave = () => { if (hasHover) setActiveIndex(0); };

  // Touch: tap the left/right half to step through photos rather than
  // navigating away, except at the edges - tapping past the first or last
  // frame falls through to the card's own click so the card stays reachable.
  const handlePhotoClick = (e) => {
    if (hasHover || !canScrub) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    if (relX < 0.5 && activeIndex > 0) {
      e.stopPropagation();
      setActiveIndex((i) => i - 1);
    } else if (relX >= 0.5 && activeIndex < zoneCount - 1) {
      e.stopPropagation();
      setActiveIndex((i) => i + 1);
    }
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
      onPointerEnter={warmPhotos}
    >
      <div
        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handlePhotoClick}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={activePhoto}
            src={activePhoto}
            alt={`${year} ${make} ${model}`}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE.out }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {canScrub && (
          <div className="absolute top-2 left-2 right-2 z-10 flex gap-1 pointer-events-none">
            {Array.from({ length: zoneCount }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-[2px] flex-1 rounded-full ${i === activeIndex ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        )}

        {atLastFrame && (
          <div className="absolute inset-0 z-10 bg-ink/72 flex flex-col items-center justify-center text-center px-4">
            <p className="text-white font-heading font-bold text-[15px]">Like what you see?</p>
            <span className="mt-1.5 text-white text-[13px] font-semibold underline underline-offset-4">See the full car</span>
          </div>
        )}

        <motion.button
          type="button"
          onClick={handleSave}
          animate={heartControls}
          className="pressable absolute top-2 right-2 z-20 bg-surface/95 rounded-md h-9 w-9 grid place-items-center shadow-1"
          aria-label={isSaved ? "Remove from saved cars" : "Save this car"}
          aria-pressed={isSaved}
          data-testid="vehicle-card-save"
        >
          <Heart size={16} strokeWidth={1.75} className={isSaved ? "fill-ink text-ink" : "text-ink-3"} />
        </motion.button>
      </div>

      <div className="pt-3">
        <h3 className="font-heading font-bold text-ink text-[16px] leading-tight truncate">{make} {model}</h3>
        <p className="mt-0.5 text-[13px] text-ink-3">{year}, {borough}</p>

        <div className="mt-2.5 hairline" />

        <div className="mt-2.5 flex items-baseline justify-between gap-2">
          <p className="tabular">
            <span className="font-heading font-extrabold text-ink text-[20px]">£{weekly_rent}</span>
            <span className="ml-1.5 text-[13px] text-ink-3">a week</span>
          </p>
          <button
            type="button"
            onClick={handleApply}
            className="pressable shrink-0 text-[13px] font-semibold text-green"
            data-testid="vehicle-card-apply"
          >
            {CARD.registerInterest}
          </button>
        </div>

        {specs.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-[12.5px] text-ink-3">
            {specs.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="w-px h-3 bg-line-strong" />}
                {s}
              </span>
            ))}
          </div>
        )}

        <p className="mt-1.5 text-[12px] text-ink-3 leading-relaxed">
          {insurance_included ? CARD.insuranceIncluded : CARD.rentalOnly}
        </p>
      </div>
    </article>
  );
}
