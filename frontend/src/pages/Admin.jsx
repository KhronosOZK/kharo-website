import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Lock, Search } from "lucide-react";
import { toast } from "sonner";
import { api, API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { EASE } from "@/lib/motion";
import { FACTS } from "@/content/site";

const TABS = ["leads", "applications", "interests", "city_requests", "users", "events"];

function Figure({ v, l }) {
  const numeric = typeof v === "number";
  return (
    <div>
      {numeric ? (
        <AnimatedNumber value={v} className="text-h3 font-heading font-extrabold text-ink block" />
      ) : (
        <div className="text-h3 font-heading font-extrabold text-ink tabular">{v ?? "-"}</div>
      )}
      <div className="text-[13px] text-ink-3 mt-1">{l}</div>
    </div>
  );
}

/** A funnel bar whose fill animates on `transform: scaleX()`, never on `width`. */
function FunnelBar({ label, n, max, pct }) {
  const ratio = max > 0 ? Math.max(n / max, 0.02) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-ink-2 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-6 bg-surface-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full w-full bg-green rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ratio }}
          transition={{ duration: 0.6, ease: EASE.out }}
        />
      </div>
      <span className="text-[13px] font-semibold text-ink tabular w-12 text-right">{n}</span>
      <span className="text-[12px] text-ink-3 tabular w-14 text-right">{pct}</span>
    </div>
  );
}

export default function Admin() {
  const { user, login } = useAuth();
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [eventRows, setEventRows] = useState([]);
  const [cityRequestRows, setCityRequestRows] = useState([]);
  const [tab, setTab] = useState("leads");
  const [rows, setRows] = useState([]);
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/admin/summary").then((r) => setSummary(r.data)).catch(() => {});
    api.get("/admin/analytics").then((r) => setAnalytics(r.data)).catch(() => {});
    // The funnel below needs event types (waitlist_start, waitlist_complete,
    // apply_complete) and a vehicle breakdown that /admin/analytics does not
    // aggregate yet, so they are derived here from the raw rows instead of
    // changing the backend.
    api.get("/admin/events").then((r) => setEventRows(r.data)).catch(() => {});
    api.get("/admin/city_requests").then((r) => setCityRequestRows(r.data)).catch(() => {});
  }, [isAdmin]);

  useEffect(() => { if (isAdmin) api.get(`/admin/${tab}`).then((r) => setRows(r.data)).catch(() => setRows([])); setQ(""); setFrom(""); setTo(""); }, [isAdmin, tab]);

  const doLogin = async (e) => {
    e.preventDefault();
    const res = await login(creds.email, creds.password);
    if (!res.ok) toast.error(res.error);
  };

  const exportCsv = () => { window.open(`${API}/admin/export/${tab}`, "_blank"); };

  const columns = useMemo(() => rows.length ? Object.keys(rows[0]).filter((k) => k !== "data" && k !== "password_hash").slice(0, 6) : [], [rows]);
  const filtered = useMemo(() => rows.filter((r) => {
    const cdate = typeof r.created_at === "string" ? r.created_at.slice(0, 10) : "";
    if (from && cdate && cdate < from) return false;
    if (to && cdate && cdate > to) return false;
    if (q) { const hay = columns.map((c) => String(r[c] ?? "")).join(" ").toLowerCase(); if (!hay.includes(q.toLowerCase())) return false; }
    return true;
  }), [rows, q, from, to, columns]);

  const vehicleDemand = useMemo(() => {
    const counts = {};
    cityRequestRows.forEach((r) => {
      const vt = (r.vehicle_type || "").trim();
      if (!vt || vt === "General interest" || vt === "Specific request") return;
      counts[vt] = (counts[vt] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([label, count]) => ({ label, count }));
  }, [cityRequestRows]);

  if (!isAdmin) return (
    <main className="min-h-page bg-bone grid place-items-center px-4 py-section">
      <div className="w-full max-w-sm panel rounded-2xl p-7 sm:p-8">
        <Lock className="w-7 h-7 text-green" strokeWidth={1.75} />
        <h1 className="text-h3 font-heading font-bold text-ink mt-4">Kharo Ops, admin</h1>
        <p className="text-[14px] text-ink-2 mt-1 mb-6">Sign in with your operations account to view captured leads.</p>
        <form onSubmit={doLogin} className="space-y-4">
          <div><Label className="mb-1.5 block text-[13px] text-ink-2">Email</Label><Input type="email" value={creds.email} onChange={(e) => setCreds((p) => ({ ...p, email: e.target.value }))} data-testid="admin-email" /></div>
          <div><Label className="mb-1.5 block text-[13px] text-ink-2">Password</Label><Input type="password" value={creds.password} onChange={(e) => setCreds((p) => ({ ...p, password: e.target.value }))} data-testid="admin-password" /></div>
          <Button type="submit" className="w-full" data-testid="admin-login">Sign in</Button>
        </form>
      </div>
    </main>
  );

  const audience = summary ? summary.drivers + summary.interests : 0;
  const convRate = summary && summary.page_views ? `${((summary.drivers / summary.page_views) * 100).toFixed(1)}%` : "0.0%";

  const headline = summary ? [
    { l: "Total leads captured", v: summary.leads },
    { l: "Driver waitlist signups", v: summary.drivers },
    { l: "Operators interested", v: summary.interests },
    { l: "Cities requested", v: summary.city_requests },
    { l: "Combined audience", v: audience },
    { l: "View to signup", v: convRate },
  ] : [];

  // Funnel: page view, waitlist started, waitlist completed, per-vehicle
  // interest, operator interest. The first three come from raw event rows
  // (waitlist_start / waitlist_complete are new trackEvent calls, not yet
  // aggregated server side); the last two already exist on summary/analytics.
  const countType = (type) => eventRows.filter((r) => r.type === type).length;
  // Every figure comes from the server's own aggregate. Counting these in the
  // browser meant counting inside the newest 1000 event rows, which page views
  // fill on their own, so conversions would fall off the bottom of the window
  // as traffic grew. countType stays for the per-vehicle breakdown below.
  const funnelSteps = analytics ? [
    { l: "Page views", n: analytics.funnel.page_views },
    { l: "Searches", n: analytics.funnel.searches },
    { l: "Waitlist started", n: analytics.funnel.waitlist_start ?? countType("waitlist_start") },
    { l: "Waitlist completed", n: analytics.funnel.waitlist_complete ?? countType("waitlist_complete") },
    { l: "Per-vehicle interest", n: analytics.funnel.apply_complete ?? countType("apply_complete") },
    { l: "Operator interest", n: analytics.funnel.operator_interests ?? (summary ? summary.interests : 0) },
  ] : [];
  const funnelMax = Math.max(...funnelSteps.map((s) => s.n), 1);

  return (
    <main className="min-h-page bg-bone wrap py-section">
      <h1 className="text-h2 font-heading font-extrabold text-ink">Traction</h1>
      <p className="text-ink-2 mt-2 max-w-2xl text-[15px]">Every visitor, search and waitlist join is tracked. This is the demand we are converting ahead of launch across {FACTS.citiesSentence}.</p>

      <div className="figures mt-8">
        {headline.map((h) => <Figure key={h.l} v={h.v} l={h.l} />)}
      </div>

      {/* Trend chart */}
      {analytics?.trend && (
        <div className="panel rounded-2xl p-5 sm:p-6 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <h3 className="font-heading font-bold text-ink text-lg">Growth over the last 14 days</h3>
            <div className="flex gap-4 text-[12px]">
              <span className="flex items-center gap-1.5 text-ink-2"><span className="w-2.5 h-2.5 rounded-full bg-green" /> Page views</span>
              <span className="flex items-center gap-1.5 text-ink-2"><span className="w-2.5 h-2.5 rounded-full bg-ink" /> Driver signups</span>
              <span className="flex items-center gap-1.5 text-ink-2"><span className="w-2.5 h-2.5 rounded-full bg-ink-3" /> Leads</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.trend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0B6B4F" stopOpacity={0.28} /><stop offset="100%" stopColor="#0B6B4F" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E1" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="#5C6862" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#5C6862" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(10,19,15,0.1)", fontSize: 13 }} />
              <Area type="monotone" dataKey="views" name="Page views" stroke="#0B6B4F" strokeWidth={2.5} fill="url(#gv)" />
              <Line type="monotone" dataKey="signups" name="Driver signups" stroke="#0A130F" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="leads" name="Leads" stroke="#5C6862" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Funnel */}
      {analytics && (
        <div className="panel rounded-2xl p-5 sm:p-6 mt-4">
          <h3 className="font-heading font-bold text-ink mb-5">Waitlist funnel</h3>
          <div className="space-y-3">
            {funnelSteps.map((s, i) => {
              const prev = i > 0 ? funnelSteps[i - 1].n : null;
              const pct = prev == null ? "" : prev > 0 ? `${Math.round((s.n / prev) * 100)}%` : "0%";
              return <FunnelBar key={s.l} label={s.l} n={s.n} max={funnelMax} pct={pct} />;
            })}
          </div>
        </div>
      )}

      {/* Per-city and per-vehicle demand */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="panel rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading font-bold text-ink mb-3">Demand by city</h3>
            {analytics.city_demand.length === 0 ? <p className="text-[13px] text-ink-3">No city requests yet.</p> : (
              <div className="divide-y divide-line">{analytics.city_demand.map((c) => (<div key={c.label} className="flex justify-between text-[14px] py-2"><span className="text-ink-2">{c.label}</span><span className="font-semibold text-ink tabular">{c.count}</span></div>))}</div>
            )}
          </div>
          <div className="panel rounded-2xl p-5 sm:p-6">
            <h3 className="font-heading font-bold text-ink mb-3">Demand by car</h3>
            {vehicleDemand.length === 0 ? <p className="text-[13px] text-ink-3">No vehicle requests yet.</p> : (
              <div className="divide-y divide-line">{vehicleDemand.map((c) => (<div key={c.label} className="flex justify-between text-[14px] py-2"><span className="text-ink-2">{c.label}</span><span className="font-semibold text-ink tabular">{c.count}</span></div>))}</div>
            )}
          </div>
        </div>
      )}

      {/* Lead sources */}
      {analytics && (
        <div className="panel rounded-2xl p-5 sm:p-6 mt-4">
          <h3 className="font-heading font-bold text-ink mb-3">Lead sources</h3>
          <div className="divide-y divide-line">{analytics.lead_sources.map((c) => (<div key={c.label} className="flex justify-between text-[14px] py-2"><span className="text-ink-2 capitalize">{String(c.label).replace(/_/g, " ")}</span><span className="font-semibold text-ink tabular">{c.count}</span></div>))}</div>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="flex-wrap h-auto">
            {TABS.map((t) => <TabsTrigger key={t} value={t} className="capitalize" data-testid={`admin-tab-${t}`}>{t.replace(/_/g, " ")}</TabsTrigger>)}
          </TabsList>
          <Button onClick={exportCsv} variant="outline" data-testid="export-csv-btn"><Download className="w-4 h-4" strokeWidth={1.75} /> Export CSV</Button>
        </div>

        <div className="mt-4 panel rounded-2xl p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this table" data-testid="admin-filter-search" className="h-10 pl-9" />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-ink-2">
            <span>From</span>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} data-testid="admin-filter-from" className="h-10 w-full sm:w-auto" />
            <span>To</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} data-testid="admin-filter-to" className="h-10 w-full sm:w-auto" />
          </div>
          {(q || from || to) && <Button variant="ghost" onClick={() => { setQ(""); setFrom(""); setTo(""); }} data-testid="admin-filter-clear" className="text-green">Clear</Button>}
          <span className="text-[12.5px] text-ink-3 ml-auto" data-testid="admin-filter-count">{filtered.length} of {rows.length}</span>
        </div>

        {TABS.map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            <div className="panel rounded-2xl overflow-x-auto">
              {rows.length === 0 ? (
                <div className="p-8 text-center text-ink-2 text-sm">No records yet.</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-ink-2 text-sm" data-testid="admin-no-matches">No records match your filters.</div>
              ) : (
                <table className="w-full text-sm" data-testid={`table-${t}`}>
                  <thead><tr className="text-left text-ink-3 text-xs border-b border-line bg-surface-2">
                    {columns.map((c) => <th key={c} className="py-3 px-4 capitalize whitespace-nowrap">{c.replace(/_/g, " ")}</th>)}
                  </tr></thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={`${t}-${r.id || r.email || "row"}-${i}`} className="border-b border-line last:border-0 hover:bg-surface-2">
                        {columns.map((c) => <td key={c} className="py-2.5 px-4 text-ink-2 whitespace-nowrap max-w-xs truncate">{String(r[c] ?? "-")}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
