import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, MapPin, Send, ChevronLeft } from "lucide-react";
import { areaCoords } from "@/lib/geo";

/**
 * The frame both consoles share: a top strip with the time and the city,
 * a sidebar of sections on the left, the section's content on the right.
 * On a phone the sidebar becomes a scrolling row of tabs above the content.
 *
 * Used by pages/DriverPortal.jsx and pages/OperatorDashboard.jsx. Every
 * figure rendered through these panels is demo data, labelled as such by
 * the pages that pass it in.
 */
export function ConsoleShell({ nav, active, onSelect, title, subtitle, actions, city = "London", children, note }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const time = useMemo(() => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(now), [now]);

  return (
    <main className="min-h-page bg-bone">
      <div className="wrap pt-6 lg:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-ink-3">
          <span>{note}</span>
          <span className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><Clock size={14} strokeWidth={1.75} /> {time} (Europe/London)</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} strokeWidth={1.75} /> {city}, UK</span>
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-h3 font-extrabold text-ink">{title}</h1>
            {subtitle && <p className="mt-1 text-[14px] text-ink-2">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </div>

      <div className="wrap grid gap-5 pb-12 pt-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-6">
        <nav aria-label="Console sections" className="lg:sticky lg:top-below-header lg:self-start">
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 hide-scrollbar lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:rounded-lg lg:border lg:border-line lg:bg-surface lg:p-2">
            {nav.map(({ id, label, icon: Icon, count }) => {
              const on = active === id;
              return (
                <li key={id} className="shrink-0">
                  <button type="button" onClick={() => onSelect(id)} aria-current={on ? "page" : undefined} data-testid={`console-nav-${id}`}
                    className={`pressable flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-[14px] font-medium transition-colors duration-ui lg:border-0 ${on ? "border-green/30 bg-green-soft text-ink" : "border-line bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink lg:bg-transparent"}`}>
                    {Icon && <Icon size={17} strokeWidth={1.75} className={on ? "text-green" : "text-ink-3"} />}
                    <span className="whitespace-nowrap">{label}</span>
                    {count > 0 && <span className="tabular ml-auto pl-3 text-[12px] font-semibold text-green">{count}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section className="min-w-0" data-testid={`console-view-${active}`}>{children}</section>
      </div>
    </main>
  );
}

export function Panel({ title, action, children, className = "", ...rest }) {
  return (
    <div className={`rounded-lg border border-line bg-surface p-5 ${className}`} {...rest}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-heading text-[16px] font-bold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/** A list of things that happened, newest first. Marking read is local. */
export function NotificationsPanel({ items: initial }) {
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.read).length;
  return (
    <Panel
      title={`Notifications${unread ? `, ${unread} new` : ""}`}
      action={unread > 0 && (
        <button type="button" onClick={() => setItems(items.map((n) => ({ ...n, read: true })))} className="pressable text-[13px] font-medium text-green hover:underline underline-offset-4" data-testid="notifications-read-all">
          Mark all as read
        </button>
      )}
    >
      <ul className="divide-y divide-line" data-testid="notifications-list">
        {items.map((n) => (
          <li key={n.id}>
            <button type="button" onClick={() => setItems(items.map((m) => (m.id === n.id ? { ...m, read: true } : m)))}
              className="pressable grid w-full grid-cols-[0.75rem_1fr_auto] items-start gap-3 py-3.5 text-left">
              <span aria-hidden="true" className={`mt-2 h-2 w-2 rounded-full ${n.read ? "bg-transparent" : "bg-green"}`} />
              <span>
                <span className={`block text-[14.5px] ${n.read ? "font-medium text-ink-2" : "font-semibold text-ink"}`}>{n.t}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-3">{n.d}</span>
              </span>
              <span className="shrink-0 text-[12px] text-ink-3">{n.when}</span>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Threads on the left, the open conversation on the right. Messages you
 * type are kept in local state; nobody replies, because nobody is there yet. */
export function ChatPanel({ threads: initial, me = "You" }) {
  const [threads, setThreads] = useState(initial);
  const [openId, setOpenId] = useState(initial[0]?.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const open = threads.find((t) => t.id === openId);

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !open) return;
    const at = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setThreads(threads.map((t) => (t.id === open.id ? { ...t, last: text, when: "now", messages: [...t.messages, { from: "me", text, at }] } : t)));
    setDraft("");
  };

  return (
    <div className="grid overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-[16rem_minmax(0,1fr)]" data-testid="chat-panel">
      <ul className={`divide-y divide-line lg:border-r lg:border-line ${mobileOpen ? "hidden lg:block" : ""}`}>
        {threads.map((t) => (
          <li key={t.id}>
            <button type="button" onClick={() => { setOpenId(t.id); setMobileOpen(true); }} aria-current={t.id === openId ? "true" : undefined}
              className={`pressable block w-full px-4 py-3.5 text-left ${t.id === openId ? "bg-green-soft" : "hover:bg-surface-2"}`}>
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[14px] font-semibold text-ink">{t.name}</span>
                <span className="shrink-0 text-[11.5px] text-ink-3">{t.when}</span>
              </span>
              <span className="block text-[12px] text-ink-3">{t.role}</span>
              <span className="mt-1 block truncate text-[13px] text-ink-2">{t.last}</span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div className={`flex min-h-[26rem] flex-col ${mobileOpen ? "" : "hidden lg:flex"}`}>
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <button type="button" onClick={() => setMobileOpen(false)} className="pressable -ml-1 grid h-8 w-8 place-items-center rounded-md text-ink-2 hover:bg-surface-2 lg:hidden" aria-label="Back to conversations">
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <div>
              <p className="text-[14.5px] font-semibold text-ink">{open.name}</p>
              <p className="text-[12px] text-ink-3">{open.role}</p>
            </div>
          </div>
          <ol className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="chat-messages">
            {open.messages.map((m, i) => (
              <li key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-[14px] leading-relaxed ${m.from === "me" ? "bg-green text-white" : "bg-surface-2 text-ink"}`}>
                  {m.text}
                  <span className={`mt-1 block text-[11px] ${m.from === "me" ? "text-white/70" : "text-ink-3"}`}>{m.from === "me" ? me : open.name} · {m.at}</span>
                </div>
              </li>
            ))}
          </ol>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message" aria-label="Message"
              className="field h-11 min-w-0 flex-1 rounded-md border border-line-strong bg-surface px-3 text-[15px] text-ink outline-none focus:border-green" data-testid="chat-input" />
            <button type="submit" className="pressable grid h-11 w-11 shrink-0 place-items-center rounded-md bg-green text-white hover:bg-green-hover" aria-label="Send" data-testid="chat-send">
              <Send size={16} strokeWidth={2} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ── Fleet map for the operator's tracking view ─────────────────────────── */

function FitAll({ points }) {
  const map = useMap();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      map.invalidateSize();
      if (points.length) map.fitBounds(L.latLngBounds(points).pad(0.35), { animate: false });
    });
    return () => cancelAnimationFrame(id);
  }, [map, points]);
  return null;
}

const plateIcon = (plate, status) => L.divIcon({
  className: "",
  html: `<span style="display:inline-block;padding:3px 7px;border-radius:4px;font:600 11px/1.2 Satoshi,system-ui,sans-serif;background:${status === "Rented" ? "#0E3B2C" : "#111312"};color:#fff;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,.25)">${plate}</span>`,
  iconAnchor: [28, 10],
});

export function FleetMap({ vehicles, selected, onSelect, className = "" }) {
  const points = useMemo(() => vehicles.map((v, i) => {
    const [lat, lon] = areaCoords(v.borough, v.city || "London");
    // Spread cars in the same area a little so their labels do not stack.
    return [lat + ((i % 3) - 1) * 0.006, lon + ((i % 2) - 0.5) * 0.012];
  }), [vehicles]);

  return (
    <div className={`overflow-hidden rounded-lg border border-line bg-surface-2 ${className}`} data-testid="fleet-map">
      <MapContainer center={points[0] || [51.5, -0.1]} zoom={11} scrollWheelZoom={false} attributionControl={false} className="h-full w-full">
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" />
        <FitAll points={points} />
        {vehicles.map((v, i) => (
          <Marker key={v.plate} position={points[i]} icon={plateIcon(v.plate, v.status)} opacity={selected && selected !== v.plate ? 0.55 : 1}
            eventHandlers={{ click: () => onSelect?.(v.plate) }} />
        ))}
      </MapContainer>
    </div>
  );
}
