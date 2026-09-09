import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car, ShieldCheck, FileText, AlertTriangle, Wrench, Clock, Check, X, Heart,
  CalendarClock, ArrowRight, Headphones, Sparkles, IdCard,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const statusMap = {
  approved: { c: "text-emerald-800 bg-[#E6F5F0]", i: Check, t: "Approved" },
  under_review: { c: "text-amber-800 bg-amber-50", i: Clock, t: "Under review" },
  declined: { c: "text-red-700 bg-red-50", i: X, t: "Declined" },
};

const container = { show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export default function DriverPortal() {
  const { user, saved } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (user === false) navigate("/login");
    if (user) api.get("/applications/me").then((r) => setApps(r.data)).catch(() => {});
  }, [user, navigate]);

  if (!user) return <div className="max-w-5xl mx-auto px-4 py-20 text-[#64748B]">Loading…</div>;

  const firstName = user.name?.split(" ")[0] || "there";
  const hasDvla = !!user.dvla_licence;
  const hasPco = !!user.pco_licence;
  const docsDone = [hasDvla, hasPco].filter(Boolean).length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] sm:text-4xl font-heading font-extrabold text-[#1A2E25]">Hi {firstName}, welcome to Kharo.</h1>
          <p className="text-[#4A564F] mt-1.5">Everything you need to get on the road, in one place.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/saved")} className="rounded-full border-[#1A2E25]/20" data-testid="portal-saved"><Heart className="w-4 h-4 mr-2" /> Saved{saved.length ? ` (${saved.length})` : ""}</Button>
          <Button onClick={() => navigate("/search")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white" data-testid="portal-find-car">Find a car</Button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-7">
        {/* HERO empty state */}
        <motion.div variants={item} className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-[#0A130F] text-white min-h-[280px] flex" data-testid="portal-hero">
          <img src="https://images.pexels.com/photos/5835016/pexels-photo-5835016.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=800&w=1200" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/95 via-[#0A130F]/80 to-[#0A130F]/45" />
          <div className="relative p-7 sm:p-9 flex flex-col justify-center max-w-md [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#5FD3A6] bg-white/8 rounded-full px-3 py-1 w-fit"><Sparkles className="w-3.5 h-3.5" /> No car yet</span>
            <h2 className="text-2xl sm:text-[32px] font-heading font-extrabold mt-4 leading-tight">Start earning this week.</h2>
            <p className="text-white/70 mt-3 text-[15px] leading-relaxed">Browse vetted cars in London with insurance and cover already in the price. Apply in minutes with your details saved.</p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Button onClick={() => navigate("/search")} className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0A130F] font-semibold hover:-translate-y-[2px] transition-transform">Browse cars in London <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
        </motion.div>

        {/* Document vault */}
        <motion.div variants={item} className="lg:col-span-4 bg-white rounded-2xl border border-[#1A2E25]/10 p-6 shadow-sm" data-testid="portal-documents">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1A2E25] font-heading font-bold"><IdCard className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /> Your documents</div>
            <span className="text-[12px] text-[#4A564F]">{docsDone}/2 done</span>
          </div>
          <div className="mt-4 space-y-3">
            <DocRow label="DVLA licence" ok={hasDvla} value={user.dvla_licence} />
            <DocRow label="PCO / TfL badge" ok={hasPco} value={user.pco_licence} />
          </div>
          {docsDone < 2 && (
            <Button onClick={() => navigate("/apply/ve-001")} variant="outline" className="w-full mt-4 rounded-full border-[#1A2E25]/20 text-[13px]">Add your licence details</Button>
          )}
        </motion.div>

        {/* Applications */}
        <motion.div variants={item} className="lg:col-span-8 bg-white rounded-2xl border border-[#1A2E25]/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#1A2E25] font-heading font-bold"><FileText className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /> Your applications</div>
            {apps.length > 0 && <span className="text-[12px] text-[#4A564F]">{apps.length} total</span>}
          </div>
          {apps.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-[#F1EFE9] flex items-center justify-center mx-auto"><Car className="w-6 h-6 text-[#0B6B4F]" strokeWidth={1.5} /></div>
              <p className="text-[15px] text-[#1A2E25] font-medium mt-3">No applications yet</p>
              <p className="text-[13px] text-[#7A857F] mt-1">When you apply for a car, you can track the operator's response here.</p>
              <Button onClick={() => navigate("/search")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white mt-4 text-[13px] h-9">Find your first car</Button>
            </div>
          ) : (
            <div className="space-y-3" data-testid="my-applications">
              {apps.map((a, i) => { const s = statusMap[a.status] || statusMap.under_review; return (
                <div key={a.id || a.listing_id || `app-${i}`} className="flex items-center justify-between border border-[#1A2E25]/10 rounded-2xl p-3.5 hover:bg-[#F9F8F6] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1EFE9] flex items-center justify-center"><Car className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /></div>
                    <div><div className="font-medium text-[#1A2E25] text-sm">{a.vehicle || "Your application"}</div><div className="text-xs text-[#7A857F]">Operator · {a.operator_code || "pending"}{a.duration_weeks ? ` · ${a.duration_weeks} weeks` : ""}</div></div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.c}`}><s.i className="w-3 h-3" /> {s.t}</span>
                </div>); })}
            </div>
          )}
        </motion.div>

        {/* Insurance & compliance */}
        <motion.div variants={item} className="lg:col-span-4 bg-white rounded-2xl border border-[#1A2E25]/10 p-6 shadow-sm" data-testid="portal-compliance">
          <div className="flex items-center gap-2 text-[#1A2E25] font-heading font-bold"><ShieldCheck className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /> Cover & compliance</div>
          <p className="text-[13px] text-[#7A857F] mt-2">Once you are in a car, this is where your insurance, MOT and service dates live.</p>
          <div className="mt-4 space-y-2.5 text-[13.5px]">
            <div className="flex items-center justify-between"><span className="text-[#4A564F]">Hire &amp; reward insurance</span><span className="text-[#7A857F]">Priced at checkout</span></div>
            <div className="flex items-center justify-between"><span className="text-[#4A564F]">MOT &amp; servicing</span><span className="text-[#0B6B4F] font-medium">Handled by operator</span></div>
            <div className="flex items-center justify-between"><span className="text-[#4A564F]">Breakdown cover</span><span className="text-[#0B6B4F] font-medium">Included or £8/wk</span></div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={item} className="lg:col-span-8 bg-white rounded-2xl border border-[#1A2E25]/10 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#1A2E25] font-heading font-bold mb-4"><Wrench className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} /> Quick actions</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { i: AlertTriangle, t: "Report an issue" },
              { i: Wrench, t: "Roadside assist" },
              { i: Headphones, t: "Get support" },
              { i: CalendarClock, t: "Service booking" },
            ].map((a) => (
              <button key={a.t} onClick={() => navigate("/help")} className="rounded-2xl bg-[#F9F8F6] hover:bg-[#F1EFE9] border border-[#1A2E25]/8 p-4 text-left transition-colors hover:-translate-y-[2px]">
                <a.i className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.5} />
                <div className="text-[13px] font-medium text-[#1A2E25] mt-2.5">{a.t}</div>
              </button>
            ))}
          </div>
          <p className="text-[12px] text-[#9AA39D] mt-3">These become active the moment your rental starts.</p>
        </motion.div>

        {/* Saved cars */}
        <motion.div variants={item} className="lg:col-span-4 bg-gradient-to-br from-[#1A2E25] to-[#12211B] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between" data-testid="portal-saved-card">
          <div>
            <Heart className="w-5 h-5 text-[#5FD3A6]" strokeWidth={1.5} />
            <div className="text-3xl font-heading font-extrabold mt-3">{saved.length}</div>
            <div className="text-[13px] text-white/65">cars saved to compare later</div>
          </div>
          <Button onClick={() => navigate(saved.length ? "/saved" : "/search")} className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0A130F] font-semibold mt-5 w-full">{saved.length ? "View saved cars" : "Start saving cars"}</Button>
        </motion.div>
      </motion.div>
    </main>
  );
}

const DocRow = ({ label, ok, value }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-[13.5px] text-[#1A2E25]">{label}</div>
      {ok && <div className="text-[11.5px] text-[#7A857F]">{value}</div>}
    </div>
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${ok ? "text-emerald-800 bg-[#E6F5F0]" : "text-[#9AA39D] bg-[#F1EFE9]"}`}>
      {ok ? <><Check className="w-3 h-3" /> Added</> : "Not added"}
    </span>
  </div>
);
