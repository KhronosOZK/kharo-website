import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Columns3, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getMockById, isPreviewId } from "@/data/mockListings";
import VehicleCard from "@/components/VehicleCard";
import CompareTable from "@/components/CompareTable";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { SAVED } from "@/content/pages/marketplace";

export default function Saved() {
  const { saved, toggleSaved } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [compare, setCompare] = useState(false);

  useSeo({ title: SAVED.seo.title, noindex: true });

  // The preview inventory lives in the mock dataset, so a saved KH- id
  // has to be resolved locally rather than looked up on the live API, which
  // only knows about real listings once operators start listing.
  const realIds = saved.filter((id) => !isPreviewId(id));

  useEffect(() => {
    if (!realIds.length) { setAll([]); return; }
    api.get("/listings").then((r) => setAll(r.data)).catch(() => setAll([]));
  }, [realIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const mockItems = saved.filter(isPreviewId).map(getMockById).filter(Boolean);
  const items = [...mockItems, ...all.filter((v) => saved.includes(v.id))];

  return (
    <main className="min-h-page bg-bone">
      <div className="wrap py-8">
        <div className="flex items-end justify-between gap-3 mb-8 flex-wrap">
          <div>
            <h1 className="text-h1 font-heading font-extrabold text-ink">{SAVED.heading}</h1>
            <p className="mt-1.5 text-[14.5px] text-ink-3">{SAVED.count(items.length)}</p>
          </div>
          {items.length >= 2 && (
            <Button onClick={() => setCompare((c) => !c)} variant={compare ? "outline" : "default"} data-testid="compare-toggle">
              {compare ? <><X className="w-4 h-4" strokeWidth={1.75} /> {SAVED.backToGrid}</> : <><Columns3 className="w-4 h-4" strokeWidth={1.75} /> {SAVED.compareCta(items.length)}</>}
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-14 hairline pt-10 max-w-md">
            <h2 className="text-h3 font-heading font-bold text-ink">{SAVED.empty.heading}</h2>
            <p className="mt-2.5 text-[15px] text-ink-2 leading-relaxed">{SAVED.empty.body}</p>
            <Button onClick={() => navigate("/search")} className="mt-6">{SAVED.empty.cta}</Button>
          </div>
        ) : compare ? (
          <CompareTable items={items} onRemove={toggleSaved} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
            {items.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        )}
      </div>
    </main>
  );
}
