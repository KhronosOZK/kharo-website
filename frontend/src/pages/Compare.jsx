import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getMockById, isPreviewId } from "@/data/mockListings";
import CompareTable from "@/components/CompareTable";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { COMPARE } from "@/content/pages/marketplace";

export default function Compare() {
  const { compare, toggleCompare, clearCompare } = useAuth();
  const navigate = useNavigate();

  // Personalised to the visitor's own in-progress comparison list, so it has
  // no unique crawlable content of its own, the same treatment as /saved.
  useSeo({ title: COMPARE.seo.title, noindex: true });

  const [all, setAll] = useState([]);
  const realIds = compare.filter((id) => !isPreviewId(id));

  useEffect(() => {
    if (!realIds.length) { setAll([]); return; }
    api.get("/listings").then((r) => setAll(r.data)).catch(() => setAll([]));
  }, [realIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview inventory lives in the mock dataset, not the live API, so a
  // KH- id has to be resolved locally rather than looked up server side.
  const mockItems = compare.filter(isPreviewId).map(getMockById).filter(Boolean);
  const items = [...mockItems, ...all.filter((v) => compare.includes(v.id))];

  return (
    <main className="min-h-page bg-bone">
      <div className="wrap py-8">
        <div className="flex items-end justify-between gap-3 mb-8 flex-wrap">
          <div>
            <h1 className="text-h1 font-heading font-extrabold text-ink">{COMPARE.heading}</h1>
            <p className="mt-1.5 text-[15px] text-ink-3">{COMPARE.count(items.length)}</p>
          </div>
          {items.length > 0 && (
            <Button onClick={clearCompare} variant="outline" data-testid="compare-clear">{COMPARE.clearAll}</Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-14 hairline pt-10 max-w-md">
            <h2 className="text-h3 font-heading font-bold text-ink">{COMPARE.empty.heading}</h2>
            <p className="mt-2.5 text-[15px] text-ink-2 leading-relaxed">{COMPARE.empty.body}</p>
            <Button onClick={() => navigate("/search")} className="mt-6">{COMPARE.empty.cta}</Button>
          </div>
        ) : (
          <CompareTable items={items} onRemove={toggleCompare} />
        )}
      </div>
    </main>
  );
}
