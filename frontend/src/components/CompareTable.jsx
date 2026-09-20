import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPARE } from "@/content/pages/marketplace";
import { mileageLabel } from "@/lib/format";

export default function CompareTable({ items, onRemove }) {
  const navigate = useNavigate();

  const cheapest = items.length
    ? items.reduce((m, v) => (v.weekly_rent < m.weekly_rent ? v : m), items[0]).id
    : null;

  const rows = [
    { label: COMPARE.rows.rent, get: (v) => `£${v.weekly_rent}`, strong: true, num: true },
    { label: COMPARE.rows.deposit, get: (v) => `£${v.deposit}`, num: true },
    { label: COMPARE.rows.insurance, get: () => COMPARE.rows.insuranceValue },
    { label: COMPARE.rows.fuel, get: (v) => v.fuel, cap: true },
    { label: COMPARE.rows.transmission, get: (v) => v.transmission },
    { label: COMPARE.rows.seats, get: (v) => v.seats, num: true },
    { label: COMPARE.rows.mileage, get: (v) => mileageLabel(v.mileage_allowance, true), num: true },
    { label: COMPARE.rows.area, get: (v) => `${v.borough}${v.city ? `, ${v.city}` : ""}` },
  ];

  return (
    <div className="overflow-x-auto overscroll-x-contain rounded-lg border border-line" data-testid="compare-table">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface p-4 text-left align-bottom w-40" />
            {items.map((v) => (
              <th key={v.id} className={`p-4 align-bottom border-l border-line min-w-[220px] ${cheapest === v.id ? "bg-green-soft" : ""}`}>
                <div className="relative">
                  <button
                    onClick={() => onRemove(v.id)}
                    data-testid={`compare-remove-${v.id}`}
                    className="pressable absolute -top-1 -right-1 w-7 h-7 rounded-md bg-surface border border-line-strong grid place-items-center"
                    aria-label={`Remove ${v.make} ${v.model} from comparison`}
                  >
                    <X className="w-3.5 h-3.5 text-ink-2" strokeWidth={1.75} />
                  </button>
                  <div
                    className="aspect-[16/11] rounded-lg overflow-hidden bg-surface-2 mb-3 cursor-pointer zoom-media"
                    onClick={() => navigate(`/vehicle/${v.id}`)}
                  >
                    <img src={v.photos[0]} alt={`${v.make} ${v.model}`} data-zoom className="w-full h-full object-cover" />
                  </div>
                  <div className="font-heading font-bold text-ink leading-snug">{v.make} {v.model}</div>
                  <div className="text-[12.5px] text-ink-3 capitalize">{v.year}, {v.colour}</div>
                  <div className="mt-2 h-6">
                    {cheapest === v.id && (
                      <span className="inline-block text-[11px] font-semibold text-green bg-green-soft rounded-md px-2 py-0.5">
                        {COMPARE.lowestRent}
                      </span>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <td className="sticky left-0 z-10 bg-surface p-4 text-[13px] font-medium text-ink-3">{r.label}</td>
              {items.map((v) => (
                <td
                  key={v.id}
                  data-testid={`compare-cell-${v.id}`}
                  className={`p-3.5 border-l border-line text-[14px] ${r.cap ? "capitalize" : ""} ${r.num ? "tabular" : ""} ${r.strong ? "font-heading font-extrabold text-green text-[16px]" : "text-ink"} ${cheapest === v.id ? "bg-green-soft/40" : ""}`}
                >
                  {r.get(v)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-line">
            <td className="sticky left-0 z-10 bg-surface p-4" />
            {items.map((v) => (
              <td key={v.id} className={`p-4 border-l border-line ${cheapest === v.id ? "bg-green-soft/40" : ""}`}>
                <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid={`compare-apply-${v.id}`} size="sm" className="w-full">
                  {COMPARE.applyCta}
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
