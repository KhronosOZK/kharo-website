import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";

const STORAGE_KEY = "kharo_cookie_consent";

// PECR requires equal prominence between accept and reject, so both buttons
// below share the same size, weight and visual treatment.
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
    // localStorage unavailable: the banner simply reappears next visit.
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

  const choose = (choice) => {
    setCookieConsent(choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: EASE.drawer, delay: 0.5 }}
          className="fixed bottom-0 inset-x-0 z-[70] bg-surface border-t border-line shadow-2 pb-safe"
        >
          <div className="wrap py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-[13.5px] text-ink-2 leading-relaxed flex-1">
              We use essential cookies to keep you signed in, plus optional analytics cookies to understand
              how the site is used. Analytics only runs if you accept. Read more on our{" "}
              <Link to="/legal" className="text-green font-medium hover:underline">legal and privacy page</Link>.
            </p>
            <div className="flex flex-wrap gap-2.5 w-full sm:w-auto sm:shrink-0">
              <button
                onClick={() => choose("rejected")}
                className="pressable flex-1 sm:flex-none min-w-[9.5rem] h-11 px-5 rounded-md border border-line-strong bg-surface text-ink font-semibold text-[13.5px] hover:bg-surface-2"
              >
                Reject analytics
              </button>
              <button
                onClick={() => choose("accepted")}
                className="pressable flex-1 sm:flex-none min-w-[9.5rem] h-11 px-5 rounded-md border border-line-strong bg-surface text-ink font-semibold text-[13.5px] hover:bg-surface-2"
              >
                Accept analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
