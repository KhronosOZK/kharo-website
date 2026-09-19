import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import CityInterestForm from "@/components/CityInterestForm";
import { RevealGroup, RevealItem, Enter } from "@/components/Reveal";
import { useSeo } from "@/lib/seo";

export default function RequestCar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const city = params.get("city") || "London";

  useSeo({
    title: `Request a car in ${city} · Kharo`,
    description: `Tell us you're looking for a private hire car in ${city} and we'll email you the moment matching listings go live there.`,
  });

  return (
    <main className="min-h-page bg-bone wrap-narrow py-section">
      <button onClick={() => navigate(-1)} className="pressable inline-flex items-center gap-1.5 text-ink-2 hover:text-ink text-[14px]" data-testid="request-back">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Back to results
      </button>

      <RevealGroup className="mt-8">
        <RevealItem>
          <Enter as="p" className="eyebrow flex items-center gap-1.5"><Search className="w-3.5 h-3.5" strokeWidth={1.75} /> Tell us what you want</Enter>
          <Enter as="h1" delay={0.04} className="mt-3 text-h1 font-heading font-extrabold text-ink">Can't find the right car in {city}?</Enter>
          <Enter as="p" delay={0.08} className="mt-4 text-lead text-ink-2 max-w-[46ch]">Describe exactly what you are after. We will match you the moment it comes up, and your request tells our rental partners what drivers in {city} actually want.</Enter>
        </RevealItem>
        <RevealItem className="mt-8 panel rounded-2xl p-6 sm:p-8">
          <CityInterestForm city={city} mode="request" compact />
        </RevealItem>
      </RevealGroup>
    </main>
  );
}
