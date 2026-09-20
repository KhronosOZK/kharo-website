import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { FACTS } from "@/content/site";

const KEY = "kharo_launch_banner_v1";

/**
 * One line at the very top of every page: when the first city opens and
 * what to do about it. Dismissable, and it stays dismissed on that browser.
 * Rendered by App.js above the header.
 */
export default function LaunchBanner() {
  const [shown, setShown] = useState(() => {
    try { return localStorage.getItem(KEY) !== "1"; } catch { return true; }
  });
  if (!shown) return null;
  const first = FACTS.launchOrder[0];
  return (
    <div className="relative z-[60] bg-ink text-white" data-testid="launch-banner">
      {/* Text sits in the page column; the close sits at the screen's edge. */}
      <div className="wrap py-2 pr-12 text-[13px] leading-snug">
        <p>
          We open in {first} in {FACTS.launch[first]}. <Link to="/register" className="font-semibold text-green underline-offset-4 hover:underline">Register now</Link> and we call you first.
        </p>
      </div>
      <button type="button" aria-label="Hide this message" onClick={() => { setShown(false); try { localStorage.setItem(KEY, "1"); } catch { /* private mode */ } }}
        className="pressable absolute right-[var(--gutter)] top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white">
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
