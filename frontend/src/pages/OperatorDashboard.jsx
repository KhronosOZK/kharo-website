import { useState } from "react";
import {
  Car, TrendingUp, Users, AlertTriangle, Check, X, PoundSterling, Gauge, Plus,
  MapPin, Navigation, Radio, Signal,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { IMG } from "@/lib/images";

const kpis = [
  { l: "Vehicles listed", v: "14", d: "+2 this month", i: Car, up: true },
  { l: "Currently rented", v: "11", d: "78% utilisation", i: Gauge, up: true },
  { l: "Revenue this month", v: "£12,850", d: "+6.4% vs last", i: PoundSterling, up: true },
  { l: "Pending applications", v: "3", d: "Avg. response 4h", i: Users, up: false },
];
const vehicles = [
  { name: "Toyota Prius", plate: "LK22 CAR", driver: "Jordan S.", status: "Moving", area: "A13, Newham", speed: "34 mph", x: 62, y: 30, live: true },
  { name: "Skoda Octavia", plate: "SK20 OCT", driver: "Amara P.", status: "Moving", area: "Croydon", speed: "21 mph", x: 38, y: 72, live: true },
  { name: "Tesla Model 3", plate: "TM23 EVX", driver: "Idle", status: "Idle", area: "Stratford depot", speed: "0 mph", x: 70, y: 55, live: true },
  { name: "Ford Galaxy", plate: "LG21 GXY", driver: "Available", status: "Available", area: "Bromley depot", speed: "0 mph", x: 48, y: 44, live: false },
  { name: "Toyota Camry", plate: "LK22 CMY", driver: "Elif K.", status: "Moving", area: "Westminster", speed: "12 mph", x: 30, y: 38, live: true },
];
const revChart = [
  { name: "Prius", v: 954 }, { name: "Octavia", v: 756 }, { name: "Camry", v: 504 },
  { name: "Galaxy", v: 441 }, { name: "Tesla", v: 612 }, { name: "Caddy", v: 459 },
];
const fleet = [
  ["Toyota Prius 2022", "LK22 CAR · Jordan S.", "Rented", "£265"],
  ["Toyota Camry 2022", "LK22 CMY · unassigned", "Available", "£280"],
  ["Ford Galaxy 2021", "LG21 GXY · unassigned", "Maintenance", "£245"],
  ["Skoda Octavia 2020", "SK20 OCT · Amara P.", "Rented", "£210"],
  ["Tesla Model 3 2023", "TM23 EVX · unassigned", "Available", "£340"],
];
const apps = [
  ["Priya N.", "4 yrs experience · 4.9★ history · Toyota Camry", "Check passed", true],
  ["Tunde A.", "1 yr experience · New driver · Ford Galaxy", "Check pending", false],
  ["Elif K.", "6 yrs experience · 4.7★ history · Toyota Camry", "Check passed", true],
];
const revenue = [["Toyota Prius", "4", "£1,060.00", "£954.00"], ["Skoda Octavia", "4", "£840.00", "£756.00"], ["Toyota Camry", "2", "£560.00", "£504.00"]];
const compliance = ["MOT due in 12 days, Toyota Prius (LK22 CAR)", "Insurance renewal in 30 days, fleet-wide", "PHV licence renewal in 41 days, Ford Galaxy (LG21 GXY)", "Road tax renewal in 58 days, Skoda Octavia (SK20 OCT)"];
const statusColor = (s) => s === "Rented" ? "text-emerald-800 bg-[#E6F5F0]" : s === "Available" ? "text-blue-800 bg-blue-50" : "text-amber-800 bg-amber-50";
const pinColor = (s) => s === "Moving" ? "#5FD3A6" : s === "Idle" ? "#F59E0B" : "#94A3B8";

function LiveMap() {
  return (
    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
      <div className="relative rounded-2xl overflow-hidden bg-[#0A130F] min-h-[360px]" data-testid="fleet-map">
        <img src={IMG.londonNight} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[#0A130F]/55" />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(95,211,166,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(95,211,166,0.06) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-white text-[12px] font-medium border border-white/10">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5FD3A6] opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[#5FD3A6]" /></span>
          Live · {vehicles.filter((v) => v.live).length} vehicles online
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-amber-400/95 px-3 py-1.5 text-[11px] font-semibold text-[#3A2A00] shadow-sm" data-testid="tracking-launch-badge">
          <Radio className="w-3.5 h-3.5" strokeWidth={2} /> Preview · live GPS tracking goes live at launch
        </div>
        {vehicles.map((v) => (
          <div key={v.plate} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${v.x}%`, top: `${v.y}%` }}>
            {v.status === "Moving" && <span className="animate-ping absolute inset-0 m-auto h-8 w-8 rounded-full opacity-40" style={{ background: pinColor(v.status) }} />}
            <div className="relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg" style={{ background: pinColor(v.status) }}>
              <Navigation className="w-3.5 h-3.5 text-[#0A130F]" strokeWidth={2} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap rounded-lg bg-[#1A2E25] text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">{v.name} · {v.speed}</div>
          </div>
        ))}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/70 text-[12px]">
          <span className="flex items-center gap-2"><Signal className="w-3.5 h-3.5 text-[#5FD3A6]" /> GPS refresh every 10s</span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5FD3A6]" /> Moving</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Idle</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" /> At depot</span>
          </span>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#1A2E25]/10 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-[#1A2E25] font-heading font-bold mb-3"><Radio className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /> Live vehicles</div>
        <div className="space-y-2.5">
          {vehicles.map((v) => (
            <div key={v.plate} className="flex items-center justify-between border border-[#1A2E25]/8 rounded-xl p-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: pinColor(v.status) }} />
                <div><div className="text-[13px] font-medium text-[#1A2E25]">{v.name}</div><div className="text-[11.5px] text-[#7A857F] flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.area}</div></div>
              </div>
              <div className="text-right"><div className="text-[12px] font-semibold text-[#1A2E25]">{v.status}</div><div className="text-[11px] text-[#7A857F]">{v.speed}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OperatorDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1A2E25] text-white flex items-center justify-center font-heading font-bold text-lg">SF</div>
          <div><h1 className="text-2xl font-heading font-extrabold text-[#1A2E25]">South Forest Rentals</h1><p className="text-sm text-[#4A564F]">Newham &amp; East London <span className="ml-2 text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">Preview</span></p></div>
        </div>
        <Button className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white hover:-translate-y-[2px] transition-transform"><Plus className="w-4 h-4 mr-2" /> Add vehicle</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex-wrap h-auto bg-white border border-[#1A2E25]/10 p-1">
          {["overview", "tracking", "fleet", "applications", "financials", "compliance"].map((t) => (<TabsTrigger key={t} value={t} className="capitalize data-[state=active]:bg-[#1A2E25] data-[state=active]:text-white" data-testid={`op-tab-${t}`}>{t}</TabsTrigger>))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <motion.div key={k.l} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="bg-white border border-[#1A2E25]/10 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between"><k.i className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} />{k.up && <TrendingUp className="w-4 h-4 text-emerald-600" />}</div>
                <div className="text-2xl font-heading font-extrabold text-[#1A2E25] mt-3">{k.v}</div>
                <div className="text-xs text-[#4A564F]">{k.l}</div>
                <div className="text-xs text-emerald-700 mt-1">{k.d}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-[#1A2E25] text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /> Live vehicle tracking</h3>
              <button onClick={() => setTab("tracking")} className="text-[13px] text-[#0B6B4F] font-medium">Open full map</button>
            </div>
            <LiveMap />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-2 bg-white border border-[#1A2E25]/10 rounded-2xl p-5 shadow-sm">
              <h3 className="font-heading font-bold text-[#1A2E25] mb-4">Net revenue by vehicle (this month)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revChart}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#4A564F" />
                  <Tooltip cursor={{ fill: "#F3F1EC" }} formatter={(x) => [`£${x}`, "Net"]} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>{revChart.map((d, i) => <Cell key={d.name} fill={i % 2 ? "#5FD3A6" : "#0B6B4F"} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white border border-[#1A2E25]/10 rounded-2xl p-5 shadow-sm">
              <h3 className="font-heading font-bold text-[#1A2E25] mb-3">Compliance alerts</h3>
              {compliance.slice(0, 3).map((c) => (<div key={c} className="flex items-start gap-2 py-2 text-sm text-[#4A564F] border-b border-[#1A2E25]/8 last:border-0"><AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> {c}</div>))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <div className="mb-4"><h3 className="font-heading font-bold text-[#1A2E25] text-lg">Where your fleet is right now</h3><p className="text-[13px] text-[#4A564F] mt-1">Every rented car reports its location so you always know where your assets are. Tap a pin for detail.</p></div>
          <LiveMap />
        </TabsContent>

        <TabsContent value="fleet" className="mt-6">
          <div className="bg-white border border-[#1A2E25]/10 rounded-2xl overflow-hidden shadow-sm">
            {fleet.map((r) => (
              <div key={r[0]} className="flex items-center justify-between p-4 border-b border-[#1A2E25]/8 last:border-0 hover:bg-[#F9F8F6]">
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-[#F1EFE9] flex items-center justify-center"><Car className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /></div><div><div className="font-medium text-[#1A2E25] text-sm">{r[0]}</div><div className="text-xs text-[#7A857F]">{r[1]}</div></div></div>
                <div className="flex items-center gap-3"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(r[2])}`}>{r[2]}</span><span className="font-heading font-bold text-[#1A2E25]">{r[3]}<span className="text-xs font-normal text-[#7A857F]">/wk</span></span></div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6 space-y-3">
          {apps.map((a) => (
            <div key={a[0]} className="bg-white border border-[#1A2E25]/10 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F1EFE9] flex items-center justify-center font-heading font-bold text-[#0B6B4F]">{a[0][0]}</div>
                <div><div className="font-medium text-[#1A2E25]">{a[0]}</div><div className="text-xs text-[#7A857F]">{a[1]} · <span className={a[3] ? "text-emerald-700" : "text-amber-700"}>{a[2]}</span></div></div>
              </div>
              <div className="flex gap-2"><Button size="sm" variant="outline" className="rounded-full border-[#1A2E25]/20"><X className="w-4 h-4 mr-1" /> Decline</Button><Button size="sm" className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white"><Check className="w-4 h-4 mr-1" /> Approve</Button></div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <Stat l="Next fortnightly payout" v="£8,415.00" hint="Fri 4 Jul 2026" />
            <Stat l="Deposits held (ring-fenced)" v="£4,400.00" hint="Released on return" />
            <Stat l="Kharo fee this month" v="£1,285.00" hint="10% flat" />
          </div>
          <div className="bg-white border border-[#1A2E25]/10 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3"><h3 className="font-heading font-bold text-[#1A2E25]">Revenue by vehicle, this month</h3><Button size="sm" variant="outline" className="rounded-full border-[#1A2E25]/20">Export CSV</Button></div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#7A857F] text-xs border-b border-[#1A2E25]/8"><th className="py-2">Vehicle</th><th>Weeks</th><th>Gross</th><th className="text-right">Net (after 10%)</th></tr></thead>
              <tbody>{revenue.map((r) => (<tr key={r[0]} className="border-b border-[#1A2E25]/8 last:border-0"><td className="py-2.5 text-[#1A2E25] font-medium">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="text-right text-emerald-700 font-semibold">{r[3]}</td></tr>))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="bg-white border border-[#1A2E25]/10 rounded-2xl p-5 shadow-sm">{compliance.map((c) => (<div key={c} className="flex items-center gap-2 py-3 text-sm text-[#4A564F] border-b border-[#1A2E25]/8 last:border-0"><AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> {c}</div>))}</div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

const Stat = ({ l, v, hint }) => (<div className="bg-white border border-[#1A2E25]/10 rounded-2xl p-5 shadow-sm"><div className="text-xs text-[#7A857F]">{l}</div><div className="text-xl font-heading font-extrabold text-[#1A2E25] mt-1">{v}</div><div className="text-xs text-[#94A3B8] mt-0.5">{hint}</div></div>);
