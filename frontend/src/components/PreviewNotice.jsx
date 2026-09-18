import { Info } from "lucide-react";
import { PREVIEW } from "@/content/site";

/**
 * Honest labelling for the pre-launch rental inventory. The cars shown are
 * representative of what operators in each city rent out, but they are not
 * bookable yet. Saying so plainly lets us capture demand against a specific
 * vehicle, price and area without ever implying a car is available.
 *
 * variant "banner" sits at the top of a listing page.
 * variant "inline" sits inside a card or panel next to a call to action.
 */
export default function PreviewNotice({ variant = "banner", className = "" }) {
  if (variant === "inline") {
    return (
      <div className={`rounded-2xl bg-gold-soft border border-gold/25 p-3.5 flex gap-2.5 ${className}`}
        data-testid="preview-notice-inline">
        <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" strokeWidth={1.75} />
        <p className="text-[13px] text-gold-ink leading-relaxed">{PREVIEW.inline}</p>
      </div>
    );
  }

  return (
    <div className={`bg-gold-soft border-b border-gold/25 ${className}`} data-testid="preview-notice">
      <div className="wrap py-3 flex gap-3 items-start">
        <Info className="w-[18px] h-[18px] text-gold shrink-0 mt-0.5" strokeWidth={1.75} />
        <p className="text-[13.5px] text-gold-ink leading-relaxed">
          <span className="font-semibold">{PREVIEW.label}</span> {PREVIEW.banner}
        </p>
      </div>
    </div>
  );
}
