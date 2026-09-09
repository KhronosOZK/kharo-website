import { useEffect, useMemo, useState } from "react";
import { Download, Lock, TrendingUp, Users, Building2, MapPin, Search, Tag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { api, API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AnimatedNumber } from "@/components/AnimatedNumber";

const TABS = ["leads", "applications", "interests", "marketplace_interests", "city_requests", "users", "events"];

export default function Admin() {
  const { user, login } = useAuth();
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState("leads");
  const [rows, setRows] = useState([]);
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const isAdmin = user && user.role === "admin";

  useEffect(() => { if (isAdmin) { api.get("/admin/summary").then((r) => setSummary(r.data)).catch(() => {}); api.get("/admin/analytics").then((r) => setAnalytics(r.data)).catch(() => {}); } }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (isAdmin) api.get(`/admin/${tab}`).then((r) => setRows(r.data)).catch(() => setRows([])); setQ(""); setFrom(""); setTo(""); }, [isAdmin, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const doLogin = async (e) => {
    e.preventDefault();
    const res = await login(creds.email, creds.password);
    if (!res.ok) toast.error(res.error);
  };

  const exportCsv = () => { window.open(`${API}/admin/export/${tab}`, "_blank"); };

  const columns = rows.length ? Object.keys(rows[0]).filter((k) => k !== "data" && k !== "password_hash").slice(0, 6) : [];
  const filtered = useMemo(() => rows.filter((r) => {
    const cdate = typeof r.created_at === "string" ? r.created_at.slice(0, 10) : "";
    if (from && cdate && cdate < from) return false;
    if (to && cdate && cdate > to) return false;
    if (q) { const hay = columns.map((c) => String(r[c] ?? "")).join(" ").toLowerCase(); if (!hay.includes(q.toLowerCase())) return false; }
    return true;
  }), [rows, q, from, to, columns]);

  if (!isAdmin) return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <Lock className="w-6 h-6 text-[#0B6B4F]" />
        <h1 className="text-2xl font-heading font-bold text-[#1A2E25] mt-3">Kharo Ops, admin</h1>
        <p className="text-sm text-[#64748B] mt-1 mb-6">Sign in with your operations account to view captured leads.</p>
        <form onSubmit={doLogin} className="space-y-4">
          <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={creds.email} onChange={(e) => setCreds((p) => ({ ...p, email: e.target.value }))} data-testid="admin-email" /></div>
          <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={creds.password} onChange={(e) => setCreds((p) => ({ ...p, password: e.target.value }))} data-testid="admin-password" /></div>
          <Button type="submit" className="w-full rounded-full bg-[#0B6B4F] hover:bg-[#065F46] text-white" data-testid="admin-login">Sign in</Button>
        </form>
      </div>
    </main>
  );

  const audience = summary ? summary.drivers + summary.interests : 0;
  const convRate = summary && summary.page_views ? ((summary.drivers / summary.page_views) * 100).toFixed(1) : "0.0";

  const headline = summary ? [
    { l: "Total leads captured", v: summary.leads, i: TrendingUp, hint: "emails + phones for outreach" },
    { l: "Driver accounts", v: summary.drivers, i: Users, hint: "registered and browsing" },
    { l: "Operators interested", v: summary.interests, i: Building2, hint: "fleets on the launch list" },
    { l: "Cities requested", v: summary.city_requests, i: MapPin, hint: "expansion demand signal" },
  ] : [];

  const secondary = summary ? [
    { l: "Page views", v: summary.page_views }, { l: "Searches", v: summary.searches },
    { l: "Listing views", v: summary.listing_views }, { l: "Applications", v: summary.applications },
  ] : [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Investor headline banner */}
      <div className="relative overflow-hidden rounded-[26px] bg-[#0B130F] text-white p-7 sm:p-10">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 items-center">
          <div>
            <p className="text-[12px] font-medium text-[#5FD3A6] tracking-[0.14em] uppercase">Traction dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold mt-2">A validated, two-sided pipeline.</h1>
            <p className="text-white/65 mt-3 text-[15px] max-w-lg">Every visitor, search and sign up is tracked. This is the demand we are converting ahead of launch across Greater London.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.07] ring-1 ring-white/10 p-5">
              <div className="text-[12px] text-white/55 uppercase tracking-wide">Combined audience</div>
              <AnimatedNumber value={audience} className="text-4xl font-heading font-extrabold text-[#5FD3A6] mt-1 block" />
              <div className="text-[12px] text-white/50 mt-1">drivers + operators</div>
            </div>
            <div className="rounded-2xl bg-white/[0.07] ring-1 ring-white/10 p-5">
              <div className="text-[12px] text-white/55 uppercase tracking-wide">View to signup</div>
              <div className="text-4xl font-heading font-extrabold text-white mt-1">{convRate}%</div>
              <div className="text-[12px] text-white/50 mt-1">visitors becoming drivers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Headline KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        {headline.map((c) => (
          <div key={c.l} className="bg-white border border-slate-200 rounded-2xl p-5" data-testid={`stat-${c.l}`}>
            <c.i className="w-5 h-5 text-[#0B6B4F]" />
            <AnimatedNumber value={c.v} className="text-[32px] font-heading font-extrabold text-[#1A2E25] mt-3 block leading-none" />
            <div className="text-[13px] font-medium text-[#1A2E25] mt-2">{c.l}</div>
            <div className="text-[11.5px] text-[#94A3B8] mt-0.5">{c.hint}</div>
          </div>
        ))}
      </div>

      {/* Marketplace demand, buy versus sell */}
      {analytics?.marketplace && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mt-4" data-testid="admin-marketplace">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-[#1A2E25] text-lg">Marketplace demand</h3>
              <p className="text-[13px] text-[#64748B] mt-0.5">Who wants to buy a vehicle and who wants to sell one</p>
            </div>
            <span className="text-[12.5px] text-[#94A3B8]">{analytics.marketplace.views} listing views</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
            {[
              { l: "Want to buy", v: analytics.marketplace.buyers, i: ShoppingCart, hint: "registered buyer alerts" },
              { l: "Want to sell", v: analytics.marketplace.sellers, i: Tag, hint: "vehicles offered to us" },
              { l: "Vehicles listed", v: analytics.marketplace.listings, i: Building2, hint: "live sale inventory" },
              { l: "Listing views", v: analytics.marketplace.views, i: TrendingUp, hint: "sale detail page opens" },
            ].map((c) => (
              <div key={c.l} className="rounded-2xl bg-[#F9F8F6] ring-1 ring-slate-200/70 p-5" data-testid={`mp-stat-${c.l}`}>
                <c.i className="w-5 h-5 text-[#0B6B4F]" />
                <AnimatedNumber value={c.v} className="text-[30px] font-heading font-extrabold text-[#1A2E25] mt-3 block leading-none" />
                <div className="text-[13px] font-medium text-[#1A2E25] mt-2">{c.l}</div>
                <div className="text-[11.5px] text-[#94A3B8] mt-0.5">{c.hint}</div>
              </div>
            ))}
          </div>
          {analytics.marketplace.by_city?.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="text-[13px] font-semibold text-[#1A2E25] mb-3">Marketplace interest by city</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {analytics.marketplace.by_city.map((c) => (
                  <div key={c.label} className="flex justify-between text-[14px] bg-[#F9F8F6] rounded-xl px-3 py-2">
                    <span className="text-[#4A564F]">{c.label}</span>
                    <span className="font-semibold text-[#1A2E25]">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trend chart */}
      {analytics?.trend && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <h3 className="font-heading font-bold text-[#1A2E25] text-lg">Growth over the last 14 days</h3>
            <div className="flex gap-4 text-[12px]">
              <span className="flex items-center gap-1.5 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-full bg-[#0B6B4F]" /> Page views</span>
              <span className="flex items-center gap-1.5 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" /> Driver signups</span>
              <span className="flex items-center gap-1.5 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-full bg-[#C08A2D]" /> Leads</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.trend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0B6B4F" stopOpacity={0.28} /><stop offset="100%" stopColor="#0B6B4F" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0EC" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 13 }} />
              <Area type="monotone" dataKey="views" name="Page views" stroke="#0B6B4F" strokeWidth={2.5} fill="url(#gv)" />
              <Line type="monotone" dataKey="signups" name="Driver signups" stroke="#0EA5E9" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="leads" name="Leads" stroke="#C08A2D" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Secondary metrics + funnel + demand */}
      {analytics && (
        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 ring-1 ring-slate-200/70">
            <h3 className="font-heading font-bold text-[#1A2E25] mb-4">Acquisition funnel</h3>
            <div className="space-y-2.5">
              {[["Page views", analytics.funnel.page_views], ["Searches", analytics.funnel.searches], ["Listing views", analytics.funnel.listing_views], ["Card clicks", analytics.funnel.card_clicks], ["Applications", analytics.funnel.applications], ["Driver signups", analytics.funnel.driver_signups]].map(([l, n], i, arr) => {
                const max = Math.max(...arr.map((x) => x[1]), 1);
                return (
                  <div key={l} className="flex items-center gap-3">
                    <span className="text-[13px] text-[#4A564F] w-28 shrink-0">{l}</span>
                    <div className="flex-1 h-6 bg-[#F1EFE9] rounded-full overflow-hidden"><div className="h-full bg-[#0B6B4F] rounded-full transition-all" style={{ width: `${Math.max((n / max) * 100, 4)}%` }} /></div>
                    <span className="text-[13px] font-semibold text-[#1A2E25] w-10 text-right">{n}</span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
              {secondary.map((s) => (
                <div key={s.l}><div className="text-xl font-heading font-extrabold text-[#1A2E25]">{s.v}</div><div className="text-[12px] text-[#64748B]">{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-200/70">
            <h3 className="font-heading font-bold text-[#1A2E25] mb-4">City demand (waitlist)</h3>
            {analytics.city_demand.length === 0 ? <p className="text-[13px] text-[#7A857F]">No city requests yet.</p> : (
              <div className="space-y-2">{analytics.city_demand.map((c) => (<div key={c.label} className="flex justify-between text-[14px]"><span className="text-[#4A564F]">{c.label}</span><span className="font-semibold text-[#1A2E25]">{c.count}</span></div>))}</div>
            )}
            <h3 className="font-heading font-bold text-[#1A2E25] mt-5 mb-3">Lead sources</h3>
            <div className="space-y-2">{analytics.lead_sources.map((c) => (<div key={c.label} className="flex justify-between text-[14px]"><span className="text-[#4A564F] capitalize">{String(c.label).replace(/_/g, " ")}</span><span className="font-semibold text-[#1A2E25]">{c.count}</span></div>))}</div>
          </div>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="flex-wrap h-auto">
            {TABS.map((t) => <TabsTrigger key={t} value={t} className="capitalize" data-testid={`admin-tab-${t}`}>{t.replace(/_/g, " ")}</TabsTrigger>)}
          </TabsList>
          <Button onClick={exportCsv} variant="outline" className="rounded-full" data-testid="export-csv-btn"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this table…" data-testid="admin-filter-search" className="h-10 pl-9 rounded-full border-slate-200" />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
            <span>From</span>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} data-testid="admin-filter-from" className="h-10 w-[150px] rounded-lg border-slate-200" />
            <span>To</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} data-testid="admin-filter-to" className="h-10 w-[150px] rounded-lg border-slate-200" />
          </div>
          {(q || from || to) && <Button variant="ghost" onClick={() => { setQ(""); setFrom(""); setTo(""); }} data-testid="admin-filter-clear" className="rounded-full text-[#0B6B4F]">Clear</Button>}
          <span className="text-[12.5px] text-[#94A3B8] ml-auto" data-testid="admin-filter-count">{filtered.length} of {rows.length}</span>
        </div>

        {TABS.map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
              {rows.length === 0 ? (
                <div className="p-8 text-center text-[#64748B] text-sm">No records yet.</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-[#64748B] text-sm" data-testid="admin-no-matches">No records match your filters.</div>
              ) : (
                <table className="w-full text-sm" data-testid={`table-${t}`}>
                  <thead><tr className="text-left text-[#64748B] text-xs border-b border-slate-200 bg-[#F9F8F6]">
                    {columns.map((c) => <th key={c} className="py-3 px-4 capitalize whitespace-nowrap">{c.replace(/_/g, " ")}</th>)}
                  </tr></thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={`${t}-${r.id || r.email || "row"}-${i}`} className="border-b border-slate-100 last:border-0 hover:bg-[#F9F8F6]">
                        {columns.map((c) => <td key={c} className="py-2.5 px-4 text-[#475569] whitespace-nowrap max-w-xs truncate">{String(r[c] ?? "-")}</td>)}
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
