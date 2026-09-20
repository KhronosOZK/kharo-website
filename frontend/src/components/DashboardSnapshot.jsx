import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup, useInView } from "framer-motion";
import {
  Wallet, Radio, History, Receipt, FileText, Wrench, LifeBuoy, Car, UserCheck, BellRing, Landmark, Download, Search,
} from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { DRIVER_DASHBOARD, OPERATOR_DASHBOARD } from "@/content/dashboardDemo";
import { EASE, SPRING, useMotionPrefs } from "@/lib/motion";

const ICONS = { Wallet, Radio, History, Receipt, FileText, Wrench, LifeBuoy, Car, UserCheck, BellRing, Landmark };

const TONE = {
  ok:    "text-green bg-green-soft",
  warn:  "text-gold-ink bg-gold-soft",
  muted: "text-ink-3 bg-surface-2",
  link:  "text-green bg-green-soft",
};

const AUTOPLAY_MS = 5000;

/**
 * An interactive snapshot of the Kharo account, built as a real component
 * rather than a screenshot. Visitors click between panels; the selection
 * indicator slides, the headline figure morphs, rows arrive in sequence.
 * Autoplay cycles the panels until the visitor touches it.
 */
export default function DashboardSnapshot({ variant = "driver", className = "", autoplay = true }) {
  const data = variant === "operator" ? OPERATOR_DASHBOARD : DRIVER_DASHBOARD;
  const panels = data.panels;
  const [active, setActive] = useState(panels[0].id);
  const [dir, setDir] = useState(1);
  const [touched, setTouched] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const prevHeadline = useRef(panels[0].headline.value);
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const { reduce } = useMotionPrefs();

  const idx = panels.findIndex((p) => p.id === active);
  const panel = panels[idx];

  const select = (id, fromUser = true) => {
    const next = panels.findIndex((p) => p.id === id);
    if (next === idx) return;
    setDir(next > idx ? 1 : -1);
    prevHeadline.current = panel.headline.value;
    setActive(id);
    setQuery("");
    setFilter("All");
    if (fromUser) setTouched(true);
  };

  const playing = autoplay && !touched && !reduce && inView;

  useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => {
      const next = panels[(idx + 1) % panels.length].id;
      select(next, false);
      setCycle((c) => c + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx, cycle]);

  const onKey = (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (idx + keys[e.key] + panels.length) % panels.length;
    select(panels[next].id);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return panel.rows.filter((r) => {
      if (filter !== "All" && !`${r.status} ${r.t} ${r.d}`.toLowerCase().includes(filter.toLowerCase())) return false;
      if (!q) return true;
      return `${r.t} ${r.d} ${r.status}`.toLowerCase().includes(q);
    });
  }, [panel, query, filter]);

  const panelVariants = useMemo(() => ({
    enter: (d) => ({ opacity: 0, y: reduce ? 0 : 10 * d }),
    center: { opacity: 1, y: 0, transition: { duration: reduce ? 0.12 : 0.22, ease: EASE.out } },
    exit: (d) => ({ opacity: 0, y: reduce ? 0 : -8 * d, transition: { duration: reduce ? 0.08 : 0.15, ease: EASE.out } }),
  }), [reduce]);

  const tabsId = `dash-${variant}`;

  return (
    <LayoutGroup id={tabsId}>
      <div
        ref={rootRef}
        className={`surface-raised overflow-hidden shadow-2 ${className}`}
        data-testid={`dashboard-snapshot-${variant}`}
        onPointerDown={() => setTouched(true)}
      >
        {/* Top bar: a real product header, not browser chrome */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 h-14 border-b border-line bg-surface">
          <div className="flex items-center gap-3 min-w-0">
            <span className="caro-wordmark text-[20px] text-ink leading-none">kharo<span className="text-green">.</span></span>
            <span className="hidden xs:inline text-[12.5px] text-ink-3 truncate">{data.title}</span>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="text-right min-w-0 hidden sm:block">
              <p className="text-[12.5px] font-semibold text-ink leading-tight truncate">{data.user.name}</p>
              <p className="text-[11.5px] text-ink-3 leading-tight truncate">{data.user.sub}</p>
            </div>
            <span className="grid place-items-center w-8 h-8 rounded-full bg-green text-white text-[11px] font-bold tabular">{data.user.initials}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-[clamp(10rem,24%,12.5rem)_minmax(0,1fr)]">
          {/* Tabs: rail on desktop, scrolling strip on phones */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label={`${data.title} sections`}
            onKeyDown={onKey}
            className="flex sm:flex-col gap-1 p-2 sm:p-3 bg-surface-2/60 border-b sm:border-b-0 sm:border-r border-line overflow-x-auto hide-scrollbar snap-x"
          >
            {panels.map((p) => {
              const Icon = ICONS[p.icon] || FileText;
              const isActive = p.id === active;
              return (
                <button
                  key={p.id}
                  role="tab"
                  id={`${tabsId}-tab-${p.id}`}
                  aria-selected={isActive}
                  aria-controls={`${tabsId}-panel-${p.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(p.id)}
                  data-testid={`dashboard-tab-${p.id}`}
                  className={`pressable relative shrink-0 snap-start flex items-center gap-2.5 px-3 h-10 sm:h-auto sm:py-2.5 rounded-lg text-[13.5px] font-medium text-left whitespace-nowrap ${isActive ? "text-white" : "text-ink-2 hover:bg-surface-2"}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="indicator"
                      className="absolute inset-0 rounded-lg bg-green"
                      transition={reduce ? { duration: 0 } : SPRING.ui}
                    />
                  )}
                  <Icon className="relative z-10 w-4 h-4 shrink-0" strokeWidth={1.75} />
                  <span className="relative z-10">{p.label}</span>
                  {playing && isActive && (
                    <motion.span
                      key={`${p.id}-${cycle}`}
                      className="absolute left-3 right-3 bottom-1 h-[2px] origin-left rounded-full bg-white/60 z-10"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div className="relative p-4 sm:p-6 min-h-[26rem] sm:min-h-[27rem] bg-surface">
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.div
                key={panel.id}
                role="tabpanel"
                id={`${tabsId}-panel-${panel.id}`}
                aria-labelledby={`${tabsId}-tab-${panel.id}`}
                custom={dir}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <p className="text-[13px] text-ink-3">{panel.headline.label}</p>
                <p className="mt-1 font-heading font-extrabold text-ink text-[clamp(2rem,1.5rem+2.5vw,3rem)] leading-none tracking-[-0.02em]">
                  <AnimatedNumber
                    value={panel.headline.value}
                    from={prevHeadline.current}
                    prefix={panel.headline.prefix || ""}
                    suffix={panel.headline.suffix || ""}
                  />
                </p>

                <motion.div
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
                  initial="hidden"
                  animate="visible"
                  className="mt-5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {panel.kpis.map((k) => (
                      <motion.div
                        key={k.label}
                        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE.out } } }}
                        className="rounded-lg bg-surface-2/70 px-3.5 py-3 min-w-0"
                      >
                        <p className="text-[11.5px] text-ink-3 truncate">{k.label}</p>
                        <p className="mt-0.5 font-heading font-bold text-ink text-[15.5px] leading-tight truncate tabular">{k.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {(panel.searchLabel || panel.filters) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {panel.searchLabel && (
                        <div className="relative flex-1 min-w-[12rem]">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" strokeWidth={1.75} />
                          <input
                            type="search"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setTouched(true); }}
                            placeholder={panel.searchLabel}
                            aria-label={panel.searchLabel}
                            data-testid={`dashboard-search-${panel.id}`}
                            className="field w-full h-10 rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-base sm:text-[13.5px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/20"
                          />
                        </div>
                      )}
                      {panel.filters && (
                        <div className="flex gap-1 overflow-x-auto hide-scrollbar" role="group" aria-label="Filter">
                          {panel.filters.map((f) => (
                            <button key={f} type="button" onClick={() => { setFilter(f); setTouched(true); }}
                              className={`pressable shrink-0 rounded-md h-9 px-3 text-[12.5px] font-medium ${filter === f ? "bg-ink text-white" : "text-ink-2 hover:bg-surface-2"}`}>
                              {f}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <ul className="mt-3 divide-y divide-line">
                    {rows.length === 0 && (
                      <li className="py-6 text-[13.5px] text-ink-3">Nothing matches that. Try another vehicle or plate.</li>
                    )}
                    {rows.map((r, i) => (
                      <motion.li
                        key={`${panel.id}-${i}`}
                        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE.out } } }}
                        className="flex items-center justify-between gap-3 py-3 min-w-0"
                      >
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium text-ink leading-snug truncate">{r.t}</p>
                          <p className="text-[12.5px] text-ink-3 leading-snug truncate">{r.d}</p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11.5px] font-semibold tabular ${TONE[r.tone] || TONE.muted}`}>
                          {r.tone === "link" && r.status === "PDF" && <Download className="w-3 h-3" strokeWidth={2} />}
                          {r.v}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <p className="mt-4 text-[13px] text-ink-2 leading-relaxed">{panel.foot}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-2.5 border-t border-line bg-surface-2/60 text-[11.5px] text-ink-3">
          Sample account. Names and figures are illustrative.
        </div>
      </div>
    </LayoutGroup>
  );
}
