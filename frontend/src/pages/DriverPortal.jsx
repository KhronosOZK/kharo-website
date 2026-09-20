import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car, ShieldCheck, FileText, AlertTriangle, Wrench, Clock, Check, X,
  CalendarClock, ArrowRight, Headphones, IdCard, Home, Bell, MessageSquare, LifeBuoy,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ConsoleShell, Panel, NotificationsPanel, ChatPanel } from "@/components/ConsoleShell";
import { useSeo } from "@/lib/seo";

const statusMap = {
  approved: { c: "text-green bg-green-soft", i: Check, t: "Approved" },
  under_review: { c: "text-ink-2 bg-surface-2", i: Clock, t: "Under review" },
  declined: { c: "text-danger bg-danger-soft", i: X, t: "Declined" },
};

// Demo content for the two new sections. Nothing here is a real event.
const NOTIFICATIONS = [
  { id: 1, t: "Your application was received", d: "The operator has your checks and your insurance choice. Most reply within two working days.", when: "2 h ago", read: false },
  { id: 2, t: "Add your PCO badge number", d: "Applications with the badge number attached are answered first.", when: "Yesterday", read: false },
  { id: 3, t: "Collection slots open on Thursday", d: "Once an operator says yes, you pick a slot for the joint inspection here.", when: "3 days ago", read: true },
];
const THREADS = [
  { id: "kharo", name: "Kharo support", role: "A person, 9am to 8pm", when: "10:42", last: "We have your documents. Nothing else needed for now.", messages: [
    { from: "them", text: "Hello. We have your DVLA licence and your PCO badge on file. Nothing else needed for now.", at: "10:41" },
    { from: "them", text: "When an operator accepts, you will be able to book a collection slot from this account.", at: "10:42" },
  ] },
  { id: "operator", name: "South Forest Rentals", role: "Operator, Newham", when: "Yesterday", last: "Thanks. We will come back to you within two days.", messages: [
    { from: "me", text: "Hi, I applied for the Toyota Camry in Greenwich. Is it still available?", at: "16:05" },
    { from: "them", text: "Thanks. We will come back to you within two days.", at: "16:30" },
  ] },
];

export default function DriverPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [view, setView] = useState("home");
  useSeo({ title: "Your account · Kharo", description: "Your Kharo driver account.", noindex: true });

  useEffect(() => {
    if (user === false) navigate("/login");
    if (user) api.get("/applications/me").then((r) => setApps(r.data)).catch(() => {});
  }, [user, navigate]);

  if (!user) return <div className="min-h-page bg-bone wrap py-section text-ink-2">Loading</div>;

  const firstName = user.name?.split(" ")[0] || "there";
  const hasDvla = !!user.dvla_licence;
  const hasPco = !!user.pco_licence;
  const docsDone = [hasDvla, hasPco].filter(Boolean).length;
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  const nav = [
    { id: "home", label: "Home", icon: Home },
    { id: "applications", label: "Applications", icon: FileText, count: apps.length },
    { id: "documents", label: "Documents", icon: IdCard },
    { id: "notifications", label: "Notifications", icon: Bell, count: unread },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "help", label: "Help", icon: LifeBuoy },
  ];

  const onSelect = (id) => {
    if (id === "help") { navigate("/help"); return; }
    setView(id);
  };

  const applications = (
    <Panel title="Your applications" action={apps.length > 0 && <span className="text-[12px] text-ink-3">{apps.length} total</span>}>
      {apps.length === 0 ? (
        <div className="py-8 text-center">
          <Car className="mx-auto h-9 w-9 text-green" strokeWidth={1.75} />
          <p className="mt-3 text-[15px] font-medium text-ink">No applications yet</p>
          <p className="mt-1 text-[13px] text-ink-3">When you register interest in a car, you can follow the operator's answer here.</p>
          <Button onClick={() => navigate("/search")} size="sm" className="mt-4">Find your first car</Button>
        </div>
      ) : (
        <div className="divide-y divide-line" data-testid="my-applications">
          {apps.map((a, i) => { const s = statusMap[a.status] || statusMap.under_review; return (
            <div key={a.id || a.listing_id || `app-${i}`} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <Car className="h-7 w-7 shrink-0 text-green" strokeWidth={1.75} />
                <div><div className="text-sm font-medium text-ink">{a.vehicle || "Your application"}</div><div className="text-xs text-ink-3">Operator, {a.operator_code || "pending"}{a.duration_weeks ? `, ${a.duration_weeks} weeks` : ""}</div></div>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${s.c}`}><s.i className="h-3 w-3" /> {s.t}</span>
            </div>); })}
        </div>
      )}
    </Panel>
  );

  const documents = (
    <Panel title="Your documents" action={<span className="text-[12px] text-ink-3">{docsDone}/2 added</span>}>
      <div className="divide-y divide-line">
        <DocRow label="DVLA licence" ok={hasDvla} value={user.dvla_licence} />
        <DocRow label="PCO / TfL badge" ok={hasPco} value={user.pco_licence} />
      </div>
      {docsDone < 2 && <Button onClick={() => navigate("/help")} variant="outline" className="mt-4 w-full text-[13px]">Get help adding your documents</Button>}
      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center gap-2 font-heading font-bold text-ink"><ShieldCheck className="h-5 w-5 text-green" strokeWidth={1.75} /> Cover and compliance</div>
        <p className="mt-2 text-[13px] text-ink-3">Once you are in a car, this is where your insurance, MOT and service dates live.</p>
        <div className="mt-3 divide-y divide-line text-[13.5px]">
          <div className="flex items-center justify-between py-2"><span className="text-ink-2">Hire and reward insurance</span><span className="text-ink-3">Chosen when you apply</span></div>
          <div className="flex items-center justify-between py-2"><span className="text-ink-2">MOT and servicing</span><span className="font-medium text-green">Handled by operator</span></div>
          <div className="flex items-center justify-between py-2"><span className="text-ink-2">Breakdown cover</span><span className="font-medium text-green">Shown on the listing</span></div>
        </div>
      </div>
    </Panel>
  );

  return (
    <ConsoleShell
      nav={nav} active={view} onSelect={onSelect}
      title={`Hi ${firstName}, welcome to Kharo.`}
      subtitle="Everything you need to get on the road, in one place."
      note="Demo account. Figures are illustrative until launch."
      city={user.city || "London"}
      actions={<Button onClick={() => navigate("/search")} data-testid="portal-find-car">Find a car</Button>}
    >
      {view === "home" && (
        <div className="grid gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-8" data-testid="portal-hero">
            <p className="text-[13px] font-semibold text-ink-3">No car yet</p>
            <h2 className="mt-2 font-heading text-h3 font-bold text-ink">Start earning this week.</h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">Browse checked cars, compare insurance on the car, and register interest in minutes with your details saved.</p>
            <div className="mt-6"><Button onClick={() => navigate("/search")}>Browse cars <ArrowRight className="h-4 w-4" strokeWidth={1.75} /></Button></div>
          </Panel>
          <Panel className="lg:col-span-4 flex flex-col justify-between" title="Next step">
            <p className="text-[14.5px] leading-relaxed text-ink-2">Add your PCO badge number under Documents. Applications with it attached are answered first.</p>
            <Button onClick={() => setView("documents")} variant="outline" className="mt-5 w-full">Open documents</Button>
          </Panel>
          <div className="lg:col-span-8">{applications}</div>
          <Panel className="lg:col-span-4" title="Quick actions">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { i: AlertTriangle, t: "Report an issue" },
                { i: Wrench, t: "Roadside assist" },
                { i: Headphones, t: "Get support" },
                { i: CalendarClock, t: "Book a service" },
              ].map((a) => (
                <button key={a.t} onClick={() => setView("chat")} className="pressable rounded-md border border-line bg-surface-2 p-3.5 text-left hover:bg-[#E6E6DF]">
                  <a.i className="h-5 w-5 text-green" strokeWidth={1.75} />
                  <div className="mt-2 text-[13px] font-medium text-ink">{a.t}</div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-ink-3">These become active the moment your rental starts.</p>
          </Panel>
        </div>
      )}
      {view === "applications" && applications}
      {view === "documents" && documents}
      {view === "notifications" && <NotificationsPanel items={NOTIFICATIONS} />}
      {view === "chat" && <ChatPanel threads={THREADS} me={firstName} />}
    </ConsoleShell>
  );
}

const DocRow = ({ label, ok, value }) => (
  <div className="flex items-center justify-between py-2.5">
    <div>
      <div className="text-[13.5px] text-ink">{label}</div>
      {ok && <div className="text-[11.5px] text-ink-3">{value}</div>}
    </div>
    <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11.5px] font-semibold ${ok ? "text-green bg-green-soft" : "text-ink-3 bg-surface-2"}`}>
      {ok ? <><Check className="h-3 w-3" /> Added</> : "Not added"}
    </span>
  </div>
);
