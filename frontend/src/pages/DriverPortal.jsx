import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car, ShieldCheck, FileText, AlertTriangle, Wrench, Clock, Check, X, Heart,
  CalendarClock, ArrowRight, Headphones, IdCard,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const statusMap = {
  approved: { c: "text-green bg-green-soft", i: Check, t: "Approved" },
  under_review: { c: "text-ink-2 bg-surface-2", i: Clock, t: "Under review" },
  declined: { c: "text-danger bg-danger-soft", i: X, t: "Declined" },
};

const container = { show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export default function DriverPortal() {
  const { user, saved } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
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

  return (
    <main className="min-h-page bg-bone wrap py-section">
      <p className="text-[13px] text-ink-3">Demo account. Figures are illustrative until launch.</p>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-3">
        <div>
          <h1 className="text-h2 font-heading font-extrabold text-ink">Hi {firstName}, welcome to Kharo.</h1>
          <p className="text-ink-2 mt-1.5">Everything you need to get on the road, in one place.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/saved")} data-testid="portal-saved"><Heart className="w-4 h-4" strokeWidth={1.75} /> Saved{saved.length ? ` (${saved.length})` : ""}</Button>
          <Button onClick={() => navigate("/search")} data-testid="portal-find-car">Find a car</Button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-7">
        {/* No car yet: a plain panel, no photo, no decorative badge */}
        <motion.div variants={item} className="lg:col-span-8 panel rounded-2xl p-7 sm:p-9 flex flex-col justify-center" data-testid="portal-hero">
          <p className="eyebrow">No car yet</p>
          <h2 className="mt-2 text-h3 font-heading font-bold text-ink">Start earning this week.</h2>
          <p className="mt-3 text-[15px] text-ink-2 leading-relaxed max-w-md">Browse vetted cars with insurance chosen when you apply. Apply in minutes with your details saved.</p>
          <div className="mt-6">
            <Button onClick={() => navigate("/search")}>Browse cars <ArrowRight className="w-4 h-4" strokeWidth={1.75} /></Button>
          </div>
        </motion.div>

        {/* Document vault */}
        <motion.div variants={item} className="lg:col-span-4 panel rounded-2xl p-6" data-testid="portal-documents">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-ink font-heading font-bold"><IdCard className="w-5 h-5 text-green" strokeWidth={1.75} /> Your documents</div>
            <span className="text-[12px] text-ink-3">{docsDone}/2 done</span>
          </div>
          <div className="mt-4 divide-y divide-line">
            <DocRow label="DVLA licence" ok={hasDvla} value={user.dvla_licence} />
            <DocRow label="PCO / TfL badge" ok={hasPco} value={user.pco_licence} />
          </div>
          {docsDone < 2 && (
            <Button onClick={() => navigate("/help")} variant="outline" className="w-full mt-4 text-[13px]">Get help adding your documents</Button>
          )}
        </motion.div>

        {/* Applications */}
        <motion.div variants={item} className="lg:col-span-8 panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-ink font-heading font-bold"><FileText className="w-5 h-5 text-green" strokeWidth={1.75} /> Your applications</div>
            {apps.length > 0 && <span className="text-[12px] text-ink-3">{apps.length} total</span>}
          </div>
          {apps.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-9 h-9 text-green mx-auto" strokeWidth={1.75} />
              <p className="text-[15px] text-ink font-medium mt-3">No applications yet</p>
              <p className="text-[13px] text-ink-3 mt-1">When you apply for a car, you can track the operator's response here.</p>
              <Button onClick={() => navigate("/search")} size="sm" className="mt-4">Find your first car</Button>
            </div>
          ) : (
            <div className="divide-y divide-line" data-testid="my-applications">
              {apps.map((a, i) => { const s = statusMap[a.status] || statusMap.under_review; return (
                <div key={a.id || a.listing_id || `app-${i}`} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <Car className="w-7 h-7 text-green shrink-0" strokeWidth={1.75} />
                    <div><div className="font-medium text-ink text-sm">{a.vehicle || "Your application"}</div><div className="text-xs text-ink-3">Operator, {a.operator_code || "pending"}{a.duration_weeks ? `, ${a.duration_weeks} weeks` : ""}</div></div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.c}`}><s.i className="w-3 h-3" /> {s.t}</span>
                </div>); })}
            </div>
          )}
        </motion.div>

        {/* Insurance & compliance */}
        <motion.div variants={item} className="lg:col-span-4 panel rounded-2xl p-6" data-testid="portal-compliance">
          <div className="flex items-center gap-2 text-ink font-heading font-bold"><ShieldCheck className="w-5 h-5 text-green" strokeWidth={1.75} /> Cover and compliance</div>
          <p className="text-[13px] text-ink-3 mt-2">Once you are in a car, this is where your insurance, MOT and service dates live.</p>
          <div className="mt-4 divide-y divide-line text-[13.5px]">
            <div className="flex items-center justify-between py-2"><span className="text-ink-2">Hire and reward insurance</span><span className="text-ink-3">Chosen when you apply</span></div>
            <div className="flex items-center justify-between py-2"><span className="text-ink-2">MOT and servicing</span><span className="text-green font-medium">Handled by operator</span></div>
            <div className="flex items-center justify-between py-2"><span className="text-ink-2">Breakdown cover</span><span className="text-green font-medium">Shown on the listing</span></div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={item} className="lg:col-span-8 panel rounded-2xl p-6">
          <div className="flex items-center gap-2 text-ink font-heading font-bold mb-4"><Wrench className="w-5 h-5 text-green" strokeWidth={1.75} /> Quick actions</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { i: AlertTriangle, t: "Report an issue" },
              { i: Wrench, t: "Roadside assist" },
              { i: Headphones, t: "Get support" },
              { i: CalendarClock, t: "Service booking" },
            ].map((a) => (
              <button key={a.t} onClick={() => navigate("/help")} className="pressable rounded-2xl bg-surface-2 hover:bg-[#E6E6DF] border border-line p-4 text-left">
                <a.i className="w-5 h-5 text-green" strokeWidth={1.75} />
                <div className="text-[13px] font-medium text-ink mt-2.5">{a.t}</div>
              </button>
            ))}
          </div>
          <p className="text-[12px] text-ink-3 mt-3">These become active the moment your rental starts.</p>
        </motion.div>

        {/* Saved cars */}
        <motion.div variants={item} className="lg:col-span-4 panel rounded-2xl p-6 flex flex-col justify-between" data-testid="portal-saved-card">
          <div>
            <Heart className="w-5 h-5 text-green" strokeWidth={1.75} />
            <div className="text-h3 font-heading font-extrabold text-ink mt-3 tabular">{saved.length}</div>
            <div className="text-[13px] text-ink-3">cars saved to compare later</div>
          </div>
          <Button onClick={() => navigate(saved.length ? "/saved" : "/search")} variant="outline" className="mt-5 w-full">{saved.length ? "View saved cars" : "Start saving cars"}</Button>
        </motion.div>
      </motion.div>
    </main>
  );
}

const DocRow = ({ label, ok, value }) => (
  <div className="flex items-center justify-between py-2.5">
    <div>
      <div className="text-[13.5px] text-ink">{label}</div>
      {ok && <div className="text-[11.5px] text-ink-3">{value}</div>}
    </div>
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${ok ? "text-green bg-green-soft" : "text-ink-3 bg-surface-2"}`}>
      {ok ? <><Check className="w-3 h-3" /> Added</> : "Not added"}
    </span>
  </div>
);
