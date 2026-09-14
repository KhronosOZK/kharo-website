import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "kharo_cookie_consent";

// PECR requires equal prominence between accept and reject, so both buttons
// below share the same size, weight and visual treatment - no dark pattern
// where "Accept" is a bold green CTA and "Reject" is a faint grey link.
export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCookieConsent(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: new Date().toISOString() }));
  } catch {
    // localStorage unavailable (private browsing, blocked storage) - the
    // banner simply reappears next visit, which is the safe failure mode.
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getCookieConsent());
    const reopen = () => setVisible(true);
    window.addEventListener("kharo:open-cookie-preferences", reopen);
    return () => window.removeEventListener("kharo:open-cookie-preferences", reopen);
  }, []);

  if (!visible) return null;

  const choose = (choice) => {
    setCookieConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-[#E8E8E8] shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.15)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-[13px] text-[#555] leading-relaxed flex-1">
          We use essential cookies to keep you signed in, plus optional analytics cookies to understand
          how the site is used. Analytics only runs if you accept. Read more in our{" "}
          <Link to="/legal" className="text-[#0B6B4F] font-medium hover:underline">
            legal and privacy page
          </Link>
          .
        </p>
        {/* Same size, weight and border treatment on both buttons - PECR requires
            equal prominence, so neither choice may be styled to look like the
            "preferred" one. */}
        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={() => choose("rejected")}
            className="px-5 py-2.5 rounded-full border border-[#0A0A0A]/25 text-[#111] font-semibold text-[13.5px] hover:bg-[#F5F5F5] transition-colors"
          >
            Reject analytics
          </button>
          <button
            onClick={() => choose("accepted")}
            className="px-5 py-2.5 rounded-full border border-[#0A0A0A]/25 text-[#111] font-semibold text-[13.5px] hover:bg-[#F5F5F5] transition-colors"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
