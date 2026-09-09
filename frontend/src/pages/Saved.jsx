import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Columns3, X, Tag, Car } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import VehicleCard from "@/components/VehicleCard";
import SaleCard from "@/components/SaleCard";
import CompareTable from "@/components/CompareTable";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

export default function Saved() {
  const { saved, toggleSaved, savedSales } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [sales, setSales] = useState([]);
  const [compare, setCompare] = useState(false);
  const [tab, setTab] = useState("rent");

  useSeo({ title: "Saved vehicles · Kharo" });

  useEffect(() => { api.get("/listings").then((r) => setAll(r.data)).catch(() => {}); }, []);

  // Sale listings are fetched by id rather than pulling the whole marketplace,
  // so a long shortlist stays cheap.
  useEffect(() => {
    if (savedSales.length === 0) { setSales([]); return; }
    api.get("/marketplace", { params: { ids: savedSales.join(",") } })
      .then((r) => setSales(r.data)).catch(() => setSales([]));
  }, [savedSales]);

  const items = all.filter((v) => saved.includes(v.id));
  const showing = tab === "rent" ? items.length : sales.length;

  // Open on whichever list actually has something in it.
  useEffect(() => {
    if (saved.length === 0 && savedSales.length > 0) setTab("buy");
  }, [saved.length, savedSales.length]);

  const TABS = [
    { key: "rent", label: "To rent", n: items.length, icon: Car },
    { key: "buy", label: "To buy", n: sales.length, icon: Tag },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center"><Heart className="w-6 h-6 text-[#0B6B4F]" /></div>
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Saved vehicles</h1>
            <p className="text-[#64748B]">{showing} {tab === "rent" ? "rental" : "sale"} listing{showing !== 1 ? "s" : ""} saved</p>
          </div>
        </div>
        {tab === "rent" && items.length >= 2 && (
          <Button onClick={() => setCompare((c) => !c)} data-testid="compare-toggle"
            className="rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white">
            {compare ? <><X className="w-4 h-4 mr-2" /> Back to grid</> : <><Columns3 className="w-4 h-4 mr-2" /> Compare {items.length} cars</>}
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-8" role="tablist" data-testid="saved-tabs">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} data-testid={`saved-tab-${t.key}`}
            onClick={() => { setTab(t.key); setCompare(false); }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium ring-1 transition-all ${
              tab === t.key ? "ring-2 ring-[#0B6B4F] bg-[#0B6B4F]/[0.07] text-[#0B6B4F]"
                            : "ring-slate-200 bg-white text-[#4A564F] hover:bg-slate-50"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
            <span className={`rounded-full px-2 py-0.5 text-[12px] ${tab === t.key ? "bg-[#0B6B4F] text-white" : "bg-slate-100 text-[#7A857F]"}`}>{t.n}</span>
          </button>
        ))}
      </div>

      {showing === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <Heart className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <h2 className="font-heading font-bold text-xl text-[#1A2E25] mt-4">
            {tab === "rent" ? "No saved rental cars yet" : "No saved vehicles for sale yet"}
          </h2>
          <p className="text-[#64748B] mt-2 max-w-md mx-auto">
            {tab === "rent"
              ? "Tap the heart on any rental listing to save it here, then compare the full weekly cost side by side."
              : "Tap the heart on any vehicle for sale to shortlist it here, then compare price, mileage and licence remaining."}
          </p>
          <Button onClick={() => navigate(tab === "rent" ? "/search" : "/marketplace")}
            className="mt-6 rounded-full bg-[#0B6B4F] hover:bg-[#065F46] text-white">
            {tab === "rent" ? "Browse cars to rent" : "Browse cars for sale"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ) : tab === "rent" ? (
        compare ? (
          <CompareTable items={items} onRemove={toggleSaved} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="saved-sales-grid">
          {sales.map((v) => <SaleCard key={v.id} v={v} />)}
        </div>
      )}
    </main>
  );
}
