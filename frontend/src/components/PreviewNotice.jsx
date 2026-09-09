import { Info } from "lucide-react";
import { PREVIEW } from "@/content/site";

/**
 * Honest labelling for the pre-launch rental inventory.
 *
 * The cars shown are representative of what operators in each city rent out,
 * but they are not bookable yet. Saying so plainly is the whole point: it lets
 * us capture demand against a specific vehicle, price and area without ever
 * implying a car is available that is not. Drivers in this trade talk to each
 * other, and a reputation for advertising cars that do not exist is not
 * recoverable.
 *
 * variant "banner" sits at the top of a listing page.
 * variant "inline" sits inside a card or panel next to a call to action.
 */
export default function PreviewNotice({ variant = "banner", className = "" }) {
  if (variant === "inline") {
    return (
      <div className={`rounded-2xl bg-[#FDF6E7] border border-[#C08A2D]/25 p-3.5 flex gap-2.5 ${className}`}
        data-testid="preview-notice-inline">
        <Info className="w-4 h-4 text-[#C08A2D] shrink-0 mt-0.5" strokeWidth={1.9} />
        <p className="text-[12.5px] text-[#3A2A00] leading-relaxed">{PREVIEW.inline}</p>
      </div>
    );
  }

  return (
    <div className={`bg-[#FDF6E7] border-b border-[#C08A2D]/25 ${className}`} data-testid="preview-notice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-3 items-start">
        <Info className="w-[18px] h-[18px] text-[#C08A2D] shrink-0 mt-0.5" strokeWidth={1.9} />
        <p className="text-[13px] text-[#3A2A00] leading-relaxed">
          <span className="font-semibold">{PREVIEW.label}</span> {PREVIEW.banner}
        </p>
      </div>
    </div>
  );
}
