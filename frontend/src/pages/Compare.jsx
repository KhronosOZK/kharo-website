import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Columns3, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CompareTable from "@/components/CompareTable";
import { Button } from "@/components/ui/button";

export default function Compare() {
  const { compare, toggleCompare, clearCompare } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  useEffect(() => { api.get("/listings").then((r) => setAll(r.data)); }, []);
  const items = all.filter((v) => compare.includes(v.id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center"><Columns3 className="w-6 h-6 text-[#0B6B4F]" /></div>
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Compare cars</h1>
            <p className="text-[#64748B]">{items.length} car{items.length !== 1 ? "s" : ""} side by side</p>
          </div>
        </div>
        {items.length > 0 && (
          <Button onClick={clearCompare} variant="outline" data-testid="compare-clear" className="rounded-full border-slate-200">Clear all</Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <Columns3 className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <h2 className="font-heading font-bold text-xl text-[#1A2E25] mt-4">Nothing to compare yet</h2>
          <p className="text-[#64748B] mt-2">Tick the Compare box on any car while you browse, then see them here side by side.</p>
          <Button onClick={() => navigate("/search")} className="mt-6 rounded-full bg-[#0B6B4F] hover:bg-[#065F46] text-white">Browse cars <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      ) : (
        <CompareTable items={items} onRemove={toggleCompare} />
      )}
    </main>
  );
}
