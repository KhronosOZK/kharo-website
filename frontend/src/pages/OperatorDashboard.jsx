import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, AlertTriangle, Check, X, Plus, MapPin, LayoutGrid, Users, Wallet, ShieldCheck, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { ConsoleShell, Panel, NotificationsPanel, ChatPanel, FleetMap } from "@/components/ConsoleShell";
import { useSeo } from "@/lib/seo";

// Every figure below is invented demo data down to the company name, the
// plates and the driver names. The page says so at the top.
const kpis = [
  { l: "Vehicles listed", v: "14" },
  { l: "Currently rented", v: "11" },
  { l: "Revenue this month", v: "£12,850" },
  { l: "Pending applications", v: "3" },
];
const vehicles = [
  { name: "Toyota Prius 2022", plate: "LK22 CAR", driver: "Jordan S.", status: "Rented", borough: "Newham", city: "London", seen: "2 min ago", miles: 412, ignition: "On, moving" },
  { name: "Skoda Octavia 2020", plate: "SK20 OCT", driver: "Amara P.", status: "Rented", borough: "Croydon", city: "London", seen: "6 min ago", miles: 388, ignition: "On, stationary" },
  { name: "Toyota Camry 2022", plate: "LK22 CMY", driver: "Priya N.", status: "Rented", borough: "Greenwich", city: "London", seen: "1 min ago", miles: 455, ignition: "On, moving" },
  { name: "Tesla Model 3 2023", plate: "TM23 EVX", driver: "Unassigned", status: "Available", borough: "Stratford", city: "London", seen: "Parked 3 days", miles: 0, ignition: "Off" },
  { name: "Ford Galaxy 2021", plate: "LG21 GXY", driver: "Unassigned", status: "Maintenance", borough: "Bromley", city: "London", seen: "At garage", miles: 0, ignition: "Off" },
];
const revChart = [
  { name: "Prius", v: 954 }, { name: "Octavia", v: 756 }, { name: "Camry", v: 504 },
  { name: "Galaxy", v: 441 }, { name: "Tesla", v: 612 }, { name: "Caddy", v: 459 },
];
const fleet = [
  ["Toyota Prius 2022", "LK22 CAR, Jordan S.", "Rented", "£265"],
  ["Toyota Camry 2022", "LK22 CMY, Priya N.", "Rented", "£280"],
  ["Ford Galaxy 2021", "LG21 GXY, unassigned", "Maintenance", "£245"],
  ["Skoda Octavia 2020", "SK20 OCT, Amara P.", "Rented", "£210"],
  ["Tesla Model 3 2023", "TM23 EVX, unassigned", "Available", "£340"],
];
const apps = [
  ["Priya N.", "4 years experience, Toyota Camry", "Check passed", true],
  ["Tunde A.", "1 year experience, Ford Galaxy", "Check pending", false],
  ["Elif K.", "6 years experience, Toyota Camry", "Check passed", true],
];
const revenue = [["Toyota Prius", "4", "£1,060.00", "£954.00"], ["Skoda Octavia", "4", "£840.00", "£756.00"], ["Toyota Camry", "2", "£560.00", "£504.00"]];
const compliance = ["MOT due in 12 days, Toyota Prius (LK22 CAR)", "Insurance renewal in 30 days, fleet-wide", "PHV licence renewal in 41 days, Ford Galaxy (LG21 GXY)", "Road tax renewal in 58 days, Skoda Octavia (SK20 OCT)"];
const NOTIFICATIONS = [
  { id: 1, t: "New application for the Toyota Camry", d: "Priya N., 4 years experience, DVLA and identity checks passed. Reply within two days to keep the slot.", when: "25 min ago", read: false },
  { id: 2, t: "Rent collected: £265 from Jordan S.", d: "Paid on time. Your fortnightly payout is on Friday.", when: "Today, 06:00", read: false },
  { id: 3, t: "Fault reported on SK20 OCT", d: "Amara P. reported a warning light. Kharo booked Croydon Fleet Garage for Thursday 8am.", when: "Yesterday", read: false },
  { id: 4, t: "MOT due in 12 days on LK22 CAR", d: "Book it now so the car stays on the road. The driver has been told.", when: "2 days ago", read: true },
];
const THREADS = [
  { id: "kharo", name: "Kharo operator desk", role: "Your account manager", when: "09:15", last: "Priya's application is with you. Let me know if you want the checks in detail.", messages: [
    { from: "them", text: "Morning. Priya N.'s application for the Camry is in your queue. DVLA, identity and affordability all passed.", at: "09:14" },
    { from: "them", text: "Let me know if you want the checks in detail before you decide.", at: "09:15" },
  ] },
  { id: "amara", name: "Amara P.", role: "Driver, SK20 OCT", when: "Yesterday", last: "Thank you, I will drop it at the garage Thursday morning.", messages: [
    { from: "them", text: "Hi, an engine warning light came on this afternoon. Car still drives fine.", at: "15:20" },
    { from: "me", text: "Thanks for telling us. Kharo has booked Croydon Fleet Garage for Thursday at 8am. Keep driving until then unless it changes.", at: "15:48" },
    { from: "them", text: "Thank you, I will drop it at the garage Thursday morning.", at: "15:52" },
  ] },
  { id: "jordan", name: "Jordan S.", role: "Driver, LK22 CAR", when: "Mon", last: "Paid. Cheers.", messages: [
    { from: "me", text: "Reminder that rent goes out Monday morning as usual.", at: "08:02" },
    { from: "them", text: "Paid. Cheers.", at: "08:40" },
  ] },
];
const statusColor = (s) => s === "Rented" ? "text-green bg-green-soft" : s === "Available" ? "text-ink-2 bg-surface-2" : "text-ink-3 bg-surface-2";

function Tracking({ compact = false }) {
  const [selected, setSelected] = useState(vehicles[0].plate);
  const rows = compact ? vehicles.slice(0, 3) : vehicles;
  return (
    <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-[minmax(0,1fr)_22rem]"}`}>
      <FleetMap vehicles={vehicles} selected={selected} onSelect={setSelected} className={compact ? "h-64" : "h-[26rem]"} />
      <Panel title="Where each car is" className="min-w-0">
        <ul className="divide-y divide-line" data-testid="tracking-list">
          {rows.map((v) => (
            <li key={v.plate}>
              <button type="button" onClick={() => setSelected(v.plate)} aria-pressed={selected === v.plate}
                className={`pressable -mx-2 block w-[calc(100%+1rem)] rounded-md px-2 py-3 text-left ${selected === v.plate ? "bg-green-soft" : "hover:bg-surface-2"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-ink">{v.name}</span>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11.5px] font-semibold ${statusColor(v.status)}`}>{v.status}</span>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-x-3 text-[12.5px] text-ink-3">
                  <span>{v.plate} · {v.driver}</span>
                  <span className="text-right">{v.borough}, {v.seen}</span>
                  <span>{v.ignition}</span>
                  <span className="text-right tabular">{v.miles ? `${v.miles} miles this week` : "No miles this week"}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
        {!compact && <p className="mt-3 text-[12px] leading-relaxed text-ink-3">A tracker goes on before handover. Positions refresh every 30 seconds at launch; these are demo positions. Map © OpenStreetMap contributors, © CARTO.</p>}
      </Panel>
    </div>
  );
}

export default function OperatorDashboard() {
  const [view, setView] = useState("overview");
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user === false) navigate("/login"); }, [user, navigate]);
  useSeo({ title: "Your fleet · Kharo", description: "Your Kharo operator console.", noindex: true });

  if (!user) return <div className="min-h-page bg-bone wrap py-section text-ink-2">Loading</div>;

  const nav = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "tracking", label: "Tracking", icon: MapPin, count: vehicles.filter((v) => v.status === "Rented").length },
    { id: "fleet", label: "Fleet", icon: Car, count: fleet.length },
    { id: "applications", label: "Applications", icon: Users, count: apps.length },
    { id: "financials", label: "Financials", icon: Wallet },
    { id: "compliance", label: "Compliance", icon: ShieldCheck, count: compliance.length },
    { id: "notifications", label: "Notifications", icon: Bell, count: NOTIFICATIONS.filter((n) => !n.read).length },
    { id: "chat", label: "Chat", icon: MessageSquare, count: THREADS.length },
  ];

  return (
    <ConsoleShell
      nav={nav} active={view} onSelect={setView}
      title="South Forest Rentals"
      subtitle="Newham and East London · preview console"
      note="Demo account. Figures are illustrative until launch."
      city="London"
      actions={<Button><Plus className="h-4 w-4" strokeWidth={1.75} /> Add vehicle</Button>}
    >
      {view === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((k) => (
              <Panel key={k.l}>
                <div className="font-heading text-h3 font-extrabold text-ink tabular">{k.v}</div>
                <div className="mt-1 text-[13px] text-ink-3">{k.l}</div>
              </Panel>
            ))}
          </div>
          <Panel title="Live vehicle tracking" action={<button onClick={() => setView("tracking")} className="pressable text-[13px] font-medium text-green">Open full view</button>}>
            <Tracking compact />
          </Panel>
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2" title="Net revenue by vehicle, this month">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revChart}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#6A6F6C" />
                  <Tooltip cursor={{ fill: "#EAEAE5" }} formatter={(x) => [`£${x}`, "Net"]} />
                  <Bar dataKey="v" radius={[4, 4, 0, 0]}>{revChart.map((d, i) => <Cell key={d.name} fill={i % 2 ? "#7FD8B0" : "#0E3B2C"} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel title="Compliance alerts" action={<button onClick={() => setView("compliance")} className="pressable text-[13px] font-medium text-green">All</button>}>
              {compliance.slice(0, 3).map((c) => (<div key={c} className="flex items-start gap-2 border-b border-line py-2 text-sm text-ink-2 last:border-0"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} /> {c}</div>))}
            </Panel>
          </div>
        </div>
      )}

      {view === "tracking" && <Tracking />}

      {view === "fleet" && (
        <Panel title="Your vehicles">
          <div className="divide-y divide-line">
            {fleet.map((r) => (
              <div key={r[0]} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="flex items-center gap-3"><Car className="h-7 w-7 shrink-0 text-green" strokeWidth={1.75} /><div><div className="text-sm font-medium text-ink">{r[0]}</div><div className="text-xs text-ink-3">{r[1]}</div></div></div>
                <div className="flex items-center gap-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusColor(r[2])}`}>{r[2]}</span><span className="font-heading font-bold text-ink tabular">{r[3]}<span className="text-xs font-normal text-ink-3"> a week</span></span></div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {view === "applications" && (
        <div className="space-y-3">
          {apps.map((a) => (
            <Panel key={a[0]} className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-surface-2 font-heading font-bold text-green">{a[0][0]}</div>
                <div><div className="font-medium text-ink">{a[0]}</div><div className="text-xs text-ink-3">{a[1]}, <span className={a[3] ? "text-green" : "text-ink-3"}>{a[2]}</span></div></div>
              </div>
              <div className="flex gap-2"><Button size="sm" variant="outline"><X className="h-4 w-4" strokeWidth={1.75} /> Decline</Button><Button size="sm"><Check className="h-4 w-4" strokeWidth={1.75} /> Accept</Button></div>
            </Panel>
          ))}
        </div>
      )}

      {view === "financials" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat l="Next fortnightly payout" v="£8,415.00" hint="Friday" />
            <Stat l="Deposits held, ring-fenced" v="£4,400.00" hint="Released after the return inspection" />
            <Stat l="Kharo fee this month" v="£1,285.00" hint="Charged on completed rentals" />
          </div>
          <Panel title="Revenue by vehicle, this month" action={<Button size="sm" variant="outline">Export CSV</Button>}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead><tr className="border-b border-line text-left text-xs text-ink-3"><th className="py-2">Vehicle</th><th>Weeks</th><th>Gross</th><th className="text-right">Net to you</th></tr></thead>
                <tbody>{revenue.map((r) => (<tr key={r[0]} className="border-b border-line last:border-0"><td className="py-2.5 font-medium text-ink">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="text-right font-semibold text-green">{r[3]}</td></tr>))}</tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      {view === "compliance" && (
        <Panel title="Renewals coming up">
          <div className="divide-y divide-line">{compliance.map((c) => (<div key={c} className="flex items-center gap-2 py-3 text-sm text-ink-2"><AlertTriangle className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} /> {c}</div>))}</div>
        </Panel>
      )}

      {view === "notifications" && <NotificationsPanel items={NOTIFICATIONS} />}
      {view === "chat" && <ChatPanel threads={THREADS} me="South Forest" />}
    </ConsoleShell>
  );
}

const Stat = ({ l, v, hint }) => (
  <Panel>
    <div className="text-xs text-ink-3">{l}</div>
    <div className="mt-1 font-heading text-h3 font-extrabold text-ink tabular">{v}</div>
    <div className="mt-0.5 text-xs text-ink-3">{hint}</div>
  </Panel>
);
