import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, AlertTriangle, Check, X, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useSeo } from "@/lib/seo";

const kpis = [
  { l: "Vehicles listed", v: "14" },
  { l: "Currently rented", v: "11" },
  { l: "Revenue this month", v: "£12,850" },
  { l: "Pending applications", v: "3" },
];
const vehicles = [
  { name: "Toyota Prius", plate: "LK22 CAR", driver: "Jordan S.", status: "Rented", area: "Newham" },
  { name: "Skoda Octavia", plate: "SK20 OCT", driver: "Amara P.", status: "Rented", area: "Croydon" },
  { name: "Tesla Model 3", plate: "TM23 EVX", driver: "Unassigned", status: "Available", area: "Stratford depot" },
  { name: "Ford Galaxy", plate: "LG21 GXY", driver: "Unassigned", status: "Maintenance", area: "Bromley depot" },
];
const revChart = [
  { name: "Prius", v: 954 }, { name: "Octavia", v: 756 }, { name: "Camry", v: 504 },
  { name: "Galaxy", v: 441 }, { name: "Tesla", v: 612 }, { name: "Caddy", v: 459 },
];
const fleet = [
  ["Toyota Prius 2022", "LK22 CAR, Jordan S.", "Rented", "£265"],
  ["Toyota Camry 2022", "LK22 CMY, unassigned", "Available", "£280"],
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
const statusColor = (s) => s === "Rented" ? "text-green bg-green-soft" : s === "Available" ? "text-ink-2 bg-surface-2" : "text-ink-3 bg-surface-2";

function TrackingNote() {
  return (
    <div className="panel rounded-2xl p-6">
      <div className="flex items-center gap-2 text-ink font-heading font-bold"><MapPin className="w-5 h-5 text-green" strokeWidth={1.75} /> Live vehicle tracking</div>
      <p className="mt-2 text-[14.5px] text-ink-2 leading-relaxed max-w-lg">Tracking arrives with your fleet at launch. Once a car is rented, its location will show here so you always know where your assets are.</p>
      <div className="mt-4 divide-y divide-line">
        {vehicles.map((v) => (
          <div key={v.plate} className="flex items-center justify-between py-2.5 text-[13.5px]">
            <div><span className="font-medium text-ink">{v.name}</span> <span className="text-ink-3">, {v.driver}</span></div>
            <div className="flex items-center gap-3">
              <span className="text-ink-3">{v.area}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(v.status)}`}>{v.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OperatorDashboard() {
  const [tab, setTab] = useState("overview");
  // Every figure below this line is invented demo data down to the company
  // name, the plates and the driver names. Without a guard the whole console
  // was served to anyone who guessed the URL, which reads as a real
  // operator's books. Gated the same way the driver portal is.
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user === false) navigate("/login"); }, [user, navigate]);
  useSeo({ title: "Your fleet · Kharo", description: "Your Kharo operator console.", noindex: true });

  if (!user) return <div className="min-h-page bg-bone wrap py-section text-ink-2">Loading</div>;

  return (
    <main className="min-h-page bg-bone wrap py-section">
      <p className="text-[13px] text-ink-3">Demo account. Figures are illustrative until launch.</p>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center font-heading font-bold text-lg">SF</div>
          <div>
            <h1 className="text-h3 font-heading font-extrabold text-ink">South Forest Rentals</h1>
            <p className="text-sm text-ink-2">Newham and East London <span className="ml-2 text-xs bg-surface-2 text-ink-3 px-2 py-0.5 rounded-full">Preview</span></p>
          </div>
        </div>
        <Button><Plus className="w-4 h-4" strokeWidth={1.75} /> Add vehicle</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex-wrap h-auto bg-surface border border-line p-1">
          {["overview", "tracking", "fleet", "applications", "financials", "compliance"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize data-[state=active]:bg-ink data-[state=active]:text-white" data-testid={`op-tab-${t}`}>{t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="figures">
            {kpis.map((k) => (
              <div key={k.l}>
                <div className="text-h3 font-heading font-extrabold text-ink tabular">{k.v}</div>
                <div className="text-[13px] text-ink-3 mt-1">{k.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-ink text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-green" strokeWidth={1.75} /> Live vehicle tracking</h3>
              <button onClick={() => setTab("tracking")} className="text-[13px] text-green font-medium">Open full view</button>
            </div>
            <TrackingNote />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-2 panel rounded-2xl p-5">
              <h3 className="font-heading font-bold text-ink mb-4">Net revenue by vehicle, this month</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revChart}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#5C6862" />
                  <Tooltip cursor={{ fill: "#F0F0EB" }} formatter={(x) => [`£${x}`, "Net"]} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>{revChart.map((d, i) => <Cell key={d.name} fill={i % 2 ? "#5FD3A6" : "#0B6B4F"} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="panel rounded-2xl p-5">
              <h3 className="font-heading font-bold text-ink mb-3">Compliance alerts</h3>
              {compliance.slice(0, 3).map((c) => (<div key={c} className="flex items-start gap-2 py-2 text-sm text-ink-2 border-b border-line last:border-0"><AlertTriangle className="w-4 h-4 text-ink-3 shrink-0 mt-0.5" strokeWidth={1.75} /> {c}</div>))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <div className="mb-4"><h3 className="font-heading font-bold text-ink text-lg">Where your fleet is right now</h3><p className="text-[13px] text-ink-2 mt-1">Every rented car reports its location here once tracking is live.</p></div>
          <TrackingNote />
        </TabsContent>

        <TabsContent value="fleet" className="mt-6">
          <div className="panel rounded-2xl overflow-hidden divide-y divide-line">
            {fleet.map((r) => (
              <div key={r[0]} className="flex items-center justify-between flex-wrap gap-3 p-4 hover:bg-surface-2">
                <div className="flex items-center gap-3"><Car className="w-7 h-7 text-green shrink-0" strokeWidth={1.75} /><div><div className="font-medium text-ink text-sm">{r[0]}</div><div className="text-xs text-ink-3">{r[1]}</div></div></div>
                <div className="flex items-center gap-3"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(r[2])}`}>{r[2]}</span><span className="font-heading font-bold text-ink tabular">{r[3]}<span className="text-xs font-normal text-ink-3">/wk</span></span></div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6 space-y-3">
          {apps.map((a) => (
            <div key={a[0]} className="panel rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center font-heading font-bold text-green">{a[0][0]}</div>
                <div><div className="font-medium text-ink">{a[0]}</div><div className="text-xs text-ink-3">{a[1]}, <span className={a[3] ? "text-green" : "text-ink-3"}>{a[2]}</span></div></div>
              </div>
              <div className="flex gap-2"><Button size="sm" variant="outline"><X className="w-4 h-4" strokeWidth={1.75} /> Decline</Button><Button size="sm"><Check className="w-4 h-4" strokeWidth={1.75} /> Approve</Button></div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <div className="figures">
            <Stat l="Next fortnightly payout" v="£8,415.00" hint="Friday" />
            <Stat l="Deposits held (ring-fenced)" v="£4,400.00" hint="Released on return" />
            <Stat l="Kharo fee this month" v="£1,285.00" hint="Kharo fee" />
          </div>
          <div className="panel rounded-2xl p-5 mt-4">
            <div className="flex items-center justify-between mb-3"><h3 className="font-heading font-bold text-ink">Revenue by vehicle, this month</h3><Button size="sm" variant="outline">Export CSV</Button></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[420px]">
                <thead><tr className="text-left text-ink-3 text-xs border-b border-line"><th className="py-2">Vehicle</th><th>Weeks</th><th>Gross</th><th className="text-right">Net to you</th></tr></thead>
                <tbody>{revenue.map((r) => (<tr key={r[0]} className="border-b border-line last:border-0"><td className="py-2.5 text-ink font-medium">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="text-right text-green font-semibold">{r[3]}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="panel rounded-2xl p-5 divide-y divide-line">{compliance.map((c) => (<div key={c} className="flex items-center gap-2 py-3 text-sm text-ink-2"><AlertTriangle className="w-4 h-4 text-ink-3 shrink-0" strokeWidth={1.75} /> {c}</div>))}</div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

const Stat = ({ l, v, hint }) => (<div><div className="text-xs text-ink-3">{l}</div><div className="text-h3 font-heading font-extrabold text-ink mt-1 tabular">{v}</div><div className="text-xs text-ink-3 mt-0.5">{hint}</div></div>);
