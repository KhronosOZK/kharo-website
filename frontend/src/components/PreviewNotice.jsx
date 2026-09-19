import { PREVIEW } from "@/content/site";

/**
 * Pre-launch labelling. Deliberately quiet: a hairline rule and a line of
 * text, not a coloured alert box. The point is honesty, not alarm.
 */
export default function PreviewNotice({ variant = "banner", className = "" }) {
  if (variant === "inline") {
    return (
      <p className={`text-[13px] text-ink-3 leading-relaxed border-l-2 border-line-strong pl-3 ${className}`} data-testid="preview-notice-inline">
        {PREVIEW.inline}
      </p>
    );
  }

  return (
    <div className={`bg-surface border-b border-line ${className}`} data-testid="preview-notice">
      <div className="wrap py-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[12.5px] font-semibold text-ink">{PREVIEW.label}</span>
        <span className="text-[12.5px] text-ink-3 leading-relaxed">{PREVIEW.short}</span>
      </div>
    </div>
  );
}
