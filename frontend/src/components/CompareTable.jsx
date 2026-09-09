import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function CompareTable({ items, onRemove }) {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState({});

  useEffect(() => {
    items.forEach((v) => {
      if (quotes[v.id] !== undefined) return;
      api.post("/quote", { listing_id: v.id })
        .then((r) => setQuotes((q) => ({ ...q, [v.id]: r.data.cheapest_weekly })))
        .catch(() => setQuotes((q) => ({ ...q, [v.id]: null })));
    });
  }, [items.map((v) => v.id).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const allIn = (v) => v.weekly_rent + (quotes[v.id] || 0) + (v.breakdown_included ? 0 : 8);
  const cheapest = items.length ? items.reduce((m, v) => (allIn(v) < allIn(m) ? v : m), items[0]).id : null;

  const rows = [
    { label: "Weekly rent", get: (v) => `£${v.weekly_rent}` },
    { label: "Insurance (indicative)", get: (v) => (quotes[v.id] == null ? "…" : `£${quotes[v.id].toFixed(2)}`) },
    { label: "Breakdown cover", get: (v) => (v.breakdown_included ? "Included" : "£8.00") },
    { label: "All-in per week", get: (v) => `£${allIn(v).toFixed(2)}`, strong: true },
    { label: "Deposit (refundable)", get: (v) => `£${v.deposit}` },
    { label: "Fuel", get: (v) => v.fuel, cap: true },
    { label: "Seats", get: (v) => v.seats },
    { label: "Weekly mileage", get: (v) => `${v.mileage_allowance} mi` },
    { label: "Area", get: (v) => `${v.borough}${v.city && v.city !== "London" ? `, ${v.city}` : ""}` },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200 bg-white" data-testid="compare-table">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white p-4 text-left align-bottom w-40" />
            {items.map((v) => (
              <th key={v.id} className={`p-4 align-bottom border-l border-slate-100 min-w-[220px] ${cheapest === v.id ? "bg-emerald-50/60" : ""}`}>
                <div className="relative">
                  <button onClick={() => onRemove(v.id)} data-testid={`compare-remove-${v.id}`}
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center hover:bg-slate-50">
                    <X className="w-3.5 h-3.5 text-[#3B4A44]" />
                  </button>
                  <div className="aspect-[16/11] rounded-xl overflow-hidden bg-[#EFEDE8] mb-3 cursor-pointer" onClick={() => navigate(`/vehicle/${v.id}`)}>
                    <img src={v.photos[0]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-heading font-bold text-[#1A2E25] leading-snug">{v.make} {v.model}</div>
                  <div className="text-[12.5px] text-[#7A857F] capitalize">{v.year} · {v.colour}</div>
                  <div className="mt-2 h-6">{cheapest === v.id && <span className="inline-block text-[11px] font-semibold text-[#0B6B4F] bg-emerald-100 rounded-full px-2 py-0.5">Best all-in price</span>}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-slate-100">
              <td className="sticky left-0 z-10 bg-white p-4 text-[13px] font-medium text-[#64748B]">{r.label}</td>
              {items.map((v) => (
                <td key={v.id} data-testid={`compare-cell-${v.id}`}
                  className={`p-4 border-l border-slate-100 text-[14px] ${r.cap ? "capitalize" : ""} ${r.strong ? "font-heading font-extrabold text-[#0B6B4F] text-[16px]" : "text-[#1A2E25]"} ${cheapest === v.id ? "bg-emerald-50/40" : ""}`}>
                  {r.get(v)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-slate-100">
            <td className="sticky left-0 z-10 bg-white p-4" />
            {items.map((v) => (
              <td key={v.id} className={`p-4 border-l border-slate-100 ${cheapest === v.id ? "bg-emerald-50/40" : ""}`}>
                <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid={`compare-apply-${v.id}`}
                  className="w-full rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white text-[13px] h-9">Apply</Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
