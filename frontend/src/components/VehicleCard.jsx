import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const [hasHover] = useState(() => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    id, make, model, year, fuel, weekly_rent, borough,
    photos, transmission, mileage_allowance, insurance_included,
    licence_type, cross_border,
  } = vehicle;

  const uniquePhotos = Array.isArray(photos) ? [...new Set(photos)] : [photos].filter(Boolean);
  const zoneCount = Math.min(uniquePhotos.length, MAX_ZONES);
  const canScrub = zoneCount > 1;
  const atLastFrame = canScrub && activeIndex === zoneCount - 1;

  // Warm the other frames the first time a pointer touches the card, so
  // scrubbing swaps instantly instead of flashing an empty box while the
  // browser fetches the next photo.
  const warmed = useRef(false);
  const [armed, setArmed] = useState(false);
  const warmPhotos = () => {
    if (warmed.current || !canScrub) return;
    warmed.current = true;
    const rest = uniquePhotos.slice(1, MAX_ZONES);
    let pending = rest.length;
    if (!pending) { setArmed(true); return; }
    rest.forEach((src) => {
      const img = new Image();
      const done = () => { pending -= 1; if (pending === 0) setArmed(true); };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
  };

  const goToDetail = () => navigate(`/vehicle/${id}`);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetail();
    }
  };


  const handleApply = (e) => {
    e.stopPropagation();
    navigate(`/apply/${id}`);
  };

  const handleMouseMove = (e) => {
    if (!hasHover || !canScrub || !armed) return;
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
    warmPhotos();
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
  // The plate is the first thing a driver checks: a car on the wrong licence
  // is no use to them whatever it costs.
  const plate = licence_type ? licence_type.replace(" private hire vehicle licence", "").replace(" PHV plate", "") : null;

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
        {/* Every frame is mounted and stacked, with only opacity changing.
            Mounting a fresh <img> per frame meant each one had to decode
            before it painted, which is what made scrubbing flicker. */}
        {uniquePhotos.slice(0, armed ? MAX_ZONES : Math.max(1, activeIndex + 1)).map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? `${year} ${make} ${model}` : ""}
            aria-hidden={i === 0 ? undefined : "true"}
            loading="lazy"
            decoding="async"
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          />
        ))}

        {canScrub && (
          <div className="absolute top-2 left-2 right-2 z-10 flex gap-1 pointer-events-none">
            {Array.from({ length: zoneCount }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-[2px] flex-1 rounded-full transition-colors duration-150 ${i === activeIndex ? "bg-white" : "bg-white/35"}`}
              />
            ))}
          </div>
        )}

        {/* Last frame: a readable invitation sitting on a gradient, rather than
            small type lost on a flat wash. */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 transition-opacity duration-200 ease-out ${atLastFrame ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink via-ink/75 to-transparent" />
          <div className="relative flex items-end justify-between gap-3">
            <div>
              <p className="font-heading text-[15px] font-bold leading-tight text-white">That is the tour.</p>
              <p className="mt-0.5 text-[12.5px] text-white/75">Specs, deposit and the full breakdown inside.</p>
            </div>
            <span className="shrink-0 rounded-md bg-white px-3 py-2 text-[13px] font-semibold text-ink">
              See the car
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="font-heading font-bold text-ink text-[16px] leading-tight truncate">{make} {model}</h3>
        <p className="mt-0.5 text-[13px] text-ink-3">{year}, {borough}</p>
        {plate && (
          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="inline-flex items-center rounded border border-line-strong px-1.5 py-0.5 font-semibold text-ink">
              {plate}
            </span>
            {cross_border && <span className="text-ink-3">works across England and Wales</span>}
          </p>
        )}

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
