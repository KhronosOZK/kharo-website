import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CARD } from "@/content/pages/marketplace";
import { mileageLabel, hasOwnPhoto, INSURANCE_FROM_WEEKLY } from "@/lib/format";
import { shortAuthority } from "@/lib/cities";

const MAX_ZONES = 5;

/**
 * The browse card: a white card, the photograph inside it, the name and one
 * spec line under it, and the price where a buyer's eye lands. The whole
 * card is the link; the heart and "Register interest" sit above it.
 *
 * The photo scrubs through the vehicle's other shots on hover (pointer
 * devices) or on tap of the left/right half (touch devices).
 */
export default function VehicleCard({ vehicle, compact = false }) {
  const navigate = useNavigate();
  const [hasHover] = useState(() => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    id, make, model, year, fuel, weekly_rent, borough, seats, transmission,
    photos, mileage_allowance, licence_type,
  } = vehicle;

  const href = `/vehicle/${id}`;
  const uniquePhotos = Array.isArray(photos) ? [...new Set(photos)] : [photos].filter(Boolean);
  const zoneCount = Math.min(uniquePhotos.length, MAX_ZONES);
  const canScrub = zoneCount > 1;

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

  const handleMouseMove = (e) => {
    if (!hasHover || !canScrub || !armed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    setActiveIndex(Math.min(zoneCount - 1, Math.max(0, Math.floor(relX * zoneCount))));
  };
  const handleMouseLeave = () => { if (hasHover) setActiveIndex(0); };

  // Touch: tap the left/right half to step through photos; at either edge
  // the tap opens the car instead. Pointer devices always open the car.
  const handlePhotoClick = (e) => {
    if (hasHover || !canScrub) { navigate(href); return; }
    warmPhotos();
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    if (relX < 0.5 && activeIndex > 0) setActiveIndex((i) => i - 1);
    else if (relX >= 0.5 && activeIndex < zoneCount - 1) setActiveIndex((i) => i + 1);
    else navigate(href);
  };

  const specs = [fuel, transmission, seats ? `${seats} seats` : null, mileageLabel(mileage_allowance)].filter(Boolean);
  const plate = licence_type ? shortAuthority(licence_type.replace(" private hire vehicle licence", "").replace(" PHV plate", "")) : null;

  return (
    <article
      className="group relative flex h-full flex-col rounded-lg border border-line bg-surface p-3 transition-[box-shadow,border-color] duration-hover hover:border-line-strong hover:shadow-2"
      data-testid="vehicle-card"
      onPointerEnter={warmPhotos}
    >
      <Link to={href} aria-label={`${year} ${make} ${model}`} data-testid="vehicle-card-link"
        className="absolute inset-0 z-[1] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green" />

      <div
        className="relative z-[2] aspect-[16/10] cursor-pointer overflow-hidden rounded-md bg-surface-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handlePhotoClick}
      >
        <div className="absolute inset-0">
          {uniquePhotos.slice(0, armed ? MAX_ZONES : Math.max(1, activeIndex + 1)).map((src, i) => (
            <img key={src} src={src} alt={i === 0 ? `${year} ${make} ${model}` : ""} aria-hidden={i === 0 ? undefined : "true"}
              loading="lazy" decoding="async" draggable="false"
              className="absolute inset-0 h-full w-full object-cover" style={{ opacity: i === activeIndex ? 1 : 0 }} />
          ))}
        </div>
        {canScrub && (
          <div className="pointer-events-none absolute left-2 right-2 top-2 flex gap-1">
            {Array.from({ length: zoneCount }).map((_, i) => (
              <span key={i} aria-hidden="true" className={`h-[2px] flex-1 rounded-full transition-colors duration-150 ${i === activeIndex ? "bg-white" : "bg-white/35"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="truncate font-heading text-[16px] font-bold leading-tight text-ink">{make} {model}</h3>
        <p className="mt-0.5 text-[13px] text-ink-3">{year} · {borough}{plate ? ` · ${plate}` : ""}</p>
        {!compact && specs.length > 0 && (
          <p className="mt-1.5 truncate text-[13px] text-ink-3">{specs.join(" · ")}</p>
        )}
        {!hasOwnPhoto(vehicle) && <p className="mt-1 text-[12px] text-ink-3">Photo shows the same model, not this car</p>}

        <div className="mt-auto flex flex-col gap-3 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="tabular">
            <span className="font-heading text-[22px] font-bold tracking-tight text-ink">£{weekly_rent}</span>
            <span className="ml-1 text-[12px] text-ink-3">a week</span>
            <span className="block text-[12px] text-ink-3">+ insurance from £{INSURANCE_FROM_WEEKLY} a week</span>
          </p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/apply/${id}`); }}
            className="pressable group/cta relative z-[3] inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md border border-line-strong px-4 text-[14px] font-semibold text-ink transition-colors duration-hover hover:bg-ink hover:text-white sm:h-9 sm:px-3 sm:text-[13px]"
            data-testid="vehicle-card-apply"
          >
            {CARD.registerInterest}
            <ArrowUpRight size={14} strokeWidth={2.25} className="transition-transform duration-ui ease-out group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
