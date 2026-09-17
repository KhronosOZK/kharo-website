import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Columns3, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import VehicleCard from "@/components/VehicleCard";
import CompareTable from "@/components/CompareTable";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

export default function Saved() {
  const { saved, toggleSaved } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [compare, setCompare] = useState(false);

  useSeo({ title: "Saved vehicles · Kharo", noindex: true });

  useEffect(() => { api.get("/listings").then((r) => setAll(r.data)).catch(() => {}); }, []);

  const items = all.filter((v) => saved.includes(v.id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#0B6B4F]" strokeWidth={1.5} />
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-[#0A0A0A]">Saved vehicles</h1>
            <p className="text-[#888]">{items.length} rental listing{items.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>
        {items.length >= 2 && (
          <Button onClick={() => setCompare((c) => !c)} data-testid="compare-toggle"
            className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">
            {compare ? <><X className="w-4 h-4 mr-2" /> Back to grid</> : <><Columns3 className="w-4 h-4 mr-2" /> Compare {items.length} cars</>}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-[#EBEBEB] rounded-3xl p-12 sm:p-16 text-center">
          <Heart className="w-12 h-12 text-[#0B6B4F] mx-auto" strokeWidth={1.5} />
          <h2 className="font-heading font-bold text-xl text-[#0A0A0A] mt-5">No saved rental cars yet</h2>
          <p className="text-[#888] mt-2 max-w-md mx-auto">
            Tap the heart on any rental listing to save it here, then compare the full weekly cost side by side.
          </p>
          <Button onClick={() => navigate("/search")}
            className="mt-6 h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">
            Browse cars to rent <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ) : compare ? (
        <CompareTable items={items} onRemove={toggleSaved} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((v) => <VehicleCard key={v.id} vehicle={v} />)}</div>
      )}
    </main>
  );
}
